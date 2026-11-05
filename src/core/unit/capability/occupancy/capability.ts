import type { TilePosition } from "../../../geometry/coordinate.js";
import type { Direction } from "../../../geometry/direction.js";
import type { Unit } from "../../unit.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { enter, leave } from "../../../battle/occupancy.js";
import { ref } from "../../query.js";
import * as lifecycle from "../../hook.js";

export type Slot = "OCCUPANT" | "SUPPORT";

export type Definition =
    | { readonly slot: "OCCUPANT" }
    | {
          readonly slot: "SUPPORT";
          readonly onOccupantAdded?: (battle: BattleState, pair: Pair) => BattleState;
          readonly onOccupantRemoved?: (battle: BattleState, pair: Pair) => BattleState;
      };

export interface Pair {
    readonly support: Unit &
        Occupancy & {
            readonly definition: {
                readonly occupancy: Extract<Definition, { readonly slot: "SUPPORT" }>;
            };
        };
    readonly occupant: Unit & Occupancy;
    readonly tile: TilePosition;
}

export interface State {
    readonly tile: TilePosition | null;
    readonly direction: Direction | null;
    readonly pair: Pair | null;
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
            hooks: unit.hooks
                .set(lifecycle.enter, {
                    id: "@occupancy/enter",
                    invoke: (current, self) => ({
                        state: enter(current, ref(self as Unit & Occupancy)),
                        value: undefined,
                    }),
                })
                .set(lifecycle.leave, {
                    id: "@occupancy/leave",
                    invoke: (current, departure) => ({
                        state: leave(current, departure.unit as Unit & Occupancy),
                        value: undefined,
                    }),
                }),
            occupancy: {
                tile: initial?.tile ?? null,
                direction: initial?.direction ?? null,
                pair: null,
            },
        },
    };
}
