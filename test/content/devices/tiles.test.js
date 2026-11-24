import { vitality } from "../../helpers/attribute.js";
// Contract: [terrain](../../../docs/architecture/terrain.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { create as createCrate } from "../../../dist/content/devices/crate.js";
import { hole, normal } from "../../../dist/content/terrain/definition.js";
import * as conditions from "../../../dist/content/terrain/condition.js";
import { createBattleState } from "../../../dist/core/battle/state.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";
import { add, remove } from "../../../dist/core/unit/operations.js";
import { create as createField } from "../../../dist/core/battlefield/state.js";
import { create as createMap, get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../../dist/core/battlefield/map/tiles.js";
import { Tile } from "../../../dist/core/geometry/coordinate.js";
import { initialize, ref } from "../../../dist/core/unit/index.js";
import { getUnit } from "../../helpers/unit.js";

function battle(firstTerrain = normal, firstCost = 2000) {
    const tiles = [0, 1, 2].reduce((entries, index) => entries.add(createTile({
        terrain: (index === 0 ? firstTerrain : normal).create({}),
        initial: {
            elevation: "LOWLAND",
            placement: "ALL",
            passability: "ALL",
            walkCost: index === 0 ? firstCost : 2000,
            allowsBlocking: true,
            siteCondition: conditions.normal,
        },
    })), Tiles.empty());

    return createBattleState(createField(createMap(1, 3, tiles)));
}

function place(battle, definition, tile, position = Tile.center(tile)) {
    const initialized = initialize(battle, { definition, position, initial: {
        occupancy: { tile },
    } });

    return add(initialized.state, initialized.value);
}

test("a crate modifies its registered tile, preserves hole cost, and restores only its own fields", () => {
    const definition = createCrate({
        id: "crate",
        classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
        taunt: -1,
        vitality: vitality(100),
        deployable: { retreatRestrictions: [], refund: null },
        tileChanges: {},
    });
    const tile = [0, 0];
    let state = place(battle(), definition, tile, Tile.center([0, 2]));
    const obstructed = getTile(state.battlefield.map, tile).state;
    assert.equal(obstructed.walkCost, 1000);
    assert.equal(getTile(state.battlefield.map, [0, 2]).state.walkCost, 2000);

    state = updateTile(state, tile, { ...obstructed, allowsBlocking: false });
    state = remove(state, ref(getUnit(state, 0)), { reason: "SCRIPT" });
    const restored = getTile(state.battlefield.map, tile).state;
    assert.equal(restored.walkCost, 2000);
    assert.equal(restored.allowsBlocking, false);

    const coveredHole = place(battle(hole, 1000000), definition, tile);
    assert.equal(getTile(coveredHole.battlefield.map, tile).state.walkCost, 1000000);
});
