import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { Burst, Definition as BurstDefinition } from "./burst.js";
import type { Ref } from "../../../common/ref.js";
import type { DamageReceivingHook, Events, Hook } from "./hook.js";
import type { Rules } from "./rule.js";
import { createRegistrationOperations } from "../../registration.js";

export const ELEMENT_TYPES = ["NEURAL", "EROSION", "BURN", "NECROSIS"] as const;

export type Type = (typeof ELEMENT_TYPES)[number];

export type Values = Readonly<Record<Type, number>>;

export type Input = contribution.Input<attribute.Modifier, Unit & Elemental>;

export interface Definition {
    readonly maxEp: number;
    readonly recoveryPerSecond: number;
    readonly elementResistance: number;
    readonly damageResistance: number;
    readonly burstRecoverySpeed: number;
    readonly bursts: Readonly<Record<Type, BurstDefinition>>;
}

interface Contributions {
    readonly maxEp: readonly contribution.Contribution<Input>[];
    readonly recoverySpeed: readonly contribution.Contribution<Input>[];
    readonly elementResistance: readonly contribution.Contribution<Input>[];
    readonly damageResistance: readonly contribution.Contribution<Input>[];
    readonly burstRecoverySpeed: readonly contribution.Contribution<Input>[];
}

export type Parameter = keyof Contributions;

interface Hooks {
    readonly damageReceiving: readonly DamageReceivingHook[];
    readonly damaged: readonly Hook<Events["damaged"]>[];
    readonly healed: readonly Hook<Events["healed"]>[];
    readonly burstStarted: readonly Hook<Events["burstStarted"]>[];
    readonly burstEnded: readonly Hook<Events["burstEnded"]>[];
}

export interface State extends Rules, Contributions, Hooks {
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

export function hasElementalDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Elemental["definition"] {
    return "elemental" in definition;
}

export function elementValues(value: number): Values {
    return { NEURAL: value, EROSION: value, BURN: value, NECROSIS: value };
}

export function initialize<U extends Unit & Pick<Elemental, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Elemental> {
    const definition = unit.definition.elemental;

    assertPositiveNumber(definition.maxEp, "maximum EP");
    assertNonnegativeNumber(definition.recoveryPerSecond, "EP recovery per second");
    assertFiniteNumber(definition.elementResistance, "element resistance");
    assertFiniteNumber(definition.damageResistance, "element HP damage resistance");
    assertNonnegativeNumber(definition.burstRecoverySpeed, "element burst recovery speed");

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
                ep: elementValues(definition.maxEp),
                burst: null,
                maxEp: [],
                recoverySpeed: [],
                elementResistance: [],
                damageResistance: [],
                burstRecoverySpeed: [],
                damageReceiving: [],
                damageRules: [],
                healingRules: [],
                damaged: [],
                healed: [],
                burstStarted: [],
                burstEnded: [],
            },
        },
    };
}

export const { set: setContribution, remove: removeContribution } = createRegistrationOperations<
    Unit & Elemental,
    "elemental",
    keyof Contributions
>("elemental");

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Elemental,
    "elemental",
    keyof Rules
>("elemental");

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Elemental,
    "elemental",
    keyof Hooks
>("elemental");
