// Contract: [elemental](../../../docs/architecture/elemental.md#2-burst-effect-与标准规则).
import { attribute as defineAttribute, vitality as defineVitality } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle as createBattle, get as getUnit } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../../dist/core/unit/operations.js";
import * as unitQueries from "../../../dist/core/unit/index.js";
import { resolveDefense } from "../../../dist/core/unit/capability/vitality/index.js";
import { selectDamage } from "../../helpers/targeting.js";
import * as effects from "../../../dist/core/effect/index.js";
import { step as stepBattle } from "../../../dist/core/battle/index.js";
import { create as createAttack } from "../../../dist/content/actions/attack.js";
import { actionCapability } from "../../helpers/actions.js";
import { ref as unitRef } from "../../../dist/core/unit/index.js";
import { ref as skillRef, definition as createSkillDefinition } from "../../helpers/skill.js";
import { activate as activateSkill, advance as advanceSkill, finish as finishSkill } from "../../../dist/core/unit/capability/skill/index.js";
import { recover } from "../../../dist/core/unit/capability/skill/sp.js";
import { resolveAttack } from "../../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";
import * as elemental from "../../../dist/core/unit/capability/elemental/index.js";
import { elementValues, setContribution } from "../../../dist/core/unit/capability/elemental/index.js";
import { create as createElementalDefinition } from "../../../dist/content/elemental.js";
import { stun } from "../../../dist/core/effects/control.js";
import * as epDamage from "../../../dist/core/battle/resource/ep/damage/index.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as actions from "../../../dist/core/unit/capability/action/index.js";
import { dispatchReleased } from "../../../dist/core/unit/capability/action/release.js";
import { resolveSpeed } from "../../../dist/core/unit/capability/action/timing.js";
import { effectInitial } from "../../helpers/effect.js";

const range = [{ type: 'CIRCLE', offset: [0, 0], radius: 20 }];
const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.1 };
function action(interval = 1) {
  return createAttack({ id: 'normal-attack', triggerBindingId: 'primary', period: { type: "FIXED", ticks: interval }, timing: { type: 'FIXED', windupTicks: 0, recoveryTicks: 0 },
    targetGroups: [{ id: 'primary', select: selectDamage({ geometry: range, canTargetAir: true }),
      operations: [{ type: 'DAMAGE', attackType: 'NORMAL', applyWay: 'MELEE', power: 1, damageType: 'TRUE' }] }], followUps: [] });
}
function definition(receiver = 'CHARACTER', overrides = {}) {
  return { hooks: Hooks.empty(), id: `element-${receiver}`,
    vitality: defineVitality(100000, { defense: defineAttribute(500), resistance: defineAttribute(50, 0, 100) }),
    offense: { attack: defineAttribute(100) },
    elemental: createElementalDefinition({ receiver }), ...overrides };
}

function receiverBattle(receiver = 'CHARACTER', overrides = {}) {
  return createBattle([{ position: [1, 0], definition: definition(receiver, overrides) }]);
}
function element(work, type, tick = work.tick, power = 1000) {
  const request = { target: unitRef(getUnit(work, 0)), source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
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
    const recoveredHp = getUnit(firstState, 0).vitality.health.hp;
    firstState = element(firstState, 'EROSION', duration).state;
    assert.equal(defense(firstState), 500 - 2 * reduction);
    assert.equal(recoveredHp - getUnit(firstState, 0).vitality.health.hp, secondHpLoss);
  }
});

test('elemental execution: character necrosis settles fifteen magical pulses, drains SP and blocks recovery and activation until recovery ends', () => {
  const skill = createSkillDefinition({
    id: 'necrosis-sp',
    sp: { initial: 20, capacity: 30, recovery: { type: 'TIME' }, recoverySpeed: defineAttribute(1), recoveryMultiplier: defineAttribute(1) },
    activation: { trigger: 'MANUAL', ignoreRestrictions: [], requirement: 1, cost: 1, initialize: () => ({ state: {}, duration: { type: 'TIME', durationTicks: 30 } }) },
  });
  let work = receiverBattle('CHARACTER', { skill: { definition: skill } });
  work = element(work, 'NECROSIS').state;
  assert.equal(getUnit(work, 0).vitality.health.hp, 100000);
  assert.equal(activateSkill(work, skillRef(getUnit(work, 0))).value, null);
  work = recover(work, unitRef(getUnit(work, 0)), 'TIME', 3).state;
  assert.equal(getUnit(work, 0).skill.sp.value, 20);
  work = advance(work, 30);
  assert.equal(getUnit(work, 0).vitality.health.hp, 99950);
  assert.equal(getUnit(work, 0).skill.sp.value, 19);
  work = advanceSkill(work, unitRef(getUnit(work, 0)));
  assert.equal(getUnit(work, 0).skill.sp.value, 19);
  work = advance(work, 450);
  assert.equal(getUnit(work, 0).vitality.health.hp, 99250);
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
  assert.equal(getUnit(work, 0).vitality.health.hp, 96000);

  const speed = value => setContribution('burstRecoverySpeed', {
    id: 'burst-speed', value: [modifier({ finalScaler: value })],
  });
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), speed(0));
  work = advance(work, 210);
  assert.equal(getUnit(work, 0).vitality.health.hp, 96000);
  near(power(work), 100 * (1 - 0.5 * 10 / 15));
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), speed(2));
  work = advance(work, 285);
  near(power(work), 100 * (1 - 0.5 * 5 / 15));
  assert.equal(getUnit(work, 0).vitality.health.hp, 92000);
  work = advance(work, 360);
  assert.equal(power(work), 100);
  assert.equal(getUnit(work, 0).vitality.health.hp, 88000);
  const damage = work.events.filter(event => event.type === 'DAMAGE');
  assert.equal(damage.length, 15);
  assert.equal(damage.every(event => event.amount === 800 && event.damageType === 'ELEMENTAL'), true);

  const started = element(receiverBattle('ENEMY'), 'NECROSIS');
  const ended = elemental.cancel(advance(started.state, 29), started.value.application.burst);
  assert.equal(getUnit(ended, 0).vitality.health.hp, 100000);
  assert.deepEqual(getUnit(ended, 0).elemental.ep, elementValues(1000));
});

