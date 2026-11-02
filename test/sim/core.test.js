
import * as conditions from "../../dist/content/terrain/condition.js";

import { createTile } from "../helpers/tiles.js";
import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal, hole, deepsea } from "../../dist/content/terrain/definition.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";

import { unitsAt } from "../helpers/battlefield.js";

import { damage as damageTargeting } from "../helpers/targeting.js";
import { fixtureBattle } from "../helpers/unit.js";
import { actionCapability } from "../helpers/actions.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";
import { Effects } from "../../dist/core/unit/effect/effects.js";
import { test } from "node:test";
import assert from "node:assert/strict";


import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createFieldState } from "../../dist/core/battlefield/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battlefield/unit.js";
import { addUnits } from "../helpers/battlefield.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { replace as updateBattleUnit, remove as removeBattleUnit } from "../../dist/core/battle/unit.js";
import { hasSpatialPresence, isSpatiallyPresent } from "../../dist/core/unit/capability/presence/capability.js";
import { initialize } from "../helpers/unit.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import { baseUnit } from "../helpers/unit.js";
import { initialize as initializeVitalityState } from "../../dist/core/unit/capability/vitality/capability.js";

import { areHostile } from "../../dist/core/unit/capability/allegiance/capability.js";


import { validateShape } from "../../dist/core/geometry/shape.js";
import { fromTiles } from "../../dist/core/geometry/range.js";
import { contains, overlaps } from "../../dist/core/geometry/intersection.js";


import { createCardDefinition, previewPlacement } from "../helpers/deployable.js";

const presenceBattlefield = () => createFieldState(createMap(1, 5, tileEntries(Array.from({ length: 5 }, () => ({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'MELEE', passableMask: 'ALL',
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
  })))));


const presenceUnit = (id, position) => {
  const definition = Object.freeze({ hooks: [], id: `presence_${id}`, vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }), spatialPresence: Object.freeze({}) });
  return initializeVitalityState(fixtureBattle(0), baseUnit(definition, {
    id, position: Object.freeze(position), spatialPresence: { present: true },
  })).value;
};


test('core spatial presence preserves earlier unit values while removing only spatial membership', () => {
  let runtime = presenceBattlefield();
  const unit = presenceUnit(1, [2, 0]);
  const bare = { effects:Effects.empty(), id: 2, definition: Object.freeze({ hooks: [], id: 'bare' }), position: Object.freeze([2, 0]) };
  assert.equal(hasSpatialPresence(unit), true);
  assert.equal(hasSpatialPresence(bare), false);
  assert.equal(isSpatiallyPresent(bare), true);
  runtime = addUnits(runtime, [unit, bare]);
  const baseline = runtime.navigation;
  const hidden = { ...runtime.units.get(1), spatialPresence: { present: false } };
  assert.equal(runtime.units.get(1).spatialPresence.present, true);
  runtime = updateUnit(runtime, [hidden]);
  assert.deepEqual([...runtime.units.keys()], [1, 2]);
  assert.deepEqual(unitsAt(runtime, [0, 2]).map(unit => unit.id), [2]);
  assert.equal(runtime.units.get(1).definition, hidden.definition);
  assert.equal(runtime.units.get(1).vitality.hp, 100);
  assert.equal(runtime.navigation, baseline);
  const restored = { ...runtime.units.get(1), spatialPresence: { present: true } };
  assert.equal(runtime.units.get(1).spatialPresence.present, false);
  runtime = updateUnit(runtime, [restored]);
  assert.deepEqual(unitsAt(runtime, [0, 2]).map(unit => unit.id), [1, 2]);
});


test('core removal facts retain the latest leaving state while preserving battlefield snapshots', () => {
  let runtime = presenceBattlefield();
  const unit = presenceUnit(1, [2, 0]);
  runtime = addUnit(runtime, unit);
  const retained = runtime;
  const snapshot = runtime.units.get(1);
  assert.equal(snapshot.vitality, unit.vitality);
  assert.equal(snapshot.spatialPresence, unit.spatialPresence);
  assert.deepEqual(retained.units.get(1), unit);
  assert.equal(unit.vitality.hp, 100);
  assert.equal(unit.spatialPresence.present, true);
  const updated = { ...runtime.units.get(1), position: [3, 0], vitality: {...runtime.units.get(1).vitality, hp: 20} };
  const removed = removeBattleUnit(updateBattleUnit(createBattleState(runtime), [updated]), 1, 'DEATH');
  runtime = removed.battlefield;
  assert.deepEqual(removed.removedUnits, [{ unitId: 1, reason: 'DEATH', unit: {
    ...updated, lifecycle: 'LEAVING', position: Object.freeze([3, 0]),
  } }]);
  assert.equal(removed.removedUnits[0].unit.definition, unit.definition);
  assert.equal(removed.removedUnits[0].unit.vitality, updated.vitality);
  assert.equal(removed.removedUnits[0].unit.position, updated.position);
  assert.deepEqual([...runtime.units.keys()], []);
  assert.equal(retained.units.get(1), unit);
  assert.equal(removed.removedUnits[0].unit.vitality.hp, 20);
});


