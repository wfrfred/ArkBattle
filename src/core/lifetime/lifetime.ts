import type { State as BattleState } from "../battle/state.js";
import type { Identified, Ref } from "../common/ref.js";
import { end as endLifetime } from "./operations.js";

const paired: unique symbol = Symbol("lifetime");

interface Config<T extends Identified<object>, E> {
    readonly kind: string;
    readonly address: (ref: Ref<T>) => string;
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

interface Pair {
    readonly config: Config<Identified<object>, unknown>;
    readonly ref: Ref<Identified<object>>;
}

export interface Node {
    readonly target: Scope;
    readonly dependencies: readonly string[];
    readonly ending?: {
        readonly initial: unknown;
        readonly end: unknown;
    };
}

export interface State {
    readonly nodes: ReadonlyMap<string, Node>;
    readonly deferred: readonly ((battle: BattleState) => BattleState)[];
    readonly flushing: boolean;
}

export function initialize(): State {
    return { nodes: new Map(), deferred: [], flushing: false };
}

export function create<T extends Identified<object>, E>(config: Config<T, E>): Lifetime<T, E> {
    const lifetime: Lifetime<T, E> = {
        [paired]: config,
        end(battle, ref, end) {
            return endLifetime(battle, lifetime, ref, end);
        },
    };

    return lifetime;
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

export function key(target: Scope): string {
    const { config, ref } = pair(target);

    return JSON.stringify([config.kind, config.address(ref)]);
}

export function available(battle: BattleState, target: Scope): boolean {
    return isAvailable(battle.lifetime.nodes, key(target));
}

export function isAvailable(nodes: ReadonlyMap<string, Node>, identity: string): boolean {
    const node = nodes.get(identity);

    return (
        node !== undefined &&
        node.ending === undefined &&
        node.dependencies.every((dependency) => isAvailable(nodes, dependency))
    );
}
