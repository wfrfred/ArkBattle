import type { Ref } from "../common/ref.js";
import { hasOccupancy } from "../unit/capability/occupancy/capability.js";
import { ref } from "../unit/query.js";
import type { Unit } from "../unit/unit.js";
import { contains } from "./map/map.js";
import type { State } from "./state.js";

type Change =
    | { readonly type: "ADD"; readonly next: Unit }
    | { readonly type: "UPDATE"; readonly previous: Unit; readonly next: Unit }
    | { readonly type: "REMOVE"; readonly previous: Unit };

export function add(state: State, unit: Unit): State {
    if (state.units.has(unit.id)) {
        throw new RangeError(`duplicate unit: ${unit.id}`);
    }

    return applyChanges(state, [{ type: "ADD", next: unit }]);
}

export function update(state: State, updates: readonly Unit[]): State {
    const changes: Change[] = [];

    for (const unit of updates) {
        const previous = state.units.get(unit.id)!;
        if (previous !== unit) {
            changes.push({ type: "UPDATE", previous, next: unit });
        }
    }

    return applyChanges(state, changes);
}

export function remove(state: State, reference: Ref<Unit>): State {
    const previous = state.units.get(reference.id);
    if (previous === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    return applyChanges(state, [{ type: "REMOVE", previous }]);
}

function applyChanges(state: State, changes: readonly Change[]): State {
    if (changes.length === 0) {
        return state;
    }

    const units = new Map(state.units);

    for (const change of changes) {
        if (change.type === "REMOVE") {
            units.delete(change.previous.id);
        } else {
            units.set(change.next.id, change.next);
        }
    }

    const occupancyChanges = changes.filter((change) => {
        const before =
            change.type !== "ADD" && hasOccupancy(change.previous)
                ? change.previous.occupancy.tile
                : null;
        const after =
            change.type !== "REMOVE" && hasOccupancy(change.next)
                ? change.next.occupancy.tile
                : null;

        return before !== after && (before?.[0] !== after?.[0] || before?.[1] !== after?.[1]);
    });
    if (occupancyChanges.length === 0) {
        return { ...state, units };
    }

    const occupancy = new Map(state.occupancy);

    for (const change of occupancyChanges) {
        if (change.type === "ADD" || !hasOccupancy(change.previous)) {
            continue;
        }

        const before = change.previous.occupancy.tile;
        if (before === null) {
            continue;
        }

        const key = before[0] * state.map.columns + before[1];
        const entry = occupancy.get(key)!;
        const slot =
            change.previous.definition.occupancy.slot === "OCCUPANT" ? "occupant" : "support";
        const next = { ...entry, [slot]: null };
        if (next.occupant === null && next.support === null) {
            occupancy.delete(key);
        } else {
            occupancy.set(key, next);
        }
    }

    for (const change of occupancyChanges) {
        if (change.type === "REMOVE" || !hasOccupancy(change.next)) {
            continue;
        }

        const unit = change.next;
        const tile = unit.occupancy.tile;
        if (tile === null) {
            continue;
        }

        if (!contains(state.map, tile)) {
            throw new RangeError("occupancy tile is outside the battlefield");
        }

        const key = tile[0] * state.map.columns + tile[1];
        const entry = occupancy.get(key) ?? { occupant: null, support: null };
        const slot = unit.definition.occupancy.slot === "OCCUPANT" ? "occupant" : "support";
        if (entry[slot] !== null) {
            throw new RangeError("occupancy slot is already occupied");
        }

        occupancy.set(key, { ...entry, [slot]: ref(unit) });
    }

    return { ...state, units, occupancy };
}
