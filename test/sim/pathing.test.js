


import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal, hole, infection, mire as mireTerrain } from "../../dist/content/terrain/definition.js";

import * as route from "../../dist/core/unit/capability/route/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import * as units from "../../dist/core/unit/query.js";

import { add as addUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";


import { fixtureBattle } from "../helpers/unit.js";

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { create as createMap, get } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { create as projectStaticNavigationMap } from "../../dist/core/battlefield/map/navigation.js";

import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { create as createNavigation, setOverlay, removeOverlay } from "../../dist/core/battlefield/navigation/state.js";
import { parseBattlefieldMap } from "../../dist/data/arknights/map.js";
import { parseRouteDefinition } from "../../dist/data/arknights/route.js";
import { initialize as initializeRoutedUnit } from "../../dist/core/battle/creation/routed-unit.js";
import { initialize } from "../helpers/unit.js";


import { build } from "../../dist/core/battlefield/navigation/field.js";

const fieldCell = (overrides = {}) => ({
  passable: true, cost: 1, departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true }, ...overrides,
});

const fieldMap = (rows, columns, cells) => new NavigationMap(rows, columns, cells);

const fieldQuery = targetTile => targetTile;

const distances = field => field.nodes.map(node => node === null ? -1 : node.distance);


test('core fields charge departing cells and publish only immutable smoothed successors', () => {
  const map = fieldMap(1, 3, [fieldCell({ cost: 7 }), fieldCell({ cost: 3 }), fieldCell({ cost: 1000 })]);
  const target = [0, 2];
  const before = JSON.stringify({ map, target });
  const field = build(map, target);
  assert.deepEqual(distances(field), [10, 3, 0]);
  assert.deepEqual(field.nodes[0].next, [0, 1]);
  assert.equal(field.nodes[2].next, null);
  assert.equal(JSON.stringify({ map, target }), before);
  assert.strictEqual(field.target, target);
  assert.deepEqual(build(map, target), field);
});


test('core fields preserve directed search, target qualification and disconnected regions', () => {
  const map = fieldMap(1, 3, [fieldCell(), fieldCell({ departures: { UP: true, RIGHT: true, DOWN: true, LEFT: false } }), fieldCell()]);
  assert.deepEqual(distances(build(map, [0, 0])), [0, -1, -1]);
  assert.deepEqual(distances(build(map, [0, 2])), [2, 1, 0]);
  const noGoalDepartures = fieldMap(1, 3, [fieldCell(), fieldCell(), fieldCell({ departures: { UP: false, RIGHT: false, DOWN: false, LEFT: false } })]);
  assert.deepEqual(distances(build(noGoalDepartures, [0, 2])), [2, 1, 0]);
  const blocked = fieldMap(1, 3, [fieldCell(), fieldCell({ passable: false }), fieldCell()]);
  assert.deepEqual(build(blocked, [0, 1]).nodes, [null, null, null]);
  assert.deepEqual(distances(build(blocked, [0, 2])), [-1, -1, 0]);
  const bounded = fieldMap(2, 3, Array.from({ length: 6 }, () => fieldCell()));
  for (const target of [[-1, 0], [2, 0], [0, -1], [0, 3], [-1, 3], [1, -1]]) {
    const field = build(bounded, target);
    assert.deepEqual(field.nodes, [null, null, null, null, null, null]);
    assert.deepEqual(field.target, target);
    assert.equal(field.rows, 2);
    assert.equal(field.columns, 3);
    assert.strictEqual(field.target, target);
  }
});


test('core fields retain FIFO UP-RIGHT-DOWN-LEFT ties when smoothing cannot merge the hop', () => {
  const cells = Array.from({ length: 9 }, () => fieldCell());
  cells[0] = fieldCell({ cost: 1000 });
  const field = build(fieldMap(3, 3, cells), [0, 0]);
  assert.equal(field.nodes[4].distance, 2);
  assert.deepEqual(field.nodes[4].next, [1, 0]);
});


test('core smoothing retains the native thin-rectangle and inclusive-endpoint checks', () => {
  const thin = Array.from({ length: 10 }, () => fieldCell());
  thin[5] = fieldCell({ passable: false });
  assert.deepEqual(build(fieldMap(2, 5, thin), [1, 4]).nodes[0].next, [0, 4]);
  const endpoint = fieldMap(1, 3, [fieldCell(), fieldCell(), fieldCell({ departures: { ...fieldCell().departures, RIGHT: false } })]);
  const field = build(endpoint, [0, 2]);
  assert.deepEqual(field.nodes[0].next, [0, 1]);
  assert.deepEqual(distances(field), [2, 1, 0]);
});


