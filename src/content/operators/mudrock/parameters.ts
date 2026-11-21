import { secondsToTicks } from "../../../core/tick.js";
import type { AttackSpeedTiming } from "../../actions/timing.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    resolveAttributes,
    selectModule,
    selectPhase,
    selectSkill,
    selectTalents,
    selectTrait,
    type Blackboard,
    type Tables,
} from "../parameters.js";

const moduleX = "uniequip_002_mudrok";
const secondSkillIndex = 1;

const timing = {
    type: "ATTACK_SPEED",
    beginTicks: 0,
    durationTicks: 48,
    releaseTicks: 19,
    minScale: 0.1,
    maxScale: 1,
} satisfies AttackSpeedTiming;

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
    if (configuration.module !== undefined && configuration.module.id !== moduleX) {
        throw new TypeError("Mudrock content supports only module X");
    }

    const table = tables.operator("char_311_mudrok", {
        skillIndices: [secondSkillIndex],
        moduleIds: configuration.module === undefined ? [] : [moduleX],
    });
    const phase = selectPhase(table.phases, configuration);
    const stage = selectModule(table.modules, configuration, tables.favor);
    const attributes = resolveAttributes(table, phase, configuration, stage, tables.favor);
    const { id, level } = selectSkill(table.skills, configuration);
    const { range, sp, trigger, cost, blackboard } = level;
    if (range === null) {
        throw new TypeError("Mudrock content requires a range for her second skill");
    }

    const talents = selectTalents(table.talents, configuration, stage);
    const shield = talents.find((talent) => talent.key === "1")?.blackboard;
    if (shield === undefined) {
        throw new TypeError("Mudrock content requires her shield talent");
    }

    const sarkaz = talents.find((talent) => talent.key === "2")?.blackboard;
    const trait = selectTrait(configuration, stage);

    return {
        id: table.id,
        groupTags: table.groupTags,
        attributes,
        normalAttack: { range: phase.range, timing },
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
