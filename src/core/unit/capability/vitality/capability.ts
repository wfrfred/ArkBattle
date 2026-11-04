import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit, Definition as UnitDefinition } from "../../unit.js";
import type {
    ReceivingHook as DamageReceivingHook,
    ReceivingStartedHook,
} from "../../../battle/damage/hp/hook.js";
import type { ReceivingHook as HealingReceivingHook } from "../../../battle/healing/hp/hook.js";
import type { DamageReceptionRule } from "./rule.js";
import * as registry from "../../../hook.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Definition {
    readonly maxHp: number;
    readonly defense: number;
    readonly resistance: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Vitality>;

interface Contributions {
    readonly defense: readonly contribution.Contribution<Input>[];
    readonly resistance: readonly contribution.Contribution<Input>[];
}

interface Hooks {
    readonly damageReceivingStarted: readonly ReceivingStartedHook[];
    readonly damageReceiving: readonly DamageReceivingHook[];
    readonly healingReceiving: readonly HealingReceivingHook[];
}

export interface State extends Contributions, Hooks {
    readonly hp: number;
    readonly maxHp: readonly contribution.Contribution<readonly attribute.Modifier[]>[];
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

export function initialize<U extends Unit & Pick<Vitality, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Vitality> {
    const definition = unit.definition.vitality;
    assertNonnegativeNumber(definition.maxHp, "maxHp");
    assertNonnegativeNumber(definition.defense, "defense");
    assertNonnegativeNumber(definition.resistance, "resistance");

    return {
        state: battle,
        value: {
            ...unit,
            vitality: {
                hp: Math.max(1, definition.maxHp),
                maxHp: [],
                defense: [],
                resistance: [],
                damageReceivingStarted: [],
                damageReceiving: [],
                healingReceiving: [],
                damageReceptionRules: [],
            },
        },
    };
}

export function setRule(reference: Ref<Unit & Vitality>, rule: DamageReceptionRule): Change {
    return createChange(reference, (self) => {
        const damageReceptionRules = registry.set(self.vitality.damageReceptionRules, rule);

        return damageReceptionRules === self.vitality.damageReceptionRules
            ? self
            : { ...self, vitality: { ...self.vitality, damageReceptionRules } };
    });
}

export function removeRule(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const damageReceptionRules = registry.remove(self.vitality.damageReceptionRules, id);

        return damageReceptionRules === self.vitality.damageReceptionRules
            ? self
            : { ...self, vitality: { ...self.vitality, damageReceptionRules } };
    });
}

function preserveHpRatio(hp: number, previousMax: number, nextMax: number): number {
    if (previousMax === nextMax || hp <= 0) {
        return hp;
    }

    return Math.min(nextMax, (hp / previousMax) * nextMax);
}

export function setMaxHpContribution(
    reference: Ref<Unit & Vitality>,
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): Change {
    return createChange(reference, (self) => {
        const maxHp = contribution.set(self.vitality.maxHp, entry);
        if (maxHp === self.vitality.maxHp) {
            return self;
        }

        const vitality = { ...self.vitality, maxHp };
        const hp = preserveHpRatio(
            self.vitality.hp,
            resolveMaxHp(self.vitality, self.definition.vitality),
            resolveMaxHp(vitality, self.definition.vitality),
        );

        return { ...self, vitality: { ...vitality, hp } };
    });
}

export function removeMaxHpContribution(reference: Ref<Unit & Vitality>, id: string): Change {
    return createChange(reference, (self) => {
        const maxHp = contribution.remove(self.vitality.maxHp, id);
        if (maxHp === self.vitality.maxHp) {
            return self;
        }

        const vitality = { ...self.vitality, maxHp };
        const hp = preserveHpRatio(
            self.vitality.hp,
            resolveMaxHp(self.vitality, self.definition.vitality),
            resolveMaxHp(vitality, self.definition.vitality),
        );

        return { ...self, vitality: { ...vitality, hp } };
    });
}

export function resolveMaxHp(state: State, definition: Definition): number {
    return Math.max(1, attribute.apply(definition.maxHp, contribution.resolve(state.maxHp).flat()));
}

export const { set: setContribution, remove: removeContribution } = createRegistrationOperations<
    Unit & Vitality,
    "vitality",
    keyof Contributions
>("vitality");

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Vitality,
    "vitality",
    keyof Hooks
>("vitality");
