import * as entries from "../../../../../common/collection/entries.js";
import type { Contribution } from "../../../../../common/contribution.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card, Policy } from "../card.js";
import type { Parameters } from "./parameter.js";

export interface Refund {
    readonly rate: number;
    readonly limit: "BASE_COST" | "DEPLOYMENT_COST";
}

export type Definition<P extends Policy = Policy> = {
    readonly parameters: Parameters & { readonly cost: number };
    readonly refund: Refund | null;
} & (P extends "UNIQUE" ? { readonly increase: boolean } : object);

export type State<P extends Policy = Policy> = {
    readonly stage: number;
    readonly contributions: readonly Contribution<Parameters>[];
} & (P extends "UNIQUE" ? { readonly increase: readonly Contribution<boolean>[] } : object);

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

export function setIncreaseContribution<S extends object>(
    card: Card<S, "UNIQUE">,
    entry: Contribution<boolean>,
): Card<S, "UNIQUE"> {
    return replaceIn(card, ["dp", "increase"], entries.set(card.dp.increase, entry));
}

export function removeIncreaseContribution<S extends object>(
    card: Card<S, "UNIQUE">,
    id: string,
): Card<S, "UNIQUE"> {
    return replaceIn(card, ["dp", "increase"], entries.remove(card.dp.increase, id));
}
