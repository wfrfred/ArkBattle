import { predefinedUnits } from "../helpers/predefined.js";


import { ref as unitReference } from "../../dist/core/unit/query.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { executionRef } from "../../dist/core/unit/action/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { unit } from "../helpers/action-fixture.js";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";

import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";

import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { actionCapability } from "../helpers/actions.js";


function spec(initialUnits) {
    return {
        ...createLegacyCombatSpec({
            rows: 1,
            columns: 8,
            operators: [],
            enemies: [],
            maxTicks: 20,
            seed: 17,
        }),
        predefines: predefinedUnits(initialUnits.map((value) => ({
            definition: value.definition,
            position: value.position,
        }))),
        schedule: {
            type: "TIMELINE",
            spawns: [
                {
                    definition: { hooks: [],
                        spatialPresence: {},
                        id: "future",
                        vitality: { maxHp: 1, defense: 0, resistance: 0 },
                        locomotion: {
                            halfBodyWidth: 0, minSpeed: 0, speed: 0,
                            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
                        },
                    },
                    route: createRouteDefinition({
                        pathMotionMode: "WALK",
                        startPosition: [0, 7],
                        endPosition: [0, 1],
                        spawnOffset: [0, 0],
                        spawnRandomRange: [0, 0],
                        checkpoints: [],
                        allowDiagonalMove: false,
                        visitEveryTileCenter: false,
                        visitEveryNodeCenter: false,
                        visitEveryCheckPoint: true,
                    }),
                    tick: 19,
                    timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 },
                    alwaysCheckCurrentPoint: true,
                    notCountInTotal: false,
                },
            ],
        },
    };
}
const program = (id, extra = {}) => ({
    id,
    intervalTicks: 10,
    speed: 100,
    initialize: (state) => ({ state, value: {} }),
    prepare: (state) => ({ state, value: { count: 0 } }),
    onTick: (state) => ({ state, value: false }),
    ...extra,
});


test("action runtime: a newly registered instance first executes once and retained snapshots stay immutable", () => {
    const definition = program("progress", {
        onTick(state, source, self) {
            const currentState2 = actions.getExecution(state, executionRef(source, self)).execution.state;
            state = actions.setExecutionState(state, executionRef(source, self), { count: currentState2.count + 1 });
            return { state, value: false };
        },
    });
    let runtime = initializeBattle(spec([unit(0, { action: definition }), unit(1)]));
    runtime = stepBattle(runtime, []);
    const first = runtime,
        retained = unitQueries.all(first).find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray()[0];
    assert.equal(retained.execution.state.count, 1);
    assert.equal(retained.definition, definition);
    runtime = stepBattle(runtime, []);
    assert.equal(unitQueries.all(runtime).find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray()[0].execution.state.count, 2);
    assert.equal(retained.execution.state.count, 1);
});


test("action runtime: an immediately finished definition starts once in one automatic scheduling pass", () => {
    let starts = 0;
    const definition = program("instant", {
        intervalTicks: 1,
        prepare(state) {
            starts++;
            return { state, value: {} };
        },
        onTick: (state) => ({ state, value: true }),
    });
    let runtime = initializeBattle(spec([unit(0, { action: definition }), unit(1)]));
    assert.equal(
        (runtime = stepBattle(runtime, [])).events.filter((event) => event.type === "ACTION_FINISHED").length,
        1,
    );
    assert.equal(starts, 1);
    assert.equal(unitQueries.all(runtime).find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray().length, 0);
    runtime = stepBattle(runtime, []);
    assert.equal(starts, 2);
});

test("action runtime: cancellation commands complete before a delayed release without disturbing its peer", () => {
    const definition = program("delayed", {
        prepare: (state) => ({ state, value: { releaseAtTick: state.tick + 1 } }),
        onTick(state, source, self) {
            if (state.tick < self.execution.state.releaseAtTick) return { state, value: false };
            state = updateUnit(state, [{
                ...getUnit(state, 2),
                vitality: { ...getUnit(state, 2).vitality, hp: getUnit(state, 2).vitality.hp - 7 },
            }]);
            return { state, value: true };
        },
    });
    let runtime = initializeBattle(spec([
            unit(0, { action: definition }),
            unit(1, { side: "ALLY", action: definition }),
            unit(2),
        ]));
    runtime = stepBattle(runtime, []);
    const first = runtime;
    assert.deepEqual(unitQueries.all(first).toArray().filter(unit => unit.action !== undefined)
        .map(unit => unit.action.actions.values().filter(self => self.execution !== null).toArray()[0].execution.id), [0, 0]);
    const cancelled = (runtime = stepBattle(runtime, [
        { type: "CANCEL_ACTION_EXECUTION", ref: executionRef(unitReference(unitQueries.all(first).find(unit => unit.id === 0)), unitQueries.all(first).find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray()[0]) },
    ]));
    assert.deepEqual(cancelled.events.filter(event => event.type === "ACTION_CANCELLED")
        .map(event => [event.sourceUnitId, event.executionId]), [[0, 0]]);
    assert.deepEqual(cancelled.events.filter(event => event.type === "ACTION_FINISHED")
        .map(event => [event.sourceUnitId, event.executionId]), [[1, 0]]);
    assert.equal(unitQueries.all(runtime).find((value) => value.id === 2).vitality.hp, 93);
    assert.equal(unitQueries.all(first).find((value) => value.id === 2).vitality.hp, 100);
});

