import { Vec2 } from "../../common/vector.js";
import type { WorldPosition } from "../../geometry/coordinate.js";

function normalize(vector: Vec2): Vec2 {
    const length = Vec2.length(vector);

    return length > 0.00001 ? Vec2.scale(vector, 1 / length) : [0, 0];
}

export function calculate(
    blocker: WorldPosition,
    target: WorldPosition,
    previous: Iterable<WorldPosition>,
): WorldPosition {
    let offset = Vec2.sub(target, blocker);
    if (Vec2.length(offset) < 0.5) {
        offset = Vec2.scale(normalize(offset), 0.5);
    }

    const position = Vec2.add(blocker, offset);
    let overlaps = false;
    let separation: Vec2 = [0, 0];

    for (const other of previous) {
        const delta = Vec2.sub(position, other);
        const distanceSquared = delta[0] * delta[0] + delta[1] * delta[1];

        if (distanceSquared < 0.01) {
            overlaps = true;
            const radial = Vec2.sub(other, blocker);
            separation = Vec2.add(separation, normalize([radial[1], -radial[0]]));
        } else if (distanceSquared < 0.16) {
            separation = Vec2.add(
                separation,
                Vec2.scale(normalize(delta), (0.4 - Math.sqrt(distanceSquared)) * 50),
            );
        }
    }

    if (!overlaps) {
        return position;
    }

    const direction = normalize(Vec2.add(offset, Vec2.scale(normalize(separation), 0.2)));

    return Vec2.add(blocker, Vec2.scale(direction, Vec2.length(offset)));
}
