import { add as addMechanism, initialize as initializeMechanism } from "../mechanism/index.js";
import { appear } from "./predefined.js";
import type { Input } from "./contract.js";
import type { State as BattleState } from "./state.js";

export function initializeBattlefield<MechanismStates extends readonly object[]>(
    state: BattleState,
    input: Pick<Input<readonly object[], MechanismStates>, "initialMechanisms">,
): BattleState {
    for (const mechanism of input.initialMechanisms) {
        const initialized = initializeMechanism(state, mechanism);
        state = addMechanism(initialized.state, initialized.value);
    }

    for (const definition of state.definition.predefines) {
        if (definition.initiallyPresent) {
            state = appear(state, definition.id);
        }
    }

    return state;
}
