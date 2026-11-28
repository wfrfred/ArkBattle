import type { Vec2 } from "../common/vector.js";

export const DIRECTIONS = ["UP", "RIGHT", "DOWN", "LEFT"] as const;

export type Direction = (typeof DIRECTIONS)[number];

const DIRECTION_VECTOR = {
    UP: [0, 1],
    RIGHT: [1, 0],
    DOWN: [0, -1],
    LEFT: [-1, 0],
} as const satisfies Record<Direction, Vec2>;

const OPPOSITE_DIRECTION = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
} as const satisfies Record<Direction, Direction>;

const MIRROR_DIRECTION = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
} as const satisfies Record<Direction, Direction>;

export const Direction = {
    vector(direction: Direction): Vec2 {
        return DIRECTION_VECTOR[direction];
    },

    opposite(direction: Direction): Direction {
        return OPPOSITE_DIRECTION[direction];
    },

    mirror(direction: Direction): Direction {
        return MIRROR_DIRECTION[direction];
    },

    is(value: unknown): value is Direction {
        return typeof value === "string" && DIRECTIONS.includes(value as Direction);
    },
};
