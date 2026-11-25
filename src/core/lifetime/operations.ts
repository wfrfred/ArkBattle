import type { Ref } from "../common/ref.js";
import { replaceIn } from "../common/object.js";
import type { State as BattleState, Result } from "../battle/state.js";
import { isAvailable, type Config, type Lifetime, type Node } from "./lifetime.js";

export function register(
    battle: BattleState,
    ref: Ref<Lifetime>,
    scopes: readonly Ref<Lifetime>[] = [],
): BattleState {
    const nodes = battle.lifetime.nodes;
    if (nodes.has(ref)) {
        throw new TypeError("duplicate lifetime node");
    }

    const dependencies = [...new Set(scopes)];
    if (dependencies.length !== 0 && !("dependencyEnd" in configOf(ref.get(battle)!).end)) {
        throw new TypeError("this lifetime cannot depend on another lifetime");
    }
    if (!dependencies.every((dependency) => isAvailable(nodes, dependency))) {
        throw new TypeError("lifetime dependencies must be available");
    }

    return replaceIn(battle, ["lifetime", "nodes"], new Map(nodes).set(ref, { dependencies }));
}

export function bind(
    battle: BattleState,
    ref: Ref<Lifetime>,
    dependency: Ref<Lifetime>,
): Result<boolean> {
    const nodes = battle.lifetime.nodes;
    if (!isAvailable(nodes, ref) || !isAvailable(nodes, dependency)) {
        return { state: battle, value: false };
    }

    const node = nodes.get(ref)!;

    if (!("dependencyEnd" in configOf(ref.get(battle)!).end)) {
        throw new TypeError("this lifetime cannot depend on another lifetime");
    }

    if (node.dependencies.includes(dependency)) {
        return { state: battle, value: true };
    }
    if (wouldCycle(nodes, ref, dependency)) {
        throw new TypeError("lifetime dependencies cannot form a cycle");
    }

    const next = new Map(nodes).set(ref, {
        ...node,
        dependencies: [...node.dependencies, dependency],
    });

    return { state: replaceIn(battle, ["lifetime", "nodes"], next), value: true };
}

export function unbind(
    battle: BattleState,
    ref: Ref<Lifetime>,
    dependency: Ref<Lifetime>,
): BattleState {
    const nodes = battle.lifetime.nodes;
    if (!isAvailable(nodes, ref) || !isAvailable(nodes, dependency)) {
        return battle;
    }

    const node = nodes.get(ref)!;
    const dependencies = node.dependencies.filter((entry) => entry !== dependency);

    return dependencies.length === node.dependencies.length
        ? battle
        : replaceIn(
              battle,
              ["lifetime", "nodes"],
              new Map(nodes).set(ref, { ...node, dependencies }),
          );
}

function wouldCycle(
    nodes: ReadonlyMap<Ref<Lifetime>, Node>,
    reference: Ref<Lifetime>,
    dependency: Ref<Lifetime>,
): boolean {
    const remaining = [dependency];
    const visited = new Set<Ref<Lifetime>>();

    while (remaining.length > 0) {
        const current = remaining.pop()!;
        if (current === reference) {
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

export function end<T extends Lifetime, E>(
    battle: BattleState,
    reference: Ref<Lifetime & { readonly config: Config<T, E> }>,
    payload: NoInfer<E>,
): BattleState {
    const outer = !settling(battle);
    battle = request(battle, reference, payload);

    return outer ? flushDeferred(drain(battle)) : battle;
}

function configOf(self: Lifetime): Config<Lifetime, unknown> {
    return self.config as Config<Lifetime, unknown>;
}

function request(battle: BattleState, reference: Ref<Lifetime>, end: unknown): BattleState {
    const node = battle.lifetime.nodes.get(reference);
    if (node === undefined || node.ending !== undefined) {
        return battle;
    }

    const initial = reference.get(battle)!;
    const nodes = new Map(battle.lifetime.nodes);
    nodes.delete(reference);
    nodes.set(reference, { ...node, ending: { initial, end } });
    battle = replaceIn(battle, ["lifetime", "nodes"], nodes);
    battle = configOf(initial).end.prepare(battle, reference, initial, end);

    for (const [childKey, child] of battle.lifetime.nodes) {
        if (child.ending === undefined && child.dependencies.includes(reference)) {
            const dependent = childKey.get(battle)!;
            battle = request(battle, childKey, configOf(dependent).end.dependencyEnd);
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
        const { initial, end } = node.ending!;
        battle = configOf(initial).end.finalize(battle, identity, initial, end);
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
