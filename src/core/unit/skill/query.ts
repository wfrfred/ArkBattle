import type { Ref } from "../../common/ref.js";
import { type State as BattleState } from "../../battle/state.js";
import * as units from "../query.js";
import type { Skill } from "../capability/skill/capability.js";
import type { Definition } from "./definition.js";
import type { Activation } from "./activation.js";

export function get<T extends Activation>(battle: BattleState, reference: Ref<T>): T | undefined;
export function get<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Activation>,
    definition: Definition<S, A>,
): Activation<A> | undefined;
export function get<T extends Activation>(
    battle: BattleState,
    reference: Ref<T>,
    definition?: Skill["definition"]["skill"],
): Activation | undefined {
    const self = units.get(battle, reference.host);

    return self?.skill.active?.id === reference.id &&
        (definition === undefined || self.definition.skill === definition)
        ? self.skill.active
        : undefined;
}
