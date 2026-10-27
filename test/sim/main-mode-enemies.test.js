import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import * as blockingQueries from "../../dist/core/battle/blocking/index.js";
import { advance as advanceBlocking, release as releaseBlocking } from "../../dist/core/battle/blocking/index.js";
import { damage as damageElement } from "../../dist/core/unit/capability/elemental/index.js";
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prepare } from '../../dist/data/arknights/enemy.js';
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
import { select } from '../../dist/core/battle/targeting/index.js';
import { allowsRestrictions } from '../../dist/core/unit/capability/targetable/capability.js';
import { invisibleRestriction, camouflageRestriction, untargetableRestriction } from '../../dist/content/effects/visibility.js';
import { invincibleRestriction } from '../../dist/content/effects/protection.js';
import { range } from '../../dist/core/battle/targeting/index.js';
import { advance as advanceAction } from '../../dist/core/unit/action/index.js';
import { advance as advanceCombat } from '../../dist/core/battle/steps/combat.js';
import { advance as advanceProjectiles } from '../../dist/core/battle/projectile.js';
import * as projectiles from '../../dist/core/battle/projectile.js';
import * as projectilesQuery from '../../dist/core/projectile/index.js';
import { setOverlay } from '../../dist/core/battlefield/navigation/state.js';
import { advance as advanceLocomotion } from '../../dist/core/unit/capability/locomotion/index.js';

const fixture = JSON.parse(readFileSync(new URL('../fixtures/arknights/main-mode-units.json', import.meta.url), 'utf8'));
const rawEnemy = id => fixture.enemies.find(entry => entry.Key === id);
const profile = (id, level = 0, overwrittenData) => prepare(rawEnemy(id), { level, overwrittenData });

