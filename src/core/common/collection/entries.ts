export interface Entry {
    readonly id: string;
}

export function set<T extends Entry>(entries: readonly T[], entry: T): readonly T[] {
    const index = entries.findIndex((current) => current.id === entry.id);
    if (index < 0) {
        return [...entries, entry];
    }

    return entries[index] === entry
        ? entries
        : [...entries.slice(0, index), entry, ...entries.slice(index + 1)];
}

export function remove<T extends Entry>(entries: readonly T[], id: string): readonly T[] {
    return entries.some((entry) => entry.id === id)
        ? entries.filter((entry) => entry.id !== id)
        : entries;
}
