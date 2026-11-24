import { resolve as resolveContributions } from "../../../../../common/contribution.js";
import type { Card } from "../card.js";
import type { Parameters } from "./parameter.js";

export function resolve<S extends object>(card: Card<S>): Parameters {
    let { baseAddition, step, maxMultiplier, costScale, finalAddition, increase } =
        card.definition.dp.parameters;
    let cost: number | null = null;

    for (const value of resolveContributions(card.dp.contributions)) {
        cost ??= value.cost;
        baseAddition += value.baseAddition;
        step += value.step;
        maxMultiplier += value.maxMultiplier;
        costScale *= value.costScale;
        finalAddition += value.finalAddition;
        increase &&= value.increase;
    }

    return { cost, baseAddition, step, maxMultiplier, costScale, finalAddition, increase };
}

export function resolveBaseCost<S extends object>(card: Card<S>): number {
    const { baseAddition } = resolve(card);

    return Math.max(0, Math.floor(card.definition.dp.parameters.cost + baseAddition));
}

export function resolveCost<S extends object>(card: Card<S>, ceiling = 99): number {
    const { cost, baseAddition, step, maxMultiplier, costScale, finalAddition } = resolve(card);
    const base = cost ?? card.definition.dp.parameters.cost + baseAddition;
    const multiplier = Math.min(1 + card.dp.stage * step, Math.max(1, maxMultiplier));
    const rawCost = Math.floor(base * multiplier);

    return Math.max(0, Math.min(ceiling, Math.floor(rawCost * costScale) + finalAddition));
}
