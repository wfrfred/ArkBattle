import assert from "node:assert/strict";
import { test } from "node:test";
import { createWithState, chooseTargets } from "../../dist/content/actions/attack.js";
import { select, first, hpRatio } from "../../dist/core/battle/targeting/index.js";
import { battle as createBattle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { healFree } from "../../dist/content/effects/protection.js";
import { random } from "../../dist/core/battle/targeting/selector.js";
import { getUnit } from "../helpers/unit.js";
import { ref } from "../../dist/core/unit/query.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { and, damage, healing, range } from "../../dist/core/battle/targeting/filter.js";
import { unit, battle } from "../helpers/action-fixture.js";

function definition(groups, prepare = state => ({ state, value: {} })) {
    return createWithState({
        id: "random-attack",
        intervalTicks: 10,
        windupTicks: 3,
        triggerBindingId: "primary",
        targetGroups: groups,
        initialize: state => ({ state, value: {} }),
        prepare,
    });
}

const group = (id, selector = random(1), filter = (_battle, request, target) => target.id !== request.source.id) => ({
    id,
    targeting: { purposes: ["DAMAGE"], filter, selector },
    operations: [{ type: "DAMAGE", power: 7, damageType: "TRUE" }],
});

test("attack target groups and prepare callbacks receive the RNG state produced by earlier selections", () => {
    let observed;
    const primary = group("primary");
    const secondary = group("secondary", random(2));
    const action = definition([primary, secondary], state => {
        observed = state.execution.rngState;
        return { state, value: { selectedAt: observed } };
    });
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2), unit(3));
    const seeded = { ...initial, execution: { ...initial.execution, rngState: 73 } };
    const first = select(seeded, { ...primary.targeting, source: ref(source) });
    const second = select(first.state, { ...secondary.targeting, source: ref(source) });
    const started = actions.start(seeded, actions.ref(ref(source), action));

    assert.equal(started.value.type, "STARTED");
    const running = actions.getExecution(started.state, started.value.ref);
    assert.deepEqual(running.execution.state.bindings, { primary: first.value, secondary: second.value });
    assert.equal(started.state.execution.rngState, second.state.execution.rngState);
    assert.equal(observed, second.state.execution.rngState);
    assert.equal(running.execution.state.data.selectedAt, observed);
    assert.equal(seeded.execution.rngState, 73);
});

test("an attack rejected for an empty trigger binding retains completed target-selection state", () => {
    const primary = group("primary", random(1), () => false);
    const secondary = group("secondary");
    const action = definition([primary, secondary], () => assert.fail("a rejected attack must not start"));
    const source = unit(0, { action });
    const initial = battle(source, unit(1), unit(2));
    const selected = chooseTargets(initial, ref(source), action.attack);
    const started = actions.start(initial, actions.ref(ref(source), action));

    assert.deepEqual(selected.value.primary, []);
    assert.equal(selected.value.secondary.length, 1);
    assert.notEqual(selected.state.execution.rngState, initial.execution.rngState);
    assert.deepEqual(started.value, { type: "REJECTED", reason: "CONDITION" });
    assert.equal(started.state.execution.rngState, selected.state.execution.rngState);
    assert.equal(getUnit(started.state, 0).action.actions.values().filter(self => self.execution !== null).toArray().length, 0);
});

test("standard damage and healing filters exclude departing and spatially absent candidates explicitly", () => {
    const source = unit(0);
    const base = unit(1);
    const ally = unit(2, { side: "ALLY" });
    const initial = battle(source, base, ally);
    const request = { source: ref(source), purposes: [], filter: () => true, selector: random(1) };

    for (const [filter, target] of [[damage, base], [healing, { ...ally, vitality: { ...ally.vitality, hp: 50 } }]]) {
        assert.equal(filter(initial, request, target), true);
        assert.equal(filter(initial, request, { ...target, lifecycle: "LEAVING" }), false);
        assert.equal(filter(initial, request, { ...target, spatialPresence: { present: false } }), false);
    }
});

test("targeting only requires a hitbox when a geometric range filter is composed", () => {
    const source = unit(0);
    const target = unit(1, { hitbox: undefined });
    const initial = battle(source, target);
    const request = { source: ref(source), purposes: ["DAMAGE"], filter: damage, selector: random(1) };

    assert.deepEqual(select(initial, request).value, [ref(target)]);
    assert.deepEqual(select(initial, {
        ...request,
        filter: and(damage, range([{ type: "CIRCLE", offset: [0, 0], radius: 10 }])),
    }).value, []);
});

test("bound healing survives later selection restrictions and follow-ups keep their BINDING and SOURCE receivers", () => {
    const patient = {
        id: "patient", hooks: Hooks.empty(), targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: "ALLY" },
    };
    const recipients = {
        purposes: ["HEAL"],
        filter: and(healing, (_state, request, target) => target.id !== request.source.id),
        selector: first(1, hpRatio),
    };
    let selected;
    const program = createWithState({
        id: "bound-healing", intervalTicks: 1, triggerBindingId: "primary",
        initialize: state => ({ state, value: {} }),
        prepare(state) {
            return { state: effects.install(state, selected, healFree).state, value: {} };
        },
        targetGroups: [{ id: "primary", targeting: recipients, operations: [{ type: "HEAL", power: 20 }] }],
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
        const request = { source: null, target: ref(get(state, id)), parameters: { type: "TRUE", attack: { power: amount, multiplier: 1, addition: 0 } } };
        state = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request)).state;
    }
    const source = ref(get(state, 0));
    const query = { ...recipients, source };
    [selected] = select(state, query).value;
    assert.equal(selected.id, 1);
    const started = actions.start(state, actions.ref(source, program));
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(select(started.state, query).value.map(target => target.id), [2]);
    state = actions.advance(started.state, started.value.ref);
    assert.equal(get(state, 0).vitality.hp, 75);
    assert.equal(get(state, 1).vitality.hp, 55);
    assert.equal(get(state, 2).vitality.hp, 40);
});
