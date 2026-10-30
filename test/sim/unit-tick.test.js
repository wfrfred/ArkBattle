import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit, remove as removeUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { advance } from "../../dist/core/battle/unit.js";
import { initialize } from "../helpers/unit.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { install } from "../../dist/core/unit/effect/index.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { map, unit as combatUnit } from "../helpers/action-fixture.js";

const locomotion = {
    halfBodyWidth: 0, minSpeed: 0, speed: 0,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
};
const route = createRouteDefinition({
    pathMotionMode: "WALK", startPosition: [31, 0], endPosition: [31, 0],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0],
    checkpoints: [{ type: "WAIT_FOR_TICKS", durationTicks: 1000 }],
    allowDiagonalMove: false, visitEveryTileCenter: false,
    visitEveryNodeCenter: false, visitEveryCheckPoint: true,
});
const spawn = (definition, tick) => ({
    tick, definition, route, alwaysCheckCurrentPoint: true, notCountInTotal: false,
    timing: { waveStartedAtTick: tick, fragmentStartedAtTick: tick },
});

function unit(id, definition = {}) {
    return {
        ...initialize({ id, position: [id, 0], definition: { hooks: [],
            id: `tick-unit-${id}`, vitality: { maxHp: 100, defense: 0, resistance: 0 }, ...definition,
        } }),
        state: { phase: 0 },
    };
}

function runtime(definitions, spawns = []) {
    return initializeBattle({
        map,
        schedule: { type: "TIMELINE", spawns: [
            ...spawns,
            spawn({ hooks: [], spatialPresence: {}, id: "later", vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion }, 100),
        ] },
        initialUnits: definitions.map((definition, id) => ({ definition, position: [id, 0] })),
        predefines: [], initialMechanisms: [], maxTicks: 10, routeMoveMultiplier: 1, rngState: 123,
    });
}

test("Unit ticks pass the latest returned battle and preserve previous private state", () => {
    const trace = [];
    const first = unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(state, self) {
        assert.strictEqual(self, getUnit(state, self.id));
        state = updateUnit(state, [{ ...self, state: { phase: self.state.phase + 1 } }]);
        const other = getUnit(state, 1);
        return { state: updateUnit(state, [{ ...other, state: { phase: 7 } }]), value: undefined };
    } }] });
    const second = unit(1, { hooks: [{ id: "test/tick", stage: "tick", invoke(state, self) {
        assert.strictEqual(self, getUnit(state, self.id));
        trace.push([self.id, self.state.phase, getUnit(state, 0).state.phase]);
        return { state: updateUnit(state, [{ ...self, state: { phase: self.state.phase + 1 } }]), value: undefined };
    } }] });
    const before = createBattleState(fixtureBattlefieldState([first, second]));
    const after = advance(before);

    assert.deepEqual(trace, [[1, 7, 1]]);
    assert.equal(getUnit(after, 0).state.phase, 1);
    assert.equal(getUnit(after, 1).state.phase, 8);
    assert.equal(getUnit(before, 0), first);
    assert.equal(getUnit(before, 1), second);
    assert.deepEqual(first.state, { phase: 0 });
    assert.deepEqual(second.state, { phase: 0 });
});

test("Unit ticks skip departing or removed units and defer units created by a tick callback", () => {
    const trace = [];
    const created = unit(3, { hooks: [{ id: "test/tick", stage: "tick", invoke(state, self) { trace.push(self.id); return { state: state, value: undefined }; } }] });
    const first = unit(0, { hooks: [{ id: "test/tick", stage: "tick", invoke(state, self) {
        trace.push(self.id);
        if (getUnit(state, 1) === undefined) return { state: state, value: undefined };
        state = removeUnit(state, 1, "SCRIPT");
        state = updateUnit(state, [{ ...getUnit(state, 2), lifecycle: "LEAVING" }]);
        return { state: addUnit(state, created), value: undefined };
    } }] });
    const removed = unit(1, { hooks: [{ id: "test/tick", stage: "tick", invoke() { assert.fail("removed Unit tick"); } }] });
    const departing = unit(2, { hooks: [{ id: "test/tick", stage: "tick", invoke() { assert.fail("newly departing Unit tick"); } }] });
    const leaving = { ...unit(4, { hooks: [{ id: "test/tick", stage: "tick", invoke() { assert.fail("departing Unit tick"); } }] }), lifecycle: "LEAVING" };
    let state = createBattleState(fixtureBattlefieldState([first, removed, departing, leaving, unit(5)]));

    state = advance(state);
    assert.deepEqual(trace, [0]);
    assert.equal(getUnit(state, 3), created);
    state = advance({ ...state, tick: 1 });
    assert.deepEqual(trace, [0, 0, 3]);
});

