import { assertSafeInteger } from "../core/common/assert.js";
import type { TilePosition } from "../core/geometry/coordinate.js";

function record(value: unknown, name: string): Record<string, unknown> {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
        throw new TypeError(`${name} must be an object`);
    }

    return value as Record<string, unknown>;
}

function array(value: unknown, name: string): readonly unknown[] {
    if (!Array.isArray(value)) {
        throw new TypeError(`${name} must be an array`);
    }

    for (let index = 0; index < value.length; index++) {
        if (!Object.hasOwn(value, index) || value[index] === undefined) {
            throw new TypeError(`${name} must be dense`);
        }
    }

    return value as readonly unknown[];
}

function text(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw new TypeError(`${name} must be a nonempty string`);
    }

    return value;
}

export function parseRange(value: unknown, id: unknown): readonly TilePosition[] {
    const key = text(id, "range identity");
    const source = record(record(value, "range table")[key], `range ${key}`);
    if (source.id !== key || source.direction !== 1) {
        throw new TypeError("range must use its matching identity and default direction");
    }

    const seen = new Set<string>();

    return Array.from(array(source.grids, "range grids"), (value) => {
        const grid = record(value, "range grid");
        assertSafeInteger(grid.row, "range row");
        assertSafeInteger(grid.col, "range column");
        const tile: TilePosition = [grid.row, grid.col];
        const key = `${tile[0]},${tile[1]}`;
        if (seen.has(key)) {
            throw new RangeError("range must not contain duplicate tiles");
        }

        seen.add(key);

        return tile;
    });
}
