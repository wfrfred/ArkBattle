import { remove, set } from "../../../../../common/collection/entries.js";
import type { Contribution } from "../../../../../common/contribution.js";
import type { Modifier } from "../../../../../common/modifier.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card, Policy } from "../card.js";
import { resolveStockLimit } from "./query.js";

export type Definition<P extends Policy = Policy> = {
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldown: number;
} & (P extends "QUEUED" ? { readonly pending: number } : object);

export type State<P extends Policy = Policy> = {
    readonly stock: number;
    readonly cooldown: number;
    readonly paused: boolean;
    readonly stockLimit: readonly Contribution<Modifier>[];
    readonly activeLimit: readonly Contribution<Modifier>[];
    readonly redeployTime: readonly Contribution<readonly Modifier[]>[];
} & (P extends "QUEUED" ? { readonly pending: number } : object);

export function setStockLimitContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    entry: Contribution<Modifier>,
): Card<S, P> {
    return replaceStockLimit(card, set(card.supply.stockLimit, entry));
}

export function removeStockLimitContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    id: string,
): Card<S, P> {
    return replaceStockLimit(card, remove(card.supply.stockLimit, id));
}

function replaceStockLimit<S extends object, P extends Policy>(
    card: Card<S, P>,
    stockLimit: State["stockLimit"],
): Card<S, P>;
function replaceStockLimit<S extends object>(
    card: Card<S>,
    stockLimit: State["stockLimit"],
): Card<S> {
    const next = replaceIn(card, ["supply", "stockLimit"], stockLimit);
    if (next === card) {
        return card;
    }

    const limit = resolveStockLimit(next) ?? Infinity;
    if (next.policy !== "QUEUED") {
        return replaceIn(next, ["supply", "stock"], Math.min(next.supply.stock, limit));
    }

    const { supply } = next;
    const pending = Math.min(supply.pending, limit);
    const emptied = pending === 0 && supply.pending > 0;

    return replaceIn(next, ["supply"], {
        ...supply,
        stock: Math.min(supply.stock, limit - pending),
        pending,
        cooldown: emptied ? 0 : supply.cooldown,
        paused: emptied ? false : supply.paused,
    });
}

export function setActiveLimitContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    entry: Contribution<Modifier>,
): Card<S, P> {
    const activeLimit = set(card.supply.activeLimit, entry);

    return activeLimit === card.supply.activeLimit
        ? card
        : { ...card, supply: { ...card.supply, activeLimit } };
}

export function removeActiveLimitContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    id: string,
): Card<S, P> {
    const activeLimit = remove(card.supply.activeLimit, id);

    return activeLimit === card.supply.activeLimit
        ? card
        : { ...card, supply: { ...card.supply, activeLimit } };
}

export function setRedeployTimeContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    entry: Contribution<readonly Modifier[]>,
): Card<S, P> {
    const redeployTime = set(card.supply.redeployTime, entry);

    return redeployTime === card.supply.redeployTime
        ? card
        : { ...card, supply: { ...card.supply, redeployTime } };
}

export function removeRedeployTimeContribution<S extends object, P extends Policy>(
    card: Card<S, P>,
    id: string,
): Card<S, P> {
    const redeployTime = remove(card.supply.redeployTime, id);

    return redeployTime === card.supply.redeployTime
        ? card
        : { ...card, supply: { ...card.supply, redeployTime } };
}