test('core smoothing uses the current row-major successor chain without a weighted shortcut budget', () => {
  const moderate = fieldMap(2, 3, [fieldCell(), fieldCell({ cost: 20 }), fieldCell(), fieldCell(), fieldCell(), fieldCell()]);
  const straight = build(moderate, [0, 2]);
  assert.equal(straight.nodes[0].distance, 4);
  assert.deepEqual(straight.nodes[0].next, [0, 2]);
  const cells = Array.from({ length: 16 }, (_, index) => fieldCell({ passable: ![5, 10, 14].includes(index) }));
  assert.deepEqual(build(fieldMap(4, 4, cells), [3, 3]).nodes[13].next, [3, 0]);
  const obstacle = fieldMap(1, 3, [fieldCell(), fieldCell({ cost: 1000 }), fieldCell()]);
  assert.deepEqual(build(obstacle, [0, 2]).nodes[0].next, [0, 1]);
});


const coreGround = (overrides = {}) => createTile({
  heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'MELEE', passableMask: 'ALL',
  terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1, ...overrides,
});

const rawTile = (tileKey, overrides = {}) => ({
  tileKey, heightType: 'LOWLAND', buildableType: 'MELEE', passableMask: 'ALL',
  playerSideMask: 'ALL', blackboard: null, effects: [], ...overrides,
});


test('core battlefield maps retain validated internal coordinates and enforce map constraints', () => {
  const tile = coreGround({ terrain: infection.create({
    damage: 3000, attackBonusRatio: 0.2, attackSpeedBonus: 20, durationTicks: 60,
  }) });
  const markers = [{ type: 'START', position: [0, 0] }];
  const edges = [{ position: [0, 0], direction: 'RIGHT', blockMask: 'WALK_ONLY' }];
  const map = createMap(1, 2, tileEntries([tile, coreGround()]), markers, edges);
  assert.equal(map.tiles.get(0), tile);
  assert.equal(map.tiles.get(0, infection).definition.terrain.params, tile.definition.terrain.params);
  assert.equal(map.markers, markers);
  assert.equal(map.blockEdges, edges);
  assert.equal(map.markers[0].position, markers[0].position);
  assert.equal(map.blockEdges[0].position, edges[0].position);
  assert.equal(map.blockEdges[0].blockMask, 'WALK_ONLY');
  assert.equal(get(map, [0, 2]), undefined);
  assert.throws(() => createMap(1, 2, tileEntries([coreGround(), ,])), RangeError);
  assert.throws(() => createMap(1, 2, tileEntries([coreGround()])), RangeError);
  assert.throws(() => createMap(1, 1, tileEntries([coreGround()]), [{ type: 'START', position: [0, 1] }]), /outside the map/);
  assert.throws(() => createMap(1, 1, tileEntries([coreGround()]), [,]), TypeError);
  assert.throws(() => createMap(1, 1, tileEntries([coreGround()]), [], [,]), TypeError);
  assert.throws(() => createMap(1, 1, tileEntries([coreGround()]), [], [
    { position: [0, 2], direction: 'RIGHT', blockMask: 'ALL' },
  ]), /no endpoint inside/);
});


test('core static navigation projects mode-specific passability, costs and both edge departures', () => {
  const map = createMap(1, 4, tileEntries([
    coreGround({ passableMask: 'WALK_ONLY' }), coreGround({ terrain: hole.create({}), walkCost: 1_000_000 }),
    coreGround(), coreGround({ passableMask: 'FLY_ONLY' }),
  ]), [], [
    { position: [0, 1], direction: 'RIGHT', blockMask: 'WALK_ONLY' },
    { position: [0, -1], direction: 'RIGHT', blockMask: 'ALL' },
  ]);
  const walk = projectStaticNavigationMap(map, 'WALK', 2);
  const fly = projectStaticNavigationMap(map, 'FLY', 2);
  assert.deepEqual(walk.cells.map(cell => cell.cost), [1, 1_000_000, 1, 1]);
  assert.deepEqual(fly.cells.map(cell => cell.cost), [1, 1, 1, 1]);
  assert.deepEqual(walk.cells.map(cell => cell.passable), [true, true, true, false]);
  assert.deepEqual(fly.cells.map(cell => cell.passable), [false, true, true, true]);
  assert.equal(walk.get([0, 1]).departures.RIGHT, false);
  assert.equal(walk.get([0, 2]).departures.LEFT, false);
  assert.equal(fly.get([0, 1]).departures.RIGHT, true);
  assert.deepEqual(distances(build(walk, fieldQuery([0, 2]))), [-1, -1, 0, -1]);
  assert.deepEqual(distances(build(walk, fieldQuery([0, 1]))), [1, 0, -1, -1]);
  assert.deepEqual(distances(build(fly, fieldQuery([0, 3]))), [-1, 2, 1, 0]);
  assert.equal(walk.cells[0].departures.LEFT, false);
  assert.equal(walk.get([0, 0]).departures.UP, true);

});


