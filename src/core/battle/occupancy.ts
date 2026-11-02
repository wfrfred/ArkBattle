import { at } from "../battlefield/occupancy.js";
import type { Ref } from "../common/ref.js";
import type { Context, SupportHook } from "../unit/capability/occupancy/hook.js";
import type { Occupancy } from "../unit/capability/occupancy/capability.js";
import type { Unit } from "../unit/unit.js";
import * as units from "../unit/query.js";
import { replace } from "./unit.js";
import type { State } from "./state.js";

export function enter(battle: State, reference: Ref<Unit & Occupancy>): State {
    const self = units.get(battle, reference);
    if (self?.lifecycle !== "PRESENT" || self.occupancy.tile === null) {
        return battle;
    }

    const tile = self.occupancy.tile;
    const current = at(battle.battlefield, tile)!;
    if (current.support === null || current.occupant === null) {
        return battle;
    }

    const support = units.get(battle, current.support)!;
    const occupant = units.get(battle, current.occupant)!;
    if (support.lifecycle !== "PRESENT" || occupant.lifecycle !== "PRESENT") {
        return battle;
    }

    const previous = support.occupancy.pair;
    if (previous !== null && previous.occupant.id === occupant.id) {
        return battle;
    }
    if (previous !== null) {
        return enter(release(battle, previous), reference);
    }
    if (occupant.occupancy.pair !== null) {
        return enter(release(battle, occupant.occupancy.pair), reference);
    }

    // These snapshots precede the binding write, so they never retain their own pair.
    const pair: Context = { tile, support, occupant };
    battle = replace(battle, [
        { ...support, occupancy: { ...support.occupancy, pair } },
        { ...occupant, occupancy: { ...occupant.occupancy, pair } },
    ]);

    return notify(battle, "occupantAdded", pair);
}

export function leave(battle: State, self: Unit & Occupancy): State {
    return self.occupancy.pair === null ? battle : release(battle, self.occupancy.pair);
}

function release(battle: State, pair: Context): State {
    const updates: (Unit & Occupancy)[] = [];

    for (const self of [pair.support, pair.occupant]) {
        const current = units.get(battle, units.ref(self));
        if (current?.occupancy.pair === pair) {
            updates.push({ ...current, occupancy: { ...current.occupancy, pair: null } });
        }
    }
    // A later entry may already have completed this old binding's removal.
    if (updates.length === 0) {
        return battle;
    }

    battle = replace(battle, updates);

    return notify(battle, "occupantRemoved", pair);
}

function notify(battle: State, stage: SupportHook["stage"], pair: Context): State {
    const definition = pair.support.definition.occupancy;
    if (definition.slot !== "SUPPORT") {
        return battle;
    }

    for (const entry of definition.hooks) {
        if (entry.stage !== stage) {
            continue;
        }
        if (stage === "occupantAdded") {
            const support = units.get(battle, units.ref(pair.support));
            const occupant = units.get(battle, units.ref(pair.occupant));
            if (
                support?.lifecycle !== "PRESENT" ||
                occupant?.lifecycle !== "PRESENT" ||
                support.occupancy.pair !== pair ||
                occupant.occupancy.pair !== pair
            ) {
                break;
            }
        }
        if (entry.accepts?.(battle, pair, undefined) !== false) {
            battle = entry.invoke(battle, pair, undefined).state;
        }
    }

    return battle;
}
