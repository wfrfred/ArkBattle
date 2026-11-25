import { attribute, vitality } from "../../helpers/attribute.js";
// Contract: [action](../../../docs/architecture/action.md#8-普通攻击释放-hook-与移动).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../../dist/core/hook.js";
import { createRng } from "../../../dist/core/common/rng.js";
import { topK } from "../../../dist/core/common/collection/order.js";
import { create, createWithState, faceTarget } from "../../../dist/content/actions/attack.js";
import * as targeting from "../../../dist/core/battle/targeting/index.js";
import { hasTargetable } from "../../../dist/core/unit/capability/targetable/capability.js";
import * as units from "../../../dist/core/unit/query.js";
import * as actions from "../../../dist/core/unit/capability/action/index.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as effects from "../../../dist/core/effect/index.js";
import { healFree } from "../../../dist/core/effects/protection.js";
import { battle as createBattle, get } from "../../helpers/battle.js";
import { unit, battle } from "../../helpers/action-fixture.js";
import * as facing from "../../../dist/core/unit/capability/facing/index.js";
import { actionCapability } from "../../helpers/actions.js";
import { setSpeedContribution } from "../../../dist/core/unit/capability/action/index.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";
import { update } from "../../../dist/core/unit/operations.js";

function definition(groups, prepare = state => ({ state, value: {} })) {
    return createWithState({
        id: "random-attack", period: { type: "FIXED", ticks: 10 }, timing: { type: "FIXED", windupTicks: 3, recoveryTicks: 0 },
        triggerBindingId: "primary", targetGroups: groups,
        initialize: state => ({ state, value: {} }), prepare,
    });
}

function group(id, count = 1, accepts = () => true) {
    return {
        id,
        select(state, source) {
            const rng = createRng(state.execution.rngState);
            const candidates = units.all(state).filter(hasTargetable)
                .filter(target => target.ref !== source && accepts(target));
            const selected = rng.sample(candidates, count).map(units.ref);
            return {
                state: { ...state, execution: { ...state.execution, rngState: rng.state() } },
                value: selected,
            };
        },
        operations: [{ type: "DAMAGE", attackType: "NORMAL", applyWay: "MELEE", power: 7, damageType: "TRUE" }],
    };
}

test("an attack turns once at its started program, before output, without turning again on release", () => {
    const program = create({
        id: "facing-attack", period: { type: "FIXED", ticks: 10 }, timing: { type: "FIXED", windupTicks: 2, recoveryTicks: 1 },
        triggerBindingId: "primary", onStart: faceTarget,
        targetGroups: [{
            id: "primary", operations: [{ type: "DAMAGE", attackType: "NORMAL", applyWay: "MELEE", power: 7, damageType: "TRUE" }],
            select: state => ({ state, value: [units.ref(get(state, 1))] }),
        }],
    });
    let state = createBattle([
        { definition: { id: "attacker", hooks: Hooks.empty(), facing: { restrictions: [] },
            action: actionCapability(program),
        }, position: [3, 1], initial: { facing: { direction: "RIGHT" } } },
        { definition: { id: "target", hooks: Hooks.empty(),
            vitality: vitality(100),
        }, position: [1, 1] },
    ]);
    const host = units.ref(get(state, 0));
    const started = actions.start(state, actions.ref(host.get(state).action.actions.get(program)));
    assert.notEqual(started.value, null);
    assert.equal(get(started.state, 0).facing.direction, "RIGHT");
    state = actions.advance(started.state, started.value);
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.equal(get(state, 1).vitality.health.hp, 100);

    state = update({ ...state, tick: 1 }, host, setSpeedContribution({
        id: "haste", value: [modifier({ addition: 100 })],
    }));
    state = facing.turn(state, host, "RIGHT");
    state = actions.advance({ ...state, tick: 1 }, started.value);
    assert.equal(get(state, 0).facing.direction, "RIGHT");
    state = actions.advance({ ...state, tick: 2 }, started.value);
    assert.equal(get(state, 0).facing.direction, "RIGHT");
    assert.equal(get(state, 1).vitality.health.hp, 93);
    assert.notEqual(started.value.get(state), undefined);
    state = actions.advance({ ...state, tick: 3 }, started.value);
    assert.equal(started.value.get(state), undefined);
});

