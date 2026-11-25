import type { State as BattleState } from "../battle/state.js";
import type { Identified, Ref } from "../common/ref.js";

export interface Lifetime<I extends object = object> extends Identified<I> {
    readonly config: object;
}

export interface Config<T extends Lifetime, E> {
    readonly end: {
        readonly prepare: (battle: BattleState, ref: Ref<T>, initial: T, end: E) => BattleState;
        readonly finalize: (battle: BattleState, ref: Ref<T>, initial: T, end: E) => BattleState;
        readonly dependencyEnd?: E;
    };
}

export type Scope = Ref<Lifetime>;

export interface Node {
    readonly dependencies: readonly Scope[];
    readonly ending?: {
        readonly initial: Lifetime;
        readonly end: unknown;
    };
}

export interface State {
    readonly nodes: ReadonlyMap<Scope, Node>;
    readonly deferred: readonly ((battle: BattleState) => BattleState)[];
    readonly flushing: boolean;
}

export function initialize(): State {
    return { nodes: new Map(), deferred: [], flushing: false };
}

export function available(battle: BattleState, target: Scope): boolean {
    return isAvailable(battle.lifetime.nodes, target);
}

export function isAvailable(nodes: ReadonlyMap<Scope, Node>, reference: Scope): boolean {
    const node = nodes.get(reference);

    return (
        node !== undefined &&
        node.ending === undefined &&
        node.dependencies.every((dependency) => isAvailable(nodes, dependency))
    );
}
