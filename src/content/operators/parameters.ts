import {
    assertFiniteNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../core/common/assert.js";
import { roundToEven } from "../../core/common/math.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import { parseBlackboard, type BlackboardEntry } from "../../data/blackboard.js";
import { parseRange } from "../../data/range.js";
import { parseArknightsSkillLevel } from "../../data/skill/operator.js";
import { record } from "../../data/json.js";
import type { Table, Tables } from "../../data/tables.js";
import type { Configuration, SkillSelection } from "./configuration.js";

export interface Attributes {
    maxHp: number;
    attack: number;
    defense: number;
    resistance: number;
    recoverySpeed: number;
    attackSpeed: number;
    taunt: number;
    baseAttackTime: number;
    blockCapacity: number;
    cost: number;
    redeployTime: number;
}

interface Frame {
    readonly level: number;
    readonly attributes: Readonly<Attributes>;
}

interface Phase {
    readonly frames: readonly Frame[];
    readonly range: readonly TilePosition[];
}

export interface Growth {
    readonly phase: Phase;
    readonly favorKeyFrames: readonly Frame[] | null;
    readonly potential: readonly Readonly<Partial<Attributes>>[];
}

interface Unlock {
    readonly elite: number;
    readonly level: number;
}

export type Blackboard = readonly BlackboardEntry[];

export interface Talent {
    readonly key: string;
    readonly blackboard: Blackboard;
}

export interface ModuleStage {
    readonly level: number;
    readonly attributes: Readonly<Partial<Attributes>>;
    readonly parts: readonly unknown[];
}

export interface TrustFrame {
    readonly percent: number;
    readonly battlePhase: number;
    readonly favorPoint: number;
}

const integerAttributes: ReadonlySet<keyof Attributes> = new Set([
    "maxHp",
    "attack",
    "defense",
    "taunt",
    "blockCapacity",
    "cost",
    "redeployTime",
]);

const potentialAttributes: Readonly<Record<string, keyof Attributes>> = {
    MAX_HP: "maxHp",
    ATK: "attack",
    DEF: "defense",
    MAGIC_RESISTANCE: "resistance",
    ATTACK_SPEED: "attackSpeed",
    COST: "cost",
    RESPAWN_TIME: "redeployTime",
};

const moduleAttributes: Readonly<Record<string, keyof Attributes>> = {
    max_hp: "maxHp",
    atk: "attack",
    def: "defense",
    magic_resistance: "resistance",
    attack_speed: "attackSpeed",
    block_cnt: "blockCapacity",
    cost: "cost",
    respawn_time: "redeployTime",
};

function array(value: unknown, name: string): readonly unknown[] {
    if (!Array.isArray(value)) {
        throw new TypeError(`${name} must be an array`);
    }

    for (let index = 0; index < value.length; index++) {
        if (!Object.hasOwn(value, index) || value[index] === undefined) {
            throw new TypeError(`${name} must be dense`);
        }
    }

    return value as readonly unknown[];
}

function text(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new TypeError(`${name} must be a nonempty string`);
    }

    return value;
}

function number(value: unknown, name: string): number {
    assertFiniteNumber(value, name);

    return value;
}

function elite(value: unknown): number {
    switch (value) {
        case "PHASE_0":
            return 0;

        case "PHASE_1":
            return 1;

        case "PHASE_2":
            return 2;

        default:
            throw new TypeError(`unknown elite phase ${String(value)}`);
    }
}

function unlock(value: unknown): Unlock {
    const condition = record(value, "unlock condition");
    const phase = elite(condition.phase);
    const level = condition.level;
    assertNonnegativeSafeInteger(level, "unlock level");

    return { elite: phase, level };
}

function unlocked(condition: Unlock, configuration: Configuration): boolean {
    return (
        configuration.elite > condition.elite ||
        (configuration.elite === condition.elite && configuration.level >= condition.level)
    );
}

function readAttributes(value: unknown): Attributes {
    const data = record(value, "operator attribute data");

    return {
        maxHp: number(data.maxHp, "operator maxHp"),
        attack: number(data.atk, "operator attack"),
        defense: number(data.def, "operator defense"),
        resistance: number(data.magicResistance, "operator resistance"),
        recoverySpeed: number(data.hpRecoveryPerSec, "operator HP recovery speed"),
        attackSpeed: number(data.attackSpeed, "operator attack speed"),
        taunt: number(data.tauntLevel, "operator taunt level"),
        baseAttackTime: number(data.baseAttackTime, "operator base attack time"),
        blockCapacity: number(data.blockCnt, "operator block capacity"),
        cost: number(data.cost, "operator cost"),
        redeployTime: number(data.respawnTime, "operator redeploy time"),
    };
}

