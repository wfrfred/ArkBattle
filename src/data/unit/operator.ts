import {
    assertFiniteNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../core/common/assert.js";
import type {
    Attributes,
    Candidate,
    FavorFrame,
    Frame,
    Module,
    ModulePart,
    ModuleStage,
    Parameters,
    Phase,
    Selection,
    Skill,
    Tables as OperatorTables,
    Talent,
    Unlock,
} from "../../content/operators/parameters.js";
import { parseBlackboard } from "../blackboard.js";
import { parseRange } from "../range.js";
import { parseArknightsSkillLevel } from "../skill/operator.js";
import { parseGroupTags } from "./tags.js";

interface Tables {
    readonly skills: unknown;
    readonly ranges: unknown;
    readonly equipment: unknown;
    readonly battleEquipment: unknown;
}

export interface RawTables extends Tables {
    readonly characters: unknown;
    readonly favor: unknown;
}

const potentialAttributes: Readonly<Record<string, keyof Attributes>> = {
    MAX_HP: "maxHp",
    ATK: "attack",
    DEF: "defense",
    MAGIC_RESISTANCE: "resistance",
    ATTACK_SPEED: "attackSpeed",
    COST: "cost",
    RESPAWN_TIME: "respawnTime",
};

const moduleAttributes: Readonly<Record<string, keyof Attributes>> = {
    max_hp: "maxHp",
    atk: "attack",
    def: "defense",
    magic_resistance: "resistance",
    attack_speed: "attackSpeed",
    block_cnt: "blockCapacity",
    cost: "cost",
    respawn_time: "respawnTime",
};

function record(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

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

function nullableText(value: unknown, name: string): string | null {
    return value == null ? null : text(value, name);
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
        respawnTime: number(data.respawnTime, "operator respawn time"),
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

function readPhase(value: unknown, ranges: unknown): Phase {
    const phase = record(value, "operator phase");
    assertPositiveSafeInteger(phase.maxLevel, "operator phase maximum level");

    return {
        maxLevel: phase.maxLevel,
        frames: readFrames(phase.attributesKeyFrames),
        range: parseRange(ranges, phase.rangeId),
    };
}

export function extractFavor(value: unknown): readonly FavorFrame[] {
    const favor = record(value, "favor table");

    return array(favor.favorFrames, "favor frames").map((value) => {
        const frame = record(value, "favor frame");
        const { percent, battlePhase, favorPoint } = record(frame.data, "favor frame data");
        assertNonnegativeSafeInteger(percent, "favor percentage");
        assertNonnegativeSafeInteger(battlePhase, "favor battle phase");
        assertNonnegativeSafeInteger(favorPoint, "favor point");

        return { percent, battlePhase, favorPoint };
    });
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

function readSkill(character: Record<string, unknown>, tables: Tables, index: number): Skill {
    assertNonnegativeSafeInteger(index, "operator skill index");

    const selected = record(
        array(character.skills, "operator skills")[index],
        "selected operator skill",
    );
    const id = text(selected.skillId, "selected skill identity");
    const source = record(record(tables.skills, "skill table")[id], "skill record");
    if (source.skillId !== id) {
        throw new TypeError("selected skill record does not match the operator skill");
    }

    const common = array(character.allSkillLvlup, "common skill upgrades");
    const mastery = array(selected.levelUpCostCond, "skill mastery upgrades");
    const upgrades = [...common, ...mastery].map((value) =>
        unlock(record(value, "skill upgrade").unlockCond),
    );

    const levels = array(source.levels, "skill levels").map((_, i) => {
        const { rangeId, ...level } = parseArknightsSkillLevel(source, i + 1);

        return { ...level, range: rangeId === null ? null : parseRange(tables.ranges, rangeId) };
    });

    return {
        index,
        id,
        unlock: unlock(selected.unlockCond),
        upgrades,
        levels,
        overridePrefabKey: nullableText(selected.overridePrefabKey, "skill prefab override"),
        overrideTokenKey: nullableText(selected.overrideTokenKey, "skill token override"),
    };
}

function readTalent(candidate: Record<string, unknown>): Talent {
    return {
        key: text(candidate.prefabKey, "talent prefab key"),
        blackboard: parseBlackboard(candidate.blackboard, "talent blackboard"),
    };
}

function readCandidates<T>(
    value: unknown,
    readValue: (candidate: Record<string, unknown>) => T,
): readonly Candidate<T>[] {
    return array(value, "talent candidates").map((value) => {
        const candidate = record(value, "talent candidate");
        const potentialRank = candidate.requiredPotentialRank;
        assertNonnegativeSafeInteger(potentialRank, "talent required potential rank");

        if (candidate.validModeIndices != null) {
            throw new TypeError("mode-specific operator talent candidates are unsupported");
        }

        return {
            unlock: unlock(candidate.unlockCondition),
            potentialRank,
            value: readValue(candidate),
        };
    });
}

function readModulePart(value: unknown, talentSlots: number): ModulePart | null {
    const part = record(value, "module part");
    const { target } = part;
    if (part.isToken === true || target === "DISPLAY") {
        return null;
    }
    if (part.validInGameTag != null || part.validInMapTag != null) {
        throw new TypeError("mode-specific operator module parts are unsupported");
    }
    if (target === "TRAIT" || target === "TRAIT_DATA_ONLY") {
        return {
            target,
            candidates: readCandidates(
                record(part.overrideTraitDataBundle, "module trait bundle").candidates,
                (candidate) => parseBlackboard(candidate.blackboard, "module trait blackboard"),
            ),
        };
    }
    if (target === "TALENT" || target === "TALENT_DATA_ONLY") {
        return {
            target,
            candidates: readCandidates(
                record(part.addOrOverrideTalentDataBundle, "module talent bundle").candidates,
                (candidate) => {
                    const index = candidate.talentIndex;
                    if (index !== -1) {
                        assertNonnegativeSafeInteger(index, "module talent index");

                        if (index >= talentSlots) {
                            throw new RangeError(
                                "module talent index is outside the operator talent slots",
                            );
                        }
                    }

                    return { ...readTalent(candidate), index };
                },
            ),
        };
    }

    throw new TypeError("unsupported module target " + String(target));
}

function readModule(id: string, moduleId: string, tables: Tables, talentSlots: number): Module {
    const equipment = record(
        record(tables.equipment, "module equipment table")[moduleId],
        "module equipment record",
    );
    if (equipment.uniEquipId !== moduleId || equipment.charId !== id) {
        throw new TypeError("module equipment does not match the selected operator and module");
    }

    const favors = record(equipment.unlockFavors, "module trust unlocks");
    const battle = record(
        record(tables.battleEquipment, "module battle equipment table")[moduleId],
        "module battle equipment record",
    );
    const stages = array(battle.phases, "module phases").map((value): ModuleStage => {
        const stage = record(value, "module phase");
        const level = stage.equipLevel;
        assertPositiveSafeInteger(level, "module level");

        const minFavor = favors[level];
        assertNonnegativeSafeInteger(minFavor, "module required favor point");

        const attributes: Partial<Attributes> = {};

        for (const entry of parseBlackboard(stage.attributeBlackboard, "module attributes")) {
            const key = Object.hasOwn(moduleAttributes, entry.key)
                ? moduleAttributes[entry.key]
                : undefined;
            if (key === undefined || entry.valueStr !== null) {
                throw new TypeError("unsupported module attribute " + entry.key);
            }

            attributes[key] = entry.value;
        }

        const parts = array(stage.parts, "module parts")
            .map((part) => readModulePart(part, talentSlots))
            .filter((part) => part !== null);

        return { level, minFavor, attributes, parts };
    });

    return {
        id: moduleId,
        unlock: unlock({ phase: equipment.unlockEvolvePhase, level: equipment.unlockLevel }),
        stages,
    };
}

export function extract(
    input: { readonly id: string; readonly record: unknown },
    tables: Tables,
    selection: Selection,
): Parameters {
    const id = text(input.id, "operator table identity");
    const character = record(input.record, "operator character record");
    const talents =
        character.talents === null
            ? []
            : array(character.talents, "operator talents").map((value) =>
                  readCandidates(record(value, "operator talent").candidates, readTalent),
              );

    return {
        id,
        groupTags: parseGroupTags(character),
        phases: array(character.phases, "operator phases").map((phase) =>
            readPhase(phase, tables.ranges),
        ),
        favorKeyFrames:
            character.favorKeyFrames === null ? null : readFrames(character.favorKeyFrames),
        potential: array(character.potentialRanks, "operator potential ranks").map(readPotential),
        talents,
        skills: selection.skillIndices.map((index) => readSkill(character, tables, index)),
        modules: selection.moduleIds.map((moduleId) =>
            readModule(id, moduleId, tables, talents.length),
        ),
    };
}

export function fromTables(tables: RawTables): OperatorTables {
    const characters = record(tables.characters, "character table");

    return {
        favor: extractFavor(tables.favor),
        operator: (id, selection) => extract({ id, record: characters[id] }, tables, selection),
    };
}
