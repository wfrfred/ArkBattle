import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as skillLifetime } from "../../dist/core/unit/capability/skill/operations.js";
import * as unitQueries from "../../dist/core/unit/index.js";
import { damage as damageTargeting, healing as healingTargeting } from "../helpers/targeting.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { attackBuff } from "../helpers/effects.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { fixtureBattlefieldState as fixtureBattlefield } from "../helpers/battlefield.js";
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initialize as initializeBattle, step as stepBattle } from '../../dist/core/battle/index.js';
import { createLegacyCombatSpec } from '../../dist/legacy/combat.js';

import { createDefinition as createSkillDefinition } from '../../dist/core/unit/capability/skill/index.js';
import * as skills from '../../dist/core/unit/capability/skill/index.js';
import { ref as activationRef } from '../../dist/core/unit/capability/skill/activation.js';
import { create as createAttack } from '../../dist/content/actions/attack.js';
import { actionCapability } from "../helpers/actions.js";
import { initialize } from "../helpers/unit.js";
import { createBattleState } from '../../dist/core/battle/state.js';
import { getUnit } from '../helpers/unit.js';
import { setDamageReceptionRule } from '../../dist/core/unit/capability/vitality/index.js';
import { setHook } from '../../dist/core/battle/damage/index.js';

const geometry = [{ type: 'CIRCLE', offset: [0, 0], radius: 5 }];
const hit = { type: 'CIRCLE', offset: [0, 0], radius: 0.1 };
function action(maxTargets = 1, extra = {}) {
  return createAttack({
    id: 'normal', triggerBindingId: 'main', intervalTicks: 1, recoveryTicks: 0, followUps: [],
    targetGroups: [{ id: 'main', targeting: damageTargeting({
      type: 'DAMAGE', scope: { type: 'RANGE', geometry },
      canTargetAir: true, includeBlockingRelations: false, preferBlockingRelations: false,
      ignoreTargetFree: false, ignoreInvisible: false, maxTargets,
    }), operations: [{ type: 'DAMAGE', power: 1, damageType: 'TRUE', powerSource: 'SOURCE_ATTACK' }] }],
    ...extra,
  });
}
function actor(skill, { attackTargets = 1, windupTicks = 0, activeAction } = {}) {
  const normal = action(attackTargets, { windupTicks });
  const capability = activeAction === undefined
    ? actionCapability(normal)
    : actionCapability(normal, action(2, { id: activeAction, windupTicks }));
  return { hooks: [],
    id: 'skill-actor', vitality: { maxHp: 100000, defense: 0, resistance: 0 }, offense: { attack: 100 },
    allegiance: { side: 'ALLY' },
    layer: { type: 'GROUND' }, hitbox: { shape: hit },
    blocker: { capacity: 0, geometry: { radius: 0.1 } }, action: { ...capability, select: (battle, self) => ({ state: battle, value: [self.skill.active !== null ? activeAction ?? 'normal' : 'normal'] }) }, skill,
  };
}
function target() {
  return { hooks: [], id: 'target', targetable: { restrictions: [] }, vitality: { maxHp: 100000, defense: 0, resistance: 0 }, allegiance: { side: 'ENEMY' }, layer: { type: 'GROUND' }, hitbox: { shape: hit } };
}
function scenario(skill, { targets = 1, attackTargets = 1, windupTicks = 0, content, activeAction } = {}) {
  const buff = attackBuff('skill/attack', 100);
  const fault = { enabled: false };
  skill = createSkillDefinition({ ...skill, activation: { ...skill.activation,
    onStart: content ?? ((state, self) => {
      const installed = effects.install(state, self.host, buff, {
        source: self.host, scopes: [lifetimeScope(skillLifetime, activationRef(self))],
      });
      if (fault.enabled) throw new Error('skill fault');
      assert.ok(installed.value);
      return installed.state;
    }),
  } });
  const base = createLegacyCombatSpec({ rows: 1, columns: 8, operators: [], enemies: [], maxTicks: 200, seed: 7 });
  const definition = actor(skill, { attackTargets, windupTicks, activeAction });
  let runtime = initializeBattle({ ...base,
    initialUnits: [{ definition, position: [0, 0] },
      ...Array.from({ length: targets }, (_, index) => ({ definition: target(), position: [index + 1, 0] }))],
    schedule: { type: 'TIMELINE', spawns: [{
      definition: { hooks: [], id: 'future', vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: {
        halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
      } }, tick: 199,
      route: { pathMotionMode: 'WALK', startPosition: [0, 7], endPosition: [0, 7],
        spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], allowDiagonalMove: false,
        visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true },
      timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
      notCountInTotal: false,
    }] },
  });
  return { runtime, fault };
}
function skill({ trigger = 'MANUAL', recovery = { type: 'TIME', intervalTicks: 30 }, initial = 2, cost = 2, durationTicks = 3 } = {}) {
  return createSkillDefinition({ id: 'test-skill', initialize: () => ({}),
    sp: { initial, capacity: cost, requirement: cost, cost, recovery },
    activation: { trigger, sustain: { type: 'TIME', durationTicks }, initialize: () => ({}) },
  });
}
function source(runtime) { return unitQueries.all(runtime).toArray().find(({ id }) => id === 0); }

