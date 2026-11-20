import { Vec2 } from "../../core/common/vector.js";
import type { WorldPosition } from "../../core/geometry/coordinate.js";

export function towards(
    position: WorldPosition,
    target: WorldPosition,
    speed: number,
    deltaTicks: number,
): { readonly position: WorldPosition; readonly reached: boolean } {
    const distance = speed * deltaTicks;
    if (Vec2.distanceSquared(position, target) <= distance * distance) {
        return { position: target, reached: true };
    }

    return {
        position: Vec2.add(position, Vec2.clampLength(Vec2.sub(target, position), distance)),
        reached: false,
    };
}
