import { assertFiniteNumber } from "../core/common/assert.js";
import { denseArray, record, string } from "./json.js";

export interface BlackboardEntry {
    readonly key: string;
    readonly value: number;
    readonly valueStr: string | null;
}

export function parseBlackboard(
    value: unknown,
    name: string,
    options: { readonly allowEmptyKeys: boolean; readonly allowMissingValueStr: boolean },
): readonly BlackboardEntry[] {
    const sourceEntries = denseArray(value, name);
    const keys = new Set<string>();
    const entries: BlackboardEntry[] = [];

    for (const [index, item] of sourceEntries.entries()) {
        const path = `${name}[${index}]`;
        const source = record(item, path);

        for (const key of Object.keys(source)) {
            if (key !== "key" && key !== "value" && key !== "valueStr") {
                throw new TypeError(`${path} has unsupported field ${key}`);
            }
        }

        const key = string(source.key, `${path}.key`);
        if (key.length === 0 && !options.allowEmptyKeys) {
            throw new TypeError(`${path}.key must not be empty`);
        }
        if (keys.has(key)) {
            throw new TypeError(`${name} has duplicate blackboard key ${key}`);
        }

        keys.add(key);

        const number = source.value;

        assertFiniteNumber(number, `${path}.value`);

        const valueStr =
            source.valueStr === undefined && options.allowMissingValueStr ? null : source.valueStr;
        if (valueStr !== null && typeof valueStr !== "string") {
            throw new TypeError(`${path}.valueStr must be a string or null`);
        }

        entries.push({ key, value: number, valueStr });
    }

    return entries;
}
