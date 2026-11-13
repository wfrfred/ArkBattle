import type { State as BattleState } from "../../battle/state.js";
import type { OrdinaryEffect, StackEffect } from "./effect.js";
import type { Expiration, ExpirationPolicy } from "./expiration.js";

interface GroupFields {
    readonly id: string;
    readonly priority: number;
    readonly independentSource: boolean;
}

export interface OrdinaryGroup extends GroupFields {
    readonly type: "DEFAULT" | "UNIQUE" | "EXTEND" | "EXTEND_TIME";
}

export interface StackGroup extends GroupFields {
    readonly type: "STACK";
    readonly maxCount: number | null;
    readonly maxEffectiveCount: number | null;
    readonly refreshAtMax: boolean;
    readonly expirationPolicy: ExpirationPolicy;
}

export type Group = OrdinaryGroup | StackGroup;

export interface DefinitionFields<
    S extends object,
    Self extends { readonly expiration: Expiration },
> {
    readonly id: string;
    readonly initialize: () => S;
    readonly onInstall?: (battle: BattleState, self: Self) => BattleState;
    readonly onEnable?: (battle: BattleState, self: Self) => BattleState;
    readonly onDisable?: (battle: BattleState, self: Self) => BattleState;
    readonly onTick?: (
        battle: BattleState,
        self: Self,
        previous: Self["expiration"],
    ) => BattleState;
    readonly onEnd?: (battle: BattleState, self: Self, reason: string) => BattleState;
}

export interface OrdinaryDefinition<
    S extends object,
    H extends object = object,
> extends DefinitionFields<S, OrdinaryEffect<S, H>> {
    readonly group?: OrdinaryGroup;
}

export type StackDefinition<
    S extends object,
    H extends object = object,
    P extends ExpirationPolicy = ExpirationPolicy,
> = P extends ExpirationPolicy
    ? DefinitionFields<S, StackEffect<S, H, P>> & {
          readonly group: StackGroup & { readonly expirationPolicy: P };
          readonly onStackChange?: (
              battle: BattleState,
              self: StackEffect<S, H, P>,
              previous: number,
          ) => BattleState;
      }
    : never;

export type Definition<S extends object, H extends object = object> =
    OrdinaryDefinition<S, H> | StackDefinition<S, H>;
