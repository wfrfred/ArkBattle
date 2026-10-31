import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";

export type Type = "GROUND" | "AIR";

export interface Definition {
    readonly type: Type;
}

export interface State {
    readonly type: Type;
}

export interface Layer {
    readonly definition: { readonly layer: Definition };
    readonly layer: State;
}

export function hasLayer<U extends Unit>(unit: U): unit is U & Layer {
    return "layer" in unit && "layer" in unit.definition;
}

export function initialize<U extends Unit & Pick<Layer, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Layer> {
    return { state: battle, value: { ...unit, layer: { type: unit.definition.layer.type } } };
}