function battle(receiver, type) {
  const casterAttack = createAttack({ ...action(10000).attack,
    targetGroups: [{ ...action().attack.targetGroups[0], operations: [
      { type: 'ELEMENTAL_INJURY', attackType: 'ADDITION', applyWay: 'MELEE', elementType: type, power: 1000 },
      ...action().attack.targetGroups[0].operations,
    ] }],
  });
  const actor = (side, attack) => ({
    id: side, hooks: Hooks.empty(), vitality: defineVitality(100000, { defense: defineAttribute(500), resistance: defineAttribute(50, 0, 100) }),
    targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] }, classification: { type: "DEVICE", side, filterTags: [], groupTags: [] },
    hitbox: { shape: hit }, action: actionCapability(attack),
  });
  return createBattle([
    { definition: actor('ALLY', casterAttack), position: [0, 0] },
    { definition: { ...actor('ENEMY', action()),
      elemental: createElementalDefinition({ receiver }),
    }, position: [1, 0] },
  ], { rows: 1, columns: 8 });
}

function victim(runtime) { return unitQueries.all(runtime).find(entry => entry.ref.id === 1); }

test('elemental runtime: unused neural paralysis survives recovery and the next burst resets its remaining charges', () => {
  let runtime = battle('ENEMY', 'NEURAL');
  runtime = effects.install(runtime, unitRef(victim(runtime)), stun, {
    ...effectInitial,
    expiration: { type: 'DEADLINE', tick: 301 },
  }).state;
  const events = [];
  for (let tick = 0; tick <= 300; tick++) events.push(...(runtime = stepBattle(runtime, [])).events);
  assert.equal(victim(runtime).elemental.burst, null);
  assert.equal(events.some(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1), false);
  events.push(...(runtime = stepBattle(runtime, [])).events);
  assert.equal(events.filter(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1).length, 1);

  const request = { target: unitRef(victim(runtime)), source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: 'NEURAL', power: 1000 } };
  runtime = epDamage.applyDamage(request, epDamage.calculateDamage(runtime, request)).state;
  while (runtime.tick <= 365) events.push(...(runtime = stepBattle(runtime, [])).events);
  const cancelled = events.filter(event => event.type === 'ACTION_CANCELLED' && event.sourceUnitId === 1);
  assert.equal(cancelled.length, 4);
  const hits = events.filter(event => event.type === 'DAMAGE' && event.targetUnitId === 0);
  assert.equal(hits.length > 0, true);
  assert.equal(cancelled.every(event => event.tick < hits[0].tick), true);
});

