import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Map, hash } from '../../dist/core/battlefield/navigation/map.js';
import { apply } from '../../dist/core/battlefield/navigation/overlay.js';

const cell = (overrides = {}) => ({
  passable: true, cost: 1,
  departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
  ...overrides,
});
const map = (cells = Array.from({ length: 4 }, () => cell()), rows = 2, columns = 2) => new Map(rows, columns, cells);
const overlay = (id, overrides = {}) => ({
  id, cells: [[0, 1]], denyPassage: false, denyDepartures: [], ...overrides,
});

test('navigation maps retain readonly cell references and compare their full contents', () => {
  const cells = Array.from({ length: 4 }, () => cell());
  const first = map(cells);
  const equal = map();
  const initialHash = hash(first);
  assert.equal(first.equals(equal), true);
  assert.equal(first.equals(first), true);
  assert.equal(hash(equal), initialHash);
  assert.equal(first.cells, cells);
  assert.equal(first.cells[0], cells[0]);
  assert.equal(first.cells[0].departures, cells[0].departures);
  assert.equal(first.contains([0, 0]), true);
  assert.equal(first.contains([-1, 0]), false);
  assert.equal(first.contains([2, 0]), false);
  assert.equal(first.get([0, 1]), first.cells[1]);
  assert.equal(first.get([0, 2]), undefined);
});

test('navigation hashes depend on dimensions, cell positions and every cell property', () => {
  const original = map();
  const changed = [
    ['passability', map([cell({ passable: false }), cell(), cell(), cell()])],
    ['cost', map([cell({ cost: 2 }), cell(), cell(), cell()])],
    ['dimensions', map(undefined, 1, 4)],
    ...['UP', 'RIGHT', 'DOWN', 'LEFT'].map(direction => [
      `${direction} departure`, map([cell({ departures: { ...cell().departures, [direction]: false } }), cell(), cell(), cell()]),
    ]),
  ];
  assert.ok(Number.isInteger(hash(original)));
  for (const [property, other] of changed) {
    assert.equal(original.equals(other), false, property);
    assert.equal(other.equals(original), false, property);
    assert.notEqual(hash(original), hash(other), property);
  }
  const atStart = map([cell({ cost: 7 }), cell(), cell(), cell()]);
  const atEnd = map([cell(), cell(), cell(), cell({ cost: 7 })]);
  assert.equal(atStart.equals(atEnd), false);
  assert.notEqual(hash(atStart), hash(atEnd));
});

test('overlay application combines restrictions independently of identity and order', () => {
  const base = map();
  const overlays = [
    overlay(1, { cost: 17 }),
    overlay(2, { denyPassage: true, denyDepartures: ['LEFT'] }),
    overlay(3, { cost: 3, denyDepartures: ['UP'] }),
  ];
  const before = JSON.stringify({ base, overlays });
  const first = apply(base, overlays);
  const reordered = apply(base, [...overlays].reverse());
  const renamed = apply(base, overlays.map((value, index) => ({ ...value, id: 100 + index })));
  const duplicated = apply(base, [...overlays, ...overlays]);
  assert.equal(first.equals(reordered), true);
  assert.equal(first.equals(renamed), true);
  assert.equal(first.equals(duplicated), true);
  assert.equal(hash(first), hash(reordered));
  assert.deepEqual(first.cells[1], cell({ passable: false, cost: 17, departures: { UP: false, RIGHT: true, DOWN: true, LEFT: false } }));
  assert.equal(JSON.stringify({ base, overlays }), before);
  assert.equal(apply(base, []).equals(base), true);
  assert.equal(base.cells[1].cost, 1);
});

test('overlay application clips cells and never lifts baseline restrictions', () => {
  const base = map([cell({ passable: false, cost: 10, departures: { ...cell().departures, RIGHT: false } }), cell(), cell(), cell()]);
  const result = apply(base, [overlay(1, { cells: [[-1, 0], [0, 0], [9, 9]], cost: 3 })]);
  assert.equal(result.equals(base), true);
});
