import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Direction } from "../../../geometry/direction.js";
import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { SupportHook } from "./hook.js";

export type Slot = "OCCUPANT" | "SUPPORT";

export type Definition = { readonly direction?: Direction } & (
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly hooks: readonly SupportHook[];
      }
);

export interface State {
    readonly tile: TilePosition | null;
    readonly direction: Direction | null;
}

export interface Initial {
    readonly tile?: TilePosition | null;
    readonly direction?: Direction;
}

export interface Occupancy {
    readonly definition: { readonly occupancy: Definition };
    readonly occupancy: State;
}

export type Directional = Occupancy & {
    readonly occupancy: { readonly direction: Direction };
};

export function hasOccupancy<U extends Unit>(unit: U): unit is U & Occupancy {
    return "occupancy" in unit && "occupancy" in unit.definition;
}

export function hasDirection<U extends Unit>(unit: U): unit is U & Directional {
    return hasOccupancy(unit) && unit.occupancy.direction !== null;
}

export function initialize<U extends Unit & Pick<Occupancy, "definition">>(
    battle: BattleState,
    unit: U,
    initial?: Initial,
): Result<U & Occupancy> {
    return {
        state: battle,
        value: {
            ...unit,
            occupancy: {
                tile: initial?.tile ?? null,
                direction: initial?.direction ?? unit.definition.occupancy.direction ?? null,
            },
        },
    };
}
