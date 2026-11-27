import { assertNonnegativeNumber } from "../../../common/assert.js";
import { Vec2 } from "../../../common/vector.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import type * as contribution from "../../../common/contribution.js";
import * as attribute from "../../attribute.js";
import type { SteeringParameters } from "./steering.js";
import { createRegistrationOperations } from "../../registration.js";
import { createChange, type Change } from "../../change.js";
import type { Restriction as BaseRestriction } from "../../../restriction.js";

export const MOVE_SAMPLE_INTERVAL = 5;

export interface Definition {
    readonly speed: attribute.Definition;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export interface RestrictionContext {
    readonly self: Unit & Locomotion;
}

export type Restriction = BaseRestriction<RestrictionContext>;

export type Input = attribute.Input<Unit & Locomotion>;

export interface Initial {
    readonly mode: MotionMode;
}

interface Restrictions {
    readonly restrictions: readonly contribution.Contribution<Restriction>[];
}

export interface State extends Restrictions {
    readonly mode: MotionMode;
    readonly target: MovementTarget | null;
    readonly speed: attribute.State<Input>;
    readonly velocity: WorldPosition;
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

export function hasLocomotion<U extends Unit>(unit: U): unit is U & Locomotion {
    return "locomotion" in unit && "locomotion" in unit.definition;
}

export function initialize<U extends Unit & Pick<Locomotion, "definition">>(
    battle: BattleState,
    unit: U,
    initial: Initial,
): Result<U & Locomotion> {
    if ("deployable" in unit.definition) {
        throw new TypeError("locomotion and deployable are mutually exclusive");
    }

    const definition = unit.definition.locomotion;
    assertNonnegativeNumber(definition.halfBodyWidth, "halfBodyWidth");
    assertNonnegativeNumber(definition.steeringParameters.steeringFactor, "steeringFactor");
    assertNonnegativeNumber(definition.steeringParameters.maxSteeringForce, "maxSteeringForce");

    return {
        state: battle,
        value: {
            ...unit,
            locomotion: {
                mode: initial.mode,
                target: null,
                velocity: [0, 0],
                speed: attribute.initialize<Input>(definition.speed),
                restrictions: [],
                totalMoveDistance: 0,
                lastMoveSamplePosition: unit.position,
                nextMoveSampleTick: battle.tick + MOVE_SAMPLE_INTERVAL,
            },
        },
    };
}

export const { set: setRestriction, remove: removeRestriction } = createRegistrationOperations<
    Unit & Locomotion
>()("locomotion", "restrictions");

export function setMode(mode: MotionMode): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) =>
        self.locomotion.mode === mode
            ? self
            : { ...self, locomotion: { ...self.locomotion, mode } },
    );
}

export function setTarget(target: MovementTarget | null): Change<Unit & Locomotion> {
    return createChange<Unit & Locomotion>((self) => {
        const previous = self.locomotion.target;
        if (
            previous === target ||
            (previous !== null &&
                target !== null &&
                Vec2.equal(previous.nextPoint, target.nextPoint) &&
                Vec2.equal(previous.goal, target.goal))
        ) {
            return self;
        }

        return { ...self, locomotion: { ...self.locomotion, target } };
    });
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
