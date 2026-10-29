import { create as createSkill } from "../../dist/core/unit/skill/index.js";
import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as skillLifetime } from "../../dist/core/unit/skill/operations.js";
import { ref as unitReference } from "../../dist/core/unit/query.js";
import * as unitQueries from "../../dist/core/unit/query.js";
import { damage as damageTargeting, healing as healingTargeting } from "../helpers/targeting.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { create as createProjectile } from "../../dist/core/battle/projectile.js";
import { all as allProjectiles } from "../../dist/core/projectile/query.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { replaceUnit } from "../helpers/unit.js";
import { setBeforeReleaseHook, removeBeforeReleaseHook } from "../../dist/core/unit/capability/action/capability.js";
import { attackBuff } from "../helpers/effects.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize as initializeBattle, step as stepBattle } from "../../dist/core/battle/runtime.js";
import { getUnit } from "../helpers/unit.js";
import * as tracking from "../../dist/content/projectiles/tracking.js";

import { create as createAttack } from "../../dist/content/actions/skill.js";
import { actionCapability } from "../helpers/actions.js";
import { executionRef } from "../../dist/core/unit/action/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { advance as advanceAction } from "../../dist/core/unit/action/index.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { ref as activationRef } from "../../dist/core/unit/skill/activation.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";
import { setHook, removeHook } from "../../dist/core/battle/damage/hook.js";
import { unit as fixtureUnit, battle as fixtureBattle, actionDefinition } from "../helpers/action-fixture.js";
import { ref as skillRef, definition as skillDefinition } from "../helpers/skill.js";
import { activate } from "../../dist/core/unit/skill/operations.js";

const hit = { type: "CIRCLE", offset: [0, 0], radius: 0.1 };
const range = [{ type: "CIRCLE", offset: [0, 0], radius: 8 }];

