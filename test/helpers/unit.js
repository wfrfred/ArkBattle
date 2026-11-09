import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { initialize as initializeUnit } from "../../dist/core/unit/index.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { create } from "../../dist/core/battlefield/state.js";
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
const map = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function fixtureBattle(tick = 0) {
    return { ...createBattleState(create(map)), tick };
}

export function initialize({ tick = 0, ...input }) {
    return initializeUnit(fixtureBattle(tick), input).value;
}

export function getUnit(battle, id) {
    return battle.battlefield.units.get(id);
}
