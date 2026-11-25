import type { Card } from "../battle/deployment/deck/card/card.js";
import type { Ref } from "../common/ref.js";
import type { Unit } from "../unit/unit.js";
import type { StackEffect } from "./effect.js";
import {
    extendTime,
    fullDuration,
    refreshTime,
    remainingTime,
    validate,
    type Expiration,
} from "./expiration.js";

export type Group = {
    readonly id: string;
    readonly independentSource: boolean;
} & (
    | { readonly type: "DEFAULT"; readonly priority: number }
    | { readonly type: "UNIQUE" | "EXTEND" | "EXTEND_TIME" }
    | {
          readonly type: "STACK";
          readonly maxCount: number | null;
          readonly maxEffectiveCount: number | null;
          readonly refreshAtMax: boolean;
          readonly expirationPolicy: "END" | "DECAY";
      }
);

export type GroupSource = Ref<Unit> | Ref<Card> | null;

export function assertCompatible(existing: Group, incoming: Group): void {
    if (
        existing.type !== incoming.type ||
        (existing.type === "STACK" &&
            incoming.type === "STACK" &&
            existing.expirationPolicy !== incoming.expirationPolicy)
    ) {
        throw new TypeError(`incompatible policies for effect group ${incoming.id}`);
    }
}

export function validateExpiration(group: Group | undefined, expiration: Expiration): void {
    validate(expiration);

    if (
        group?.type === "STACK" &&
        group.expirationPolicy === "DECAY" &&
        expiration.type === "DEADLINE"
    ) {
        throw new TypeError("decaying stack effects cannot use a deadline");
    }
}

export function mergeStack(self: StackEffect, incoming: Expiration, tick: number): StackEffect {
    const policy = self.definition.group;
    const stackCount =
        policy.maxCount === null
            ? self.stackCount + 1
            : Math.min(self.stackCount + 1, policy.maxCount);
    const expiration =
        stackCount > self.stackCount || policy.refreshAtMax
            ? refreshTime(self.expiration, remainingTime(incoming, tick), tick)
            : self.expiration;

    return stackCount === self.stackCount && expiration === self.expiration
        ? self
        : { ...self, stackCount, expiration };
}

export function mergeExpiration(
    type: "EXTEND" | "EXTEND_TIME",
    current: Expiration,
    incoming: Expiration,
    tick: number,
): Expiration {
    const amount = fullDuration(incoming, tick);

    return type === "EXTEND" ? refreshTime(current, amount, tick) : extendTime(current, amount);
}
