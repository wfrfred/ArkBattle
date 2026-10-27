import { snapshot } from "../helpers/snapshot.js";
import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal, hole, infection, mire as mireTerrain } from "../../dist/content/terrain/definition.js";
import { unitsAt } from "../helpers/battlefield.js";
import * as route from "../../dist/core/unit/capability/route/operations.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/operations.js";
import * as units from "../../dist/core/unit/query.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { create as createField } from "../../dist/core/battlefield/state.js";
import * as blocking from "../../dist/core/battle/blocking/operations.js";
import { blockedIds, fixture as blockingFixture } from "../helpers/blocking.js";
import { fixtureBattle } from "../helpers/unit.js";
import { Effects } from "../../dist/core/unit/effect/effects.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { create as createMap, get } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { create as projectStaticNavigationMap } from "../../dist/core/battlefield/map/navigation.js";
import { applyUnitChanges, maintainFully } from "../helpers/battlefield-projection.js";
import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { create as createNavigation, setOverlay, removeOverlay } from "../../dist/core/battlefield/navigation/state.js";
import { parseBattlefieldMap } from "../../dist/data/arknights/map.js";
import { parseRouteDefinition } from "../../dist/data/arknights/route.js";
import { initialize as initializeRoutedUnit } from "../../dist/core/battle/creation/routed-unit.js";
import { initialize } from "../helpers/unit.js";
import * as blockable from "../../dist/core/unit/capability/blocking/blockable.js";
import { setRule as setBlockerRule } from "../../dist/core/unit/capability/blocking/blocker.js";
import { build } from "../../dist/core/battlefield/navigation/field.js";
import * as contribution from "../../dist/core/unit/contribution/contribution.js";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";

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
  assert.deepEqual(Object.keys(field.nodes[0]).sort(), ['distance', 'next']);
  assert.equal(Object.hasOwn(field, 'map'), false);
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


const battlefieldUnit = (id, position) => ({ hooks: [],
  effects:Effects.empty(), id, definition: Object.freeze({ id: `battlefield_unit_${id}` }), position: Object.freeze([...position]),
});


function projectionFacts(state) {
  const definitionFacts = ({ initialize, start, step, onEnd, ...definition }) => definition;
  const ruleFacts = (unit, rules) => rules.map(rule => ({ id: rule.id, allows: rule.allows(unit) }));
  return { ...state, navigation: { ...state.navigation, baseline: { WALK: { ...state.navigation.baseline.WALK }, FLY: { ...state.navigation.baseline.FLY } } }, projectiles: state.projectiles.values().toArray(), units: new Map([...state.units].map(([id, unit]) => [
    id, { ...unit, effects: unit.effects.toJSON(), definition: unit.definition.action === undefined
      ? unit.definition
      : { ...unit.definition, action: definitionFacts(unit.definition.action) },
      ...(unit.action === undefined ? {} : { action: { ...unit.action,
        actions: new Map(unit.action.actions.values().map(current => [current.definition.id, {
          ...current, definition: definitionFacts(current.definition),
        }])),
      } }),
      ...(unit.blocker === undefined ? {} : { blocker: { ...unit.blocker,
        rules: ruleFacts(unit, unit.blocker.rules),
      } }),
      ...(unit.blockable === undefined ? {} : { blockable: { ...unit.blockable,
        rules: ruleFacts(unit, unit.blockable.rules),
      } }),
    },
  ])) };
}


function projectionSnapshot(state) {
  const { map, ...facts } = projectionFacts(state);
  const mapFacts = {
    rows: map.rows,
    columns: map.columns,
    tiles: Array.from({ length: map.tiles.size }, (_, index) => map.tiles.read(index, tile => ({
      ...tile,
      terrain: { params: tile.definition.terrain.params },
    }))),
    markers: map.markers,
    blockEdges: map.blockEdges,
  };
  return { state: { ...snapshot(facts), map }, mapFacts: snapshot(mapFacts) };
}