function readFrames(value: unknown): readonly Frame[] {
    const frames = array(value, "operator attribute keyframes").map((value) => {
        const frame = record(value, "operator attribute keyframe");
        assertNonnegativeSafeInteger(frame.level, "operator attribute keyframe level");

        return { level: frame.level, attributes: readAttributes(frame.data) };
    });

    if (frames.length === 0) {
        throw new RangeError("operator requires attribute keyframes");
    }
    for (let index = 1; index < frames.length; index++) {
        if (frames[index]!.level <= frames[index - 1]!.level) {
            throw new TypeError("operator attribute keyframes must have increasing levels");
        }
    }

    return frames;
}

function readPotential(value: unknown): Partial<Attributes> {
    const potential = record(value, "operator potential rank");
    if (potential.type === "CUSTOM" && potential.buff === null) {
        return {};
    }
    if (potential.type !== "BUFF") {
        throw new TypeError("unsupported operator potential type");
    }

    const attributes: Partial<Attributes> = {};
    const buff = record(potential.buff, "potential buff");
    const data = record(buff.attributes, "potential buff attributes");

    for (const value of array(data.attributeModifiers, "potential attribute modifiers")) {
        const modifier = record(value, "potential attribute modifier");
        const type = text(modifier.attributeType, "potential attribute type");
        const key = Object.hasOwn(potentialAttributes, type)
            ? potentialAttributes[type]
            : undefined;
        if (
            key === undefined ||
            modifier.formulaItem !== "ADDITION" ||
            modifier.loadFromBlackboard !== false ||
            modifier.fetchBaseValueFromSourceEntity !== false
        ) {
            throw new TypeError("unsupported operator potential attribute modifier");
        }

        attributes[key] =
            (attributes[key] ?? 0) + number(modifier.value, "potential attribute addition");
    }

    return attributes;
}

export function growth(character: Table, ranges: Table, configuration: Configuration): Growth {
    assertNonnegativeSafeInteger(configuration.elite, "operator elite");
    assertPositiveSafeInteger(configuration.level, "operator level");
    assertPositiveSafeInteger(configuration.potential, "operator potential");
    assertNonnegativeSafeInteger(configuration.trust, "operator trust percentage");

    if (configuration.elite > 2 || configuration.potential > 6 || configuration.trust > 200) {
        throw new RangeError("operator configuration is outside its supported range");
    }

    const selected = array(character.phases, "operator phases")[configuration.elite];
    if (selected === undefined) {
        throw new RangeError("operator does not have the selected elite phase");
    }

    const phase = record(selected, "operator phase");
    assertPositiveSafeInteger(phase.maxLevel, "operator phase maximum level");

    if (configuration.level > phase.maxLevel) {
        throw new RangeError("operator level exceeds the selected phase maximum");
    }

    const ranks = array(character.potentialRanks, "operator potential ranks");
    const rank = configuration.potential - 1;
    if (rank > ranks.length) {
        throw new RangeError("operator potential exceeds its available ranks");
    }

    return {
        phase: {
            frames: readFrames(phase.attributesKeyFrames),
            range: parseRange(ranges, phase.rangeId),
        },
        favorKeyFrames:
            character.favorKeyFrames === null ? null : readFrames(character.favorKeyFrames),
        potential: ranks.slice(0, rank).map(readPotential),
    };
}

export function resolveTrust(favor: Table, trust: number): TrustFrame {
    for (const value of array(favor.favorFrames, "favor frames")) {
        const frame = record(value, "favor frame");
        const { percent, battlePhase, favorPoint } = record(frame.data, "favor frame data");
        if (percent === trust) {
            assertNonnegativeSafeInteger(percent, "favor percentage");
            assertNonnegativeSafeInteger(battlePhase, "favor battle phase");
            assertNonnegativeSafeInteger(favorPoint, "favor point");

            return { percent, battlePhase, favorPoint };
        }
    }

    throw new RangeError(`unknown trust percentage ${trust}`);
}