function scenario({ ammo = 1, targets = 1, interrupt = false, windupTicks = 0, output, actionProgram, hideAfterDamage = false } = {}) {
  const buff = attackBuff("runtime-ammo-attack", 100, {
    onInstall: (state, self) => {
      if (hideAfterDamage) {
          const currentUnit1 = getUnit(state, self.host.id);
          state = replaceUnit(state, ({
        ...currentUnit1, vitality: setHook(currentUnit1.vitality, {
          id: "hide-after-damage", stage: "hpApplied", priority: 0,
          accepts: (_state, event) => event.request.source?.id === self.host.id,
          invoke: (state, context, current) => {
            assert.equal(context.application.hpLoss, 200);
            const currentUnit = getUnit(state, context.request.source.id);
            return { state: replaceUnit(state, ({
              ...currentUnit, spatialPresence: { present: false },
            })), value: current };
          },
        }),
      }));
      }
      if (interrupt) {
          const currentUnit2 = getUnit(state, self.host.id);
          state = replaceUnit(state, ({ ...currentUnit2, action: setBeforeReleaseHook(currentUnit2.action, {
        id: "ammo-interrupt", accepts: () => true,
        invoke: state => ({ state, value: { type: "INTERRUPT", recoveryTicks: 15 } }),
      }) }));
      }
      return state;
    },
    onEnd: (state, self) => {
      if (hideAfterDamage) {
          const currentUnit3 = getUnit(state, self.host.id);
          state = replaceUnit(state, ({
        ...currentUnit3, vitality: removeHook(currentUnit3.vitality, "hide-after-damage"),
      }));
      }
      if (interrupt) {
          const currentUnit4 = getUnit(state, self.host.id);
          state = replaceUnit(state, ({ ...currentUnit4, action: removeBeforeReleaseHook(currentUnit4.action, "ammo-interrupt") }));
      }
      return state;
    },
  });
  const skill = ({
    id: "runtime-ammo-skill", initialize: battle => ({ state: battle, value: ({}) }),
    sp: { initial: 1, capacity: 1, requirement: 1, recovery: { type: "TIME", intervalTicks: 30 } },
    activation: { trigger: "MANUAL", sustain: { type: "AMMO", amount: ammo }, initialize: () => ({}),
      onStart: (state, source, self) => {
        const installed = effects.install(state, source, buff, {
          source: source, scopes: [lifetimeScope(skillLifetime, activationRef(source, self))],
        });
        assert.ok(installed.value);
        return installed.state;
      },
    },
  });
  const normal = createAttack({
    id: "normal", triggerBindingId: "main", intervalTicks: 100, windupTicks, ammoPerAction: 1,
    targetGroups: [{ id: "main", targeting: damageTargeting({
      type: "DAMAGE", scope: { type: "RANGE", geometry: range },
      canTargetAir: true, includeBlockingRelations: false, preferBlockingRelations: false,
      ignoreTargetFree: false, ignoreInvisible: false, maxTargets: targets,
    }), operations: [{ type: "DAMAGE", power: 1, damageType: "TRUE", powerSource: "SOURCE_ATTACK" }] }],
    ...(output === undefined ? {} : { output: (state, source, self) => output(state, source, self, shell) }),
  });
  const action = actionProgram === undefined ? normal : actionProgram(normal);
  const definition = { hooks: [],
    id: "ammo-actor", spatialPresence: {}, vitality: { maxHp: 10000, defense: 0, resistance: 0 }, offense: { attack: 100 },
    allegiance: { side: "ALLY" },
    layer: { type: "GROUND" }, hitbox: { shape: hit },
    blocker: { layer: "GROUND", rules: [], capacity: 0, geometry: { radius: 0.1 } }, skill: { initialize: battle => createSkill(battle, skill) },
    action: actionCapability(action),
  };
  const receiver = { hooks: [],
    id: "ammo-target", targetable: { restrictions: [] }, vitality: { maxHp: 10000, defense: 0, resistance: 0 }, allegiance: { side: "ENEMY" }, layer: { type: "GROUND" }, hitbox: { shape: hit },
  };
  const shell = {
    id: "runtime-ammo-shell", tracking: true,
    onTick: (state, self) => tracking.advance(state, self, (state, self) =>
      tracking.hit(state, self, (state, self, target) =>
        dealDamage(state, { source: self.state.source, target: unitRef(target),
          parameters: parameters(self.state.cachedAtk, "TRUE") }).state)),
    onEnd: (state, self, reason) => reason === "DISPEL" ? state :
      tracking.hit(state, self, (state, self, target) =>
        dealDamage(state, { source: self.state.source, target: unitRef(target),
          parameters: parameters(self.state.cachedAtk, "TRUE") }).state),
  };
  const base = createLegacyCombatSpec({ rows: 1, columns: 8, operators: [], enemies: [], maxTicks: 20, seed: 7 });
  let runtime = initializeBattle({ ...base,
    initialUnits: [{ definition, position: [0, 0] },
      ...Array.from({ length: targets }, (_, index) => ({ definition: receiver, position: [index + 3, 0] }))],
    schedule: { type: "TIMELINE", spawns: [{
      definition: { hooks: [], id: "future", vitality: { maxHp: 1, defense: 0, resistance: 0 }, locomotion: {
        halfBodyWidth: 0, minSpeed: 0, speed: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
      } }, tick: 19,
      route: { pathMotionMode: "WALK", startPosition: [0, 7], endPosition: [0, 7],
        spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [], allowDiagonalMove: false,
        visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true },
      timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, alwaysCheckCurrentPoint: true,
      notCountInTotal: false,
    }] },
  });
  return runtime;
}

function source(runtime) {
  return unitQueries.all(runtime).toArray().find(({ id }) => id === 0);
}

function damageEvents(step) {
  return step.events.filter(({ type }) => type === "DAMAGE");
}

