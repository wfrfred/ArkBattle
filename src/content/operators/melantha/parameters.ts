import { record } from "../../../data/json.js";
import type { Tables } from "../../../data/tables.js";
import { parseGroupTags } from "../../../data/unit/tags.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    favorFrame,
    growth,
    resolveAttributes,
    selectSkill,
    selectTalents,
} from "../parameters.js";

export const operatorId = "char_208_melan";

export function resolve(configuration: Configuration & SkillSelection, tables: Tables) {
    if (configuration.skillIndex !== 0) {
        throw new TypeError("Melantha content requires her first skill");
    }
    if (configuration.module !== null) {
        throw new RangeError("selected module is unavailable for this operator");
    }

    const character = record(tables.characters[operatorId], "operator character record");
    const progression = growth(character, tables.ranges, configuration);
    const { phase } = progression;
    const favor = favorFrame(tables.favor, configuration.trust);
    const attributes = resolveAttributes(progression, configuration, null, favor);
    const { id, level } = selectSkill(character, tables, configuration);
    const { blackboard, cost, durationTicks, sp, trigger } = level;
    const attackBonus = blackboard.find((entry) => entry.key === "atk")?.value;
    if (attackBonus === undefined || durationTicks === null) {
        throw new TypeError("Melantha's first skill requires an attack bonus and a duration");
    }

    const talentBonus =
        selectTalents(character, configuration, null)
            .find((talent) => talent.key === "1")
            ?.blackboard.find((entry) => entry.key === "atk")?.value ?? null;

    return {
        groupTags: parseGroupTags(character),
        attributes,
        attack: { range: phase.range },
        s1: { id, cost, durationTicks, sp, trigger, attackBonus },
        talentBonus,
    };
}

export type Parameters = ReturnType<typeof resolve>;
