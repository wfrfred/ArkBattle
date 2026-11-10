import assert from "node:assert/strict";
import { test } from "node:test";
import { battle as createBattle, get as getUnit } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import * as unitQueries from "../../dist/core/unit/index.js";
import { resolveDefense } from "../../dist/core/unit/capability/vitality/index.js";
import { selectDamage } from "../helpers/targeting.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { step as stepBattle } from "../../dist/core/battle/index.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";
import { actionCapability } from "../helpers/actions.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { ref as skillRef, definition as createSkillDefinition } from "../helpers/skill.js";
import { create as createSkill, activate as activateSkill, advance as advanceSkill } from "../../dist/core/unit/skill/index.js";
import { recover } from "../../dist/core/unit/skill/sp.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import { elementValues, setContribution } from "../../dist/core/unit/capability/elemental/index.js";
import { createArknightsElementalDefinition } from "../../dist/data/effect/elemental.js";
import { stun } from "../../dist/core/effects/control.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";

const range = [{ type: 'CIRCLE', offset: [0, 0], radius: 20 }];
const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.1 };
function action(interval = 1) {
  return createAttack({ id: 'normal-attack', triggerBindingId: 'primary', intervalTicks: interval, recoveryTicks: 0,
    targetGroups: [{ id: 'primary', select: selectDamage({ geometry: range, canTargetAir: true }),
      operations: [{ type: 'DAMAGE', power: 1, damageType: 'TRUE' }] }], followUps: [] });
}
function definition(receiver = 'CHARACTER', overrides = {}) {
  return { hooks: Hooks.empty(), id: `element-${receiver}`,
    vitality: { maxHp: 100000, defense: 500, resistance: 50 },
    offense: { attack: 100 },
    elemental: createArknightsElementalDefinition({ receiver }), ...overrides };
}

