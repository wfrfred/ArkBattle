import type { Recovery, SpDefinition, Trigger } from "../../core/unit/capability/skill/index.js";
import { secondsToTicks } from "../../core/tick.js";
import { parseBlackboard, type ArknightsBlackboardEntry } from "../blackboard.js";

export interface SkillLevel {
    readonly blackboard: readonly ArknightsBlackboardEntry[];
    readonly trigger: Trigger;
    readonly sp: SpDefinition;
    readonly cost: number;
    readonly durationTicks: number | null;
    readonly prefabId: string;
    readonly rangeId: string | null;
}

function object(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function number(value: unknown, name: string): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new TypeError(`${name} must be a finite number`);
    }

    return value;
}

function activation(value: unknown): Trigger {
    switch (value) {
        case "PASSIVE":
        case 0:
            return "PASSIVE";

        case "AUTO":
        case 1:
            return "AUTO";

        case "MANUAL":
        case 2:
            return "MANUAL";

        default:
            throw new TypeError(`unsupported skill activation ${String(value)}`);
    }
}

function spRecovery(value: unknown): Recovery["type"] {
    switch (value) {
        case "INCREASE_WITH_TIME":
        case 1:
            return "TIME";

        case "INCREASE_WHEN_ATTACK":
        case 2:
            return "ACTION";

        case "INCREASE_WHEN_TAKEN_DAMAGE":
        case 4:
            return "HIT";

        case "NONE":
        case 8:
            return "NONE";

        default:
            throw new TypeError(`unsupported skill SP recovery ${String(value)}`);
    }
}

export function parseArknightsSkillLevel(value: unknown, level: number): SkillLevel {
    const skill = object(value, "skill record");
    if (typeof skill.skillId !== "string" || skill.skillId.length === 0) {
        throw new TypeError("skill record requires an identity");
    }
    if (
        !Number.isSafeInteger(level) ||
        level <= 0 ||
        !Array.isArray(skill.levels) ||
        !Object.hasOwn(skill.levels, level - 1)
    ) {
        throw new RangeError(`unknown skill level ${level} for ${skill.skillId}`);
    }

    const selected = object(skill.levels[level - 1], "skill level");
    if (selected.durationType === "AMMO" || selected.durationType === 1) {
        throw new TypeError(
            "AMMO operator skills require dedicated content and are unsupported here",
        );
    }
    if (
        selected.durationType !== undefined &&
        selected.durationType !== "NONE" &&
        selected.durationType !== 0
    ) {
        throw new TypeError("unsupported skill duration mode");
    }

    const sp = object(selected.spData, "skill SP data");
    const spCost = number(sp.spCost, "skill SP cost");
    const recovery = spRecovery(sp.spType);
    const increment = number(sp.increment, "skill SP increment");
    const durationSeconds = number(selected.duration, "skill duration");

    if (increment < 0 || (recovery === "TIME" && increment === 0)) {
        throw new RangeError("skill SP increment must enable its recovery mode");
    }
    if (durationSeconds < 0 && durationSeconds !== -1) {
        throw new RangeError("skill duration must be nonnegative or unlimited");
    }

    let recoveryDefinition: Recovery;

    if (recovery === "TIME") {
        recoveryDefinition = { type: "TIME" };
    } else if (recovery === "NONE") {
        recoveryDefinition = { type: "NONE" };
    } else {
        recoveryDefinition = { type: recovery, amount: increment };
    }

    const { prefabId, rangeId } = selected;
    if (typeof prefabId !== "string" || prefabId.length === 0) {
        throw new TypeError("skill prefab identity must be a nonempty string");
    }
    if (rangeId !== null && (typeof rangeId !== "string" || rangeId.length === 0)) {
        throw new TypeError("skill range identity must be a nonempty string or null");
    }

    return {
        sp: {
            initial: number(sp.initSp, "skill initial SP"),
            capacity: spCost * number(sp.maxChargeTime, "skill maximum charges"),
            recovery: recoveryDefinition,
            recoverySpeed: {
                default: recovery === "TIME" ? increment : 0,
                min: 0,
                max: null,
            },
            recoveryMultiplier: { default: 1, min: 0, max: null },
        },
        trigger: activation(selected.skillType),
        cost: spCost,
        durationTicks:
            durationSeconds === -1 ? null : secondsToTicks(durationSeconds, "skill duration"),
        prefabId,
        rangeId,
        blackboard: parseBlackboard(selected.blackboard, "skill blackboard", {
            allowEmptyKeys: false,
            allowMissingValueStr: false,
        }),
    };
}
