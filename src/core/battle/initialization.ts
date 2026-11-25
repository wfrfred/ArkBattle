import { install, type Definition as EffectDefinition } from "../effect/index.js";
import { initialize as initializeUnit } from "../unit/initialize.js";
import { add as addUnit } from "../unit/operations.js";
import type { Input } from "./contract.js";
import type { State as BattleState } from "./state.js";

export function initializeBattlefield<EffectStates extends readonly object[]>(
    state: BattleState,
    input: Pick<Input<readonly object[], EffectStates>, "initialEffects" | "initialUnits">,
): BattleState {
    for (const effect of input.initialEffects) {
        state = install(
            state,
            null,
            effect.definition as EffectDefinition<object, null>,
            effect.initial,
        ).state;
    }

    for (const unit of input.initialUnits) {
        const initialized = initializeUnit(state, unit);
        state = addUnit(initialized.state, initialized.value);
    }

    return state;
}
