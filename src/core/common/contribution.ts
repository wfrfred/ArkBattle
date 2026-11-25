export interface Group {
    readonly id: string;
    readonly priority: number;
}

export interface Contribution<V> {
    readonly id: string;
    readonly value: V;
    readonly group: Group | null;
}

export function resolveEntries<V>(entries: readonly Contribution<V>[]): readonly Contribution<V>[] {
    const ordered = [...entries].sort((a, b) => {
        if (a.id === b.id) {
            return 0;
        }

        return a.id < b.id ? -1 : 1;
    });
    const winners = new Map<string, Contribution<V>>();

    for (const entry of ordered) {
        if (entry.group === null) {
            continue;
        }

        const current = winners.get(entry.group.id);
        if (current === undefined || entry.group.priority > current.group!.priority) {
            winners.set(entry.group.id, entry);
        }
    }

    return ordered.filter((entry) => entry.group === null || winners.get(entry.group.id) === entry);
}

export function resolve<V>(entries: readonly Contribution<V>[]): readonly V[] {
    return resolveEntries(entries).map((entry) => entry.value);
}