test('raw battlefield loading flips matrix rows, extracts markers and discards player side metadata', () => {
  const raw = {
    map: [[0, 1], [2, 0]], tiles: [rawTile('tile_road'), rawTile('tile_start'), rawTile('tile_end', { playerSideMask: 'SIDE_B' })],
    blockEdges: [{ pos: { row: 1, col: 0 }, direction: 'RIGHT', blockMask: 'WALK_ONLY' }],
    effects: [], tags: [], layerRects: [],
  };
  const map = parseBattlefieldMap(raw);
  assert.deepEqual(map.markers, [{ type: 'END', position: [0, 0] }, { type: 'START', position: [1, 1] }]);
  assert.ok(map.tiles.values().toArray().every(tile => !Object.hasOwn(tile, 'playerSideMask')));
  assert.equal(projectStaticNavigationMap(map, 'WALK', 0).cells[2].departures.RIGHT, false);
  raw.tiles[2].playerSideMask = 'ALL';
  assert.deepEqual(parseBattlefieldMap(raw), map);
  delete raw.tiles[2].playerSideMask;
  assert.deepEqual(parseBattlefieldMap(raw), map);
  assert.throws(() => parseBattlefieldMap({ ...raw, map: [[0], [0, 1]] }), /rectangular/);
  assert.throws(() => parseBattlefieldMap({ ...raw, map: [[-1]] }), /definition index/);
  assert.throws(() => parseBattlefieldMap({ ...raw, effects: [{}] }), /not supported/);
  assert.throws(() => parseBattlefieldMap({ ...raw, tiles: [rawTile('tile_unknown')], map: [[0]] }), /unsupported tile key/);
});


test('raw tile loading rejects invalid advanced buildable masks', () => {
  for (const advancedBuildableMask of [0.5, 0x1_0000_0000]) {
    assert.throws(() => parseBattlefieldMap({
      map: [[0]], tiles: [rawTile('tile_road', { advancedBuildableMask })], blockEdges: [],
    }), { name: 'RangeError', message: /unsupported advanced buildable mask/ });
  }
});


test('raw tile mechanisms require controller inputs and explicit consumption of other blackboard rules', () => {
  const oneTile = (tile) => ({ map: [[0]], tiles: [tile], blockEdges: [] });
  const mire = { stackIntervalTicks: 1, massThreshold: 3, attackSpeedPerStack: -5, moveSpeedRatioPerStack: -0.1, maxStacks: 5 };
  assert.throws(() => parseBattlefieldMap(oneTile(rawTile('tile_mire'))), /controller parameters/);
  assert.deepEqual(parseBattlefieldMap(oneTile(rawTile('tile_mire')), { mire }).tiles.get(0, mireTerrain).definition.terrain.params, mire);
  assert.throws(() => parseBattlefieldMap(oneTile(rawTile('tile_mire')), { mire: { ...mire, maxStacks: 0 } }), {
    name: 'RangeError', message: 'mire maximum stacks must be a positive safe integer',
  });
  const hand = oneTile(rawTile('tile_achand', { blackboard: [{ key: 'isValidHand', value: 1, valueStr: null }] }));
  assert.throws(() => parseBattlefieldMap(hand), /unconsumed blackboard/);
  const consumed = [];
  parseBattlefieldMap(hand, { consumeTileBlackboard: (context, entry) => {
    consumed.push([context.position, entry.key]);
    return entry.key === 'isValidHand';
  } });
  assert.deepEqual(consumed, [[[0, 0], 'isValidHand']]);
});


const coreMove = column => ({ type: 'MOVE', position: [0, column], offset: [0, 0] });


