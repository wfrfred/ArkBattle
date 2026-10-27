import * as unitQueries from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";

import { appendEvents } from "../../dist/core/battle/state.js";
import { remove as removeUnit } from "../../dist/core/battle/unit.js";
import { advancePredefined } from "../../dist/core/battle/steps/predefined.js";

import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { map } from "../helpers/action-fixture.js";

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
function input(overrides = {}) {
    return {
        map, initialUnits: [], predefines: [], initialMechanisms: [], schedule: { type: "TIMELINE", spawns: [
            spawn({ hooks: [], spatialPresence: {}, id: "later", vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion }, 100),
        ] },
        maxTicks: 10, routeMoveMultiplier: 1, rngState: 123,
        ...overrides,
    };
}
const predefined = (id, definition, initiallyPresent = false) => ({
    id, alias: null, initiallyPresent,
    creation: { type: "UNIT", definition, position: [id, 0], },
});

test("initial entry receives the complete battle state and its returned facts persist", () => {
    const observations = [];
    const enterHook = { id: "observe-entry", stage: "enter", invoke(state, self) {
        observations.push(state);
        assert.equal(state.schedule.definition.spawns.length, 1);
        assert.equal(state.result, null);
        assert.equal(state.deployment.cards.length, 0);
        assert.equal(state.battlefield.units.has(self.id), true);
        return { state: { ...state, completedRouteCount: state.completedRouteCount + 1 }, value: undefined };
    } };
    let battle = initializeBattle(input({
        initialUnits: [{ definition: { id: "initial", hooks: [enterHook] }, position: [0, 0] }],
        predefines: [predefined(7, { id: "predefined", hooks: [enterHook] }, true)],
    }));
    assert.equal(observations.length, 2);
    assert.deepEqual(observations[0].predefinedPresence, []);
    assert.deepEqual([...observations[0].battlefield.units.keys()], [0]);
    assert.deepEqual(observations[1].predefinedPresence, [{ definitionId: 7, source: { type: "UNIT", unitId: 1 } }]);
    assert.deepEqual([...observations[1].battlefield.units.keys()], [0, 1]);
    assert.equal(observations[0].completedRouteCount, 0);
    assert.equal(observations[1].completedRouteCount, 1);
    assert.equal(battle.completedRouteCount, 2);
    battle = stepBattle(battle, []);
    assert.equal(battle.completedRouteCount, 2);
});

test("spawn entry observes recorded schedule progress before running content", () => {
    let observed;
    const definition = {
        spatialPresence: {},
        id: "spawned", vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion,
        hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
            observed = state;
            assert.equal(state.schedule.cursor, 1);
            assert.equal(state.schedule.spawnedCount, 1);
            assert.equal(state.schedule.pendingSpawnCount, 0);
            assert.deepEqual(state.schedule.managedFinalUnitIds, [self.id]);
            return { state: { ...state, completedRouteCount: 4 }, value: undefined };
        } }],
    };
    let battle = initializeBattle(input({
        schedule: { type: "TIMELINE", spawns: [spawn(definition, 0)] },
    }));
    battle = stepBattle(battle, []);
    assert.equal(battle.completedRouteCount, 4);
    assert.equal(observed.schedule.spawnedCount, 1);
});