function assertProjectionSnapshot(state, snapshot) {
  assert.equal(state.map, snapshot.state.map);
  assert.equal(state.map.tiles, snapshot.state.map.tiles);
  assert.deepEqual(projectionFacts(state), snapshot.state);
  assert.deepEqual(projectionSnapshot(state).mapFacts, snapshot.mapFacts);
}


function battlefieldProjectionHarness(rows = 2, columns = 5,
  map = createMap(rows, columns, tileEntries(Array.from({ length: rows * columns }, () => coreGround())))) {
  const branches = [applyUnitChanges, maintainFully].map(settle => {
    const baseline = Object.freeze({
      WALK: projectStaticNavigationMap(map, 'WALK', 0),
      FLY: projectStaticNavigationMap(map, 'FLY', 0),
    });
    return { baseline, settle, state: { ...createField(map), navigation: createNavigation(baseline) } };
  });
  const equivalent = () => {
    const [selective, full] = branches.map(branch => branch.state);
    assert.deepEqual(selective, full);
    assert.deepEqual([...selective.units], [...full.units]);
    for (let row = 0; row < map.rows; row++) {
      for (let column = 0; column < map.columns; column++) {
        assert.deepEqual(unitsAt(selective, [row, column]), unitsAt(full, [row, column]));
      }
    }
  };
  const commit = transform => {
    const content = transform(branches[0].state);
    const results = branches.map(branch => {
      const previous = branch.state;
      const snapshot = projectionSnapshot(previous);
      const settled = branch.settle(previous, content);
      assertProjectionSnapshot(previous, snapshot);
      branch.state = settled;
      return settled.occupancy;
    });
    assert.deepEqual(results[0], results[1]);
    equivalent();
    return results[0];
  };
  const reject = (transform, expected) => {
    const content = transform(branches[0].state);
    for (const branch of branches) {
      const previous = branch.state;
      const snapshot = projectionSnapshot(previous);
      assert.throws(() => {
        branch.settle(previous, content);
      }, expected);
      assert.equal(branch.state, previous);
      assertProjectionSnapshot(previous, snapshot);
    }
    equivalent();
  };
  return { branches, commit, reject, equivalent, get state() { return branches[0].state; } };
}


const projectionTile = column => [0, column];

const projectionUnit = (id, position, definition = {}, states = {}) => initialize({
  id, position, definition: Object.freeze({ hooks: [], id: `projection_unit_${id}`, spatialPresence: {}, ...definition }), states,
});


test('core selective projection retains occupancy and route intent while queries read current Unit values', () => {
  const h = battlefieldProjectionHarness();
  const routed = routedEnemyHarness({ speedPerTick: 0.1, checkpoints: [coreMove(4)] });
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[routed.enemy].map(unit => [unit.id, unit])]) }));
  const previous = h.state;
  const progress = previous.units.get(1).route.main;
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[{
    ...state.units.get(1), vitality: { ...state.units.get(1).vitality, hp: 90 },
  }].map(unit => [unit.id, unit])]) }));
  assert.notEqual(h.state.units, previous.units);
  assert.equal(h.state.occupancy, previous.occupancy);
  assert.equal('blockingRelations' in h.state, false);
  assert.equal(h.state.navigation, previous.navigation);
  assert.equal(h.state.units.get(1).route.main, progress);
  assert.equal(unitsAt(h.state, [0, 0])[0].vitality.hp, 90);
  assert.equal(unitsAt(previous, [0, 0])[0].vitality.hp, 100);
  assert.equal(previous.units.get(1).vitality.hp, 100);
});


