import type { Scope } from "./lifetime.js";

export interface Entry {
    readonly target: Scope;
    readonly owner: { readonly target: Scope; readonly order: number } | null;
    readonly scopes: readonly Scope[];
}

export interface Transition {
    readonly previous: Entry | undefined;
    readonly next: Entry | undefined;
}

interface Children {
    readonly owned: readonly Entry[];
    readonly scoped: readonly Scope[];
}

export interface Index {
    readonly entries: ReadonlyMap<string, Entry>;
    readonly children: ReadonlyMap<string, Children>;
}

export function empty(): Index {
    return { entries: new Map(), children: new Map() };
}

export function key(target: Scope): string {
    return JSON.stringify([target.kind, ...target.address]);
}

export function parents(index: Index, target: Scope): readonly Scope[] {
    const entry = index.entries.get(key(target));

    return entry === undefined ? [] : relations(entry);
}

function relations(entry: Entry): readonly Scope[] {
    const unique = new Map<string, Scope>();
    if (entry.owner !== null) {
        unique.set(key(entry.owner.target), entry.owner.target);
    }
    for (const scope of entry.scopes) {
        unique.set(key(scope), scope);
    }

    return [...unique.values()];
}

export function derive(index: Index, transitions: readonly Transition[]): Index {
    let entries: Map<string, Entry> | undefined;
    let children: Map<string, Children> | undefined;

    for (const { previous, next } of transitions) {
        if (same(previous, next)) {
            continue;
        }

        const target = (next ?? previous)!.target;
        const identity = key(target);
        entries ??= new Map(index.entries);
        children ??= new Map(index.children);

        for (const parent of previous === undefined ? [] : relations(previous)) {
            const parentKey = key(parent);
            const bucket = children.get(parentKey)!;
            const owned = bucket.owned.filter((entry) => key(entry.target) !== identity);
            const scoped = bucket.scoped.filter((entry) => key(entry) !== identity);
            if (owned.length === 0 && scoped.length === 0) {
                children.delete(parentKey);
            } else {
                children.set(parentKey, { owned, scoped });
            }
        }

        if (next === undefined || (next.owner === null && next.scopes.length === 0)) {
            entries.delete(identity);
        } else {
            entries.set(identity, next);

            for (const parent of relations(next)) {
                const parentKey = key(parent);
                const bucket = children.get(parentKey) ?? { owned: [], scoped: [] };
                const owned = next.owner !== null && key(next.owner.target) === parentKey;
                children.set(parentKey, {
                    owned: owned
                        ? [...bucket.owned, next].sort(
                              (left, right) => left.owner!.order - right.owner!.order,
                          )
                        : bucket.owned,
                    scoped: owned ? bucket.scoped : [...bucket.scoped, next.target].sort(compare),
                });
            }
        }
    }

    return entries === undefined ? index : { entries, children: children! };
}

function same(previous: Entry | undefined, next: Entry | undefined): boolean {
    if (previous === next) {
        return true;
    }
    if (previous === undefined || next === undefined) {
        return false;
    }

    return (
        key(previous.target) === key(next.target) &&
        (previous.owner === next.owner ||
            (previous.owner !== null &&
                next.owner !== null &&
                previous.owner.order === next.owner.order &&
                key(previous.owner.target) === key(next.owner.target))) &&
        previous.scopes.length === next.scopes.length &&
        previous.scopes.every((scope, i) => key(scope) === key(next.scopes[i]!))
    );
}

export function compare(left: Scope, right: Scope): number {
    for (let i = 0; i < Math.min(left.address.length, right.address.length); i++) {
        const difference = left.address[i]! - right.address[i]!;
        if (difference !== 0) {
            return difference;
        }
    }

    return left.address.length - right.address.length || left.kind.localeCompare(right.kind);
}

export function dependents(index: Index, target: Scope): readonly Scope[] {
    const bucket = index.children.get(key(target));

    return bucket === undefined
        ? []
        : [...bucket.owned.map((entry) => entry.target), ...bucket.scoped];
}

export function wouldCycle(index: Index, child: Scope, parent: Scope): boolean {
    const target = key(child);
    const pending = [parent];
    const seen = new Set<string>();

    while (pending.length > 0) {
        const current = pending.pop()!;
        const identity = key(current);
        if (identity === target) {
            return true;
        }
        if (!seen.has(identity)) {
            seen.add(identity);
            pending.push(...parents(index, current));
        }
    }

    return false;
}
