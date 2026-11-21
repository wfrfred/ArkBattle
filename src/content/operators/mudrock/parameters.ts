import type { AttackSpeedTiming } from "../../actions/timing.js";
import type { Configuration, SkillSelection } from "../configuration.js";
import {
    resolveAttributes,
    selectCandidate,
    selectModule,
    selectPhase,
    selectSkill,
    type Candidate,
    type Module,
    type ModuleStage,
    type Parameters,
    type Skill,
} from "../parameters.js";
import type { SkillActionParameters } from "./action.js";
import type { ShieldParameters } from "./effect.js";
import type { SkillParameters } from "./skill.js";
import source from "./parameters.json" with { type: "json" };

type ShieldValues = Pick<
    ShieldParameters,
    "interval" | "initialLayers" | "capacity" | "healRatio" | "extraSp"
>;

interface Table extends Pick<
    Parameters,
    "id" | "groupTags" | "phases" | "favorKeyFrames" | "potential"
> {
    readonly timing: AttackSpeedTiming;
    readonly s2: Pick<Skill, "index" | "id" | "unlock" | "upgrades"> & {
        readonly levels: readonly (Omit<SkillParameters, "id"> & SkillActionParameters)[];
    };
    readonly shield: readonly Candidate<ShieldValues>[];
    readonly sarkazResistance: readonly Candidate<number>[];
    readonly moduleX: Pick<Module, "id" | "unlock"> & {
        readonly stages: readonly (Pick<ModuleStage, "level" | "minFavor" | "attributes"> & {
            readonly shield: readonly Candidate<ShieldValues>[];
            readonly blockedDamageScale: readonly Candidate<number>[];
        })[];
    };
}

export const table = source as unknown as Table;

export function resolve(configuration: Configuration & SkillSelection, table: Table) {
    if (configuration.skillIndex !== table.s2.index) {
        throw new TypeError("Mudrock content requires her second skill");
    }
    if (configuration.module !== undefined && configuration.module.id !== table.moduleX.id) {
        throw new TypeError("Mudrock content supports only module X");
    }

    const phase = selectPhase(table.phases, configuration);
    const stage = selectModule([table.moduleX], configuration);
    const attributes = resolveAttributes(table, phase, configuration, stage);
    const { id, level } = selectSkill([table.s2], configuration);
    const { range, sp, trigger, cost, attackScale, healRatio, stunChance, stunTicks } = level;

    const shield =
        selectCandidate(stage?.shield ?? [], configuration) ??
        selectCandidate(table.shield, configuration);
    if (shield === undefined) {
        throw new TypeError("Mudrock content requires her shield talent");
    }

    return {
        id: table.id,
        groupTags: table.groupTags,
        attributes,
        normalAttack: { range: phase.range, timing: table.timing },
        s2Skill: { id, range, sp, trigger, cost },
        s2Action: { range, attackScale, healRatio, stunChance, stunTicks },
        shield: {
            ...shield,
            sarkazResistance: selectCandidate(table.sarkazResistance, configuration) ?? 0,
            blockedDamageScale:
                selectCandidate(stage?.blockedDamageScale ?? [], configuration) ?? 1,
        },
    };
}
