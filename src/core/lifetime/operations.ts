import type { Identified, Ref } from "../common/ref.js";
import type { State as BattleState } from "../battle/state.js";
import { paired, type Definition, type Lifetime, type Scope } from "./lifetime.js";
import * as dependency from "./dependency.js";

// Scope construction keeps each erased Ref and End paired with its own static program.
interface Pair {
    readonly definition: Definition<Identified<object>, Identified<object>, unknown>;
    readonly ref: Ref<Identified<object>>;
}

export function create<V extends Identified<object>, S extends V, E>(
    definition: Definition<V, S, E>,
): Lifetime<V, E> {
    const lifetime: Lifetime<V, E> = {
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

export function scope<V extends Identified<object>, E>(
    lifetime: Lifetime<V, E>,
    ref: Ref<NoInfer<V>>,
): Scope {
    const definition = lifetime[paired] as Definition<V, V, E>;

    return {
        type: "LIFETIME",
        kind: lifetime.kind,
        address: definition.address(ref),
        [paired]: { definition, ref },
    };
}

export function getRef<V extends Identified<object>, E>(
    target: Scope,
    lifetime: Lifetime<V, E>,
): Ref<V> | undefined {
    const pair = target[paired] as Pair;

    return pair.definition === lifetime[paired] ? (pair.ref as Ref<V>) : undefined;
}

export function available(battle: BattleState, target: Scope): boolean {
    if (battle.lifetime.endings.has(dependency.key(target))) {
        return false;
    }

    const { definition, ref } = target[paired] as Pair;
    const self = definition.get(battle, ref);

    return self !== undefined && !definition.isEnding(self);
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
                dependencyReason,
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
