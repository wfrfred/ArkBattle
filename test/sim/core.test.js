import * as conditions from "../../dist/content/terrain/condition.js";
import { changeFieldTile } from "../helpers/tiles.js";
import { createTile } from "../helpers/tiles.js";
import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal, hole, deepsea } from "../../dist/content/terrain/definition.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { relations as blockingRelations } from "../../dist/core/battle/blocking/query.js";
import { unitsAt } from "../helpers/battlefield.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { damage as damageTargeting } from "../helpers/targeting.js";
import { fixtureBattle, fixtureDefinition } from "../helpers/unit.js";
import { Definitions } from "../../dist/core/unit/action/definitions.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";
import { Effects } from "../../dist/core/unit/effect/effects.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createFieldState } from "../../dist/core/battlefield/state.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battlefield/unit.js";
import { addUnits } from "../helpers/battlefield.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { update as updateBattleUnit, remove as removeBattleUnit } from "../../dist/core/battle/unit.js";
import { hasSpatialPresence, isSpatiallyPresent } from "../../dist/core/unit/capability/presence/capability.js";
import { initialize } from "../helpers/unit.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import { hasVitality, initialize as initializeVitalityState } from "../../dist/core/unit/capability/vitality/capability.js";
import { createDefinition as createActionCapabilityDefinition, hasAction } from "../../dist/core/unit/capability/action/capability.js";
import { areHostile, hasAllegiance } from "../../dist/core/unit/capability/allegiance/capability.js";
import { hasBlocker, resolveCapacity } from "../../dist/core/unit/capability/blocking/blocker.js";
import { hasBlockable } from "../../dist/core/unit/capability/blocking/blockable.js";
import { hasHitbox } from "../../dist/core/unit/capability/hitbox/capability.js";
import { hasLayer } from "../../dist/core/unit/capability/layer/capability.js";
import { initialize as initializeTargetableState, hasTargetable, setRestriction, removeRestriction, allowsRestrictions } from "../../dist/core/unit/capability/targetable/capability.js";
import { setHook as setHealingHook, removeHook as removeHealingHook } from "../../dist/core/battle/healing/hook.js";
import { validateShape } from "../../dist/core/geometry/shape.js";
import { fromTiles } from "../../dist/core/geometry/range.js";
import { contains, overlaps } from "../../dist/core/geometry/intersection.js";
import { search as searchBlocking } from "../../dist/core/battle/blocking/operations.js";
import { hasLocomotion } from "../../dist/core/unit/capability/locomotion/capability.js";
import { initialize as initializeRouteState, hasRoute } from "../../dist/core/unit/capability/route/capability.js";
import { createUnitPlacementDefinition, instantiateUnitPlacement } from "../../dist/core/battle/creation/placement.js";
import { createDefinition as createDeployableDefinition } from "../helpers/deployable.js";
import { evaluateDeployment } from "../../dist/core/battle/deployment/query.js";

const presenceBattlefield = () => createFieldState(createMap(1, 5, tileEntries(Array.from({ length: 5 }, () => ({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'MELEE', passableMask: 'ALL',
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
  })))));


const presenceUnit = (id, position) => ({
  effects:Effects.empty(), id, definition: Object.freeze({ hooks: [], id: `presence_${id}`, vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }), spatialPresence: Object.freeze({}) }), position: Object.freeze(position),
  vitality: initializeVitalityState(fixtureBattle(0), { maxHp:100, defense: 0, resistance: 0 }).value, spatialPresence: { present: true },
});




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




test('core presence transitions preserve the original state when later settlement fails', () => {
  const unit = presenceUnit(1, [2, 0]);
  const runtime = addUnit(presenceBattlefield(), unit);
  const navigation = runtime.navigation;
  assert.throws(() => {
    const hidden = { ...unit, spatialPresence: { present: false } };
    const working = updateUnit(runtime, [hidden]);
    assert.deepEqual(unitsAt(working, [0, 2]), []);
    assert.equal(working.navigation, navigation);
    throw new Error('abort presence');
  }, /abort presence/);
  assert.equal(runtime.navigation, navigation);
  assert.equal(runtime.units.get(1).spatialPresence.present, true);
  assert.deepEqual(unitsAt(runtime, [0, 2]).map(unit => unit.id), [1]);
});


