import { create as createMechanism } from "../mechanism/mechanism.js";
import { appear } from "./steps/predefined.js";
import type { Input } from "./contract.js";
import type { State as BattleState } from "./state.js";

export function initializeBattlefield<MechanismStates extends readonly object[]>(
    state: BattleState,
    input: Pick<Input<readonly object[], MechanismStates>, "initialMechanisms">,
): BattleState {
    for (const { definition, ...options } of input.initialMechanisms) {
        state = createMechanism(state, definition, options).state;
    }

    for (const definition of state.definition.predefines) {
        if (definition.initiallyPresent) {
            state = appear(state, definition.id);
        }
    }

    return state;
}
