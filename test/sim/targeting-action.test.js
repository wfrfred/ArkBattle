import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { createRng } from "../../dist/core/common/rng.js";
import { topK } from "../../dist/core/common/collection.js";
import { createWithState, chooseTargets } from "../../dist/content/actions/attack.js";
import * as targeting from "../../dist/core/battle/targeting/index.js";
import { hasTargetable } from "../../dist/core/unit/capability/targetable/capability.js";
import * as units from "../../dist/core/unit/query.js";
import * as actions from "../../dist/core/unit/action/index.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { healFree } from "../../dist/core/effects/protection.js";
import { battle as createBattle, get } from "../helpers/battle.js";
import { unit, battle } from "../helpers/action-fixture.js";

function definition(groups, prepare = state => ({ state, value: {} })) {
    return createWithState({
        id: "random-attack", intervalTicks: 10, windupTicks: 3,
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
                .filter(target => target.id !== source.id && accepts(target));
            const selected = rng.sample(candidates, count).map(units.ref);
            return {
                state: { ...state, execution: { ...state.execution, rngState: rng.state() } },
                value: selected,
            };
        },
        operations: [{ type: "DAMAGE", power: 7, damageType: "TRUE" }],
    };
}

test("attack selection groups and prepare receive the state produced by earlier groups", () => {
    let observed;
    const primary = group("primary");
    const secondary = group("secondary", 2);
    const action = definition([primary, secondary], state => {
        observed = state.execution.rngState;
        return { state, value: { selectedAt: observed } };
    });
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2), unit(3));
    const first = primary.select(initial, units.ref(source));
    const second = secondary.select(first.state, units.ref(source));
    const started = actions.start(initial, actions.ref(units.ref(source), action));

    assert.equal(started.value.type, "STARTED");
    const running = actions.getExecution(started.state, started.value.ref);
    assert.deepEqual(running.execution.state.bindings, { primary: first.value, secondary: second.value });
    assert.equal(started.state.execution.rngState, second.state.execution.rngState);
    assert.equal(observed, second.state.execution.rngState);
    assert.equal(running.execution.state.data.selectedAt, observed);
});

test("an empty trigger binding rejects the attack without losing later completed selection state", () => {
    const action = definition([group("primary", 1, () => false), group("secondary")],
        () => assert.fail("a rejected attack must not start"));
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2));
    const selected = chooseTargets(initial, units.ref(source), action.attack);
    const started = actions.start(initial, actions.ref(units.ref(source), action));

    assert.deepEqual(selected.value.primary, []);
    assert.equal(selected.value.secondary.length, 1);
    assert.notEqual(selected.state.execution.rngState, initial.execution.rngState);
    assert.deepEqual(started.value, { type: "REJECTED", reason: "CONDITION" });
    assert.equal(started.state.execution.rngState, selected.state.execution.rngState);
    assert.equal(units.get(started.state, units.ref(source)).action.actions.values()
        .some(self => self.execution !== null), false);
});

test("bound healing keeps its receivers when a later selection restriction would choose another patient", () => {
    const patient = {
        id: "patient", hooks: Hooks.empty(), targetable: { taunt: 0, restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: "ALLY" },
    };
    const recipients = (state, source) => ({
        state,
        value: topK(units.all(state).filter(hasTargetable)
            .filter(targeting.healing(state, units.get(state, source)))
            .filter(target => target.id !== source.id), 1, targeting.hpRatio).map(units.ref),
    });
    let selected;
    const program = createWithState({
        id: "bound-healing", intervalTicks: 1, triggerBindingId: "primary",
        initialize: state => ({ state, value: {} }),
        prepare(state) {
            return { state: effects.install(state, selected, healFree).state, value: {} };
        },
        targetGroups: [{ id: "primary", select: recipients, operations: [{ type: "HEAL", power: 20 }] }],
        followUps: [
            { receiver: { type: "BINDING", bindingId: "primary" }, operation: { type: "HEAL", power: 5 } },
            { receiver: { type: "SOURCE" }, operation: { type: "HEAL", power: 15 } },
        ],
    });
    let state = createBattle([
        { definition: {
            ...patient, id: "medic",
            action: { initialize: state => actions.createActions(state, actions.create(program)) },
        }, position: [1, 1] },
        { definition: patient, position: [2, 1] },
        { definition: patient, position: [3, 1] },
    ]);
    for (const [id, amount] of [[0, 40], [1, 70], [2, 60]]) {
        const request = {
            source: null, target: units.ref(get(state, id)),
            parameters: { type: "TRUE", attack: { power: amount, multiplier: 1, addition: 0 } },
        };
        state = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request)).state;
    }
    const source = units.ref(get(state, 0));
    [selected] = recipients(state, source).value;
    assert.equal(selected.id, 1);
    const started = actions.start(state, actions.ref(source, program));
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(recipients(started.state, source).value.map(target => target.id), [2]);
    state = actions.advance(started.state, started.value.ref);
    assert.equal(get(state, 0).vitality.hp, 75);
    assert.equal(get(state, 1).vitality.hp, 55);
    assert.equal(get(state, 2).vitality.hp, 40);
});
