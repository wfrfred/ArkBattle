import type { State as BattleState } from "../battle/state.js";
import type { Projectile } from "./projectile.js";

export type EndReason = "ARRIVED" | "EXPIRED" | "EXPLICIT" | "SOURCE_UNAVAILABLE" | "ELIMINATED";

export interface Definition<S extends object = object, T extends object = object> {
    readonly id: string;
    readonly onEnter?: (battle: BattleState, self: Projectile<S, T> & T) => BattleState;
    readonly onTick?: (battle: BattleState, self: Projectile<S, T> & T) => BattleState;
    readonly onEnd?: (
        battle: BattleState,
        self: Projectile<S, T> & T,
        reason: EndReason,
    ) => BattleState;
}