test("action runtime: nested departure removes a later candidate before its next onTick", () => {
    const trace = [];
    const definition = program("nested", {
        onTick(state, source, self) {
            if (state.tick === 0) return { state, value: false };
            trace.push(source.id);
            if (source.id === 0)
                state = remove(state, 1, "SCRIPT");
            return { state, value: false };
        },
    });
    let runtime = initializeBattle(spec([
            unit(0, { action: definition }),
            unit(1, { side: "ALLY", action: definition }),
            unit(2),
        ]));
    runtime = stepBattle(runtime, []);
    runtime = stepBattle(runtime, []);
    assert.deepEqual(trace, [0]);
    assert.equal(
        unitQueries.all(runtime).some((value) => value.id === 1),
        false,
    );
});

test("action runtime: host order advances old instances before selection and defers nested same-tick candidates", () => {
    const trace = [];
    let child;
    const old = program("old", {
        onTick(state, source, self) {
            if (state.tick > 0) {
                trace.push(`old/${source.id}`);
                if (source.id === 0) {
                    state = actions.start(state, actions.ref(unitRef(getUnit(state, 1)), child)).state;
                }
            }
            return { state, value: false };
        },
    });
    child = program("child", {
        onTick(state, source, self) {
            trace.push(`child/${source.id}`);
            return { state, value: false };
        },
    });
    const create = id => unit(id, { side: "ALLY", action: {
        ...actionCapability(old, child),
        select(state, self) {
            if (state.tick > 0) trace.push(`select/${self.id}`);
            return { state, value: ["old"] };
        },
    } });
    let runtime = initializeBattle(spec([create(0), create(1), unit(2)]));
    runtime = stepBattle(runtime, []);
    runtime = stepBattle(runtime, []);
    assert.deepEqual(trace, ["old/0", "select/0", "old/1", "select/1"]);
    const first = unitQueries.all(runtime).find(unit => unit.id === 0);
    const second = unitQueries.all(runtime).find(unit => unit.id === 1);
    assert.deepEqual(first.action.actions.values().filter(self => self.execution !== null).toArray().map(self => self.execution.id), [0]);
    assert.deepEqual(second.action.actions.values().filter(self => self.execution !== null).toArray().map(self => self.execution.id), [0, 1]);
    assert.equal(second.action.actions.get("child").execution.startedAtTick, 1);
    trace.length = 0;
    runtime = stepBattle(runtime, []);
    assert.deepEqual(trace, ["old/0", "select/0", "old/1", "child/1", "select/1"]);
});

test("action runtime preserves execution start order when selection reverses configuration order", () => {
    const advanced = [], ended = [];
    const make = id => program(id, {
        onTick(state, source, self) { advanced.push([state.tick, self.definition.id]); return { state, value: false }; },
        onEnd(state, source, self) { ended.push(self.definition.id); return state; },
    });
    const first = make("first"), second = make("second");
    const actor = unit(0, { action: {
        ...actionCapability(first, second),
        select: state => ({ state, value: ["second", "first"] }),
    } });
    let state = initializeBattle(spec([actor, unit(1)]));
    state = stepBattle(state, []);
    const source = unitRef(getUnit(state, 0));
    assert.deepEqual(getUnit(state, 0).action.actions.keys().toArray(), ["first", "second"]);
    assert.deepEqual(actions.forUnit(state, source).map(ref => ref.id), [0, 1]);
    state = stepBattle(state, []);
    assert.deepEqual(advanced, [[0, "second"], [0, "first"], [1, "second"], [1, "first"]]);
    state = actions.cancelForUnit(state, source, "TEST");
    assert.deepEqual(ended, ["second", "first"]);
    assert.equal(actions.forUnit(state, source).length, 0);
});
