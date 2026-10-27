import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { World } from "../../dist/core/geometry/coordinate.js";
import { isSpatiallyPresent } from "../../dist/core/unit/capability/presence/capability.js";
import { create } from "../../dist/core/battlefield/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battlefield/unit.js";
import { create as createMap, contains } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "./tiles.js";

const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true,
    buildableType: "ALL",
    passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});
const defaultMap = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function fixtureBattlefieldState(input) {
    if (input.units instanceof Map && input.navigation !== undefined && input.occupancy instanceof Map) return input;
    const units = Array.isArray(input) ? input : input.units instanceof Map ? [...input.units.values()] : input.units;
    let state = create(Array.isArray(input) ? defaultMap : (input.map ?? defaultMap));
    if (input.navigation !== undefined) state = { ...state, navigation: input.navigation };
    return addUnits(state, units);
}

export function addUnits(field, units) {
    return units.reduce((current, unit) => addUnit(current, unit), field);
}

export function replaceUnits(field, units) {
    return units.reduce((current, unit) => updateUnit(current, [unit]), field);
}

export function unitsAt(field, tile) {
    if (!contains(field.map, tile)) return [];
    return [...field.units.values()]
        .filter(isSpatiallyPresent)
        .filter(unit => {
            const position = World.toTile(unit.position);
            return position[0] === tile[0] && position[1] === tile[1];
        });
}
