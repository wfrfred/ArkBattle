import type { State as BattleState, Result } from "./battle/state.js";
import { type Entry, set, remove } from "./common/collection/entries.js";

declare const entryType: unique symbol;
declare const ownerType: unique symbol;

export interface Key<H extends Entry, Owner extends object = object> {
    readonly name: string;
    readonly [entryType]: (entry: H) => H;
    readonly [ownerType]: (owner: Owner) => Owner;
}

export function key<H extends Entry, Owner extends object = object>(name: string): Key<H, Owner> {
    return { name } as Key<H, Owner>;
}

export type Exclusion = readonly [key: Key<any, any>, id: string | null];

export interface Options {
    readonly exclude?: readonly Exclusion[];
}

export function excluded(
    options: Options | undefined,
    reference: Key<any, any>,
    id: string,
): boolean {
    return (
        options?.exclude?.some(
            ([key, excludedId]) => key === reference && (excludedId === null || excludedId === id),
        ) ?? false
    );
}

export class Hooks {
    readonly #entries: ReadonlyMap<object, readonly Entry[]>;

    private constructor(entries: ReadonlyMap<object, readonly Entry[]>) {
        this.#entries = entries;
    }

    static empty(): Hooks {
        return new Hooks(new Map());
    }

    get<H extends Entry, Owner extends object>(reference: Key<H, Owner>): readonly H[] {
        return (this.#entries.get(reference) ?? []) as readonly H[];
    }

    find<H extends Entry, Owner extends object>(
        reference: Key<H, Owner>,
        id: string,
    ): H | undefined {
        return this.get(reference).find((entry) => entry.id === id);
    }

    set<H extends Entry, Owner extends object>(reference: Key<H, Owner>, entry: NoInfer<H>): Hooks {
        const previous = this.get(reference);
        const entries = set(previous, entry);
        if (entries === previous) {
            return this;
        }

        const next = new Map(this.#entries);
        next.set(reference, entries);

        return new Hooks(next);
    }

    remove<H extends Entry, Owner extends object>(reference: Key<H, Owner>, id: string): Hooks {
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
