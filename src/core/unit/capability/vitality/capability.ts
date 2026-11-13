import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as entries from "../../../common/collection/entries.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit } from "../../unit.js";
import type {
    ReceivingHook as DamageReceivingHook,
    ReceivingStartedHook,
} from "../../../battle/damage/hp/hook.js";
import type { ReceivingHook as HealingReceivingHook } from "../../../battle/healing/hp/hook.js";
import type { DamageReceptionRule } from "./rule.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";

export interface Definition {
    readonly maxHp: number;
    readonly defense: number;
    readonly resistance: number;
    readonly recoverySpeed: number;
    readonly recoveryRatio: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Vitality>;

interface Contributions {
    readonly defense: readonly contribution.Contribution<Input>[];
    readonly resistance: readonly contribution.Contribution<Input>[];
    readonly recoverySpeed: readonly contribution.Contribution<Input>[];
    readonly recoveryRatio: readonly contribution.Contribution<Input>[];
}

export type Parameter = keyof Contributions;

interface Rules {
    readonly damageRules: readonly DamageReceptionRule[];
}

interface Hooks {
    readonly damageReceivingStarted: readonly ReceivingStartedHook[];
    readonly damageReceiving: readonly DamageReceivingHook[];
    readonly healingReceiving: readonly HealingReceivingHook[];
}

export interface State extends Rules, Contributions, Hooks {
    readonly hp: number;
    readonly maxHp: readonly contribution.Contribution<readonly attribute.Modifier[]>[];
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

export function initialize<U extends Unit & Pick<Vitality, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Vitality> {
    const definition = unit.definition.vitality;
    assertNonnegativeNumber(definition.maxHp, "maxHp");
    assertNonnegativeNumber(definition.defense, "defense");
    assertNonnegativeNumber(definition.resistance, "resistance");
    assertNonnegativeNumber(definition.recoverySpeed, "HP recovery per second");
    assertNonnegativeNumber(definition.recoveryRatio, "HP recovery ratio per second");

    return {
        state: battle,
        value: {
            ...unit,
            vitality: {
                hp: Math.max(1, definition.maxHp),
                maxHp: [],
                defense: [],
                resistance: [],
                recoverySpeed: [],
                recoveryRatio: [],
                damageReceivingStarted: [],
                damageReceiving: [],
                healingReceiving: [],
                damageRules: [],
            },
        },
    };
}

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Vitality,
    "vitality",
    keyof Rules
>("vitality", "damageRules");

function preserveHpRatio(hp: number, previousMax: number, nextMax: number): number {
    if (previousMax === nextMax || hp <= 0) {
        return hp;
    }

    return Math.min(nextMax, (hp / previousMax) * nextMax);
}

export function setMaxHpContribution(
    entry: contribution.Contribution<readonly attribute.Modifier[]>,
): Change<Unit & Vitality> {
    return createChange<Unit & Vitality>((self) => {
        const maxHp = entries.set(self.vitality.maxHp, entry);
        if (maxHp === self.vitality.maxHp) {
            return self;
        }

        const vitality = { ...self.vitality, maxHp };
        const hp = preserveHpRatio(
            self.vitality.hp,
            resolveMaxHp(self.definition.vitality, self.vitality),
            resolveMaxHp(self.definition.vitality, vitality),
        );

        return { ...self, vitality: { ...vitality, hp } };
    });
}

export function removeMaxHpContribution(id: string): Change<Unit & Vitality> {
    return createChange<Unit & Vitality>((self) => {
        const maxHp = entries.remove(self.vitality.maxHp, id);
        if (maxHp === self.vitality.maxHp) {
            return self;
        }

        const vitality = { ...self.vitality, maxHp };
        const hp = preserveHpRatio(
            self.vitality.hp,
            resolveMaxHp(self.definition.vitality, self.vitality),
            resolveMaxHp(self.definition.vitality, vitality),
        );

        return { ...self, vitality: { ...vitality, hp } };
    });
}

export function resolveMaxHp(definition: Definition, state: State): number {
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
