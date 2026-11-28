import { secondsToTicks } from "../../../core/tick.js";
import { record } from "../../../data/json.js";
import type { Tables } from "../../../data/tables.js";
import { parseGroupTags } from "../../../data/unit/tags.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    favorFrame,
    growth,
    resolveAttributes,
    selectModule,
    selectSkill,
    selectTalents,
    selectTrait,
    type Blackboard,
} from "../parameters.js";

export const operatorId = "char_311_mudrok";

const moduleX = "uniequip_002_mudrok";
const secondSkillIndex = 1;

function value(blackboard: Blackboard, key: string): number {
    const entry = blackboard.find((entry) => entry.key === key);
    if (entry === undefined) {
        throw new TypeError(`Mudrock content requires ${key}`);
    }

    return entry.value;
}

export function resolve(configuration: Configuration & SkillSelection, tables: Tables) {
    if (configuration.skillIndex !== secondSkillIndex) {
        throw new TypeError("Mudrock content requires her second skill");
    }
    if (configuration.module !== null && configuration.module.id !== moduleX) {
        throw new TypeError("Mudrock content supports only module X");
    }

    const character = record(tables.characters[operatorId], "operator character record");
    const progression = growth(character, tables.ranges, configuration);
    const { phase } = progression;
    const favor = favorFrame(tables.favor, configuration.trust);
    const stage = selectModule(operatorId, tables, configuration, favor);
    const attributes = resolveAttributes(progression, configuration, stage, favor);
    const { id, level } = selectSkill(character, tables, configuration);
    const { range, sp, trigger, cost, blackboard } = level;
    if (range === null) {
        throw new TypeError("Mudrock content requires a range for her second skill");
    }

    const talents = selectTalents(character, configuration, stage);
    const shield = talents.find((talent) => talent.key === "1")?.blackboard;
    if (shield === undefined) {
        throw new TypeError("Mudrock content requires her shield talent");
    }

    const sarkaz = talents.find((talent) => talent.key === "2")?.blackboard;
    const trait = selectTrait(configuration, stage);

    return {
        groupTags: parseGroupTags(character),
        attributes,
        normalAttack: { range: phase.range },
        s2Skill: { id, range, sp, trigger, cost },
        s2Action: {
            range,
            attackScale: value(blackboard, "atk_scale"),
            healRatio: value(blackboard, "hp_ratio"),
            stunChance: value(blackboard, "buff_prob"),
            stunTicks: secondsToTicks(value(blackboard, "stun")),
        },
        shield: {
            interval: secondsToTicks(value(shield, "interval")),
            initialLayers: value(shield, "times"),
            capacity: value(shield, "max_times"),
            healRatio: value(shield, "hp_ratio"),
            extraSp: shield.find((entry) => entry.key === "sp")?.value ?? 0,
            sarkazResistance: sarkaz === undefined ? 0 : value(sarkaz, "damage_resistance"),
            blockedDamageScale: trait.find((entry) => entry.key === "damage_scale")?.value ?? 1,
        },
    };
}

export type Parameters = ReturnType<typeof resolve>;
