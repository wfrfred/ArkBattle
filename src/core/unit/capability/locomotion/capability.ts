import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { SteeringParameters } from "./steering.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Rule as BaseRule } from "../../../rule.js";

export interface Definition {
    readonly speed: number;
    readonly minSpeed: number;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export interface RuleContext {
    readonly self: Unit & Locomotion;
}

export type Rule = BaseRule<RuleContext>;

export type Input = contribution.Input<attribute.Modifier, Unit & Locomotion>;

interface Contributions {
    readonly speed: readonly contribution.Contribution<Input>[];
}

interface Rules {
    readonly rules: readonly Rule[];
}

export interface State extends Rules, Contributions {
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
        value: { ...unit, locomotion: { velocity: [0, 0], speed: [], rules: [] } },
    };
}

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Locomotion,
    "locomotion",
    keyof Rules
>("locomotion", "rules");

export const { set: setSpeedContribution, remove: removeSpeedContribution } =
    createRegistrationOperations<Unit & Locomotion, "locomotion", keyof Contributions>(
        "locomotion",
        "speed",
    );