test("attack selection groups and prepare receive the state produced by earlier groups", () => {
    let observed;
    const primary = group("primary");
    const secondary = group("secondary", 2);
    const action = definition([primary, secondary], state => {
        observed = state.execution.rngState;
        return { state, value: {} };
    });
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2), unit(3));
    const first = primary.select(initial, units.ref(source));
    const second = secondary.select(first.state, units.ref(source));
    const started = actions.start(initial, actions.ref(source.action.actions.get(action)));

    assert.notEqual(started.value, null);
    assert.equal(started.state.execution.rngState, second.state.execution.rngState);
    assert.equal(observed, second.state.execution.rngState);
    let state = actions.advance(started.state, started.value);
    state = actions.advance({ ...state, tick: 3 }, started.value);
    const receivers = [...first.value, ...second.value].map(reference => reference.id);
    assert.deepEqual(
        [1, 2, 3].map(id => get(state, id).vitality.health.hp),
        [1, 2, 3].map(id => 100 - 7 * receivers.filter(receiver => receiver === id).length),
    );
});

test("an empty trigger binding rejects the attack without losing later completed selection state", () => {
    const secondary = group("secondary");
    const action = definition([group("primary", 1, () => false), secondary],
        () => assert.fail("a rejected attack must not start"));
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2));
    const selected = secondary.select(initial, units.ref(source));
    const started = actions.start(initial, actions.ref(source.action.actions.get(action)));

    assert.equal(started.value, null);
    assert.equal(started.state.execution.rngState, selected.state.execution.rngState);
});

test("bound healing keeps its receivers when a later selection restriction would choose another patient", () => {
    const patient = {
        id: "patient", hooks: Hooks.empty(), targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions: [] },
        vitality: vitality(100), classification: { type: "OPERATOR", side: "ALLY", profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] },
    };
    const recipients = (state, source) => ({
        state,
        value: topK(units.all(state).filter(hasTargetable)
            .filter(targeting.healing(source.get(state))(state))
            .filter(target => target.ref !== source), 1, targeting.hpRatio).map(units.ref),
    });
    let selected;
    const program = createWithState({
        id: "bound-healing", period: { type: "FIXED", ticks: 1 }, timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 }, triggerBindingId: "primary",
        initialize: state => ({ state, value: {} }),
        prepare(state) {
            return { state: effects.install(state, selected, healFree).state, value: {} };
        },
        targetGroups: [{ id: "primary", select: recipients, operations: [{ type: "HEAL", power: 20 }] }],
        followUps: [
            { receiver: { type: "BINDING", bindingId: "primary" }, operation: { type: "HEAL", power: 5 } },
        ],
    });
    let state = createBattle([
        { definition: {
            ...patient, id: "medic",
            action: actionCapability(program),
        }, position: [1, 1] },
        { definition: patient, position: [2, 1] },
        { definition: patient, position: [3, 1] },
    ]);
    assert.equal(actions.getApplyWay(get(state, 0)), "NONE");
    assert.equal(actions.getApplyWay(get(state, 1)), "NONE");
    for (const [id, amount] of [[1, 70], [2, 60]]) {
        const request = {
            source: null, target: units.ref(get(state, id)),
            attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: amount, multiplier: 1, addition: 0 } },
        };
        state = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request)).state;
    }
    const source = units.ref(get(state, 0));
    [selected] = recipients(state, source).value;
    assert.equal(selected.id, 1);
    const started = actions.start(state, actions.ref(source.get(state).action.actions.get(program)));
    assert.notEqual(started.value, null);
    assert.deepEqual(recipients(started.state, source).value.map(target => target.id), [2]);
    state = actions.advance(started.state, started.value);
    assert.equal(get(state, 1).vitality.health.hp, 55);
    assert.equal(get(state, 2).vitality.health.hp, 40);
});

function timedProgram(timing) {
    return create({
        id: "timed-attack", period: { type: "ATTACK_SPEED" }, timing,
        triggerBindingId: "primary", targetGroups: [group("primary")],
    });
}

