import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import { createSkillRef, type Skill } from "./skill.js";
import * as sp from "./sp.js";

export function initialize<S extends object, A extends object>(
    battle: BattleState,
    source: Ref<Unit & SkillCapability>,
    definition: Definition<S, A, never>,
): Result<Skill<S, A>> {
    if (definition.id.length === 0) {
        throw new TypeError("skill identity must be nonempty");
    }
    if (definition.sp !== null) {
        sp.validateDefinition(definition.sp);
    }

    const activation = definition.activation;
    if (activation !== null) {
        assertNonnegativeSafeInteger(activation.requirement, "skill SP requirement");
        assertNonnegativeSafeInteger(activation.cost, "skill SP cost");
    }

    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            ref: createSkillRef(source),
            definition,
            state: initialized.value,
            sp: definition.sp === null ? null : sp.initialize(definition.sp),
            activation: null,
        },
    };
}
