import type { State as BattleState } from "./battle/state.js";

export interface Rule<C> {
    readonly id: string;
    readonly allows: (battle: BattleState, context: C) => boolean;
}
