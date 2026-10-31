import type { Scope } from "./lifetime.js";

export interface Entry {
    readonly target: Scope;
    readonly owner: Scope | null;
    readonly scopes: readonly Scope[];
}

export interface Transition {
    readonly previous: Entry | undefined;
    readonly next: Entry | undefined;
}

export interface Index {
    readonly entries: ReadonlyMap<string, Entry>;
    readonly children: ReadonlyMap<string, readonly Scope[]>;
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
        unique.set(key(entry.owner), entry.owner);
    }
    for (const scope of entry.scopes) {
        unique.set(key(scope), scope);
    }

    return [...unique.values()];
}

export function derive(index: Index, transitions: readonly Transition[]): Index {
    let entries: Map<string, Entry> | undefined;
    let children: Map<string, readonly Scope[]> | undefined;

    for (const { previous, next } of transitions) {
        if (same(previous, next)) {
            continue;
        }

        const target = (next ?? previous)!.target;
        const identity = key(target);
        entries ??= new Map(index.entries);
        children ??= new Map(index.children);

        const previousParents = new Map(
            (previous === undefined ? [] : relations(previous)).map((parent) => [
                key(parent),
                parent,
            ]),
        );
        const nextParents = new Map(
            (next === undefined ? [] : relations(next)).map((parent) => [key(parent), parent]),
        );

        for (const parent of previousParents.values()) {
            const parentKey = key(parent);
            if (nextParents.has(parentKey)) {
                continue;
            }

            const bucket = children.get(parentKey)!;
            const remaining = bucket.filter((entry) => key(entry) !== identity);
            if (remaining.length === 0) {
                children.delete(parentKey);
            } else {
                children.set(parentKey, remaining);
            }
        }

        if (next === undefined || (next.owner === null && next.scopes.length === 0)) {
            entries.delete(identity);
        } else {
            entries.set(identity, next);

            for (const parent of nextParents.values()) {
                const parentKey = key(parent);
                if (!previousParents.has(parentKey)) {
                    children.set(parentKey, [...(children.get(parentKey) ?? []), next.target]);
                }
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
                key(previous.owner) === key(next.owner))) &&
        previous.scopes.length === next.scopes.length &&
        previous.scopes.every((scope, i) => key(scope) === key(next.scopes[i]!))
    );
}

export function dependents(index: Index, target: Scope): readonly Scope[] {
    return index.children.get(key(target)) ?? [];
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
