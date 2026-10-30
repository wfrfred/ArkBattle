import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { blockerOf } from "../../dist/core/battle/blocking/query.js";
import { unitsAt } from "../helpers/battlefield.js";
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { create } from '../../dist/core/battlefield/state.js';
import { add as addUnit, update as updateUnit, remove as removeUnit } from '../../dist/core/battlefield/unit.js';
import { create as createMap } from '../../dist/core/battlefield/map/map.js';
import { createTile } from '../helpers/tiles.js';

import { setOverlay, nextPoint } from '../../dist/core/battlefield/navigation/state.js';
import { initialize } from "../helpers/unit.js";
import { ref } from '../../dist/core/unit/query.js';
import { createBattleState } from '../../dist/core/battle/state.js';
import { add as addBattleUnit, update as updateBattleUnit, remove as removeBattleUnit } from '../../dist/core/battle/unit.js';
import { finishBattleEvents } from '../../dist/core/battle/events.js';
import { update as updateTile } from '../../dist/core/battlefield/tile.js';
import { get as getTile } from '../../dist/core/battlefield/map/map.js';

const initial = () => create(createMap(1, 3, tileEntries(Array.from({ length: 3 }, () => createTile({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
  })))));
const unit = (id, position = [1, 0], definition = {}) => initialize({
  id, position, definition: { hooks: [], id: `functional-${id}`, vitality: { maxHp: 100, defense: 0, resistance: 0 }, ...definition },
});

test('field tile update validates runtime movement cost at the mutation boundary', () => {
  const before = initial();
  const tile = getTile(before.map, [0, 1]);

  assert.equal(updateTile(before, [0, 1], tile.state), before);
  assert.throws(() => updateTile(before, [0, 3], tile.state), /outside the map/);
  for (const walkCost of [0, -1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => updateTile(before, [0, 1], { ...tile.state, walkCost }), RangeError);
    assert.equal(getTile(before.map, [0, 1]), tile);
  }

  const state = { ...tile.state, walkCost: 2 };
  const after = updateTile(before, [0, 1], state);
  assert.equal(getTile(after.map, [0, 1]).state, state);
  assert.equal(getTile(after.map, [0, 1]).definition, tile.definition);
  assert.equal(getTile(before.map, [0, 1]).state.walkCost, 1);
  assert.equal(updateTile(after, [0, 1], state), after);
});

test('pure transitions preserve input states and retained versions while allowing independent branches', () => {
  const empty = initial();
  const original = unit(1);
  const registered = addUnit(empty, original);
  const updateHp = hp => ({ ...original, vitality: { ...original.vitality, hp } });
  const left = updateUnit(registered, [updateHp(40)]);
  const right = updateUnit(registered, [updateHp(70)]);

  assert.deepEqual([...registered.units.keys()], [1]);
  assert.deepEqual([...empty.units.keys()], []);
  assert.equal(registered.units.get(1), original, 'stored values are shared by immutable convention');
  assert.equal(registered.units.get(1).vitality.hp, 100);
  assert.equal(left.units.get(1).vitality.hp, 40);
  assert.equal(right.units.get(1).vitality.hp, 70);
  assert.equal(updateUnit(registered, [original]), registered);
});

test('pure field updates expose current tile queries without acquiring blocking relations', () => {
  const blocker = (id, column) => unit(id, [column, 0], {
    allegiance: { side: 'ALLY' }, blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 1 },
  });
  const enemy = unit(20, [1.25, 0], {
    allegiance: { side: 'ENEMY' }, blockable: { volume: 1 }, layer: { type: 'GROUND' },
  });
  const before = [blocker(10, 1), blocker(11, 2), enemy].reduce((field, unit) => addUnit(field, unit), initial());
  const removed = removeUnit(before, ref(before.units.get(10)));

  assert.equal(blockerOf(createBattleState(before), ref(before.units.get(20))), undefined);
  assert.equal(blockerOf(createBattleState(removed), ref(removed.units.get(20))), undefined);
  assert.equal(blockerOf(createBattleState(before), ref(before.units.get(20))), undefined);
  assert.deepEqual(unitsAt(before, [0, 1]).map(unit => unit.id), [10, 20]);
  assert.deepEqual(unitsAt(removed, [0, 1]).map(unit => unit.id), [20]);
  assert.equal('blockingRelations' in before, false);
  assert.equal(removed.units.has(10), false);
});

test('navigation overlays and tile queries follow each returned state version', () => {
  const owner = unit(1, [0, 0]);
  let registered = addUnit(initial(), owner);
  registered = { ...registered, navigation: setOverlay(registered.navigation, 'WALK', {
    id: 7, cells: [[0, 0]], denyPassage: true, denyDepartures: [],
  }) };
  const previous = registered;
  const moved = updateUnit(registered, [{ ...owner, position: [1, 0] }]);
  assert.equal(moved.navigation, registered.navigation);
  const replaced = { ...moved, navigation: setOverlay(moved.navigation, 'WALK', {
    id: 7, cells: [[0, 1]], denyPassage: true, denyDepartures: [],
  }) };
  const next = replaced;

  assert.deepEqual(unitsAt(previous, [0, 0]).map(unit => unit.id), [1]);
  assert.deepEqual(unitsAt(next, [0, 1]).map(unit => unit.id), [1]);
  assert.equal(nextPoint(previous.navigation, 'WALK', [0, 0], [0, 0]), null);
  assert.deepEqual(nextPoint(next.navigation, 'WALK', [0, 0], [0, 0]), [0, 0]);
  assert.deepEqual(nextPoint(previous.navigation, 'WALK', [2, 0], [1, 0]), [1, 0]);
  assert.equal(nextPoint(next.navigation, 'WALK', [2, 0], [1, 0]), null);
  assert.equal(replaced.map, registered.map);
  assert.equal(replaced.navigation.baseline, registered.navigation.baseline);
});

test('battle removal records the current instance independently from final field content', () => {
  const before = createBattleState(initial());
  const temporary = unit(1);
  const registered = addBattleUnit(before, temporary);
  const latest = { ...temporary, vitality: { ...temporary.vitality, hp: 40 } };
  const updated = updateBattleUnit(registered, [latest]);
  const removed = removeBattleUnit(updated, temporary.id, 'SCRIPT');

  assert.deepEqual([...removed.battlefield.units.keys()], []);
  assert.deepEqual([...before.battlefield.units.keys()], []);
  assert.equal(registered.battlefield.units.get(temporary.id), temporary);
  assert.deepEqual(removed.removedUnits, [
    { unitId: temporary.id, reason: 'SCRIPT', unit: { ...latest, lifecycle: 'LEAVING' } },
  ]);
  assert.equal(removeBattleUnit(removed, temporary.id, 'SCRIPT'), removed);
  const { events } = finishBattleEvents(removed.events, removed.removedUnits, 0);
  assert.equal(events[0].type, 'UNIT_REMOVED');
  assert.equal(events[0].unit.vitality.hp, 40);
});
