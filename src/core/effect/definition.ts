import type { State as BattleState } from "../battle/state.js";
import type { Lifetime } from "../lifetime/index.js";
import type { Effect, StackEffect } from "./effect.js";
import type { Expiration } from "./expiration.js";
import type { Group } from "./group.js";

export interface Definition<
    S extends object = object,
    H extends Lifetime | null = Lifetime | null,
    Self extends Effect<S, H> = Effect<S, H>,
> {
    readonly id: string;
    readonly initialize: (battle: BattleState) => S;
    readonly group: Group | null;
    readonly onInstall?: (battle: BattleState, self: Self) => BattleState;
    readonly onEnable?: (battle: BattleState, self: Self) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Self) => BattleState;
    readonly onTick?: (battle: BattleState, self: Self, previous: Expiration) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Self, reason: string) => BattleState;
}

export interface StackDefinition<
    S extends object = object,
    H extends Lifetime | null = Lifetime | null,
    Self extends StackEffect<S, H> = StackEffect<S, H>,
> extends Definition<S, H, Self> {
    readonly group: Extract<Group, { readonly type: "STACK" }>;
    readonly onStackChange?: (battle: BattleState, self: Self, previous: number) => BattleState;
}
