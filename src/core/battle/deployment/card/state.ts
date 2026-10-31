import * as contribution from "../../../unit/contribution/contribution.js";
import * as attribute from "../../../unit/contribution/attribute.js";
import type { LeaveReason } from "../../../unit/unit.js";
import type { Card, Cooldown } from "./card.js";

export function resolveBaseCost(card: Card<any>): number {
    const addition = contribution
        .resolve(card.costContributions)
        .flat()
        .reduce((sum, value) => sum + value.addition, 0);

    return Math.max(0, Math.floor(card.definition.deployable.cost + addition));
}

export function resolveCost(card: Card<any>): number {
    const penalty: attribute.Modifier = {
        addition: 0,
        multiplier: 0.5 * card.costStage,
        finalAddition: 0,
        finalScaler: 1,
    };

    return Math.max(
        0,
        Math.floor(
            attribute.apply(card.definition.deployable.cost, [
                ...contribution.resolve(card.costContributions).flat(),
                penalty,
            ]),
        ),
    );
}

export function resolveRedeployTicks(card: Card<any>): number {
    return Math.max(
        0,
        Math.ceil(
            attribute.apply(
                card.definition.deployable.redeployTicks,
                contribution.resolve(card.redeployTimeContributions).flat(),
            ),
        ),
    );
}

function startCooldown(card: Card<any>, tick: number): Cooldown {
    const durationTicks = resolveRedeployTicks(card);

    return { readyAtTick: tick + durationTicks, durationTicks };
}

export function consume<T extends Card<any>>(card: T, tick: number): T {
    return {
        ...card,
        stock: card.stock === null ? null : card.stock - 1,
        cooldown: card.supply.recharge === "DEPLOYMENT" ? startCooldown(card, tick) : card.cooldown,
    };
}

export function recycle<T extends Card<any>>(
    card: T,
    tick: number,
    reason: LeaveReason | "MOVE",
): T {
    const costStage =
        card.supply.costPenalty && (reason === "RETREAT" || reason === "DEATH")
            ? Math.min(2, card.costStage + 1)
            : card.costStage;

    switch (card.supply.recharge) {
        case "DEPLOYMENT":
            return costStage === card.costStage ? card : { ...card, costStage };

        case "RETURN":
            return { ...card, costStage, cooldown: startCooldown(card, tick) };

        case "QUEUED":
            return {
                ...card,
                costStage,
                pendingReturns: card.pendingReturns + 1,
                cooldown: card.cooldown ?? startCooldown(card, tick),
            };
    }
}

export function advance<T extends Card<any>>(card: T, tick: number): T {
    if (card.cooldown === null || tick < card.cooldown.readyAtTick) {
        return card;
    }

    switch (card.supply.recharge) {
        case "DEPLOYMENT":
            return { ...card, cooldown: null };

        case "RETURN":
            return recharge({ ...card, cooldown: null }, 1);

        case "QUEUED": {
            while (card.cooldown !== null && tick >= card.cooldown.readyAtTick) {
                const pendingReturns = card.pendingReturns - 1;
                const finishedAtTick = card.cooldown.readyAtTick;

                card = recharge({ ...card, pendingReturns, cooldown: null }, 1);

                if (pendingReturns > 0) {
                    card = { ...card, cooldown: startCooldown(card, finishedAtTick) };
                }
            }

            return card;
        }
    }
}

export function recharge<T extends Card<any>>(card: T, count: number): T {
    if (card.stock === null || count === 0) {
        return card;
    }

    const stock = Math.min(card.supply.stockLimit ?? Infinity, card.stock + count);

    return stock === card.stock ? card : { ...card, stock };
}

export function reduceCooldown<T extends Card<any>>(card: T, ticks: number, tick: number): T {
    if (card.cooldown === null || ticks === 0 || card.cooldown.readyAtTick <= tick) {
        return card;
    }

    return {
        ...card,
        cooldown: {
            ...card.cooldown,
            readyAtTick: Math.max(tick, card.cooldown.readyAtTick - ticks),
        },
    };
}

export function setCostContribution<T extends Card<any>>(
    card: T,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): T {
    const costContributions = contribution.set(card.costContributions, entry);

    return costContributions === card.costContributions ? card : { ...card, costContributions };
}

export function removeCostContribution<T extends Card<any>>(card: T, id: string): T {
    const costContributions = contribution.remove(card.costContributions, id);

    return costContributions === card.costContributions ? card : { ...card, costContributions };
}

export function setRedeployTimeContribution<T extends Card<any>>(
    card: T,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): T {
    const redeployTimeContributions = contribution.set(card.redeployTimeContributions, entry);

    return redeployTimeContributions === card.redeployTimeContributions
        ? card
        : { ...card, redeployTimeContributions };
}

export function removeRedeployTimeContribution<T extends Card<any>>(card: T, id: string): T {
    const redeployTimeContributions = contribution.remove(card.redeployTimeContributions, id);

    return redeployTimeContributions === card.redeployTimeContributions
        ? card
        : { ...card, redeployTimeContributions };
}
