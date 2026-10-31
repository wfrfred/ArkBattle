import { step as stepBattle } from "../../dist/core/battle/runtime.js";
import * as blockingQueries from "../../dist/core/battle/blocking/query.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { chessRec, enemyRec } from "../helpers/records.js";
import { createLegacyCombatBattle } from "../helpers/legacy-combat.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { resolveVolume } from "../../dist/core/unit/capability/blocking/blockable.js";

const FRONT = 'test_front_a', BACK = 'test_back_a';

const op = (id, blockCnt = 1) => chessRec({ id, stats: { atk: 0, blockCnt, maxHp: 1e6, respawnTime: 999 }, skill: null });

const foe = (key, o = {}) => enemyRec({ key, hp: 1e7, speed: 1, ...o });


function coreBlockingRoute(startPosition = [1, 8], overrides = {}) {
  return createRouteDefinition({
    pathMotionMode: 'WALK', startPosition, endPosition: [1, 0],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [],
    allowDiagonalMove: false, visitEveryTileCenter: false,
    visitEveryNodeCenter: false, visitEveryCheckPoint: true, ...overrides,
  });
}


function coreBlockingBattle(operators, enemies) {
  return createLegacyCombatBattle({ rows: 3, columns: 10, operators, enemies, maxTicks: 600 });
}


function coreBlockingUnit(battle, id) {
  return unitQueries.all(battle).find(unit => unit.id === id);
}


function coreBlockedBy(battle, id) {
  return blockingQueries.relations(battle).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })).filter(relation => relation.blockerUnitId === id).map(relation => relation.blockedUnitId);
}


test('core blocking: enemy volume consumes capacity and oversized enemies cannot be held', () => {
  const route = coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] });
  let battle = coreBlockingBattle(
    [{ definition: op(FRONT, 3), position: [1, 5] }],
    [2, 1, 1].map((weight, index) => ({ definition: foe(`core_weight_${index}`, { speed: 0, blockCnt: weight }), route })),
  );
  battle = stepBattle(battle, []);

  assert.deepEqual(coreBlockedBy(battle, 0), [1, 2]);
  const volume = id => {
    const unit = coreBlockingUnit(battle, id);
    return resolveVolume(unit.definition.blockable, unit.blockable);
  };
  const used = coreBlockedBy(battle, 0).reduce((sum, id) => sum + volume(id), 0);
  assert.equal(used, 3);
  assert.equal(volume(3), 1);

  let tooHeavy = coreBlockingBattle(
    [{ definition: op(FRONT, 1), position: [1, 5] }],
    [{ definition: foe('core_heavy', { speed: 0, blockCnt: 2 }), route }],
  );
  tooHeavy = stepBattle(tooHeavy, []);
  assert.deepEqual(blockingQueries.relations(tooHeavy).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })), []);
});


test('core blocking: ground eligibility comes from unit data while route motion is independent', () => {
  let battle = coreBlockingBattle(
    [{ definition: op(FRONT, 2), position: [1, 5] }],
    [
      { definition: foe('core_ground', { speed: 0, motion: 'WALK' }), route: coreBlockingRoute([1, 6], { pathMotionMode: 'FLY', spawnOffset: [-0.6, 0] }) },
      { definition: foe('core_air', { speed: 0, motion: 'FLY' }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] }) },
    ],
  );
  battle = stepBattle(battle, []);

  assert.deepEqual(coreBlockedBy(battle, 0), [1]);
  assert.equal(coreBlockingUnit(battle, 1).layer.type, 'GROUND');
  assert.equal(coreBlockingUnit(battle, 2).layer.type, 'AIR');
});


test('core blocking: a full operator lets another enemy walk through', () => {
  let battle = coreBlockingBattle(
    [{ definition: op(FRONT), position: [1, 5] }],
    [
      { definition: foe('core_still', { speed: 0 }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] }) },
      { definition: foe('core_passing'), route: coreBlockingRoute() },
    ],
  );

  do {
    battle = stepBattle(battle, []);
  } while (battle.result === null && coreBlockingUnit(battle, 2).position[0] >= 4.2);

  assert.deepEqual(coreBlockedBy(battle, 0), [1]);
  assert.ok(coreBlockingUnit(battle, 2).position[0] < 4.2);
});


