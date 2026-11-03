import type { State as BattleState, Result } from "./battle/state.js";

export interface Entry {
    readonly id: string;
}

declare const entryType: unique symbol;

export interface Key<H extends Entry> {
    readonly name: string;
    readonly [entryType]: (entry: H) => H;
}

export function key<H extends Entry>(name: string): Key<H> {
    return { name } as Key<H>;
}

export class Hooks {
    readonly #entries: ReadonlyMap<object, readonly Entry[]>;

    private constructor(entries: ReadonlyMap<object, readonly Entry[]>) {
        this.#entries = entries;
    }

    static empty(): Hooks {
        return new Hooks(new Map());
    }

    get<H extends Entry>(reference: Key<H>): readonly H[] {
        return (this.#entries.get(reference) ?? []) as readonly H[];
    }

    find<H extends Entry>(reference: Key<H>, id: string): H | undefined {
        return this.get(reference).find((entry) => entry.id === id);
    }

    set<H extends Entry>(reference: Key<H>, entry: NoInfer<H>): Hooks {
        const previous = this.get(reference);
        const entries = set(previous, entry);
        if (entries === previous) {
            return this;
        }

        const next = new Map(this.#entries);
        next.set(reference, entries);

        return new Hooks(next);
    }

    remove<H extends Entry>(reference: Key<H>, id: string): Hooks {
        const previous = this.get(reference);
        const entries = remove(previous, id);
        if (entries === previous) {
            return this;
        }

        const next = new Map(this.#entries);
        if (entries.length === 0) {
            next.delete(reference);
        } else {
            next.set(reference, entries);
        }

        return new Hooks(next);
    }

    merge(other: Hooks): Hooks {
        const next = new Map(this.#entries);
        let changed = false;

        for (const [reference, additions] of other.#entries) {
            const previous = next.get(reference) ?? [];
            const entries = additions.reduce<readonly Entry[]>(set, previous);
            if (entries !== previous) {
                next.set(reference, entries);
                changed = true;
            }
        }

        return changed ? new Hooks(next) : this;
    }
}

export interface Hook<C, T> {
    readonly id: string;
    readonly accepts?: (battle: BattleState, context: C, current: T) => boolean;
    readonly invoke: (battle: BattleState, context: C, current: T) => Result<T>;
}

export interface DispatchOptions<C, T> {
    readonly candidates: (battle: BattleState) => readonly string[];
    readonly find: (battle: BattleState, id: string) => Hook<C, T> | undefined;
    readonly stop?: (battle: BattleState, current: T) => boolean;
}

export function dispatch<C, T>(
    battle: BattleState,
    context: C,
    initial: T,
    options: DispatchOptions<C, T>,
): Result<T> {
    let current = initial;
    const candidates = [...options.candidates(battle)];

    for (const id of candidates) {
        if (options.stop?.(battle, current)) {
            break;
        }

        const hook = options.find(battle, id);
        if (hook === undefined || hook.accepts?.(battle, context, current) === false) {
            continue;
        }

        const result = hook.invoke(battle, context, current);
        battle = result.state;
        current = result.value;
    }

    return { state: battle, value: current };
}

export function set<T extends { readonly id: string }>(
    entries: readonly T[],
    entry: T,
): readonly T[] {
    const index = entries.findIndex((current) => current.id === entry.id);
    if (index < 0) {
        return [...entries, entry];
    }

    return entries[index] === entry
        ? entries
        : [...entries.slice(0, index), entry, ...entries.slice(index + 1)];
}

export function remove<T extends { readonly id: string }>(
    entries: readonly T[],
    id: string,
): readonly T[] {
    return entries.some((entry) => entry.id === id)
        ? entries.filter((entry) => entry.id !== id)
        : entries;
}
