export function snapshot(value) {
    if (Array.isArray(value)) return value.map(snapshot);
    if (value instanceof Map) return new Map([...value].map(([key, entry]) => [key, snapshot(entry)]));
    if (value instanceof Set) return new Set([...value].map(snapshot));
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, snapshot(entry)]));
    }
    return value;
}
