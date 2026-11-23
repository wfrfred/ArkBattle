import * as contribution from "../../../../../common/contribution.js";
import * as modifier from "../../../../../common/modifier.js";
import type { Card } from "../card.js";

export function isReady(card: Card): boolean {
    return card.supply.policy.type === "QUEUED" || card.supply.cooldown === 0;
}

export function resolveStockLimit(card: Card): number | null {
    return resolveLimit(card.definition.supply.stockLimit, card.supply.stockLimit);
}

export function resolveActiveLimit(card: Card): number | null {
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

export function resolveCooldown(card: Card): number {
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
