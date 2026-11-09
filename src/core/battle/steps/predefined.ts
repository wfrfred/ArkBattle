import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Definition as UnitDefinition, LeaveReason, Unit } from "../../unit/unit.js";
import { initialize as initializeUnit, type Input as UnitInput } from "../../unit/initialize.js";
import { get as getUnit, ref as unitRef } from "../../unit/query.js";
import {
    get as getMechanism,
    remove as removeMechanism,
    type MechanismDefinition,
    type Mechanism,
} from "../mechanism.js";
import type { Ref } from "../../common/ref.js";
import { instantiateMechanismPlacement } from "../creation/mechanism.js";
import { add, remove as removeUnit } from "../unit.js";
import type { State as BattleState } from "../state.js";
import type { Definitions, Inputs } from "../../unit/capability/catalog.js";

export type PredefinedUnitCreation<D extends object = UnitDefinition & Partial<Definitions>> = {
    readonly type: "UNIT";
    readonly definition: D & UnitDefinition & Partial<Definitions>;
} & Omit<UnitInput<D & UnitDefinition & Partial<Definitions>>, "id">;

export interface PredefinedMechanismCreation<S extends object = object> {
    readonly type: "MECHANISM";
    readonly definition: MechanismDefinition<S>;
}

export type Source =
    | { readonly type: "UNIT"; readonly ref: Ref<Unit> }
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

type UnitCreationInput = Omit<UnitInput, "id" | "definition" | "initial"> & {
    readonly type: "UNIT";
    readonly definition: UnitDefinition & Partial<Definitions>;
    readonly initial?: Partial<Inputs>;
};

type InvalidUnitCreation<C extends UnitCreationInput> = C extends unknown
    ? C extends Omit<UnitInput<C["definition"]>, "id">
        ? Exclude<keyof NonNullable<C["initial"]>, keyof Inputs> extends never
            ? never
            : C
        : C
    : never;

type PredefinedHeader = Omit<PredefinedDefinition, "creation">;

export function createPredefinedDefinition<
    I extends PredefinedHeader & { readonly creation: UnitCreationInput },
>(
    definition: I & NoInfer<[InvalidUnitCreation<I["creation"]>] extends [never] ? unknown : never>,
): I;
export function createPredefinedDefinition<S extends object>(
    definition: PredefinedHeader & { readonly creation: PredefinedMechanismCreation<S> },
): PredefinedHeader & { readonly creation: PredefinedMechanismCreation<S> };
export function createPredefinedDefinition(
    definition: StoredPredefinedDefinition,
): StoredPredefinedDefinition {
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
            ? getUnit(battle, source.ref) !== undefined
            : getMechanism(battle, source.ref) !== undefined,
    );

    return remaining.length === presence.length ? presence : remaining;
}

export function appear(battle: BattleState, id: PredefinedDefinition["id"]): BattleState {
    const definition = battle.definition.predefines.find((definition) => definition.id === id);
    if (definition === undefined) {
        throw new RangeError(`unknown predefined definition: ${id}`);
    }

    battle = reconcile(battle);

    if (battle.predefinedPresence.some((binding) => binding.definitionId === id)) {
        return battle;
    }

    const creation = definition.creation;
    if (creation.type === "UNIT") {
        const unitId = battle.execution.nextUnitId;
        battle = { ...battle, execution: { ...battle.execution, nextUnitId: unitId + 1 } };
        const initialized = initializeUnit(battle, { ...creation, id: unitId });
        battle = initialized.state;
        const unit = initialized.value;
        battle = {
            ...battle,
            predefinedPresence: [
                ...battle.predefinedPresence,
                { definitionId: id, source: { type: "UNIT", ref: unitRef(unit) } },
            ],
        };
        battle = add(battle, unit);
    } else {
        const initialized = instantiateMechanismPlacement(battle, creation);
        battle = {
            ...initialized.state,
            predefinedPresence: [
                ...initialized.state.predefinedPresence,
                { definitionId: id, source: { type: "MECHANISM", ref: initialized.value } },
            ],
        };
    }

    return reconcile(battle);
}

export function remove(
    battle: BattleState,
    id: PredefinedDefinition["id"],
    reason: LeaveReason,
): BattleState {
    if (!battle.definition.predefines.some((definition) => definition.id === id)) {
        throw new RangeError(`unknown predefined definition: ${id}`);
    }

    battle = reconcile(battle);
    const binding = battle.predefinedPresence.find((binding) => binding.definitionId === id);
    if (binding === undefined) {
        return battle;
    }

    battle = {
        ...battle,
        predefinedPresence: battle.predefinedPresence.filter(
            (binding) => binding.definitionId !== id,
        ),
    };
    battle =
        binding.source.type === "UNIT"
            ? removeUnit(battle, binding.source.ref, reason)
            : removeMechanism(battle, binding.source.ref);

    return reconcile(battle);
}

function reconcile(battle: BattleState): BattleState {
    const presence = reconcilePredefinedPresence(battle);

    return presence === battle.predefinedPresence
        ? battle
        : { ...battle, predefinedPresence: presence };
}
