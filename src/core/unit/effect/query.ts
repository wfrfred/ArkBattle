import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import type { Effect, StackEffect } from "./effect.js";

export function get<E extends Effect<any, any>>(battle: BattleState, ref: Ref<E>): E | undefined {
    return units.get<Unit>(battle, ref.host)?.effects.get(ref);
}

export function hasStack<U extends Effect<any, any>>(
    self: U,
): self is Extract<U, StackEffect<any, any>> {
    return self.definition.group?.type === "STACK";
}

export function effectiveStackCount(self: StackEffect<any, any>): number {
    const maximum = self.definition.group.maxEffectiveCount;

    return maximum === null ? self.stackCount : Math.min(self.stackCount, maximum);
}
