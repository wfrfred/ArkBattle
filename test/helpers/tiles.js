import { get } from "../../dist/core/battlefield/map/map.js";
import { update as updateBattleTile } from "../../dist/core/battle/tile.js";
import { create } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import * as conditions from "../../dist/content/terrain/condition.js";

// Keep the old flat fixture shorthand local to tests.
export function createTile(input) {
    const previous = input.state ?? {};
    const initial = {
        elevation: input.heightType ?? previous.elevation ?? "LOWLAND",
        placement: input.buildableType ?? previous.placement ?? "ALL",
        passability: input.passableMask ?? previous.passability ?? "ALL",
        walkCost: input.walkCost ?? previous.walkCost ?? 1,
        allowsBlocking: input.meleeBlockable ?? previous.allowsBlocking ?? true,
        siteCondition: input.advancedBuildableMask === undefined
            ? (Object.hasOwn(previous, "siteCondition") ? previous.siteCondition : conditions.normal)
            : siteCondition(input.advancedBuildableMask),
    };
    return create({ terrain: input.terrain ?? input.definition.terrain, initial });
}

function siteCondition(mask) {
    return ({ 0: null, 1: conditions.normal, 2: conditions.deepsea, 4: conditions.tide, 8: conditions.night })[mask];
}

export function tiles(entries) {
    return entries.reduce((result, tile) => result.add(tile.definition === undefined ? createTile(tile) : tile), Tiles.empty());
}

export function tilesOf(map, definition) {
    return Array.from({ length: map.tiles.size }, (_, index) => map.tiles.get(index, definition))
        .filter(tile => tile !== undefined);
}

export function changeTile(battle, position, changes) {
    const tile = get(battle.battlefield.map, position);
    return updateBattleTile(battle, position, { ...tile.state, ...changes });
}
