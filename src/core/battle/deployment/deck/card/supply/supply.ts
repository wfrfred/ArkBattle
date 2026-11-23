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

export function setStockLimitContribution<T extends Card>(
    card: T,
    entry: Contribution<Modifier>,
): T {
    return replaceStockLimit(card, set(card.supply.stockLimit, entry));
}

export function removeStockLimitContribution<T extends Card>(card: T, id: string): T {
    return replaceStockLimit(card, remove(card.supply.stockLimit, id));
}

function replaceStockLimit<T extends Card>(card: T, stockLimit: State["stockLimit"]): T {
    const supply = replaceIn(card.supply, ["stockLimit"], stockLimit);
    if (supply === card.supply) {
        return card;
    }

    const limit = resolveStockLimit({ ...card, supply }) ?? Infinity;
    const { policy, stock } = supply;
    if (policy.type !== "QUEUED") {
        return { ...card, supply: replaceIn(supply, ["stock"], Math.min(stock, limit)) };
    }

    const pending = Math.min(policy.pending, limit);
    const emptied = pending === 0 && policy.pending > 0;

    return {
        ...card,
        supply: {
            ...supply,
            stock: Math.min(stock, limit - pending),
            policy: { ...policy, pending },
            cooldown: emptied ? 0 : supply.cooldown,
            paused: emptied ? false : supply.paused,
        },
    };
}

export function setActiveLimitContribution<T extends Card>(
    card: T,
    entry: Contribution<Modifier>,
): T {
    const supply = replaceIn(card.supply, ["activeLimit"], set(card.supply.activeLimit, entry));

    return supply === card.supply ? card : { ...card, supply };
}

export function removeActiveLimitContribution<T extends Card>(card: T, id: string): T {
    const supply = replaceIn(card.supply, ["activeLimit"], remove(card.supply.activeLimit, id));

    return supply === card.supply ? card : { ...card, supply };
}

export function setRedeployTimeContribution<T extends Card>(
    card: T,
    entry: Contribution<readonly Modifier[]>,
): T {
    const supply = replaceIn(card.supply, ["redeployTime"], set(card.supply.redeployTime, entry));

    return supply === card.supply ? card : { ...card, supply };
}

export function removeRedeployTimeContribution<T extends Card>(card: T, id: string): T {
    const supply = replaceIn(card.supply, ["redeployTime"], remove(card.supply.redeployTime, id));

    return supply === card.supply ? card : { ...card, supply };
}
