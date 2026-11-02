import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { unitsAt } from "../helpers/battlefield.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as field from "../../dist/core/battlefield/state.js";
import * as fieldUnits from "../../dist/core/battlefield/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { createBattleState } from "../../dist/core/battle/state.js";

import { getUnit } from "../helpers/unit.js";


import { initialize } from "../helpers/unit.js";

const map = createMap(2, 3, tileEntries(Array.from({ length: 6 }, () => createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
}))));

function unit(id, tile = [0, 0], slot = "OCCUPANT", definition = {}, states = {}) {
    return initialize({
        id, position: [tile[1], tile[0]],
        definition: { hooks: [],
            id: `occupancy-${id}`, occupancy: slot === "SUPPORT" ? { slot, hooks: [] } : { slot }, spatialPresence: {},
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            ...definition,
        },
        states: { occupancy: { ...(states).occupancy, tile }, ...states },
    });
}

function platform(id = 10, leaveHook, tile = [0, 0], definition = {}) {
    return unit(id, tile, "SUPPORT", {

        hooks: leaveHook === undefined ? [] : [leaveHook],
        ...definition,
    });
}

function fixture(instances = [platform(), unit(20)]) {
    let current = field.create(map);
    for (const instance of instances) current = fieldUnits.add(current, instance);
    return createBattleState(current);
}

const withoutTile = current => ({ ...current, occupancy: { ...(current).occupancy, tile: null } });


test("one tile independently registers an occupant and a support with typed identities", () => {
    const battle = fixture();
    const entry = at(battle.battlefield, [0, 0]);
    assert.equal(entry.occupant.id, 20);
    assert.equal(entry.support.id, 10);
    assert.equal(battle.battlefield.occupancy.size, 1);
    assert.deepEqual(unitsAt(battle.battlefield, [0, 0]).map(unit => unit.id), [10, 20]);
    assert.equal(battle.battlefield.units.get(entry.occupant.id), getUnit(battle, 20));
    assert.equal(battle.battlefield.units.get(entry.support.id), getUnit(battle, 10));
});


test("out-of-bounds tiles and conflicting slots reject without mutating the input", () => {
    const battle = fixture();
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21)), RangeError);
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21, [0, 0], "SUPPORT")), RangeError);
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21, [0, 3])), RangeError);
    assert.throws(() => fieldUnits.update(battle.battlefield, [{
        ...getUnit(battle, 20), occupancy: { ...(getUnit(battle, 20)).occupancy, tile: [0, 3] },
    }]), RangeError);
    assert.equal(battle.battlefield.units.size, 2);
    assert.equal(at(battle.battlefield, [0, 0]).occupant.id, 20);
    assert.equal(at(battle.battlefield, [0, 0]).support.id, 10);
});


test("moving and clearing occupancy tiles preserve the other slot and delete empty entries", () => {
    let current = fixture().battlefield;
    const previous = current;
    current = fieldUnits.update(current, [{
        ...current.units.get(20), occupancy: { ...(current.units.get(20)).occupancy, tile: [0, 1] },
    }]);
    assert.equal(at(current, [0, 0]).occupant, null);
    assert.equal(at(current, [0, 0]).support.id, 10);
    assert.equal(at(current, [0, 1]).occupant.id, 20);
    current = fieldUnits.remove(current, { id: 10 });
    assert.equal(at(current, [0, 0]), undefined);
    current = fieldUnits.update(current, [withoutTile(current.units.get(20))]);
    assert.equal(current.occupancy.size, 0);
    assert.equal(current.units.has(20), true);
    assert.equal(at(previous, [0, 0]).occupant.id, 20);
});
