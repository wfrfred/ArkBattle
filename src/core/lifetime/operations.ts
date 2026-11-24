import type { Identified, Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { State as BattleState, Result } from "../battle/state.js";
import { isAvailable, key, pair, scope, type Lifetime, type Node, type Scope } from "./lifetime.js";

export function register<T extends Identified<object>, E>(
    battle: BattleState,
    lifetime: Lifetime<T, E>,
    ref: Ref<T>,
    scopes: readonly Scope[] = [],
): BattleState {
    const target = scope(lifetime, ref);
    const identity = key(target);
    const nodes = battle.lifetime.nodes;
    if (nodes.has(identity)) {
        throw new TypeError("duplicate lifetime node");
    }

    const dependencies = [...new Set(scopes.map(key))];
    if (dependencies.length !== 0 && !("dependencyEnd" in pair(target).config.end)) {
        throw new TypeError("this lifetime cannot depend on another lifetime");
    }
    if (!dependencies.every((dependency) => isAvailable(nodes, dependency))) {
        throw new TypeError("lifetime dependencies must be available");
    }

    return replaceIn(
        battle,
        ["lifetime", "nodes"],
        new Map(nodes).set(identity, { target, dependencies }),
    );
}

export function bind<T extends Identified<object>, E>(
    battle: BattleState,
    lifetime: Lifetime<T, E>,
    ref: Ref<T>,
    parent: Scope,
): Result<boolean> {
    const nodes = battle.lifetime.nodes;
    const target = scope(lifetime, ref);
    const identity = key(target);
    const dependency = key(parent);
    if (!isAvailable(nodes, identity) || !isAvailable(nodes, dependency)) {
        return { state: battle, value: false };
    }
    if (!("dependencyEnd" in pair(target).config.end)) {
        throw new TypeError("this lifetime cannot depend on another lifetime");
    }

    const node = nodes.get(identity)!;
    if (node.dependencies.includes(dependency)) {
        return { state: battle, value: true };
    }
    if (wouldCycle(nodes, identity, dependency)) {
        throw new TypeError("lifetime dependencies cannot form a cycle");
    }

    const next = new Map(nodes).set(identity, {
        ...node,
        dependencies: [...node.dependencies, dependency],
    });

    return { state: replaceIn(battle, ["lifetime", "nodes"], next), value: true };
}

export function unbind<T extends Identified<object>, E>(
    battle: BattleState,
    lifetime: Lifetime<T, E>,
    ref: Ref<T>,
    parent: Scope,
): BattleState {
    const nodes = battle.lifetime.nodes;
    const identity = key(scope(lifetime, ref));
    const dependency = key(parent);
    if (!isAvailable(nodes, identity) || !isAvailable(nodes, dependency)) {
        return battle;
    }

    const node = nodes.get(identity)!;
    const dependencies = node.dependencies.filter((entry) => entry !== dependency);

    return dependencies.length === node.dependencies.length
        ? battle
        : replaceIn(
              battle,
              ["lifetime", "nodes"],
              new Map(nodes).set(identity, { ...node, dependencies }),
          );
}

function wouldCycle(
    nodes: ReadonlyMap<string, Node>,
    identity: string,
    dependency: string,
): boolean {
    const remaining = [dependency];
    const visited = new Set<string>();

    while (remaining.length > 0) {
        const current = remaining.pop()!;
        if (current === identity) {
            return true;
        }
        if (!visited.has(current)) {
            visited.add(current);
            remaining.push(...nodes.get(current)!.dependencies);
        }
    }

    return false;
}

function settling(battle: BattleState): boolean {
    return [...battle.lifetime.nodes.values()].some((node) => node.ending !== undefined);
}

export function end<T extends Identified<object>, E>(
    battle: BattleState,
    lifetime: Lifetime<T, E>,
    ref: Ref<T>,
    payload: NoInfer<E>,
): BattleState {
    const outer = !settling(battle);
    battle = request(battle, key(scope(lifetime, ref)), payload);

    return outer ? flushDeferred(drain(battle)) : battle;
}

function request(battle: BattleState, identity: string, end: unknown): BattleState {
    const node = battle.lifetime.nodes.get(identity);
    if (node === undefined || node.ending !== undefined) {
        return battle;
    }

    const { config, ref } = pair(node.target);
    const initial = ref.get(battle)!;
    const nodes = new Map(battle.lifetime.nodes);
    nodes.delete(identity);
    nodes.set(identity, { ...node, ending: { initial, end } });
    battle = replaceIn(battle, ["lifetime", "nodes"], nodes);
    battle = config.end.prepare(battle, ref, initial, end);

    for (const [childKey, child] of battle.lifetime.nodes) {
        if (child.ending === undefined && child.dependencies.includes(identity)) {
            const dependent = pair(child.target);
            battle = request(battle, childKey, dependent.config.end.dependencyEnd);
        }
    }

    return battle;
}

function drain(battle: BattleState): BattleState {
    while (true) {
        const nodes = [...battle.lifetime.nodes];
        const ending = nodes.filter(([, node]) => node.ending !== undefined);
        if (ending.length === 0) {
            return battle;
        }

        const waiting = new Set(nodes.flatMap(([, node]) => node.dependencies));
        const ready = ending.find(([identity]) => !waiting.has(identity));
        if (ready === undefined) {
            throw new Error("lifetime endings have no ready node");
        }

        const [identity, node] = ready;
        const { config, ref } = pair(node.target);
        const { initial, end } = node.ending!;
        battle = config.end.finalize(battle, ref, initial as Identified<object>, end);
        const next = new Map(battle.lifetime.nodes);
        next.delete(identity);
        battle = replaceIn(battle, ["lifetime", "nodes"], next);
    }
}

export function defer(
    battle: BattleState,
    operation: (battle: BattleState) => BattleState,
): BattleState {
    if (settling(battle) || battle.lifetime.flushing) {
        return replaceIn(
            battle,
            ["lifetime", "deferred"],
            [...battle.lifetime.deferred, operation],
        );
    }

    return operation(battle);
}

function flushDeferred(battle: BattleState): BattleState {
    if (battle.lifetime.flushing || battle.lifetime.deferred.length === 0) {
        return battle;
    }

    battle = replaceIn(battle, ["lifetime", "flushing"], true);

    while (true) {
        const [operation, ...deferred] = battle.lifetime.deferred;
        if (operation === undefined) {
            return replaceIn(battle, ["lifetime", "flushing"], false);
        }

        battle = operation(replaceIn(battle, ["lifetime", "deferred"], deferred));
    }
}
