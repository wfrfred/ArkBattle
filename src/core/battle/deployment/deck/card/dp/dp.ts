import * as entries from "../../../../../common/collection/entries.js";
import type { Contribution } from "../../../../../common/contribution.js";
import type { Card, Policy } from "../card.js";
import type { Parameters } from "./parameter.js";

export interface Refund {
    readonly rate: number;
    readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
}

export interface Definition {
    readonly parameters: Parameters & { readonly cost: number };
    readonly refund: Refund | null;
}

export interface State {
    readonly stage: number;
    readonly contributions: readonly Contribution<Parameters>[];
}

export function incrementCostStage<S extends object, P extends Policy>(
    card: Card<S, P>,
): Card<S, P> {
    return { ...card, dp: { ...card.dp, stage: card.dp.stage + 1 } };
}

export function setCostContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    entry: Contribution<Parameters>,
): Card<S, P> {
    const contributions = entries.set(card.dp.contributions, entry);

    return contributions === card.dp.contributions
        ? card
        : { ...card, dp: { ...card.dp, contributions } };
}

export function removeCostContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    id: string,
): Card<S, P> {
    const contributions = entries.remove(card.dp.contributions, id);

    return contributions === card.dp.contributions
        ? card
        : { ...card, dp: { ...card.dp, contributions } };
}
