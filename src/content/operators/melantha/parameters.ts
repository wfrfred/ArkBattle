import type { Configuration, SkillSelection } from "../configuration.js";
import {
    resolveAttributes,
    selectCandidate,
    selectPhase,
    selectSkill,
    type Candidate,
    type Parameters,
    type Skill,
} from "../parameters.js";
import type { AttackParameters } from "./action.js";
import type { SkillParameters } from "./skill.js";
import source from "./parameters.json" with { type: "json" };

interface Table extends Pick<
    Parameters,
    "id" | "groupTags" | "phases" | "favorKeyFrames" | "potential"
> {
    readonly timing: AttackParameters["timing"];
    readonly s1: Pick<Skill, "index" | "id" | "unlock" | "upgrades"> & {
        readonly levels: readonly Omit<SkillParameters, "id">[];
    };
    readonly talent: readonly Candidate<number>[];
}

export const table = source as unknown as Table;

export function resolve(configuration: Configuration & SkillSelection, table: Table) {
    if (configuration.skillIndex !== table.s1.index) {
        throw new TypeError("Melantha content requires her first skill");
    }

    const phase = selectPhase(table.phases, configuration);
    if (configuration.module !== undefined) {
        throw new RangeError("selected module is unavailable for this operator");
    }

    const attributes = resolveAttributes(table, phase, configuration, undefined);
    const { id, level } = selectSkill([table.s1], configuration);

    return {
        id: table.id,
        groupTags: table.groupTags,
        attributes,
        attack: { range: phase.range, timing: table.timing },
        s1: { id, ...level },
        talentBonus: selectCandidate(table.talent, configuration),
    };
}
