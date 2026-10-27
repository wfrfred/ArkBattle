import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { LeaveReason } from "../../unit/unit.js";
import {
    get as getMechanism,
    remove as removeMechanism,
    type CreationDefinition,
    type View as MechanismView,
} from "../mechanism.js";
import type { Ref } from "../../common/ref.js";
import {
    createUnitPlacementDefinition,
    instantiateUnitPlacement,
    type UnitPlacementDefinition,
} from "../creation/placement.js";
import { instantiateMechanismPlacement } from "../creation/mechanism.js";
import type { Command } from "../contract.js";
import { add, remove } from "../unit.js";
import type { State as BattleState } from "../state.js";

export interface PredefinedUnitCreation extends UnitPlacementDefinition {
    readonly type: "UNIT";
}

export interface PredefinedMechanismCreation {
    readonly type: "MECHANISM";
    readonly definition: CreationDefinition;
}

export type Source =
    | { readonly type: "UNIT"; readonly unitId: number }
    | { readonly type: "MECHANISM"; readonly ref: Ref<MechanismView> };

export interface PredefinedDefinition {
    readonly id: number;
    readonly alias: string | null;
    readonly initiallyPresent: boolean;
    readonly creation: PredefinedUnitCreation | PredefinedMechanismCreation;
}

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

export function createPredefinedDefinition(definition: PredefinedDefinition): PredefinedDefinition {
    assertNonnegativeSafeInteger(definition.id, "predefined definition id");

    const creation = definition.creation;

    return Object.freeze({
        id: definition.id,
        alias: definition.alias,
        initiallyPresent: definition.initiallyPresent,
        creation:
            creation.type === "UNIT"
                ? Object.freeze({
                      type: creation.type,
                      ...createUnitPlacementDefinition(creation),
                  })
                : Object.freeze({ ...creation }),
    });
}

export function predefinedIdsForAlias(
    definitions: readonly PredefinedDefinition[],
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
    definitions: readonly PredefinedDefinition[],
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
            const initialized = instantiateUnitPlacement(state, creation);
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
