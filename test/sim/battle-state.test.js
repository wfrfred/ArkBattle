import * as unitQueries from "../../dist/core/unit/query.js";
import { initialize } from "../helpers/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { appendEvents, createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit, remove as removeUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";

const unit = (id, position = [0, 0]) =>
    initialize({ id, definition: { hooks: [], id: `unit-${id}` }, position });
const fixture = (...units) => createBattleState(fixtureBattlefieldState(units));

test("battle state: each returned version exposes completed updates and retains prior facts", () => {
    const first = unit(1),
        second = unit(2);
    const initial = fixture(first, second);
    const published = initial;
    const moved = { ...second, position: [3, 0] };
    const updated = updateUnit(initial, [moved]);
    const removed = removeUnit(updated, 1, "SCRIPT");
    assert.equal(getUnit(removed, 2), moved);
    assert.equal(getUnit(removed, 1), undefined);
    assert.deepEqual(unitQueries.all(removed).map(unit => unit.id).toArray(), [2]);
    assert.equal(getUnit(updated, 1), first);
    assert.equal(unitQueries.get(published, { id: 1 }), first);
    assert.equal(unitQueries.get(published, { id: 2 }), second);
    assert.deepEqual(initial.removedUnits, []);
    assert.deepEqual(removed.removedUnits, [{ unitId: 1, reason: "SCRIPT", unit: { ...first, lifecycle: "LEAVING" } }]);
});

test("battle state: independent branches keep their own registrations and removals", () => {
    const first = unit(1),
        spawned = unit(8);
    const initial = fixture(first);
    const moved = { ...first, position: [1, 0] };
    const left = updateUnit(initial, [moved]);
    const right = removeUnit(addUnit(initial, spawned), 1, "DEATH");
    assert.equal(getUnit(left, 1), moved);
    assert.equal(getUnit(left, 8), undefined);
    assert.deepEqual(unitQueries.all(right).map(unit => unit.id).toArray(), [8]);
    assert.equal(getUnit(initial, 1), first);
    assert.deepEqual(unitQueries.all(initial).map(unit => unit.id).toArray(), [1]);
});

test("battle state: no-op updates retain identity and zero HP alone does not remove a unit", () => {
    const first = initialize({
        id: 1,
        position: [0, 0],
        definition: { hooks: [], id: "vitality", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });
    const initial = fixture(first);
    assert.equal(updateUnit(initial, [first]), initial);
    assert.equal(removeUnit(initial, 99, "DEATH"), initial);
    assert.equal(appendEvents(initial, []), initial);
    const zeroHp = { ...first, vitality: { ...first.vitality, hp: 0 } };
    const advanced = updateUnit(initial, [zeroHp]);
    assert.equal(getUnit(advanced, 1), zeroHp);
    assert.deepEqual(advanced.removedUnits, []);
    assert.equal(getUnit(initial, 1).vitality.hp, 100);
});

test("battle state: facts, event prefixes and execution progress travel through explicit values", () => {
    const initial = fixture(unit(1));
    const first = { type: "ACTION", sourceUnitId: 1, targetUnitId: 2, tick: 3 };
    const second = { ...first, targetUnitId: 3 };
    const recorded = appendEvents(initial, [first]);
    const execution = { ...recorded.execution, rngState: 123, nextUnitId: 4 };
    const advanced = appendEvents({ ...recorded, execution }, [second]);
    assert.deepEqual(advanced.events, [first, second]);
    assert.equal(advanced.execution, execution);
    assert.deepEqual(initial.events, []);
    assert.deepEqual(recorded.events, [first]);
    assert.equal(initial.execution.rngState, 0);
});

test("battle state: unit updates do not register missing units", () => {
    const first = unit(1),
        second = unit(2);
    const initial = fixture(first, second);
    const snapshot = initial;
    const moved = { ...first, position: [3, 0] },
        spawned = unit(8);
    const movedState = updateUnit(initial, [moved]);
    assert.equal(updateUnit(movedState, [second]), movedState);
    assert.throws(() => updateUnit(movedState, [spawned]), /unknown unit: 8/);
    const changed = addUnit(movedState, spawned);
    assert.equal(getUnit(changed, 1), moved);
    assert.equal(getUnit(changed, 8), spawned);
    assert.equal(unitQueries.get(snapshot, { id: 1 }), first);
    assert.equal(unitQueries.get(snapshot, { id: 8 }), undefined);
    assert.deepEqual(unitQueries.all(changed).map(unit => unit.id).toArray(), [1, 2, 8]);
});