test('skill runtime: manual buff affects current attacks, locks SP and restores facts at duration end', () => {
  let { runtime } = scenario(skill());
  const first = (runtime = stepBattle(runtime, [{ type: 'ACTIVATE_SKILL', unitId: 0 }]));
  assert.equal(first.events.find(({ type }) => type === 'DAMAGE').amount, 200);
  assert.equal(first.events.filter(({ type }) => type === 'SKILL_ACTIVATED').length, 1);
  assert.equal(source(runtime).skill.sp.value, 0);
  runtime = stepBattle(runtime, [{ type: 'ACTIVATE_SKILL', unitId: 0 }]);
  runtime = stepBattle(runtime, []);
  const ended = (runtime = stepBattle(runtime, []));
  assert.equal(ended.events.find(({ type }) => type === 'DAMAGE').amount, 100);
  assert.equal(ended.events.filter(({ type }) => type === 'SKILL_FINISHED').length, 1);
  assert.equal(source(runtime).skill.active, null);
  assert.equal(source(runtime).skill.sp.value, 0);
});

test('skill runtime: TIME gives integer pulses and AUTO starts at full SP', () => {
  let { runtime } = scenario(skill({ trigger: 'AUTO', initial: 0 }));
  const activations = [];
  for (let tick = 0; tick <= 60; tick++) {
    activations.push(...(runtime = stepBattle(runtime, [])).events.filter(({ type }) => type === 'SKILL_ACTIVATED'));
    if (tick === 29) { assert.equal(source(runtime).skill.sp.value, 0); }
    if (tick === 30) { assert.equal(source(runtime).skill.sp.value, 1); }
  }
  assert.deepEqual(activations.map(({ tick }) => tick), [60]);
  assert.equal(source(runtime).skill.sp.value, 0);
});

test('skill runtime: active action is selected from current facts and returns to normal targeting', () => {
  let { runtime } = scenario(skill(), { targets: 2, activeAction: 'active' });
  assert.equal((runtime = stepBattle(runtime, [{ type: 'ACTIVATE_SKILL', unitId: 0 }])).events.filter(({ type }) => type === 'DAMAGE').length, 2);
  runtime = stepBattle(runtime, []); runtime = stepBattle(runtime, []);
  assert.equal((runtime = stepBattle(runtime, [])).events.filter(({ type }) => type === 'DAMAGE').length, 1);
});

test('skill runtime: ACTION recovery counts a multi-target release once', () => {
  const definition = skill({ recovery: { type: 'ACTION', amount: 1 }, initial: 0, cost: 10 });
  let { runtime } = scenario(definition, { targets: 2, attackTargets: 2, windupTicks: 2 });
  runtime = stepBattle(runtime, []);
  assert.equal(source(runtime).skill.sp.value, 0);
  runtime = stepBattle(runtime, []);
  assert.equal(source(runtime).skill.sp.value, 0);
  runtime = stepBattle(runtime, []);
  assert.equal(source(runtime).skill.sp.value, 1);
});

