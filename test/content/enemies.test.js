import { attribute, vitality } from "../helpers/attribute.js";
// Contract: [content](../../docs/architecture/content.md).
import { blocker } from "../../dist/core/unit/capability/blocking/index.js";
import { World } from "../../dist/core/geometry/coordinate.js";
import { Hooks } from "../../dist/core/hook.js";
import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { normal as normalSite } from "../../dist/content/terrain/condition.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import * as blockingQueries from "../../dist/core/battle/blocking/index.js";
import { advance as advanceBlocking, release as releaseBlocking } from "../../dist/core/battle/blocking/index.js";
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readEnemyParameters, resolveEnemy } from '../../dist/data/unit/enemy.js';
import { parseAttackTiming } from '../../dist/data/action/timing.js';
import { readEnemyMovementPrefab } from '../../dist/data/unit/prefab.js';
import { create as createHound } from '../../dist/content/enemies/hound/unit.js';
import { create as createCrossbowman } from '../../dist/content/enemies/crossbowman/unit.js';
import { createArrow } from '../../dist/content/enemies/crossbowman/projectile.js';
import { initialize } from "../helpers/unit.js";

import { createBattleState } from '../../dist/core/battle/state.js';
import { add as addUnit, update } from '../../dist/core/unit/operations.js';
import { getUnit } from '../helpers/unit.js';
import { create as createBattlefield } from '../../dist/core/battlefield/state.js';
import { create as createMap } from '../../dist/core/battlefield/map/map.js';
import { start as startAction, ref as actionRef, getApplyWay } from '../../dist/core/unit/capability/action/index.js';
import { ref as unitRef } from '../../dist/core/unit/index.js';
import { allowsRestrictions, setCategory } from '../../dist/core/unit/capability/targetable/capability.js';
import { invisibleRestriction } from '../../dist/core/effects/visibility.js';
import { invincible } from '../../dist/core/effects/protection.js';
import { install } from '../../dist/core/effect/index.js';
import { inRange } from '../../dist/core/battle/targeting/index.js';
import { advance as advanceAction } from '../../dist/core/unit/capability/action/index.js';
import { advance as advanceCombat } from '../../dist/core/battle/steps/combat.js';
import { step } from '../../dist/core/battle/runtime.js';
import { advance as advanceSchedule } from '../../dist/core/battle/schedule/index.js';
import { battle as createBattle } from '../helpers/battle.js';
import { effectInitial } from "../helpers/effect.js";

const fixture = JSON.parse(readFileSync(new URL('../fixtures/arknights/main-mode-units.json', import.meta.url), 'utf8'));
const timingData = JSON.parse(readFileSync(new URL('../fixtures/arknights/action_timing.json', import.meta.url), 'utf8'));
const houndTiming = parseAttackTiming(timingData.hound);
const crossbowTiming = {
  melee: parseAttackTiming(timingData.crossbowMelee),
  ranged: parseAttackTiming(timingData.crossbowRanged),
};
const rawEnemy = id => fixture.enemies.find(entry => entry.Key === id);
const enemy = (id, level = 0, overwrittenData) => resolveEnemy(rawEnemy(id), { level, overwrittenData });
const parameters = id => readEnemyParameters(enemy(id));
const houndPrefab = JSON.parse(readFileSync(new URL('../fixtures/arknights/prefab_enemy_1000_gopro.json', import.meta.url), 'utf8'));
const crossbowPrefab = JSON.parse(readFileSync(new URL('../fixtures/arknights/prefab_enemy_1003_ncbow.json', import.meta.url), 'utf8'));
const houndMovement = readEnemyMovementPrefab(enemy('enemy_1000_gopro'), { [houndPrefab.prefabKey]: houndPrefab });
const crossbowMovement = readEnemyMovementPrefab(enemy('enemy_1003_ncbow'), { [crossbowPrefab.prefabKey]: crossbowPrefab });

function emptyBattle() {
  const tile = createTile({
    terrain: normal.create({}),
    initial: {
      elevation: "LOWLAND", placement: "ALL", passability: "ALL",
      walkCost: 1, allowsBlocking: true, siteCondition: normalSite, collision: null,
    },
  });
  return createBattleState(createBattlefield(createMap(5, 5, tileEntries(Array.from({ length: 25 }, () => tile)), [], [])));
}

