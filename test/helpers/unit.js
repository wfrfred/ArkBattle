import { Hooks } from "../../dist/core/hook.js";
import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { initialize as initializeUnit } from "../../dist/core/unit/index.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { create } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "./tiles.js";
import { Effects } from "../../dist/core/unit/effect/effects.js";

const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});
const map = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function fixtureBattle(tick = 0, execution = {}) {
    const battle = createBattleState(create(map));
    return { ...battle, tick, execution: { ...battle.execution, ...execution } };
}

export function baseUnit(definition, fields = {}) {
    return {
        id: 0,
        lifecycle: "PRESENT",
        position: [0, 0],
        ...fields,
        definition,
        hooks: Hooks.empty(),
        effects: Effects.empty(),
    };
}

export function initialize({ tick = 0, ...input }) {
    return initializeUnit(fixtureBattle(tick), input).value;
}

export function getUnit(battle, id) {
    return battle.battlefield.units.get(id);
}
