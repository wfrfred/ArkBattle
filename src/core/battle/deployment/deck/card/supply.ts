import * as entries from "../../../../common/collection/entries.js";
import * as contribution from "../../../../common/contribution.js";
import * as modifier from "../../../../common/modifier.js";
import type { Card } from "./card.js";

export interface Definition {
    readonly stock: number;
    readonly stockLimit: number | null;
    readonly activeLimit: number | null;
    readonly cooldown: number;
    readonly cooldownOnDeploy: boolean;
    readonly recoverOnRetreatOrDeath: boolean;
}

export type Clock = {
    readonly durationTicks: number;
} & (
    | { readonly type: "RUNNING"; readonly readyAtTick: number }
    | { readonly type: "PAUSED"; readonly remainingTicks: number }
);

export interface Recovery {
    readonly pending: number;
    readonly clock: Clock;
}

export type TimerTarget = "COOLDOWN" | "RECOVERY";

export interface State {
    readonly stock: number;
    readonly cooldown: Clock | null;
    readonly recovery: Recovery | null;
    readonly redeployTimeContributions: readonly contribution.Contribution<
        readonly modifier.Modifier[]
    >[];
}

export function resolveRedeployTicks(card: Card<any>): number {
    return Math.max(
        0,
        Math.ceil(
            modifier.apply(
                card.definition.supply.cooldown,
                contribution.resolve(card.supply.redeployTimeContributions).flat(),
            ),
        ),
    );
}

function createClock(tick: number, durationTicks: number): Clock {
    return { type: "RUNNING", readyAtTick: tick + durationTicks, durationTicks };
}

export function consume<T extends Card<any>>(card: T, count = 1): T {
    return count === 0
        ? card
        : { ...card, supply: { ...card.supply, stock: card.supply.stock - count } };
}

export function startCooldown<T extends Card<any>>(
    card: T,
    tick: number,
    durationTicks = resolveRedeployTicks(card),
): T {
    return { ...card, supply: { ...card.supply, cooldown: createClock(tick, durationTicks) } };
}

export function enqueueRecovery<T extends Card<any>>(card: T, tick: number, count = 1): T {
    if (count === 0) {
        return card;
    }

    const recovery = card.supply.recovery;

    return {
        ...card,
        supply: {
            ...card.supply,
            recovery: {
                pending: (recovery?.pending ?? 0) + count,
                clock: recovery?.clock ?? createClock(tick, resolveRedeployTicks(card)),
            },
        },
    };
}

export function advance<T extends Card<any>>(card: T, tick: number): T {
    const { cooldown } = card.supply;
    if (cooldown?.type === "RUNNING" && tick >= cooldown.readyAtTick) {
        card = { ...card, supply: { ...card.supply, cooldown: null } };
    }

    while (
        card.supply.recovery?.clock.type === "RUNNING" &&
        tick >= card.supply.recovery.clock.readyAtTick
    ) {
        const pending = card.supply.recovery.pending - 1;
        const finishedAtTick = card.supply.recovery.clock.readyAtTick;
        card = recharge(card, 1);
        card = {
            ...card,
            supply: {
                ...card.supply,
                recovery:
                    pending === 0
                        ? null
                        : {
                              pending,
                              clock: createClock(finishedAtTick, resolveRedeployTicks(card)),
                          },
            },
        };
    }

    return card;
}

export function recharge<T extends Card<any>>(card: T, count: number): T {
    if (count === 0) {
        return card;
    }

    const stock = Math.min(
        card.definition.supply.stockLimit ?? Infinity,
        card.supply.stock + count,
    );

    return stock === card.supply.stock ? card : { ...card, supply: { ...card.supply, stock } };
}

export function reduceCooldown<T extends Card<any>>(
    card: T,
    ticks: number,
    tick: number,
    target: TimerTarget,
): T {
    const current = getClock(card.supply, target);
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
    const current = getClock(card.supply, target);
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
    const current = getClock(card.supply, target);
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
    const current = getClock(card.supply, target);
    if (current?.type !== "PAUSED") {
        return card;
    }

    return replaceClock(card, target, {
        type: "RUNNING",
        durationTicks: current.durationTicks,
        readyAtTick: tick + current.remainingTicks,
    });
}

function getClock(supply: State, target: TimerTarget): Clock | null {
    return target === "COOLDOWN" ? supply.cooldown : (supply.recovery?.clock ?? null);
}

function replaceClock<T extends Card<any>>(card: T, target: TimerTarget, clock: Clock): T {
    const supply = card.supply;

    return {
        ...card,
        supply:
            target === "COOLDOWN"
                ? { ...supply, cooldown: clock }
                : { ...supply, recovery: { ...supply.recovery!, clock } },
    };
}

export function setRedeployTimeContribution<T extends Card<any>>(
    card: T,
    entry: contribution.Contribution<readonly modifier.Modifier[]>,
): T {
    const redeployTimeContributions = entries.set(card.supply.redeployTimeContributions, entry);

    return redeployTimeContributions === card.supply.redeployTimeContributions
        ? card
        : { ...card, supply: { ...card.supply, redeployTimeContributions } };
}

export function removeRedeployTimeContribution<T extends Card<any>>(card: T, id: string): T {
    const redeployTimeContributions = entries.remove(card.supply.redeployTimeContributions, id);

    return redeployTimeContributions === card.supply.redeployTimeContributions
        ? card
        : { ...card, supply: { ...card.supply, redeployTimeContributions } };
}
