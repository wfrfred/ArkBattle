import { test } from "node:test";
import assert from "node:assert/strict";
import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { build } from "../../dist/core/battlefield/navigation/field.js";

function dijkstraDistances(map, target) {
  const distance = Array(map.cells.length).fill(Infinity);
  const settled = Array(map.cells.length).fill(false);
  const goal = target[0] * map.columns + target[1];
  if (!map.cells[goal].passable) return distance.map(() => -1);
  distance[goal] = 0;
  while (true) {
    let current = -1;
    for (let index = 0; index < distance.length; index++) {
      if (!settled[index] && distance[index] < (current < 0 ? Infinity : distance[current])) current = index;
    }
    if (current < 0) break;
    settled[current] = true;
    const row = Math.floor(current / map.columns), col = current % map.columns;
    for (let source = 0; source < map.cells.length; source++) {
      const cell = map.cells[source];
      if (!cell.passable || settled[source]) continue;
      const sourceRow = Math.floor(source / map.columns), sourceCol = source % map.columns;
      const dRow = row - sourceRow, dCol = col - sourceCol;
      if (Math.abs(dRow) + Math.abs(dCol) !== 1) continue;
      const direction = dRow === 1 ? 'UP' : dRow === -1 ? 'DOWN' : dCol === 1 ? 'RIGHT' : 'LEFT';
      if (!cell.departures[direction]) continue;
      distance[source] = Math.min(distance[source], distance[current] + cell.cost);
    }
  }
  return distance.map(value => Number.isFinite(value) ? value : -1);
}


function bellmanFordDistances(map, target) {
  const distance = Array(map.cells.length).fill(Infinity);
  const goal = target[0] * map.columns + target[1];
  if (!map.cells[goal].passable) return distance.map(() => -1);
  distance[goal] = 0;
  const edges = [];
  const offsets = { UP: [1, 0], RIGHT: [0, 1], DOWN: [-1, 0], LEFT: [0, -1] };
  for (let from = 0; from < map.cells.length; from++) {
    if (!map.cells[from].passable) continue;
    const row = Math.floor(from / map.columns), col = from % map.columns;
    for (const [direction, [dRow, dCol]] of Object.entries(offsets)) {
      if (!map.cells[from].departures[direction]) continue;
      const nextRow = row + dRow, nextCol = col + dCol;
      if (nextRow < 0 || nextRow >= map.rows || nextCol < 0 || nextCol >= map.columns) continue;
      const to = nextRow * map.columns + nextCol;
      if (map.cells[to].passable) edges.push([from, to, map.cells[from].cost]);
    }
  }
  for (let pass = 0; pass < map.cells.length; pass++) {
    let changed = false;
    for (const [from, to, cost] of edges) {
      if (distance[from] > distance[to] + cost) {
        distance[from] = distance[to] + cost;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return distance.map(value => Number.isFinite(value) ? value : -1);
}


function assertFieldInvariants(field, map, target) {
  const { nodes } = field;
  const targetIndex = target[0] * map.columns + target[1];
  assert.equal(nodes.length, map.rows * map.columns);
  assert.equal(field.rows, map.rows);
  assert.equal(field.columns, map.columns);
  assert.equal(field.target, target);
  assert.equal(nodes.filter(node => node !== null && node.next === null).length, map.cells[targetIndex].passable ? 1 : 0);
  assert.equal(Object.hasOwn(field, 'map'), false);
  if (!map.cells[targetIndex].passable) assert.ok(nodes.every(node => node === null));
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node === null) continue;
    assert.ok(map.cells[index].passable);
    assert.deepEqual(Object.keys(node).sort(), ['distance', 'next']);
    if (node.next === null) {
      assert.equal(index, targetIndex);
      assert.equal(node.distance, 0);
      continue;
    }
    assert.ok(Number.isSafeInteger(node.distance) && node.distance > 0);
    const next = node.next;
    assert.ok(Number.isInteger(next[0]) && next[0] >= 0 && next[0] < map.rows);
    assert.ok(Number.isInteger(next[1]) && next[1] >= 0 && next[1] < map.columns);
    const successor = nodes[next[0] * map.columns + next[1]];
    assert.notEqual(successor, null);
    assert.ok(successor.distance < node.distance);
  }
}


test('core random directed weighted fields agree with independent Dijkstra and Bellman-Ford distances', () => {
  let seed = 0x6e617669;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 0x100000000);
  const costs = [1, 2, 9, 1000, 1_000_000];
  for (let sample = 0; sample < 200; sample++) {
    const rows = 1 + Math.floor(random() * 7), columns = 1 + Math.floor(random() * 8);
    const cells = Array.from({ length: rows * columns }, () => ({
      passable: random() >= 0.2,
      cost: costs[Math.floor(random() * costs.length)],
      departures: { UP: random() >= 0.2, RIGHT: random() >= 0.2, DOWN: random() >= 0.2, LEFT: random() >= 0.2 },
    }));
    const map = new NavigationMap(rows, columns, cells);
    const target = [Math.floor(random() * rows), Math.floor(random() * columns)];
    const input = JSON.stringify({ map, target });
    const field = build(map, target);
    assert.equal(JSON.stringify({ map, target }), input);
    assertFieldInvariants(field, map, target);
    const actual = field.nodes.map(node => node === null ? -1 : node.distance);
    assert.deepEqual(actual, dijkstraDistances(map, target), `Dijkstra sample ${sample}`);
    assert.deepEqual(actual, bellmanFordDistances(map, target), `Bellman-Ford sample ${sample}`);
    assert.deepEqual(build(map, target), field, `repeat build sample ${sample}`);
  }
});
