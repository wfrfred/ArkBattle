import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { SupportHook } from "./hook.js";

export type Slot = "OCCUPANT" | "SUPPORT";

export type Definition =
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly hooks: readonly SupportHook[];
      };

export interface State {
    readonly tile: TilePosition | null;
}

export interface Occupancy {
    readonly definition: { readonly occupancy: Definition };
    readonly occupancy: State;
}

export function hasOccupancy<U extends Unit>(unit: U): unit is U & Occupancy {
    return "occupancy" in unit && "occupancy" in unit.definition;
}

export const initialize: (battle: BattleState, definition: Definition) => Result<State> = (
    battle,
) => {
    return { state: battle, value: { tile: null } };
};
