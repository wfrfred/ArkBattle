import type { State as BattleState, Result } from "../../../battle/state.js";
import { assertNonnegativeNumber, assertPositiveNumber } from "../../../common/assert.js";
import type * as contribution from "../../../common/contribution.js";
import { roundToEven } from "../../../common/math.js";
import type { Ref } from "../../../common/ref.js";
import { validateShape, type Shape } from "../../../geometry/shape.js";
import { validateRestrictions, type Restriction as BaseRestriction } from "../../../restriction.js";
import * as attribute from "../../attribute.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Unit } from "../../unit.js";
import { hasLocomotion, type Locomotion } from "../locomotion/capability.js";
import type { Unbalance } from "./unbalance.js";

export interface BodyDefinition {
    readonly shape: Shape;
    readonly mass: number;
    readonly frictionFactor: number;
}

export type Restriction = BaseRestriction<{ readonly self: Unit & Shiftable }>;

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface Definition extends Restrictions {
    readonly massLevel: attribute.Definition;
    readonly body: BodyDefinition;
}

export type Input = attribute.Input<Unit & Shiftable>;

export interface State extends Restrictions {
    readonly massLevel: attribute.State<Input>;
    readonly frictionFactor: number;
    readonly unbalance: Unbalance | null;
    readonly endingUnbalances: ReadonlyMap<Ref<Unbalance>, Unbalance>;
}

export type Shiftable = Locomotion & {
    readonly definition: { readonly shiftable: Definition };
    readonly shiftable: State;
};

export function hasShiftable<U extends Unit>(unit: U): unit is U & Shiftable {
    return "shiftable" in unit && "shiftable" in unit.definition;
}

export function isUnbalanced(unit: Unit): boolean {
    return hasShiftable(unit) && unit.shiftable.unbalance?.lifecycle === "ACTIVE";
}

export function initialize<
    U extends Unit & Locomotion & { readonly definition: { readonly shiftable: Definition } },
>(battle: BattleState, unit: U): Result<U & Shiftable> {
    if (!hasLocomotion(unit)) {
        throw new TypeError("shiftable requires locomotion");
    }

    const definition = unit.definition.shiftable;
    const { body } = definition;
    validateShape(body.shape);
    assertPositiveNumber(body.mass, "shiftable body mass");
    assertNonnegativeNumber(body.frictionFactor, "shiftable body friction factor");
    validateRestrictions(definition.restrictions);

    return {
        state: battle,
        value: {
            ...unit,
            shiftable: {
                massLevel: attribute.initialize<Input>(definition.massLevel),
                frictionFactor: body.frictionFactor,
                restrictions: definition.restrictions,
                unbalance: null,
                endingUnbalances: new Map(),
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Shiftable,
    "shiftable",
    keyof Restrictions
>("shiftable", "restrictions");

export function resolveMassLevel(battle: BattleState, self: Unit & Shiftable): number {
    return roundToEven(
        attribute.resolve(
            self.definition.shiftable.massLevel,
            self.shiftable.massLevel,
            battle,
            self,
        ),
    );
}

export function setMassLevelContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Shiftable> {
    return createChange<Unit & Shiftable>((self) =>
        updateMassLevel(self, attribute.setContribution(self.shiftable.massLevel, entry)),
    );
}

export function removeMassLevelContribution(id: string): Change<Unit & Shiftable> {
    return createChange<Unit & Shiftable>((self) =>
        updateMassLevel(self, attribute.removeContribution(self.shiftable.massLevel, id)),
    );
}

export function setMassLevelRange(range: attribute.Range): Change<Unit & Shiftable> {
    return createChange<Unit & Shiftable>((self) =>
        updateMassLevel(
            self,
            attribute.setRange(
                self.definition.shiftable.massLevel,
                self.shiftable.massLevel,
                range,
            ),
        ),
    );
}

export function clearMassLevelRange(): Change<Unit & Shiftable> {
    return createChange<Unit & Shiftable>((self) =>
        updateMassLevel(
            self,
            attribute.clearRange(self.definition.shiftable.massLevel, self.shiftable.massLevel),
        ),
    );
}

function updateMassLevel<U extends Unit & Shiftable>(
    self: U,
    massLevel: attribute.State<Input>,
): U {
    return massLevel === self.shiftable.massLevel
        ? self
        : { ...self, shiftable: { ...self.shiftable, massLevel } };
}

export function setFrictionFactor(frictionFactor: number): Change<Unit & Shiftable> {
    assertNonnegativeNumber(frictionFactor, "shiftable friction factor");

    return createChange<Unit & Shiftable>((self) => updateFrictionFactor(self, frictionFactor));
}

export function restoreFrictionFactor(): Change<Unit & Shiftable> {
    return createChange<Unit & Shiftable>((self) =>
        updateFrictionFactor(self, self.definition.shiftable.body.frictionFactor),
    );
}

function updateFrictionFactor<U extends Unit & Shiftable>(self: U, frictionFactor: number): U {
    return frictionFactor === self.shiftable.frictionFactor
        ? self
        : { ...self, shiftable: { ...self.shiftable, frictionFactor } };
}