test('core placement applies an explicit tile to a declared occupancy capability', () => {
  const tile = [0, 1];
  const placement = { definition: { hooks: [], id: 'placement', occupancy: { slot: 'OCCUPANT' } }, position: [0, 0], tile };
  const battle = fixtureBattle(17);
  const direct = instantiateUnitPlacement(battle, placement).value;
  const normalized = createUnitPlacementDefinition(placement);
  const placed = instantiateUnitPlacement(battle, normalized).value;
  assert.equal(direct.occupancy.tile, tile);
  assert.equal(normalized.tile, tile);
  assert.equal(placed.occupancy.tile, tile);
  assert.equal(placed.definition, placement.definition);
  assert.equal(placed.position, placement.position);

  const nextTile = [0, 2];
  const next = instantiateUnitPlacement(battle, { ...normalized, tile: nextTile }).value;
  assert.equal(next.occupancy.tile, nextTile);
  assert.deepEqual(placed.occupancy.tile, [0, 1]);
  assert.throws(() => instantiateUnitPlacement(battle, {
    definition: { hooks: [], id: 'no-occupancy' }, position: [0, 0], tile,
  }), /occupancy capability/);
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
  action: createActionCapabilityDefinition({ definitions: Definitions.empty().add(createAttack({ id: 'normal', speed: 100,
    triggerBindingId: 'primary',
    intervalTicks: 3, recoveryTicks: 0, followUps: [],
    targetGroups: [{ id: 'primary',
      operations: [{ type: 'DAMAGE', power: 10, damageType: 'PHYSICAL' }],
      targeting: damageTargeting({ type: 'DAMAGE', scope: { type: 'RANGE', geometry: [
        { type: 'CIRCLE', offset: [0, 0], radius: 1 },
      ] }, canTargetAir: false, includeBlockingRelations: false, preferBlockingRelations: false,
        ignoreTargetFree: false, ignoreInvisible: false, maxTargets: 1 }),
    }],
   })) }),
  layer: Object.freeze({ type: 'GROUND' }),
  hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.25 } },
  blocker: { capacity: 2, geometry: { radius: 0.7 } },
  blockable: Object.freeze({ volume: 1 }),
});


function catalogRouteState(definition) {
  const state = initializeRouteState(fixtureBattle(0), definition).value;
  const main = { ...state.main, phase: { type: 'CHECKPOINT', index: 0,
    checkpointState: { type: 'WAITING', deadlineTick: 9 } } };
  return { main, alternative: main };
}


test('core unit initialization pairs every declared capability with its initializer state', () => {
  const definition = { ...catalogDefinition(), spatialPresence: {}, occupancy: { slot: 'OCCUPANT' }, targetable: { restrictions: [] },
  };
  const battle = fixtureBattle(17);
  const initialized = initializeUnit(battle, { id: 1, definition, position: [2, 0] });
  const unit = initialized.value;
  assert.equal(initialized.state, battle);
  assert.equal(unit.definition, definition);
  assert.equal(unit.vitality.hp, 100);
  assert.equal(unit.action.actions.size, definition.action.definitions.size);
  assert.equal(hasRoute(unit), true);
  assert.equal(unit.route.main.definition, definition.route);
  assert.equal(unit.spatialPresence.present, true);
  assert.equal(unit.occupancy.tile, null);
  assert.deepEqual(unit.targetable.restrictions, []);

  assert.deepEqual(unit.blocker, { capacity: [], geometry: { radius: 0.7 }, rules: [], blocked: [], acquired: [], released: [] });
  assert.equal(resolveCapacity(unit.definition.blocker, unit.blocker), 2);
  assert.deepEqual(unit.blockable, { volume: [], rules: [], blocker: null, acquired: [], released: [] });

  const next = initializeUnit(battle, { id: 2, definition, position: [0, 0] }).value;
  assert.notEqual(next.vitality, unit.vitality);
  assert.notEqual(next.action, unit.action);
  assert.notEqual(next.targetable, unit.targetable);
  const bare = initializeUnit(battle, {
    id: 3, definition: { hooks: [], id: 'presence-only', spatialPresence: {} }, position: [0, 0],
  }).value;
  assert.equal(hasSpatialPresence(bare), true);
  assert.equal(bare.spatialPresence.present, true);
  assert.equal(hasVitality(bare), false);
});


