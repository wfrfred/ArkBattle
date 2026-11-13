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
import { prepare } from '../../dist/data/unit/enemy.js';
import { parseEnemyMovementPrefab } from '../../dist/data/unit/prefab.js';
import { create as createHound } from '../../dist/content/enemies/hound/unit.js';
import { create as createCrossbowman } from '../../dist/content/enemies/crossbowman/unit.js';
import { createArrow } from '../../dist/content/enemies/crossbowman/action.js';
import { initialize } from "../helpers/unit.js";

import { createBattleState } from '../../dist/core/battle/state.js';
import { add as addUnit } from '../../dist/core/battle/unit.js';
import { getUnit } from '../helpers/unit.js';
import { create as createBattlefield } from '../../dist/core/battlefield/state.js';
import { create as createMap } from '../../dist/core/battlefield/map/map.js';
import { start as startAction, ref as actionRef } from '../../dist/core/unit/action/index.js';
import { ref as unitRef } from '../../dist/core/unit/index.js';
import { allowsRestrictions } from '../../dist/core/unit/capability/targetable/capability.js';
import { invisibleRestriction } from '../../dist/core/effects/visibility.js';
import { invincible } from '../../dist/core/effects/protection.js';
import { install } from '../../dist/core/unit/effect/index.js';
import { inRange } from '../../dist/core/battle/targeting/index.js';
import { advance as advanceAction } from '../../dist/core/unit/action/index.js';
import { advance as advanceCombat } from '../../dist/core/battle/steps/combat.js';
import { advance as advanceProjectiles } from '../../dist/core/battle/projectile.js';
import * as projectilesQuery from '../../dist/core/projectile/index.js';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/arknights/main-mode-units.json', import.meta.url), 'utf8'));
const rawEnemy = id => fixture.enemies.find(entry => entry.Key === id);
const profile = (id, level = 0, overwrittenData) => prepare(rawEnemy(id), { level, overwrittenData });
const houndMovement = parseEnemyMovementPrefab(JSON.parse(readFileSync(new URL('../fixtures/arknights/prefab_enemy_1000_gopro.json', import.meta.url), 'utf8')));
const crossbowMovement = { halfBodyWidth: 0.2, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } };

function emptyBattle() {
  const tile = createTile({
    terrain: normal.create({}),
    initial: {
      elevation: "LOWLAND", placement: "ALL", passability: "ALL",
      walkCost: 1, allowsBlocking: true, siteCondition: normalSite,
    },
  });
  return createBattleState(createBattlefield(createMap(5, 5, tileEntries(Array.from({ length: 25 }, () => tile)))));
}

function guard(id, position, blockCapacity = 1, restrictions = []) {
  return initialize({ id, position, definition: { hooks: Hooks.empty(),
    id: 'test-guard', targetable: { taunt: 0, restrictions }, vitality: { maxHp: 1000, defense: 40, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 }, allegiance: { side: 'ALLY' }, layer: { type: 'GROUND' },
    hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.2 } },
    blocker: { layer: "GROUND", rules: [], capacity: blockCapacity },
  } });
}

test('main-mode enemy levels inherit individual defined fields and apply stage overrides last', () => {
  const base = profile('enemy_1000_gopro');
  const advanced = profile('enemy_1000_gopro', 1, { attributes: {
    maxHp: { m_defined: true, m_value: 4000 },
    atk: { m_defined: false, m_value: 9999 },
    moveSpeed: { m_defined: true, m_value: 1.1 },
    hpRecoveryPerSec: { m_defined: true, m_value: 20 },
  } });
  assert.equal(base.maxHp, 820);
  assert.equal(base.attack, 190);
  assert.equal(advanced.maxHp, 4000);
  assert.equal(advanced.attack, 400);
  assert.equal(advanced.moveSpeedPerSecond, 1.1);
  assert.equal(advanced.recoverySpeed, 20);
  const regenerating = createHound(advanced, {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
  }, houndMovement);
  assert.equal(regenerating.definition.vitality.recoverySpeed, 20);
  const bow = profile('enemy_1003_ncbow', 1);
  assert.equal(bow.attackSpeed, 0);
  assert.throws(() => profile('enemy_1000_gopro', 2));
});

test('unimplemented enemy stun immunity is rejected at the content boundary', () => {
  const timing = { windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2 };

  assert.throws(() => createHound({ ...profile('enemy_1000_gopro'), stunImmune: true }, timing, houndMovement), /stun immunity/);
});

function routeInitial(position) {
  return { route: { plan: {
    motionMode: 'WALK', startPosition: World.toTile(position), endPosition: null,
    checkpoints: [], requireAllCheckpoints: true,
  }, offset: [0, 0] } };
}

test('a hound attacks its hidden blocker while still respecting invincibility', () => {
  const { definition, action } = createHound(profile('enemy_1000_gopro'), {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
  }, houndMovement);
  const blocker = guard(0, [2, 2], 1, [{ id: 'hidden', value: invisibleRestriction }]);
  const hound = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const before = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), hound));
  const selectTargets = action.attack.targetGroups[0].select;
  assert.equal(allowsRestrictions(before, hound)(getUnit(before, 0)), false);
  assert.deepEqual(selectTargets(before, unitRef(hound)).value.map(ref => ref.id), [0]);
  const started = startAction(before, actionRef(unitRef(hound), action));
  const hit = advanceAction(started.state, started.value);
  assert.equal(getUnit(hit, 0).vitality.hp, 850);

  const protectedState = install(before, unitRef(blocker), invincible).state;
  const protectedStart = startAction(protectedState, actionRef(unitRef(hound), action));
  assert.notEqual(protectedStart.value, null);
  assert.equal(getUnit(advanceAction(protectedStart.state, protectedStart.value), 0).vitality.hp, 1000);
});