test("skill attack snapshots its output callback and ammunition cost when created", () => {
  const trace = [];
  const configuration = {
    ...actionDefinition(7).attack,
    afterOutput(state) { trace.push("original"); return state; },
    ammoPerAction: 1,
  };
  const attack = createAttack(configuration);
  const skill = skillDefinition({
    activation: { trigger: "MANUAL", sustain: { type: "AMMO", amount: 3 }, initialize: () => ({}) },
  });
  const actor = fixtureUnit(0, { action: attack, skill });
  let state = fixtureBattle(actor, fixtureUnit(1));
  state = activate(state, skillRef(actor)).state;
  configuration.afterOutput = current => { trace.push("replacement"); return current; };
  configuration.ammoPerAction = 3;
  const started = actions.start(state, actions.ref(unitRef(actor), attack));
  state = advanceAction(started.state, started.value.ref);
  assert.deepEqual(trace, ["original"]);
  assert.equal(getUnit(state, 1).vitality.hp, 93);
  assert.equal(getUnit(state, 0).skill.activation.sustain.remaining, 2);
});


test("ammo runtime: the final ordinary attack buffs every target before ending the skill", () => {
  let runtime = scenario({ targets: 3 });
  const released = (runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]));
  assert.deepEqual(damageEvents(released).map(({ targetUnitId, amount }) => [targetUnitId, amount]), [
    [1, 200], [2, 200], [3, 200],
  ]);
  assert.deepEqual(released.events.filter(({ type }) => ["DAMAGE", "SKILL_FINISHED"].includes(type)).map(({ type }) => type), [
    "DAMAGE", "DAMAGE", "DAMAGE", "SKILL_FINISHED",
  ]);
  assert.equal(source(runtime).skill.activation, null);
  assert.equal(source(runtime).effects.values().toArray().length === 0, true);
  assert.equal(released.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
});

test("ammo runtime: preparation and delayed release preserve ammunition until output finishes", () => {
  let runtime = scenario({ ammo: 3, windupTicks: 2 });
  const started = (runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]));
  assert.deepEqual(damageEvents(started), []);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 3);
  const waiting = (runtime = stepBattle(runtime, []));
  assert.equal(waiting.events.some(({ type }) => type === "ACTION_RELEASED"), false);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 3);
  const released = (runtime = stepBattle(runtime, []));
  assert.deepEqual(damageEvents(released).map(({ amount }) => amount), [200]);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 2);
});

test("ammo runtime: hiding the source after damage still pays for the sampled activation", () => {
  let runtime = scenario({ hideAfterDamage: true });
  const emitted = (runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]));

  assert.deepEqual(damageEvents(emitted).map(({ amount }) => amount), [200]);
  assert.equal(source(runtime).spatialPresence.present, false);
  assert.equal(source(runtime).skill.activation, null);
  assert.equal(source(runtime).effects.values().toArray().length, 0);
  assert.deepEqual(emitted.events.filter(({ type }) => type === "SKILL_FINISHED").map(({ activationId }) => activationId), [0]);
  assert.equal(emitted.events.some(({ type }) => type === "ACTION_CANCELLED"), false);
});

test("ammo runtime: cancellation during windup spends no ammunition", () => {
  let runtime = scenario({ ammo: 3, windupTicks: 2 });
  runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]);
  const ref = executionRef(unitReference(unitQueries.all(runtime).toArray().find(unit => unit.id === 0)), unitQueries.all(runtime).toArray().find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray()[0]);
  const cancelled = (runtime = stepBattle(runtime, [{ type: "CANCEL_ACTION_EXECUTION", ref }]));
  assert.deepEqual(cancelled.events.filter(({ type }) => type === "ACTION_CANCELLED").map(({ reason }) => reason), ["CANCELLED"]);
  assert.deepEqual(damageEvents(cancelled), []);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 3);
  assert.deepEqual(unitQueries.all(runtime).toArray().find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray(), []);
  assert.equal((runtime = stepBattle(runtime, [])).events.some(({ type }) => type === "ACTION_RELEASED"), false);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 3);
});

test("ammo runtime: release interruption cancels windup without spending ammunition", () => {
  let runtime = scenario({ ammo: 3, interrupt: true, windupTicks: 2 });
  runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]);
  runtime = stepBattle(runtime, []);
  const interrupted = (runtime = stepBattle(runtime, []));
  assert.deepEqual(interrupted.events.filter(({ type }) => type === "ACTION_CANCELLED").map(({ reason }) => reason), ["INTERRUPTED"]);
  assert.equal(interrupted.events.some(({ type }) => type === "ACTION_RELEASED"), false);
  assert.deepEqual(damageEvents(interrupted), []);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 3);
  assert.ok(source(runtime).action.actions.get("normal").cooldown.readyAtTick >= 17);
  assert.deepEqual(unitQueries.all(runtime).toArray().find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray(), []);
});

