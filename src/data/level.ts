import { assertNonnegativeSafeInteger, assertSafeInteger } from "../core/common/assert.js";
import { denseArray, record } from "./json.js";

export function parseLevel(value: unknown): Readonly<Record<string, unknown>> {
    return record(value, "level");
}

export function parseGridPosition(value: unknown, name: string): readonly [number, number] {
    const source = record(value, name);
    assertSafeInteger(source.col, `${name}.col`);
    assertSafeInteger(source.row, `${name}.row`);

    return [source.col, source.row];
}

// Native map rows are stored top-to-bottom. Leave their ordering unchanged.
export function parseMapGrid(value: unknown, tileCount: number): readonly (readonly number[])[] {
    const matrix = denseArray(value, "map matrix");
    if (matrix.length === 0) {
        throw new RangeError("map matrix must have at least one row");
    }

    const columns = denseArray(matrix[0], "map row").length;
    if (columns === 0) {
        throw new RangeError("map matrix must have at least one column");
    }

    return matrix.map((value) => {
        const row = denseArray(value, "map row");
        if (row.length !== columns) {
            throw new RangeError("map matrix must be rectangular");
        }

        return row.map((index) => {
            assertNonnegativeSafeInteger(index, "tile definition index");

            if (index >= tileCount) {
                throw new RangeError(`invalid tile definition index ${index}`);
            }

            return index;
        });
    });
}