function advanceCombatUntil(state, untilTick) {
  for (let tick = state.tick + 1; tick <= untilTick; tick++) state = advanceCombat({ ...state, tick });
  return state;
}

function advanceActionUntil(state, reference, untilTick) {
  for (let tick = state.tick; tick <= untilTick; tick++) state = advanceAction({ ...state, tick }, reference);
  return state;
}

function guard(id, position, blockCapacity = 1, restrictions = []) {
  return initialize({ id, position, definition: { hooks: Hooks.empty(),
    id: 'test-guard', targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions }, vitality: vitality(1000, { defense: attribute(40) }), classification: { type: "OPERATOR", side: 'ALLY', profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] }, layer: { type: 'GROUND' },
    hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.2 } },
    blocker: { calculateOffset: blockingQueries.calculateOffset, capacity: blockCapacity, rule: blocker.ground, restrictions: [] },
  } });
}

test('hound content binds configured regeneration and rejects unimplemented stun immunity', () => {
  const prefabKey = 'enemy_1000_gopro_variant';
  const advanced = enemy('enemy_1000_gopro', 1, {
    prefabKey: { m_defined: true, m_value: prefabKey },
    levelType: { m_defined: true, m_value: 'BOSS' },
    attributes: {
      maxHp: { m_defined: true, m_value: 4000 },
      atk: { m_defined: false, m_value: 9999 },
      moveSpeed: { m_defined: true, m_value: 1.1 },
      hpRecoveryPerSec: { m_defined: true, m_value: 20 },
    },
  });
  const movement = readEnemyMovementPrefab(advanced, { [prefabKey]: { ...houndPrefab, prefabKey } });
  const configured = { ...readEnemyParameters(advanced), timing: houndTiming, hitRadius: 0.2, movement };
  const regenerating = createHound(configured);

  assert.equal(movement.prefabKey, prefabKey);
  assert.equal(regenerating.locomotion.halfBodyWidth, movement.halfBodyWidth);
  assert.equal(regenerating.route.alwaysCheckCurrentPoint, movement.alwaysCheckCurrentPoint);
  assert.equal(regenerating.vitality.recoverySpeed.default, 20);
  assert.equal(regenerating.classification.rank, 'BOSS');
  assert.equal(regenerating.elemental.maxEp.default, 2000);
  assert.throws(() => createHound({ ...configured, stunImmune: true }), /stun immunity/);
});

function routeInitial(position, destination = null) {
  return { facing: { direction: 'RIGHT' }, route: { plan: {
    motionMode: 'WALK', startPosition: World.toTile(position), destination,
    checkpoints: [],
  }, offset: [0, 0] } };
}

test('scheduled hound faces its route after the first checkpoint has changed its birth position', () => {
  const definition = createHound({
    ...parameters('enemy_1000_gopro'), timing: houndTiming, hitRadius: 0.2, movement: houndMovement,
  });
  const plan = {
    motionMode: 'WALK', startPosition: [1, 1], destination: null,
    checkpoints: [
      { type: 'APPEAR', position: [1, 5], offset: [0, 0] },
      { type: 'MOVE', position: [1, 3], offset: [0, 0], randomizeOffset: false },
    ],
  };
  const state = advanceSchedule(createBattle([], { schedule: {
    waves: [{ preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null,
      fragments: [{ preDelayTicks: 0, entries: [{
        definition, plan, offset: [0, 0], randomRange: [0, 0], atTick: 0, wait: 'WAVE',
      }] }],
    }],
    branches: {},
  } }));
  const hound = getUnit(state, 0);

  assert.deepEqual(hound.position, [5, 1]);
  assert.equal(hound.presence.present, true);
  assert.equal(hound.route.main.index, 1);
  assert.equal(hound.route.main.current.type, 'MOVE');
  assert.equal(hound.facing.direction, 'LEFT');
  assert.deepEqual(hound.locomotion.velocity, [0, 0]);
});

