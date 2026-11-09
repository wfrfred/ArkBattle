import assert from "node:assert/strict";
import { test } from "node:test";
import { chessRec, enemyRec } from "../helpers/records.js";
import { createLegacyCombatBattle } from "../helpers/legacy-combat.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";
import { step as advanceBattle } from "../../dist/core/battle/runtime.js";

const guard = (fields = {}) => chessRec({
    id: "guard", profession: "WARRIOR", stats: { atk: 300, blockCnt: 2 }, skill: null, ...fields,
});
const walker = (fields = {}) => enemyRec({ key: "walker", hp: 1e6, speed: 1, ...fields });
const coreCombatRoute = () => ({
    plan: { motionMode: "WALK", startPosition: [1, 8], endPosition: [1, 0],
        checkpoints: [], requireAllCheckpoints: true },
    spawnOffset: [0, 0], spawnRandomRange: [0, 0],
});

test('legacy adapter rejects unsupported content and preserves interval conversion', () => {
  const options = {
    rows: 3, columns: 10,
    operators: [{ definition: guard({ stats: { bat: 0.5, aspd: 200 } }), position: [1, 5] }],
    enemies: [{ definition: walker({ bat: 2, aspd: 100, speed: 1 }), route: coreCombatRoute() }],
  };
  let battle = createLegacyCombatBattle(options);
  assert.equal(battle.battlefield.units.get(0).action.actions.values().toArray()[0].definition.intervalTicks, 15);
  (battle = advanceBattle(battle, []));
  const enemy = battle.battlefield.units.get(1);

  assert.equal(enemy.action.actions.values().toArray()[0].definition.intervalTicks, 60);
  assert.equal(battle.battlefield.units.get(0).action.actions.values().toArray()[0].definition.speed, 200);
  assert.equal(enemy.definition.locomotion.speed, 1 / 60);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ skill: { spCost: 1 } }), position: [1, 5] }] }), /does not execute operator skills/);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ dmgType: 'heal' }), position: [1, 5] }] }), /only supports physical, arts and true damage/);
  assert.throws(() => createLegacyCombatBattle({ ...options, operators: [{ definition: guard({ attackKind: 'none' }), position: [1, 5] }] }), /ordinary attacks/);
  assert.throws(() => createLegacyCombatSpec({
    ...options, operators: [{ definition: guard({ rangeGrid: [[0.5, 1]] }), position: [1, 5] }],
  }), { name: 'RangeError', message: 'invalid tile position' });
});
