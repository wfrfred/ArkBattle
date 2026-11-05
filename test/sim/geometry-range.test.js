import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateShape } from '../../dist/core/geometry/shape.js';
import { fromTiles } from '../../dist/core/geometry/range.js';
import { contains, overlaps } from '../../dist/core/geometry/intersection.js';

test('shape input rejects a negative radius', () => {
  assert.throws(() => validateShape({ type: 'CIRCLE', offset: [0, 0], radius: -1 }), RangeError);
});

test('ranges include tangent contacts and exclude circle-box corner gaps', () => {
  const circle = radius => ({ type: 'CIRCLE', offset: [0, 0], radius });
  const box = (halfWidth, halfHeight) => ({ type: 'BOX', offset: [0, 0], halfExtents: [halfWidth, halfHeight] });
  assert.equal(overlaps([circle(1)], [0, 0], circle(0.25), [1.25, 0]), true);
  assert.equal(overlaps([circle(1)], [0, 0], circle(0.25), [1.251, 0]), false);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], circle(0.625), [0.875, 1]), true);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], circle(0.625), [1, 1]), false);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], box(0.25, 0.25), [0.75, 0.75]), true);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], box(0.25, 0.25), [0.751, 0.75]), false);
  assert.equal(overlaps([circle(1)], [0, 0], {
    type: 'CIRCLE', offset: [-3, 0], radius: 0.125,
  }, [4, 0]), true);
  assert.equal(contains([{ type: 'CIRCLE', offset: [0.5, -0.5], radius: 1 }],
    [2, 3], [3.5, 2.5]), true);
  assert.equal(contains([box(0.5, 0.5)], [2, 3], [2.5, 3.5]), true);
});

test('tile-derived ranges combine separated cells around a continuous source position', () => {
  const source = [0.25, 0.25];
  const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.125 };
  const range = fromTiles([[0, 1], [0, 3]], 'UP');
  assert.equal(overlaps(range, source, hit, [0.25, 1.875]), true);
  assert.equal(overlaps(range, source, hit, [0.25, 2.25]), false);
  assert.equal(contains(range, source, [0.25, 3.25]), true);
});