function receiverBattle(receiver = 'CHARACTER', overrides = {}) {
  return createBattle([{ position: [1, 0], definition: definition(receiver, overrides) }]);
}
function element(work, type, tick = work.tick, power = 1000) {
  const request = { target: unitRef(getUnit(work, 0)), source: null, parameters: { type, power } };
  return epDamage.applyDamage(request, epDamage.calculateDamage({ ...work, tick }, request));
}
function advance(work, tick) {
  for (let next = work.tick + 1; next <= tick; next++) {
    work = effects.advance({ ...work, tick: next });
  }
  return work;
}
function defense(work) {
  const unit = getUnit(work, 0);
  return resolveDefense(work, unit);
}
function power(work) {
  return resolveAttack(work, getUnit(work, 0));
}
function near(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`); }

test('elemental execution: erosion defense loss survives recovery and stacks on the next burst for both receiver classes', () => {
  for (const [receiver, duration, reduction, secondHpLoss] of [['CHARACTER', 300, 100, 500], ['ENEMY', 240, 120, 5000]]) {
    let firstState = receiverBattle(receiver);
    firstState = element(firstState, 'EROSION').state;
    firstState = advance(firstState, duration);
    assert.equal(defense(firstState), 500 - reduction);
    assert.equal(getUnit(firstState, 0).elemental.burst, null);
    const recoveredHp = getUnit(firstState, 0).vitality.hp;
    firstState = element(firstState, 'EROSION', duration).state;
    assert.equal(defense(firstState), 500 - 2 * reduction);
    assert.equal(recoveredHp - getUnit(firstState, 0).vitality.hp, secondHpLoss);
  }
});

test('elemental execution: character necrosis settles fifteen magical pulses, drains SP and blocks recovery and activation until recovery ends', () => {
  const skill = createSkillDefinition({ id: 'necrosis-sp', sp: { initial: 20, capacity: 30, requirement: 1, cost: 1, recovery: { type: 'TIME', intervalTicks: 30 } } });
  let work = receiverBattle('CHARACTER', { skill: { initialize: state => createSkill(state, skill) } });
  work = element(work, 'NECROSIS').state;
  assert.equal(getUnit(work, 0).vitality.hp, 100000);
  assert.equal(activateSkill(work, skillRef(getUnit(work, 0))).value, null);
  work = recover(work, unitRef(getUnit(work, 0)), 'TIME', 3).state;
  assert.equal(getUnit(work, 0).skill.sp.value, 20);
  work = advance(work, 30);
  assert.equal(getUnit(work, 0).vitality.hp, 99950);
  assert.equal(getUnit(work, 0).skill.sp.value, 19);
  work = advanceSkill(work, unitRef(getUnit(work, 0)));
  assert.equal(getUnit(work, 0).skill.sp.value, 19);
  work = advance(work, 450);
  assert.equal(getUnit(work, 0).vitality.hp, 99250);
  assert.equal(getUnit(work, 0).skill.sp.value, 5);
  work = recover(work, unitRef(getUnit(work, 0)), 'TIME', 3).state;
  assert.equal(getUnit(work, 0).skill.sp.value, 8);
  assert.notEqual(activateSkill(work, skillRef(getUnit(work, 0))).value, null);
});

test('elemental execution: necrosis shares its recovery budget with periodic damage and fading attack loss', () => {
  let work = element(receiverBattle('ENEMY'), 'NECROSIS').state;
  assert.equal(power(work), 50);
  work = advance(work, 150);
  near(power(work), 100 * (1 - 0.5 * 10 / 15));
  assert.equal(getUnit(work, 0).vitality.hp, 96000);

  const speed = value => setContribution('burstRecoverySpeed', {
    id: 'burst-speed', value: [modifier({ finalScaler: value })],
  });
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), speed(0));
  work = advance(work, 210);
  assert.equal(getUnit(work, 0).vitality.hp, 96000);
  near(power(work), 100 * (1 - 0.5 * 10 / 15));
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), speed(2));
  work = advance(work, 285);
  near(power(work), 100 * (1 - 0.5 * 5 / 15));
  assert.equal(getUnit(work, 0).vitality.hp, 92000);
  work = advance(work, 360);
  assert.equal(power(work), 100);
  assert.equal(getUnit(work, 0).vitality.hp, 88000);
  const damage = work.events.filter(event => event.type === 'DAMAGE');
  assert.equal(damage.length, 15);
  assert.equal(damage.every(event => event.amount === 800 && event.damageType === 'ELEMENTAL'), true);

  const started = element(receiverBattle('ENEMY'), 'NECROSIS');
  const ended = elemental.cancel(advance(started.state, 29), started.value.application.burst);
  assert.equal(getUnit(ended, 0).vitality.hp, 100000);
  assert.deepEqual(getUnit(ended, 0).elemental.ep, elementValues(1000));
});

function battle(receiver, type) {
  const casterAttack = createAttack({ ...action(10000).attack,
    targetGroups: [{ ...action().attack.targetGroups[0], operations: [
      { type: 'ELEMENTAL_INJURY', elementType: type, power: 1000 },
      ...action().attack.targetGroups[0].operations,
    ] }],
  });
  const actor = (side, attack) => ({
    id: side, hooks: Hooks.empty(), vitality: { maxHp: 100000, defense: 500, resistance: 50 },
    targetable: { taunt: 0, restrictions: [] }, allegiance: { side },
    hitbox: { shape: hit }, action: actionCapability(attack),
  });
  return createBattle([
    { definition: actor('ALLY', casterAttack), position: [0, 0] },
    { definition: { ...actor('ENEMY', action()),
      elemental: createArknightsElementalDefinition({ receiver }),
    }, position: [1, 0] },
  ], { rows: 1, columns: 8 });
}

function victim(runtime) { return unitQueries.all(runtime).find(entry => entry.id === 1); }

test('elemental runtime: unused neural paralysis survives recovery and the next burst resets its remaining charges', () => {
  let runtime = battle('ENEMY', 'NEURAL');
  runtime = effects.install(runtime, unitRef(victim(runtime)), stun, {
    expiration: { type: 'DEADLINE', tick: 301 },
  }).state;
  const events = [];
  for (let tick = 0; tick <= 300; tick++) events.push(...(runtime = stepBattle(runtime, [])).events);
  assert.equal(victim(runtime).elemental.burst, null);
  assert.equal(events.some(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1), false);
  events.push(...(runtime = stepBattle(runtime, [])).events);
  assert.equal(events.filter(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1).length, 1);

  const request = { target: unitRef(victim(runtime)), source: null, parameters: { type: 'NEURAL', power: 1000 } };
  runtime = epDamage.applyDamage(request, epDamage.calculateDamage(runtime, request)).state;
  while (runtime.tick <= 365) events.push(...(runtime = stepBattle(runtime, [])).events);
  const cancelled = events.filter(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1);
  assert.equal(cancelled.length, 4);
  const hits = events.filter(event => event.type === 'DAMAGE' && event.targetUnitId === 0);
  assert.equal(hits.length > 0, true);
  assert.equal(cancelled.every(event => event.tick < hits[0].tick), true);
});
