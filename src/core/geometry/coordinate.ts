import { roundToEven } from "../common/math.js";
import type { Vec2 } from "../common/vector.js";
import { Direction } from "./direction.js";

export type TilePosition = Vec2;

export type WorldPosition = Vec2;

function toTileComponent(value: number): number {
    // Preserve an input zero and normalize zero produced by rounding.
    return value === 0 ? value : roundToEven(value) + 0;
}

export const Tile = {
    is(value: unknown): value is TilePosition {
        return (
            Array.isArray(value) &&
            value.length === 2 &&
            Number.isSafeInteger(value[0]) &&
            Number.isSafeInteger(value[1])
        );
    },

    rotate(vector: TilePosition, direction: Direction): TilePosition {
        const [dRow, dCol] = vector;
        const [forwardRow, forwardCol] = Direction.vector(direction);

        const row = dRow * forwardCol + dCol * forwardRow;
        const col = -dRow * forwardRow + dCol * forwardCol;

        return [row, col];
    },

    center(position: TilePosition): WorldPosition {
        return [position[1], position[0]];
    },
};

export const World = {
    toTile(position: WorldPosition): TilePosition {
        return [toTileComponent(position[1]), toTileComponent(position[0])];
    },
};
