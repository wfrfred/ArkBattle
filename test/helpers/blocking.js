import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { initialize, getUnit } from "./unit.js";
import { ref } from "../../dist/core/unit/query.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { create } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { normal as normalSite } from "../../dist/content/terrain/condition.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as blocker from "../../dist/core/unit/capability/blocking/index.js";
import { Hooks } from "../../dist/core/hook.js";

export function fixture(units = [], { rows = 3, columns = 12 } = {}) {
    const tile = createTile({
        terrain: normal.create({}),
        initial: {
            elevation: "LOWLAND", placement: "ALL", passability: "ALL",
            walkCost: 1, allowsBlocking: true, siteCondition: normalSite,
        },
    });
    const map = createMap(rows, columns, tileEntries(Array(rows * columns).fill(tile)));
    let battle = createBattleState(create(map));
    for (const unit of units) battle = addUnit(battle, unit);
    return battle;
}

export function holder(id = 10, { position = [2, 1], capacity = 1, radius = 1, layer = "GROUND", side = "ALLY", definition = {} } = {}) {
    return initialize({
        id, position,
        definition: {
            id: `blocking-holder-${id}`,
            hooks: Hooks.empty(),
            ...(side === undefined ? {} : { allegiance: { side } }),
            spatialPresence: {}, vitality: { maxHp: 100, defense: 0, resistance: 0 },
            blocker: { layer, capacity, radius, rules: [blocker.sides("ENEMY")] },
            ...definition,
        },
    });
}

export function target(id = 20, { position = [2.25, 1], volume = 1, layer = "GROUND", side = "ENEMY", definition = {} } = {}) {
    return initialize({
        id, position,
        definition: {
            id: `blocking-target-${id}`,
            hooks: Hooks.empty(),
            ...(side === undefined ? {} : { allegiance: { side } }),
            spatialPresence: {}, vitality: { maxHp: 100, defense: 0, resistance: 0 },
            layer: { type: layer }, blockable: { volume, rules: [] },
            ...definition,
        },
    });
}

export function acquire(battle, id = 10) {
    return blocking.search(battle, ref(getUnit(battle, id)));
}

export function ownerId(battle, id = 20) {
    return blocking.blockerOf(battle, ref(getUnit(battle, id)))?.id;
}