test('Unit initialization applies an explicit tile without changing the shared definition', () => {
  const tile = [0, 1];
  const input = { id: 0, definition: { hooks: [], id: 'occupant', occupancy: { slot: 'OCCUPANT' } }, position: [0, 0], initial: { occupancy: { tile } } };
  const battle = fixtureBattle(17);
  const placed = initializeUnit(battle, input).value;
  assert.equal(placed.occupancy.tile, tile);
  assert.equal(placed.definition, input.definition);
  assert.equal(placed.position, input.position);

  const nextTile = [0, 2];
  const next = initializeUnit(battle, { ...input, id: 1, initial: { occupancy: { tile: nextTile } } }).value;
  assert.equal(next.occupancy.tile, nextTile);
  assert.deepEqual(placed.occupancy.tile, [0, 1]);
});


const catalogRouteDefinition = () => Object.freeze({
  pathMotionMode: 'WALK', startPosition: [0, 0], endPosition: [0, 4],
  offset: [0, 0], checkpoints: [{ type: 'WAIT', tick: 10 }],
  requireAllCheckpoints: false, alwaysCheckCurrentPoint: true,
});


const catalogDefinition = () => Object.freeze({
  hooks: [],
  route: catalogRouteDefinition(),
  id: 'catalog_unit',
  spatialPresence: Object.freeze({}),
  vitality: Object.freeze({ maxHp: 100, defense: 20, resistance: 10 }),
  locomotion: Object.freeze({
    halfBodyWidth: 0, minSpeed: 0, speed: 0.1,
    steeringParameters: Object.freeze({ steeringFactor: 1, maxSteeringForce: 100 }),
  }),
  allegiance: Object.freeze({ side: 'ALLY' }),
  action: actionCapability(createAttack({ id: 'normal', speed: 100,
    triggerBindingId: 'primary',
    intervalTicks: 3, recoveryTicks: 0, followUps: [],
    targetGroups: [{ id: 'primary',
      operations: [{ type: 'DAMAGE', power: 10, damageType: 'PHYSICAL' }],
      targeting: damageTargeting({ type: 'DAMAGE', scope: { type: 'RANGE', geometry: [
        { type: 'CIRCLE', offset: [0, 0], radius: 1 },
      ] }, canTargetAir: false, includeBlockingRelations: false, preferBlockingRelations: false,
        ignoreTargetFree: false, ignoreInvisible: false, maxTargets: 1 }),
    }],
   })),
  layer: Object.freeze({ type: 'GROUND' }),
  hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.25 } },
  blocker: { layer: "GROUND", rules: [], capacity: 2, radius: 0.7 },
});


test('explicit Unit definitions share passive configuration while current allegiance changes independently', () => {
  const definition = catalogDefinition();
  const unit = initialize({ id: 1, definition, position: [0, 0] });
  assert.equal(unit.definition, definition);
  assert.equal(unit.allegiance, definition.allegiance);
  assert.equal(unit.definition.layer, definition.layer);
  assert.equal(unit.definition.hitbox, definition.hitbox);
  const changed = { ...unit, allegiance: { side: 'ENEMY' } };
  assert.equal(unit.allegiance.side, 'ALLY');
  assert.equal(changed.allegiance.side, 'ENEMY');
  assert.equal(changed.definition.allegiance.side, 'ALLY');
});


test('core allegiance: opposing sides include enemies and neutral units and use current state', () => {
  const units = ['ALLY', 'ENEMY', 'NEUTRAL'].map((side, id) => initialize({
    id, position: [0, 0], definition: { hooks: [], id: `side-${side}`, allegiance: { side } },
  }));
  const expected = [
    [false, true, false],
    [true, false, true],
    [false, true, false],
  ];
  for (const [leftIndex, left] of units.entries()) {
    for (const [rightIndex, right] of units.entries()) {
      assert.equal(areHostile(left, right), expected[leftIndex][rightIndex],
        `${left.allegiance.side} → ${right.allegiance.side}`);
    }
  }
  const changed = { ...units[0], allegiance: { side: 'ENEMY' } };
  assert.equal(areHostile(changed, units[2]), true);
  assert.equal(areHostile(units[0], units[2]), false);
});


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


test('empty ranges never contain a position or overlap a hitbox', () => {
  assert.deepEqual(fromTiles([], 'UP'), []);
  assert.equal(contains([], [0, 0], [0, 0]), false);
  assert.equal(overlaps([], [0, 0], {
    type: 'CIRCLE', offset: [0, 0], radius: 1,
  }, [0, 0]), false);
});


const deploymentTile = (overrides = {}) => createTile({
  heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
  terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1, ...overrides,
});


