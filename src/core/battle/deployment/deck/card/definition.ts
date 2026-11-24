import type { Contribution } from "../../../../common/contribution.js";
import type { Result, State as BattleState } from "../../../state.js";
import type { Card, Policy } from "./card.js";
import type { Restriction } from "../../restriction.js";
import type { Hooks } from "../../../../hook.js";
import type * as dp from "./dp/index.js";
import type * as supply from "./supply/supply.js";

export type Definition<S extends object = object, P extends Policy = Policy> = {
    readonly slot: number;
    readonly deploymentRestrictions: readonly Contribution<Restriction>[];
    readonly unitHooks: Hooks;
    readonly initialize: (battle: BattleState) => Result<S>;
} & {
    [K in Policy]: {
        readonly policy: K;
        readonly dp: dp.Definition<K>;
        readonly supply: supply.Definition<K>;
        readonly onTick?: (battle: BattleState, self: Card<NoInfer<S>, K>) => BattleState;
    };
}[P];
