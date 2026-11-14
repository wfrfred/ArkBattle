import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Contribution } from "../../contribution/contribution.js";
import type { Unit } from "../../unit.js";
import { assertFiniteNumber } from "../../../common/assert.js";
import { roundToEven } from "../../../common/math.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { createRegistrationOperations } from "../../registration.js";
import { allows, type Restriction as BaseRestriction } from "../../../restriction.js";

export interface Definition extends Restrictions {
    readonly taunt: number;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Targetable>;

export interface RestrictionContext {
    readonly source: Unit;
    readonly target: Unit & Targetable;
}

export type Restriction = BaseRestriction<RestrictionContext>;

interface Contributions {
    readonly taunt: readonly Contribution<Input>[];
}

interface Restrictions {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface State extends Contributions, Restrictions {}

export interface Targetable {
    readonly definition: { readonly targetable: Definition };
    readonly targetable: State;
}

export function hasTargetable<U extends Unit>(unit: U): unit is U & Targetable {
    return "targetable" in unit && "targetable" in unit.definition;
}

export function initialize<U extends Unit & Pick<Targetable, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Targetable> {
    const definition = unit.definition.targetable;
    assertFiniteNumber(definition.taunt, "taunt");
    const ids = new Set<string>();

    for (const entry of definition.restrictions) {
        if (ids.has(entry.id)) {
            throw new TypeError(`duplicate targetable restriction identity: ${entry.id}`);
        }

        ids.add(entry.id);
    }

    return {
        state: battle,
        value: { ...unit, targetable: { taunt: [], restrictions: [...definition.restrictions] } },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Targetable,
    "targetable",
    keyof Restrictions
>("targetable", "restrictions");

export const { set: setTauntContribution, remove: removeTauntContribution } =
    createRegistrationOperations<Unit & Targetable, "targetable", "taunt">("targetable", "taunt");

export function resolveTaunt(battle: BattleState, self: Unit & Targetable): number {
    return roundToEven(
        attribute.apply(
            self.definition.targetable.taunt,
            contribution
                .resolve(self.targetable.taunt)
                .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
        ),
    );
}

export function allowsRestrictions(
    battle: BattleState,
    source: Unit,
    ignore?: (restriction: Restriction) => boolean,
): (target: Unit & Targetable) => boolean {
    return (target) => allows(battle, { source, target }, target.targetable.restrictions, ignore);
}
