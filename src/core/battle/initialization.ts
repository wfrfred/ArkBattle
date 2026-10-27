import { instantiateUnitPlacement } from "./creation/placement.js";
import { instantiateMechanismPlacement } from "./creation/mechanism.js";
import { advancePredefined } from "./steps/predefined.js";
import type { Input } from "./contract.js";
import type { State as BattleState } from "./state.js";
import { add } from "./unit.js";

export function initializeBattlefield(state: BattleState, input: Input): BattleState {
    for (const placement of input.initialUnits) {
        const initialized = instantiateUnitPlacement(state, placement);
        state = add(initialized.state, initialized.value);
    }

    for (const placement of input.initialMechanisms) {
        state = instantiateMechanismPlacement(state, placement).state;
    }

    return advancePredefined(
        state,
        input.predefines,
        input.predefines
            .filter((definition) => definition.initiallyPresent)
            .map((definition) => ({ type: "APPEAR_PREDEFINED", definitionId: definition.id })),
    );
}