function emptyBattle() {
  const tile = { heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL', terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1 };
  return createBattleState(createBattlefield(createMap(5, 5, tileEntries(Array.from({ length: 25 }, () => tile)))));
}

function guard(id, position, blockCapacity = 1, restrictions = []) {
  return initialize({ id, position, definition: { hooks: [],
    id: 'test-guard', targetable: { restrictions }, vitality: { maxHp: 1000, defense: 40, resistance: 0 }, allegiance: { side: 'ALLY' }, layer: { type: 'GROUND' },
    hitbox: { shape: { type: 'CIRCLE', offset: [0, 0], radius: 0.2 } },
    blocker: { capacity: blockCapacity, geometry: { radius: 0.70709997 } },
  } });
}

test('main-mode enemy levels inherit individual defined fields and apply stage overrides last', () => {
  const base = profile('enemy_1000_gopro');
  const advanced = profile('enemy_1000_gopro', 1, { attributes: {
    maxHp: { m_defined: true, m_value: 4000 },
    atk: { m_defined: false, m_value: 9999 },
    moveSpeed: { m_defined: true, m_value: 1.1 },
  } });
  assert.equal(base.maxHp, 820);
  assert.equal(base.attack, 190);
  assert.equal(advanced.maxHp, 4000);
  assert.equal(advanced.attack, 400);
  assert.equal(advanced.resistance, 30);
  assert.equal(advanced.baseAttackTime, 1.4);
  assert.equal(advanced.moveSpeedPerSecond, 1.1);
  assert.equal(advanced.blockVolume, 1);
  assert.deepEqual(advanced.tags, ['infection']);
  assert.equal(rawEnemy('enemy_1000_gopro').Value[0].enemyData.attributes.maxHp.m_value, 820);
  assert.throws(() => profile('enemy_1000_gopro', 2), /exactly one level 2/);
});

test('defined zero is preserved and both selected handbook entries specify physical damage', () => {
  const bow = profile('enemy_1003_ncbow', 1);
  assert.equal(bow.attackSpeed, 0);
  assert.equal(bow.rangeRadius, 1.9);
  assert.equal(bow.attack, 310);
  assert.deepEqual(bow.tags, []);
  for (const id of ['enemy_1000_gopro', 'enemy_1003_ncbow']) {
    assert.deepEqual(fixture.enemyHandbook[id].damageType, ['PHYSIC']);
  }
});

test('unimplemented enemy mechanisms are rejected at the table and content boundaries', () => {
  assert.throws(() => profile('enemy_1000_gopro', 0, {
    attributes: { hpRecoveryPerSec: { m_defined: true, m_value: 20 } },
  }), /unsupported enemy attribute hpRecoveryPerSec/);
  assert.throws(() => profile('enemy_1000_gopro', 0, { skills: [{ prefabKey: 'unimplemented' }] }), /unsupported enemy skills/);
  const timing = { windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2 };

  assert.throws(() => createHound({ ...profile('enemy_1000_gopro'), stunImmune: true }, timing, 0.2), /stun immunity/);
  assert.throws(() => createHound(profile('enemy_1003_ncbow'), timing, 0.2), /Hound content/);
  assert.throws(() => createCrossbowman(profile('enemy_1000_gopro'), {
    ...timing, projectile: { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 },
  }, 0.2), /Crossbowman content/);
});

test('hound factory composes capabilities and attacks its retained blocker with pure state flow', () => {

  const { definition, action: attack } = createHound(profile('enemy_1000_gopro'), { windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2 }, 0.2);
  const hound = initialize({ id: 1, position: [2, 2.5], definition });
  assert.equal(hound.vitality.hp, 820);
  assert.equal(hound.locomotion.speed.length, 0);
  assert.equal(definition.locomotion.speed, 1.9 / 30);

  const before = advanceBlocking(addUnit(addUnit(emptyBattle(), guard(0, [2, 2])), hound));
  const damaged = damageElement(before, unitRef(hound), { source: null, type: 'BURN', power: 100 });
  assert.equal(getUnit(damaged.state, 1).elemental.ep.BURN, 900);
  assert.equal(getUnit(damaged.state, 1).vitality.hp, 820);
  const started = startAction(before, actionRef(unitRef(hound), attack));
  const after = advanceAction(started.state, started.value.ref);
  assert.equal(getUnit(after, 0).vitality.hp, 850);
  assert.equal(getUnit(before, 0).vitality.hp, 1000);
  assert.equal(before.events.some(event => event.type === "DAMAGE"), false);
  assert.ok(after.events.some(event => event.type === 'DAMAGE'));
});

test('a blocked hound selects its blocker directly despite normal targeting restrictions', () => {
  const { definition, action } = createHound(profile('enemy_1000_gopro'), {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
  }, 0.2);

  for (const value of [invisibleRestriction, camouflageRestriction, untargetableRestriction]) {
    const blocker = guard(0, [2, 2], 1, [{ id: 'innate', value }]);
    const hound = initialize({ id: 1, position: [2, 2.5], definition });
    const before = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), hound));
    const request = { ...action.attack.targetGroups[0].targeting, source: unitRef(hound) };

    assert.deepEqual(blockingQueries.relations(before).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })), [{ blockerUnitId: 0, blockedUnitId: 1 }]);
    assert.equal(allowsRestrictions(before, request, getUnit(before, 0)), false);
    assert.deepEqual(select(before, request).value.map(ref => ref.id), [0]);
    const started = startAction(before, actionRef(unitRef(hound), action));
    assert.equal(started.value.type, 'STARTED');
    const advanced = advanceAction(started.state, started.value.ref);
    assert.ok(getUnit(advanced, 0).vitality.hp < 1000);
    assert.equal(getUnit(before, 0).vitality.hp, 1000);
  }
});

test('crossbow selects melee for its actual blocker while ranged targeting keeps ordinary restrictions', () => {
  const narrow = [{ type: 'CIRCLE', offset: [0, 0], radius: 0.01 }];
  const projectile = { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 };
  const { definition, actions } = createCrossbowman({ ...profile('enemy_1003_ncbow'), rangeRadius: 0.01 }, {
    windupTicks: 1, recoveryTicks: 1, hitRadius: 0.2, projectile,
  }, 0.2);
  const blocker = guard(0, [2, 2], 1, [{ id: 'innate', value: invisibleRestriction }]);
  const bow = initialize({ id: 1, position: [2, 2.5], definition });
  const state = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), bow));
  const request = { ...actions.melee.attack.targetGroups[0].targeting, source: unitRef(bow) };
  const ranged = { ...actions.ranged.attack.targetGroups[0].targeting, source: unitRef(bow) };

  assert.equal(range(narrow)(state, request, getUnit(state, 0)), false);
  assert.equal(allowsRestrictions(state, request, getUnit(state, 0)), false);
  assert.deepEqual(select(state, request).value.map(ref => ref.id), [0]);
  assert.deepEqual(select(state, ranged).value, []);
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
  assert.equal(range(narrow)(unblocked, request, getUnit(unblocked, 0)), true);
  assert.deepEqual(select(unblocked, request).value, []);
  assert.deepEqual(select(unblocked, ranged).value, []);
  assert.deepEqual(definition.action.select(unblocked, getUnit(unblocked, 1)).value, ['ranged']);
});

