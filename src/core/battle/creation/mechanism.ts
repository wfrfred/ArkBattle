import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Ref } from "../../common/ref.js";
import type { CreationDefinition, Mechanism, MechanismDefinition } from "../mechanism.js";
import type { Result, State as BattleState } from "../state.js";
import { setHook } from "../unit-hook.js";

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
): Result<Ref<Mechanism>>;
export function instantiateMechanismPlacement(
    battle: BattleState,
    placement: MechanismPlacementDefinition,
): Result<Ref<Mechanism>> {
    const id = battle.execution.nextMechanismId;
    assertNonnegativeSafeInteger(id, "mechanism id");
    const nextMechanismId = id + 1;
    if (!Number.isSafeInteger(nextMechanismId)) {
        throw new RangeError("mechanism identity overflow");
    }

    const created = battle.mechanisms.create(id, placement.definition, placement.active ?? true);
    battle = {
        ...battle,
        mechanisms: created.mechanisms,
        execution: { ...battle.execution, nextMechanismId },
    };
    const self = created.mechanisms.get(created.reference)!;
    if (self.definition.onUnitLeave !== undefined) {
        const reference = created.reference;
        battle = setHook(battle, "leave", {
            id: `@mechanism/${id}/unit-leave`,
            invoke: (current, departure) => {
                const mechanism = current.mechanisms.get(reference);

                return {
                    state:
                        mechanism?.status === "ACTIVE"
                            ? mechanism.definition.onUnitLeave!(current, mechanism, departure)
                            : current,
                    value: undefined,
                };
            },
        });
    }

    return {
        state: battle,
        value: created.reference,
    };
}
