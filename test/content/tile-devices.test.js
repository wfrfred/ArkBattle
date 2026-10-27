import { test } from "node:test";
import assert from "node:assert/strict";
import { create as createCrate } from "../../dist/content/devices/crate.js";
import { create as createShootingPlatform } from "../../dist/content/devices/shooting-platform.js";
import { hole, normal } from "../../dist/content/terrain/definition.js";
import * as conditions from "../../dist/content/terrain/condition.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add, remove } from "../../dist/core/battle/unit.js";
import { create as createField } from "../../dist/core/battlefield/state.js";
import { create as createMap, get as getTile } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { Tile } from "../../dist/core/geometry/coordinate.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import { createDefinition as createDeployable } from "../../dist/core/unit/capability/deployable/capability.js";

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
    return { hooks: [],
        id,
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
        deployable: createDeployable({
            cost: 0,
            redeployTicks: 0,
            slots: 0,
            placement: "ALL",
            allowedSiteConditions: [conditions.normal],
        }),
        tileChanges,
    };
}

function place(battle, id, definition, tile, position = Tile.center(tile)) {
    const initialized = initialize(battle, { id, definition, position });

    return add(initialized.state, { ...initialized.value, occupancy: { ...(initialized.value).occupancy, tile } });
}

for (const [name, create] of [["crate", createCrate], ["shooting platform", createShootingPlatform]]) {
    for (const [terrain, initialCost] of [[normal, 2000], [hole, 1000000]]) {
        test(`${name} rewrites ordinary cost directly and preserves hole cost (${initialCost})`, () => {
            const input = configuration(name);
            const definition = create(input);
            let state = battle(terrain, initialCost);
            const original = getTile(state.battlefield.map, [0, 0]);

            assert.equal(definition.vitality, input.vitality);
            assert.equal(definition.deployable, input.deployable);
            state = place(state, 0, definition, [0, 0], Tile.center([0, 2]));

            const tile = getTile(state.battlefield.map, [0, 0]);
            const expectedCost = terrain === hole ? initialCost : 1000;
            assert.equal(tile.definition, original.definition);
            assert.equal(tile.state.walkCost, expectedCost);
            assert.equal(tile.state.allowsBlocking, original.state.allowsBlocking);
            assert.equal(state.battlefield.navigation.baseline.WALK.get([0, 0]).cost, expectedCost);
            assert.equal(state.battlefield.navigation.baseline.FLY.get([0, 0]).cost, 1);
            assert.equal(getTile(state.battlefield.map, [0, 2]).state.walkCost, 2000);

            state = remove(state, 0, "SCRIPT");
            assert.deepEqual(getTile(state.battlefield.map, [0, 0]).state, original.state);
        });
    }
}
