import { test } from "node:test";
import assert from "node:assert/strict";
import * as coordinates from "../../dist/core/geometry/coordinate.js";

const { Tile, World } = coordinates;


test("tile guards require safe integer coordinates", () => {
    for (const value of [null, {}, "1,2", [], [1], [1, 2, 3], [, 2], [1, ,], [NaN, 0], [0, Infinity], ["1", 2],
        [0.25, -1.5]]) {
        assert.equal(Tile.is(value), false);
    }
});


test("tile conversion preserves inputs, row-column order, and four-direction rotation", () => {
    const position = Object.freeze([2, 3]);

    assert.deepEqual(Tile.center(position), [3, 2]);
    for (const [direction, expected] of [
        ["RIGHT", [2, 3]],
        ["UP", [3, -2]],
        ["LEFT", [-2, -3]],
        ["DOWN", [-3, 2]],
    ]) {
        const rotated = Tile.rotate(position, direction);
        assert.deepEqual(rotated, expected);
        assert.notEqual(rotated, position);
    }
    assert.deepEqual(position, [2, 3]);
});

test("world-to-tile conversion keeps ties-to-even rounding and swapped axes", () => {
    assert.deepEqual(World.toTile([0.5, 1.5]), [2, 0]);
    assert.deepEqual(World.toTile([2.5, 3.5]), [4, 2]);
    assert.deepEqual(World.toTile([-0.5, -1.5]), [-2, 0]);
    assert.deepEqual(World.toTile([-2.5, -3.5]), [-4, -2]);
    assert.deepEqual(World.toTile([0.49, 0.51]), [1, 0]);
    assert.deepEqual(World.toTile([-0.49, -0.51]), [-1, 0]);
    assert.deepEqual(World.toTile([-0, -0]), [-0, -0]);
    assert.deepEqual(Tile.center([-0, 2]), [2, -0]);
});