function begin(program, intervalTicks = 30, speed = 100) {
    const actor = unit(0, { action: { ...actionCapability(program), interval: attribute(intervalTicks), speed: attribute(speed, 20) } });
    const source = units.ref(actor);
    const reference = actions.ref(actor.action.actions.get(program));
    const started = actions.start(battle(actor, unit(1)), reference);
    assert.notEqual(started.value, null);
    return { source, reference, execution: started.value, state: actions.advance(started.state, started.value) };
}

function runTo(state, execution, untilTick) {
    for (let tick = state.tick + 1; tick <= untilTick; tick++) {
        state = actions.advance({ ...state, tick }, execution);
    }
    return state;
}

test("animation scale bounds separate attack release, execution occupancy and cooldown", () => {
    const timing = {
        type: "ATTACK_SPEED", beginTicks: 0, durationTicks: 100, releaseTicks: 40,
        minScale: 0.1, maxScale: 1,
    };
    for (const { speed, release, finish, ready } of [
        { speed: 20, release: 40, finish: 100, ready: 150 },
        { speed: 600, release: 4, finish: 10, ready: 5 },
    ]) {
        const started = begin(timedProgram(timing), 30, speed);
        let state = runTo(started.state, started.execution, release - 1);
        assert.equal(get(state, 1).vitality.health.hp, 100);
        assert.equal(started.reference.get(state).cooldown.readyAtTick, ready);
        state = runTo(state, started.execution, release);
        assert.equal(get(state, 1).vitality.health.hp, 93);
        state = runTo(state, started.execution, finish - 1);
        assert.notEqual(started.execution.get(state), undefined);
        state = runTo(state, started.execution, finish);
        assert.equal(started.execution.get(state), undefined);
    }
});

test("speed changes update cooldown immediately while entered attack waits remain sampled and later rounds resample", () => {
    const started = begin(timedProgram({
        type: "ATTACK_SPEED", beginTicks: 0, durationTicks: 30, releaseTicks: 12,
        minScale: 0, maxScale: null,
    }));
    let state = runTo(started.state, started.execution, 5);
    state = update(state, started.source, setSpeedContribution({
        id: "haste", value: [modifier({ addition: 100 })],
    }));
    assert.equal(started.reference.get(state).cooldown.readyAtTick, 17.5);
    state = runTo(state, started.execution, 11);
    assert.equal(get(state, 1).vitality.health.hp, 100);
    state = runTo(state, started.execution, 12);
    assert.equal(get(state, 1).vitality.health.hp, 93);
    state = runTo(state, started.execution, 29);
    assert.notEqual(started.execution.get(state), undefined);
    state = runTo(state, started.execution, 30);
    assert.equal(started.execution.get(state), undefined);

    const second = actions.start(state, started.reference);
    state = actions.advance(second.state, second.value);
    state = runTo(state, second.value, 35);
    assert.equal(get(state, 1).vitality.health.hp, 93);
    state = runTo(state, second.value, 36);
    assert.equal(get(state, 1).vitality.health.hp, 86);
    state = runTo(state, second.value, 44);
    assert.notEqual(second.value.get(state), undefined);
    state = runTo(state, second.value, 45);
    assert.equal(second.value.get(state), undefined);
});

test("Begin retains its entered wait and cached budget while the later main segment samples current speed", () => {
    for (const { speedChange, release, finish } of [
        { speedChange: 100, release: 15, finish: 30 },
        { speedChange: -80, release: 30, finish: 31 },
    ]) {
        const started = begin(timedProgram({
            type: "ATTACK_SPEED", beginTicks: 10, durationTicks: 20, releaseTicks: 10,
            minScale: 0, maxScale: null,
        }));
        let state = runTo(started.state, started.execution, 5);
        state = update(state, started.source, setSpeedContribution({
            id: "changed-speed", value: [modifier({ addition: speedChange })],
        }));
        state = runTo(state, started.execution, release - 1);
        assert.equal(get(state, 1).vitality.health.hp, 100);
        state = runTo(state, started.execution, release);
        assert.equal(get(state, 1).vitality.health.hp, 93);
        state = runTo(state, started.execution, finish - 1);
        assert.notEqual(started.execution.get(state), undefined);
        state = runTo(state, started.execution, finish);
        assert.equal(started.execution.get(state), undefined);
    }
});
