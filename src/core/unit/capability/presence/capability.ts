import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";

export interface Definition {}

export interface State {
    readonly present: boolean;
}

export interface SpatialPresence {
    readonly definition: { readonly spatialPresence: Definition };
    readonly spatialPresence: State;
}

export function hasSpatialPresence<U extends Unit>(unit: U): unit is U & SpatialPresence {
    return "spatialPresence" in unit && "spatialPresence" in unit.definition;
}

export function initialize<U extends Unit & Pick<SpatialPresence, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & SpatialPresence> {
    return { state: battle, value: { ...unit, spatialPresence: { present: true } } };
}

export function isSpatiallyPresent(unit: Unit): boolean {
    return !hasSpatialPresence(unit) || unit.spatialPresence.present;
}
