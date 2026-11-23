import { remove, set } from "../../../../../common/collection/entries.js";
import type { Contribution } from "../../../../../common/contribution.js";
import type { Modifier } from "../../../../../common/modifier.js";
import { replaceIn } from "../../../../../common/object.js";
import type { Card } from "../card.js";
import { resolveStockLimit } from "./query.js";

export type Policy =
    | { readonly type: "DEFAULT" }
    | { readonly type: "UNIQUE" }
    | { readonly type: "QUEUED"; readonly pending: number };

export interface Definition {
    readonly policy: Policy;
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldown: number;
}

export interface State {
    readonly policy: Policy;
    readonly stock: number;
    readonly cooldown: number;
    readonly paused: boolean;
    readonly stockLimit: readonly Contribution<Modifier>[];
    readonly activeLimit: readonly Contribution<Modifier>[];
    readonly redeployTime: readonly Contribution<readonly Modifier[]>[];
}

export function setStockLimitContribution<S extends object>(
    card: Card<S>,
    entry: Contribution<Modifier>,
): Card<S> {
    return replaceStockLimit(card, set(card.supply.stockLimit, entry));
}

export function removeStockLimitContribution<S extends object>(card: Card<S>, id: string): Card<S> {
    return replaceStockLimit(card, remove(card.supply.stockLimit, id));
}

function replaceStockLimit<S extends object>(
    card: Card<S>,
    stockLimit: State["stockLimit"],
): Card<S> {
    const next = replaceIn(card, ["supply", "stockLimit"], stockLimit);
    if (next === card) {
        return card;
    }

    const limit = resolveStockLimit(next) ?? Infinity;
    const { supply } = next;
    const { policy, stock } = supply;
    if (policy.type !== "QUEUED") {
        return replaceIn(next, ["supply", "stock"], Math.min(stock, limit));
    }

    const pending = Math.min(policy.pending, limit);
    const emptied = pending === 0 && policy.pending > 0;

    return replaceIn(next, ["supply"], {
        ...supply,
        stock: Math.min(stock, limit - pending),
        policy: { ...policy, pending },
        cooldown: emptied ? 0 : supply.cooldown,
        paused: emptied ? false : supply.paused,
    });
}

export function setActiveLimitContribution<S extends object>(
    card: Card<S>,
    entry: Contribution<Modifier>,
): Card<S> {
    return replaceIn(card, ["supply", "activeLimit"], set(card.supply.activeLimit, entry));
}

export function removeActiveLimitContribution<S extends object>(
    card: Card<S>,
    id: string,
): Card<S> {
    return replaceIn(card, ["supply", "activeLimit"], remove(card.supply.activeLimit, id));
}

export function setRedeployTimeContribution<S extends object>(
    card: Card<S>,
    entry: Contribution<readonly Modifier[]>,
): Card<S> {
    return replaceIn(card, ["supply", "redeployTime"], set(card.supply.redeployTime, entry));
}

export function removeRedeployTimeContribution<S extends object>(
    card: Card<S>,
    id: string,
): Card<S> {
    return replaceIn(card, ["supply", "redeployTime"], remove(card.supply.redeployTime, id));
}
