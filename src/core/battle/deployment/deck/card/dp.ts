import * as entries from "../../../../common/collection/entries.js";
import * as contribution from "../../../../common/contribution.js";
import type { Modifier } from "../../../../common/modifier.js";
import type { Card, Policy } from "./card.js";

export interface Refund {
    readonly rate: number;
    readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
}

export interface Definition {
    readonly cost: number;
    readonly increaseCostOnRetreatOrDeath: boolean;
    readonly refund: Refund | null;
}

export interface State {
    readonly stage: number;
    readonly cost: readonly contribution.Contribution<readonly Modifier[]>[];
}

export function resolveBaseCost<S extends object>(card: Card<S>): number {
    const addition = contribution
        .resolve(card.dp.cost)
        .flat()
        .reduce((sum, value) => sum + value.addition, 0);

    return Math.max(0, Math.floor(card.definition.dp.cost + addition));
}

export function resolveCost<S extends object>(card: Card<S>, ceiling = 99): number {
    const modifiers = contribution.resolve(card.dp.cost).flat();
    const baseCost = Math.max(
        0,
        Math.floor(
            card.definition.dp.cost + modifiers.reduce((sum, value) => sum + value.addition, 0),
        ),
    );
    const rawCost = Math.floor(baseCost * (1 + 0.5 * card.dp.stage));
    const scale =
        (1 + modifiers.reduce((sum, value) => sum + value.multiplier, 0)) *
        modifiers.reduce((product, value) => product * value.finalScaler, 1);
    const addition = modifiers.reduce((sum, value) => sum + value.finalAddition, 0);

    return Math.max(0, Math.min(ceiling, Math.floor(rawCost * scale) + addition));
}

export function incrementCostStage<S extends object, P extends Policy>(
    card: Card<S, P>,
): Card<S, P> {
    const stage = Math.min(2, card.dp.stage + 1);

    return stage === card.dp.stage ? card : { ...card, dp: { ...card.dp, stage } };
}

export function setCostContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    entry: contribution.Contribution<readonly Modifier[]>,
): Card<S, P> {
    const cost = entries.set(card.dp.cost, entry);

    return cost === card.dp.cost ? card : { ...card, dp: { ...card.dp, cost } };
}

export function removeCostContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    id: string,
): Card<S, P> {
    const cost = entries.remove(card.dp.cost, id);

    return cost === card.dp.cost ? card : { ...card, dp: { ...card.dp, cost } };
}