test('mania counts each released action once and each skill activation, caps self-damage and keeps its independent character program after recovery cancellation', () => {
  const attack = createAttack({
    id: 'mania-attack', triggerBindingId: 'primary', period: { type: 'ATTACK_SPEED' }, timing: { type: 'FIXED', windupTicks: 0, recoveryTicks: 0 },
    targetGroups: [{ id: 'primary', select: selectDamage({ geometry: range, canTargetAir: true }),
      operations: [{ type: 'DAMAGE', attackType: 'NORMAL', applyWay: 'MELEE', power: 1, damageType: 'TRUE' }] }],
    afterOutput: (work, source, self) => dispatchReleased(work, actions.executionRef(self)),
  });
  const skill = createSkillDefinition({
    id: 'mania-hit',
    activation: { trigger: 'MANUAL', ignoreRestrictions: [], requirement: 0, cost: 0, initialize: () => ({ state: {}, duration: { type: 'TIME', durationTicks: 0 } }) },
    sp: { initial: 0, capacity: 30, recovery: { type: 'HIT', amount: 1 }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
  });
  let work = createBattle([
    { position: [0, 0], definition: definition('CHARACTER', {
      classification: { type: "DEVICE", side: 'ALLY', filterTags: [], groupTags: [] }, action: { ...actionCapability(attack), interval: defineAttribute(30) },
      skill: { definition: skill },
    }) },
    { position: [1, 0], definition: {
      id: 'blocked-output', classification: { type: "DEVICE", side: 'ENEMY', filterTags: [], groupTags: [] },
      vitality: defineVitality(100000),
      targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] }, hitbox: { shape: hit },
      hooks: Hooks.empty().set(hpDamage.receiving, {
        id: 'block-output',
        invoke: (state, context, pending) => ({
          state, value: hpDamage.cancel(pending, 'BLOCKED', context.forbidden),
        }),
      }),
    } },
  ]);
  const started = element(work, 'MANIA');
  const burst = started.value.application.burst;
  work = started.state;
  const speed = state => resolveSpeed(getUnit(state, 0));
  assert.equal(speed(work), 150);
  assert.equal(getUnit(work, 0).vitality.health.hp, 100000);
  const pulses = [];
  const next = () => {
    work = stepBattle(work, []);
    pulses.push(...work.events.filter(event => event.type === 'DAMAGE' && event.targetUnitId === 0).map(event => event.amount));
  };
  while (work.tick < 30) next();
  assert.deepEqual(pulses, [200]);
  assert.equal(getUnit(work, 1).vitality.health.hp, 100000);
  assert.equal(getUnit(work, 0).skill.sp.value, 1);

  const activated = activateSkill(work, skillRef(getUnit(work, 0)));
  assert.notEqual(activated.value, null);
  work = activated.state;
  work = elemental.cancel(work, burst);
  assert.equal(getUnit(work, 0).elemental.burst, null);
  assert.deepEqual(getUnit(work, 0).elemental.ep, elementValues(1000));
  assert.equal(speed(work), 150);
  while (work.tick <= 450) next();
  assert.deepEqual(pulses.slice(0, 6), [200, 300, 400, 450, 550, 600]);
  assert.equal(pulses.length, 15);
  assert.equal(pulses.slice(6).every(amount => amount === 600), true);
  assert.equal(getUnit(work, 0).skill.sp.value, 15);
  assert.equal(speed(work), 100);
});

test('mania counts successful skill activations on a host without Action', () => {
  const skill = createSkillDefinition({
    id: 'mania-skill-only', sp: null,
    activation: { trigger: 'MANUAL', ignoreRestrictions: [], requirement: 0, cost: 0, initialize: () => ({ state: {}, duration: { type: 'INFINITE' } }) },
  });
  let work = element(receiverBattle('CHARACTER', {
    skill: { definition: skill },
  }), 'MANIA').state;
  const first = activateSkill(work, skillRef(getUnit(work, 0)));
  assert.notEqual(first.value, null);
  const rejected = activateSkill(first.state, skillRef(getUnit(first.state, 0)));
  assert.equal(rejected.value, null);
  work = advance(rejected.state, 30);
  assert.equal(getUnit(work, 0).vitality.health.hp, 99850);

  work = finishSkill(work, first.value);
  const second = activateSkill(work, skillRef(getUnit(work, 0)));
  assert.notEqual(second.value, null);
  work = advance(second.state, 60);
  assert.equal(getUnit(work, 0).vitality.health.hp, 99650);
});

test('enemy mania ramps on its own Tick clock, stops with recovery and includes the final pulse', () => {
  const attack = action(10000);
  const skill = createSkillDefinition({
    id: 'enemy-mania-hit', activation: null,
    sp: { initial: 0, capacity: 30, recovery: { type: 'HIT', amount: 1 }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
  });
  const setup = () => receiverBattle('ENEMY', {
    action: actionCapability(attack), skill: { definition: skill },
  });
  const speed = state => resolveSpeed(getUnit(state, 0));
  const damage = state => state.events.filter(event => event.type === 'DAMAGE');
  const started = element(setup(), 'MANIA');
  let work = started.state;
  assert.equal(speed(work), 120);
  assert.equal(damage(work).length, 0);
  work = advance(work, 30);
  assert.deepEqual(damage(work).map(event => [event.amount, event.damageType]), [[290, 'ELEMENTAL']]);
  const ep = getUnit(work, 0).elemental.ep;
  const recoverySpeed = value => setContribution('burstRecoverySpeed', {
    id: 'mania-clock', value: [modifier({ finalScaler: value })],
  });
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), recoverySpeed(0));
  work = advance(work, 60);
  assert.deepEqual(getUnit(work, 0).elemental.ep, ep);
  work = applyUnitChanges(work, unitRef(getUnit(work, 0)), recoverySpeed(2));
  work = advance(work, 90);
  assert.deepEqual(damage(work).map(event => event.amount), [290, 420, 550]);
  assert.equal(getUnit(work, 0).skill.sp.value, 0);
  work = elemental.cancel(work, started.value.application.burst);
  assert.equal(speed(work), 100);
  work = advance(work, 120);
  assert.equal(damage(work).length, 3);

  work = advance(element(setup(), 'MANIA').state, 450);
  assert.equal(damage(work).length, 15);
  assert.equal(damage(work).at(-1).amount, 2110);
  assert.equal(getUnit(work, 0).vitality.health.hp, 82000);
  assert.equal(getUnit(work, 0).elemental.burst, null);
  assert.equal(speed(work), 100);
});
