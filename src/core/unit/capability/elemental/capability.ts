import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type { Burst } from "./burst.js";
import type { Ref } from "../../../common/ref.js";
import type { Restrictions } from "./restriction.js";
import { createRegistrationOperations } from "../../registration.js";
import { createChange, type Change } from "../../change.js";

export const Type = {
    NEURAL: "NEURAL",
    EROSION: "EROSION",
    BURN: "BURN",
    NECROSIS: "NECROSIS",
    MANIA: "MANIA",
} as const;

export type Type = (typeof Type)[keyof typeof Type];

export const ELEMENT_TYPES: readonly Type[] = Object.values(Type);

export type Values = Readonly<Record<Type, number>>;

export type Input = attribute.Input<Unit & Elemental>;

export interface Definition {
    readonly maxEp: attribute.Definition;
    readonly recoverySpeed: attribute.Definition;
    readonly elementResistance: attribute.Definition;
    readonly damageResistance: attribute.Definition;
    readonly burstRecoverySpeed: attribute.Definition;
    readonly bursts: Readonly<Record<Type, Burst["definition"]>>;
}

interface Attributes {
    readonly maxEp: attribute.State<Input>;
    readonly recoverySpeed: attribute.State<Input>;
    readonly elementResistance: attribute.State<Input>;
    readonly damageResistance: attribute.State<Input>;
    readonly burstRecoverySpeed: attribute.State<Input>;
}

export type Parameter = keyof Attributes;

export interface State extends Restrictions, Attributes {
    readonly ep: Values;
    readonly burst: Ref<Burst> | null;
}

export interface Elemental {
    readonly definition: { readonly elemental: Definition };
    readonly elemental: State;
}

export function hasElemental<U extends Unit>(unit: U): unit is U & Elemental {
    return "elemental" in unit && "elemental" in unit.definition;
}

export function elementValues(value: number): Record<Type, number> {
    return {
        NEURAL: value,
        EROSION: value,
        BURN: value,
        NECROSIS: value,
        MANIA: value,
    };
}

export function initialize<U extends Unit & Pick<Elemental, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Elemental> {
    const definition = unit.definition.elemental;

    const maxEp = attribute.initialize(definition.maxEp);

    for (const type of ELEMENT_TYPES) {
        assertNonnegativeSafeInteger(
            definition.bursts[type].durationTicks,
            "element burst duration",
        );
    }

    return {
        state: battle,
        value: {
            ...unit,
            elemental: {
                ep: elementValues(attribute.resolve(definition.maxEp, maxEp)),
                burst: null,
                maxEp,
                recoverySpeed: attribute.initialize<Input>(definition.recoverySpeed),
                elementResistance: attribute.initialize<Input>(definition.elementResistance),
                damageResistance: attribute.initialize<Input>(definition.damageResistance),
                burstRecoverySpeed: attribute.initialize<Input>(definition.burstRecoverySpeed),
                damageRestrictions: [],
                healingRestrictions: [],
            },
        },
    };
}

export function setContribution(
    parameter: Parameter,
    entry: contribution.Contribution<Input>,
): Change<Unit & Elemental> {
    return updateAttribute(parameter, (_definition, state) =>
        attribute.setContribution(state, entry),
    );
}

export function removeContribution(parameter: Parameter, id: string): Change<Unit & Elemental> {
    return updateAttribute(parameter, (_definition, state) =>
        attribute.removeContribution(state, id),
    );
}

export function setRange(parameter: Parameter, range: attribute.Range): Change<Unit & Elemental> {
    return updateAttribute(parameter, (definition, state) =>
        attribute.setRange(definition, state, range),
    );
}

export function clearRange(parameter: Parameter): Change<Unit & Elemental> {
    return updateAttribute(parameter, attribute.clearRange);
}

function updateAttribute(
    parameter: Parameter,
    update: (
        definition: attribute.Definition,
        state: attribute.State<Input>,
    ) => attribute.State<Input>,
): Change<Unit & Elemental> {
    return createChange<Unit & Elemental>((self) => {
        const next = update(self.definition.elemental[parameter], self.elemental[parameter]);

        return next === self.elemental[parameter]
            ? self
            : { ...self, elemental: { ...self.elemental, [parameter]: next } };
    });
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Elemental
>()<"elemental", keyof Restrictions>("elemental");
