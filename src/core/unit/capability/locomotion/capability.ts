import { assertNonnegativeNumber, assertPositiveNumber } from "../../../common/assert.js";
import { roundToEven } from "../../../common/math.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import { validateBodyShape, type BodyShape } from "../../../geometry/shape.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type { SteeringParameters } from "./steering.js";
import { createRegistrationOperations } from "../../registration.js";
import { createChange, type Change } from "../../change.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";
import type { Unbalance } from "./unbalance.js";

const defaultMassLevel = { default: 0, min: 0, max: null };

export const MOVE_SAMPLE_INTERVAL = 5;

export interface BodyDefinition {
    readonly shape: BodyShape;
    readonly mass: number;
    readonly frictionFactor: number;
}

export interface Definition {
    readonly speed: attribute.Definition;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
    readonly body?: BodyDefinition;
    readonly massLevel?: attribute.Definition;
}

export interface RestrictionContext {
    readonly self: Unit & Locomotion;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Input = attribute.Input<Unit & Locomotion>;

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
    readonly forceRestrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly speed: attribute.State<Input>;
    readonly velocity: WorldPosition;
    readonly massLevel: attribute.State<Input>;
    readonly unbalance: Unbalance | null;
    readonly nextUnbalanceId: number;
    readonly totalMoveDistance: number;
    readonly lastMoveSamplePosition: WorldPosition;
    readonly nextMoveSampleTick: number;
}

export interface Locomotion {
    readonly definition: { readonly locomotion: Definition };
    readonly locomotion: State;
}

export interface MovementTarget {
    readonly nextPoint: WorldPosition;
    readonly goal: WorldPosition;
}

export interface MovementContext {
    readonly mode: MotionMode;
    readonly speedMultiplier: number;
}

export function hasLocomotion<U extends Unit>(unit: U): unit is U & Locomotion {
    return "locomotion" in unit && "locomotion" in unit.definition;
}

export function isUnbalanced(unit: Unit): boolean {
    return hasLocomotion(unit) && unit.locomotion.unbalance?.lifecycle === "ACTIVE";
}

export function initialize<U extends Unit & Pick<Locomotion, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Locomotion> {
    const definition = unit.definition.locomotion;
    assertNonnegativeNumber(definition.halfBodyWidth, "halfBodyWidth");
    assertNonnegativeNumber(definition.steeringParameters.steeringFactor, "steeringFactor");
    assertNonnegativeNumber(definition.steeringParameters.maxSteeringForce, "maxSteeringForce");

    if (definition.body !== undefined) {
        validateBodyShape(definition.body.shape);
        assertPositiveNumber(definition.body.mass, "locomotion body mass");
        assertNonnegativeNumber(definition.body.frictionFactor, "locomotion friction factor");
    }

    return {
        state: battle,
        value: {
            ...unit,
            locomotion: {
                velocity: [0, 0],
                speed: attribute.initialize<Input>(definition.speed),
                restrictions: [],
                forceRestrictions: [],
                massLevel: attribute.initialize<Input>(definition.massLevel ?? defaultMassLevel),
                unbalance: null,
                nextUnbalanceId: 0,
                totalMoveDistance: 0,
                lastMoveSamplePosition: unit.position,
                nextMoveSampleTick: battle.tick + MOVE_SAMPLE_INTERVAL,
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Locomotion,
    "locomotion",
    keyof Restrictions
>("locomotion", "restrictions");

export const { set: setForceRestriction, remove: removeForceRestriction } =
    createRegistrationOperations<Unit & Locomotion, "locomotion", "forceRestrictions">(
        "locomotion",
        "forceRestrictions",
    );

export function resolveMassLevel(battle: BattleState, self: Unit & Locomotion): number {
    return roundToEven(
        attribute.resolve(
            self.definition.locomotion.massLevel ?? defaultMassLevel,
            self.locomotion.massLevel,
            battle,
            self,
        ),
    );
}

export function setMassLevelContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateMassLevel(self, attribute.setContribution(self.locomotion.massLevel, entry)),
    );
}

export function removeMassLevelContribution(id: string): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateMassLevel(self, attribute.removeContribution(self.locomotion.massLevel, id)),
    );
}

export function setMassLevelRange(range: attribute.Range): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateMassLevel(
            self,
            attribute.setRange(
                self.definition.locomotion.massLevel ?? defaultMassLevel,
                self.locomotion.massLevel,
                range,
            ),
        ),
    );
}

export function clearMassLevelRange(): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateMassLevel(
            self,
            attribute.clearRange(
                self.definition.locomotion.massLevel ?? defaultMassLevel,
                self.locomotion.massLevel,
            ),
        ),
    );
}

function updateMassLevel<U extends Unit & Locomotion>(
    self: U,
    massLevel: attribute.State<Input>,
): U {
    return massLevel === self.locomotion.massLevel
        ? self
        : { ...self, locomotion: { ...self.locomotion, massLevel } };
}

export function setSpeedContribution(
    entry: contribution.Contribution<Input>,
): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateSpeed(self, attribute.setContribution(self.locomotion.speed, entry)),
    );
}

export function removeSpeedContribution(id: string): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateSpeed(self, attribute.removeContribution(self.locomotion.speed, id)),
    );
}

export function setSpeedRange(range: attribute.Range): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateSpeed(
            self,
            attribute.setRange(self.definition.locomotion.speed, self.locomotion.speed, range),
        ),
    );
}

export function clearSpeedRange(): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        updateSpeed(
            self,
            attribute.clearRange(self.definition.locomotion.speed, self.locomotion.speed),
        ),
    );
}

function updateSpeed<U extends Unit & Locomotion>(self: U, speed: attribute.State<Input>): U {
    return speed === self.locomotion.speed
        ? self
        : { ...self, locomotion: { ...self.locomotion, speed } };
}
