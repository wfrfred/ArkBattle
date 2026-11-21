import {
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../core/common/assert.js";
import { roundToEven } from "../../core/common/math.js";
import type { TilePosition } from "../../core/geometry/coordinate.js";
import type { SpDefinition, Trigger } from "../../core/unit/capability/skill/index.js";
import type { Configuration, SkillSelection } from "./configuration.js";
import favor from "./favor.json" with { type: "json" };

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
    respawnTime: number;
}

export interface Frame {
    readonly level: number;
    readonly attributes: Readonly<Attributes>;
}

export interface Phase {
    readonly maxLevel: number;
    readonly frames: readonly Frame[];
    readonly range: readonly TilePosition[];
}

export interface Unlock {
    readonly elite: number;
    readonly level: number;
}

export type Blackboard = readonly {
    readonly key: string;
    readonly value: number;
    readonly valueStr: string | null;
}[];

export interface Talent {
    readonly key: string;
    readonly blackboard: Blackboard;
}

export interface Candidate<T> {
    readonly unlock: Unlock;
    readonly potentialRank: number;
    readonly value: T;
}

export interface SkillLevel {
    readonly range: readonly TilePosition[] | null;
    readonly blackboard: Blackboard;
    readonly trigger: Trigger;
    readonly sp: SpDefinition;
    readonly cost: number;
    readonly durationTicks: number | null;
    readonly prefabId: string;
}

export interface Skill {
    readonly index: number;
    readonly id: string;
    readonly unlock: Unlock;
    readonly upgrades: readonly Unlock[];
    readonly levels: readonly SkillLevel[];
    readonly overridePrefabKey: string | null;
    readonly overrideTokenKey: string | null;
}

export type ModulePart =
    | {
          readonly target: "TRAIT" | "TRAIT_DATA_ONLY";
          readonly candidates: readonly Candidate<Blackboard>[];
      }
    | {
          readonly target: "TALENT" | "TALENT_DATA_ONLY";
          readonly candidates: readonly Candidate<Talent & { readonly index: number }>[];
      };

export interface ModuleStage {
    readonly level: number;
    readonly minFavor: number;
    readonly attributes: Readonly<Partial<Attributes>>;
    readonly parts: readonly ModulePart[];
}

export interface Module {
    readonly id: string;
    readonly unlock: Unlock;
    readonly stages: readonly ModuleStage[];
}

export interface Parameters {
    readonly id: string;
    readonly groupTags: readonly string[];
    readonly phases: readonly Phase[];
    readonly favorKeyFrames: readonly Frame[] | null;
    readonly potential: readonly Readonly<Partial<Attributes>>[];
    readonly talents: readonly (readonly Candidate<Talent>[])[];
    readonly skills: readonly Skill[];
    readonly modules: readonly Module[];
}

const integerAttributes: ReadonlySet<keyof Attributes> = new Set([
    "maxHp",
    "attack",
    "defense",
    "taunt",
    "blockCapacity",
    "cost",
    "respawnTime",
]);

function unlocked(condition: Unlock, configuration: Configuration): boolean {
    return (
        configuration.elite > condition.elite ||
        (configuration.elite === condition.elite && configuration.level >= condition.level)
    );
}

function favorFrame(trust: number) {
    const frame = favor.find((frame) => frame.percent === trust);
    if (frame === undefined) {
        throw new RangeError(`unknown trust percentage ${trust}`);
    }

    return frame;
}

export function selectPhase(phases: readonly Phase[], configuration: Configuration): Phase {
    assertNonnegativeSafeInteger(configuration.elite, "operator elite");
    assertPositiveSafeInteger(configuration.level, "operator level");
    assertPositiveSafeInteger(configuration.potential, "operator potential");
    assertNonnegativeSafeInteger(configuration.trust, "operator trust percentage");

    if (configuration.elite > 2 || configuration.potential > 6 || configuration.trust > 200) {
        throw new RangeError("operator configuration is outside its supported range");
    }

    const phase = phases[configuration.elite];
    if (phase === undefined) {
        throw new RangeError("operator does not have the selected elite phase");
    }
    if (configuration.level > phase.maxLevel) {
        throw new RangeError("operator level exceeds the selected phase maximum");
    }

    return phase;
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
        const value = attributes[key] + (upper.attributes[key] - lower.attributes[key]) * ratio;

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
    parameters: Pick<Parameters, "favorKeyFrames" | "potential">,
    phase: Phase,
    configuration: Configuration,
    module: ModuleStage | undefined,
): Attributes {
    const attributes = interpolate(phase.frames, configuration.level);
    const { battlePhase } = favorFrame(configuration.trust);
    const trust = parameters.favorKeyFrames;
    if (trust !== null) {
        addAttributes(attributes, interpolate(trust, Math.min(battlePhase, trust.at(-1)!.level)));
    }

    const rank = configuration.potential - 1;
    if (rank > parameters.potential.length) {
        throw new RangeError("operator potential exceeds its available ranks");
    }
    for (const addition of parameters.potential.slice(0, rank)) {
        addAttributes(attributes, addition);
    }

    if (module !== undefined) {
        addAttributes(attributes, module.attributes);
    }

    return attributes;
}

