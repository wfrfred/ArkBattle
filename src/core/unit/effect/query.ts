import type { Effect, StackEffect } from "./effect.js";

export function hasStack<U extends Effect<any, any>>(
    self: U,
): self is Extract<U, StackEffect<any, any>> {
    return self.definition.group?.type === "STACK";
}

export function effectiveStackCount(self: StackEffect<any, any>): number {
    const maximum = self.definition.group.maxEffectiveCount;

    return maximum === null ? self.stackCount : Math.min(self.stackCount, maximum);
}