test('a hound attacks its hidden blocker while still respecting invincibility', () => {
  const definition = createHound({
    ...parameters('enemy_1000_gopro'), timing: houndTiming, hitRadius: 0.2, movement: houndMovement,
  });
  const [action] = definition.action.definitions;
  const blocker = guard(0, [2, 2], 1, [{ id: 'hidden', group: null, value: invisibleRestriction }]);
  const hound = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const before = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), hound));
  assert.equal(getApplyWay(getUnit(before, 1)), "MELEE");
  const selectTargets = action.attack.targetGroups[0].select;
  assert.equal(allowsRestrictions(before, hound)(getUnit(before, 0)), false);
  assert.deepEqual(selectTargets(before, unitRef(hound)).value.map(ref => ref.id), [0]);
  const started = startAction(before, actionRef(hound.action.actions.get(action)));
  const hit = advanceActionUntil(started.state, started.value, 18);
  assert.equal(getUnit(hit, 0).vitality.health.hp, 850);

  const protectedState = install(before, unitRef(blocker), invincible, effectInitial).state;
  const protectedStart = startAction(protectedState, actionRef(hound.action.actions.get(action)));
  assert.notEqual(protectedStart.value, null);
  assert.equal(getUnit(advanceActionUntil(protectedStart.state, protectedStart.value, 18), 0).vitality.health.hp, 1000);
});

test('crossbow selects melee for its actual blocker while ranged targeting keeps ordinary restrictions', () => {
  const narrow = [{ type: 'CIRCLE', offset: [0, 0], radius: 0.01 }];
  const projectile = { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 };
  const definition = createCrossbowman({
    ...parameters('enemy_1003_ncbow'), rangeRadius: 0.01,
    timing: crossbowTiming, hitRadius: 0.2, projectile, movement: crossbowMovement,
  });
  const [meleeAction, rangedAction] = definition.action.definitions;
  const blocker = guard(0, [2, 2], 1, [{ id: 'innate', group: null, value: invisibleRestriction }]);
  const bow = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const initial = addUnit(addUnit(emptyBattle(), blocker), bow);
  const state = advanceBlocking(update(initial, unitRef(blocker), setCategory("DEVICE")));
  const melee = meleeAction.attack.targetGroups[0].select;
  const ranged = rangedAction.attack.targetGroups[0].select;

  assert.equal(inRange(bow.position, narrow)(getUnit(state, 0)), false);
  assert.equal(allowsRestrictions(state, bow)(getUnit(state, 0)), false);
  assert.deepEqual(melee(state, unitRef(bow)).value.map(ref => ref.id), [0]);
  assert.deepEqual(ranged(state, unitRef(bow)).value, []);
  assert.deepEqual(definition.action.select(state, getUnit(state, 1)).value, ['melee']);
  const started = advanceCombat(state);
  const released = advanceCombatUntil(started, 15);
  assert.equal(getUnit(released, 0).vitality.health.hp, 800);
  assert.equal(released.battlefield.projectiles.size, 0);
  assert.deepEqual(definition.action.select(released, getUnit(released, 1)).value, []);

  const unblocked = addUnit(addUnit(emptyBattle(), guard(0, [2, 2.5], 0, [
    { id: 'innate', group: null, value: invisibleRestriction },
  ])), bow);
  assert.deepEqual(blockingQueries.relations(unblocked).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })), []);
  assert.equal(inRange(bow.position, narrow)(getUnit(unblocked, 0)), true);
  assert.deepEqual(melee(unblocked, unitRef(bow)).value, []);
  assert.deepEqual(ranged(unblocked, unitRef(bow)).value, []);
  assert.deepEqual(definition.action.select(unblocked, getUnit(unblocked, 1)).value, ['ranged']);
});

