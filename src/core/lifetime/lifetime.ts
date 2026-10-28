import type { Identified, Ref } from "../common/ref.js";
import type { State as BattleState } from "../battle/state.js";
import type { Index } from "./dependency.js";

export const paired: unique symbol = Symbol("lifetime");

export interface Scope {
    readonly type: "LIFETIME";
    readonly kind: string;
    readonly address: readonly number[];
    readonly [paired]: unknown;
}

export interface Definition<V extends Identified<object>, S extends V, E> {
    readonly kind: string;
    readonly address: (ref: Ref<V>) => readonly number[];
    readonly get: (battle: BattleState, ref: Ref<V>) => S | undefined;
    readonly isEnding: (self: S) => boolean;
    readonly begin: (self: S) => S;
    readonly replace: (battle: BattleState, ref: Ref<V>, next: S) => BattleState;
    readonly prepare?: (battle: BattleState, ref: Ref<V>, initial: S, end: E) => BattleState;
    readonly finalize: (battle: BattleState, ref: Ref<V>, end: E) => BattleState;
    readonly reason: (end: E) => string;
    readonly fromDependency?: (reason: string) => E;
}

export interface Lifetime<V extends Identified<object>, E> {
    readonly kind: string;
    readonly end: (
        battle: BattleState,
        ref: Ref<V>,
        end: E,
        dependencyReason?: string,
    ) => BattleState;
    readonly [paired]: unknown;
}

export interface Pending {
    readonly target: Scope;
    readonly end: unknown;
    readonly parents: readonly Scope[];
    readonly phase: "PREPARING" | "READY" | "FINALIZING";
}

export interface State {
    readonly dependencies: Index;
    readonly endings: ReadonlyMap<string, Pending>;
    readonly settling: boolean;
}