test('core initialization shares immutable definitions', () => {
  const definition = { hooks: [], id: 'shared-definition', vitality: { maxHp: 100, defense: 0, resistance: 0 }, metadata: { labels: ['a'] } };
  const first = initialize({ id: 1, definition, position: [0, 0] });
  const second = initialize({ id: 2, definition, position: [1, 0] });
  assert.equal(first.definition, definition);
  assert.equal(second.definition, definition);

  const revisedDefinition = { ...definition, vitality: { maxHp: 200, defense: 0, resistance: 0 }, metadata: { labels: ['b'] } };
  const revised = initialize({ id: 3, definition: revisedDefinition, position: [0, 0] });
  assert.equal(revised.definition, revisedDefinition);
  assert.equal(revised.vitality.hp, 200);
  assert.equal(first.definition.vitality.maxHp, 100);
  assert.deepEqual(first.definition.metadata.labels, ['a']);
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


test('core capability guards require both definition and state', () => {
  const definition = catalogDefinition();
  const unit = initialize({ id: 1, definition, position: [0, 0],
    states: { route: catalogRouteState(definition.route) } });
  for (const [key, guard] of [
    ['vitality', hasVitality], ['locomotion', hasLocomotion], ['route', hasRoute], ['allegiance', hasAllegiance],
    ['action', hasAction], ['layer', hasLayer], ['hitbox', hasHitbox], ['blocker', hasBlocker],
    ['blockable', hasBlockable],
  ]) {
    const missingState = { ...unit };
    delete missingState[key];
    assert.equal(guard(missingState), false, `${key}: configuration alone is not a runtime capability`);

    const definition = { ...unit.definition };
    delete definition[key];
    const missingConfiguration = { ...unit, definition };
    assert.equal(guard(missingConfiguration), false, `${key}: state alone is not a configured capability`);
  }

  const { route, ...withoutRoute } = unit;
  assert.equal(hasRoute(withoutRoute), false);
  assert.equal(hasRoute(unit), true);
  const presence = { id: 2, definition: Object.freeze({ hooks: [], id: 'presence', spatialPresence: {} }), position: [0, 0],
    spatialPresence: { present: false } };
  assert.equal(hasSpatialPresence(presence), true);
  assert.equal(isSpatiallyPresent(presence), false);


});


test('core immutable unit updates retain earlier capability values', () => {
  const definition = catalogDefinition();
  const unit = initialize({ id: 1, definition, position: [2, 0],
    states: { route: catalogRouteState(definition.route), spatialPresence: { present: true }, targetable: initializeTargetableState(fixtureBattle(0), fixtureDefinition("targetable")).value } });
  const snapshot = unit;
  let runtime = presenceBattlefield();
  runtime = addUnit(runtime, unit);
  const previous = runtime;
  const mainRoute = snapshot.route.main;
  const updated = { ...snapshot,
    vitality: { ...snapshot.vitality, hp: 25 },
    locomotion: { ...snapshot.locomotion, velocity: [0.1, 0] },
    route: { ...snapshot.route, main: { ...mainRoute, phase: { ...mainRoute.phase,
      checkpointState: { ...mainRoute.phase.checkpointState, deadlineTick: 1 },
    } } },
  };
  runtime = updateUnit(runtime, [updated]);

  assert.equal(runtime.units.get(1), updated);
  assert.equal(previous.units.get(1), unit);
  assert.equal(snapshot.vitality.hp, 100);
  assert.deepEqual(snapshot.locomotion.velocity, [0, 0]);
  assert.equal(snapshot.route.main.phase.checkpointState.deadlineTick, 9);
  assert.equal(updated.route.main.phase.checkpointState.deadlineTick, 1);
  assert.equal(updated.route.alternative, snapshot.route.alternative);
  assert.equal(updated.route.alternative.phase.checkpointState.deadlineTick, 9);
  assert.equal(updated.route.main.definition, snapshot.route.main.definition);
  assert.equal(updated.hitbox, snapshot.hitbox);
  assert.equal(updated.targetable, snapshot.targetable);
});


test('static hitbox shapes are shared across unit instances', () => {
  const shape = { type: 'CIRCLE', offset: [0.25, 0], radius: 0.125 };
  const definition = { hooks: [], id: 'shared_shape', hitbox: { shape } };
  const first = initialize({ id: 1, definition, position: [0, 0] });
  const second = initialize({ id: 2, definition, position: [1, 0] });
  assert.equal(first.definition.hitbox.shape, shape);
  assert.equal(second.definition.hitbox.shape, shape);
  assert.deepEqual(first.hitbox, {});
  assert.notEqual(first.hitbox, second.hitbox);
});


test('validateShape accepts finite offsets and nonnegative dimensions without replacing the value', () => {
  for (const shape of [
    { type: 'CIRCLE', offset: [0.25, -1.5], radius: 0 },
    { type: 'BOX', offset: [-3, 2], halfExtents: [0, 0.25] },
  ]) {
    assert.equal(validateShape(shape), undefined);
  }
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


test('core domain rules compose independently and preserve earlier unit states', () => {
  const definition = { hooks: [], id: 'rule_unit', vitality: { maxHp: 100, defense: 0, resistance: 0 } };
  const first = initialize({ id: 1, definition, position: [0, 0],
    states: { targetable: initializeTargetableState(fixtureBattle(0), fixtureDefinition("targetable")).value } });
  const second = initialize({ id: 2, definition, position: [0, 0],
    states: { targetable: initializeTargetableState(fixtureBattle(0), fixtureDefinition("targetable")).value } });
  const source = { id: 3, definition: { hooks: [], id: 'query_source' }, position: [0, 0] };
  const battle = fixtureBattle();
  const request = { source: unitRef(source), purposes: ['HEAL'], filter: () => true,
    selector: (state, _request, candidates) => ({ state, value: candidates.map(unitRef) }) };
  const restrictSource = { id: 'source-a', value: { kind: Symbol('source'),
    allows: (_battle, current) => current.source.id !== source.id } };
  const restrictPurpose = { id: 'source-b', value: { kind: Symbol('purpose'),
    allows: (_battle, current) => current.purposes.includes('DAMAGE') } };
  const one = setRestriction(first.targetable, restrictSource);
  const both = setRestriction(one, restrictPurpose);
  const afterOne = removeRestriction(both, 'source-a');
  const afterBoth = removeRestriction(afterOne, 'source-b');

  assert.equal(hasTargetable(first), true);
  assert.equal(hasTargetable({ id: 4, definition, position: [0, 0] }), false);
  assert.equal(one.restrictions[0], restrictSource);
  assert.equal(both.restrictions[0], one.restrictions[0]);
  assert.equal(setRestriction(both, restrictSource), both);
  assert.equal(removeRestriction(both, 'missing'), both);
  assert.equal(allowsRestrictions(battle, request, { ...first, targetable: both }), false);
  assert.equal(allowsRestrictions(battle, request, { ...first, targetable: afterOne }), false);
  assert.equal(allowsRestrictions(battle, request, { ...first, targetable: afterBoth }), true);
  assert.equal(allowsRestrictions(battle, request, first), true);
  assert.equal(allowsRestrictions(battle, request, second), true);
  assert.equal(first.definition, second.definition);
  assert.deepEqual(first.targetable.restrictions, []);
  assert.equal(both.restrictions.length, 2);

  const denyHealing = id => ({ id, stage: 'receiving', priority: 0,
    invoke: (state, _context, pending) => ({ state,
      value: { ...pending, cancellation: { reason: 'CONTENT_REJECTS_HEALING' } } }) });
  const healingA = denyHealing('healer-a');
  const healingB = denyHealing('healer-b');
  const vitalityOne = setHealingHook(first.vitality, healingA);
  const vitalityBoth = setHealingHook(vitalityOne, healingB);
  const withdrawnOne = removeHealingHook(vitalityBoth, 'healer-a');
  const withdrawnBoth = removeHealingHook(withdrawnOne, 'healer-b');

  assert.deepEqual(vitalityBoth.healingHooks, [healingA, healingB]);
  assert.deepEqual(withdrawnOne.healingHooks, [healingB]);
  assert.deepEqual(withdrawnBoth.healingHooks, []);
  assert.equal(vitalityBoth.healingHooks[0], vitalityOne.healingHooks[0]);
  assert.equal(setHealingHook(vitalityBoth, healingB), vitalityBoth);
  assert.equal(removeHealingHook(vitalityBoth, 'missing'), vitalityBoth);
  assert.equal(vitalityBoth.healingHooks.length, 2);
  assert.deepEqual(second.vitality.healingHooks, []);
});


test('core blocking uses current state radius and includes center-distance equality', () => {
  const map = createMap(1, 3, tileEntries(Array.from({ length: 3 }, () => deploymentTile())));
  const blocker = initialize({ id: 1, definition: Object.freeze({ hooks: [], id: 'radius_blocker',
    allegiance: { side: 'ALLY' }, blocker: { capacity: 1, geometry: { radius: 0.5 } },
  }), position: [0, 0] });
  const blocked = initialize({ id: 2, definition: Object.freeze({ hooks: [], id: 'radius_enemy',
    allegiance: { side: 'ENEMY' }, blockable: { volume: 1 }, layer: { type: 'GROUND' },
    hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 10 } },
  }), position: [1, 0] });
  const update = current => {
    const battle = createBattleState(addUnits(createFieldState(map), [current, blocked]));
    return blockingRelations(searchBlocking(battle, unitRef(current))).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id }));
  };
  assert.deepEqual(update(blocker), []);
  const enlarged = { ...blocker, blocker: { ...blocker.blocker, geometry: ({ radius: 1 }) } };
  assert.deepEqual(update(enlarged), [{ blockerUnitId: 1, blockedUnitId: 2 }]);
  assert.deepEqual(update({ ...enlarged, blocker: { ...enlarged.blocker, geometry: ({ radius: 0.999 }) } }), []);
  assert.equal(enlarged.definition.blocker.geometry.radius, 0.5);
});


