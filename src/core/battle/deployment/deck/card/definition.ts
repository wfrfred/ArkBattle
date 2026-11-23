import type { Contribution } from "../../../../common/contribution.js";
import type { Result, State as BattleState } from "../../../state.js";
import type { Card } from "./card.js";
import type { Restriction } from "../../restriction.js";
import type { Hooks } from "../../../../hook.js";
import type * as dp from "./dp.js";
import type * as supply from "./supply.js";

export interface Definition<S extends object = object> {
    readonly dp: dp.Definition;
    readonly slot: number;
    readonly supply: supply.Definition;
    readonly deploymentRestrictions: readonly Contribution<Restriction>[];
    readonly unitHooks: Hooks;
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<NoInfer<S>>) => BattleState;
}