function routedEnemyHarness({ speedPerTick = 0.1, checkpoints = [], routeOverrides = {}, position = [0, 0] } = {}) {
  const configuration = {
    pathMotionMode: 'WALK', startPosition: [0, 0], endPosition: [0, 4], offset: [0, 0],
    requireAllCheckpoints: true, alwaysCheckCurrentPoint: true, checkpoints, ...routeOverrides,
  };
  const enemy = initialize({ id: 1, position, definition: { hooks: [],
    id: 'route-walker', vitality: { maxHp: 100, defense: 0, resistance: 0 }, spatialPresence: {},
    locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: speedPerTick,
      steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } }, route: configuration,
  } });
  let battle = addUnit(fixtureBattle(), enemy);
  const ref = units.ref(enemy);
  let maps = {
    WALK: fieldMap(1, 5, Array.from({ length: 5 }, () => fieldCell())),
    FLY: fieldMap(1, 5, Array.from({ length: 5 }, () => fieldCell())),
  };
  function setNavigation(navigation) {
    battle = { ...battle, battlefield: { ...battle.battlefield, navigation } };
  }
  setNavigation(createNavigation(maps));
  return {
    get enemy() { return units.get(battle, ref); },
    get battle() { return battle; },
    get maps() { return maps; },
    get navigation() { return battle.battlefield.navigation; },
    setMaps(next) { maps = next; setNavigation(createNavigation(maps)); },
    setNavigation,
    displace(position) { battle = updateUnit(battle, [{ ...units.get(battle, ref), position }]); },
    step(multiplier = 1) {
      battle = route.advance(battle, ref);
      const current = units.get(battle, ref);
      if (!route.isCompleted(current.route)) {
        const target = route.movementTarget(battle, ref);
        if (target !== null) battle = locomotion.advance(battle, ref, target, {
          mode: route.pathMotionMode(current.route), speedMultiplier: multiplier,
        });
      }
      const result = units.get(battle, ref);
      battle = { ...battle, tick: battle.tick + 1 };
      return result;
    },
  };
}


test('Route guidance cannot move through an unreachable wall with a large movement budget', () => {
  const h = routedEnemyHarness({ speedPerTick: 10, routeOverrides: { endPosition: [0, 2] } });
  const map = fieldMap(1, 3, [fieldCell(), fieldCell({ passable: false }), fieldCell()]);
  h.setMaps({ WALK: map, FLY: map });
  for (let tick = 0; tick < 3; tick++) h.step();
  assert.deepEqual(h.enemy.position, [0, 0]);
  assert.equal(h.enemy.route.main.phase.type, 'END');
});


test('Route guidance follows visible segments around walls and high-cost intermediate tiles', () => {
  for (const obstacle of [{ passable: false }, { cost: 1000 }]) {
    const cells = Array.from({ length: 6 }, () => fieldCell());
    cells[1] = fieldCell(obstacle);
    const map = fieldMap(2, 3, cells);
    const h = routedEnemyHarness({ speedPerTick: 0.2, routeOverrides: { endPosition: [0, 2] } });
    h.setMaps({ WALK: map, FLY: fieldMap(2, 3, cells.map(cell => ({ ...cell, cost: 1 }))) });
    const positions = [h.enemy.position];
    for (let tick = 0; tick < 100 && !route.isCompleted(h.enemy.route); tick++) {
      h.step(); positions.push(h.enemy.position);
    }
    assert.equal(route.isCompleted(h.enemy.route), true);
    assert.ok(positions.some(position => position[1] >= 0.5));
    for (const position of positions) {
      const column = Math.floor(position[0] + 0.5), row = Math.floor(position[1] + 0.5);
      assert.equal(map.cells[row * map.columns + column].passable, true);
    }
  }
});


test('Route uses the selected motion map and its live overlays without changing the definition', () => {
  for (const mode of ['WALK', 'FLY']) {
    const h = routedEnemyHarness({ checkpoints: [coreMove(4)], routeOverrides: { pathMotionMode: mode } });
    const definition = h.enemy.route.main.definition;
    const original = h.navigation;
    const blocked = setOverlay(original, mode, {
      id: 1, cells: [[0, 1]], denyPassage: true, denyDepartures: [],
    });
    h.setNavigation(blocked);
    h.step();
    assert.deepEqual(h.enemy.position, [0, 0]);
    assert.equal(h.enemy.route.main.definition, definition);
    h.setNavigation(removeOverlay(blocked, mode, { id: 1 }));
    h.step();
    assert.ok(h.enemy.position[0] > 0);
    assert.equal(h.enemy.route.main.definition, definition);
  }
});


