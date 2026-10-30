import { assertNonnegativeNumber } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { MotionMode } from "../../../battlefield/navigation/state.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as contribution from "../../contribution/contribution.js";
import type * as attribute from "../../contribution/attribute.js";
import type { SteeringParameters } from "./steering.js";
import * as registry from "../../../hook.js";
import type { Ref } from "../../../common/ref.js";
import { createChange, type Change } from "../../change.js";

export interface Definition {
    readonly speed: number;
    readonly minSpeed: number;
    readonly steeringParameters: SteeringParameters;
    readonly halfBodyWidth: number;
}

export interface Rule {
    readonly id: string;
    readonly allows: (battle: BattleState, self: Unit & Locomotion) => boolean;
}

export type Input = contribution.Input<attribute.Modifier, Unit & Locomotion>;

export interface State {
    readonly velocity: WorldPosition;
    readonly speed: readonly contribution.Contribution<Input>[];
    readonly rules: readonly Rule[];
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

export function initialize(battle: BattleState, definition: Definition): Result<State> {
    assertNonnegativeNumber(definition.speed, "speed");
    assertNonnegativeNumber(definition.minSpeed, "minSpeed");
    assertNonnegativeNumber(definition.halfBodyWidth, "halfBodyWidth");
    assertNonnegativeNumber(definition.steeringParameters.steeringFactor, "steeringFactor");
    assertNonnegativeNumber(definition.steeringParameters.maxSteeringForce, "maxSteeringForce");

    return {
        state: battle,
        value: { velocity: [0, 0], speed: [], rules: [] },
    };
}

export function setRule(reference: Ref<Unit & Locomotion>, rule: Rule): Change {
    return createChange(reference, (self) => {
        const rules = registry.set(self.locomotion.rules, rule);

        return rules === self.locomotion.rules
            ? self
            : { ...self, locomotion: { ...self.locomotion, rules } };
    });
}

export function removeRule(reference: Ref<Unit & Locomotion>, id: string): Change {
    return createChange(reference, (self) => {
        const rules = registry.remove(self.locomotion.rules, id);

        return rules === self.locomotion.rules
            ? self
            : { ...self, locomotion: { ...self.locomotion, rules } };
    });
}

export function setSpeedContribution(
    reference: Ref<Unit & Locomotion>,
    entry: contribution.Contribution<Input>,
): Change {
    return createChange(reference, (self) => {
        const speed = contribution.set(self.locomotion.speed, entry);

        return speed === self.locomotion.speed
            ? self
            : { ...self, locomotion: { ...self.locomotion, speed } };
    });
}

export function removeSpeedContribution(reference: Ref<Unit & Locomotion>, id: string): Change {
    return createChange(reference, (self) => {
        const speed = contribution.remove(self.locomotion.speed, id);

        return speed === self.locomotion.speed
            ? self
            : { ...self, locomotion: { ...self.locomotion, speed } };
    });
}