function interpolate(frames: readonly Frame[], level: number): Attributes {
    const first = frames[0];
    const upperIndex = frames.findIndex((frame) => frame.level >= level);
    if (first === undefined || level < first.level || upperIndex < 0) {
        throw new RangeError("operator level is outside attribute keyframes");
    }

    const upper = frames[upperIndex]!;
    const lower = frames[Math.max(0, upperIndex - 1)]!;
    const ratio =
        upper.level === lower.level ? 0 : (level - lower.level) / (upper.level - lower.level);
    const attributes = { ...lower.attributes };

    for (const key of Object.keys(attributes) as (keyof Attributes)[]) {
        const value = attributes[key] + (upper.attributes[key] - attributes[key]) * ratio;

        attributes[key] = integerAttributes.has(key) ? roundToEven(value) : value;
    }

    return attributes;
}

function addAttributes(attributes: Attributes, addition: Readonly<Partial<Attributes>>): void {
    for (const key of Object.keys(addition) as (keyof Attributes)[]) {
        attributes[key] += addition[key]!;
    }
}

export function resolveAttributes(
    growth: Growth,
    configuration: Configuration,
    module: Pick<ModuleStage, "attributes"> | null,
    trustFrame: TrustFrame,
): Attributes {
    const attributes = interpolate(growth.phase.frames, configuration.level);
    const trust = growth.favorKeyFrames;
    if (trust !== null) {
        addAttributes(
            attributes,
            interpolate(trust, Math.min(trustFrame.battlePhase, trust.at(-1)!.level)),
        );
    }

    for (const addition of growth.potential) {
        addAttributes(attributes, addition);
    }

    if (module !== null) {
        addAttributes(attributes, module.attributes);
    }

    return attributes;
}

export function selectSkill(
    character: Table,
    tables: Pick<Tables, "skills" | "ranges">,
    configuration: Configuration & SkillSelection,
) {
    const { skillIndex, skillLevel } = configuration;
    assertNonnegativeSafeInteger(skillIndex, "operator skill index");
    assertPositiveSafeInteger(skillLevel, "operator skill level");

    const selected = array(character.skills, "operator skills")[skillIndex];
    if (selected === undefined) {
        throw new RangeError("selected operator skill is unavailable");
    }

    const slot = record(selected, "selected operator skill");
    if (!unlocked(unlock(slot.unlockCond), configuration)) {
        throw new RangeError("selected operator skill is locked");
    }

    const id = text(slot.skillId, "selected skill identity");
    const source = record(tables.skills[id], "skill record");
    if (source.skillId !== id) {
        throw new TypeError("selected skill record does not match the operator skill");
    }

    const common = array(character.allSkillLvlup, "common skill upgrades");
    const mastery = array(slot.levelUpCostCond, "skill mastery upgrades");
    const upgrades = [...common, ...mastery];
    const index = skillLevel - 1;
    if (index > upgrades.length || array(source.levels, "skill levels")[index] === undefined) {
        throw new RangeError("selected skill level exceeds its available upgrades");
    }
    if (
        upgrades.slice(0, index).some((value) => {
            const condition = unlock(record(value, "skill upgrade").unlockCond);

            return !unlocked(condition, configuration);
        })
    ) {
        throw new RangeError("selected skill level requires a higher elite phase or level");
    }

    const { rangeId, ...level } = parseArknightsSkillLevel(source, skillLevel);

    return {
        id,
        level: { ...level, range: rangeId === null ? null : parseRange(tables.ranges, rangeId) },
    };
}

export function selectModule(
    operatorId: string,
    tables: Pick<Tables, "equipment" | "battleEquipment">,
    configuration: Configuration,
    trustFrame: TrustFrame,
): ModuleStage | null {
    const selection = configuration.module;
    if (selection === null) {
        return null;
    }

    assertPositiveSafeInteger(selection.level, "module level");

    if (selection.level > 3) {
        throw new RangeError("module level must be between 1 and 3");
    }

    const equipment = record(tables.equipment.equipDict, "module equipment table");
    const raw = record(equipment[selection.id], "module equipment record");
    if (raw.uniEquipId !== selection.id || raw.charId !== operatorId) {
        throw new TypeError("module equipment does not match the selected operator and module");
    }

    const condition = unlock({ phase: raw.unlockEvolvePhase, level: raw.unlockLevel });
    if (!unlocked(condition, configuration)) {
        throw new RangeError("module requires a higher elite phase or level");
    }

    const battle = record(tables.battleEquipment[selection.id], "module battle equipment record");
    const selected = array(battle.phases, "module phases").find(
        (value) => record(value, "module phase").equipLevel === selection.level,
    );
    if (selected === undefined) {
        throw new RangeError("unknown module level");
    }

    const minFavor = record(raw.unlockFavors, "module trust unlocks")[selection.level];
    assertNonnegativeSafeInteger(minFavor, "module required favor point");

    if (trustFrame.favorPoint < minFavor) {
        throw new RangeError("module level requires more trust");
    }

    const stage = record(selected, "module phase");
    const attributes: Partial<Attributes> = {};

    for (const entry of parseBlackboard(stage.attributeBlackboard, "module attributes", {
        allowEmptyKeys: false,
        allowMissingValueStr: false,
    })) {
        const key = Object.hasOwn(moduleAttributes, entry.key)
            ? moduleAttributes[entry.key]
            : undefined;
        if (key === undefined || entry.valueStr !== null) {
            throw new TypeError("unsupported module attribute " + entry.key);
        }

        attributes[key] = entry.value;
    }

    return {
        level: selection.level,
        attributes,
        parts: array(stage.parts, "module parts"),
    };
}

