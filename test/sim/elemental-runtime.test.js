import assert from "node:assert/strict";
import { test } from "node:test";
import { battle as createBattle } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import * as unitQueries from "../../dist/core/unit/index.js";
import { resolveDefense, resolveResistance } from "../../dist/core/unit/capability/vitality/index.js";
import { and, damage as damageFilter, range as inRange, first, distance } from "../../dist/core/battle/targeting/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { step as stepBattle } from "../../dist/core/battle/index.js";
import { getUnit, initialize } from "../helpers/unit.js";
import { create as createAttack } from "../../dist/content/actions/attack.js";
import { actionCapability } from "../helpers/actions.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { ref as skillRef, definition as createSkillDefinition } from "../helpers/skill.js";
import { create as createSkill, activate as activateSkill, advance as advanceSkill } from "../../dist/core/unit/skill/index.js";
import { recover } from "../../dist/core/unit/skill/sp.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import { get as getBurst, elementValues, setContribution } from "../../dist/core/unit/capability/elemental/index.js";
import { createArknightsElementalDefinition } from "../../dist/data/arknights/elemental.js";
import { effectFixtureWork } from "../helpers/effects.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";

const range = [{ type: 'CIRCLE', offset: [0, 0], radius: 20 }];
const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.1 };
function action(interval = 1) {
  return createAttack({ id: 'normal-attack', triggerBindingId: 'primary', intervalTicks: interval, recoveryTicks: 0,
    targetGroups: [{ id: 'primary', targeting: {
      purposes: ['DAMAGE'], filter: and(damageFilter, inRange(range)), selector: first(1, distance),
    }, operations: [{ type: 'DAMAGE', power: 1, damageType: 'TRUE' }] }], followUps: [] });
}
function definition(receiver = 'CHARACTER', overrides = {}, elementOptions = {}) {
  return { hooks: Hooks.empty(), id: `element-${receiver}`, targetable: { restrictions: [] }, spatialPresence: {}, vitality: { maxHp: 100000, defense: 500, resistance: 50 },
    offense: { attack: 100 },
    allegiance: { side: receiver === 'CHARACTER' ? 'ALLY' : 'ENEMY' },
    layer: { type: 'GROUND' }, hitbox: { shape: hit },
    action: actionCapability(action()),
    elemental: createArknightsElementalDefinition({ receiver, ...elementOptions }), ...overrides };
}
function unit(receiver = 'CHARACTER', overrides = {}, elementOptions = {}) {
  return initialize({ id: 1, position: [1, 0], definition: definition(receiver, overrides, elementOptions) });
}
function element(work, type, tick = work.tick, power = 1000) {
  const request = { target: unitRef(getUnit(work, 1)), type, power, source: null };
  return epDamage.applyDamage(request, epDamage.calculateDamage({ ...work, tick }, request));
}
function advance(work, tick) {
  for (let next = work.tick + 1; next <= tick; next++) {
    work = effects.advance({ ...work, tick: next });
    work = elemental.advance(work, unitRef(getUnit(work, 1)));
  }
  return work;
}
function defense(work) {
  const unit = getUnit(work, 1);
  return resolveDefense(work, unitRef(unit));
}
function power(work) {
  return resolveAttack(work, unitRef(getUnit(work, 1)));
}
function near(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`); }

test('elemental execution: standard immediate bursts apply class-specific damage after their defense changes and retain only EP origin', () => {
  for (const [receiver, type, expectedHpLoss, expectedDefense, expectedResistance] of [
    ['CHARACTER', 'NEURAL', 1000, 500, 50], ['CHARACTER', 'EROSION', 400, 400, 50],
    ['CHARACTER', 'BURN', 840, 500, 30], ['ENEMY', 'NEURAL', 6000, 500, 50],
    ['ENEMY', 'EROSION', 5000, 380, 50], ['ENEMY', 'BURN', 7000, 500, 30],
  ]) {
    const original = effectFixtureWork(unit(receiver));
    const result = element(original, type);
    const input = result.state;
    assert.equal(result.value.kind, 'APPLIED');
    assert.equal(getBurst(result.state, result.value.application.burst).source, null);
    assert.equal(getUnit(input, 1).vitality.hp, 100000 - expectedHpLoss);
    assert.equal(defense(input), expectedDefense);
    assert.equal(resolveResistance(input, unitRef(getUnit(input, 1))), expectedResistance);
    const hits = input.events.filter(event => event.type === 'DAMAGE');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].amount, expectedHpLoss);
    assert.equal(getUnit(original, 1).vitality.hp, 100000);
    assert.deepEqual(getUnit(input, 1).elemental.ep, elementValues(0));
  }
});

test('elemental execution: erosion defense loss survives recovery and stacks on the next burst for both receiver classes', () => {
  for (const [receiver, duration, reduction, secondHpLoss] of [['CHARACTER', 300, 100, 500], ['ENEMY', 240, 120, 5000]]) {
    let firstState = effectFixtureWork(unit(receiver));
    firstState = element(firstState, 'EROSION').state;
    firstState = advance(firstState, duration);
    assert.equal(defense(firstState), 500 - reduction);
    assert.equal(getUnit(firstState, 1).elemental.burst, null);
    const recoveredHp = getUnit(firstState, 1).vitality.hp;
    firstState = element(firstState, 'EROSION', duration).state;
    assert.equal(defense(firstState), 500 - 2 * reduction);
    assert.equal(recoveredHp - getUnit(firstState, 1).vitality.hp, secondHpLoss);
  }
});

test('elemental execution: character necrosis settles fifteen magical pulses, drains SP and blocks recovery and activation until recovery ends', () => {
  const skill = createSkillDefinition({ id: 'necrosis-sp', sp: { initial: 20, capacity: 30, requirement: 30, recovery: { type: 'TIME', intervalTicks: 30 } } });
  let work = effectFixtureWork(unit('CHARACTER', { skill: { initialize: state => createSkill(state, skill) } }));
  work = element(work, 'NECROSIS').state;
  assert.equal(getUnit(work, 1).vitality.hp, 100000);
  assert.equal(activateSkill(work, skillRef(getUnit(work, 1))).value.type, 'REJECTED');
  work = recover(work, unitRef(getUnit(work, 1)), 'TIME', 3).state;
  assert.equal(getUnit(work, 1).skill.sp.value, 20);
  work = advance(work, 30);
  assert.equal(getUnit(work, 1).vitality.hp, 99950);
  assert.equal(getUnit(work, 1).skill.sp.value, 19);
  work = advanceSkill(work, unitRef(getUnit(work, 1)));
  assert.equal(getUnit(work, 1).skill.sp.value, 19);
  work = advance(work, 450);
  assert.equal(getUnit(work, 1).vitality.hp, 99250);
  assert.equal(getUnit(work, 1).skill.sp.value, 5);
  assert.equal(work.events.filter(event => event.type === 'DAMAGE').length, 15);
  assert.equal(recover(work, unitRef(getUnit(work, 1)), 'TIME', 0).value.type, 'APPLIED');
  work = recover(work, unitRef(getUnit(work, 1)), 'TIME', 3).state;
  assert.equal(getUnit(work, 1).skill.sp.value, 8);
});

test('elemental execution: enemy necrosis damage is elemental and its attack reduction fades before full recovery', () => {
  let work = effectFixtureWork(unit('ENEMY'));
  work = element(work, 'NECROSIS').state;
  assert.equal(power(work), 50);
  work = advance(work, 150);
  near(power(work), 100 * (1 - 0.5 * 10 / 15));
  assert.equal(getUnit(work, 1).vitality.hp, 96000);
  work = advance(work, 300);
  near(power(work), 100 * (1 - 0.5 * 5 / 15));
  work = advance(work, 450);
  assert.equal(power(work), 100);
  assert.equal(getUnit(work, 1).vitality.hp, 88000);
  const damage = work.events.filter(event => event.type === 'DAMAGE');
  assert.equal(damage.length, 15);
  assert.equal(damage.every(event => event.amount === 800 && event.damageType === 'ELEMENTAL'), true);
});

test('elemental execution: periodic output follows burst speed and does not pay out unused time on early exit', () => {
  let work = effectFixtureWork(unit('ENEMY'));
  work = element(work, 'NECROSIS').state;
  const speed = value => setContribution({id:1}, 'burstRecoverySpeed', {
    id:'burst-speed', value:[modifier({finalScaler:value})],
  });
  work = applyUnitChanges(work, [speed(0)]);
  work = advance(work, 60);
  assert.equal(getUnit(work, 1).vitality.hp, 100000);
  assert.equal(getUnit(work, 1).elemental.burst.remainingTicks, 450);
  work = applyUnitChanges(work, [speed(2)]);
  work = advance(work, 210);
  assert.equal(getUnit(work, 1).vitality.hp, 92000);
  near(power(work), 100 * (1 - 0.5 * 5 / 15));
  work = advance(work, 285);
  assert.equal(getUnit(work, 1).elemental.burst, null);
  assert.equal(getUnit(work, 1).vitality.hp, 88000);
  assert.equal(work.events.filter(event => event.type === 'DAMAGE').length, 15);
  assert.equal(power(work), 100);

  for (const end of [elemental.finish, elemental.cancel]) {
    const started = element(effectFixtureWork(unit('ENEMY')), 'NECROSIS');
    const partial = advance(started.state, 29);
    const ended = end(partial, started.value.application.burst);
    assert.equal(getUnit(ended, 1).elemental.burst, null);
    assert.equal(getUnit(ended, 1).vitality.hp, 100000);
    assert.equal(ended.events.filter(event => event.type === 'DAMAGE').length, 0);
  }
});

function route() {
  return createRouteDefinition({ pathMotionMode: 'WALK', startPosition: [0, 3], endPosition: [0, 7],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], allowDiagonalMove: false,
    visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true });
}
function spawn(definition, tick) {
  return { definition, route: route(), tick, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true, notCountInTotal: false };
}
function battle(receiver, type, { moving = false, onActionEnd } = {}) {
  const casterAttack = createAttack({ ...action(10000).attack,
    targetGroups: [{ ...action().attack.targetGroups[0], operations: [
      { type: 'ELEMENTAL_INJURY', elementType: type, power: 1000 },
      ...action().attack.targetGroups[0].operations,
    ] }],
  });
  const caster = definition('CHARACTER', { hooks: Hooks.empty(), id: 'caster', allegiance: { side: 'ALLY' },
    action: actionCapability(casterAttack) });
  const ordinaryAttack = action(1);
  const victimAttack = onActionEnd === undefined ? ordinaryAttack : {
    ...ordinaryAttack,
    onEnd(state, source, self, end) {
      onActionEnd(state, source, self, end);
      return ordinaryAttack.onEnd?.(state, source, self, end) ?? state;
    },
  };
  const victim = definition(receiver, { hooks: Hooks.empty(), id: 'victim', allegiance: { side: 'ENEMY' },
    action: actionCapability(victimAttack),
    ...(moving ? { locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0.001, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } }, blockable: { volume: 1 } } : {}) });
  const keepOpen = { hooks: Hooks.empty(), id: 'future', vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } } };
  const runtime = createBattle([
    { definition: caster, position: [0, 0] },
    ...(moving ? [] : [{ definition: victim, position: [1, 0] }]),
  ], {
    rows: 1, columns: 8, maxTicks: 600,
    schedule: { type: 'TIMELINE', spawns: [...(moving ? [spawn(victim, 0)] : []), spawn(keepOpen, 599)] },
  });
  return { runtime };
}
function victim(runtime) { return unitQueries.all(runtime).find(entry => entry.id === 1); }

test('elemental runtime: Unit and Effect tick triggers preserve every necrosis pulse through recovery', () => {
  for (const source of ['Unit', 'Effect']) {
    const trigger = {
      id: 'burst-trigger', initialize: () => ({}),
      onTick(state, self) {
        state = effects.end(state, effects.ref(self));
        const request = { target: self.host, type: 'NECROSIS', power: 1000, source: null };
        return epDamage.applyDamage(request, epDamage.calculateDamage(state, request)).state;
      },
    };
    const receiver = definition('ENEMY', {
      action: actionCapability(),
      hooks: source === 'Unit' ? Hooks.empty().set(unitLifecycle.tick, {
        id: 'burst-trigger',
        invoke(state, self) {
          state = applyUnitChanges(state, [unitLifecycle.removeHook(unitRef(self), unitLifecycle.tick, 'burst-trigger')]);
          const request = { target: unitRef(self), type: 'NECROSIS', power: 1000, source: null };
          return { state: epDamage.applyDamage(request, epDamage.calculateDamage(state, request)).state, value: undefined };
        },
      }) : Hooks.empty().set(unitLifecycle.enter, {
        id: 'install-trigger',
        invoke(state, self) {
          return { state: effects.install(state, unitRef(self), trigger).state, value: undefined };
        },
      }),
    });
      const future = { hooks: Hooks.empty(), id: 'future', vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } } };
    let runtime = createBattle([{ definition: receiver, position: [1, 0] }], {
      rows: 1, columns: 8, maxTicks: 600,
      schedule: { type: 'TIMELINE', spawns: [spawn(future, 599)] },
    });
    const hits = [];
    for (let tick = 0; tick < 450; tick++) {
      runtime = stepBattle(runtime, []);
      hits.push(...runtime.events.filter(event => event.type === 'DAMAGE'));
    }
    const current = unitQueries.all(runtime).find(entry => entry.definition === receiver);
    assert.equal(hits.length, 15, source);
    assert.equal(current.vitality.hp, 88000, source);
    assert.equal(current.elemental.burst, null, source);
  }
});

test('elemental runtime: character neural stun prevents ordinary attacks and route movement until recovery ends', () => {
  let { runtime } = battle('CHARACTER', 'NEURAL', { moving: true });
  const first = (runtime = stepBattle(runtime, []));
  const casterHp = getUnit(first, 0).vitality.hp;
  const frozenPosition = [...victim(runtime).position];
  for (let tick = 1; tick < 300; tick++) {
    const step = (runtime = stepBattle(runtime, []));
    assert.equal(getUnit(step, 0).vitality.hp, casterHp);
    assert.deepEqual(victim(runtime).position, frozenPosition);
  }
  const restored = (runtime = stepBattle(runtime, []));
  assert.ok(getUnit(restored, 0).vitality.hp < casterHp);
  assert.notDeepEqual(victim(runtime).position, frozenPosition);
});

test('elemental runtime: enemy neural paralysis consumes exactly three ordinary releases and then permits attacks', () => {
  const cancelled = [];
  let { runtime } = battle('ENEMY', 'NEURAL', {
    onActionEnd(state, source, self, end) {
      if (end.type === 'CANCELLED') cancelled.push({ source, id: self.execution.id, end, tick: state.tick });
    },
  });
  const events = [];
  for (let tick = 0; tick <= 50; tick++) { events.push(...(runtime = stepBattle(runtime, [])).events); }
  assert.deepEqual(cancelled.map(entry => [entry.source.id, entry.id, entry.end]), [
    [1, 0, { type: 'CANCELLED', reason: 'INTERRUPTED' }],
    [1, 1, { type: 'CANCELLED', reason: 'INTERRUPTED' }],
    [1, 2, { type: 'CANCELLED', reason: 'INTERRUPTED' }],
  ]);
  const hits = events.filter(event => event.type === 'DAMAGE' && event.targetUnitId === 0);
  assert.equal(hits.length > 0, true);
  assert.equal(hits[0].tick >= 45, true);
  assert.equal(cancelled.every(event => event.tick < hits[0].tick), true);
});
