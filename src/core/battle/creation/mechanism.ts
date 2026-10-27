import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { CreationDefinition, Mechanism, MechanismDefinition, View } from "../mechanism.js";
import type { Result, State as BattleState } from "../state.js";

export interface MechanismPlacementDefinition {
    readonly definition: CreationDefinition;
    readonly active?: boolean;
}

export function instantiateMechanismPlacement<S extends object>(
    battle: BattleState,
    placement: {
        readonly definition: MechanismDefinition<S>;
        readonly active?: boolean;
    },
): Result<Ref<Mechanism<S>>>;
export function instantiateMechanismPlacement(
    battle: BattleState,
    placement: MechanismPlacementDefinition,
): Result<Ref<View>>;
export function instantiateMechanismPlacement(
    battle: BattleState,
    placement: MechanismPlacementDefinition,
): Result<Ref<View>> {
    const id = battle.execution.nextMechanismId;
    assertNonnegativeSafeInteger(id, "mechanism id");
    const nextMechanismId = id + 1;
    if (!Number.isSafeInteger(nextMechanismId)) {
        throw new RangeError("mechanism identity overflow");
    }

    const created = battle.mechanisms.create(id, placement.definition, placement.active ?? true);

    return {
        state: {
            ...battle,
            mechanisms: created.mechanisms,
            execution: { ...battle.execution, nextMechanismId },
        },
        value: created.reference,
    };
}
