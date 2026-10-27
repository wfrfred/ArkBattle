import { tiles as tileEntries } from './tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { initialize as initializeUnit } from "../../dist/core/unit/index.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { update as updateUnit } from "../../dist/core/battle/unit.js";
import { create } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "./tiles.js";
import { actionCapability } from "./actions.js";

const tile = createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
});
const map = createMap(1, 32, tileEntries(Array(32).fill(tile)));

export function fixtureBattle(tick = 0, execution = {}) {
    const battle = createBattleState(create(map));
    return { ...battle, tick, execution: { ...battle.execution, ...execution } };
}

export function fixtureDefinition(capability) {
    switch (capability) {
        case "offense": return { attack: 0 };
        case "vitality": return { maxHp: 100, defense: 0, resistance: 0 };
        case "action": return actionCapability();
        case "locomotion": return {
            halfBodyWidth: 0, minSpeed: 0, speed: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
        };
        case "targetable": return { restrictions: [] };
        case "spatialPresence": return {};
        case "occupancy": return { slot: "OCCUPANT" };
        default: throw new Error(`fixture definition required for ${capability}`);
    }
}

const definitions = new WeakMap();

export function initialize({ states = {}, tick = 0, definition, ...input }) {
    const additional = ["targetable", "spatialPresence", "occupancy"].filter(
        key => key in states && !(key in definition),
    );
    const defaultHooks = !("hooks" in definition);
    let paired = definition;
    if (additional.length || defaultHooks) {
        let versions = definitions.get(definition);
        if (versions === undefined) definitions.set(definition, versions = new Map());
        const key = [...additional, defaultHooks ? "hooks" : ""].join(":");
        paired = versions.get(key);
        if (paired === undefined) {
            paired = { ...definition, ...(defaultHooks ? { hooks: [] } : {}),
                ...Object.fromEntries(additional.map(key => [key, fixtureDefinition(key)])) };
            versions.set(key, paired);
        }
    }
    for (const key of Object.keys(states)) {
        if (!(key in paired)) throw new Error(`prepared capability ${key} requires configuration`);
    }
    const result = initializeUnit(fixtureBattle(tick), { ...input, definition: paired });
    return { ...result.value, ...states };
}

export function placement({ states = {}, definition, ...input }) {
    return {
        ...input,
        definition: {
            ...definition,
            hooks: [{
                id: "fixture/prepared-state", stage: "enter",
                invoke(battle, self) {
                    return { state: updateUnit(battle, [{ ...self, ...states }]), value: undefined };
                },
            }, ...(definition.hooks ?? [])],
        },
    };
}

export function getUnit(battle, id) {
    return battle.battlefield.units.get(id);
}

export function transitionUnit(battle, id, transform) {
    const current = getUnit(battle, id);
    if (current === undefined) return battle;
    const next = transform(current);
    if (next.id !== id) throw new TypeError("unit transition cannot change identity");
    return updateUnit(battle, [next]);
}
