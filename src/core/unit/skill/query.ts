import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { Unit } from "../unit.js";
import type { Skill as SkillCapability } from "../capability/skill/capability.js";
import type { Skill } from "./skill.js";
import type { View as ActivationView } from "./activation.js";

export function getCurrent(
    battle: BattleState,
    source: Ref<Unit & SkillCapability>,
): Skill | undefined {
    return units.get(battle, source)?.skill as Skill | undefined;
}

export function getSkill<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Skill<S, A>>,
): Skill<S, A> | undefined {
    const skill = units.get(battle, reference.host)?.skill as Skill<S, A> | undefined;

    return skill?.definition === reference.definition ? skill : undefined;
}

export function getActivation<X extends ActivationView>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    const skill = units.get(battle, reference.host)?.skill;

    return (skill?.activation?.id === reference.id ? skill : undefined) as X | undefined;
}
