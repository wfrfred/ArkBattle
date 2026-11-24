import type { State as BattleState } from "../battle/state.js";
import type { Identified, Ref } from "../common/ref.js";
import { end as endLifetime } from "./operations.js";

const paired: unique symbol = Symbol("lifetime");

interface Config<T extends Identified<object>, E> {
    readonly end: {
        readonly prepare: (battle: BattleState, ref: Ref<T>, initial: T, end: E) => BattleState;
        readonly finalize: (battle: BattleState, ref: Ref<T>, initial: T, end: E) => BattleState;
        readonly dependencyEnd?: E;
    };
}

export interface Lifetime<T extends Identified<object>, E> {
    readonly end: (battle: BattleState, ref: Ref<T>, end: E) => BattleState;
    readonly [paired]: Config<T, E>;
}

export interface Scope {
    readonly [paired]: unknown;
}

export type NodeRef = Ref<Identified<object>>;

interface Pair {
    readonly config: Config<Identified<object>, unknown>;
    readonly ref: NodeRef;
}

export interface Node {
    readonly target: Scope;
    readonly dependencies: readonly NodeRef[];
    readonly ending?: {
        readonly initial: unknown;
        readonly end: unknown;
    };
}

export interface State {
    readonly nodes: ReadonlyMap<NodeRef, Node>;
    readonly deferred: readonly ((battle: BattleState) => BattleState)[];
    readonly flushing: boolean;
}

export function initialize(): State {
    return { nodes: new Map(), deferred: [], flushing: false };
}

export function create<T extends Identified<object>, E>(config: Config<T, E>): Lifetime<T, E> {
    return {
        [paired]: config,
        end(battle, ref, end) {
            return endLifetime(battle, ref, end);
        },
    };
}

export function scope<T extends Identified<object>, E>(
    lifetime: Lifetime<T, E>,
    ref: Ref<T>,
): Scope {
    return { [paired]: { config: lifetime[paired], ref } };
}

export function pair(target: Scope): Pair {
    return target[paired] as Pair;
}

export function available(battle: BattleState, target: Scope): boolean {
    return isAvailable(battle.lifetime.nodes, pair(target).ref);
}

export function isAvailable(nodes: ReadonlyMap<NodeRef, Node>, reference: NodeRef): boolean {
    const node = nodes.get(reference);

    return (
        node !== undefined &&
        node.ending === undefined &&
        node.dependencies.every((dependency) => isAvailable(nodes, dependency))
    );
}