test('skill runtime: cancelled windup earns no ACTION SP', () => {
  let { runtime } = scenario(skill({ recovery: { type: 'ACTION', amount: 1 }, initial: 0 }), { windupTicks: 2 });
  runtime = stepBattle(runtime, []);
  runtime = stepBattle(runtime, [{ type: 'CANCEL_ACTION_EXECUTION', ref: { host: { id: 0 }, id: 0 } }]);
  assert.equal(source(runtime).skill.sp.value, 0);
});

test('skill runtime: HIT SP requires positive damage and an eligible receiver', () => {
  for (const [power, cancelReception, expected] of [[0, false, 0], [10, false, 1], [10, true, 0]]) {
    const definition = actor(skill({ recovery: { type: 'HIT', amount: 1 }, initial: 0 }));
    let receiver = initialize({ id: 0, definition, position: [0, 0] });
    if (cancelReception) receiver = { ...receiver, vitality: setDamageReceptionRule(receiver.vitality, {
      id: 'test-cancel-reception', allows: () => false,
    }) };
    let work = createBattleState(fixtureBattlefield([receiver]));
    work = skills.enter(work, unitRef(receiver));
    const result = dealDamage(work, { source: null, target: unitRef(receiver), parameters: parameters(power, 'TRUE') });
    assert.equal(result.value.kind, power > 0 && !cancelReception ? 'APPLIED' : 'REJECTED');
    assert.equal(getUnit(result.state, 0).skill.sp.value, expected);
    assert.equal(getUnit(result.state, 0).vitality.hp, 100000 - (power > 0 && !cancelReception ? power : 0));
  }
});

test('skill runtime: failed activation propagates without publishing contribution or progress', () => {
  let { runtime, fault } = scenario(skill());
  const before = runtime;
  fault.enabled = true;
  assert.throws(() => (runtime = stepBattle(runtime, [{ type: 'ACTIVATE_SKILL', unitId: 0 }])), /skill fault/);
  assert.deepEqual(runtime, before);
});

test('skill runtime: HIT recovery precedes reception Hooks even when they subsequently cancel damage', () => {
  const definition = actor(skill({ recovery: { type: 'HIT', amount: 2 }, initial: 0, cost: 10 }));
  let receiver = initialize({ id: 0, definition, position: [0, 0] });
  receiver = { ...receiver, vitality: setHook(receiver.vitality, {
    id: 'late-shield', stage: 'receiving', priority: 0, accepts: () => true,
    invoke(battle, context, pending) {
      assert.equal(getUnit(battle, context.request.target.id).skill.sp.value, 2);
      return { state: battle, value: { ...pending, cancellation: { reason: 'SHIELD' } } };
    },
  }) };
  let battle = createBattleState(fixtureBattlefield([receiver]));
  battle = skills.enter(battle, unitRef(receiver));
  battle = dealDamage(battle, { source: null, target: { id: 0 }, parameters: parameters(10, 'TRUE') }).state;
  assert.equal(getUnit(battle, 0).skill.sp.value, 2);
  assert.equal(getUnit(battle, 0).vitality.hp, 100000);
});

test('skill runtime: each nested positive reception independently earns HIT SP', () => {
  let receiver = initialize({ id: 0, position: [0, 0], definition: actor(skill({ recovery: { type: 'HIT', amount: 2 }, initial: 0, cost: 10 })) });
  receiver = { ...receiver, vitality: setHook(receiver.vitality, {
    id: 'nested-hit', stage: 'receiving', priority: 0,
    accepts: (_battle, context) => context.request.parameters.attack.power === 10,
    invoke(battle, context, pending) {
      return { state: dealDamage(battle, { source: null, target: context.request.target, parameters: parameters(1, 'TRUE') }).state, value: pending };
    },
  }) };
  let battle = createBattleState(fixtureBattlefield([receiver]));
  battle = skills.enter(battle, unitRef(receiver));
  battle = dealDamage(battle, { source: null, target: unitRef(receiver), parameters: parameters(10, 'TRUE') }).state;
  assert.equal(getUnit(battle, 0).skill.sp.value, 4);
  assert.equal(getUnit(battle, 0).vitality.hp, 99989);
});
