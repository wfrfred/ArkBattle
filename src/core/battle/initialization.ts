import { instantiateMechanismPlacement } from "./creation/mechanism.js";
import { advancePredefined } from "./steps/predefined.js";
import type { Definition, Input } from "./contract.js";
import type { State as BattleState } from "./state.js";

export function initializeBattlefield<MechanismStates extends readonly object[]>(
    state: BattleState,
    input: Pick<Input<readonly object[], MechanismStates>, "initialMechanisms"> &
        Pick<Definition, "predefines">,
): BattleState {
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
