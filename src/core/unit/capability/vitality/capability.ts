import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type {
    Hook as DamageHook,
    ReceptionRule as DamageReceptionRule,
} from "../../../battle/damage/hook.js";
import type { Hook as HealingHook } from "../../../battle/healing/hook.js";
import * as registry from "../../../hook.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly maxHp: number;
    readonly defense: number;
    readonly resistance: number;
}

export interface DefenseValues {
    readonly defense: number;
    readonly resistance: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Vitality>;

export interface State {
    readonly hp: number;
    readonly maxHp: readonly contribution.Contribution<readonly attribute.Modifier[]>[];
    readonly defense: readonly contribution.Contribution<Input>[];
    readonly resistance: readonly contribution.Contribution<Input>[];
    readonly damageHooks: readonly DamageHook[];
    readonly healingHooks: readonly HealingHook[];
    readonly damageReceptionRules: readonly DamageReceptionRule[];
}

export interface Vitality {
    readonly definition: {
        readonly vitality: Definition;
    };
    readonly vitality: State;
}

export function hasVitality<U extends Unit>(unit: U): unit is U & Vitality {
    return "vitality" in unit && "vitality" in unit.definition;
}

export function hasVitalityDefinition(
    definition: UnitDefinition,
): definition is UnitDefinition & Vitality["definition"] {
    return "vitality" in definition;
}

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    assertNonnegativeNumber(definition.maxHp, "maxHp");
    assertNonnegativeNumber(definition.defense, "defense");
    assertNonnegativeNumber(definition.resistance, "resistance");

    return {
        state: battle,
        value: {
            hp: Math.max(1, definition.maxHp),
            maxHp: [],
            defense: [],
            resistance: [],
            damageHooks: [],
            healingHooks: [],
            damageReceptionRules: [],
        },
    };
}

export function setDamageReceptionRule(
    reference: Ref<Unit & Vitality>,
    rule: DamageReceptionRule,
): Change {
    return createChange(reference, (self) => {
        const damageReceptionRules = registry.set(self.vitality.damageReceptionRules, rule);

        return damageReceptionRules === self.vitality.damageReceptionRules
            ? self
            : { ...self, vitality: { ...self.vitality, damageReceptionRules } };
    });
}

export function removeDamageReceptionRule(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const damageReceptionRules = registry.remove(self.vitality.damageReceptionRules, id);

        return damageReceptionRules === self.vitality.damageReceptionRules
            ? self
            : { ...self, vitality: { ...self.vitality, damageReceptionRules } };
    });
}

function setMaxHpContributions(state: State, definition: Definition, maxHp: State["maxHp"]): State {
    if (maxHp === state.maxHp) {
        return state;
    }

    const next = { ...state, maxHp };
    const previousMax = resolveMaxHp(state, definition);
    const nextMax = resolveMaxHp(next, definition);
    if (previousMax === nextMax || state.hp <= 0) {
        return next;
    }

    return { ...next, hp: Math.min(nextMax, (state.hp / previousMax) * nextMax) };
}

export function setMaxHpContribution(
    reference: Ref<Unit & Vitality>,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): Change {
    return createChange(reference, (self) => {
        const vitality = setMaxHpContributions(
            self.vitality,
            self.definition.vitality,
            contribution.set(self.vitality.maxHp, entry),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}

export function removeMaxHpContribution(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const vitality = setMaxHpContributions(
            self.vitality,
            self.definition.vitality,
            contribution.remove(self.vitality.maxHp, id),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}

export function resolveMaxHp(state: State, definition: Definition): number {
    return Math.max(1, attribute.apply(definition.maxHp, contribution.resolve(state.maxHp).flat()));
}

function setContributions(
    state: State,
    parameter: "defense" | "resistance",
    entries: State["defense"],
): State {
    return entries === state[parameter] ? state : { ...state, [parameter]: entries };
}

export function setDefenseContribution(
    reference: Ref<Unit & Vitality>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(reference, (self) => {
        const vitality = setContributions(
            self.vitality,
            "defense",
            contribution.set(self.vitality.defense, entry),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}

export function removeDefenseContribution(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const vitality = setContributions(
            self.vitality,
            "defense",
            contribution.remove(self.vitality.defense, id),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}

export function setResistanceContribution(
    reference: Ref<Unit & Vitality>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(reference, (self) => {
        const vitality = setContributions(
            self.vitality,
            "resistance",
            contribution.set(self.vitality.resistance, entry),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}

export function removeResistanceContribution(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const vitality = setContributions(
            self.vitality,
            "resistance",
            contribution.remove(self.vitality.resistance, id),
        );

        return vitality === self.vitality ? self : { ...self, vitality };
    });
}
