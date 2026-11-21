import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../core/common/assert.js";
import { RANKS, type Rank } from "../../core/unit/capability/classification/index.js";
import { parseTags } from "./tags.js";

type RecordData = Readonly<Record<string, unknown>>;

export interface Configuration {
    readonly level: number;
    readonly overwrittenData?: unknown;
}

export interface ResolvedEnemy {
    readonly id: string;
    readonly level: number;
    readonly prefabKey: string;
    readonly notCountInTotal: boolean;
    readonly attributes: RecordData;
    readonly fields: RecordData;
    readonly layers: readonly RecordData[];
}

export interface EnemyParameters {
    readonly maxHp: number;
    readonly attack: number;
    readonly defense: number;
    readonly resistance: number;
    readonly recoverySpeed: number;
    readonly attackSpeed: number;
    readonly taunt: number;
    readonly baseAttackTime: number;
    readonly moveSpeedPerSecond: number;
    readonly rangeRadius: number;
    readonly massLevel: number;
    readonly blockVolume: number;
    readonly stunImmune: boolean;
    readonly filterTags: readonly string[];
    readonly rank: Rank;
    readonly motion: string;
}

function record(value: unknown, name: string): RecordData {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as RecordData;
}

function mergeDefined(target: Map<string, unknown>, source: RecordData, name: string): void {
    for (const [key, value] of Object.entries(source)) {
        if (value === null || typeof value !== "object" || !("m_defined" in value)) {
            continue;
        }

        if (typeof value.m_defined !== "boolean") {
            throw new TypeError(`enemy ${name}.${key}.m_defined must be boolean`);
        }
        if (!value.m_defined) {
            continue;
        }
        if (!("m_value" in value) || value.m_value === undefined) {
            throw new TypeError(`defined enemy ${name}.${key} requires m_value`);
        }

        target.set(key, value.m_value);
    }
}

function textValue(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new TypeError(`${name} must be nonempty`);
    }

    return value;
}

function flag(value: unknown, name: string): boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`${name} must be boolean`);
    }

    return value;
}

export function resolveEnemy(value: unknown, configuration: Configuration): ResolvedEnemy {
    const { level, overwrittenData } = configuration;
    assertNonnegativeSafeInteger(level, "enemy level");

    const source = record(value, "enemy database entry");
    const id = textValue(source.Key, "enemy database Key");
    const entries = source.Value;
    if (!Array.isArray(entries)) {
        throw new TypeError("enemy database Value must be an array");
    }

    const levels = new Map<number, RecordData>();

    for (let index = 0; index < entries.length; index++) {
        if (!Object.hasOwn(entries, index) || entries[index] === undefined) {
            throw new TypeError("enemy database Value must be dense");
        }

        const entry = record(entries[index], "enemy level entry");
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

    const attributes = new Map<string, unknown>();
    const fields = new Map<string, unknown>();

    for (const layer of layers) {
        if (layer.attributes !== undefined) {
            mergeDefined(attributes, record(layer.attributes, "enemy attributes"), "attributes");
        }

        mergeDefined(fields, layer, "data");
    }

    const notCountInTotal = fields.get("notCountInTotal");

    return {
        id,
        level,
        prefabKey: textValue(fields.get("prefabKey"), "enemy prefabKey"),
        notCountInTotal:
            notCountInTotal === undefined ? false : flag(notCountInTotal, "enemy notCountInTotal"),
        attributes: Object.fromEntries(attributes),
        fields: Object.fromEntries(fields),
        layers,
    };
}

function numeric(source: RecordData, key: string, fallback?: number): number {
    const value = source[key] ?? fallback;
    assertNonnegativeNumber(value, `enemy ${key}`);

    return value;
}

function rank(value: unknown): Rank {
    for (const rank of RANKS) {
        if (value === rank) {
            return rank;
        }
    }

    throw new TypeError(`unknown enemy rank ${String(value)}`);
}

export function readEnemyParameters({ attributes, fields }: ResolvedEnemy): EnemyParameters {
    const maxHp = numeric(attributes, "maxHp");
    const baseAttackTime = numeric(attributes, "baseAttackTime");
    const massLevel = numeric(attributes, "massLevel", 0);
    const blockVolume = numeric(attributes, "blockCnt", 1);
    const taunt = attributes.tauntLevel ?? 0;
    assertPositiveNumber(maxHp, "enemy maxHp");
    assertPositiveNumber(baseAttackTime, "enemy baseAttackTime");
    assertNonnegativeSafeInteger(massLevel, "enemy mass level");
    assertNonnegativeSafeInteger(blockVolume, "enemy block volume");
    assertFiniteNumber(taunt, "enemy taunt level");

    return {
        maxHp,
        attack: numeric(attributes, "atk"),
        defense: numeric(attributes, "def", 0),
        resistance: numeric(attributes, "magicResistance", 0),
        recoverySpeed: numeric(attributes, "hpRecoveryPerSec", 0),
        attackSpeed: numeric(attributes, "attackSpeed", 100),
        taunt,
        baseAttackTime,
        moveSpeedPerSecond: numeric(attributes, "moveSpeed"),
        rangeRadius: numeric(fields, "rangeRadius", 0),
        massLevel,
        blockVolume,
        stunImmune: flag(attributes.stunImmune ?? false, "enemy stunImmune"),
        filterTags: parseTags(fields.enemyTags ?? []),
        rank: rank(fields.levelType === undefined ? "NORMAL" : fields.levelType),
        motion: textValue(fields.motion, "enemy motion"),
    };
}
