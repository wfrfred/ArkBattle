import { assertSafeInteger } from "../core/common/assert.js";
import type { TilePosition } from "../core/geometry/coordinate.js";
import { denseArray, nonemptyString, record } from "./json.js";

export function parseRange(value: unknown, id: unknown): readonly TilePosition[] {
    const key = nonemptyString(id, "range identity");
    const source = record(record(value, "range table")[key], `range ${key}`);
    if (source.id !== key || source.direction !== 1) {
        throw new TypeError("range must use its matching identity and default direction");
    }

    const seen = new Set<string>();

    return Array.from(denseArray(source.grids, "range grids"), (value) => {
        const grid = record(value, "range grid");
        assertSafeInteger(grid.row, "range row");
        assertSafeInteger(grid.col, "range column");
        const tile: TilePosition = [grid.col, grid.row];
        const key = `${tile[0]},${tile[1]}`;
        if (seen.has(key)) {
            throw new RangeError("range must not contain duplicate tiles");
        }

        seen.add(key);

        return tile;
    });
}
