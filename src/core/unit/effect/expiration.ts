import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../common/assert.js";

export type Expiration =
    | {
          readonly type: "DURATION";
          readonly elapsed: number;
          readonly total: number;
          readonly rate: number;
      }
    | { readonly type: "DEADLINE"; readonly tick: number }
    | { readonly type: "INFINITE" };

export function validate(expiration: Expiration): void {
    if (expiration.type === "DURATION") {
        assertNonnegativeNumber(expiration.elapsed, "effect elapsed duration");
        assertNonnegativeNumber(expiration.total, "effect total duration");
        assertNonnegativeNumber(expiration.rate, "effect duration rate");
    } else if (expiration.type === "DEADLINE") {
        assertNonnegativeSafeInteger(expiration.tick, "effect deadline");
    }
}

export function expired(expiration: Expiration, tick: number): boolean {
    switch (expiration.type) {
        case "DURATION":
            return expiration.elapsed >= expiration.total;

        case "DEADLINE":
            return expiration.tick <= tick;

        case "INFINITE":
            return false;
    }
}
