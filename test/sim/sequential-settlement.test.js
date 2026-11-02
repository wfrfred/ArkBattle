import { ref as unitRef } from "../../dist/core/unit/query.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { battle, unit } from "../helpers/action-fixture.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { install } from "../../dist/core/unit/effect/index.js";
import { advancePredefined } from "../../dist/core/battle/steps/predefined.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";

test("sequential predefined commands allocate after all earlier callback results", () => {

    let state = battle(unit(0));
    state = { ...state, execution: { ...state.execution, nextUnitId: 1 } };
    state = install(state, unitRef(getUnit(state, 0)), {
        id: "birth-on-end",
        initialize: () => ({}),
        onEnd(state) {
            const id = state.execution.nextUnitId;
            state = { ...state, execution: { ...state.execution, nextUnitId: id + 1 } };
            const created = initializeUnit(
                state,
                { id, definition: { hooks: [], id: "callback-child" }, position: [1, 0] },
            );
            return addUnit(created.state, created.value);
        },
    }).state;
    const before = state;
    const definitions = [
        {
            id: 0,
            alias: null,
            initiallyPresent: true,
            creation: {
                type: "UNIT",
                definition: getUnit(state, 0).definition,
                position: [0, 0],
                },
        },
        {
            id: 1,
            alias: null,
            initiallyPresent: false,
            creation: {
                type: "UNIT",
                definition: { hooks: [], id: "predefined-child" },
                position: [2, 0],
                },
        },
    ];
    const advanced = advancePredefined({ ...state, predefinedPresence: [{ definitionId: 0, source: { type: "UNIT", unitId: 0 } }] }, definitions, [
            { type: "REMOVE_PREDEFINED", definitionId: 0, reason: "SCRIPT" },
            { type: "APPEAR_PREDEFINED", definitionId: 1 },
        ], 0);
    assert.deepEqual([...advanced.battlefield.units.keys()], [1, 2]);
    assert.equal(getUnit(advanced, 1).definition.id, "callback-child");
    assert.equal(getUnit(advanced, 2).definition.id, "predefined-child");
    assert.equal(advanced.execution.nextUnitId, 3);
    assert.deepEqual(advanced.predefinedPresence, [{ definitionId: 1, source: { type: "UNIT", unitId: 2 } }]);
    assert.equal(before.execution.nextUnitId, 1);
    assert.equal(getUnit(before, 0).lifecycle, "PRESENT");
});

test("predefined removal preserves a replacement created by its own leave callback", () => {
    let calls = 0;
    const definitions = [{
        id: 0,
        alias: null,
        initiallyPresent: false,
        creation: {
            type: "UNIT",
            position: [0, 0],
            definition: {
                id: "reappearing-on-leave",
                hooks: [{ id: "test/leave", stage: "leave", invoke(state, departure) {
                    calls++;
                    assert.equal(getUnit(state, departure.unit.id), undefined);
                    assert.deepEqual(state.predefinedPresence, []);
                    return { state: advancePredefined(state, definitions, [
                        { type: "APPEAR_PREDEFINED", definitionId: 0 },
                    ]), value: undefined };
                } }],
            },
        },
    }];
    const before = advancePredefined(battle(), definitions, [
        { type: "APPEAR_PREDEFINED", definitionId: 0 },
    ]);
    const state = advancePredefined(before, definitions, [
        { type: "REMOVE_PREDEFINED", definitionId: 0, reason: "SCRIPT" },
    ]);

    assert.equal(calls, 1);
    assert.deepEqual([...state.battlefield.units.keys()], [1]);
    assert.deepEqual(state.predefinedPresence, [
        { definitionId: 0, source: { type: "UNIT", unitId: 1 } },
    ]);
    assert.equal(state.execution.nextUnitId, 2);
    assert.equal(getUnit(state, 1).definition, definitions[0].creation.definition);
    assert.equal(state.removedUnits[0].unitId, 0);
    assert.deepEqual([...before.battlefield.units.keys()], [0]);
    assert.equal(before.predefinedPresence[0].source.unitId, 0);
    assert.equal(before.execution.nextUnitId, 1);
});

test("predefined appearance retains a nested replacement and its latest binding", () => {
    const entered = [];
    let replaced = false;
    const definitions = [{
        id: 0,
        alias: null,
        initiallyPresent: false,
        creation: {
            type: "UNIT",
            position: [0, 0],
            definition: {
                id: "reappearing-on-enter",
                hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
                    entered.push(self.id);
                    assert.deepEqual(state.predefinedPresence, [
                        { definitionId: 0, source: { type: "UNIT", unitId: self.id } },
                    ]);
                    assert.equal(getUnit(state, self.id), self);
                    if (replaced) return { state: state, value: undefined };
                    replaced = true;
                    return { state: advancePredefined(state, definitions, [
                        { type: "REMOVE_PREDEFINED", definitionId: 0, reason: "SCRIPT" },
                        { type: "APPEAR_PREDEFINED", definitionId: 0 },
                    ]), value: undefined };
                } }],
            },
        },
    }];
    const before = battle();
    const state = advancePredefined(before, definitions, [
        { type: "APPEAR_PREDEFINED", definitionId: 0 },
    ]);

    assert.deepEqual(entered, [0, 1]);
    assert.deepEqual([...state.battlefield.units.keys()], [1]);
    assert.deepEqual(state.predefinedPresence, [
        { definitionId: 0, source: { type: "UNIT", unitId: 1 } },
    ]);
    assert.equal(state.execution.nextUnitId, 2);
    assert.equal(getUnit(state, 1).definition, definitions[0].creation.definition);
    assert.deepEqual(state.removedUnits.map(removed => removed.unitId), [0]);
    assert.equal(before.battlefield.units.size, 0);
    assert.deepEqual(before.predefinedPresence, []);
    assert.equal(before.execution.nextUnitId, 0);
});