test('complete battle updates retain or release blocking from the tile blocking fact independently of passability', () => {
  const passableMasks = ['ALL', 'FLY_ONLY', 'WALK_ONLY', 'NONE'];
  const map = createMap(1, 8, tileEntries([true, false].flatMap(meleeBlockable =>
    passableMasks.map(passableMask => coreGround({ meleeBlockable, passableMask })))));
  const blocker = projectionUnit(10, [0, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ALLY' }, blocker: { capacity: 1, geometry: { radius: 1 } },
  });
  const enemy = projectionUnit(11, [0.1, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ENEMY' }, blockable: { volume: 1 },
    layer: { type: 'GROUND' },
  });
  const initial = addUnit(addUnit(createBattleState(createField(map)), blocker), enemy);
  const acquired = blocking.search(initial, units.ref(blocker));
  const entry = acquired.battlefield.units.get(10).blocker.blocked[0];
  assert.deepEqual(blockedIds(acquired), [11]);
  for (let column = 0; column < passableMasks.length; column++) {
    const retained = updateUnit(acquired, [{ ...acquired.battlefield.units.get(10), position: [column, 0] }]);
    assert.equal(retained.battlefield.units.get(10).blocker.blocked[0], entry, passableMasks[column]);
  }

  for (const position of [[4, 0], [5, 0], [6, 0], [7, 0], [-1, 0]]) {
    const changed = updateUnit(acquired, [{ ...acquired.battlefield.units.get(10), position }]);
    assert.deepEqual(blockedIds(changed), []);
    assert.deepEqual(blockedIds(acquired), [11]);
  }
  const hidden = updateUnit(acquired, [{
    ...acquired.battlefield.units.get(10), position: [1e30, 0], spatialPresence: { present: false },
  }]);
  assert.deepEqual(blockedIds(hidden), []);
});


test('selective and full field projection derive current occupancy independently of blocking', () => {
  const h = battlefieldProjectionHarness();
  const rider = projectionUnit(10, [1, 0], {}, {
    spatialPresence: { present: true }, occupancy: { tile: projectionTile(1) },
  });
  const platform = projectionUnit(12, [1, 0], {
    occupancy: { slot: 'SUPPORT', hooks: [] },
  }, { spatialPresence: { present: true }, occupancy: { tile: projectionTile(1) } });
  const registered = h.commit(state => ({ ...state, units: new Map([[10, rider], [12, platform]]) }));
  assert.deepEqual(registered, new Map([[1, { occupant: { id: 10 }, support: { id: 12 } }]]));
  const cleared = h.commit(state => ({ ...state, units: new Map([...state.units, [12, {
    ...state.units.get(12), occupancy: { ...(state.units.get(12)).occupancy, tile: null },
  }]]) }));
  assert.deepEqual(cleared, new Map([[1, { occupant: { id: 10 }, support: null }]]));
  const restored = h.commit(state => ({ ...state, units: new Map([...state.units, [12, platform]]) }));
  assert.deepEqual(restored, new Map([[1, { occupant: { id: 10 }, support: { id: 12 } }]]));
  const removed = h.commit(state => ({ ...state, units: new Map([...state.units].filter(([id]) => id !== 12)) }));
  assert.deepEqual(removed, new Map([[1, { occupant: { id: 10 }, support: null }]]));
  assert.equal('blockingRelations' in h.state, false);
});


test('complete battle updates preserve relation history and release on current eligibility changes', () => {
  const blocker = projectionUnit(10, [1, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ALLY' }, blocker: { capacity: 2, geometry: { radius: 1 } },
  });
  const enemy = projectionUnit(11, [1.1, 0], {
    vitality: { maxHp: 100, defense: 0, resistance: 0 }, allegiance: { side: 'ENEMY' }, blockable: { volume: 1 }, layer: { type: 'GROUND' },
  });
  const acquired = blocking.search(blockingFixture([blocker, enemy]), units.ref(blocker));
  const first = acquired.battlefield.units.get(10).blocker.blocked[0];
  const moved = updateUnit(acquired, [{ ...acquired.battlefield.units.get(11), position: [4, 1] }]);
  assert.equal(moved.battlefield.units.get(10).blocker.blocked[0], first);
  const released = blocking.release(acquired, units.ref(enemy));
  assert.deepEqual(blockedIds(released), []);
  const reacquired = blocking.search(released, units.ref(blocker));
  assert.deepEqual(blockedIds(reacquired), [11]);
  assert.notEqual(reacquired.battlefield.units.get(10).blocker.blocked[0], first);

  const mutations = [
    unit => ({ ...unit, vitality: { ...unit.vitality, hp: 0 } }),
    unit => ({ ...unit, allegiance: { side: 'ALLY' } }),
    unit => ({ ...unit, layer: { type: 'AIR' } }),
    unit => ({ ...unit, blockable: blockable.setVolumeContribution(unit.blockable, { id: 'larger', value: 2 }) }),
    unit => ({ ...unit, blockable: blockable.setRule(unit.blockable, { id: 'unblockable', allows: () => false }) }),
  ];
  for (const mutate of mutations) {
    const changed = updateUnit(acquired, [mutate(acquired.battlefield.units.get(11))]);
    assert.deepEqual(blockedIds(changed), []);
    assert.deepEqual(blockedIds(acquired), [11]);
  }
  for (const blockerState of [
    { ...acquired.battlefield.units.get(10).blocker, capacity: contribution.set([], { id: 'capacity-zero', value: [modifier.create({ finalScaler: 0 })] }) },
    setBlockerRule(acquired.battlefield.units.get(10).blocker, { id: 'cannot-block', allows: () => false }),
  ]) {
    const changed = updateUnit(acquired, [{ ...acquired.battlefield.units.get(10), blocker: blockerState }]);
    assert.deepEqual(blockedIds(changed), []);
  }
});


