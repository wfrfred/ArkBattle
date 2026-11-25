import type { State as BattleState } from "../battle/state.js";
import type { Lifetime } from "../lifetime/index.js";
import type { Effect } from "./effect.js";
import type { Expiration, ExpirationPolicy, Policy } from "./expiration.js";

interface GroupFields {
    readonly id: string;
    readonly priority: number;
    readonly independentSource: boolean;
}

export interface OrdinaryGroup extends GroupFields {
    readonly type: "DEFAULT" | "UNIQUE" | "EXTEND" | "EXTEND_TIME";
}

export interface StackGroup<P extends ExpirationPolicy = ExpirationPolicy> extends GroupFields {
    readonly type: "STACK";
    readonly maxCount: number | null;
    readonly maxEffectiveCount: number | null;
    readonly refreshAtMax: boolean;
    readonly expirationPolicy: P;
}

export type Group = OrdinaryGroup | StackGroup;

export type Definition<
    S extends object = object,
    H extends Lifetime | null = Lifetime | null,
    P extends Policy = undefined,
> = P extends Policy
    ? {
          readonly id: string;
          readonly initialize: () => S;
          readonly onInstall?: (battle: BattleState, self: Effect<S, H, P>) => BattleState;
          readonly onEnable?: (battle: BattleState, self: Effect<S, H, P>) => BattleState;
          readonly onDisable?: (battle: BattleState, self: Effect<S, H, P>) => BattleState;
          readonly onTick?: (
              battle: BattleState,
              self: Effect<S, H, P>,
              previous: Expiration<P>,
          ) => BattleState;
          readonly onEnd?: (
              battle: BattleState,
              self: Effect<S, H, P>,
              reason: string,
          ) => BattleState;
      } & (P extends ExpirationPolicy
          ? {
                readonly group: StackGroup<P>;
                readonly onStackChange?: (
                    battle: BattleState,
                    self: Effect<S, H, P>,
                    previous: number,
                ) => BattleState;
            }
          : { readonly group?: OrdinaryGroup; readonly onStackChange?: never })
    : never;