test('directly selecting an invincible blocker still preserves damage reception rules', () => {
  const { definition, action } = createHound(profile('enemy_1000_gopro'), {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
  }, 0.2);
  const base = guard(0, [2, 2], 1, [{ id: 'invincible', value: invincibleRestriction }]);
  const blocker = { ...base, vitality: { ...base.vitality,
    damageReceptionRules: [{ id: 'invincible', allows: () => false }],
  } };
  const hound = initialize({ id: 1, position: [2, 2.5], definition });
  const state = advanceBlocking(addUnit(addUnit(emptyBattle(), blocker), hound));
  const started = startAction(state, actionRef(unitRef(hound), action));

  assert.equal(started.value.type, 'STARTED');
  const advanced = advanceAction(started.state, started.value.ref);
  assert.equal(getUnit(advanced, 0).vitality.hp, 1000);
  assert.equal(advanced.events.some(event => event.type === 'ACTION_RELEASED'), true);
});

test('crossbow uses explicit windup and arrow speed, then settles damage on contact', () => {

  const projectileDefinition = createArrow();
  const { definition, actions: { ranged: attack } } = createCrossbowman(profile('enemy_1003_ncbow'), {
    windupTicks: 1, recoveryTicks: 1, hitRadius: 0.2,
    projectile: { definition: projectileDefinition, speedPerSecond: 6, stopDelayTicks: 0 },
  }, 0.2);

  const bow = initialize({ id: 1, position: [2, 3.5], definition });
  const before = addUnit(addUnit(emptyBattle(), guard(0, [2, 2], 0)), bow);
  const started = startAction(before, actionRef(unitRef(bow), attack));
  let state = started.state;
  assert.equal(state.battlefield.projectiles.size, 0);
  assert.equal(getUnit(state, 0).vitality.hp, 1000);
  state = advanceAction({ ...state, tick: 1 }, started.value.ref);
  assert.equal(state.battlefield.projectiles.size, 1);
  assert.equal(getUnit(state, 0).vitality.hp, 1000);
  for (let tick = 2; tick <= 10; tick++) {
    state = advanceProjectiles({ ...state, tick }, projectilesQuery.all(state).map(projectilesQuery.ref).toArray());
  }
  assert.equal(getUnit(state, 0).vitality.hp, 800);
  assert.ok(state.events.some(event => event.type === 'PROJECTILE_HIT' && event.targetUnitId === 0));
  assert.equal(getUnit(before, 0).vitality.hp, 1000);
  assert.equal(before.battlefield.projectiles.size, 0);
});

test('different crossbow configurations share an arrow definition in one battle', () => {

  const projectile = { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 };
  const base = createCrossbowman(profile('enemy_1003_ncbow'), {
    windupTicks: 1, recoveryTicks: 1, hitRadius: 0.2, projectile,
  }, 0.2);
  const advanced = createCrossbowman(profile('enemy_1003_ncbow', 1), {
    windupTicks: 2, recoveryTicks: 1, hitRadius: 0.2, projectile,
  }, 0.2);

  assert.strictEqual(base.definition.elemental.bursts.BURN, advanced.definition.elemental.bursts.BURN);
  assert.equal(base.definition.offense.attack, 240);
  assert.equal(advanced.definition.offense.attack, 310);
  assert.equal(base.actions.ranged.attack.windupTicks, 1);
  assert.equal(advanced.actions.ranged.attack.windupTicks, 2);
  assert.equal(base.actions.melee.attack.intervalTicks, base.actions.ranged.attack.intervalTicks);
  assert.strictEqual(base.definition.attackTiming.projectile.definition, advanced.definition.attackTiming.projectile.definition);
});

