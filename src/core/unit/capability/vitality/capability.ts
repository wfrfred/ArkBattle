import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber } from "../../../common/assert.js";
import * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type * as modifier from "../../../common/modifier.js";
import type { Unit } from "../../unit.js";
import type { Restriction } from "./restriction.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";
import * as units from "../../query.js";
import { remove } from "../../operations.js";
import { change, normalize, type Health } from "./health.js";

export interface Definition {
    readonly maxHp: attribute.Definition;
    readonly defense: attribute.Definition;
    readonly resistance: attribute.Definition;
    readonly recoverySpeed: attribute.Definition;
    readonly recoveryRatio: attribute.Definition;
}

export type Input = attribute.Input<Unit & Vitality>;

interface Attributes {
    readonly defense: attribute.State<Input>;
    readonly resistance: attribute.State<Input>;
    readonly recoverySpeed: attribute.State<Input>;
    readonly recoveryRatio: attribute.State<Input>;
}

export type Parameter = keyof Attributes;

interface Restrictions {
    readonly damageRestrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions, Attributes {
    readonly health: Health;
    readonly maxMinusHpRatio: number;
    readonly maxHp: attribute.State;
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
    const maxHp = attribute.initialize(definition.maxHp);

    return {
        state: battle,
        value: {
            ...unit,
            vitality: {
                health: { hp: attribute.resolve(definition.maxHp, maxHp), minusHp: 0 },
                maxMinusHpRatio: 0,
                maxHp,
                defense: attribute.initialize<Input>(definition.defense),
                resistance: attribute.initialize<Input>(definition.resistance),
                recoverySpeed: attribute.initialize<Input>(definition.recoverySpeed),
                recoveryRatio: attribute.initialize<Input>(definition.recoveryRatio),
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
    const current = reference.get(battle);

    return current?.lifecycle === "ACTIVE" && current.vitality.health.hp <= 0
        ? remove(battle, reference, { reason: "DEATH", killer: null })
        : battle;
}

export function setMaxHpContribution(
    entry: contribution.Contribution<readonly modifier.Modifier[]>,
): Change<Unit & Vitality> {
    return updateMaxHp((_definition, state) => attribute.setContribution(state, entry));
}

export function removeMaxHpContribution(id: string): Change<Unit & Vitality> {
    return updateMaxHp((_definition, state) => attribute.removeContribution(state, id));
}

function updateMaxHp(
    update: (definition: attribute.Definition, state: attribute.State) => attribute.State,
): Change<Unit & Vitality> {
    return createChange<Unit & Vitality>((self) => {
        const maxHp = update(self.definition.vitality.maxHp, self.vitality.maxHp);
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
    return attribute.resolve(definition.maxHp, state.maxHp);
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

export function setContribution(
    parameter: Parameter,
    entry: contribution.Contribution<Input>,
): Change<Unit & Vitality> {
    return updateAttribute(parameter, (_definition, state) =>
        attribute.setContribution(state, entry),
    );
}

export function removeContribution(parameter: Parameter, id: string): Change<Unit & Vitality> {
    return updateAttribute(parameter, (_definition, state) =>
        attribute.removeContribution(state, id),
    );
}

export function setRange(
    parameter: Parameter | "maxHp",
    range: attribute.Range,
): Change<Unit & Vitality> {
    return parameter === "maxHp"
        ? updateMaxHp((definition, state) => attribute.setRange(definition, state, range))
        : updateAttribute(parameter, (definition, state) =>
              attribute.setRange(definition, state, range),
          );
}

export function clearRange(parameter: Parameter | "maxHp"): Change<Unit & Vitality> {
    return parameter === "maxHp"
        ? updateMaxHp(attribute.clearRange)
        : updateAttribute(parameter, attribute.clearRange);
}

function updateAttribute(
    parameter: Parameter,
    update: (
        definition: attribute.Definition,
        state: attribute.State<Input>,
    ) => attribute.State<Input>,
): Change<Unit & Vitality> {
    return createChange<Unit & Vitality>((self) => {
        const next = update(self.definition.vitality[parameter], self.vitality[parameter]);

        return next === self.vitality[parameter]
            ? self
            : { ...self, vitality: { ...self.vitality, [parameter]: next } };
    });
}
