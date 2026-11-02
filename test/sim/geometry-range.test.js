import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateShape } from '../../dist/core/geometry/shape.js';
import { fromTiles } from '../../dist/core/geometry/range.js';
import { contains, overlaps } from '../../dist/core/geometry/intersection.js';
import { initialize } from '../helpers/unit.js';

test('shape validation and unit initialization reject invalid numeric hitbox values', () => {
  const invalid = [
    { type: 'CIRCLE', offset: [NaN, 0], radius: 1 },
    { type: 'CIRCLE', offset: [0, Infinity], radius: 1 },
    { type: 'CIRCLE', offset: [0, 0], radius: -1 },
    { type: 'CIRCLE', offset: [0, 0], radius: Infinity },
    { type: 'BOX', offset: [0, 0], halfExtents: [1, -1] },
    { type: 'BOX', offset: [0, 0], halfExtents: [NaN, 1] },
    { type: 'BOX', offset: [0, 0], halfExtents: [1, Infinity] },
  ];
  for (const shape of invalid) {
    assert.throws(() => validateShape(shape), RangeError);
    assert.throws(() => initialize({ id: 1, position: [0, 0],
      definition: { hooks: [], id: 'invalid_hitbox', hitbox: { shape } },
    }), RangeError);
  }
});

test('ranges include tangent contacts and exclude circle-box corner gaps', () => {
  const circle = radius => ({ type: 'CIRCLE', offset: [0, 0], radius });
  const box = (halfWidth, halfHeight) => ({ type: 'BOX', offset: [0, 0], halfExtents: [halfWidth, halfHeight] });
  assert.equal(overlaps([circle(1)], [0, 0], circle(0.25), [1.25, 0]), true);
  assert.equal(overlaps([circle(1)], [0, 0], circle(0.25), [1.251, 0]), false);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], circle(0.625), [0.875, 1]), true);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], circle(0.625), [1, 1]), false);
  assert.equal(overlaps([circle(0.625)], [1, 1], box(0.5, 0.5), [0, 0]), false);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], box(0.25, 0.25), [0.75, 0.75]), true);
  assert.equal(overlaps([box(0.5, 0.5)], [0, 0], box(0.25, 0.25), [0.751, 0.75]), false);
  assert.equal(overlaps([circle(1)], [0, 0], {
    type: 'CIRCLE', offset: [-3, 0], radius: 0.125,
  }, [4, 0]), true);
  assert.equal(contains([{ type: 'CIRCLE', offset: [0.5, -0.5], radius: 1 }],
    [2, 3], [3.5, 2.5]), true);
  assert.equal(contains([box(0.5, 0.5)], [2, 3], [2.5, 3.5]), true);
});

test('tile-derived ranges rotate all four directions around continuous source positions', () => {
  const source = [0.25, 0.25];
  const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.125 };
  for (const [direction, axis] of [['RIGHT', [1, 0]], ['UP', [0, 1]], ['LEFT', [-1, 0]], ['DOWN', [0, -1]]]) {
    const range = fromTiles([[0, 1], [0, 3]], direction);
    const at = distance => source.map((value, index) => value + axis[index] * distance);
    assert.equal(overlaps(range, source, hit, at(1.625)), true, `${direction}: tangent`);
    assert.equal(overlaps(range, source, hit, at(1.626)), false, `${direction}: beyond edge`);
    assert.equal(overlaps(range, source, hit, at(2)), false, `${direction}: gap in union`);
    assert.equal(contains(range, source, at(3)), true, `${direction}: second box`);
  }
  const originCell = fromTiles([[0, 0]], 'RIGHT');
  assert.equal(overlaps(originCell, source, hit, [0.875, 0.25]), true);
  assert.equal(overlaps(originCell, [0, 0], hit, [0.875, 0.25]), false);
  assert.equal(contains(originCell, source, [0.75, 0.25]), true);
  assert.equal(contains(originCell, [0, 0], [0.75, 0.25]), false);
});
