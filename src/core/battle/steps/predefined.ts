import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Definition as UnitDefinition, LeaveReason } from "../../unit/unit.js";
import { initialize as initializeUnit } from "../../unit/initialize.js";
import type { WorldPosition } from "../../geometry/coordinate.js";
import type { Hooks } from "../../hook.js";
import {
    get as getMechanism,
    remove as removeMechanism,
    type MechanismDefinition,
    type Mechanism,
} from "../mechanism.js";
import type { Ref } from "../../common/ref.js";
import { instantiateMechanismPlacement } from "../creation/mechanism.js";
import type { Command } from "../contract.js";
import { add, remove } from "../unit.js";
import type { State as BattleState } from "../state.js";
import type { Definitions, Initial } from "../../unit/capability/catalog.js";

export interface PredefinedUnitCreation<D extends object = UnitDefinition & Partial<Definitions>> {
    readonly type: "UNIT";
    readonly definition: D & UnitDefinition & Partial<Definitions>;
    readonly position: WorldPosition;
    readonly initial?: Initial<NoInfer<D>>;
    readonly hooks?: Hooks;
}

export interface PredefinedMechanismCreation<S extends object = object> {
    readonly type: "MECHANISM";
    readonly definition: MechanismDefinition<S>;
}

export type Source =
    | { readonly type: "UNIT"; readonly unitId: number }
    | { readonly type: "MECHANISM"; readonly ref: Ref<Mechanism> };

export interface PredefinedDefinition<T extends object = object> {
    readonly id: number;
    readonly alias: string | null;
    readonly initiallyPresent: boolean;
    readonly creation: PredefinedUnitCreation<T> | PredefinedMechanismCreation<T>;
}

export type StoredPredefinedDefinition = PredefinedDefinition<any>;

export interface PredefinedPresence {
    readonly definitionId: number;
    readonly source: Source;
}

export type PredefinedCommand =
    | { readonly type: "APPEAR_PREDEFINED"; readonly definitionId: number }
    | {
          readonly type: "REMOVE_PREDEFINED";
          readonly definitionId: number;
          readonly reason: LeaveReason;
      };

export function createPredefinedDefinition<T extends object>(
    definition: PredefinedDefinition<T>,
): PredefinedDefinition<T> {
    assertNonnegativeSafeInteger(definition.id, "predefined definition id");

    return definition;
}

export function predefinedIdsForAlias(
    definitions: readonly StoredPredefinedDefinition[],
    alias: string,
): readonly number[] {
    return definitions
        .filter((definition) => definition.alias === alias)
        .map((definition) => definition.id);
}

export function reconcilePredefinedPresence(battle: BattleState): readonly PredefinedPresence[] {
    const presence = battle.predefinedPresence;
    const remaining = presence.filter(({ source }) =>
        source.type === "UNIT"
            ? battle.battlefield.units.has(source.unitId)
            : getMechanism(battle, source.ref) !== undefined,
    );

    return remaining.length === presence.length ? presence : remaining;
}

export function advancePredefined(
    state: BattleState,
    definitions: readonly StoredPredefinedDefinition[],
    commands: readonly Command[],
): BattleState {
    for (const command of commands) {
        if (command.type !== "APPEAR_PREDEFINED" && command.type !== "REMOVE_PREDEFINED") {
            continue;
        }

        const presence = reconcilePredefinedPresence(state);
        if (presence !== state.predefinedPresence) {
            state = { ...state, predefinedPresence: presence };
        }

        const definition = definitions.find((definition) => definition.id === command.definitionId);
        if (definition === undefined) {
            throw new RangeError(`unknown predefined definition: ${command.definitionId}`);
        }

        const binding = state.predefinedPresence.find(
            (binding) => binding.definitionId === command.definitionId,
        );

        if (command.type === "REMOVE_PREDEFINED") {
            if (binding === undefined) {
                continue;
            }

            state = {
                ...state,
                predefinedPresence: state.predefinedPresence.filter(
                    (binding) => binding.definitionId !== command.definitionId,
                ),
            };
            state =
                binding.source.type === "UNIT"
                    ? remove(state, binding.source.unitId, command.reason)
                    : removeMechanism(state, binding.source.ref);
            continue;
        }
        if (binding !== undefined) {
            continue;
        }

        const creation = definition.creation;
        if (creation.type === "UNIT") {
            const id = state.execution.nextUnitId;
            state = { ...state, execution: { ...state.execution, nextUnitId: id + 1 } };
            const initialized = initializeUnit(state, { ...creation, id });
            state = initialized.state;
            const unit = initialized.value;
            state = {
                ...state,
                predefinedPresence: [
                    ...state.predefinedPresence,
                    { definitionId: definition.id, source: { type: "UNIT", unitId: unit.id } },
                ],
            };
            state = add(state, unit);
        } else {
            const initialized = instantiateMechanismPlacement(state, creation);
            state = {
                ...initialized.state,
                predefinedPresence: [
                    ...initialized.state.predefinedPresence,
                    {
                        definitionId: definition.id,
                        source: { type: "MECHANISM", ref: initialized.value },
                    },
                ],
            };
        }
    }

    return {
        ...state,
        predefinedPresence: reconcilePredefinedPresence(state),
    };
}
