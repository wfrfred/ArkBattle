import type { Result, State as BattleState } from "../../state.js";
import type { Card } from "./card.js";

export interface Definition<S extends object = object> {
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<S>) => BattleState;
}