export function selectSkill(
    skills: readonly Skill[],
    configuration: Configuration & SkillSelection,
): { readonly id: string; readonly level: SkillLevel } {
    assertNonnegativeSafeInteger(configuration.skillIndex, "operator skill index");
    assertPositiveSafeInteger(configuration.skillLevel, "operator skill level");
    const skill = skills.find(({ index }) => index === configuration.skillIndex);
    if (skill === undefined) {
        throw new RangeError("selected operator skill is unavailable");
    }
    if (!unlocked(skill.unlock, configuration)) {
        throw new RangeError("selected operator skill is locked");
    }

    const index = configuration.skillLevel - 1;
    const level = skill.levels[index];
    if (index > skill.upgrades.length || level === undefined) {
        throw new RangeError("selected skill level exceeds its available upgrades");
    }
    if (skill.upgrades.slice(0, index).some((condition) => !unlocked(condition, configuration))) {
        throw new RangeError("selected skill level requires a higher elite phase or level");
    }

    return { id: skill.id, level };
}

export function selectModule(
    modules: readonly Module[],
    configuration: Configuration,
): ModuleStage | undefined {
    const selection = configuration.module;
    if (selection === undefined) {
        return undefined;
    }

    assertPositiveSafeInteger(selection.level, "module level");

    if (selection.level > 3) {
        throw new RangeError("module level must be between 1 and 3");
    }

    const module = modules.find(({ id }) => id === selection.id);
    if (module === undefined) {
        throw new RangeError("selected module is unavailable for this operator");
    }
    if (!unlocked(module.unlock, configuration)) {
        throw new RangeError("module requires a higher elite phase or level");
    }

    const stage = module.stages.find(({ level }) => level === selection.level);
    if (stage === undefined) {
        throw new RangeError("unknown module level");
    }
    if (favorFrame(configuration.trust).favorPoint < stage.minFavor) {
        throw new RangeError("module level requires more trust");
    }

    return stage;
}

function selectCandidate<T>(
    candidates: readonly Candidate<T>[],
    configuration: Configuration,
): T | undefined {
    let selected: Candidate<T> | undefined;

    for (const candidate of candidates) {
        const { elite, level } = candidate.unlock;
        if (
            candidate.potentialRank > configuration.potential - 1 ||
            !unlocked(candidate.unlock, configuration)
        ) {
            continue;
        }

        if (
            selected === undefined ||
            elite > selected.unlock.elite ||
            (elite === selected.unlock.elite && level > selected.unlock.level) ||
            (elite === selected.unlock.elite &&
                level === selected.unlock.level &&
                candidate.potentialRank > selected.potentialRank)
        ) {
            selected = candidate;
        }
    }

    return selected?.value;
}

export function selectTalents(
    slots: readonly (readonly Candidate<Talent>[])[],
    configuration: Configuration,
    module: ModuleStage | undefined,
): readonly Talent[] {
    const talents = slots.map((candidates) => selectCandidate(candidates, configuration));

    for (const part of module?.parts ?? []) {
        if (part.target !== "TALENT" && part.target !== "TALENT_DATA_ONLY") {
            continue;
        }

        const candidate = selectCandidate(part.candidates, configuration);
        if (candidate === undefined) {
            continue;
        }

        const { index, key, blackboard } = candidate;
        if (index === -1) {
            const previous = talents.findIndex((talent) => talent?.key === key);
            if (previous === -1) {
                talents.push({ key, blackboard });
            } else {
                talents[previous] = { key, blackboard };
            }
        } else {
            talents[index] = { key, blackboard };
        }
    }

    return talents.filter((talent) => talent !== undefined);
}

export function selectTrait(
    configuration: Configuration,
    module: ModuleStage | undefined,
): Blackboard {
    const trait = new Map<string, Blackboard[number]>();

    for (const part of module?.parts ?? []) {
        if (part.target === "TRAIT" || part.target === "TRAIT_DATA_ONLY") {
            for (const entry of selectCandidate(part.candidates, configuration) ?? []) {
                trait.set(entry.key, entry);
            }
        }
    }

    return [...trait.values()];
}
