import { isCompleted } from "../../dist/core/battle/schedule/index.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createTacticalContentDemo, defaults } from '../../dist/legacy/tactical-demo-content.js';
import { parseLevelDefinition } from '../../dist/data/arknights/level.js';
import { initialize as initializeBattle, step as stepBattle } from '../../dist/core/battle/runtime.js';
import { hasVitality } from '../../dist/core/unit/capability/vitality/index.js';

const data = JSON.parse(readFileSync(new URL('../fixtures/arknights/main-mode-units.json', import.meta.url)));
const level = parseLevelDefinition(JSON.parse(readFileSync(new URL('../fixtures/arknights/level_act1autochess_m01.json', import.meta.url))), { consumeTileBlackboard: (_context, entry) => ['isValidHand', 'previewNotAlloed'].includes(entry.key) });
test('main-mode preparation connects real operators and enemies through a complete battle', () => {
  const configuration = { ...defaults, mudrock: { ...defaults.mudrock,
    level: 90, potential: 5, skillLevel: 10,
    module: { id: 'uniequip_002_mudrok', level: 3 },
  } };
  const prepared = createTacticalContentDemo(level.map, level.routes[0], data, configuration);
  let battle = initializeBattle(prepared.input);
  let hasProjectile = false;
  let sawCombat = false;
  let triggeredMelantha = false;
  let activatedMelantha = false;
  while (!isCompleted(battle.schedule) && battle.tick < prepared.input.maxTicks) {
    const guard = unitQueries.all(battle).find(unit => unit.id === 1);
    const commands = !triggeredMelantha && (guard?.skill.sp?.value ?? 0) >= (guard?.skill.definition.sp?.requirement ?? Infinity)
      ? [{ type: 'ACTIVATE_SKILL', ref: unitQueries.ref(guard) }] : [];
    if (commands.length) triggeredMelantha = true;
    const before = battle;
    battle = stepBattle(battle, commands);
    const currentGuard = guard === undefined ? undefined : unitQueries.get(battle, unitQueries.ref(guard));
    activatedMelantha ||= currentGuard !== undefined && currentGuard.skill.activation !== null;
    hasProjectile ||= battle.battlefield.projectiles.size > 0;
    sawCombat ||= battle.events.some(event => event.type === 'UNIT_REMOVED' && event.reason === 'DEATH') ||
      unitQueries.all(before).filter(hasVitality).some(previous => {
        const current = unitQueries.get(battle, unitQueries.ref(previous));
        return current !== undefined && current.vitality.hp < previous.vitality.hp;
      });
  }
  assert.equal(isCompleted(battle.schedule), true);
  assert.ok(hasProjectile);
  assert.ok(sawCombat);
  assert.ok(activatedMelantha);
});
