import { record, type Tables } from "../../../data/unit/operator.js";
import { parseGroupTags } from "../../../data/unit/tags.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    favorFrame,
    growth,
    resolveAttributes,
    selectSkill,
    selectTalents,
} from "../parameters.js";
import type { AttackParameters } from "./action.js";

const operatorId = "char_208_melan";

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

    const character = record(tables.characters[operatorId], "operator character record");
    const progression = growth(character, tables.ranges, configuration);
    const { phase } = progression;
    const favor = favorFrame(tables.favor, configuration.trust);
    const attributes = resolveAttributes(progression, configuration, undefined, favor);
    const { id, level } = selectSkill(character, tables, configuration);
    const { blackboard, cost, durationTicks, sp, trigger } = level;
    const attackBonus = blackboard.find((entry) => entry.key === "atk")?.value;
    if (attackBonus === undefined || durationTicks === null) {
        throw new TypeError("Melantha's first skill requires an attack bonus and a duration");
    }

    const talentBonus = selectTalents(character, configuration, undefined)
        .find((talent) => talent.key === "1")
        ?.blackboard.find((entry) => entry.key === "atk")?.value;

    return {
        id: operatorId,
        groupTags: parseGroupTags(character),
        attributes,
        attack: { range: phase.range, timing },
        s1: { id, cost, durationTicks, sp, trigger, attackBonus },
        talentBonus,
    };
}
