import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../common/assert.js";

export type ExpirationPolicy = "END" | "DECAY";

export type Policy = ExpirationPolicy | undefined;

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

export type Expiration<P extends Policy = Policy> = P extends "DECAY"
    ? Duration | Infinite
    : Duration | Deadline | Infinite;

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