test('core unit updates preserve definition identity and fail atomically while presence stays dynamic', () => {
  let runtime = presenceBattlefield();
  const unit = initialize({ id: 1, definition: catalogDefinition(), position: [2, 0] });
  runtime = addUnit(runtime, unit);
  const maps = runtime.navigation;
  assert.throws(() => updateBattleUnit(createBattleState(runtime), [{
    ...unit, position: [3, 0], definition: { ...unit.definition },
  }]), /unit definition cannot change/);
  assert.deepEqual(runtime.units.get(1).position, [2, 0]);
  assert.deepEqual(unitsAt(runtime, [0, 2]).map(value => value.id), [1]);
  assert.equal(runtime.navigation, maps);

  const bare = initialize({ id: 2, definition: Object.freeze({ hooks: [], id: 'bare' }), position: [0, 0] });
  runtime = addUnit(runtime, bare);
  assert.throws(() => updateBattleUnit(createBattleState(runtime), [{
    ...bare, definition: Object.freeze({ ...bare.definition, vitality: { maxHp: 1, defense: 0, resistance: 0 } }), vitality: initializeVitalityState(fixtureBattle(0), { maxHp: 1, defense: 0, resistance: 0 }).value,
  }]));

  const hidden = { ...runtime.units.get(1), spatialPresence: { present: false } };
  runtime = updateUnit(runtime, [hidden]);
  assert.deepEqual(unitsAt(runtime, [0, 2]), []);
  const restored = { ...runtime.units.get(1), spatialPresence: { present: true } };
  runtime = updateUnit(runtime, [restored]);
  assert.deepEqual(unitsAt(runtime, [0, 2]).map(value => value.id), [1]);
});


