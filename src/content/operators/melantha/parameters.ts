import type { Configuration, SkillSelection } from "../configuration.js";
import {
    resolveAttributes,
    selectPhase,
    selectSkill,
    selectTalents,
    type Tables,
} from "../parameters.js";
import type { AttackParameters } from "./action.js";

const timing: AttackParameters["timing"] = {
    type: "ATTACK_SPEED",
    beginTicks: 15,
    durationTicks: 30,
    releaseTicks: 14,
    minScale: 0,
    maxScale: null,
};

export function resolve(configuration: Configuration & SkillSelection, tables: Tables) {
    if (configuration.skillIndex !== 0) {
        throw new TypeError("Melantha content requires her first skill");
    }
    if (configuration.module !== undefined) {
        throw new RangeError("selected module is unavailable for this operator");
    }

    const parameters = tables.operator("char_208_melan", { skillIndices: [0], moduleIds: [] });
    const phase = selectPhase(parameters.phases, configuration);
    const attributes = resolveAttributes(parameters, phase, configuration, undefined, tables.favor);
    const { id, level } = selectSkill(parameters.skills, configuration);
    const { blackboard, cost, durationTicks, sp, trigger } = level;
    const attackBonus = blackboard.find((entry) => entry.key === "atk")?.value;
    if (attackBonus === undefined || durationTicks === null) {
        throw new TypeError("Melantha's first skill requires an attack bonus and a duration");
    }

    const talentBonus = selectTalents(parameters.talents, configuration, undefined)
        .find((talent) => talent.key === "1")
        ?.blackboard.find((entry) => entry.key === "atk")?.value;

    return {
        id: parameters.id,
        groupTags: parameters.groupTags,
        attributes,
        attack: { range: phase.range, timing },
        s1: { id, cost, durationTicks, sp, trigger, attackBonus },
        talentBonus,
    };
}
