import * as attribute from "../../attribute.js";
import type { Contribution } from "../../../common/contribution.js";
import type { Unit } from "../../unit.js";
import { roundToEven } from "../../../common/math.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { createRegistrationOperations } from "../../registration.js";
import { createChange, type Change } from "../../change.js";
import {
    allows,
    validateRestrictions,
    type Restriction as BaseRestriction,
} from "../../../restriction.js";

export type Category = "DEFAULT" | "DEVICE" | "OBSTACLE";

export interface Definition extends Restrictions {
    readonly category: Category;
    readonly taunt: attribute.Definition;
}

export type Input = attribute.Input<Unit & Targetable>;

export interface RestrictionContext {
    readonly source: Unit;
    readonly target: Unit & Targetable;
}

export type Restriction = BaseRestriction<RestrictionContext>;

interface Restrictions {
    readonly restrictions: readonly Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly category: Category;
    readonly taunt: attribute.State<Input>;
}

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
    validateRestrictions(definition.restrictions);

    return {
        state: battle,
        value: {
            ...unit,
            targetable: {
                category: definition.category,
                taunt: attribute.initialize<Input>(definition.taunt),
                restrictions: [...definition.restrictions],
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Targetable
>()("targetable", "restrictions");

export function setCategory(category: Category): Change<Unit & Targetable> {
    return createChange<Unit & Targetable>((self) =>
        category === self.targetable.category
            ? self
            : { ...self, targetable: { ...self.targetable, category } },
    );
}

export function setTauntContribution(entry: Contribution<Input>): Change<Unit & Targetable> {
    return createChange<Unit & Targetable>((self) =>
        updateTaunt(self, attribute.setContribution(self.targetable.taunt, entry)),
    );
}

export function removeTauntContribution(id: string): Change<Unit & Targetable> {
    return createChange<Unit & Targetable>((self) =>
        updateTaunt(self, attribute.removeContribution(self.targetable.taunt, id)),
    );
}

export function setTauntRange(range: attribute.Range): Change<Unit & Targetable> {
    return createChange<Unit & Targetable>((self) =>
        updateTaunt(
            self,
            attribute.setRange(self.definition.targetable.taunt, self.targetable.taunt, range),
        ),
    );
}

export function clearTauntRange(): Change<Unit & Targetable> {
    return createChange<Unit & Targetable>((self) =>
        updateTaunt(
            self,
            attribute.clearRange(self.definition.targetable.taunt, self.targetable.taunt),
        ),
    );
}

function updateTaunt<U extends Unit & Targetable>(self: U, taunt: attribute.State<Input>): U {
    return taunt === self.targetable.taunt
        ? self
        : { ...self, targetable: { ...self.targetable, taunt } };
}

export function resolveTaunt(battle: BattleState, self: Unit & Targetable): number {
    return roundToEven(
        attribute.resolve(self.definition.targetable.taunt, self.targetable.taunt, battle, self),
    );
}

export function allowsRestrictions(
    battle: BattleState,
    source: Unit,
    ignore?: (restriction: Restriction) => boolean,
): (target: Unit & Targetable) => boolean {
    return (target) => allows(battle, { source, target }, target.targetable.restrictions, ignore);
}
