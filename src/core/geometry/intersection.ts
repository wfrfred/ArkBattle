import { Vec2 } from "../common/vector.js";
import type { WorldPosition } from "./coordinate.js";
import type { Range } from "./range.js";
import type { Shape } from "./shape.js";

interface RoundedBox {
    readonly halfExtents: Vec2;
    readonly radius: number;
}

function roundedBox(shape: Shape): RoundedBox {
    switch (shape.type) {
        case "CIRCLE":
            return { halfExtents: [0, 0], radius: shape.radius };

        case "BOX":
            return { halfExtents: shape.halfExtents, radius: 0 };

        case "CAPSULE":
            return {
                halfExtents: shape.axis === "X" ? [shape.halfLength, 0] : [0, shape.halfLength],
                radius: shape.radius,
            };
    }
}

function minkowskiSum(left: RoundedBox, right: RoundedBox): RoundedBox {
    return {
        halfExtents: Vec2.add(left.halfExtents, right.halfExtents),
        radius: left.radius + right.radius,
    };
}

function containsRoundedBox(box: RoundedBox, point: Vec2): boolean {
    const dx = Math.abs(point[0]) - box.halfExtents[0];
    const dy = Math.abs(point[1]) - box.halfExtents[1];
    if (box.radius === 0) {
        return dx <= 0 && dy <= 0;
    }

    return Math.max(0, dx) ** 2 + Math.max(0, dy) ** 2 <= box.radius * box.radius;
}

function sweepBox(
    from: WorldPosition,
    to: WorldPosition,
    halfExtents: WorldPosition,
): number | null {
    let first = 0;
    let last = 1;

    for (const axis of [0, 1] as const) {
        const delta = to[axis] - from[axis];
        const extent = halfExtents[axis];

        if (delta === 0) {
            if (Math.abs(from[axis]) > extent) {
                return null;
            }

            continue;
        }

        const enter = (-extent - from[axis]) / delta;
        const exit = (extent - from[axis]) / delta;

        first = Math.max(first, Math.min(enter, exit));
        last = Math.min(last, Math.max(enter, exit));

        if (first > last) {
            return null;
        }
    }

    return first;
}

function sweepCircle(
    from: WorldPosition,
    to: WorldPosition,
    center: WorldPosition,
    radius: number,
): number | null {
    const x = from[0] - center[0];
    const y = from[1] - center[1];

    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const lengthSquared = dx * dx + dy * dy;

    const projection = -(x * dx + y * dy);
    const cross = x * dy - y * dx;
    const discriminant = radius * radius * lengthSquared - cross * cross;
    if (discriminant < 0) {
        return null;
    }

    const first = (projection - Math.sqrt(discriminant)) / lengthSquared;

    return first >= 0 && first <= 1 ? first : null;
}

function sweepRoundedBox(start: Vec2, end: Vec2, box: RoundedBox): number | null {
    if (containsRoundedBox(box, start)) {
        return 0;
    }

    if (Vec2.equal(start, end)) {
        return null;
    }

    const { halfExtents, radius } = box;
    const [width, height] = halfExtents;
    if (radius === 0) {
        return sweepBox(start, end, halfExtents);
    }

    if (width === 0 && height === 0) {
        return sweepCircle(start, end, [0, 0], radius);
    }

    const horizontal = sweepBox(start, end, [width + radius, height]);
    const vertical = sweepBox(start, end, [width, height + radius]);
    let first = horizontal;
    if (vertical !== null && (first === null || vertical < first)) {
        first = vertical;
    }

    for (const cx of [-width, width]) {
        for (const cy of [-height, height]) {
            const contact = sweepCircle(start, end, [cx, cy], radius);
            if (contact !== null && (first === null || contact < first)) {
                first = contact;
            }
        }
    }

    return first;
}

export function contains(range: Range, origin: WorldPosition, point: WorldPosition): boolean {
    return range.some((shape) =>
        containsRoundedBox(roundedBox(shape), Vec2.sub(point, Vec2.add(origin, shape.offset))),
    );
}