test("nested predefined entry and departure keep the latest presence bindings", () => {

    const observations = [];
    let definitions;
    definitions = [
        predefined(1, {
            id: "parent",
            hooks: [{ id: "test/enter", stage: "enter", invoke(state) {
                observations.push(state.predefinedPresence.map(binding => binding.definitionId));
                return { state: advancePredefined(state, definitions, [{ type: "APPEAR_PREDEFINED", definitionId: 2 }], state.tick), value: undefined };
            } }, { id: "test/leave", stage: "leave", invoke(state) {
                observations.push(state.predefinedPresence.map(binding => binding.definitionId));
                return { state: advancePredefined(state, definitions, [{ type: "APPEAR_PREDEFINED", definitionId: 3 }], state.tick), value: undefined };
            } }],

        }),
        predefined(2, { id: "entry-child", hooks: [] }),
        predefined(3, { id: "departure-child", hooks: [] }),
    ];
    let battle = initializeBattle(input({ predefines: definitions }));
    battle = stepBattle(battle, [{ type: "APPEAR_PREDEFINED", definitionId: 1 }]);
    const first = battle;
    assert.deepEqual(first.predefinedPresence.map(binding => binding.definitionId), [1, 2]);
    battle = stepBattle(battle, [{ type: "REMOVE_PREDEFINED", definitionId: 1, reason: "SCRIPT" }]);
    assert.deepEqual(battle.predefinedPresence.map(binding => binding.definitionId), [2, 3]);
    assert.deepEqual(observations, [[1], [2]]);
    assert.deepEqual(first.predefinedPresence.map(binding => binding.definitionId), [1, 2]);
});

test("starting a new tick clears temporary facts without changing retained state versions", () => {
    const received = [], returned = [];
    let battle = initializeBattle(input({
        initialUnits: [
            { position: [0, 0], definition: { id: "observer", hooks: [{ id: "test/tick", stage: "tick", invoke(state) {
                received.push(state);
                assert.deepEqual(state.events, []);
                assert.deepEqual(state.removedUnits, []);
                if (state.tick === 0) {
                    state = removeUnit(state, 1, "SCRIPT");
                    state = appendEvents(state, [{ type: "ROUTE_COMPLETED", unitId: 1, tick: 0 }]);
                }
                returned.push(state);
                return { state: state, value: undefined };
            } }] } },
            { position: [1, 0], definition: { hooks: [], id: "removed" } },
        ],
    }));
    const first = (battle = stepBattle(battle, []));
    const second = (battle = stepBattle(battle, []));
    assert.deepEqual(first.events.map(event => event.type), ["ROUTE_COMPLETED", "UNIT_REMOVED"]);
    assert.deepEqual(second.events, []);
    assert.equal(battle.completedRouteCount, 1);
    assert.equal(returned[0].events.length, 1);
    assert.equal(returned[0].removedUnits.length, 1);
    assert.notEqual(received[1].events, returned[0].events);
    assert.notEqual(received[1].removedUnits, returned[0].removedUnits);
});

test("a failed tick publishes neither schedule nor predefined or statistics changes", () => {
    const failure = new Error("late state failure");
    let fail = true;
    let failedState;
    const definition = {
        spatialPresence: {},
        id: "spawned", vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion,
        hooks: [{ id: "test/tick", stage: "tick", invoke(state) {
            failedState = state;
            if (fail) throw failure;
            return { state: state, value: undefined };
        } }],
    };
    let battle = initializeBattle(input({
        predefines: [predefined(5, { id: "appearing", hooks: [{ id: "test/enter", stage: "enter", invoke(state) { return { state: ({ ...state, completedRouteCount: 3 }), value: undefined }; } }] })],
        schedule: { type: "TIMELINE", spawns: [spawn(definition, 0)] },
    }));
    const before = battle;
    const commands = [{ type: "APPEAR_PREDEFINED", definitionId: 5 }];
    assert.throws(() => (battle = stepBattle(battle, commands)), error => error === failure);
    assert.deepEqual(battle, before);
    assert.equal(failedState.schedule.spawnedCount, 1);
    assert.equal(failedState.completedRouteCount, 3);
    assert.equal(failedState.predefinedPresence.length, 1);
    fail = false;
    battle = stepBattle(battle, commands);
    assert.deepEqual(unitQueries.all(battle).toArray().map(unit => unit.id), [0, 1]);
    assert.equal(battle.completedRouteCount, 3);
    assert.equal(before.execution.nextUnitId, 0);
    assert.deepEqual(before.predefinedPresence, []);
});
