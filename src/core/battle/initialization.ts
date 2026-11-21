import { add as addMechanism, initialize as initializeMechanism } from "../mechanism/index.js";
import { initialize as initializeUnit } from "../unit/initialize.js";
import { add as addUnit } from "../unit/operations.js";
import type { Input } from "./contract.js";
import type { State as BattleState } from "./state.js";

export function initializeBattlefield<MechanismStates extends readonly object[]>(
    state: BattleState,
    input: Pick<Input<readonly object[], MechanismStates>, "initialMechanisms" | "initialUnits">,
): BattleState {
    for (const mechanism of input.initialMechanisms) {
        const initialized = initializeMechanism(state, mechanism);
        state = addMechanism(initialized.state, initialized.value);
    }

    for (const unit of input.initialUnits) {
        const initialized = initializeUnit(state, unit);
        state = addUnit(initialized.state, initialized.value);
    }

    return state;
}