function selectCandidate(candidates: unknown, configuration: Configuration): Table | undefined {
    let selected:
        | {
              readonly data: Table;
              readonly condition: Unlock;
              readonly rank: number;
          }
        | undefined;

    for (const value of array(candidates, "talent candidates")) {
        const data = record(value, "talent candidate");
        if (data.validModeIndices != null) {
            continue;
        }

        const rank = data.requiredPotentialRank;
        assertNonnegativeSafeInteger(rank, "talent required potential rank");
        const condition = unlock(data.unlockCondition);
        if (rank > configuration.potential - 1 || !unlocked(condition, configuration)) {
            continue;
        }

        if (
            selected === undefined ||
            condition.elite > selected.condition.elite ||
            (condition.elite === selected.condition.elite &&
                (condition.level > selected.condition.level ||
                    (condition.level === selected.condition.level && rank > selected.rank)))
        ) {
            selected = { data, condition, rank };
        }
    }

    return selected?.data;
}

function readTalent(candidate: Table): Talent {
    return {
        key: text(candidate.prefabKey, "talent prefab key"),
        blackboard: parseBlackboard(candidate.blackboard, "talent blackboard", {
            allowEmptyKeys: false,
            allowMissingValueStr: false,
        }),
    };
}

function ordinaryPart(value: unknown, target: "TRAIT" | "TALENT"): Table | undefined {
    const part = record(value, "module part");

    return part.isToken === true ||
        part.validInGameTag != null ||
        part.validInMapTag != null ||
        (part.target !== target && part.target !== `${target}_DATA_ONLY`)
        ? undefined
        : part;
}

export function selectTalents(
    character: Table,
    configuration: Configuration,
    module: ModuleStage | null,
): readonly Talent[] {
    const slots = character.talents === null ? [] : array(character.talents, "operator talents");
    const talents = slots.map((value) =>
        selectCandidate(record(value, "operator talent").candidates, configuration),
    );

    for (const value of module?.parts ?? []) {
        const part = ordinaryPart(value, "TALENT");
        if (part === undefined) {
            continue;
        }

        const bundle = record(part.addOrOverrideTalentDataBundle, "module talent bundle");
        const candidate = selectCandidate(bundle.candidates, configuration);
        if (candidate === undefined) {
            continue;
        }

        const index = candidate.talentIndex;
        if (index === -1) {
            const key = text(candidate.prefabKey, "talent prefab key");
            const previous = talents.findIndex((item) => item?.prefabKey === key);
            if (previous === -1) {
                talents.push(candidate);
            } else {
                talents[previous] = candidate;
            }
        } else {
            assertNonnegativeSafeInteger(index, "module talent index");

            if (index >= slots.length) {
                throw new RangeError("module talent index is outside the operator talent slots");
            }

            talents[index] = candidate;
        }
    }

    return talents.filter((talent) => talent !== undefined).map(readTalent);
}

export function selectTrait(configuration: Configuration, module: ModuleStage | null): Blackboard {
    const trait = new Map<string, Blackboard[number]>();

    for (const value of module?.parts ?? []) {
        const part = ordinaryPart(value, "TRAIT");
        if (part === undefined) {
            continue;
        }

        const bundle = record(part.overrideTraitDataBundle, "module trait bundle");
        const candidate = selectCandidate(bundle.candidates, configuration);
        if (candidate !== undefined) {
            for (const entry of parseBlackboard(candidate.blackboard, "module trait blackboard", {
                allowEmptyKeys: false,
                allowMissingValueStr: false,
            })) {
                trait.set(entry.key, entry);
            }
        }
    }

    return [...trait.values()];
}
