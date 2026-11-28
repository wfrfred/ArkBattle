import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../core/common/assert.js";
import { RANKS, type Rank } from "../../core/unit/capability/classification/index.js";
import { parseTags } from "../../data/unit/tags.js";
import { record, nonemptyString as textValue, boolean as flag } from "../../data/json.js";
import { mergeDefinedFields } from "../../data/enemy-database.js";

type RecordData = Readonly<Record<string, unknown>>;

export interface Configuration {
    readonly level: number;
    readonly overwrittenData?: unknown;
}

export function readAttributes(layers: readonly RecordData[]) {
    return mergeDefinedFields(
        layers
            .filter((layer) => layer.attributes !== undefined)
            .map((layer) => record(layer.attributes, "enemy attributes")),
    );
}

export function readSpawnFacts(fields: RecordData) {
    const notCountInTotal = fields.notCountInTotal;
    const lifePointLoss = fields.lifePointReduce === undefined ? 1 : fields.lifePointReduce;
    assertNonnegativeSafeInteger(lifePointLoss, "enemy lifePointReduce");

    return {
        notCountInTotal:
            notCountInTotal === undefined ? false : flag(notCountInTotal, "enemy notCountInTotal"),
        lifePointLoss,
    };
}

export function validateWalkingPrefab(fields: RecordData, prefabKey: string): void {
    if (textValue(fields.prefabKey, "enemy prefabKey") !== prefabKey) {
        throw new TypeError(`unsupported enemy prefab ${String(fields.prefabKey)}`);
    }
    if (fields.motion !== "WALK") {
        throw new TypeError(`unsupported enemy motion ${String(fields.motion)}`);
    }
}

export function numeric(source: RecordData, key: string, fallback?: number): number {
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

export function readCombatParameters(attributes: RecordData, fields: RecordData) {
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

    if (flag(attributes.stunImmune ?? false, "enemy stunImmune")) {
        throw new TypeError("this enemy content does not implement stun immunity");
    }
    if (blockVolume === 0) {
        throw new TypeError("this enemy content requires a blockable ground unit");
    }

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
        massLevel,
        blockVolume,
        filterTags: parseTags(fields.enemyTags ?? []),
        rank: rank(fields.levelType === undefined ? "NORMAL" : fields.levelType),
    };
}
