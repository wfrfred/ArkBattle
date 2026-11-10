import * as contribution from "../../../unit/contribution/contribution.js";
import * as entries from "../../../common/collection/entries.js";
import * as attribute from "../../../unit/contribution/attribute.js";
import type { Card, Clock, TimerTarget } from "./card.js";

export function resolveBaseCost(card: Card<any>): number {
    const addition = contribution
        .resolve(card.costContributions)
        .flat()
        .reduce((sum, value) => sum + value.addition, 0);

    return Math.max(0, Math.floor(card.definition.card.cost + addition));
}

export function resolveCost(card: Card<any>, ceiling = 99): number {
    const modifiers = contribution.resolve(card.costContributions).flat();
    const baseCost = Math.max(
        0,
        Math.floor(
            card.definition.card.cost + modifiers.reduce((sum, value) => sum + value.addition, 0),
        ),
    );
    const rawCost = Math.floor(baseCost * (1 + 0.5 * card.costStage));
    const scale =
        (1 + modifiers.reduce((sum, value) => sum + value.multiplier, 0)) *
        modifiers.reduce((product, value) => product * value.finalScaler, 1);
    const addition = modifiers.reduce((sum, value) => sum + value.finalAddition, 0);

    return Math.max(0, Math.min(ceiling, Math.floor(rawCost * scale) + addition));
}

export function resolveRedeployTicks(card: Card<any>): number {
    return Math.max(
        0,
        Math.ceil(
            attribute.apply(
                card.definition.card.redeployTicks,
                contribution.resolve(card.redeployTimeContributions).flat(),
            ),
        ),
    );
}

function createClock(tick: number, durationTicks: number): Clock {
    return { type: "RUNNING", readyAtTick: tick + durationTicks, durationTicks };
}

export function consume<T extends Card<any>>(card: T, count = 1): T {
    return count === 0 ? card : { ...card, stock: card.stock - count };
}

export function incrementCostStage<T extends Card<any>>(card: T): T {
    const costStage = Math.min(2, card.costStage + 1);

    return costStage === card.costStage ? card : { ...card, costStage };
}

export function startCooldown<T extends Card<any>>(
    card: T,
    tick: number,
    durationTicks = resolveRedeployTicks(card),
): T {
    return { ...card, cooldown: createClock(tick, durationTicks) };
}

export function enqueueRecovery<T extends Card<any>>(card: T, tick: number, count = 1): T {
    if (count === 0) {
        return card;
    }

    const recovery = card.recovery;

    return {
        ...card,
        recovery: {
            pending: (recovery?.pending ?? 0) + count,
            clock: recovery?.clock ?? createClock(tick, resolveRedeployTicks(card)),
        },
    };
}

export function advance<T extends Card<any>>(card: T, tick: number): T {
    if (card.cooldown?.type === "RUNNING" && tick >= card.cooldown.readyAtTick) {
        card = { ...card, cooldown: null };
    }

    while (card.recovery?.clock.type === "RUNNING" && tick >= card.recovery.clock.readyAtTick) {
        const pending = card.recovery.pending - 1;
        const finishedAtTick = card.recovery.clock.readyAtTick;
        card = recharge(card, 1);
        card = {
            ...card,
            recovery:
                pending === 0
                    ? null
                    : { pending, clock: createClock(finishedAtTick, resolveRedeployTicks(card)) },
        };
    }

    return card;
}

export function recharge<T extends Card<any>>(card: T, count: number): T {
    if (count === 0) {
        return card;
    }

    const stock = Math.min(card.definition.card.stockLimit ?? Infinity, card.stock + count);

    return stock === card.stock ? card : { ...card, stock };
}

export function reduceCooldown<T extends Card<any>>(
    card: T,
    ticks: number,
    tick: number,
    target: TimerTarget,
): T {
    const current = getClock(card, target);
    if (current === null || ticks === 0) {
        return card;
    }

    const next: Clock =
        current.type === "RUNNING"
            ? { ...current, readyAtTick: Math.max(tick, current.readyAtTick - ticks) }
            : { ...current, remainingTicks: Math.max(0, current.remainingTicks - ticks) };

    return replaceClock(card, target, next);
}

export function clearCooldown<T extends Card<any>>(card: T, tick: number, target: TimerTarget): T {
    const current = getClock(card, target);
    if (current === null) {
        return card;
    }

    return replaceClock(
        card,
        target,
        current.type === "RUNNING"
            ? { ...current, readyAtTick: tick }
            : { ...current, remainingTicks: 0 },
    );
}

export function pauseCooldown<T extends Card<any>>(card: T, tick: number, target: TimerTarget): T {
    const current = getClock(card, target);
    if (current?.type !== "RUNNING") {
        return card;
    }

    return replaceClock(card, target, {
        type: "PAUSED",
        durationTicks: current.durationTicks,
        remainingTicks: current.readyAtTick - tick,
    });
}

export function resumeCooldown<T extends Card<any>>(card: T, tick: number, target: TimerTarget): T {
    const current = getClock(card, target);
    if (current?.type !== "PAUSED") {
        return card;
    }

    return replaceClock(card, target, {
        type: "RUNNING",
        durationTicks: current.durationTicks,
        readyAtTick: tick + current.remainingTicks,
    });
}

function getClock(card: Card<any>, target: TimerTarget): Clock | null {
    return target === "COOLDOWN" ? card.cooldown : (card.recovery?.clock ?? null);
}

function replaceClock<T extends Card<any>>(card: T, target: TimerTarget, clock: Clock): T {
    return target === "COOLDOWN"
        ? { ...card, cooldown: clock }
        : { ...card, recovery: { ...card.recovery!, clock } };
}

export function setCostContribution<T extends Card<any>>(
    card: T,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): T {
    const costContributions = entries.set(card.costContributions, entry);

    return costContributions === card.costContributions ? card : { ...card, costContributions };
}

export function removeCostContribution<T extends Card<any>>(card: T, id: string): T {
    const costContributions = entries.remove(card.costContributions, id);

    return costContributions === card.costContributions ? card : { ...card, costContributions };
}

export function setRedeployTimeContribution<T extends Card<any>>(
    card: T,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): T {
    const redeployTimeContributions = entries.set(card.redeployTimeContributions, entry);

    return redeployTimeContributions === card.redeployTimeContributions
        ? card
        : { ...card, redeployTimeContributions };
}

export function removeRedeployTimeContribution<T extends Card<any>>(card: T, id: string): T {
    const redeployTimeContributions = entries.remove(card.redeployTimeContributions, id);

    return redeployTimeContributions === card.redeployTimeContributions
        ? card
        : { ...card, redeployTimeContributions };
}
