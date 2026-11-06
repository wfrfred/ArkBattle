import type { Result, State as BattleState } from "../../state.js";
import type { Card } from "./card.js";
import type { Rule } from "../rule.js";
import type { Hooks } from "../../../hook.js";

export interface Refund {
    readonly rate: number;
    readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
}

export interface Definition<S extends object = object> {
    readonly cost: number;
    readonly redeployTicks: number;
    readonly slots: number;
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldownOnDeploy: boolean;
    readonly recoverOnRetreatOrDeath: boolean;
    readonly increaseCostOnRetreatOrDeath: boolean;
    readonly refund: Refund | null;
    readonly deploymentRules: readonly Rule[];
    readonly unitHooks: Hooks;
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly onTick?: (battle: BattleState, self: Card<NoInfer<S>>) => BattleState;
}
