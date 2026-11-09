import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";

export interface Definition {}

export interface State {
    readonly present: boolean;
}

export interface Presence {
    readonly definition: { readonly presence: Definition };
    readonly presence: State;
}

export function hasPresence<U extends Unit>(unit: U): unit is U & Presence {
    return "presence" in unit && "presence" in unit.definition;
}

export function initialize<U extends Unit & Pick<Presence, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Presence> {
    return { state: battle, value: { ...unit, presence: { present: true } } };
}

export function isPresent(unit: Unit): boolean {
    return !hasPresence(unit) || unit.presence.present;
}