test('core selective and full projection preserve occupancy and reject bounds and slot conflicts atomically', () => {
  const h = battlefieldProjectionHarness();
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[battlefieldUnit(10, [0, 0])].map(unit => [unit.id, unit])]) }));
  const reserved = projectionUnit(11, [1, 0], {}, { spatialPresence: { present: false },
    occupancy: { tile: projectionTile(1) } });
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[reserved].map(unit => [unit.id, unit])]) }));
  const hiddenField = h.state;
  const occupancy = h.state.occupancy;
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[{
    ...state.units.get(11), position: Object.freeze([1e30, 0]),
  }].map(unit => [unit.id, unit])]) }));
  assert.deepEqual(h.state.units.get(11).position, [1e30, 0]);
  assert.deepEqual(unitsAt(h.state, [0, 1]), []);
  assert.equal(h.state.occupancy, occupancy);
  assert.equal(h.state.occupancy.get(1).occupant.id, 11);
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[{
    ...state.units.get(11), position: Object.freeze([1, 0]), spatialPresence: { present: true },
  }].map(unit => [unit.id, unit])]) }));
  assert.deepEqual(unitsAt(h.state, [0, 1]).map(unit => unit.id), [11]);
  assert.deepEqual(unitsAt(hiddenField, [0, 1]), []);
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[{
    ...state.units.get(11), position: Object.freeze([1e30, 0]), spatialPresence: { present: false },
  }].map(unit => [unit.id, unit])]) }));
  assert.deepEqual(unitsAt(h.state, [0, 1]), []);
  h.reject(state => ({ ...state, units: new Map([...state.units, ...[projectionUnit(12, [2, 0], {}, {
    occupancy: { tile: projectionTile(1) },
  })].map(unit => [unit.id, unit])]) }), /occupancy slot is already occupied/);
  h.reject(state => ({ ...state, units: new Map([...state.units, ...[projectionUnit(12, [2, 0], {}, {
    spatialPresence: { present: false }, occupancy: { tile: projectionTile(99) },
  })].map(unit => [unit.id, unit])]) }), /occupancy tile is outside/);
  h.commit(state => ({ ...state, units: new Map([...state.units, ...[battlefieldUnit(12, [0, 0])].map(unit => [unit.id, unit])]) }));
  const reregistered = h.state.units.get(10);
  h.commit(state => ({ ...state, units: new Map([...state.units].filter(([id]) => id !== 10)) }));
  h.commit(state => ({ ...state, units: new Map([...state.units, [reregistered.id, reregistered]]) }));
  assert.deepEqual([...h.state.units.keys()], [11, 12, 10]);
  assert.deepEqual(unitsAt(h.state, [0, 0]).map(unit => unit.id), [12, 10]);
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
  assert.throws(() => createMap(Number.MAX_SAFE_INTEGER, 2, tileEntries([])), RangeError);
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
