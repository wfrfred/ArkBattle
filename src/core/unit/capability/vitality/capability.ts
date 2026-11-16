import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../contribution/contribution.js";
import * as entries from "../../../common/collection/entries.js";
import * as attribute from "../../contribution/attribute.js";
import type { Unit } from "../../unit.js";
import type { Restriction } from "./restriction.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";
import * as units from "../../query.js";
import { remove } from "../../../battle/unit.js";
import { change, normalize, type Health } from "./health.js";

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

interface Restrictions {
    readonly damageRestrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions, Contributions {
    readonly health: Health;
    readonly maxMinusHpRatio: number;
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
                health: { hp: Math.max(1, definition.maxHp), minusHp: 0 },
                maxMinusHpRatio: 0,
                maxHp: [],
                defense: [],
                resistance: [],
                recoverySpeed: [],
                recoveryRatio: [],
                damageRestrictions: [],
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Vitality,
    "vitality",
    keyof Restrictions
>("vitality", "damageRestrictions");

function preserveHpRatio(
    health: Health,
    previousMax: number,
    nextMax: number,
    maxMinusHpRatio: number,
): Health {
    if (previousMax === nextMax || health.hp <= 0) {
        return health;
    }

    const maxMinusHp = nextMax * maxMinusHpRatio;

    return normalize(
        change(health, (health.hp / previousMax) * nextMax, maxMinusHp),
        nextMax,
        maxMinusHp,
    );
}

function settleHealth(battle: BattleState, previous: Unit & Vitality): BattleState {
    if (previous.vitality.health.hp <= 0) {
        return battle;
    }

    const reference = units.ref(previous);
    const current = units.get(battle, reference);

    return current?.lifecycle === "PRESENT" && current.vitality.health.hp <= 0
        ? remove(battle, reference, { reason: "DEATH", killer: null })
        : battle;
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
        const health = preserveHpRatio(
            self.vitality.health,
            resolveMaxHp(self.definition.vitality, self.vitality),
            resolveMaxHp(self.definition.vitality, vitality),
            vitality.maxMinusHpRatio,
        );

        return { ...self, vitality: { ...vitality, health } };
    }, settleHealth);
}

export function removeMaxHpContribution(id: string): Change<Unit & Vitality> {
    return createChange<Unit & Vitality>((self) => {
        const maxHp = entries.remove(self.vitality.maxHp, id);
        if (maxHp === self.vitality.maxHp) {
            return self;
        }

        const vitality = { ...self.vitality, maxHp };
        const health = preserveHpRatio(
            self.vitality.health,
            resolveMaxHp(self.definition.vitality, self.vitality),
            resolveMaxHp(self.definition.vitality, vitality),
            vitality.maxMinusHpRatio,
        );

        return { ...self, vitality: { ...vitality, health } };
    }, settleHealth);
}

export function resolveMaxHp(definition: Definition, state: State): number {
    return Math.max(1, attribute.apply(definition.maxHp, contribution.resolve(state.maxHp).flat()));
}

export function resolveMaxMinusHp(definition: Definition, state: State): number {
    return resolveMaxHp(definition, state) * state.maxMinusHpRatio;
}

export function setMaxMinusHpRatio(ratio: number): Change<Unit & Vitality> {
    assertNonnegativeNumber(ratio, "maxMinusHpRatio");

    return createChange<Unit & Vitality>((self) =>
        ratio === self.vitality.maxMinusHpRatio
            ? self
            : { ...self, vitality: { ...self.vitality, maxMinusHpRatio: ratio } },
    );
}

export const { set: setContribution, remove: removeContribution } = createRegistrationOperations<
    Unit & Vitality,
    "vitality",
    keyof Contributions
>("vitality");
