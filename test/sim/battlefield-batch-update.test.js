import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import assert from "node:assert/strict";
import { test } from "node:test";
import { create } from "../../dist/core/battlefield/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battlefield/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { initialize } from "../helpers/unit.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { update as updateBattleUnits } from "../../dist/core/battle/unit.js";

const map = createMap(1, 4, tileEntries(Array.from({ length: 4 }, () => createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
}))));

function unit(id, column, slot = "OCCUPANT") {
    return initialize({
        id, position: [column, 0],
        definition: { id: `batch-${id}`, occupancy: slot === "SUPPORT" ? { slot, hooks: [] } : { slot }, vitality: { maxHp: 100, defense: 0, resistance: 0 } },
        states: { occupancy: { tile: [0, column] } },
    });
}

function fixture(...units) {
    return units.reduce((field, self) => addUnit(field, self), create(map));
}

function move(self, column) {
    return { ...self, position: [column, 0], occupancy: { tile: [0, column] } };
}

test("batch update swaps occupied tiles using the complete final Unit states", () => {
    const first = unit(11, 0), second = unit(7, 1), retained = unit(3, 3);
    const before = fixture(first, second, retained);
    const firstNext = move(first, 1), secondNext = move(second, 0);

    assert.throws(() => updateUnit(before, [firstNext]), RangeError);
    const after = updateUnit(before, [firstNext, secondNext]);

    assert.equal(after.units.get(first.id), firstNext);
    assert.equal(after.units.get(second.id), secondNext);
    assert.equal(at(after, [0, 0]).occupant.id, second.id);
    assert.equal(at(after, [0, 1]).occupant.id, first.id);
    assert.deepEqual([...after.units.keys()], [11, 7, 3]);
    assert.equal(after.units.get(retained.id), retained);
    assert.equal(at(after, [0, 3]), at(before, [0, 3]));
    assert.equal(after.navigation, before.navigation);
    assert.equal(after.projectiles, before.projectiles);
    assert.equal(at(before, [0, 0]).occupant.id, first.id);
    assert.equal(at(before, [0, 1]).occupant.id, second.id);
    assert.equal(before.units.get(first.id), first);
});

test("batch update supports a three-way occupancy cycle regardless of input order", () => {
    const first = unit(1, 0), second = unit(2, 1), third = unit(3, 2);
    const before = fixture(first, second, third);
    const updates = [move(first, 1), move(second, 2), move(third, 0)];
    const forward = updateUnit(before, updates);
    const reverse = updateUnit(before, [...updates].reverse());

    for (const after of [forward, reverse]) {
        assert.deepEqual([0, 1, 2].map(column => at(after, [0, column]).occupant.id), [3, 1, 2]);
        assert.deepEqual([...after.units.keys()], [1, 2, 3]);
    }
    assert.deepEqual([0, 1, 2].map(column => at(before, [0, column]).occupant.id), [1, 2, 3]);
});

test("batch update swaps SUPPORT occupancy tiles without disturbing their occupants", () => {
    const first = unit(1, 0, "SUPPORT"), second = unit(2, 1, "SUPPORT");
    const occupantA = unit(3, 0), occupantB = unit(4, 1);
    const before = fixture(first, second, occupantA, occupantB);
    const after = updateUnit(before, [move(first, 1), move(second, 0)]);

    assert.equal(at(after, [0, 0]).support.id, 2);
    assert.equal(at(after, [0, 1]).support.id, 1);
    assert.equal(at(after, [0, 0]).occupant, at(before, [0, 0]).occupant);
    assert.equal(at(after, [0, 1]).occupant, at(before, [0, 1]).occupant);
    assert.equal(after.units.get(occupantA.id), occupantA);
    assert.equal(after.units.get(occupantB.id), occupantB);
});

test("batch update moves OCCUPANT and SUPPORT between tiles using their declared slots", () => {
    const occupant = unit(1, 0), support = unit(2, 1, "SUPPORT");
    const before = fixture(occupant, support);
    const updates = [move(occupant, 1), move(support, 0)];

    for (const batch of [updates, [...updates].reverse()]) {
        const after = updateUnit(before, batch);
        assert.equal(after.occupancy.size, 2);
        assert.equal(at(after, [0, 1]).occupant.id, occupant.id);
        assert.equal(at(after, [0, 1]).support, null);
        assert.equal(at(after, [0, 0]).occupant, null);
        assert.equal(at(after, [0, 0]).support.id, support.id);
        assert.equal(at(before, [0, 0]).occupant.id, occupant.id);
        assert.equal(at(before, [0, 1]).support.id, support.id);
    }
});

test("batch update rejects a final occupancy conflict without changing the input", () => {
    const first = unit(1, 0), second = unit(2, 1);
    const before = fixture(first, second);
    const units = before.units, occupancy = before.occupancy;

    assert.throws(() => updateUnit(before, [move(first, 1), second]), RangeError);
    assert.equal(before.units, units);
    assert.equal(before.occupancy, occupancy);
    assert.equal(before.units.get(1), first);
    assert.equal(at(before, [0, 0]).occupant.id, 1);
    assert.equal(at(before, [0, 1]).occupant.id, 2);
});

test("battle batch update validates definitions and identities before applying the batch", () => {
    const first = unit(1, 0), second = unit(2, 1);
    const before = createBattleState(fixture(first, second));
    const valid = { ...first, vitality: { ...first.vitality, hp: 50 } };
    const invalid = [
        [valid, { ...second, definition: { ...second.definition } }],
        [valid, { ...second, definition: { ...second.definition, occupancy: { slot: "SUPPORT", hooks: [] } } }],
        [valid, unit(99, 2)],
        [valid, valid],
    ];

    for (const updates of invalid) {
        assert.throws(() => updateBattleUnits(before, updates), RangeError);
        assert.equal(before.battlefield.units.get(first.id), first);
        assert.equal(before.battlefield.units.get(second.id), second);
        assert.equal(before.battlefield.units.get(first.id).vitality.hp, 100);
        assert.deepEqual([...before.battlefield.units.keys()], [1, 2]);
        assert.equal(before.battlefield.occupancy.size, 2);
    }
});

test("field batch update rejects occupancy outside the map without publishing partial updates", () => {
    const first = unit(1, 0), second = unit(2, 1);
    const before = fixture(first, second);

    assert.throws(() => updateUnit(before, [
        { ...first, vitality: { ...first.vitality, hp: 50 } }, move(second, 4),
    ]), /occupancy tile is outside the battlefield/);
    assert.equal(before.units.get(first.id), first);
    assert.equal(before.units.get(second.id), second);
    assert.equal(at(before, [0, 0]).occupant.id, first.id);
    assert.equal(at(before, [0, 1]).occupant.id, second.id);
});

test("empty and unchanged batches retain state identity while local updates share unchanged indexes", () => {
    const first = unit(1, 0), second = unit(2, 1);
    const before = fixture(first, second);

    assert.equal(updateUnit(before, []), before);
    assert.equal(updateUnit(before, [first, second]), before);
    assert.equal(updateUnit(before, [first]), before);
    const changed = { ...first, vitality: { ...first.vitality, hp: 75 } };
    const after = updateUnit(before, [changed, second]);
    const single = updateUnit(before, [changed]);
    assert.equal(after.occupancy, before.occupancy);
    assert.equal(after.navigation, before.navigation);
    assert.equal(after.projectiles, before.projectiles);
    assert.equal(after.units.get(second.id), second);
    assert.equal(after.units.get(first.id), changed);
    assert.deepEqual([...single.units], [...after.units]);
    assert.equal(single.occupancy, after.occupancy);
});