test('core blocking: the first registered eligible blocker wins when both contact a stationary enemy', () => {
  let battle = coreBlockingBattle(
    [{ definition: op(FRONT), position: [1, 6] }, { definition: op(BACK), position: [1, 5] }],
    [{ definition: foe('core_still', { speed: 0 }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  );
  battle = stepBattle(battle, []);

  assert.deepEqual(coreBlockedBy(battle, 0), [2]);
  assert.deepEqual(coreBlockedBy(battle, 1), []);
});


test('core visibility: blocker death releases its enemy before movement in the same tick', () => {
  let battle = coreBlockingBattle(
    [{ definition: chessRec({ id: FRONT, stats: { maxHp: 10, atk: 0, def: 0, blockCnt: 1 }, skill: null }), position: [1, 5] }],
    [{ definition: foe('core_killer', { atk: 1000 }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] }) }],
  );
  const acquired = (battle = stepBattle(battle, []));
  assert.equal(acquired.events.some(event => event.type === 'UNIT_REMOVED'), false);
  assert.deepEqual(coreBlockedBy(battle, 0), [1]);
  const stopped = coreBlockingUnit(battle, 1).position;
  const death = (battle = stepBattle(battle, []));
  const resumed = coreBlockingUnit(battle, 1).position;

  assert.ok(death.events.some(event => event.type === 'UNIT_REMOVED' && event.unitId === 0 && event.reason === 'DEATH'));
  assert.deepEqual(blockingQueries.relations(battle).map(({ blocker, blocked }) => ({ blockerUnitId: blocker.id, blockedUnitId: blocked.id })), []);
  assert.ok(resumed[0] < stopped[0]);
  assert.ok(Math.abs(stopped[0] - resumed[0] - coreBlockingUnit(battle, 1).definition.locomotion.speed) < 1e-9);
  battle = stepBattle(battle, []);
  assert.ok(coreBlockingUnit(battle, 1).position[0] < resumed[0]);
});


test('core visibility: a freed front operator takes over after movement and holds the next tick', () => {
  let battle = coreBlockingBattle(
    [
      { definition: chessRec({ id: FRONT, stats: { maxHp: 1e6, atk: 100, def: 0, blockCnt: 1, bat: 1 / 30 }, skill: null }), position: [1, 6] },
      { definition: chessRec({ id: BACK, stats: { maxHp: 10, atk: 0, def: 0, blockCnt: 1 }, skill: null }), position: [1, 5] },
    ],
    [
      { definition: foe('core_front_target', { hp: 101, speed: 0 }), route: coreBlockingRoute([1, 7], { spawnOffset: [-0.4, 0] }) },
      { definition: foe('core_survivor', { atk: 1000 }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.6, 0] }) },
    ],
  );
  const acquired = (battle = stepBattle(battle, []));
  assert.equal(acquired.events.some(event => event.type === 'UNIT_REMOVED'), false);
  assert.deepEqual(coreBlockedBy(battle, 0), [2]);
  assert.deepEqual(coreBlockedBy(battle, 1), [3]);
  const stopped = coreBlockingUnit(battle, 3).position;
  const released = (battle = stepBattle(battle, []));
  const position = coreBlockingUnit(battle, 3).position;

  assert.deepEqual(released.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [2, 1]);
  assert.ok(Math.abs(stopped[0] - position[0] - coreBlockingUnit(battle, 3).definition.locomotion.speed) < 1e-9);
  assert.equal(position[1], 1);
  assert.deepEqual(coreBlockedBy(battle, 0), [3]);
  battle = stepBattle(battle, []);
  assert.deepEqual(coreBlockedBy(battle, 0), [3]);
  assert.deepEqual(coreBlockingUnit(battle, 3).position, position);
});


test('core blocking: the held enemy outranks a nearer in-range enemy and can be attacked outside the facing range', () => {
  let battle = coreBlockingBattle(
    [{ definition: chessRec({ id: FRONT, stats: { atk: 100, maxHp: 1e6, blockCnt: 1 }, skill: null }), position: [1, 5], direction: 'LEFT' }],
    [
      { definition: foe('core_held', { speed: 0 }), route: coreBlockingRoute([1, 6], { spawnOffset: [-0.35, 0] }) },
      { definition: foe('core_in_range', { speed: 0 }), route: coreBlockingRoute([1, 4], { spawnOffset: [0.4, 0] }), tick: 1 },
    ],
  );
  battle = stepBattle(battle, []);
  assert.deepEqual(coreBlockedBy(battle, 0), [1]);
  const { events } = (battle = stepBattle(battle, []));

  assert.deepEqual(coreBlockedBy(battle, 0), [1]);
  assert.equal(Math.round(coreBlockingUnit(battle, 1).position[0]), 6);
  assert.deepEqual(events.filter(event => event.type === 'ACTION' && event.sourceUnitId === 0).map(event => event.targetUnitId), [1]);
  assert.ok(coreBlockingUnit(battle, 1).vitality.hp < 1e7);
  assert.equal(coreBlockingUnit(battle, 2).vitality.hp, 1e7);
});
