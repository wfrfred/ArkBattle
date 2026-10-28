import type { State as BattleState, Result } from "../../battle/state.js";
import type { Definition } from "./definition.js";
import type { Skill } from "./skill.js";
import * as sp from "./sp.js";

export function create<S extends object, A extends object>(
    battle: BattleState,
    definition: Definition<S, A>,
): Result<Skill<S, A>> {
    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            definition,
            data: initialized.value,
            sp:
                definition.sp === null
                    ? null
                    : sp.initialize(definition.sp, initialized.state.tick),
            activation: null,
        },
    };
}