test("ammo runtime: a content-defined follow-up preserves one ammunition payment across ticks", () => {
  let runtime = scenario({ ammo: 3, targets: 2, actionProgram: (normal) => ({
    ...normal,
    prepare(state, source, persistent) {
      const initialized = normal.prepare(state, source, persistent);
      return { state: initialized.state, value: initialized.value === null ? null : { ...initialized.value, finishAtTick: state.tick + 1, emitted: 0 } };
    },
    onTick(state, source, self) {
      if (self.execution.state.emitted === 0) {
        state = normal.onTick(state, source, self).state;
        const current = actions.getExecution(state, executionRef(source, self));
        if (current === undefined) return { state, value: true };
        const currentState2 = actions.getExecution(state, executionRef(source, current)).execution.state;
        return { state: actions.setExecutionState(state, executionRef(source, current), { ...currentState2, emitted: 1 }), value: false };
      }
      for (const target of self.execution.state.bindings.main) {
        state = dealDamage(state, { source: { id: source.id }, target: { id: target.id }, parameters: parameters(resolveAttack(state, source), "TRUE") }).state;
      }
      return { state, value: true };
    },
  }) });
  const first = (runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]));
  assert.deepEqual(damageEvents(first).map(({ amount }) => amount), [200, 200]);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 2);
  const followUp = (runtime = stepBattle(runtime, []));
  assert.deepEqual(damageEvents(followUp).map(({ amount }) => amount), [200, 200]);
  assert.equal(source(runtime).skill.activation.sustain.remaining, 2);
  assert.equal(followUp.events.filter(({ type }) => type === "ACTION_FINISHED").length, 1);
  assert.deepEqual(unitQueries.all(runtime).toArray().find(unit => unit.id === 0).action.actions.values().filter(self => self.execution !== null).toArray(), []);
});

test("ammo runtime: the last released projectile survives skill completion and retains buffed attack", () => {
  let runtime = scenario({ output: (state, source, self, shell) => {
    const actor = getUnit(state, source.id);
    const targetUnitId = self.execution.state.bindings.main[0].id;
    const target = getUnit(state, targetUnitId);
    return createProjectile(state, shell, {
      position: actor.position,
      state: {
        source: unitRef(actor), target: unitRef(target), destination: target.position,
        cachedAtk: resolveAttack(state, unitRef(actor)),
        speedPerTick: 1, stopDelayTicks: 0, stopAtTick: null,
        hitAttempted: false, launchedAtTick: state.tick,
      },
    }).state;
  } });
  const launched = (runtime = stepBattle(runtime, [{ type: "ACTIVATE_SKILL", unitId: 0 }]));
  assert.deepEqual(damageEvents(launched), []);
  assert.equal(launched.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
  assert.equal(source(runtime).skill.activation, null);
  assert.equal(source(runtime).effects.values().toArray().length === 0, true);
  assert.equal(runtime.battlefield.projectiles.size, 1);
  assert.equal(runtime.battlefield.projectiles.get(0).state.cachedAtk, 200);
  assert.deepEqual(allProjectiles(runtime).toArray()[0].position, [0, 0]);
  runtime = stepBattle(runtime, []);
  assert.equal(runtime.battlefield.projectiles.size, 1);
  runtime = stepBattle(runtime, []);
  const contacted = (runtime = stepBattle(runtime, []));
  assert.deepEqual(damageEvents(contacted).map(({ targetUnitId, amount }) => [targetUnitId, amount]), [[1, 200]]);
  assert.equal(unitQueries.all(runtime).toArray().find(({ id }) => id === 1).vitality.hp, 9800);
  assert.deepEqual(allProjectiles(runtime).toArray(), []);
});
