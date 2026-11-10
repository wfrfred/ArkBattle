import { Hooks } from "../../dist/core/hook.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { create as createCrate } from "../../dist/content/devices/crate.js";
import { hole, normal } from "../../dist/content/terrain/definition.js";
import * as conditions from "../../dist/content/terrain/condition.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add, remove } from "../../dist/core/battle/unit.js";
import { create as createField } from "../../dist/core/battlefield/state.js";
import { create as createMap, get as getTile } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { Tile } from "../../dist/core/geometry/coordinate.js";
import { initialize, ref } from "../../dist/core/unit/index.js";
import { createCardDefinition } from "../helpers/deployable.js";
import { getUnit } from "../helpers/unit.js";

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

function configuration(id, tileChanges = {}) {
    return { hooks: Hooks.empty(),
        id,
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
        deployable: { retreatRules: [] },
        card: createCardDefinition({ cost: 0, redeployTicks: 0, slots: 0, placement: "ALL" }),
        tileChanges,
    };
}

function place(battle, id, definition, tile, position = Tile.center(tile)) {
    const initialized = initialize(battle, { id, definition, position, initial: {
        occupancy: { tile },
    } });

    return add(initialized.state, initialized.value);
}

for (const [terrain, initialCost] of [[normal, 2000], [hole, 1000000]]) {
    test(`device tile changes use the registered tile and preserve ${terrain === hole ? "hole" : "ordinary"} cost rules`, () => {
        const definition = createCrate(configuration("crate"));
        let state = battle(terrain, initialCost);
        const original = getTile(state.battlefield.map, [0, 0]);
        state = place(state, 0, definition, [0, 0], Tile.center([0, 2]));

        const tile = getTile(state.battlefield.map, [0, 0]);
        const expectedCost = terrain === hole ? initialCost : 1000;
        assert.equal(tile.state.walkCost, expectedCost);
        assert.equal(getTile(state.battlefield.map, [0, 2]).state.walkCost, 2000);
        state = remove(state, ref(getUnit(state, 0)), "SCRIPT");
        assert.deepEqual(getTile(state.battlefield.map, [0, 0]).state, original.state);
    });
}
