import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveNumber,
} from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { Burst, Definition as BurstDefinition } from "./burst.js";
import type { DamageHook, Events, Hook, Key } from "./hook.js";
import type { Rule } from "./rule.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

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

export type Parameter =
    "maxEp" | "recoverySpeed" | "elementResistance" | "damageResistance" | "burstRecoverySpeed";

export interface State {
    readonly ep: Values;
    readonly burst: Burst | null;
    readonly nextBurstId: number;
    readonly lastAdvancedTick: number;
    readonly maxEp: readonly contribution.Contribution<Input>[];
    readonly recoverySpeed: readonly contribution.Contribution<Input>[];
    readonly elementResistance: readonly contribution.Contribution<Input>[];
    readonly damageResistance: readonly contribution.Contribution<Input>[];
    readonly burstRecoverySpeed: readonly contribution.Contribution<Input>[];
    readonly receiving: readonly DamageHook[];
    readonly rules: readonly Rule[];
    readonly received: readonly Hook<Events["received"]>[];
    readonly damaged: readonly Hook<Events["damaged"]>[];
    readonly healed: readonly Hook<Events["healed"]>[];
    readonly burstStarted: readonly Hook<Events["burstStarted"]>[];
    readonly burstEnded: readonly Hook<Events["burstEnded"]>[];
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

export function createDefinition(
    definition: Pick<Definition, "maxEp" | "bursts"> &
        Partial<Omit<Definition, "maxEp" | "bursts">>,
): Definition {
    const {
        maxEp,
        bursts,
        recoveryPerSecond = 0,
        elementResistance = 0,
        damageResistance = 0,
        burstRecoverySpeed = 1,
    } = definition;

    assertPositiveNumber(maxEp, "maximum EP");
    assertNonnegativeNumber(recoveryPerSecond, "EP recovery per second");
    assertFiniteNumber(elementResistance, "element resistance");
    assertFiniteNumber(damageResistance, "element HP damage resistance");
    assertNonnegativeNumber(burstRecoverySpeed, "element burst recovery speed");

    for (const type of ELEMENT_TYPES) {
        assertNonnegativeSafeInteger(bursts[type].durationTicks, "element burst duration");
    }

    return {
        maxEp,
        recoveryPerSecond,
        elementResistance,
        damageResistance,
        burstRecoverySpeed,
        bursts: { ...bursts },
    };
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    return {
        state: battle,
        value: {
            ep: elementValues(definition.maxEp),
            burst: null,
            nextBurstId: 0,
            lastAdvancedTick: battle.tick,
            maxEp: [],
            recoverySpeed: [],
            elementResistance: [],
            damageResistance: [],
            burstRecoverySpeed: [],
            receiving: [],
            rules: [],
            received: [],
            damaged: [],
            healed: [],
            burstStarted: [],
            burstEnded: [],
        },
    };
}

export function setContribution(
    reference: Ref<Unit & Elemental>,
    key: Parameter,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(reference, (self) => {
        const entries = contribution.set(self.elemental[key], entry);

        return entries === self.elemental[key]
            ? self
            : { ...self, elemental: { ...self.elemental, [key]: entries } };
    });
}

export function removeContribution(
    reference: Ref<Unit & Elemental>,
    key: Parameter,
    id: string,
): Change {
    return createChange(reference, (self) => {
        const entries = contribution.remove(self.elemental[key], id);

        return entries === self.elemental[key]
            ? self
            : { ...self, elemental: { ...self.elemental, [key]: entries } };
    });
}

export function setDamageHook(reference: Ref<Unit & Elemental>, hook: DamageHook): Change {
    return createChange(reference, (self) => {
        const receiving = registry.set(self.elemental.receiving, hook);

        return receiving === self.elemental.receiving
            ? self
            : { ...self, elemental: { ...self.elemental, receiving } };
    });
}

export function removeDamageHook(reference: Ref<Unit & Elemental>, id: string): Change {
    return createChange(reference, (self) => {
        const receiving = registry.remove(self.elemental.receiving, id);

        return receiving === self.elemental.receiving
            ? self
            : { ...self, elemental: { ...self.elemental, receiving } };
    });
}

export function setRule(reference: Ref<Unit & Elemental>, rule: Rule): Change {
    return createChange(reference, (self) => {
        const rules = registry.set(self.elemental.rules, rule);

        return rules === self.elemental.rules
            ? self
            : { ...self, elemental: { ...self.elemental, rules } };
    });
}

export function removeRule(reference: Ref<Unit & Elemental>, id: string): Change {
    return createChange(reference, (self) => {
        const rules = registry.remove(self.elemental.rules, id);

        return rules === self.elemental.rules
            ? self
            : { ...self, elemental: { ...self.elemental, rules } };
    });
}

export function setHook<K extends Key>(
    reference: Ref<Unit & Elemental>,
    key: K,
    hook: Hook<Events[K]>,
): Change {
    return createChange(reference, (self) => {
        const hooks = registry.set(self.elemental[key] as readonly Hook<Events[K]>[], hook);

        return hooks === self.elemental[key]
            ? self
            : { ...self, elemental: { ...self.elemental, [key]: hooks } };
    });
}

export function removeHook(reference: Ref<Unit & Elemental>, key: Key, id: string): Change {
    return createChange(reference, (self) => {
        const hooks = registry.remove<State[Key][number]>(self.elemental[key], id);

        return hooks === self.elemental[key]
            ? self
            : { ...self, elemental: { ...self.elemental, [key]: hooks } };
    });
}