test('Route preserves directed departures when choosing a tracking point', () => {
  for (const [from, to, direction] of [
    [[0, 0], [0, 1], 'RIGHT'], [[0, 1], [0, 0], 'LEFT'],
    [[0, 0], [1, 0], 'UP'], [[1, 0], [0, 0], 'DOWN'],
  ]) {
    const rows = Math.max(from[0], to[0]) + 1, columns = Math.max(from[1], to[1]) + 1;
    const cells = Array.from({ length: rows * columns }, () => fieldCell());
    const index = from[0] * columns + from[1];
    cells[index] = fieldCell({ departures: { ...cells[index].departures, [direction]: false } });
    const map = fieldMap(rows, columns, cells);
    const h = routedEnemyHarness({ speedPerTick: 10, position: [from[1], from[0]],
      routeOverrides: { startPosition: from, endPosition: to } });
    h.setMaps({ WALK: map, FLY: map });
    h.step();
    assert.deepEqual(h.enemy.position, [from[1], from[0]]);
    assert.equal(route.isCompleted(h.enemy.route), false);
    const reverse = routedEnemyHarness({ speedPerTick: 10, position: [to[1], to[0]],
      routeOverrides: { startPosition: to, endPosition: from } });
    reverse.setMaps({ WALK: map, FLY: map });
    reverse.step(); reverse.step();
    assert.equal(route.isCompleted(reverse.enemy.route), true);
  }
});


test('Route and Locomotion preserve frozen inputs and share unchanged capability branches', () => {
  const h = routedEnemyHarness({ checkpoints: [coreMove(4)] });
  h.step(0);
  const previous = h.enemy;
  Object.freeze(previous.position);
  Object.freeze(previous.locomotion.velocity);
  Object.freeze(previous.locomotion);
  Object.freeze(previous.route.main.phase);
  Object.freeze(previous.route.main);
  Object.freeze(previous.route);
  Object.freeze(previous);
  const before = JSON.stringify(previous);
  const next = h.step();
  assert.equal(JSON.stringify(previous), before);
  assert.notEqual(next.position, previous.position);
  assert.equal(next.definition, previous.definition);
  assert.equal(next.route, previous.route);
  assert.equal(next.vitality, previous.vitality);
  assert.equal(next.effects, previous.effects);
});


test('Route replays the original teleport and patrol fixtures deterministically', () => {
  const raw = JSON.parse(readFileSync(new URL('../fixtures/arknights/level_act1autochess_h07_02.json', import.meta.url), 'utf8'));
  const map = parseBattlefieldMap(raw.mapData);
  const nav = createNavigation({ WALK: projectStaticNavigationMap(map, 'WALK'), FLY: projectStaticNavigationMap(map, 'FLY') });
  const definition = { hooks: [], spatialPresence: {}, id: 'fixture-route-enemy', vitality: { maxHp: 100, defense: 0, resistance: 0 },
    locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0.1, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } } };
  function run(index, ticks) {
    const initialized = initializeRoutedUnit(fixtureBattle(0, { rngState: 31 }), {
      id: 1, definition, route: parseRouteDefinition(raw.routes[index]),
      timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
    });
    let battle = addUnit({ ...initialized.state, battlefield: { ...initialized.state.battlefield, navigation: nav } }, initialized.value);
    const ref = units.ref(initialized.value);
    const trace = [];
    for (let tick = 0; tick < ticks && !route.isCompleted(units.get(battle, ref).route); tick++) {
      battle = route.advance({ ...battle, tick, events: [] }, ref);
      const target = route.movementTarget(battle, ref);
      if (target !== null) battle = locomotion.advance(battle, ref, target, {
        mode: route.pathMotionMode(units.get(battle, ref).route), speedMultiplier: 1,
      });
      trace.push({ unit: units.get(battle, ref), events: battle.events });
    }
    return { unit: units.get(battle, ref), trace };
  }
  const teleport = run(2, 1800);
  assert.equal(route.isCompleted(teleport.unit.route), true);
  assert.deepEqual(teleport.trace.flatMap(step => step.events.filter(event => event.type === 'ROUTE').map(event => event.signal.type)), ['DISAPPEAR', 'APPEAR_AT_POS']);
  assert.ok(teleport.trace.filter(step => !step.unit.spatialPresence.present).length >= 90);
  assert.deepEqual(run(2, 1800), teleport);
  const patrol = run(6, 500);
  assert.equal(route.isCompleted(patrol.unit.route), false);
  assert.ok(new Set(patrol.trace.map(step => step.unit.route.main.phase.index)).size >= 3);
});
