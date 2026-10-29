import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { Skill } from "./skill.js";
import type { Activation } from "./activation.js";

export function getSkill<X extends Skill<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    const skill = units.get(battle, reference.host)?.skill;

    return (skill?.definition === reference.definition ? skill : undefined) as X | undefined;
}

export function getActivation<X extends Activation<any, any>>(
    battle: BattleState,
    reference: Ref<X>,
): X | undefined {
    const skill = units.get(battle, reference.host)?.skill;

    return (skill?.activation?.id === reference.id ? skill : undefined) as X | undefined;
}
