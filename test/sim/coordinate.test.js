import { test } from "node:test";
import assert from "node:assert/strict";
import { Tile, World } from "../../dist/core/geometry/coordinate.js";

test("world and tile coordinates swap axes, round ties to even and rotate around the origin", () => {
    const position = [2.5, 3.5];
    const tile = World.toTile(position);
    assert.deepEqual(tile, [4, 2]);
    assert.deepEqual(World.toTile([-0.5, -1.5]), [-2, 0]);
    assert.deepEqual(World.toTile([0.49, 0.51]), [1, 0]);
    assert.deepEqual(Tile.center(tile), [2, 4]);
    for (const [direction, expected] of [
        ["RIGHT", [4, 2]], ["UP", [2, -4]],
        ["LEFT", [-4, -2]], ["DOWN", [-2, 4]],
    ]) {
        assert.deepEqual(Tile.rotate(tile, direction), expected);
    }
    assert.equal(Tile.is([0.5, 1]), false);
});
