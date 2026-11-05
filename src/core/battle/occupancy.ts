import { at } from "../battlefield/occupancy.js";
import type { Ref } from "../common/ref.js";
import type { Occupancy, Pair } from "../unit/capability/occupancy/capability.js";
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

    const support = units.get(battle, current.support)! as Pair["support"];
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

    const pair: Pair = { tile, support, occupant };
    battle = replace(battle, [
        { ...support, occupancy: { ...support.occupancy, pair } },
        { ...occupant, occupancy: { ...occupant.occupancy, pair } },
    ]);

    return support.definition.occupancy.onOccupantAdded?.(battle, pair) ?? battle;
}

export function leave(battle: State, self: Unit & Occupancy): State {
    return self.occupancy.pair === null ? battle : release(battle, self.occupancy.pair);
}

function release(battle: State, pair: Pair): State {
    const updates: (Unit & Occupancy)[] = [];

    for (const self of [pair.support, pair.occupant]) {
        const current = units.get(battle, units.ref(self));
        if (current?.occupancy.pair === pair) {
            updates.push({ ...current, occupancy: { ...current.occupancy, pair: null } });
        }
    }
    if (updates.length === 0) {
        return battle;
    }

    battle = replace(battle, updates);

    return pair.support.definition.occupancy.onOccupantRemoved?.(battle, pair) ?? battle;
}