test("Runtime advances Unit content once per Tick before Effect callbacks", () => {
    const trace = [];
    let original;
    const observer = { id: "phase-observer", initialize: () => ({}), onTick(state, self) {
        trace.push(["effect", state.tick, getUnit(state, self.host.id).state.phase]);
        return state;
    } };
    let battle = runtime([{
        id: "boss", vitality: { maxHp: 100, defense: 0, resistance: 0 },
        hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
            state = updateUnit(state, [{ ...self, state: { phase: 0 } }]);
            original = getUnit(state, self.id);
            return { state: install(state, unitRef(original), observer).state, value: undefined };
        } }, { id: "test/tick", stage: "tick", invoke(state, self) {
            assert.strictEqual(self, getUnit(state, self.id));
            const phase = self.state.phase + 1;
            trace.push(["unit", state.tick, phase]);
            return { state: updateUnit(state, [{
                ...self, state: { phase },
                vitality: { ...self.vitality, hp: self.vitality.hp - 5 },
            }]), value: undefined };
        } }],

    }]);
    const before = battle;
    battle = stepBattle(battle, []);
    const first = battle;
    battle = stepBattle(battle, []);

    assert.deepEqual(trace, [["unit", 0, 1], ["effect", 0, 1], ["unit", 1, 2], ["effect", 1, 2]]);
    assert.equal(unitQueries.all(before).toArray()[0].vitality.hp, 100);
    assert.equal(unitQueries.all(first).toArray()[0].vitality.hp, 95);
    assert.equal(unitQueries.all(battle).toArray()[0].vitality.hp, 90);
    assert.deepEqual(original.state, { phase: 0 });
});

test("Scheduled Units tick after entering without mandatory combat or movement capabilities", () => {
    const trace = [];
    const definition = {
        id: "scripted-spawn",
        hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) { trace.push(["enter", state.tick, self.id]); return { state: state, value: undefined }; } }, { id: "test/tick", stage: "tick", invoke(state, self) { trace.push(["tick", state.tick, self.id]); return { state: state, value: undefined }; } }],

    };
    let battle = runtime([], [spawn(definition, 0)]);
    battle = stepBattle(battle, []);
    battle = stepBattle(battle, []);

    assert.deepEqual(trace, [["enter", 0, 0], ["tick", 0, 0], ["tick", 1, 0]]);
    const [spawned] = unitQueries.all(battle).toArray();
    assert.equal(spawned.definition.hooks, definition.hooks);
    assert.equal("vitality" in spawned, false);
    assert.equal("locomotion" in spawned, false);
    assert.equal("spatialPresence" in spawned, false);
});

test("Unit initialization preserves tick hooks across independent capability combinations", () => {
    const trace = [];
    const tickHook = { id: "observe-tick", stage: "tick", invoke(state, self) {
        trace.push(self.id);
        return { state, value: undefined };
    } };
    const base = combatUnit(0, { action: true }).definition;
    const definitions = [
        { ...base, hooks: [tickHook], blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 0.5 } },
        { spatialPresence: {}, ...base, hooks: [tickHook], locomotion, blockable: { volume: 1 } },
        { id: "scripted", hooks: [tickHook] },
    ];
    const units = definitions.map((definition, id) => initialize({ id, position: [id, 0], definition }));
    const before = createBattleState(fixtureBattlefieldState(units));

    assert.equal(advance(before), before);
    assert.deepEqual(trace, [0, 1, 2]);
    for (const [id, definition] of definitions.entries()) {
        assert.equal(getUnit(before, id).definition, definition);
    }
});

test("Unit tick errors propagate without publishing an incomplete Tick", () => {
    const failure = new Error("boss phase failed");
    let battle = runtime([
        { id: "first", vitality: { maxHp: 100, defense: 0, resistance: 0 }, hooks: [{ id: "test/tick", stage: "tick", invoke(state, self) {
            return { state: updateUnit(state, [{ ...self, vitality: { ...self.vitality, hp: 50 } }]), value: undefined };
        } }] },
        { id: "failed", hooks: [{ id: "test/tick", stage: "tick", invoke() { throw failure; } }] },
    ]);
    const before = battle;

    assert.throws(() => (battle = stepBattle(battle, [])), error => error === failure);
    assert.deepEqual(battle, before);
});
