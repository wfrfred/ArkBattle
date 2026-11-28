// Contract: [geometry](../../../docs/architecture/geometry.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { Tile, World } from "../../../dist/core/geometry/coordinate.js";

test("world coordinates round ties to even on each axis and tiles rotate around the origin", () => {
    const position = [2.5, 3.5];
    const tile = World.toTile(position);
    assert.deepEqual(tile, [2, 4]);
    assert.deepEqual(Tile.center(tile), [2, 4]);
    for (const [direction, expected] of [
        ["RIGHT", [2, 4]], ["UP", [-4, 2]],
        ["LEFT", [-2, -4]], ["DOWN", [4, -2]],
    ]) {
        assert.deepEqual(Tile.rotate(tile, direction), expected);
    }
});
