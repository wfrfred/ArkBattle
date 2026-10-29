import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { initialize } from "./unit.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "./unit.js";
import { create } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "./tiles.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as query from "../../dist/core/battle/blocking/index.js";
import * as blocker from "../../dist/core/unit/capability/blocking/index.js";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";

export function fixture(units = [], { rows = 3, columns = 12 } = {}) {
    const tile = createTile({
        heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
        terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
    });
    const map = createMap(rows, columns, tileEntries(Array(rows * columns).fill(tile)));
    let battle = createBattleState(create(map));
    for (const unit of units) battle = addUnit(battle, unit);
    return battle;
}

export function holder(id = 10, { position = [2, 1], capacity = 1, radius = 1, layer = "GROUND", side = "ALLY", definition = {}, states = {} } = {}) {
    return initialize({
        id, position,
        definition: {
            id: `blocking-holder-${id}`,
            ...(side === undefined ? {} : { allegiance: { side } }),
            spatialPresence: {}, vitality: { maxHp: 100, defense: 0, resistance: 0 },
            blocker: { layer, capacity, geometry: { radius }, rules: [blocker.sides("ENEMY")] },
            ...definition,
        },
        states,
    });
}

export function target(id = 20, { position = [2.25, 1], volume = 1, layer = "GROUND", side = "ENEMY", definition = {}, states = {} } = {}) {
    return initialize({
        id, position,
        definition: {
            id: `blocking-target-${id}`,
            ...(side === undefined ? {} : { allegiance: { side } }),
            spatialPresence: {}, vitality: { maxHp: 100, defense: 0, resistance: 0 },
            layer: { type: layer }, blockable: { volume },
            ...definition,
        },
        states,
    });
}

export function acquire(battle, id = 10) {
    return blocking.search(battle, { id });
}

export function blockedIds(battle, id = 10) {
    return query.blocked(battle, { id }).map(ref => ref.id);
}

export function ownerId(battle, id = 20) {
    return query.blockerOf(battle, { id })?.id;
}

export function capacity(battle, id, value) {
    const unit = getUnit(battle, id);
    return updateUnit(battle, [{
        ...unit,
        blocker: blocker.setCapacityContribution(unit.blocker, {
            id: "test-capacity", value: [attribute.create({ addition: value - unit.definition.blocker.capacity })],
        }),
    }]);
}

export function hook(id, invoke, accepts) {
    return {
        id,
        ...(accepts === undefined ? {} : { accepts }),
        invoke(battle, context) {
            return { state: invoke(battle, context), value: undefined };
        },
    };
}