test('catalog products preserve supplied definitions, capability states and guard context', async () => {
  const { default: ts } = await import('typescript');
  const directory = mkdtempSync(join(tmpdir(), 'stronghold-unit-types-'));
  const sourceModule = name => JSON.stringify(fileURLToPath(
    new URL(`../../src/core/unit/${name}.js`, import.meta.url)));
  const imports = `
import { initialize as initializeUnit } from ${sourceModule('initialize')};
import type { Definitions as CapabilityDefinitions, Product } from ${sourceModule('capability/catalog')};
import { initialize as initializeRoutedUnit, type Input as RoutedUnitInput } from ${sourceModule('../battle/creation/routed-unit')};
import { advance as advanceLocomotion } from ${sourceModule('capability/locomotion/operations')};
import { advance as advanceRoute, movementTarget, pathMotionMode } from ${sourceModule('capability/route/operations')};
import { ref as unitRef, get as getUnit } from ${sourceModule('query')};
import type { Unit, Definition as UnitDefinition } from ${sourceModule('unit')};
import type { ImmutableData } from ${sourceModule('../common/immutable-data')};
import type { Ref } from ${sourceModule('../common/ref')};
import { initialize as initializeOffenseState } from ${sourceModule('capability/offense/capability')};
import { initialize as initializeVitalityState } from ${sourceModule('capability/vitality/capability')};
import { initialize as initializeActionState } from ${sourceModule('capability/action/capability')};
type EnemyDefinition = UnitDefinition & Pick<CapabilityDefinitions, 'vitality' | 'locomotion' | 'spatialPresence'>;
import { hasVitality, type Vitality, type Definition as VitalityDefinition } from ${sourceModule('capability/vitality/capability')};
import { initialize as initializeLocomotionState, type Locomotion, type State as LocomotionState } from ${sourceModule('capability/locomotion/capability')};
import { hasRoute } from ${sourceModule('capability/route/capability')};
import type { Targetable } from ${sourceModule('capability/targetable/capability')};
import { create as createBattlefieldState } from ${sourceModule('../battlefield/state')};
import { add as addUnit, update as updateUnit, remove as removeUnit } from ${sourceModule('../battlefield/unit')};
import type { Map as TileMap } from ${sourceModule('../battlefield/map/map')};
import { createUnitPlacementDefinition, instantiateUnitPlacement, type UnitPlacementDefinition } from ${sourceModule('../battle/creation/placement')};
import type { BattleExecutionState } from ${sourceModule('../battle/execution/state')};
import { get as getProjectile, ref as projectileRef } from ${sourceModule('../projectile/query')};
import { create as createProjectile, type CreateInput as ProjectileCreateInput } from ${sourceModule('../battle/projectile')};
import type { Definition as ProjectileDefinition } from ${sourceModule('../projectile/definition')};
import type { Projectile } from ${sourceModule('../projectile/projectile')};
import type { State as BattleState } from ${sourceModule('../battle/state')};
import { damage as damageElement } from ${sourceModule('capability/elemental/operations')};
type ElementDamageOutcome = ReturnType<typeof damageElement>['value'];
import type { Occupancy, State as OccupancyState } from ${sourceModule('capability/occupancy/capability')};
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Assert<T extends true> = T;
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
interface EnemyProbe extends EnemyDefinition { readonly kind: 'enemy'; readonly enemyCode: 17; }
interface OptionalProbe extends UnitDefinition { readonly vitality?: VitalityDefinition; }
declare const enemyDefinition: EnemyProbe;
declare const enemySpawn: RoutedUnitInput<EnemyProbe>;
declare const battlefieldMap: TileMap;
declare const execution: BattleExecutionState;
declare const battleState: BattleState;
declare const projectileDefinition: ProjectileDefinition<{ readonly charges: number }>;
declare const projectileInput: ProjectileCreateInput<{ readonly charges: number }>;
declare const typedProjectile: Projectile<{ readonly charges: number }>;
declare const placement: { readonly definition: EnemyProbe & { readonly occupancy: { readonly slot: 'OCCUPANT' } }; readonly position: readonly [number, number]; readonly tile: OccupancyState['tile'] };
`;
  const compile = (name, source) => {
    const path = join(directory, `${name}.mts`);
    writeFileSync(path, imports + source);
    const program = ts.createProgram([path], {
      noEmit: true, target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
      strict: true, exactOptionalPropertyTypes: true, noUncheckedIndexedAccess: true,
      skipLibCheck: true, types: [],
    });
    return ts.getPreEmitDiagnostics(program).map(diagnostic => ({
      file: diagnostic.file?.fileName,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    }));
  };

  try {
    const positive = compile('positive', `
declare const elementalReport: ElementDamageOutcome;
if (elementalReport.type === "APPLIED" && elementalReport.burst !== null) {
  const targetId: number = elementalReport.burst.host.id;
}
if (elementalReport.type === "REJECTED") {
  const reason: string = elementalReport.reason;
}
initializeOffenseState(battleState, { attack: 1 }).value.attack;
initializeVitalityState(battleState, { maxHp: 100, defense: 1, resistance: 0 }).value.defense;
initializeLocomotionState(battleState, enemyDefinition.locomotion).value.velocity;
declare const actionDefinition: Parameters<typeof initializeActionState>[1];
initializeActionState(battleState, actionDefinition).value.actions;
// @ts-expect-error capability initialization requires the current BattleState.
initializeOffenseState({ attack: 1 });
// @ts-expect-error capability initialization requires the current BattleState.
initializeVitalityState({ maxHp: 100, defense: 1, resistance: 0 });
// @ts-expect-error clock-only context is not a BattleState.
initializeLocomotionState(enemyDefinition.locomotion, { tick: 7 });
// @ts-expect-error a tick is not a BattleState.
initializeActionState(7);
type EnemyCapabilities = Assert<Product<EnemyProbe> extends Vitality & Locomotion ? true : false>;
type ProductDefinition = Assert<Equal<Product<EnemyProbe>['definition'], EnemyProbe>>;
type SpecificDefinition = Assert<Equal<Product<{ readonly vitality: { readonly maxHp: 100; readonly defense: 0; readonly resistance: 0 } }>['definition']['vitality'], { readonly maxHp: 100; readonly defense: 0; readonly resistance: 0 }>>;
type ExtraDefinitionFields = Assert<Equal<Extract<keyof Product<EnemyProbe>['definition'], 'kind' | 'enemyCode'>, 'kind' | 'enemyCode'>>;
type DeclaredDefinitions = Assert<Product<{ readonly occupancy: { readonly slot: 'OCCUPANT' }; readonly targetable: { restrictions: [] } }> extends Occupancy & Targetable ? true : false>;
type OptionalProduct = Assert<Equal<keyof Product<OptionalProbe>, 'definition'>>;
type MetadataIsNotCapability = Assert<Equal<keyof Product<{ readonly label: string }>, 'definition'>>;
type OptionalHasNoRequiredCapabilities = Assert<Equal<RequiredKeys<Unit & Product<OptionalProbe>>, 'id' | 'definition' | 'position' | 'effects' | 'lifecycle'>>;
type WideHasNoRequiredCapabilities = Assert<Equal<RequiredKeys<Unit & Product<UnitDefinition>>, 'id' | 'definition' | 'position' | 'effects' | 'lifecycle'>>;
function initializeGeneric<D extends EnemyDefinition>(definition: D): Unit & Product<D> {
  return initializeUnit(battleState, { id: 0, definition, position: [0, 0] }).value;
}
const enemy = initializeUnit(battleState, { id: 1, definition: enemyDefinition, position: [0, 0] }).value;
const baseUnit: Unit = enemy;
const instanceId: number = baseUnit.id;
const contentId: string = baseUnit.definition.id;
const enemyCode: 17 = enemy.definition.enemyCode;
const plainDefinition: UnitDefinition & Product<EnemyProbe>['definition'] = enemy.definition;
const acceptedDefinition: typeof enemy.definition = enemyDefinition;
type PlainUnit = Assert<Equal<typeof enemy, Unit & Product<EnemyProbe>>>;
const routedEnemy = initializeRoutedUnit(battleState, enemySpawn).value;
const spawnedContentId: string = routedEnemy.definition.id;
const spawnedEnemyCode: 17 = routedEnemy.definition.enemyCode;
routedEnemy.route.main.definition;
const advancedRoute = advanceRoute(battleState, unitRef(routedEnemy));
const target = movementTarget(advancedRoute, unitRef(routedEnemy));
const movedBattle = target === null ? advancedRoute : advanceLocomotion(advancedRoute, unitRef(routedEnemy), target, { mode: pathMotionMode(routedEnemy.route), speedMultiplier: 1 });
const movedEnemy = getUnit(movedBattle, unitRef(routedEnemy))!;
const movedContentId: string = movedEnemy.definition.id;
movedEnemy.route.main.definition;
const placed = instantiateUnitPlacement(battleState, placement).value;
const placedDefinition: UnitDefinition & Product<typeof placement['definition']>['definition'] = placed.definition;
const acceptedPlacementDefinition: typeof placed.definition = placement.definition;
type ExpectedPlacement = Unit & Product<typeof placement['definition']>;
const placedCapabilities: Unit & Vitality & Locomotion & Occupancy = placed;
type PlacementCapabilities = Assert<typeof placed extends ExpectedPlacement ? true : false>;
type PlacementInput = Assert<ExpectedPlacement extends typeof placed ? true : false>;
const normalizedPlacement = createUnitPlacementDefinition(placement);
const normalizedPlaced = instantiateUnitPlacement(battleState, normalizedPlacement).value;
type NormalizedPlacementCapabilities = Assert<typeof normalizedPlaced extends ExpectedPlacement ? true : false>;
type NormalizedPlacementInput = Assert<ExpectedPlacement extends typeof normalizedPlaced ? true : false>;
const requiredPlacement = createUnitPlacementDefinition({
  definition: { ...enemyDefinition, occupancy: { slot: 'OCCUPANT' as const } }, position: [0, 0], tile: null, extra: 31,
});
const requiredPlaced = instantiateUnitPlacement(battleState, requiredPlacement).value;
requiredPlaced.occupancy.tile;
const requiredOccupancy: Occupancy = requiredPlaced;
type NormalizedPlacementFields = Assert<Equal<keyof typeof requiredPlacement, 'definition' | 'position' | 'tile' | 'effects'>>;
const ordinaryLocomotion: LocomotionState = enemy.locomotion;
declare const guarded: Unit & {
  readonly definition: ImmutableData<EnemyProbe>;
  readonly extra: 23;
};
if (hasVitality(guarded)) {
  const extra: 23 = guarded.extra;
  const kind: 'enemy' = guarded.definition.kind;
  guarded.vitality.hp;
}
if (hasRoute(guarded)) {
  const extra: 23 = guarded.extra;
  const code: 17 = guarded.definition.enemyCode;
  guarded.route.main.definition;
}
const battlefield = createBattlefieldState(battlefieldMap);
const populatedField = addUnit(battlefield, enemy);
const updatedField = updateUnit(populatedField, [enemy]);
const replacedField = updateUnit(updatedField, [enemy]);
const removedField = removeUnit(replacedField, unitRef(enemy));
const projectileResult = createProjectile(battleState, projectileDefinition, projectileInput);
type ProjectileIdentity = Assert<Equal<typeof projectileResult.value, Ref<Projectile<{ readonly charges: number }>>>>;
type ProjectileState = Assert<Equal<typeof projectileResult.state, BattleState>>;
const recoveredProjectile = getProjectile(projectileResult.state, projectileResult.value);
type ProjectileData = Assert<Equal<NonNullable<typeof recoveredProjectile>['state'], { readonly charges: number }>>;
battleState.battlefield.projectiles.add(typedProjectile);
battleState.battlefield.projectiles.replace(projectileRef(typedProjectile), typedProjectile);
`);
    assert.deepEqual(positive, []);

    for (const [name, source] of [
      ['projectile-wrong-callback', `battleState.battlefield.projectiles.add({ ...typedProjectile, definition: { id: 'fake', onAdvance: (battle: BattleState, self: Projectile<{ label: string }>) => battle } });`],
      ['projectile-wrong-initial-state', `createProjectile(battleState, projectileDefinition, { ...projectileInput, state: { charges: 'wrong' } });`],
      ['projectile-wrong-state-pairing', `battleState.battlefield.projectiles.replace(projectileRef(typedProjectile), { ...typedProjectile, state: { charges: 'wrong' } });`],
      ['projectile-untyped-callback', `getProjectile(battleState, 0)!.definition.onAdvance;`],
      ['projectile-as-unit', `addUnit(createBattlefieldState(battlefieldMap), typedProjectile);`],
      ['unit-removal-raw-id', `removeUnit(createBattlefieldState(battlefieldMap), 0);`],
      ['unit-removal-projectile-ref', `removeUnit(createBattlefieldState(battlefieldMap), projectileRef(typedProjectile));`],
      ['state-extra-field', `initializeUnit(battleState, { id: 1, definition: { hooks: [], id: 'offense', offense: { attack: 1 } }, position: [0, 0], states: { offense: initializeOffenseState(battleState, { attack: 1 }).value } });`],
      ['unconfigured', `initializeUnit(battleState, { id: 1, definition: { hooks: [], id: 'bare' }, position: [0, 0] }).value.locomotion.velocity;`],
      ['invalid-offense-config', `initializeUnit(battleState, { id: 1, definition: { hooks: [], id: 'invalid', offense: { attack: [] } }, position: [0, 0] });`],
      ['missing-occupancy-slot', `initializeUnit(battleState, { id: 1, definition: { hooks: [], id: 'invalid', occupancy: {} }, position: [0, 0] });`],
      ['invalid-occupancy-slot', `initializeUnit(battleState, { id: 1, definition: { hooks: [], id: 'invalid', occupancy: { slot: 'OTHER' } }, position: [0, 0] });`],
      ['occupancy-instance-slot', `declare const occupied: Occupancy; occupied.occupancy.slot;`],
      ['optional', `declare const optionalDefinition: OptionalProbe; initializeUnit(battleState, { id: 1, definition: optionalDefinition, position: [0, 0] }).value.vitality.hp;`],
      ['wide', `declare const wideDefinition: UnitDefinition; initializeUnit(battleState, { id: 1, definition: wideDefinition, position: [0, 0] }).value.locomotion.velocity;`],
      ['base-unit-definition', `declare const unit: Unit; unit.definition.vitality.maxHp;`],
      ['missing-route-refinement', `initializeUnit(battleState, { id: 1, definition: enemyDefinition, position: [0, 0] }).value.route.main;`],
      ['optional-normalized-occupancy', `declare const optionalPlacement: UnitPlacementDefinition<EnemyProbe>; instantiateUnitPlacement(battleState, createUnitPlacementDefinition(optionalPlacement)).value.occupancy.tile;`],
      ['normalized-unknown-field', `createUnitPlacementDefinition({ definition: enemyDefinition, position: [0, 0], extra: 31 }).extra;`],
    ]) {
      const diagnostics = compile(name, source);
      assert.ok(diagnostics.some(diagnostic => diagnostic.file === join(directory, `${name}.mts`)),
        `${name} must reject unsupported capability inference: ${JSON.stringify(diagnostics)}`);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
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
  const query = (type, column) => evaluateDeployment(runtime, {
    profile: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: type }), tile: [0, column],
  });
  for (const [type, column, allowed] of [
    ['MELEE', 0, true], ['RANGED', 0, false], ['ALL', 0, true],
    ['MELEE', 1, false], ['RANGED', 1, true], ['ALL', 1, true],
    ['MELEE', 2, true], ['RANGED', 2, true],
  ]) {
    assert.deepEqual(query(type, column), allowed
      ? { type: 'ALLOWED' }
      : { type: 'DENIED', reason: 'BUILDABLE_TYPE' });
  }
  assert.equal(runtime.navigation.baseline.WALK.cells[2].passable, false);
  for (const [column, reason] of [[3, 'BUILDABLE_TYPE'], [4, 'BUILDABLE_TYPE'],
    [5, 'TERRAIN'], [6, 'OUTSIDE_MAP'], [-1, 'OUTSIDE_MAP']]) {
    assert.deepEqual(query('ALL', column), { type: 'DENIED', reason });
  }
  assert.deepEqual(evaluateDeployment(runtime, {
    profile: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, placement: 'ALL', allowedSiteConditions: [conditions.deepsea] }),
    tile: [0, 5],
  }), { type: 'ALLOWED' });
  assert.deepEqual(evaluateDeployment(runtime, {
    profile: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, placement: 'ALL', allowedSiteConditions: [conditions.normal, conditions.deepsea] }),
    tile: [0, 5],
  }), { type: 'ALLOWED' });
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
  const profile = createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: 'ALL' });
  for (const tile of [[0, 1], [0, 2]]) {
    assert.deepEqual(evaluateDeployment(runtime, { profile, tile }),
      { type: 'DENIED', reason: 'OCCUPIED' });
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


test('core support allows a platform and occupant to coexist without treating the platform as the occupant', () => {
  let runtime = createFieldState(createMap(1, 3, tileEntries([
    deploymentTile(), deploymentTile({ buildableType: 'NONE' }), deploymentTile(),
  ])));
  const platform = deploymentUnit(1, [1, 0], {
    occupancy: { slot: 'SUPPORT', hooks: [] },
    vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }),

  }, [0, 1]);
  runtime = addUnit(runtime, platform);
  runtime = changeFieldTile(runtime, [0, 1], { placement: 'RANGED', elevation: 'HIGHLAND', allowsBlocking: false });
  const profile = createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: 'RANGED' });
  assert.deepEqual(evaluateDeployment(runtime, { profile, tile: [0, 1] }),
    { type: 'ALLOWED' });
  const occupant = deploymentUnit(2, [1, 0], { occupancy: { slot: 'OCCUPANT' }, deployable: profile }, [0, 1]);
  runtime = addUnit(runtime, occupant);
  assert.deepEqual(unitsAt(runtime, [0, 1]).map(unit => unit.id), [1, 2]);
  const entry = occupancyAt(runtime, [0, 1]);
  assert.equal(runtime.units.get(entry.support.id), platform);
  assert.equal(runtime.units.get(entry.occupant.id), occupant);
  assert.deepEqual(evaluateDeployment(runtime, { profile, tile: [0, 1] }),
    { type: 'DENIED', reason: 'OCCUPIED' });
  const retained = runtime;
  const removed = removeBattleUnit(createBattleState(runtime), 1, 'SCRIPT');
  runtime = removed.battlefield;
  assert.deepEqual(removed.events, []);
  const retainedEntry = occupancyAt(retained, [0, 1]);
  assert.equal(retained.units.get(retainedEntry.support.id), platform);
  assert.equal(retained.units.get(retainedEntry.occupant.id), occupant);
  const remainingEntry = occupancyAt(runtime, [0, 1]);
  assert.equal(remainingEntry.support, null);
  assert.equal(runtime.units.has(1), false);
  assert.equal(runtime.units.get(remainingEntry.occupant.id), occupant);
});
