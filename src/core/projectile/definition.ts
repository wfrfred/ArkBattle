import type { State as BattleState } from "../battle/state.js";
import type { Projectile } from "./projectile.js";

export type EndReason = "ARRIVED" | "EXPIRED" | "EXPLICIT" | "SOURCE_UNAVAILABLE" | "ELIMINATED";

type Callback<S extends object, T extends object> = (
    battle: BattleState,
    self: Projectile<S, T> & T,
) => BattleState;

export interface Definition<S extends object = object, T extends object = object> {
    readonly id: string;
    readonly onEnter?: Callback<S, T>;
    readonly onTick?: Callback<S, T>;
    readonly onEnd?: (
        battle: BattleState,
        self: Projectile<S, T> & T,
        reason: EndReason,
    ) => BattleState;
}
