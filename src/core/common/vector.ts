export type Vec2 = readonly [number, number];

export const Vec2 = {
    is(value: unknown): value is Vec2 {
        return (
            Array.isArray(value) &&
            value.length === 2 &&
            Number.isFinite(value[0]) &&
            Number.isFinite(value[1])
        );
    },

    add(a: Vec2, b: Vec2): Vec2 {
        return [a[0] + b[0], a[1] + b[1]];
    },

    sub(a: Vec2, b: Vec2): Vec2 {
        return [a[0] - b[0], a[1] - b[1]];
    },

    negate(v: Vec2): Vec2 {
        return [-v[0], -v[1]];
    },

    scale(v: Vec2, factor: number): Vec2 {
        return [v[0] * factor, v[1] * factor];
    },

    lerp(from: Vec2, to: Vec2, progress: number): Vec2 {
        return [from[0] + (to[0] - from[0]) * progress, from[1] + (to[1] - from[1]) * progress];
    },

    length(v: Vec2): number {
        return Math.hypot(v[0], v[1]);
    },

    distanceSquared(a: Vec2, b: Vec2): number {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];

        return dx * dx + dy * dy;
    },

    clampLength(v: Vec2, maxLength: number): Vec2 {
        const length = Vec2.length(v);

        return length > maxLength ? Vec2.scale(v, maxLength / length) : v;
    },
};
