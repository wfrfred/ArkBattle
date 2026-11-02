import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { create } from "../../dist/core/battlefield/state.js";
import { add as addUnit } from "../../dist/core/battlefield/unit.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
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

function addUnits(field, units) {
    return units.reduce((current, unit) => addUnit(current, unit), field);
}
