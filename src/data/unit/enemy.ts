import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../core/common/assert.js";
import { RANKS, type Rank } from "../../core/unit/capability/classification/index.js";
import { parseTags } from "./tags.js";
import { record, nonemptyString as textValue, boolean as flag } from "../json.js";
import { mergeDefinedFields, selectEnemyLayers } from "../enemy-database.js";

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
    readonly lifePointLoss: number;
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

export function resolveEnemy(value: unknown, configuration: Configuration): ResolvedEnemy {
    const { id, level, layers } = selectEnemyLayers(
        value,
        configuration.level,
        configuration.overwrittenData,
    );
    const attributes = mergeDefinedFields(
        layers
            .filter((layer) => layer.attributes !== undefined)
            .map((layer) => record(layer.attributes, "enemy attributes")),
    );
    const fields = mergeDefinedFields(layers);

    const notCountInTotal = fields.notCountInTotal;
    const lifePointReduce = fields.lifePointReduce;
    const lifePointLoss = lifePointReduce === undefined ? 1 : lifePointReduce;
    assertNonnegativeSafeInteger(lifePointLoss, "enemy lifePointReduce");

    return {
        id,
        level,
        prefabKey: textValue(fields.prefabKey, "enemy prefabKey"),
        notCountInTotal:
            notCountInTotal === undefined ? false : flag(notCountInTotal, "enemy notCountInTotal"),
        lifePointLoss,
        attributes,
        fields,
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
