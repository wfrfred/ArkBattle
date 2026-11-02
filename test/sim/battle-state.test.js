import * as unitQueries from "../../dist/core/unit/query.js";
import { initialize } from "../helpers/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { appendEvents, createBattleState } from "../../dist/core/battle/state.js";
import { remove as removeUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";

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
