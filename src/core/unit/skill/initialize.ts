import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { State as BattleState, Result } from "../../battle/state.js";
import type { Definition } from "./definition.js";
import type { Skill } from "./skill.js";
import * as sp from "./sp.js";

export function create<S extends object, A extends object>(
    battle: BattleState,
    definition: Definition<S, A>,
): Result<Skill<S, A>> {
    if (definition.id.length === 0) {
        throw new TypeError("skill identity must be nonempty");
    }
    if (definition.sp !== null) {
        sp.validateDefinition(definition.sp);
    }

    const policy = definition.activation?.sustain;
    if (policy?.type === "TIME") {
        assertNonnegativeSafeInteger(policy.durationTicks, "skill duration ticks");
    } else if (policy?.type === "AMMO") {
        assertNonnegativeSafeInteger(policy.amount, "skill ammunition");
    }

    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            definition,
            state: initialized.value,
            sp:
                definition.sp === null
                    ? null
                    : sp.initialize(definition.sp, initialized.state.tick),
            activation: null,
        },
    };
}