export function overlaps(
    range: Range,
    origin: WorldPosition,
    shape: Shape,
    shapeOrigin: WorldPosition,
): boolean {
    const target = roundedBox(shape);
    const center = Vec2.add(shapeOrigin, shape.offset);

    return range.some((entry) =>
        containsRoundedBox(
            minkowskiSum(roundedBox(entry), target),
            Vec2.sub(Vec2.add(origin, entry.offset), center),
        ),
    );
}

export function sweep(
    moving: Shape,
    from: WorldPosition,
    to: WorldPosition,
    target: Shape,
    targetOrigin: WorldPosition,
): number | null {
    const center = Vec2.add(targetOrigin, target.offset);
    const start = Vec2.sub(Vec2.add(from, moving.offset), center);
    const end = Vec2.sub(Vec2.add(to, moving.offset), center);

    return sweepRoundedBox(start, end, minkowskiSum(roundedBox(moving), roundedBox(target)));
}

interface SweepContact {
    readonly time: number;
    readonly normal: Vec2;
}

export function sweepAgainstBox(
    moving: Shape,
    from: WorldPosition,
    to: WorldPosition,
    target: Extract<Shape, { readonly type: "BOX" }>,
    targetOrigin: WorldPosition,
): SweepContact | null {
    const box = minkowskiSum(roundedBox(moving), roundedBox(target));
    const { halfExtents, radius } = box;
    const origin = Vec2.add(targetOrigin, target.offset);
    const center = Vec2.add(from, moving.offset);
    const start = Vec2.sub(center, origin);
    const motion = Vec2.sub(to, from);
    if (motion[0] === 0 || motion[1] === 0) {
        const axis = motion[0] === 0 ? 0 : 1;
        const side = halfExtents[axis] + radius;
        const tolerance =
            8 * Number.EPSILON * Math.max(1, Math.abs(center[axis]), Math.abs(origin[axis]), side);
        if (Math.abs(Math.abs(start[axis]) - side) <= tolerance) {
            // A tangent path reaches the flat side at the first corner. Evaluate
            // that boundary directly to avoid a false inward normal at tile seams.
            const track: Vec2 = axis === 0 ? [0, start[1]] : [start[0], 0];
            const time = sweepBox(track, Vec2.add(track, motion), halfExtents);
            const sign = start[axis] < 0 ? -1 : 1;

            return time === null ? null : { time, normal: axis === 0 ? [sign, 0] : [0, sign] };
        }
    }

    const end = Vec2.sub(Vec2.add(to, moving.offset), origin);
    const time = sweepRoundedBox(start, end, box);
    if (time === null) {
        return null;
    }

    const relative = Vec2.add(start, Vec2.scale(motion, time));
    if (radius === 0) {
        return { time, normal: faceNormal(relative, halfExtents, motion) };
    }

    const nearest: Vec2 = [
        Math.max(-halfExtents[0], Math.min(halfExtents[0], relative[0])),
        Math.max(-halfExtents[1], Math.min(halfExtents[1], relative[1])),
    ];
    const outward = Vec2.sub(relative, nearest);
    const length = Vec2.length(outward);
    if (length > 0) {
        return { time, normal: Vec2.scale(outward, 1 / length) };
    }

    return { time, normal: faceNormal(relative, halfExtents) };
}

function faceNormal(position: Vec2, halfExtents: Vec2, motion?: Vec2): Vec2 {
    const dx = halfExtents[0] - Math.abs(position[0]);
    const dy = halfExtents[1] - Math.abs(position[1]);
    const sx = position[0] < 0 || (halfExtents[0] === 0 && (motion?.[0] ?? 0) > 0) ? -1 : 1;
    const sy = position[1] < 0 || (halfExtents[1] === 0 && (motion?.[1] ?? 0) > 0) ? -1 : 1;

    // At a sharp corner a path that separates from either face stays outside.
    if (motion !== undefined && dx === 0 && dy === 0) {
        if (motion[0] * sx >= 0) {
            return [sx, 0];
        }
        if (motion[1] * sy >= 0) {
            return [0, sy];
        }
    }

    // For an embedded start, the nearest face supplies the escape direction.
    return dx <= dy ? [sx, 0] : [0, sy];
}
