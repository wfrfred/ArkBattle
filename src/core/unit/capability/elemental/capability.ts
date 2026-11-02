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
import type { Rule, Key as RuleKey, Rules } from "./rule.js";
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
    readonly rules: Rules;
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
                nextBurstId: 0,
                lastAdvancedTick: battle.tick,
                maxEp: [],
                recoverySpeed: [],
                elementResistance: [],
                damageResistance: [],
                burstRecoverySpeed: [],
                receiving: [],
                rules: { damage: [], heal: [] },
                received: [],
                damaged: [],
                healed: [],
                burstStarted: [],
                burstEnded: [],
            },
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

export function setRule<K extends RuleKey>(
    reference: Ref<Unit & Elemental>,
    key: K,
    rule: Rule<NoInfer<K>>,
): Change {
    return createChange(reference, (self) => {
        const entries = registry.set(self.elemental.rules[key], rule);

        return entries === self.elemental.rules[key]
            ? self
            : {
                  ...self,
                  elemental: {
                      ...self.elemental,
                      rules: { ...self.elemental.rules, [key]: entries },
                  },
              };
    });
}

export function removeRule(reference: Ref<Unit & Elemental>, key: RuleKey, id: string): Change {
    return createChange(reference, (self) => {
        const entries = registry.remove<Rules[RuleKey][number]>(self.elemental.rules[key], id);

        return entries === self.elemental.rules[key]
            ? self
            : {
                  ...self,
                  elemental: {
                      ...self.elemental,
                      rules: { ...self.elemental.rules, [key]: entries },
                  },
              };
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
