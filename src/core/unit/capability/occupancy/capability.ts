import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Direction } from "../../../geometry/direction.js";
import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Context, SupportHook } from "./hook.js";
import { enter, leave } from "../../../battle/occupancy.js";
import { ref } from "../../query.js";

export type Slot = "OCCUPANT" | "SUPPORT";

export type Definition =
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly hooks: readonly SupportHook[];
      };

export interface State {
    readonly tile: TilePosition | null;
    readonly direction: Direction | null;
    readonly pair: Context | null;
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
            hooks: [
                ...unit.hooks,
                {
                    id: "@occupancy/enter",
                    stage: "enter",
                    invoke: (current, self) => ({
                        state: enter(current, ref(self as Unit & Occupancy)),
                        value: undefined,
                    }),
                },
                {
                    id: "@occupancy/leave",
                    stage: "leave",
                    invoke: (current, departure) => ({
                        state: leave(current, departure.unit as Unit & Occupancy),
                        value: undefined,
                    }),
                },
            ],
            occupancy: {
                tile: initial?.tile ?? null,
                direction: initial?.direction ?? null,
                pair: null,
            },
        },
    };
}