test('crossbow selects melee for its actual blocker while ranged targeting keeps ordinary restrictions', () => {
  const narrow = [{ type: 'CIRCLE', offset: [0, 0], radius: 0.01 }];
  const projectile = { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 };
  const { definition, actions } = createCrossbowman({ ...profile('enemy_1003_ncbow'), rangeRadius: 0.01 }, {
    windupTicks: 1, recoveryTicks: 1, hitRadius: 0.2, projectile,
  }, crossbowMovement);
  const blocker = guard(0, [2, 2], 1, [{ id: 'innate', value: invisibleRestriction }]);
  const bow = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const state = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), bow));
  const melee = actions.melee.attack.targetGroups[0].select;
  const ranged = actions.ranged.attack.targetGroups[0].select;

  assert.equal(inRange(bow.position, narrow)(getUnit(state, 0)), false);
  assert.equal(allowsRestrictions(state, bow)(getUnit(state, 0)), false);
  assert.deepEqual(melee(state, unitRef(bow)).value.map(ref => ref.id), [0]);
  assert.deepEqual(ranged(state, unitRef(bow)).value, []);
  assert.deepEqual(definition.action.select(state, getUnit(state, 1)).value, ['melee']);
  const started = advanceCombat(state);
  const released = advanceCombat({ ...started, tick: 1 });
  assert.equal(getUnit(released, 0).vitality.hp, 800);
  assert.equal(released.battlefield.projectiles.size, 0);
  assert.deepEqual(definition.action.select(released, getUnit(released, 1)).value, []);

  const unblocked = addUnit(addUnit(emptyBattle(), guard(0, [2, 2.5], 0, [
    { id: 'innate', value: invisibleRestriction },
  ])), bow);
  assert.deepEqual(blockingQueries.relations(unblocked).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })), []);
  assert.equal(inRange(bow.position, narrow)(getUnit(unblocked, 0)), true);
  assert.deepEqual(melee(unblocked, unitRef(bow)).value, []);
  assert.deepEqual(ranged(unblocked, unitRef(bow)).value, []);
  assert.deepEqual(definition.action.select(unblocked, getUnit(unblocked, 1)).value, ['ranged']);
});

test('crossbow uses explicit windup and arrow speed, then settles damage on contact', () => {

  const projectileDefinition = createArrow();
  const { definition, actions: { ranged: attack } } = createCrossbowman(profile('enemy_1003_ncbow'), {
    windupTicks: 1, recoveryTicks: 1, hitRadius: 0.2,
    projectile: { definition: projectileDefinition, speedPerSecond: 6, stopDelayTicks: 0 },
  }, crossbowMovement);

  const bow = initialize({ id: 1, position: [2, 3.5], definition, initial: routeInitial([2, 3.5]) });
  const before = addUnit(addUnit(emptyBattle(), guard(0, [2, 2], 0)), bow);
  const started = startAction(before, actionRef(unitRef(bow), attack));
  let state = started.state;
  assert.equal(state.battlefield.projectiles.size, 0);
  assert.equal(getUnit(state, 0).vitality.hp, 1000);
  state = advanceAction({ ...state, tick: 1 }, started.value);
  assert.equal(state.battlefield.projectiles.size, 1);
  assert.equal(getUnit(state, 0).vitality.hp, 1000);
  for (let tick = 2; tick <= 10; tick++) {
    state = advanceProjectiles({ ...state, tick }, projectilesQuery.all(state).map(projectilesQuery.ref));
  }
  assert.equal(getUnit(state, 0).vitality.hp, 800);
});

test('crossbow switching between ranged and blocker melee preserves independent cooldowns', () => {
  const { definition, actions } = createCrossbowman(profile('enemy_1003_ncbow'), {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
    projectile: { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 },
  }, crossbowMovement);
  const bow = initialize({ id: 1, position: [2, 2.5], definition, initial: routeInitial([2, 2.5]) });
  const initial = addUnit(addUnit(emptyBattle(), guard(0, [2, 2])), bow);
  const cooldown = (battle, action) => getUnit(battle, 1).action.actions.get(action.id).cooldown.readyAtTick;
  const period = actions.ranged.intervalTicks;

  const ranged = advanceCombat(initial);
  assert.equal(ranged.battlefield.projectiles.size, 1);
  assert.equal(cooldown(ranged, actions.ranged), period);
  assert.equal(cooldown(ranged, actions.melee), 0);

  const blocked = advanceBlocking({ ...ranged, tick: 1 });
  assert.deepEqual(blockingQueries.relations(blocked).map(({ blocked }) => blocked.id), [1]);
  const melee = advanceCombat(blocked);
  assert.equal(getUnit(melee, 0).vitality.hp, 800);
  assert.equal(melee.battlefield.projectiles.size, 1);
  assert.equal(cooldown(melee, actions.melee), period + 1);
  assert.equal(cooldown(melee, actions.ranged), period);

  const unblocked = releaseBlocking({ ...melee, tick: 2 }, blockingQueries.relations(melee, unitRef(getUnit(melee, 1))));
  assert.equal(advanceCombat(unblocked).battlefield.projectiles.size, 1);
  const rangedAgain = advanceCombat({ ...unblocked, tick: period });
  assert.equal(rangedAgain.battlefield.projectiles.size, 2);
  assert.equal(cooldown(rangedAgain, actions.ranged), period * 2);
  assert.equal(cooldown(rangedAgain, actions.melee), period + 1);

});