test('crossbow switching between ranged and blocker melee preserves independent cooldowns', () => {
  const { definition, actions } = createCrossbowman(profile('enemy_1003_ncbow'), {
    windupTicks: 0, recoveryTicks: 0, hitRadius: 0.2,
    projectile: { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 },
  }, 0.2);
  const bow = initialize({ id: 1, position: [2, 2.5], definition });
  const initial = addUnit(addUnit(emptyBattle(), guard(0, [2, 2])), bow);
  const cooldown = (battle, action) => getUnit(battle, 1).action.actions.get(action.id).cooldown.readyAtTick;
  const period = actions.ranged.intervalTicks;
  assert.equal(period, 72);
  assert.equal(getUnit(initial, 1).action.actions.size, 2);

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

  const unblocked = releaseBlocking({ ...melee, tick: 2 }, unitRef(getUnit(melee, 1)));
  assert.equal(getUnit(advanceCombat(unblocked), 1).action.nextExecutionId, 2);
  const rangedAgain = advanceCombat({ ...unblocked, tick: period });
  assert.equal(rangedAgain.battlefield.projectiles.size, 2);
  assert.equal(cooldown(rangedAgain, actions.ranged), period * 2);
  assert.equal(cooldown(rangedAgain, actions.melee), period + 1);

  const blockedAgain = advanceBlocking({ ...rangedAgain, tick: period + 1 });
  const meleeAgain = advanceCombat(blockedAgain);
  assert.equal(getUnit(meleeAgain, 0).vitality.hp, 600);
  assert.equal(meleeAgain.battlefield.projectiles.size, 2);
  assert.equal(cooldown(meleeAgain, actions.ranged), period * 2);
  assert.equal(cooldown(meleeAgain, actions.melee), period * 2 + 1);
  assert.deepEqual(meleeAgain.events.filter(event => event.type === 'ACTION_RELEASED')
    .map(event => [event.executionId, event.tick]), [[0, 0], [1, 1], [2, period], [3, period + 1]]);
  assert.equal(cooldown(ranged, actions.melee), 0);
  assert.equal(getUnit(initial, 0).vitality.hp, 1000);
});

test('enemy content keeps hit radius and terrain avoidance width independent', () => {
  const timing = { windupTicks: 0, recoveryTicks: 0, hitRadius: 0.4 };
  const hound = createHound(profile('enemy_1000_gopro'), timing, 0.15).definition;
  const crossbowman = createCrossbowman(profile('enemy_1003_ncbow'), {
    ...timing,
    projectile: { definition: createArrow(), speedPerSecond: 6, stopDelayTicks: 0 },
  }, 0.25).definition;

  for (const [definition, halfBodyWidth] of [[hound, 0.15], [crossbowman, 0.25]]) {
    const unit = initialize({ id: 1, position: [2, 2], definition });
    assert.equal(unit.definition.hitbox.shape.radius, 0.4);
    assert.equal(unit.definition.locomotion.halfBodyWidth, halfBodyWidth);
  }

  const move = definition => {
    const initial = emptyBattle();
    const navigation = setOverlay(initial.battlefield.navigation, 'WALK', {
      id: 0, cells: [[3, 3]], denyPassage: true, denyDepartures: [],
    });
    const before = addUnit({ ...initial, battlefield: { ...initial.battlefield, navigation } },
      initialize({ id: 1, position: [2.1, 2.4], definition }));
    const goal = [2.1, 4];
    return getUnit(advanceLocomotion(before, { id: 1 }, { nextPoint: goal, goal }, {
      mode: 'WALK', speedMultiplier: 1,
    }), 1);
  };
  const narrow = move(hound);
  const changedHit = move(createHound(profile('enemy_1000_gopro'), { ...timing, hitRadius: 0.05 }, 0.15).definition);
  const wider = move(createHound(profile('enemy_1000_gopro'), timing, 0.35).definition);
  assert.deepEqual(changedHit.position, narrow.position);
  assert.deepEqual(changedHit.locomotion.velocity, narrow.locomotion.velocity);
  assert.ok(wider.position[0] < narrow.position[0], 'only the wider movement body begins avoiding this corner');
});
