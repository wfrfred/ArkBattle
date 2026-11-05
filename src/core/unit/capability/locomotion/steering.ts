import { Vec2 } from "../../../common/vector.js";
import { type WorldPosition } from "../../../geometry/coordinate.js";

export interface SteeringParameters {
    readonly steeringFactor: number;
    readonly maxSteeringForce: number;
}

export function integrate(
    velocity: WorldPosition,
    direction: WorldPosition,
    speed: number,
    localForce: WorldPosition,
    parameters: SteeringParameters,
): WorldPosition {
    const magnitude = Vec2.length(direction);
    const heading: WorldPosition = magnitude > 1e-5 ? Vec2.scale(direction, 1 / magnitude) : [0, 0];
    const desired = Vec2.scale(heading, speed);
    const force = Vec2.clampLength(
        Vec2.add(localForce, Vec2.scale(Vec2.sub(desired, velocity), parameters.steeringFactor)),
        parameters.maxSteeringForce,
    );

    return Vec2.clampLength(Vec2.add(velocity, force), speed);
}
