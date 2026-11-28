import { assertNonnegativeSafeInteger } from "../core/common/assert.js";
import { denseArray, nonemptyString, record } from "./json.js";

type RecordData = Readonly<Record<string, unknown>>;

export function parseEnemyDatabase(value: unknown): ReadonlyMap<string, RecordData> {
    const entries = new Map<string, RecordData>();
    const source = record(value, "enemy database");

    for (const item of denseArray(source.enemies, "enemy database enemies")) {
        const entry = record(item, "enemy database entry");
        const id = nonemptyString(entry.Key, "enemy database Key");
        if (entries.has(id)) {
            throw new RangeError(`duplicate enemy database Key ${id}`);
        }

        entries.set(id, entry);
    }

    return entries;
}

export interface EnemyLayers {
    readonly id: string;
    readonly level: number;
    readonly layers: readonly RecordData[];
}

export function selectEnemyLayers(
    value: unknown,
    level: number,
    overwrittenData?: unknown,
): EnemyLayers {
    assertNonnegativeSafeInteger(level, "enemy level");

    const source = record(value, "enemy database entry");
    const id = nonemptyString(source.Key, "enemy database Key");
    const levels = new Map<number, RecordData>();

    for (const item of denseArray(source.Value, "enemy database Value")) {
        const entry = record(item, "enemy level entry");
        const entryLevel = entry.level;
        assertNonnegativeSafeInteger(entryLevel, "enemy level");

        if (levels.has(entryLevel)) {
            throw new RangeError(`duplicate enemy level ${entryLevel}`);
        }

        levels.set(entryLevel, entry);
    }

    const base = levels.get(0);
    if (base === undefined) {
        throw new RangeError("enemy database requires level 0");
    }

    const selected = levels.get(level);
    if (selected === undefined) {
        throw new RangeError(`unknown enemy level ${level}`);
    }

    const layers = [record(base.enemyData, "enemy level data")];
    if (level !== 0) {
        layers.push(record(selected.enemyData, "enemy level data"));
    }
    if (overwrittenData != null) {
        layers.push(record(overwrittenData, "enemy overwrittenData"));
    }

    return { id, level, layers };
}

export function mergeDefinedFields(layers: readonly RecordData[]): RecordData {
    const result = new Map<string, unknown>();

    for (const layer of layers) {
        for (const [key, value] of Object.entries(layer)) {
            if (value === null || typeof value !== "object" || !("m_defined" in value)) {
                continue;
            }
            if (typeof value.m_defined !== "boolean") {
                throw new TypeError(`${key}.m_defined must be boolean`);
            }
            if (!value.m_defined) {
                continue;
            }
            if (!("m_value" in value) || value.m_value === undefined) {
                throw new TypeError(`defined ${key} requires m_value`);
            }

            result.set(key, value.m_value);
        }
    }

    return Object.fromEntries(result);
}
