// Contract: [geometry](../../../docs/architecture/geometry.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromTiles } from '../../../dist/core/geometry/range.js';
import { contains, overlaps } from '../../../dist/core/geometry/intersection.js';

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
});

test('capsule range queries use the rounded cap and include point and shape tangency', () => {
  const horizontal = { type: 'CAPSULE', offset: [1, 1], radius: 0.5, halfLength: 1, axis: 'X' };
  const vertical = { type: 'CAPSULE', offset: [0, 0], radius: 0.25, halfLength: 0.5, axis: 'Y' };
  const circle = { type: 'CIRCLE', offset: [0, 0], radius: 0.25 };
  const box = { type: 'BOX', offset: [0, 0], halfExtents: [0.25, 0.25] };
  const range = [horizontal];
  const origin = [0, 0];

  assert.equal(contains(range, origin, [2.5, 1]), true);
  assert.equal(contains(range, origin, [2.5, 1.5]), false);
  assert.equal(overlaps(range, origin, circle, [2.75, 1]), true);
  assert.equal(overlaps(range, origin, box, [1, 1.75]), true);
  assert.equal(overlaps(range, origin, box, [1, 1.76]), false);
  assert.equal(overlaps([vertical], [2.75, 1.5], horizontal, origin), true);
  assert.equal(overlaps([vertical], [2.76, 1.5], horizontal, origin), false);
});

test('tile-derived ranges combine separated cells around a continuous source position', () => {
  const source = [0.25, 0.25];
  const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.125 };
  const range = fromTiles([[1, 0], [3, 0]], 'UP');
  assert.equal(overlaps(range, source, hit, [0.25, 1.875]), true);
  assert.equal(overlaps(range, source, hit, [0.25, 2.25]), false);
  assert.equal(contains(range, source, [0.25, 3.25]), true);
});
