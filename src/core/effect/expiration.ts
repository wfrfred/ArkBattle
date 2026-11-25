import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../common/assert.js";

export interface Duration {
    readonly type: "DURATION";
    readonly duration: number;
    readonly remaining: number;
    readonly rate: number;
}

export interface Deadline {
    readonly type: "DEADLINE";
    readonly tick: number;
}

export interface Infinite {
    readonly type: "INFINITE";
}

export type Expiration = Duration | Deadline | Infinite;

export function validate(expiration: Expiration): void {
    if (expiration.type === "DURATION") {
        assertNonnegativeNumber(expiration.duration, "effect duration");
        assertNonnegativeNumber(expiration.remaining, "effect remaining duration");
        assertNonnegativeNumber(expiration.rate, "effect duration rate");
    } else if (expiration.type === "DEADLINE") {
        assertNonnegativeSafeInteger(expiration.tick, "effect deadline");
    }
}

export function expired(expiration: Expiration, tick: number): boolean {
    switch (expiration.type) {
        case "DURATION":
            return expiration.remaining <= 0;

        case "DEADLINE":
            return expiration.tick <= tick;

        case "INFINITE":
            return false;
    }
}

export function remainingTime(expiration: Expiration, tick: number): number {
    switch (expiration.type) {
        case "DURATION":
            return expiration.remaining;

        case "DEADLINE":
            return Math.max(0, expiration.tick - tick);

        case "INFINITE":
            return Infinity;
    }
}

export function fullDuration(expiration: Expiration, tick: number): number {
    return expiration.type === "DURATION" ? expiration.duration : remainingTime(expiration, tick);
}

export function refreshTime(expiration: Expiration, amount: number, tick: number): Expiration {
    if (expiration.type === "INFINITE") {
        return expiration;
    }
    if (amount === Infinity) {
        return { type: "INFINITE" };
    }
    if (expiration.type === "DURATION") {
        const remaining = Math.max(expiration.remaining, amount);

        return remaining === expiration.remaining ? expiration : { ...expiration, remaining };
    }

    const deadline = Math.max(expiration.tick, tick + Math.ceil(amount));

    return deadline === expiration.tick ? expiration : { ...expiration, tick: deadline };
}

export function extendTime(expiration: Expiration, amount: number): Expiration {
    if (expiration.type === "INFINITE" || amount === Infinity || amount === 0) {
        return expiration;
    }

    return expiration.type === "DURATION"
        ? {
              ...expiration,
              duration: expiration.duration + amount,
              remaining: expiration.remaining + amount,
          }
        : { ...expiration, tick: expiration.tick + Math.ceil(amount) };
}

export function elapse(expiration: Expiration): Expiration {
    if (expiration.type !== "DURATION") {
        return expiration;
    }

    const remaining = Math.max(0, expiration.remaining - expiration.rate);

    return remaining === expiration.remaining ? expiration : { ...expiration, remaining };
}
