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
    type Parameters,
    type SkillLevel,
} from "../parameters.js";
import source from "./parameters.json" with { type: "json" };

const parameters = source as unknown as Parameters & { readonly timing: AttackSpeedTiming };

function value(entries: SkillLevel["blackboard"], key: string): number {
    const entry = entries.find((entry) => entry.key === key);
    if (entry === undefined) {
        throw new TypeError(`Mudrock content requires ${key}`);
    }

    return entry.value;
}

export function resolve(configuration: Configuration & SkillSelection) {
    if (configuration.skillIndex !== 1) {
        throw new TypeError("Mudrock content requires her second skill");
    }
    if (configuration.module !== undefined && configuration.module.id !== "uniequip_002_mudrok") {
        throw new TypeError("Mudrock content supports only module X");
    }

    const phase = selectPhase(parameters.phases, configuration);
    const stage = selectModule(parameters.modules, configuration);
    const attributes = resolveAttributes(parameters, phase, configuration, stage);
    const { id, level } = selectSkill(parameters.skills, configuration);
    const { range, sp, trigger, cost, blackboard } = level;
    if (range === null) {
        throw new TypeError("Mudrock content requires a range for her second skill");
    }

    const talents = selectTalents(parameters.talents, configuration, stage);
    const trait = selectTrait(configuration, stage);
    const shield = talents.find((talent) => talent.key === "1")?.blackboard;
    if (shield === undefined) {
        throw new TypeError("Mudrock content requires her shield talent");
    }

    const sarkaz = talents.find((talent) => talent.key === "2")?.blackboard;

    return {
        id: parameters.id,
        groupTags: parameters.groupTags,
        attributes,
        range: phase.range,
        timing: parameters.timing,
        skill: { id, range, sp, trigger, cost },
        skillAction: {
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
            sarkazResistance:
                sarkaz?.find((entry) => entry.key === "damage_resistance")?.value ?? 0,
            blockedDamageScale: trait.find((entry) => entry.key === "damage_scale")?.value ?? 1,
        },
    };
}
