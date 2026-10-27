import { test } from "node:test";
import assert from "node:assert/strict";
import { Tile as CoreTile, World } from "../../dist/core/geometry/coordinate.js";
import { fromTiles } from "../../dist/core/geometry/range.js";

test('core coordinate conversion uses row/y, col/x and ties-to-even without clipping', () => {
  assert.deepEqual(CoreTile.center([2, 7]), [7, 2]);
  for (const [value, rounded] of [[0.5, 0], [1.5, 2], [-0.5, 0], [-1.5, -2], [2.5, 2], [-2.5, -2]]) {
    assert.deepEqual(World.toTile([value, value]), [rounded, rounded]);
  }
  assert.deepEqual(World.toTile([0.5 - Number.EPSILON, 0.5 + Number.EPSILON]), [1, 0]);
  assert.deepEqual(World.toTile([-8.2, 12.7]), [13, -8]);
});


test('tile-derived ranges preserve input order and rotate into world-coordinate boxes', () => {
  const tiles = [[0, 0], [0, 2], [1, 1]];
  const boxes = offsets => offsets.map(offset => ({ type: 'BOX', offset, halfExtents: [0.5, 0.5] }));
  assert.deepEqual(fromTiles(tiles, 'UP'), boxes([[0, 0], [0, 2], [-1, 1]]));
  assert.deepEqual(fromTiles(tiles, 'LEFT'), boxes([[-0, 0], [-2, 0], [-1, -1]]));
  assert.deepEqual(tiles, [[0, 0], [0, 2], [1, 1]]);
});
