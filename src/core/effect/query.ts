import type { State as BattleState } from "../battle/state.js";
import type { Ref } from "../common/ref.js";
import type { Query } from "../common/query.js";
import type { Lifetime } from "../lifetime/index.js";
import type { Effect } from "./effect.js";
import type { ExpirationPolicy } from "./expiration.js";

export function all(battle: BattleState): Query<Effect> {
    return battle.effects.values();
}

export function forHost(battle: BattleState, host: Ref<Lifetime> | null): Query<Effect> {
    return all(battle).filter((effect) => effect.ref.host === host);
}

export function hasStack<T extends Effect<any, any>>(
    self: T,
): self is Extract<T, { readonly stackCount: number }> {
    return self.definition.group?.type === "STACK";
}

export function effectiveStackCount(self: Effect<any, any, ExpirationPolicy>): number {
    const maximum = self.definition.group.maxEffectiveCount;

    return maximum === null ? self.stackCount : Math.min(self.stackCount, maximum);
}
