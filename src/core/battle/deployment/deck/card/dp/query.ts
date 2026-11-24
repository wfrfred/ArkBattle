import { resolve } from "../../../../../common/contribution.js";
import type { Card } from "../card.js";

export function resolveBaseCost<S extends object>(card: Card<S>): number {
    const parameters = card.definition.dp.parameters;
    let addition = parameters.baseAddition;

    for (const value of resolve(card.dp.contributions)) {
        addition += value.baseAddition;
    }

    return Math.max(0, Math.floor(parameters.cost + addition));
}

export function resolveCost<S extends object>(card: Card<S>, ceiling = 99): number {
    const parameters = card.definition.dp.parameters;
    let { baseAddition, step, maxMultiplier, costScale, finalAddition } = parameters;
    let cost: number | null = null;

    for (const value of resolve(card.dp.contributions)) {
        cost ??= value.cost;
        baseAddition += value.baseAddition;
        step += value.step;
        maxMultiplier += value.maxMultiplier;
        costScale *= value.costScale;
        finalAddition += value.finalAddition;
    }

    const base = cost ?? parameters.cost + baseAddition;
    const multiplier = Math.min(1 + card.dp.stage * step, Math.max(1, maxMultiplier));
    const rawCost = Math.floor(base * multiplier);

    return Math.max(0, Math.min(ceiling, Math.floor(rawCost * costScale) + finalAddition));
}

export function resolveIncrease<S extends object>(card: Card<S, "UNIQUE">): boolean {
    return card.definition.dp.increase && resolve(card.dp.increase).every(Boolean);
}
