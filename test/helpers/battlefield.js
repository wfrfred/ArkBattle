import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { create } from "../../dist/core/battlefield/state.js";
import { add as addUnit } from "../../dist/core/battlefield/unit.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { normal as normalSite } from "../../dist/content/terrain/condition.js";

const tile = createTile({
    terrain: normal.create({}),
    initial: {
        elevation: "LOWLAND", placement: "ALL", passability: "ALL",
        walkCost: 1, allowsBlocking: true, siteCondition: normalSite,
    },
});
const defaultMap = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function fixtureBattlefieldState(units) {
    return units.reduce((field, unit) => addUnit(field, unit), create(defaultMap));
}
