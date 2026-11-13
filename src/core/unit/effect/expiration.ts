import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../common/assert.js";

export type Expiration =
    | {
          readonly type: "DURATION";
          readonly duration: number;
          readonly remaining: number;
          readonly rate: number;
      }
    | { readonly type: "DEADLINE"; readonly tick: number }
    | { readonly type: "INFINITE" };

export type ExpirationPolicy = "END" | "DECAY";

export type DecayExpiration = Extract<Expiration, { readonly type: "DURATION" | "INFINITE" }>;

export type StackExpiration<P extends ExpirationPolicy> = P extends "DECAY"
    ? DecayExpiration
    : Expiration;

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
