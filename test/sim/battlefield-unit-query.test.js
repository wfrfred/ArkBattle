import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import assert from "node:assert/strict";
import { test } from "node:test";
import * as field from "../../dist/core/battlefield/state.js";
import * as fieldUnits from "../../dist/core/battlefield/unit.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { initialize } from "../helpers/unit.js";

const map = createMap(2, 3, tileEntries(Array.from({ length: 6 }, () => createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
}))));

function unit(id, position, definition = {}, states = {}) {
    return initialize({ id, position, definition: { hooks: [], id: `tile-query-${id}`, ...definition }, states });
}

function fixture(...units) {
    return units.reduce((current, unit) => fieldUnits.add(current, unit), field.create(map));
}

test("Field Unit storage preserves registration order and returns the current Unit objects", () => {
    const first = unit(9, [1.1, 0]);
    const second = unit(2, [1, 0]);
    const initial = fixture(first, second);
    const changed = { ...first, position: [1.2, 0] };
    const next = fieldUnits.update(initial, [changed]);
    assert.deepEqual([...next.units.values()], [changed, second]);
    assert.equal(next.units.get(9), changed);
    assert.equal(initial.units.get(9), first);
});

test("retained Field versions preserve Unit facts after movement, disappearance and removal", () => {
    const original = unit(1, [0, 0], { spatialPresence: {} });
    const initial = fixture(original);
    const moved = fieldUnits.update(initial, [{ ...original, position: [1, 0] }]);
    const hidden = fieldUnits.update(moved, [{
        ...moved.units.get(1), spatialPresence: { present: false },
    }]);
    const removed = fieldUnits.remove(hidden, { id: 1 });
    assert.equal(initial.units.get(1), original);
    assert.deepEqual(initial.units.get(1).position, [0, 0]);
    assert.deepEqual(moved.units.get(1).position, [1, 0]);
    assert.equal(moved.units.get(1).spatialPresence.present, true);
    assert.equal(hidden.units.get(1).spatialPresence.present, false);
    assert.equal(removed.units.has(1), false);
    assert.deepEqual([...initial.units.values()], [original]);
});

test("Field registration preserves body position, spatial presence and occupancy as independent facts", () => {
    const implicitPresence = unit(1, [1, 0]);
    const explicitPresence = unit(2, [1, 0], { spatialPresence: {} });
    const hidden = unit(3, [1, 0], { spatialPresence: {} }, { spatialPresence: { present: false } });
    const registeredElsewhere = unit(4, [1, 0], { occupancy: { slot: "OCCUPANT" } }, {
        occupancy: { tile: [0, 0] },
    });
    const initial = fixture(implicitPresence, explicitPresence, hidden, registeredElsewhere);
    assert.deepEqual([...initial.units.keys()], [1, 2, 3, 4]);
    assert.equal(initial.units.get(3), hidden);
    assert.equal(initial.units.get(3).spatialPresence.present, false);
    assert.deepEqual(initial.units.get(4).position, [1, 0]);
    assert.deepEqual(initial.units.get(4).occupancy.tile, [0, 0]);
    assert.equal(initial.occupancy.get(0).occupant.id, 4);
});