test('crossbow releases on the authored event, hits on contact, and moves after recovery', () => {

  const projectileDefinition = createArrow();
  const definition = createCrossbowman({
    ...parameters('enemy_1003_ncbow'), timing: crossbowTiming, hitRadius: 0.2, movement: crossbowMovement,
    projectile: { definition: projectileDefinition, speedPerSecond: 6, stopDelayTicks: 0 },
  });
  const attack = definition.action.definitions.find(({ id }) => id === 'ranged');

  const position = [2, 3.5];
  const guardUnit = guard(0, [2, 2], 0);
  const select = attack.attack.targetGroups[0].select;
  const initial = createBattle([
    { definition: guardUnit.definition, position: guardUnit.position, hooks: Hooks.empty(), initial: {} },
    { definition, position, hooks: Hooks.empty(), initial: routeInitial(position, { type: 'MOVE', position: [3, 4] }) },
  ], { rows: 5, columns: 5 });
  const target = unitRef(getUnit(initial, 0));
  const bow = getUnit(initial, 1);
  assert.equal(getApplyWay(getUnit(initial, 1)), "ALL");
  assert.deepEqual(select(initial, unitRef(bow)).value, [target]);
  const device = update(initial, target, setCategory("DEVICE"));
  assert.deepEqual(select(device, unitRef(bow)).value, []);
  const before = update(device, target, setCategory("DEFAULT"));
  assert.deepEqual(select(before, unitRef(bow)).value, [target]);
  const started = startAction(before, actionRef(bow.action.actions.get(attack)));
  let state = started.state;
  assert.equal(getApplyWay(getUnit(state, 1)), "ALL");
  assert.equal(state.battlefield.projectiles.size, 0);
  assert.equal(getUnit(state, 0).vitality.health.hp, 1000);
  while (state.tick < 16) state = step(state, []);
  assert.equal(state.battlefield.projectiles.size, 0);
  state = step(state, []);
  assert.equal(state.battlefield.projectiles.size, 1);
  assert.equal(getUnit(state, 0).vitality.health.hp, 1000);
  while (state.tick <= 26) state = step(state, []);
  assert.equal(getUnit(state, 0).vitality.health.hp, 800);

  while (state.tick < 30) state = step(state, []);
  assert.deepEqual(getUnit(state, 1).position, position);
  state = step(state, []);
  assert.ok(getUnit(state, 1).position[0] > position[0]);
});

test('crossbow switching between ranged and blocker melee preserves independent cooldowns', () => {
  const definition = createCrossbowman({
    ...parameters('enemy_1003_ncbow'), timing: crossbowTiming, hitRadius: 0.2, movement: crossbowMovement,
    projectile: { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 },
  });
  const [meleeAction, rangedAction] = definition.action.definitions;
  const bow = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const initial = addUnit(addUnit(emptyBattle(), guard(0, [2, 2])), bow);
  const cooldown = (battle, action) => getUnit(battle, 1).action.actions.get(action.id).cooldown.readyAtTick;
  const period = definition.action.interval.default;

  const ranged = advanceCombatUntil(advanceCombat(initial), 16);
  assert.equal(ranged.battlefield.projectiles.size, 1);
  assert.equal(cooldown(ranged, rangedAction), period);
  assert.equal(cooldown(ranged, meleeAction), 0);

  const recovered = advanceCombatUntil(ranged, 30);
  const blocked = advanceBlocking({ ...recovered, tick: 31 });
  assert.deepEqual(blockingQueries.relations(blocked).map(({ blocked }) => blocked.id), [1]);
  const melee = advanceCombatUntil(advanceCombat(blocked), 46);
  assert.equal(getUnit(melee, 0).vitality.health.hp, 800);
  assert.equal(melee.battlefield.projectiles.size, 1);
  assert.equal(cooldown(melee, meleeAction), period + 31);
  assert.equal(cooldown(melee, rangedAction), period);

  const meleeRecovered = advanceCombatUntil(melee, 61);
  const unblocked = releaseBlocking({ ...meleeRecovered, tick: 62 }, blockingQueries.relations(meleeRecovered, unitRef(getUnit(meleeRecovered, 1))));
  assert.equal(advanceCombat(unblocked).battlefield.projectiles.size, 1);
  const rangedAgain = advanceCombatUntil(advanceCombat({ ...unblocked, tick: period }), period + 16);
  assert.equal(rangedAgain.battlefield.projectiles.size, 2);
  assert.equal(cooldown(rangedAgain, rangedAction), period * 2);
  assert.equal(cooldown(rangedAgain, meleeAction), period + 31);

});