const deploymentUnit = (id, position, definition, tile, present = true) => {
  const occupancy = { tile };
  return initialize({
    id, position, definition: Object.freeze({ hooks: [], id: `deployment_${id}`, ...definition }),
    states: { occupancy, spatialPresence: { present } },
  });
};


test('core deployment uses buildability and terrain independently of navigation passability', () => {
  const map = createMap(1, 6, tileEntries([
    deploymentTile({ buildableType: 'MELEE' }),
    deploymentTile({ buildableType: 'RANGED', heightType: 'HIGHLAND', meleeBlockable: false }),
    deploymentTile({ passableMask: 'FLY_ONLY' }),
    deploymentTile({ buildableType: 'NONE' }),
    deploymentTile({ terrain: hole.create({}), walkCost: 1_000_000, buildableType: 'NONE' }),
    deploymentTile({ advancedBuildableMask: 2, terrain: deepsea.create({
      damage: 30, attackSpeedModifier: -60, moveSpeedMultiplier: 0.6,
    }) }),
  ]));
  const runtime = createFieldState(map);
  const query = (type, column) => previewPlacement(runtime,
    createCardDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: type }), [0, column]);
  for (const [type, column, allowed] of [
    ['MELEE', 0, true], ['RANGED', 0, false], ['ALL', 0, true],
    ['MELEE', 1, false], ['RANGED', 1, true], ['ALL', 1, true],
    ['MELEE', 2, true], ['RANGED', 2, true],
  ]) {
    assert.deepEqual(query(type, column), allowed
      ? { type: 'ALLOWED' }
      : { type: 'REJECTED', reason: 'RULE' });
  }
  assert.equal(runtime.navigation.baseline.WALK.cells[2].passable, false);
  for (const [column, reason] of [[3, 'RULE'], [4, 'RULE'],
    [5, 'RULE'], [6, 'OUTSIDE_MAP'], [-1, 'OUTSIDE_MAP']]) {
    assert.deepEqual(query('ALL', column), { type: 'REJECTED', reason });
  }
  assert.deepEqual(previewPlacement(runtime, createCardDefinition({ cost: 0, redeployTicks: 0, slots: 1, placement: 'ALL', allowedSiteConditions: [conditions.deepsea] }), [0, 5]), { type: 'ALLOWED' });
  assert.deepEqual(previewPlacement(runtime, createCardDefinition({ cost: 0, redeployTicks: 0, slots: 1, placement: 'ALL', allowedSiteConditions: [conditions.normal, conditions.deepsea] }), [0, 5]), { type: 'ALLOWED' });
});


test('core occupancy tile is independent of spatial presence and geometric membership', () => {
  let runtime = createFieldState(createMap(1, 4,
    tileEntries(Array.from({ length: 4 }, () => deploymentTile()))));
  const hidden = deploymentUnit(1, [1, 0], { occupancy: { slot: 'OCCUPANT' } }, [0, 1], false);
  const displaced = deploymentUnit(2, [20, 0], { occupancy: { slot: 'OCCUPANT' } }, [0, 2], false);
  const enemy = initialize({ id: 3, definition: { hooks: [], id: 'enemy_without_occupancy' }, position: [1, 0] });
  runtime = addUnits(runtime, [hidden, displaced, enemy]);
  assert.deepEqual(unitsAt(runtime, [0, 1]).map(unit => unit.id), [3]);
  assert.equal(occupancyAt(runtime, [0, 1])?.occupant?.id, 1);
  assert.equal(occupancyAt(runtime, [0, 2])?.occupant?.id, 2);
  const profile = createCardDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: 'ALL' });
  for (const tile of [[0, 1], [0, 2]]) {
    assert.deepEqual(previewPlacement(runtime, profile, tile),
      { type: 'REJECTED', reason: 'OCCUPIED' });
  }

  const occupancy = runtime.occupancy;
  runtime = updateUnit(runtime, [{ ...runtime.units.get(1), spatialPresence: { present: true } }]);
  assert.equal(runtime.occupancy, occupancy);
  assert.deepEqual(unitsAt(runtime, [0, 1]).map(unit => unit.id), [1, 3]);
  const original = runtime;
  const previousUnit = original.units.get(1);
  runtime = updateUnit(runtime, [{ ...previousUnit,
    occupancy: { tile: [0, 3] },
  }]);
  assert.equal(occupancyAt(runtime, [0, 1])?.occupant ?? null, null);
  assert.equal(occupancyAt(runtime, [0, 3])?.occupant?.id, 1);
  assert.equal(occupancyAt(runtime, [0, 3])?.support ?? null, null);
  assert.equal(original.units.get(1), previousUnit);
  assert.deepEqual(previousUnit.occupancy.tile, [0, 1]);
  assert.equal(previousUnit.definition.occupancy.slot, 'OCCUPANT');
});
