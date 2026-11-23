import * as contribution from "../../../../../common/contribution.js";
import * as modifier from "../../../../../common/modifier.js";
import type { Card, Policy } from "../card.js";

export function total<S extends object, P extends Policy>(card: Card<S, P>): number;
export function total<S extends object>(card: Card<S>): number {
    return card.policy === "QUEUED" ? card.supply.stock + card.supply.pending : card.supply.stock;
}

export function remaining<S extends object, P extends Policy>(card: Card<S, P>): number | null {
    const limit = resolveStockLimit(card);

    return limit === null ? null : limit - total(card);
}

export function isReady<S extends object, P extends Policy>(card: Card<S, P>): boolean {
    return card.policy === "QUEUED" || card.supply.cooldown === 0;
}

export function resolveStockLimit<S extends object, P extends Policy>(
    card: Card<S, P>,
): number | null {
    return resolveLimit(card.definition.supply.stockLimit, card.supply.stockLimit);
}

export function resolveActiveLimit<S extends object, P extends Policy>(
    card: Card<S, P>,
): number | null {
    return resolveLimit(card.definition.supply.activeLimit, card.supply.activeLimit);
}

function resolveLimit(
    limit: number | null,
    contributions: readonly contribution.Contribution<modifier.Modifier>[],
): number | null {
    return limit === null
        ? null
        : Math.max(0, Math.floor(modifier.apply(limit, contribution.resolve(contributions))));
}

export function resolveCooldown<S extends object, P extends Policy>(card: Card<S, P>): number {
    return Math.max(
        0,
        Math.ceil(
            modifier.apply(
                card.definition.supply.cooldown,
                contribution.resolve(card.supply.redeployTime).flat(),
            ),
        ),
    );
}
