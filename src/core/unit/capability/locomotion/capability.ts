import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { SteeringParameters } from "./steering.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";

export interface Definition {
    readonly speed: number;
    readonly minSpeed: number;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export interface RestrictionContext {
    readonly self: Unit & Locomotion;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Input = contribution.Input<attribute.Modifier, Unit & Locomotion>;

interface Contributions {
    readonly speed: readonly contribution.Contribution<Input>[];
}

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions, Contributions {
    readonly velocity: WorldPosition;
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

export function initialize<U extends Unit & Pick<Locomotion, "definition">>(
    battle: BattleState,
    unit: U,
): Result<U & Locomotion> {
    const definition = unit.definition.locomotion;
    assertNonnegativeNumber(definition.speed, "speed");
    assertNonnegativeNumber(definition.minSpeed, "minSpeed");
    assertNonnegativeNumber(definition.halfBodyWidth, "halfBodyWidth");
    assertNonnegativeNumber(definition.steeringParameters.steeringFactor, "steeringFactor");
    assertNonnegativeNumber(definition.steeringParameters.maxSteeringForce, "maxSteeringForce");

    return {
        state: battle,
        value: { ...unit, locomotion: { velocity: [0, 0], speed: [], restrictions: [] } },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Locomotion,
    "locomotion",
    keyof Restrictions
>("locomotion", "restrictions");

export const { set: setSpeedContribution, remove: removeSpeedContribution } =
    createRegistrationOperations<Unit & Locomotion, "locomotion", keyof Contributions>(
        "locomotion",
        "speed",
    );
