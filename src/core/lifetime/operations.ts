import type { Identified, Ref } from "../common/ref.js";
import type { State as BattleState, Result } from "../battle/state.js";
import { paired, type Definition, type Lifetime, type Scope } from "./lifetime.js";
import * as dependency from "./dependency.js";

// Scope construction keeps each erased Ref and End paired with its own static program.
interface Pair {
    readonly definition: Definition<Identified<object>, Identified<object>, unknown>;
    readonly ref: Ref<Identified<object>>;
}

export function create<V extends Identified<object>, S extends V, E>(
    definition: Definition<V, S, E>,
): Lifetime<V, S, E> {
    const lifetime: Lifetime<V, S, E> = {
        kind: definition.kind,
        [paired]: definition,
        end(battle, ref, end, dependencyReason = definition.reason(end)) {
            const outer = !battle.lifetime.settling;
            battle = request(battle, scope(lifetime, ref), end, dependencyReason);

            if (!outer || !battle.lifetime.settling) {
                return battle;
            }

            battle = drain(battle);

            return { ...battle, lifetime: { ...battle.lifetime, settling: false } };
        },
    };

    return lifetime;
}

export function scope<V extends Identified<object>, S extends V, E, T extends S>(
    lifetime: Lifetime<V, S, E>,
    ref: Ref<T>,
): Scope {
    const definition = lifetime[paired];

    return {
        type: "LIFETIME",
        kind: lifetime.kind,
        address: definition.address(ref as object as Ref<V>),
        [paired]: { definition, ref },
    };
}

export function getRef<V extends Identified<object>, S extends V, E>(
    target: Scope,
    lifetime: Lifetime<V, S, E>,
): Ref<V> | undefined {
    const pair = target[paired] as Pair;

    return (pair.definition as object) === lifetime[paired] ? (pair.ref as Ref<V>) : undefined;
}

export function available(battle: BattleState, target: Scope): boolean {
    if (battle.lifetime.endings.has(dependency.key(target))) {
        return false;
    }

    const { definition, ref } = target[paired] as Pair;
    const self = definition.get(battle, ref);

    return (
        self !== undefined &&
        !definition.isEnding(self) &&
        dependency
            .parents(battle.lifetime.dependencies, target)
            .every((parent) => available(battle, parent))
    );
}

export function dependencies(battle: BattleState, target: Scope): readonly Scope[] {
    return battle.lifetime.dependencies.entries.get(dependency.key(target))?.scopes ?? [];
}

// Complete domain operations register their own instances before invoking content.
export function register(
    battle: BattleState,
    target: Scope,
    owner: Scope | null,
    scopes: readonly Scope[] = [],
): BattleState {
    return change(battle, target, { target, owner, scopes });
}

export function unregister(battle: BattleState, target: Scope): BattleState {
    return change(battle, target, undefined);
}

export function bind(battle: BattleState, target: Scope, parent: Scope): Result<boolean> {
    const { definition } = target[paired] as Pair;
    if (definition.fromDependency === undefined) {
        throw new TypeError("this lifetime cannot depend on another lifetime");
    }
    if (!available(battle, target) || !available(battle, parent)) {
        return { state: battle, value: false };
    }
    if (dependency.wouldCycle(battle.lifetime.dependencies, target, parent)) {
        throw new TypeError("lifetime dependencies cannot form a cycle");
    }

    const entry = battle.lifetime.dependencies.entries.get(dependency.key(target));
    const scopes = entry?.scopes ?? [];
    if (scopes.some((current) => dependency.key(current) === dependency.key(parent))) {
        return { state: battle, value: true };
    }

    return {
        state: change(battle, target, {
            target,
            owner: entry?.owner ?? null,
            scopes: [...scopes, parent],
        }),
        value: true,
    };
}

export function unbind(battle: BattleState, target: Scope, parent: Scope): BattleState {
    const entry = battle.lifetime.dependencies.entries.get(dependency.key(target));
    if (entry === undefined) {
        return battle;
    }

    const scopes = entry.scopes.filter(
        (current) => dependency.key(current) !== dependency.key(parent),
    );

    return scopes.length === entry.scopes.length
        ? battle
        : change(battle, target, { ...entry, scopes });
}

function change(
    battle: BattleState,
    target: Scope,
    next: dependency.Entry | undefined,
): BattleState {
    const index = battle.lifetime.dependencies;
    const previous = index.entries.get(dependency.key(target));
    const dependencies = dependency.derive(index, [{ previous, next }]);

    return dependencies === index
        ? battle
        : { ...battle, lifetime: { ...battle.lifetime, dependencies } };
}

function request(
    battle: BattleState,
    target: Scope,
    end: unknown,
    dependencyReason: string,
): BattleState {
    const identity = dependency.key(target);
    if (battle.lifetime.endings.has(identity)) {
        return battle;
    }

    const { definition, ref } = target[paired] as Pair;
    const initial = definition.get(battle, ref);
    if (initial === undefined || definition.isEnding(initial)) {
        return battle;
    }

    const parents = dependency.parents(battle.lifetime.dependencies, target);
    const children = new Map(
        dependency
            .dependents(battle.lifetime.dependencies, target)
            .map((child) => [dependency.key(child), child]),
    );

    // A removed child still belongs to its parents until its entire Finalize returns.
    for (const pending of battle.lifetime.endings.values()) {
        if (pending.parents.some((parent) => dependency.key(parent) === identity)) {
            children.set(dependency.key(pending.target), pending.target);
        }
    }

    battle = {
        ...battle,
        lifetime: {
            ...battle.lifetime,
            settling: true,
            endings: new Map(battle.lifetime.endings).set(identity, {
                target,
                end,
                parents,
                phase: "PREPARING",
            }),
        },
    };
    battle = definition.replace(battle, ref, definition.begin(initial));
    battle = definition.prepare?.(battle, ref, initial, end) ?? battle;

    for (const child of children.values()) {
        if (!battle.lifetime.endings.has(dependency.key(child))) {
            const childDefinition = (child[paired] as Pair).definition;
            battle = request(
                battle,
                child,
                childDefinition.fromDependency!(dependencyReason),
                dependencyReason,
            );
        }
    }

    const pending = battle.lifetime.endings.get(identity)!;

    return {
        ...battle,
        lifetime: {
            ...battle.lifetime,
            endings: new Map(battle.lifetime.endings).set(identity, { ...pending, phase: "READY" }),
        },
    };
}

function drain(battle: BattleState): BattleState {
    while (battle.lifetime.endings.size > 0) {
        const current = [...battle.lifetime.endings.entries()].find(
            ([identity, pending]) =>
                pending.phase === "READY" &&
                ![...battle.lifetime.endings.values()].some((child) =>
                    child.parents.some((parent) => dependency.key(parent) === identity),
                ),
        );
        if (current === undefined) {
            throw new Error("lifetime endings have no ready node");
        }

        const [identity, pending] = current;
        battle = {
            ...battle,
            lifetime: {
                ...battle.lifetime,
                endings: new Map(battle.lifetime.endings).set(identity, {
                    ...pending,
                    phase: "FINALIZING",
                }),
            },
        };
        const { definition, ref } = pending.target[paired] as Pair;
        battle = definition.finalize(battle, ref, pending.end);
        const endings = new Map(battle.lifetime.endings);
        endings.delete(identity);
        battle = { ...battle, lifetime: { ...battle.lifetime, endings } };
    }

    return battle;
}
