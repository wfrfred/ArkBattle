import { changeTile } from "../helpers/tiles.js";
import { tiles as tileEntries } from "../helpers/tiles.js";
import { normal } from "../../dist/content/terrain/definition.js";
import * as blockingQueries from "../../dist/core/battle/blocking/query.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { damage as dealDamage, parameters } from "../helpers/vitality.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { apply as applyOverlays } from "../../dist/core/battlefield/navigation/overlay.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chessRec, enemyRec } from "../helpers/records.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createMechanismDefinition } from "../../dist/core/battle/mechanism.js";
import { createRng } from "../../dist/core/common/rng.js";
import { initialize as initializeBattle, step as advanceBattle, simulateBattle } from "../../dist/core/battle/runtime.js";
import { advanceSpawnSchedule, getSpawnScheduleCounts, getSpawnedCount, getUnspawnedCount, isSpawnScheduleCompleted, recordScheduleSpawns, resolveScheduleUnits } from "../../dist/core/battle/schedule/runtime.js";
import { createSpawnScheduleExecution } from "../../dist/core/battle/schedule/state.js";
import { createSpawnScheduleDefinition } from "../../dist/core/battle/schedule/definition.js";
import { createSteeringParameters } from "../../dist/core/unit/capability/locomotion/steering.js";
import { createInput as createRouteDefinition, normalize as normalizeRoute } from "../../dist/core/battle/creation/route.js";
import { TICKS_PER_SECOND } from "../../dist/core/tick.js";
import { secondsToTicks } from "../../dist/data/arknights/tick.js";
import { parseLevelContent, parseLevelDefinition } from "../../dist/data/arknights/level.js";
import { parseEnemyMovementContent, parseEnemyMovementDefinition } from "../../dist/data/arknights/enemy.js";
import { parseEnemyMovementPrefab, parsePredefinedPrefab } from "../../dist/data/arknights/prefab.js";
import { parsePredefinedDefinition } from "../../dist/data/arknights/predefined.js";
import { compileSpawnSchedule } from "../../dist/data/arknights/schedule.js";
import { compileLevelMovementFragment } from "../../dist/data/arknights/movement-fragment.js";
import { loadMovementScenario } from "../../dist/data/arknights/movement-scenario.js";
import { createLegacyCombatBattle } from "../helpers/legacy-combat.js";
import { createDefinition as createDeployableDefinition } from "../helpers/deployable.js";
import { createPredefinedDefinition } from "../../dist/core/battle/steps/predefined.js";
import { appendEvents } from "../../dist/core/battle/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { actionCapability } from "../helpers/actions.js";
import { ref as actionRef } from "../../dist/core/unit/action/action.js";
import { update as updateAction } from "../../dist/core/unit/action/operations.js";
import { install as installEffect } from "../../dist/core/unit/effect/operations.js";

const navigationMap = (state, mode = 'WALK') => applyOverlays(state.baseline[mode], state.overlays[mode]);


const approx = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} ≈ ${b}`);

const guard = (o = {}) => chessRec({ id: 't_guard', profession: 'WARRIOR', stats: { atk: 300, blockCnt: 2 }, skill: null, ...o });

const walker = (o = {}) => enemyRec({ key: 'enemy_walker', hp: 1e6, speed: 1, ...o });


function arknightsFixture(name) {
  return JSON.parse(readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), 'utf8'));
}


function slimeMovementProfile(steeringParameters = createSteeringParameters({ steeringFactor: 10 / 30, maxSteeringForce: 100 / 900 })) {
  return { ...parseEnemyMovementPrefab(arknightsFixture('prefab_enemy_1007_slime')), steeringParameters };
}


function slimeMovementFragment(rawLevel = arknightsFixture('level_act1autochess_01'), actionIndices = [0],
  steeringParameters = createSteeringParameters({ steeringFactor: 10 / 30, maxSteeringForce: 100 / 900 })) {
  const rawEnemy = arknightsFixture('enemy_1007_slime');
  const profile = slimeMovementProfile(steeringParameters);
  const level = parseLevelDefinition(rawLevel);
  const fragment = compileLevelMovementFragment(level, { waveIndex: 0, fragmentIndex: 0, actionIndices }, {
    rngState: 123,
    resolveEnemy: reference => parseEnemyMovementContent(rawEnemy, reference.level, profile, reference.overwrittenData),
  });
  return { rawLevel, level, ...fragment };
}


function withTimelineSpawns(spec, spawns) {
  return { ...spec, schedule: { type: 'TIMELINE', spawns } };
}


function routeCommandBattle(checkpoints, options = {}) {
  const { spec } = slimeMovementFragment();
  const source = spec.schedule.spawns[0];
  const route = createRouteDefinition({ ...source.route, visitEveryCheckPoint: true, checkpoints,
    spawnOffset: [0, 0], spawnRandomRange: [0, 0], ...options.route });
  const definition = { spatialPresence: {}, ...source.definition,
    locomotion: { ...source.definition.locomotion, speed: options.speed ?? 0, minSpeed: 0 } };
  return { ...withTimelineSpawns(spec, [{ ...source, tick: 0, definition, route, alwaysCheckCurrentPoint: true }]),
    maxTicks: options.maxTicks ?? 20, ...options.spec };
}


function nativeSpawn(overrides = {}) {
  return { ...arknightsFixture('level_act1autochess_01').waves[0].fragments[0].actions[0],
    count: 1, preDelay: 0, interval: 0, ...overrides };
}


function nativeFragment(actions, preDelay = 0) {
  return { preDelay, actions };
}


function nativeWave(fragments, overrides = {}) {
  return { preDelay: 0, postDelay: 0, maxTimeWaitingForNextWave: -1, advancedWaveTag: null, fragments, ...overrides };
}


function syntheticSpawnSchedule(waves, branches = {}, ignoredKeys = []) {
  const raw = arknightsFixture('level_act1autochess_01');
  const rawEnemy = arknightsFixture('enemy_1007_slime');
  const profile = slimeMovementProfile();
  raw.waves = waves;
  raw.branches = branches;
  const actions = waves.flatMap(wave => wave.fragments.flatMap(fragment => fragment.actions));
  const branchActions = Object.values(branches).flatMap(branch => branch.phases.flatMap(phase => phase.actions));
  raw.enemyDbRefs = [...new Set([...actions, ...branchActions].map(action => action.key))].map(id => ({
    useDb: true, id, level: 0,
    overwrittenData: ignoredKeys.includes(id) ? { attributes: {}, notCountInTotal: { m_defined: true, m_value: true } } : null,
  }));
  const level = parseLevelDefinition(raw);
  const compilation = compileSpawnSchedule(level, {
    actions: waves.flatMap((wave, waveIndex) => wave.fragments.flatMap((fragment, fragmentIndex) =>
      fragment.actions.map((_, actionIndex) => ({ waveIndex, fragmentIndex, actionIndex })))),
    branches: Object.keys(branches),
  }, reference => parseEnemyMovementContent({ ...rawEnemy, Key: reference.id }, reference.level, profile, reference.overwrittenData));
  return { level, schedule: createSpawnScheduleDefinition(compilation.schedule) };
}


function dispatchSchedule(state, tick, unitIds = [], triggers = []) {
  const advanced = advanceSpawnSchedule(state, { tick, triggers });
  return { spawns: advanced.spawns, state: recordScheduleSpawns(advanced.state, advanced.spawns, unitIds) };
}


test('core raw 01 slime fragment preserves map, route flags and stats; spawns at tick left edges 90 and 240', () => {
  const { rawLevel, level, spec, omittedActions, inactiveBranches } = slimeMovementFragment();
  assert.equal(spec.map, level.map);
  assert.equal(spec.map.rows, rawLevel.mapData.map.length);
  assert.equal(spec.map.columns, rawLevel.mapData.map[0].length);
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.tick), [90, 240]);
  assert.equal(spec.schedule.spawns[0].route, level.routes[0]);
  assert.equal(spec.schedule.spawns[1].route, level.routes[0]);
  assert.equal(spec.schedule.spawns[0].route.visitEveryCheckPoint, false);
  assert.equal(spec.schedule.spawns[0].alwaysCheckCurrentPoint, false);
  assert.deepEqual(spec.schedule.spawns[0].route.checkpoints, []);
  assert.equal(spec.schedule.spawns[0].definition.vitality.maxHp, 550);
  assert.equal(spec.schedule.spawns[0].definition.locomotion.speed, 1 / 30);
  assert.equal(spec.routeMoveMultiplier, 0.5);
  assert.equal(spec.maxTicks, 1350);
  assert.deepEqual(omittedActions, ['waves[0].fragments[0].actions[1]', 'waves[0].fragments[0].actions[2]']);
  assert.deepEqual(inactiveBranches, ['dragon']);
  let runtime = initializeBattle(spec);
  const expectedRng = createRng(123);
  while (runtime.tick < 90) assert.deepEqual((runtime = advanceBattle(runtime, [])).events, []);
  assert.equal(runtime.tick, 90);
  assert.equal(runtime.battlefield.units.size, 0);
  const firstStep = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(firstStep.events, [{ type: 'ENEMY_SPAWNED', unitId: 0, tick: 90 }]);
  expectedRng.next();
  expectedRng.next();
  const first = runtime;
  assert.equal(first.schedule.cursor, 1);
  assert.equal(first.schedule.spawnedCount, 1);
  assert.deepEqual(first.schedule.managedFinalUnitIds, [0]);
  assert.deepEqual(first.execution, { rngState: expectedRng.state(), nextUnitId: 1, nextMechanismId: 0, nextOverlayId: 0, nextProjectileId: 0, nextCardId: 0 });
  assert.equal(first.battlefield.units.get(0).vitality.hp, 550);
  assert.equal(first.battlefield.units.get(0).route.main.phase.type, 'END');
  assert.strictEqual(first.battlefield.units.get(0).route.main.definition, first.battlefield.units.get(0).definition.route);
  assert.equal('timing' in first.battlefield.units.get(0).route.main, false);
  assert.equal(first.battlefield.units.get(0).position[1], 9);
  approx(10 - first.battlefield.units.get(0).position[0], 0.5 * 10 / TICKS_PER_SECOND ** 2);
  while (runtime.tick < 240) (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.tick, 240);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.id), [0]);
  const secondStep = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(secondStep.events, [{ type: 'ENEMY_SPAWNED', unitId: 1, tick: 240 }]);
  expectedRng.next();
  expectedRng.next();
  const second = runtime;
  assert.equal(second.schedule.cursor, 2);
  assert.equal(second.schedule.spawnedCount, 2);
  assert.deepEqual(second.schedule.managedFinalUnitIds, [0, 1]);
  assert.deepEqual(second.execution, { rngState: expectedRng.state(), nextUnitId: 2, nextMechanismId: 0, nextOverlayId: 0, nextProjectileId: 0, nextCardId: 0 });
  assert.deepEqual([...second.battlefield.units.values()].map(unit => unit.route.main.phase.type), ['END', 'END']);
  for (const unit of second.battlefield.units.values()) assert.strictEqual(unit.route.main.definition, unit.definition.route);
  const { spec: forceLimited } = slimeMovementFragment(rawLevel, [0], createSteeringParameters({
    steeringFactor: 100 / 30, maxSteeringForce: 0.3 / 900,
  }));
  let forceRuntime = initializeBattle(withTimelineSpawns(forceLimited, [{ ...forceLimited.schedule.spawns[0], tick: 0 }]));
  (forceRuntime = advanceBattle(forceRuntime, []));
  approx(10 - forceRuntime.battlefield.units.get(0).position[0], 1 / 3000);
});


test('core raw 01 movement fragment replays every tick and completes routes with SCRIPT removals', () => {
  const { spec } = slimeMovementFragment();
  let first = initializeBattle(spec);
  let second = initializeBattle(spec);
  const events = [];
  const tickBudget = spec.maxTicks;
  for (let tick = 0; tick < tickBudget && first.result === null; tick++) {
    assert.deepEqual(first, second);
    const step = (first = advanceBattle(first, []));
    assert.deepEqual(step, (second = advanceBattle(second, [])));
    events.push(...step.events);
  }
  assert.deepEqual(first, second);
  assert.equal(first.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(first.result.spawnedCount, 2);
  assert.equal(first.result.completedRouteCount, 2);
  assert.equal(first.result.unspawnedCount, 0);
  assert.deepEqual(first.result.remainingUnitIds, []);
  assert.equal(Object.hasOwn(first.result, 'killed'), false);
  assert.equal(first.battlefield.units.size, 0);
  assert.deepEqual(events.filter(event => event.type === 'ROUTE_COMPLETED').map(event => event.unitId), [0, 1]);
  assert.deepEqual(events.filter(event => event.type === 'UNIT_REMOVED').map(event => [event.unitId, event.reason]), [[0, 'SCRIPT'], [1, 'SCRIPT']]);
  assert.deepEqual(simulateBattle(spec), first.result);
  const finished = first;
  assert.equal(advanceBattle(finished, []), finished);
  assert.equal(first, finished);
});


test('core battle state retains immutable values and the published tick after later steps', () => {
  const { spec } = slimeMovementFragment();
  let runtime = initializeBattle(spec);
  let replica = initializeBattle(spec);
  while (runtime.tick < 91) {
    assert.deepEqual((runtime = advanceBattle(runtime, [])), (replica = advanceBattle(replica, [])));
  }
  const before = runtime;
  const unit = before.battlefield.units.get(0);
  const position = unit.position;
  const routeProgress = unit.route.main.phase;
  const routeDefinition = unit.route.main.definition;
  const x = position[0];
  assert.strictEqual(routeDefinition, unit.definition.route);

  runtime = advanceBattle(before, []);
  assert.deepEqual(runtime, advanceBattle(before, []));
  replica = advanceBattle(replica, []);
  const current = runtime;
  assert.deepEqual(current, replica);
  assert.equal(current.tick, 92);
  assert.equal(before.tick, 91);
  assert.equal(before.battlefield.units.get(0).position, position);
  assert.equal(position[0], x);
  assert.ok(current.battlefield.units.get(0).position[0] < x);
  assert.equal(before.battlefield.units.get(0).route.main.phase, routeProgress);
  assert.equal(before.battlefield.units.get(0).route.main.definition, routeDefinition);
  assert.equal(before.execution.nextUnitId, 1);
  assert.deepEqual(before.schedule.managedFinalUnitIds, [0]);
  assert.equal(before.completedRouteCount, 0);
});


test('core battle initializes all route waits at the birth tick and replays their exact completion edges', () => {
  const { spec } = slimeMovementFragment();
  const spawn = spec.schedule.spawns[0];
  const definition = { spatialPresence: {}, ...spawn.definition,
    locomotion: { ...spawn.definition.locomotion, speed: 0, minSpeed: 0 },
  };
  const cases = [
    [{ type: 'WAIT_FOR_TICKS', durationTicks: 3 }, 8],
    [{ type: 'WAIT_FOR_PLAY_TICK', targetPlayTick: 10 }, 10],
    [{ type: 'WAIT_CURRENT_WAVE_TICKS', targetElapsedTicks: 10 }, 12],
    [{ type: 'WAIT_CURRENT_FRAGMENT_TICKS', targetElapsedTicks: 10 }, 13],
  ];
  for (const [checkpoint, deadline] of cases) {
    const route = createRouteDefinition({ ...spawn.route, visitEveryCheckPoint: true, checkpoints: [checkpoint] });
    const input = { ...withTimelineSpawns(spec, [{ ...spawn, definition, route, alwaysCheckCurrentPoint: true,
      tick: 5, timing: { waveStartedAtTick: 2, fragmentStartedAtTick: 3 },
    }]), maxTicks: deadline + 1 };
    let runtime = initializeBattle(input), replay = initializeBattle(input);
    while (runtime.result === null) {
      const tick = runtime.tick;
      assert.deepEqual((runtime = advanceBattle(runtime, [])), (replay = advanceBattle(replay, [])));
      const snapshot = runtime;
      assert.deepEqual(snapshot, replay);
      if (tick < 5) {
        assert.equal(snapshot.battlefield.units.size, 0);
        continue;
      }
      const unit = snapshot.battlefield.units.get(0), progress = unit.route.main.phase;
      assert.equal('timing' in unit.route.main, false);
      assert.deepEqual(unit.position, [10, 9]);
      if (tick < deadline) {
        assert.equal(progress.type, 'CHECKPOINT');
        assert.equal(progress.checkpointState.deadlineTick, deadline);
      } else {
        assert.equal(progress.type, 'END');
      }
    }
    assert.equal(runtime.result.reason, 'TIME_LIMIT');
    assert.equal(runtime.result.completedRouteCount, 0);
    assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0]);
  }
});


test('core route absolute waits retain birth timing after the scheduler enters a later wave', () => {
  const { spec } = slimeMovementFragment();
  for (const [type, deadline] of [['WAIT_CURRENT_WAVE_TICKS', 8], ['WAIT_CURRENT_FRAGMENT_TICKS', 13]]) {
    const { schedule } = syntheticSpawnSchedule([
      nativeWave([nativeFragment([nativeSpawn({ dontBlockWave: true })], 3 / 30)], { preDelay: 2 / 30 }),
      nativeWave([nativeFragment([nativeSpawn({ preDelay: 10 / 30 })])], { preDelay: 2 / 30 }),
    ]);
    const firstWave = schedule.waves[0], fragment = firstWave.fragments[0], action = fragment.actions[0];
    const route = createRouteDefinition({ ...action.spawn.route, visitEveryCheckPoint: true,
      checkpoints: [{ type, targetElapsedTicks: 8 }],
    });
    const definition = { spatialPresence: {}, ...action.spawn.definition,
      locomotion: { ...action.spawn.definition.locomotion, speed: 0, minSpeed: 0 },
    };
    let runtime = initializeBattle({ ...spec, maxTicks: 16, schedule: { ...schedule, waves: [
      { ...firstWave, fragments: [{ ...fragment, actions: [{ ...action,
        spawn: { ...action.spawn, definition, route, alwaysCheckCurrentPoint: true },
      }] }] }, schedule.waves[1],
    ] } });
    while (runtime.tick <= deadline) {
      const tick = runtime.tick;
      (runtime = advanceBattle(runtime, []));
      if (tick < 5) continue;
      const snapshot = runtime, state = snapshot.battlefield.units.get(0).route.main;
      assert.equal(snapshot.schedule.waveIndex, 1);
      assert.equal(snapshot.schedule.waveStartedAtTick, 5);
      assert.equal(snapshot.schedule.fragmentStartedAtTick, tick < 7 ? 5 : 7);
      assert.deepEqual(state.definition.checkpoints, [{ type: 'WAIT_UNTIL', tick: deadline }]);
      if (tick < deadline) {
        assert.equal(state.phase.checkpointState.deadlineTick, deadline);
      } else {
        assert.equal(state.phase.type, 'END');
      }
    }
    assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0]);
  }
});


test('core patrol stays registered and pending in the spawn schedule through deterministic loop reentries', () => {
  const { spec } = slimeMovementFragment();
  const spawn = spec.schedule.spawns[0];
  const route = createRouteDefinition({ ...spawn.route, visitEveryCheckPoint: true, checkpoints: [10, 9].map(column => ({
    type: 'PATROL_MOVE', target: { position: [9, column], reachOffset: [0, 0] },
  })) });
  const definition = { spatialPresence: {}, ...spawn.definition,
    locomotion: { ...spawn.definition.locomotion, speed: 4 },
  };
  const input = { ...withTimelineSpawns(spec, [{ ...spawn, tick: 0, definition, route, alwaysCheckCurrentPoint: true }]), maxTicks: 24 };
  let runtime = initializeBattle(input), replay = initializeBattle(input), events = [], positions = [];
  while (runtime.result === null) {
    const step = (runtime = advanceBattle(runtime, []));
    assert.deepEqual(step, (replay = advanceBattle(replay, [])));
    events.push(...step.events);
    const snapshot = runtime;
    assert.deepEqual(snapshot, replay);
    assert.deepEqual(snapshot.schedule.managedFinalUnitIds, [0]);
    assert.equal(snapshot.battlefield.units.get(0).route.main.phase.type, 'CHECKPOINT');
    positions.push(snapshot.battlefield.units.get(0).position[0]);
  }
  assert.deepEqual(runtime.result, {
    reason: 'TIME_LIMIT', elapsedTicks: 24, spawnedCount: 1, completedRouteCount: 0, remainingUnitIds: [0], unspawnedCount: 0,
  });
  assert.deepEqual(events.filter(event => event.type === 'ROUTE_COMPLETED' || event.type === 'UNIT_REMOVED'), []);
  assert.ok(positions.filter((position, index) => index > 0 && position !== positions[index - 1]).length > 4);
  assert.ok(runtime.battlefield.units.get(0).definition.route.checkpoints.some(checkpoint => checkpoint.type === 'GOTO'));
});


test('core absolute wait overflow does not publish same-tick spawns, identities or RNG', () => {
  const { spec } = slimeMovementFragment();
  const spawn = spec.schedule.spawns[0];
  const route = createRouteDefinition({ ...spawn.route, visitEveryCheckPoint: true, checkpoints: [
    { type: 'WAIT_FOR_TICKS', durationTicks: 1 },
    { type: 'WAIT_CURRENT_WAVE_TICKS', targetElapsedTicks: Number.MAX_SAFE_INTEGER },
  ] });
  const mechanism = { definition: createMechanismDefinition({ initialize: () => ({}), id: 'wait-expiry' }), active: true };

  let runtime = initializeBattle({ ...withTimelineSpawns(spec, [
    { ...spawn, tick: 5 },
    { ...spawn, tick: 5, route, alwaysCheckCurrentPoint: true, timing: { waveStartedAtTick: 2, fragmentStartedAtTick: 3 } },
  ]), initialMechanisms: [{ definition: mechanism.definition, active: mechanism.active }],  });
  while (runtime.tick < 5) (runtime = advanceBattle(runtime, []));
  const before = runtime, maps = runtime.battlefield.navigation;
  assert.throws(() => (runtime = advanceBattle(runtime, [])), /route wait deadline/);
  assert.equal(runtime, before);
  assert.equal(runtime.battlefield.navigation, maps);
});


test('core instant route signals retain identity and scheduler ownership through disappearance and appearance', () => {
  const input = routeCommandBattle([
    { type: 'DISAPPEAR' }, { type: 'WAIT_FOR_TICKS', durationTicks: 3 }, { type: 'ALERT' },
    { type: 'APPEAR_AT_POS', position: [9, 5], reachOffset: [0.25, 0] },
    { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ]);
  let runtime = initializeBattle(input), replay = initializeBattle(input), events = [];
  let appeared = false, observedHidden = false;
  while (runtime.result === null) {
    const step = (runtime = advanceBattle(runtime, []));
    assert.deepEqual(step, (replay = advanceBattle(replay, [])));
    assert.deepEqual(runtime, replay);
    events.push(...step.events);
    const snapshot = runtime, unit = snapshot.battlefield.units.get(0);
    assert.equal(unit.id, 0);
    assert.equal(unit.vitality.hp, 550);
    assert.deepEqual(snapshot.schedule.managedFinalUnitIds, [0]);
    if (step.events.some(event => event.type === 'ROUTE' && event.signal.type === 'APPEAR_AT_POS')) appeared = true;
    if (appeared) {
      assert.equal(unit.spatialPresence.present, true);
      assert.deepEqual(unit.position, [5.25, 9]);
    } else {
      assert.equal(unit.spatialPresence.present, false);
      observedHidden = true;
    }
  }
  const signals = events.filter(event => event.type === 'ROUTE');
  assert.equal(observedHidden, true);
  assert.equal(appeared, true);
  assert.deepEqual(signals.map(event => event.signal.type), ['DISAPPEAR', 'ALERT', 'APPEAR_AT_POS']);
  assert.deepEqual(signals.map(event => event.position), [[10, 9], [10, 9], [5.25, 9]]);
  assert.deepEqual(events.slice(0, 2).map(event => event.type), ['ENEMY_SPAWNED', 'ROUTE']);
  assert.deepEqual(events.filter(event => event.type === 'ROUTE_COMPLETED' || event.type === 'UNIT_REMOVED'), []);
  assert.equal(runtime.result.reason, 'TIME_LIMIT');
  assert.equal(runtime.result.completedRouteCount, 0);
  assert.deepEqual(runtime.result.remainingUnitIds, [0]);
});


test('core birth and same-tick route signals record each instruction position rather than the final pose', () => {
  let runtime = initializeBattle(routeCommandBattle([
    { type: 'ALERT' }, { type: 'APPEAR_AT_POS', position: [9, 6], reachOffset: [-0.25, 0] },
    { type: 'DISAPPEAR' }, { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ]));
  const first = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(first.events.filter(event => event.type === 'ROUTE').map(event => ({
    signal: event.signal.type, position: event.position, tick: event.tick, unitId: event.unitId,
  })), [
    { signal: 'ALERT', position: [10, 9], tick: 0, unitId: 0 },
    { signal: 'APPEAR_AT_POS', position: [5.75, 9], tick: 0, unitId: 0 },
    { signal: 'DISAPPEAR', position: [5.75, 9], tick: 0, unitId: 0 },
  ]);
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, false);
  assert.deepEqual(runtime.battlefield.units.get(0).position, [5.75, 9]);
  assert.deepEqual((runtime = advanceBattle(runtime, [])).events.filter(event => event.type === 'ROUTE'), []);
});


test('core alternative route commands preserve main deadlines, targets and earlier snapshots', () => {
  let waiting = initializeBattle(routeCommandBattle([{ type: 'WAIT_FOR_TICKS', durationTicks: 12 }]));
  (waiting = advanceBattle(waiting, []));
  const waitRoute = { ...waiting.battlefield.units.get(0).definition.route,
    checkpoints: [{ type: 'WAIT', tick: 30 }] };
  (waiting = advanceBattle(waiting, [{ type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route: waitRoute }]));
  const active = waiting.battlefield.units.get(0);
  assert.equal(active.route.main.phase.checkpointState.deadlineTick, 12);
  assert.equal(active.route.alternative.phase.checkpointState.deadlineTick, 31);
  const snapshot = waiting;
  assert.equal(snapshot.battlefield.units.get(0).route, active.route);
  assert.equal(snapshot.battlefield.units.get(0).spatialPresence, active.spatialPresence);
  (waiting = advanceBattle(waiting, []));
  assert.strictEqual(waiting.battlefield.units.get(0).route.main, active.route.main);
  assert.equal(snapshot.battlefield.units.get(0).route.alternative.phase.checkpointState.deadlineTick, 31);
  (waiting = advanceBattle(waiting, [{ type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 0 }]));
  assert.equal(waiting.battlefield.units.get(0).route.alternative, null);
  assert.equal(waiting.battlefield.units.get(0).route.main.phase.checkpointState.deadlineTick, 12);
  assert.equal(snapshot.battlefield.units.get(0).route.alternative.phase.checkpointState.deadlineTick, 31);

  const input = routeCommandBattle([{ type: 'MOVE', target: {
    position: [9, 8], reachOffset: [0.25, 0],
  } }]);
  let runtime = initializeBattle(input), replay = initializeBattle(input);
  assert.deepEqual((runtime = advanceBattle(runtime, [])), (replay = advanceBattle(replay, [])));
  const main = runtime.battlefield.units.get(0).route.main;
  const originalRng = runtime.execution.rngState;
  const route = { ...main.definition, startPosition: [100, 100], endPosition: [9, 10],
    checkpoints: [{ type: 'WAIT', tick: 3 }] };
  for (let tick = 1; tick < 10; tick++) {
    const commands = tick === 1 ? [{ type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route }] : [];
    assert.deepEqual((runtime = advanceBattle(runtime, commands)), (replay = advanceBattle(replay, commands)));
    assert.deepEqual(runtime, replay);
    const unit = runtime.battlefield.units.get(0);
    assert.strictEqual(unit.route.main, main);
    assert.deepEqual(unit.position, [10, 9]);
    assert.equal(runtime.execution.rngState, originalRng);
  }
  assert.equal(runtime.battlefield.units.get(0).route.alternative.phase.type, 'COMPLETED');
  const clear = [{ type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 0 }];
  assert.deepEqual((runtime = advanceBattle(runtime, clear)), (replay = advanceBattle(replay, clear)));
  assert.deepEqual(runtime, replay);
  assert.equal(runtime.battlefield.units.get(0).route.alternative, null);
  assert.strictEqual(runtime.battlefield.units.get(0).route.main, main);
});


test('core alternative route commands execute pending teleport instructions during advancement', () => {
  let runtime = initializeBattle(routeCommandBattle([
    { type: 'DISAPPEAR' }, { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ]));
  (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, false);
  const main = runtime.battlefield.units.get(0).route.main;
  const route = { ...main.definition, checkpoints: [{ type: 'WAIT', tick: 30 }] };
  (runtime = advanceBattle(runtime, [{ type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route }]));
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, false);
  const teleport = { ...route, checkpoints: [
    { type: 'APPEAR_AT_POS', position: [9, 7], offset: [0, 0] },
    { type: 'WAIT', tick: 30 },
  ] };
  const step = (runtime = advanceBattle(runtime, [{ type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route: teleport }]));
  assert.deepEqual(step.events.filter(event => event.type === 'ROUTE'), [
    { type: 'ROUTE', unitId: 0, signal: { type: 'APPEAR_AT_POS', position: [7, 9] }, position: [7, 9], tick: 2 },
  ]);
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, true);
  assert.deepEqual(runtime.battlefield.units.get(0).position, [7, 9]);
  const cleared = (runtime = advanceBattle(runtime, [{ type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 0 }]));
  const unit = runtime.battlefield.units.get(0);
  assert.equal(unit.route.alternative, null);
  assert.strictEqual(unit.route.main, main);
  assert.deepEqual(cleared.events.filter(event => event.type === 'ROUTE'), []);
  const skipped = (runtime = advanceBattle(runtime, [
    { type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route: teleport },
    { type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 0 },
  ]));
  assert.deepEqual(skipped.events.filter(event => event.type === 'ROUTE'), []);
});


test('core failed alternative route commands do not publish same-tick births, RNG or navigation identities', () => {
  const initial = routeCommandBattle([{ type: 'WAIT_FOR_TICKS', durationTicks: 30 }]);
  const spawn = initial.schedule.spawns[0];
  const mechanism = { definition: createMechanismDefinition({ initialize: () => ({}), id: 'alternative-expiry' }), active: true };

  const input = { ...withTimelineSpawns(initial, [spawn, { ...spawn, tick: 1 }]), initialMechanisms: [{ definition: mechanism.definition, active: mechanism.active }],  };
  let runtime = initializeBattle(input);
  (runtime = advanceBattle(runtime, []));
  const before = runtime, maps = runtime.battlefield.navigation;
  const route = createRouteDefinition({ ...spawn.route, checkpoints: [{ type: 'MOVE', target: {
    position: [9, 8], reachOffset: [0.25, 0],
  } }] });
  const command = { type: 'SET_ALTERNATIVE_ROUTE', unitId: 0, route: normalizeRoute(route, spawn.timing, route.spawnOffset, true) };
  assert.throws(() => (runtime = advanceBattle(runtime, [command, { type: 'CLEAR_ALTERNATIVE_ROUTE', unitId: 999 }])), /unknown alternative route unit/);
  assert.equal(runtime, before);
  assert.equal(runtime.battlefield.navigation, maps);
  let fixed = initializeBattle({ ...initial, predefines: [{ id: 0, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', definition: Object.freeze({ id: 'fixed', hooks: [] }), position: [10, 9], },
  }] });
  const fixedBefore = fixed;
  assert.throws(() => (fixed = advanceBattle(fixed, [{ ...command, unitId: 0 }])), /unit has no route/);
  assert.deepEqual(fixed, fixedBefore);
});


test('core battle publishes a completed tick only after all operations succeed', () => {
  for (const reason of ['TIME_LIMIT', 'SCHEDULE_COMPLETED']) {
    const base = routeCommandBattle([{ type: 'WAIT_FOR_TICKS', durationTicks: 30 }], { speed: 1 / 30, maxTicks: 2 });
    const source = base.schedule.spawns[0];
    const completedRoute = createRouteDefinition({ ...source.route, endPosition: source.route.startPosition, checkpoints: [] });
    const initialMechanism = {
      definition: createMechanismDefinition({ initialize: () => ({}), id: 'late-failure-initial' }), active: true,
    };


    const predefinedUnit = Object.freeze({ hooks: [], id: 'late-failure-predefined', vitality: Object.freeze({ maxHp: 25, defense: 0, resistance: 0 }) });
    let failureEnabled = false;
    let failures = 0;
    let observedRuntime;
    let observedSnapshot;
    let observedMaps;
    const lifecycle = { id: 'late-failure-rule', initialize: () => ({}), onTick(state, self) {
      if (state.tick !== 1) return state;
      assert.ok(state.battlefield.units.size > observedSnapshot.battlefield.units.size);
      assert.ok(state.mechanisms.get(1) !== undefined);
      assert.deepEqual(observedRuntime, observedSnapshot);
      assert.equal(observedRuntime.battlefield.navigation, observedMaps);
      if (failureEnabled) { failures++; throw new Error('late-stage failure'); }
      return state;
    } };
    const failingDefinition = Object.freeze({ ...predefinedUnit, hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
      return { state: installEffect(state, unitRef(self), lifecycle).state, value: undefined };
    } }] });
    const input = {
      ...withTimelineSpawns(base, [
        ...(reason === 'TIME_LIMIT' ? [source] : []),
        { ...source, tick: 1, route: completedRoute },
      ]),
      initialMechanisms: [{ definition: initialMechanism.definition, active: initialMechanism.active }],
      predefines: [
        { id: 0, alias: null, initiallyPresent: true,
          creation: { type: 'UNIT', definition: predefinedUnit, position: Object.freeze([8, 9]), } },
        { id: 1, alias: null, initiallyPresent: false,
          creation: { type: 'MECHANISM', definition: createMechanismDefinition({ initialize: () => ({}), id: 'late-failure-created' }),  } },
        { id: 2, alias: null, initiallyPresent: false,
          creation: { type: 'UNIT', definition: failingDefinition, position: Object.freeze([8, 9]), } },
      ],
    };
    let runtime = initializeBattle(input), replay = initializeBattle(input);
    assert.deepEqual((runtime = advanceBattle(runtime, [])), (replay = advanceBattle(replay, [])));
    const before = runtime, maps = runtime.battlefield.navigation;
    const commands = [
      { type: 'REMOVE_PREDEFINED', definitionId: 0, reason: 'SCRIPT' },
      { type: 'APPEAR_PREDEFINED', definitionId: 1 },
      { type: 'APPEAR_PREDEFINED', definitionId: 2 },
    ];
    observedRuntime = runtime; observedSnapshot = before; observedMaps = maps;
    const expected = (replay = advanceBattle(replay, commands)), expectedSnapshot = replay;
    assert.equal(expected.result.reason, reason);
    assert.equal(expected.result.completedRouteCount, 1);
    assert.equal(expectedSnapshot.battlefield.units.size, reason === 'TIME_LIMIT' ? 2 : 1);
    assert.equal(expected.events.filter(event => event.type === 'ENEMY_SPAWNED').length, 1);
    assert.equal(expected.events.filter(event => event.type === 'UNIT_REMOVED').length, 2);
    assert.notEqual(expectedSnapshot.execution.rngState, before.execution.rngState);
    assert.ok(expectedSnapshot.execution.nextUnitId > before.execution.nextUnitId);
    assert.ok(expectedSnapshot.execution.nextMechanismId > before.execution.nextMechanismId);

    failureEnabled = true;
    assert.throws(() => (runtime = advanceBattle(runtime, commands)), /late-stage failure/);
    assert.equal(runtime, before);
    assert.equal(runtime.battlefield.navigation, maps);
    assert.equal(failures, 1);
    assert.equal(advanceBattle(replay, []), expectedSnapshot);
    assert.deepEqual(replay, expectedSnapshot);
  }
});


test('core battle propagates nested settlement errors without publishing battlefield, identities or Action progress', () => {
  const sentinel = new Error('nested settlement failure');
  let fail = true;
  let observedRuntime;
  let observedSnapshot;
  let observedMaps;
  let observations = 0;

  const effect = {
    id: 'nested-failure-effect', initialize: () => ({}),
    onInstall: (state) => {
      state = dealDamage(state, { source: { id: 0 }, target: { id: 1 }, parameters: parameters(7, 'TRUE') }).state;
      assert.equal(getUnit(state, 1).vitality.hp, 93);
      assert.equal(getUnit(state, 2).definition.id, 'nested-created');
      assert.equal(state.execution.nextUnitId, 3);
      assert.equal(getUnit(state, 0).action.actions.values().filter(self => self.execution !== null).toArray().length, 1);
      assert.ok(state.events.some(event => event.type === 'DAMAGE'));
      assert.deepEqual(observedRuntime, observedSnapshot);
      assert.equal(observedRuntime.battlefield.navigation, observedMaps);
      observations++;
      if (fail) throw sentinel;
      return state;
    },
  };
  const action = {
    id: 'nested-action', intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: {} }),
    start: state => ({ state, value: { entered: false } }),
    step(state, source, self) {
      if (self.execution.state.entered) return { state, value: false };
      state = updateAction(state, actionRef(source, self), () => ({ entered: true }));
      const unit = initialize({ id: state.execution.nextUnitId, position: [2, 0], definition: { hooks: [],
        id: 'nested-created', vitality: { maxHp: 10, defense: 0, resistance: 0 },
      } });
      state = addUnit(state, unit);
      state = { ...state, execution: { ...state.execution, nextUnitId: unit.id + 1 } };
      state = appendEvents(state, [{ type: 'UNIT_DEPLOYED', unitId: unit.id, position: unit.position, tick: state.tick }]);
      state = installEffect(state, unitRef(getUnit(state, 1)), effect, { source: 0 }).state;
      return { state, value: false };
    },
  };
  const input = deploymentBattleInput({ initialUnits: [
    { definition: { hooks: [], id: 'nested-action-source', vitality: { maxHp: 100, defense: 0, resistance: 0 }, action: actionCapability(action) }, position: [0, 0] },
    { definition: { hooks: [], id: 'nested-target', vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [1, 0] },
  ] });
  let runtime = initializeBattle(input);
  const before = runtime;
  observedRuntime = runtime;
  observedSnapshot = before;
  observedMaps = runtime.battlefield.navigation;
  assert.throws(() => (runtime = advanceBattle(runtime, [])), error => error === sentinel);
  assert.equal(runtime, before);
  assert.equal(runtime.result, null);

  fail = false;
  let expected = initializeBattle(input);
  observedRuntime = expected;
  observedSnapshot = expected;
  observedMaps = expected.battlefield.navigation;
  (expected = advanceBattle(expected, []));
  assert.equal(observations, 2);
  assert.equal(expected.execution.nextUnitId, 3);
  assert.equal(expected.battlefield.units.get(0).action.actions.values().filter(self => self.execution !== null).toArray().length, 1);
  assert.equal(expected.battlefield.units.get(1).vitality.hp, 93);
});


test('core schedule removal feedback advances the next wave only on the next tick', () => {
  const base = routeCommandBattle([]);
  const source = base.schedule.spawns[0];
  const route = createRouteDefinition({ ...source.route, endPosition: source.route.startPosition });
  const spawn = { ...source, route };
  const fragment = { preDelayTicks: 0, actions: [{
    spawn, offsetsTicks: [0], managedByScheduler: true, dontBlockWave: false, forceBlockWaveInBranch: false,
  }] };
  const wave = { preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null, fragments: [fragment] };
  let runtime = initializeBattle({ ...base, schedule: { type: 'WAVES', waves: [wave, wave], branches: {} } });
  const first = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(first.events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 0, tick: 0 }]);
  assert.deepEqual(first.events.filter(event => event.type === 'ROUTE_COMPLETED'), [{ type: 'ROUTE_COMPLETED', unitId: 0, tick: 0 }]);
  assert.equal(first.result, null);
  const afterFirst = runtime;
  assert.equal(afterFirst.schedule.waveIndex, 0);
  assert.equal(afterFirst.schedule.main.phase, 'WAITING');
  assert.deepEqual(afterFirst.schedule.managedWaveUnitIds, []);
  assert.deepEqual(afterFirst.schedule.managedFinalUnitIds, []);
  const second = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(second.events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 1, tick: 1 }]);
  assert.deepEqual(second.events.filter(event => event.type === 'ROUTE_COMPLETED'), [{ type: 'ROUTE_COMPLETED', unitId: 1, tick: 1 }]);
  assert.equal(second.result, null);
  assert.equal(runtime.schedule.waveIndex, 1);
  const final = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(final.events, []);
  assert.deepEqual(final.result, {
    reason: 'SCHEDULE_COMPLETED', elapsedTicks: 3, spawnedCount: 2, completedRouteCount: 2,
    remainingUnitIds: [], unspawnedCount: 0,
  });
});


test('core independent runtimes preserve every tick, event and RNG transition', () => {
  const input = routeCommandBattle([
    { type: 'MOVE', target: { position: [9, 8], reachOffset: [0.25, 0.25] } },
    { type: 'WAIT_FOR_TICKS', durationTicks: 2 },
    { type: 'MOVE', target: { position: [9, 6], reachOffset: [0.25, 0.25] } },
  ], { speed: 1 / 5, maxTicks: 100 });
  let runtime = initializeBattle(input), replay = initializeBattle(input);
  for (let tick = 0; runtime.result === null; tick++) {
    assert.deepEqual((runtime = advanceBattle(runtime, [])), (replay = advanceBattle(replay, [])));
    assert.deepEqual(runtime, replay);
  }
  assert.equal(runtime.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(runtime.result.completedRouteCount, 1);
});


test('core battle deadline keeps live units separate from spawns due at the excluded final edge', () => {
  const { spec } = slimeMovementFragment();
  const limited = { ...spec, maxTicks: 240 };
  let runtime = initializeBattle(limited);
  const events = [];
  while (runtime.result === null) events.push(...(runtime = advanceBattle(runtime, [])).events);
  assert.deepEqual(runtime.result, {
    reason: 'TIME_LIMIT', elapsedTicks: 240, spawnedCount: 1, completedRouteCount: 0,
    remainingUnitIds: [0], unspawnedCount: 1,
  });
  assert.deepEqual(events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 0, tick: 90 }]);
  assert.deepEqual(events.filter(event => event.type === 'UNIT_REMOVED' || event.type === 'ROUTE_COMPLETED'), []);
  assert.equal(runtime.battlefield.units.get(0).vitality.hp, 550);
  assert.deepEqual(simulateBattle(limited), runtime.result);
  const result = runtime.result;
  const snapshot = runtime;
  assert.equal(snapshot.result, result);
  assert.equal(snapshot.result.remainingUnitIds, result.remainingUnitIds);
  assert.deepEqual(result.remainingUnitIds, [0]);
  const finished = runtime;
  assert.equal(advanceBattle(finished, []), finished);
  assert.equal(runtime, finished);
});


test('core fragment binds wave and fragment starts and preserves original action order for simultaneous spawns', () => {
  const rawLevel = arknightsFixture('level_act1autochess_01');
  rawLevel.waves[0].preDelay = 2;
  rawLevel.waves[0].fragments[0].preDelay = 1;
  const actions = rawLevel.waves[0].fragments[0].actions;
  actions[1] = { ...actions[0], count: 1, routeIndex: 1 };
  const { level, spec, selection } = slimeMovementFragment(rawLevel, [1, 0]);
  assert.deepEqual(selection.actionIndices, [0, 1]);
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.tick), [180, 180, 330]);
  assert.equal(spec.schedule.spawns[0].route, level.routes[0]);
  assert.equal(spec.schedule.spawns[1].route, level.routes[1]);
  assert.equal(spec.schedule.spawns[2].route, level.routes[0]);
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.timing), [
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
  ]);
  let runtime = initializeBattle(spec);
  while (runtime.tick < 180) assert.deepEqual((runtime = advanceBattle(runtime, [])).events, []);
  assert.deepEqual((runtime = advanceBattle(runtime, [])).events, [
    { type: 'ENEMY_SPAWNED', unitId: 0, tick: 180 },
    { type: 'ENEMY_SPAWNED', unitId: 1, tick: 180 },
  ]);
  const units = [...runtime.battlefield.units.values()];
  assert.deepEqual(units.map(unit => unit.id), [0, 1]);
  assert.deepEqual(units.map(unit => unit.definition.route.startPosition), level.routes.slice(0, 2).map(route => route.startPosition));
  for (const unit of units) assert.strictEqual(unit.route.main.definition, unit.definition.route);
  assert.deepEqual(units.map(unit => unit.definition.route.checkpoints), [[], []]);
});


test('raw enemy movement levels inherit only defined values and reject sparse, unknown and invalid entries', () => {
  const fixture = arknightsFixture('enemy_1007_slime');
  const profile = slimeMovementProfile();
  const parseMovement = (value, level) => parseEnemyMovementDefinition(value, level, profile);
  assert.deepEqual(parseMovement(fixture, 0), { hooks: [],
    id: 'enemy_1007_slime', spatialPresence: {}, vitality: { maxHp: 550, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: profile.halfBodyWidth, speed: 1 / 30, minSpeed: 0.1 / 30, steeringParameters: profile.steeringParameters },
  });
  assert.deepEqual(parseMovement(fixture, 1), { hooks: [],
    id: 'enemy_1007_slime', spatialPresence: {}, vitality: { maxHp: 2050, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: profile.halfBodyWidth, speed: 1 / 30, minSpeed: 0.1 / 30, steeringParameters: profile.steeringParameters },
  });
  assert.deepEqual(parseMovement({ ...fixture, Value: [...fixture.Value].reverse() }, 1), parseMovement(fixture, 1));
  const ignored = structuredClone(fixture);
  ignored.Value[1].enemyData.attributes.moveSpeed.m_value = NaN;
  assert.equal(parseMovement(ignored, 1).locomotion.speed, 1 / 30);
  ignored.Value.push({ level: 2, enemyData: { attributes: {
    maxHp: { m_defined: false, m_value: 0 }, moveSpeed: { m_defined: false, m_value: 0 },
  } } });
  assert.equal(parseMovement(ignored, 2).vitality.maxHp, 550);
  const stationary = structuredClone(fixture);
  stationary.Value[1].enemyData.attributes.moveSpeed = { m_defined: true, m_value: 0 };
  assert.equal(parseMovement(stationary, 1).locomotion.speed, 0);
  assert.throws(() => parseMovement(fixture, 2), /unknown enemy level/);
  assert.throws(() => parseMovement({ ...fixture, Value: [...fixture.Value, fixture.Value[0]] }, 0), /duplicate enemy level/);
  const sparse = structuredClone(fixture);
  delete sparse.Value[0];
  assert.throws(() => parseMovement(sparse, 1), /dense/);
  assert.throws(() => parseMovement({ ...fixture, Value: [fixture.Value[1]] }, 1), /requires level 0/);
  const missing = structuredClone(fixture);
  missing.Value[0].enemyData.attributes.moveSpeed.m_defined = false;
  assert.throws(() => parseMovement(missing, 1), /requires a defined value/);
  for (const level of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseMovement(fixture, level), /enemy level/);
  }
  for (const [name, value] of [['maxHp', 0], ['maxHp', -1], ['maxHp', NaN], ['moveSpeed', -1], ['moveSpeed', Infinity], ['moveSpeed', '1']]) {
    const invalid = structuredClone(fixture);
    invalid.Value[0].enemyData.attributes[name].m_value = value;
    assert.throws(() => parseMovement(invalid, 0), /defined enemy/);
  }
  const invalidFlag = structuredClone(fixture);
  invalidFlag.Value[1].enemyData.attributes.moveSpeed.m_defined = 0;
  assert.throws(() => parseMovement(invalidFlag, 1), /m_defined must be boolean/);
});


test('core fragment projects periodic spawns from absolute source times without accumulating interval rounding', () => {
  const rawLevel = arknightsFixture('level_act1autochess_01');
  const action = rawLevel.waves[0].fragments[0].actions[0];
  action.preDelay = 0.05;
  action.interval = 0.15;
  action.count = 8;
  const { spec } = slimeMovementFragment(rawLevel);
  const expected = [2, 6, 11, 15, 20, 24, 29, 33];
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.tick), expected);
  let runtime = initializeBattle({ ...spec, maxTicks: 34 });
  const events = [];
  while (runtime.result === null) events.push(...(runtime = advanceBattle(runtime, [])).events);
  assert.deepEqual(events.filter(event => event.type === 'ENEMY_SPAWNED').map(event => event.tick), expected);
  assert.equal(runtime.result.spawnedCount, 8);
  assert.equal(runtime.result.elapsedTicks, 34);
});


test('core battle uses integer tick boundaries for spawning and deadlines', () => {
  const { spec } = slimeMovementFragment();
  const mechanism = { definition: createMechanismDefinition({ initialize: () => ({}), id: 'expiry' }), active: true };

  assert.equal(secondsToTicks(0.1 + 0.2), 9);
  assert.equal(secondsToTicks(1e-18), 1);
  assert.equal(secondsToTicks(0), 0);
  assert.equal(secondsToTicks(0.15), 5);
  for (const seconds of [NaN, Infinity]) assert.throws(() => secondsToTicks(seconds), RangeError);
  const boundary = { ...withTimelineSpawns(spec, [{ ...spec.schedule.spawns[0], tick: secondsToTicks(0.9) }]),
    maxTicks: secondsToTicks(1.2), initialMechanisms: [{ definition: mechanism.definition, active: mechanism.active }],
  };
  let runtime = initializeBattle(boundary);
  for (let index = 0; index < 27; index++) assert.deepEqual((runtime = advanceBattle(runtime, [])).events, []);

  const step = (runtime = advanceBattle(runtime, []));
  assert.equal(step.events[0].type, 'ENEMY_SPAWNED');
  assert.equal(step.events[0].tick, 27);

  assert.equal(runtime.tick, 28);
  while (runtime.result === null) (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.result.reason, 'TIME_LIMIT');
  assert.equal(runtime.result.elapsedTicks, 36);
  let deadline = initializeBattle({ ...boundary, maxTicks: secondsToTicks(0.9) });
  for (let index = 0; index < 27; index++) (deadline = advanceBattle(deadline, []));
  assert.equal(deadline.tick, 27);
  assert.equal(deadline.result.reason, 'TIME_LIMIT');
  assert.equal(deadline.result.spawnedCount, 0);
  assert.equal(deadline.result.unspawnedCount, 1);
  assert.equal(deadline.result.elapsedTicks, 27);
  const rounded = simulateBattle({ ...boundary, maxTicks: secondsToTicks(0.91) });
  assert.equal(rounded.elapsedTicks, 28);
  for (const rngState of [-1, 2 ** 32, 0.5, NaN]) {
    assert.throws(() => initializeBattle({ ...boundary, rngState }), /unsigned 32-bit/);
  }
  for (const maxTicks of [0, -1, 0.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => initializeBattle({ ...boundary, maxTicks }), /tick budget/);
  }
  for (const tick of [-1, 0.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => initializeBattle(withTimelineSpawns(boundary, [{ ...boundary.schedule.spawns[0], tick }])), /spawn.tick/);
  }
  assert.throws(() => initializeBattle(withTimelineSpawns(boundary, [{ ...boundary.schedule.spawns[0],
    timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0.5 },
  }])), /fragmentStartedAtTick/);
});


test('movement scenarios resolve one enemy reference once and distinguish raw unresolved overrides from unsupported content', () => {
  const raw = arknightsFixture('level_act1autochess_01');
  raw.waves = [nativeWave([nativeFragment([nativeSpawn({ count: 1 }), nativeSpawn({ count: 1 })])])];
  raw.branches = {};
  const selectedReference = raw.enemyDbRefs.find(reference => reference.id === 'enemy_1007_slime');
  selectedReference.level = 1;
  selectedReference.overwrittenData = {
    attributes: {
      maxHp: { m_defined: true, m_value: 1234 },
      moveSpeed: { m_defined: true, m_value: 0 },
    },
    prefabKey: { m_defined: true, m_value: 'enemy_1000_gopro' },
    notCountInTotal: { m_defined: true, m_value: true },
  };
  raw.enemyDbRefs[0].overwrittenData = {
    attributes: { atk: { m_defined: true, m_value: 999 } },
  };
  const parsed = parseLevelContent(raw);
  assert.deepEqual(parsed.unresolvedRules.map(rule => rule.path), [
    'level.enemyDbRefs[0].overwrittenData', 'level.enemyDbRefs[2].overwrittenData',
  ]);
  const source = arknightsFixture('enemy_1007_slime');
  const levels = source.Value;
  let valueReads = 0;
  Object.defineProperty(source, 'Value', { get: () => { valueReads++; return levels; } });
  const requested = [];
  const catalog = {
    character: () => assert.fail('no selected predefined characters'),
    skill: () => assert.fail('no selected predefined skills'),
    enemy: key => { requested.push(key); return source; },
    prefab: key => { requested.push(key); return arknightsFixture(`prefab_${key}`); },
  };
  const selection = {
    actions: [0, 1].map(actionIndex => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
    branches: [], predefines: [],
  };
  const scenario = loadMovementScenario(raw, selection, catalog, 123);
  const actions = scenario.spec.schedule.waves[0].fragments[0].actions;

  assert.equal(valueReads, 1);
  assert.deepEqual(requested, ['enemy_1007_slime', 'enemy_1000_gopro']);
  assert.equal(actions[0].spawn.definition, actions[1].spawn.definition);
  assert.equal(actions[0].spawn.definition.vitality.maxHp, 1234);
  assert.equal(actions[0].spawn.definition.locomotion.speed, 0);
  assert.equal(actions[0].spawn.notCountInTotal, true);
  assert.deepEqual(scenario.unsupportedRules, []);
  assert.deepEqual(scenario.level.unresolvedRules, parsed.unresolvedRules);
  let runtime = initializeBattle(scenario.spec);
  assert.equal((runtime = advanceBattle(runtime, [])).events.filter(event => event.type === 'ENEMY_SPAWNED').length, 2);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.vitality.hp), [1234, 1234]);
  selectedReference.overwrittenData.attributes.atk = { m_defined: true, m_value: 10 };
  assert.throws(() => loadMovementScenario(raw, selection, catalog, 123), /unsupported overwritten enemy attribute atk/);
});


test('raw levels preserve predefined configuration and keep unsupported inputs outside the movement fragment', () => {
  const raw = arknightsFixture('level_act1autochess_01');
  const instance = arknightsFixture('trap_098_mire');
  instance.hidden = true;
  raw.predefines.tokenInsts.push(instance);
  const parsed = parseLevelDefinition(raw);
  const predefined = parsed.predefines.tokenInsts[0];
  assert.deepEqual(predefined.position, [18, 1]);
  assert.equal(predefined.direction, 'UP');
  assert.equal(predefined.hidden, true);
  assert.equal(predefined.inst.characterKey, 'trap_098_mire');
  assert.equal(predefined.skillIndex, 0);
  assert.equal(predefined.mainSkillLvl, 1);
  assert.deepEqual(predefined.overrideSkillBlackboard, instance.overrideSkillBlackboard);
  assert.equal(parsed.branches.dragon.phases[0].actions[0].key, 'enemy_9012_acloon');
  instance.inst.level = 99;
  instance.overrideSkillBlackboard[0].value = 99;
  raw.routes[0].endPosition.col = 99;
  assert.equal(predefined.inst.level, 1);
  assert.equal(predefined.overrideSkillBlackboard[0].value, -0.05);
  assert.deepEqual(parsed.routes[0].endPosition, [9, 2]);
  assert.throws(() => { predefined.overrideSkillBlackboard[0].value = 1; }, TypeError);
  assert.throws(() => slimeMovementFragment(raw), /predefined instances/);
  for (const mutate of [
    raw => { raw.waves[0].fragments[0].actions[0].routeIndex = 3; },
    raw => { raw.branches.dragon.phases[0].actions[0].routeIndex = 1; },
    raw => { raw.waves[0].fragments[0].actions[0].key = 'missing'; },
    raw => { raw.enemyDbRefs.push(raw.enemyDbRefs[0]); },
    raw => { raw.waves[0].fragments[0].actions[0].actionType = 'ACTIVATE_PREDEFINE'; },
    raw => { raw.waves[0].fragments[0].actions[0].unknownRule = true; },
    raw => { delete raw.waves[0].fragments[0].actions[0]; },
    raw => { raw.predefines.tokenCards.push({}); },
    raw => { raw.runes = [{}]; },
  ]) {
    const invalid = arknightsFixture('level_act1autochess_01');
    mutate(invalid);
    assert.throws(() => parseLevelDefinition(invalid));
  }
  for (const mutate of [
    raw => { raw.waves[0].fragments[0].actions[0].blockFragment = true; },
    raw => { raw.waves[0].fragments[0].actions[0].managedByScheduler = false; },
    raw => { raw.waves[0].fragments[0].actions[0].randomType = 'RANDOM'; },
    raw => { raw.options.steeringEnabled = false; },
  ]) {
    const unsupported = arknightsFixture('level_act1autochess_01');
    mutate(unsupported);
    assert.throws(() => slimeMovementFragment(unsupported), /require|unsupported/);
  }
});


test('schedule execution shares its definition and retains earlier immutable progress', () => {
  const timelineDefinition = createSpawnScheduleDefinition({ type: 'TIMELINE', spawns: [] });
  const timeline = createSpawnScheduleExecution(timelineDefinition);
  assert.equal(timeline.definition, timelineDefinition);
  assert.equal(timeline.type, 'TIMELINE');
  assert.equal(isSpawnScheduleCompleted(timeline), true);
  assert.equal(getUnspawnedCount(timeline), 0);
  const advanced = advanceSpawnSchedule(timeline, { tick: 0 });
  const recorded = recordScheduleSpawns(advanced.state, advanced.spawns, []);
  assert.equal(recorded.definition, timelineDefinition);
  assert.equal(resolveScheduleUnits(recorded, []).definition, timelineDefinition);
  assert.equal(advanced.state.managedFinalUnitIds, timeline.managedFinalUnitIds);
  assert.equal(advanced.state.managedWaveUnitIds, timeline.managedWaveUnitIds);
  assert.equal(timeline.lastTick, null);
  assert.equal(advanced.state.lastTick, 0);
  assert.deepEqual(timeline.managedFinalUnitIds, []);

  const { schedule } = syntheticSpawnSchedule([nativeWave([nativeFragment([nativeSpawn()])])]);
  const waves = createSpawnScheduleExecution(schedule);
  assert.equal(waves.definition, schedule);
  const firstWave = advanceSpawnSchedule(waves, { tick: 0 });
  assert.equal(firstWave.state.definition, schedule);
  assert.equal(waves.main.phase, 'NOT_STARTED');
  assert.equal(waves.lastTick, null);
  assert.equal(firstWave.state.lastTick, 0);
  const { spec } = slimeMovementFragment();
  for (const definition of [timelineDefinition, schedule]) {
    let runtime = initializeBattle({ ...spec, schedule: definition });
    assert.deepEqual(getSpawnScheduleCounts(runtime.schedule), {
      spawnedCount: 0, unspawnedCount: definition.type === 'TIMELINE' ? 0 : 1,
    });
    (runtime = advanceBattle(runtime, []));
    assert.deepEqual(getSpawnScheduleCounts(runtime.schedule), {
      spawnedCount: definition.type === 'TIMELINE' ? 0 : 1, unspawnedCount: 0,
    });
  }
});


test('native-format waves exhaust each queue before advancing, and SPAWN callbacks unblock fragments before units disappear', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([
      nativeFragment([], 100),
      nativeFragment([nativeSpawn({ count: 2, preDelay: 1 / 30, interval: 2 / 30, blockFragment: true })], 1 / 30),
      nativeFragment([nativeSpawn()]),
    ], { preDelay: 2 / 30, postDelay: 2 / 30 }),
    nativeWave([nativeFragment([nativeSpawn()])], { preDelay: 1 / 30, postDelay: 1 / 30, maxTimeWaitingForNextWave: 0 }),
  ]);
  const initial = createSpawnScheduleExecution(schedule);
  let step = dispatchSchedule(initial, 0);
  assert.equal(step.state.main.phase, 'PRE_DELAY');
  assert.equal(getUnspawnedCount(step.state), 4);
  step = dispatchSchedule(step.state, 2);
  assert.equal(step.spawns.length, 0);
  assert.equal(step.state.main.fragmentIndex, 1);
  assert.equal(step.state.fragmentStartedAtTick, 3);
  step = dispatchSchedule(step.state, 4, [0]);
  assert.deepEqual(step.spawns.map(spawn => spawn.tick), [4]);
  assert.deepEqual(step.state.managedWaveUnitIds, [0]);
  assert.equal(step.state.main.phase, 'FRAGMENTS');
  step = dispatchSchedule(step.state, 5);
  assert.equal(step.spawns.length, 0);
  assert.equal(step.state.main.fragmentIndex, 1);
  step = dispatchSchedule(step.state, 6, [1, 2]);
  assert.deepEqual(step.spawns.map(spawn => spawn.tick), [6, 6]);
  assert.deepEqual(step.spawns.map(spawn => spawn.timing), [
    { waveStartedAtTick: 0, fragmentStartedAtTick: 3 },
    { waveStartedAtTick: 0, fragmentStartedAtTick: 6 },
  ]);
  assert.equal(step.state.main.phase, 'WAITING');
  assert.deepEqual(step.state.managedWaveUnitIds, [0, 1, 2]);
  assert.equal(getUnspawnedCount(step.state), 1);
  assert.deepEqual(initial, createSpawnScheduleExecution(schedule));
  const resolved = resolveScheduleUnits(step.state, [0, 1, 2]);
  step = dispatchSchedule(resolved, 7);
  assert.equal(step.state.main.phase, 'POST_DELAY');
  step = dispatchSchedule(step.state, 8);
  assert.equal(step.state.waveIndex, 0);
  step = dispatchSchedule(step.state, 9);
  assert.equal(step.state.waveIndex, 1);
  assert.equal(step.state.main.phase, 'PRE_DELAY');
  step = dispatchSchedule(step.state, 10, [3]);
  assert.deepEqual(step.spawns[0].timing, { waveStartedAtTick: 9, fragmentStartedAtTick: 10 });
  step = dispatchSchedule(step.state, 100);
  assert.equal(step.state.main.phase, 'WAITING');
  assert.equal(isSpawnScheduleCompleted(step.state), false);
  step = dispatchSchedule(resolveScheduleUnits(step.state, [3]), 101);
  assert.equal(step.state.main.phase, 'POST_DELAY');
  step = dispatchSchedule(step.state, 102);
  assert.equal(isSpawnScheduleCompleted(step.state), true);
  assert.equal(getSpawnedCount(step.state), 4);
  assert.equal(getUnspawnedCount(step.state), 0);
});


test('scheduler wave and final ownership follow managed, dontBlockWave, forceBlockWaveInBranch and enemy notCountInTotal', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([
      nativeSpawn(),
      nativeSpawn({ managedByScheduler: false }),
      nativeSpawn({ dontBlockWave: true }),
      nativeSpawn({ key: 'ignored' }),
      nativeSpawn({ forceBlockWaveInBranch: true }),
    ])]),
  ], { extra: { phases: [nativeFragment([
    nativeSpawn(),
    nativeSpawn({ forceBlockWaveInBranch: true }),
    nativeSpawn({ forceBlockWaveInBranch: true, dontBlockWave: true }),
    nativeSpawn({ key: 'ignored', forceBlockWaveInBranch: true }),
    nativeSpawn({ managedByScheduler: false, forceBlockWaveInBranch: true }),
  ])] } }, ['ignored']);
  let step = dispatchSchedule(createSpawnScheduleExecution(schedule), 0, [0, 1, 2, 3, 4]);
  assert.deepEqual(step.state.managedWaveUnitIds, [0, 4]);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 2, 4]);
  assert.equal(step.spawns[3].notCountInTotal, true);
  step = dispatchSchedule(step.state, 1, [5, 6, 7, 8, 9], [{ branchId: 'extra', isLoop: false }]);
  assert.deepEqual(step.state.managedWaveUnitIds, [0, 4, 6]);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 2, 4, 5, 6, 7]);
  assert.equal(getSpawnedCount(step.state), 10);
  assert.equal(getUnspawnedCount(step.state), 0);
  step = dispatchSchedule(resolveScheduleUnits(step.state, [0, 4, 6]), 2);
  assert.equal(step.state.main.phase, 'COMPLETED');
  assert.deepEqual(step.state.managedFinalUnitIds, [2, 5, 7]);
  assert.equal(isSpawnScheduleCompleted(step.state), false);
  assert.equal(isSpawnScheduleCompleted(resolveScheduleUnits(step.state, [2, 5, 7])), true);
});


test('wave timeout starts after its last queued action, clears only wave ownership, and final waves ignore that timeout', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([nativeSpawn({ count: 2, interval: 5 / 30 })])],
      { maxTimeWaitingForNextWave: 3 / 30, postDelay: 2 / 30 }),
    nativeWave([nativeFragment([nativeSpawn()])], { maxTimeWaitingForNextWave: 0 }),
  ]);
  let step = dispatchSchedule(createSpawnScheduleExecution(schedule), 0, [0]);
  step = dispatchSchedule(step.state, 4);
  assert.equal(step.state.main.phase, 'FRAGMENTS');
  assert.equal(step.state.waveIndex, 0);
  step = dispatchSchedule(step.state, 5, [1]);
  assert.equal(step.state.main.phase, 'WAITING');
  assert.equal(step.state.main.startedAtTick, 5);
  step = dispatchSchedule(step.state, 7);
  assert.equal(step.state.main.phase, 'WAITING');
  step = dispatchSchedule(step.state, 8);
  assert.equal(step.state.main.phase, 'POST_DELAY');
  assert.deepEqual(step.state.managedWaveUnitIds, []);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 1]);
  step = dispatchSchedule(step.state, 9);
  assert.equal(step.state.waveIndex, 0);
  step = dispatchSchedule(step.state, 10, [2]);
  assert.equal(step.state.waveIndex, 1);
  assert.deepEqual(step.state.managedWaveUnitIds, [2]);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 1, 2]);
  step = dispatchSchedule(step.state, 100);
  assert.equal(step.state.main.phase, 'WAITING');
  step = dispatchSchedule(resolveScheduleUnits(step.state, [2]), 101);
  assert.equal(step.state.main.phase, 'COMPLETED');
  assert.equal(isSpawnScheduleCompleted(step.state), false);
  assert.equal(isSpawnScheduleCompleted(resolveScheduleUnits(step.state, [0, 1])), true);
});


test('same-tick zero timeout never registers an old wave spawn as a new wave blocker', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([nativeSpawn()])], { maxTimeWaitingForNextWave: 0 }),
    nativeWave([nativeFragment([nativeSpawn()])]),
  ]);
  const advanced = advanceSpawnSchedule(createSpawnScheduleExecution(schedule), { tick: 0 });
  assert.deepEqual(advanced.spawns.map(spawn => spawn.schedule.waveIndex), [0, 1]);
  assert.equal(isSpawnScheduleCompleted(advanced.state), false);
  assert.throws(() => advanceSpawnSchedule(advanced.state, { tick: 1 }), /must be recorded/);
  assert.throws(() => recordScheduleSpawns(advanced.state, advanced.spawns, [0]), /available pending spawns/);
  const first = recordScheduleSpawns(advanced.state, [advanced.spawns[0]], [0]);
  assert.equal(first.pendingSpawnCount, 1);
  assert.equal(first.spawnedCount, 1);
  assert.deepEqual(first.managedWaveUnitIds, []);
  assert.deepEqual(first.managedFinalUnitIds, [0]);
  assert.throws(() => advanceSpawnSchedule(first, { tick: 1 }), /must be recorded/);
  const state = recordScheduleSpawns(first, [advanced.spawns[1]], [1]);
  assert.equal(state.pendingSpawnCount, 0);
  assert.equal(state.spawnedCount, 2);
  assert.throws(() => recordScheduleSpawns(state, [advanced.spawns[1]], [2]), /available pending spawns/);
  assert.equal(state.waveIndex, 1);
  assert.deepEqual(state.managedWaveUnitIds, [1]);
  assert.deepEqual(state.managedFinalUnitIds, [0, 1]);
});


test('branches require explicit triggers, consume one phase each, support loops and allow overlapping phase queues', () => {
  const { level, schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([nativeSpawn({ preDelay: 1 })])]),
  ], { extra: { phases: [
    nativeFragment([nativeSpawn({ preDelay: 3 / 30 })]),
    nativeFragment([nativeSpawn()]),
  ] } });
  let step = dispatchSchedule(createSpawnScheduleExecution(schedule), 0);
  assert.equal(step.state.branchCursors.extra, 0);
  assert.equal(step.state.activeBranches.length, 0);
  assert.equal(getUnspawnedCount(step.state), 1);
  step = dispatchSchedule(step.state, 1, [], [{ branchId: 'extra', isLoop: false }]);
  assert.equal(step.state.branchCursors.extra, 1);
  assert.equal(getUnspawnedCount(step.state), 2);
  step = dispatchSchedule(step.state, 2, [0], [{ branchId: 'extra', isLoop: false }]);
  assert.equal(step.state.branchCursors.extra, 2);
  assert.equal(step.state.activeBranches.length, 1);
  assert.equal(step.spawns[0].route, level.extraRoutes[0]);
  assert.deepEqual(step.spawns[0].timing, { waveStartedAtTick: 0, fragmentStartedAtTick: 0 });
  assert.deepEqual(step.state.managedWaveUnitIds, []);
  step = dispatchSchedule(step.state, 3, [], [{ branchId: 'extra', isLoop: false }]);
  assert.equal(step.spawns.length, 0);
  step = dispatchSchedule(step.state, 4, [1]);
  assert.equal(step.state.activeBranches.length, 0);
  step = dispatchSchedule(step.state, 5, [2], [
    { branchId: 'extra', isLoop: true }, { branchId: 'extra', isLoop: true },
  ]);
  assert.equal(step.spawns.length, 1);
  assert.equal(step.state.branchCursors.extra, 2);
  assert.equal(step.state.activeBranches.length, 1);
  const snapshot = step.state;
  assert.equal(step.state.branchCursors.extra, 2);
  assert.equal(step.state.activeBranches[0].spawns.length, 1);
  assert.equal(step.state.main.queue.spawns.length, 1);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 1, 2]);
  step = dispatchSchedule(step.state, 8, [3]);
  assert.equal(snapshot.branchCursors.extra, 2);
  assert.equal(snapshot.activeBranches[0].spawns.length, 1);
  assert.equal(snapshot.main.queue.spawns.length, 1);
  assert.deepEqual(snapshot.managedFinalUnitIds, [0, 1, 2]);
  assert.equal(getSpawnedCount(step.state), 4);
  assert.equal(getUnspawnedCount(step.state), 1);
  const before = step.state;
  assert.throws(() => advanceSpawnSchedule(step.state, { tick: 9, triggers: [{ branchId: 'missing', isLoop: false }] }), /unknown scheduler branch/);
  assert.equal(step.state, before);
});


test('WAVES projection rounds absolute action times, including fractional fragment delays, without periodic drift', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([nativeSpawn({ preDelay: 0.05, interval: 0.15, count: 8 })], 0.05)]),
  ]);
  let state = createSpawnScheduleExecution(schedule);
  const ticks = [];
  for (let tick = 0; tick <= 35; tick++) {
    const advanced = advanceSpawnSchedule(state, { tick });
    ticks.push(...advanced.spawns.map(spawn => spawn.tick));
    state = recordScheduleSpawns(advanced.state, advanced.spawns, advanced.spawns.map((_, index) => ticks.length - advanced.spawns.length + index));
  }
  assert.deepEqual(ticks, [3, 8, 12, 17, 21, 26, 30, 35]);
  assert.equal(getUnspawnedCount(state), 0);
});


test('delayed branch births snapshot the current main fragment and wave at dispatch rather than at their trigger', () => {
  const { level, schedule } = syntheticSpawnSchedule([
    nativeWave([
      nativeFragment([nativeSpawn({ preDelay: 1 / 30, dontBlockWave: true })]),
      nativeFragment([nativeSpawn({ preDelay: 2 / 30, dontBlockWave: true })], 1 / 30),
    ], { postDelay: 1 / 30 }),
    nativeWave([nativeFragment([nativeSpawn({ preDelay: 2 / 30 })], 2 / 30)], { preDelay: 1 / 30 }),
  ], { extra: { phases: [nativeFragment([
    nativeSpawn({ preDelay: 3 / 30 }), nativeSpawn({ preDelay: 8 / 30 }),
  ])] } });
  let state = createSpawnScheduleExecution(schedule);
  let nextUnitId = 0;
  const births = [];
  for (let tick = 0; tick <= 10; tick++) {
    const triggers = tick === 0 ? [{ branchId: 'extra', isLoop: false }] : [];
    const advanced = advanceSpawnSchedule(state, { tick, triggers });
    for (const spawn of advanced.spawns) births.push({
      tick: spawn.tick, branch: spawn.route === level.extraRoutes[0], timing: spawn.timing,
    });
    state = recordScheduleSpawns(advanced.state, advanced.spawns, advanced.spawns.map(() => nextUnitId++));
  }
  assert.deepEqual(births, [
    { tick: 1, branch: false, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 } },
    { tick: 3, branch: true, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 2 } },
    { tick: 4, branch: false, timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 2 } },
    { tick: 8, branch: true, timing: { waveStartedAtTick: 5, fragmentStartedAtTick: 8 } },
    { tick: 10, branch: false, timing: { waveStartedAtTick: 5, fragmentStartedAtTick: 8 } },
  ]);
});


test('same-tick branch dispatch reads the main snapshot before that tick enters its first fragment', () => {
  const { schedule } = syntheticSpawnSchedule([
    nativeWave([nativeFragment([nativeSpawn()], 1)]),
  ], { extra: { phases: [nativeFragment([nativeSpawn()])] } });
  const step = dispatchSchedule(createSpawnScheduleExecution(schedule), 0, [0], [{ branchId: 'extra', isLoop: false }]);
  assert.deepEqual(step.spawns[0].timing, { waveStartedAtTick: 0, fragmentStartedAtTick: 0 });
  assert.equal(step.state.fragmentStartedAtTick, 30);
  assert.equal(step.state.main.queue.spawns[0].tick, 30);
});


test('battle schedule completion can leave unmanaged live units, and branch command failures do not publish the tick', () => {
  const { spec } = slimeMovementFragment();
  const unmanaged = syntheticSpawnSchedule([nativeWave([nativeFragment([nativeSpawn({ managedByScheduler: false })])])]);
  let runtime = initializeBattle({ ...spec, schedule: unmanaged.schedule });
  const completed = (runtime = advanceBattle(runtime, []));
  assert.equal(completed.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(completed.result.spawnedCount, 1);
  assert.equal(completed.result.completedRouteCount, 0);
  assert.deepEqual(completed.result.remainingUnitIds, [0]);
  const branches = syntheticSpawnSchedule([nativeWave([nativeFragment([nativeSpawn({ preDelay: 1 })])])],
    { extra: { phases: [nativeFragment([nativeSpawn()])] } });
  let branchRuntime = initializeBattle({ ...spec, schedule: branches.schedule });
  (branchRuntime = advanceBattle(branchRuntime, []));
  assert.deepEqual(getSpawnScheduleCounts(branchRuntime.schedule), { spawnedCount: 0, unspawnedCount: 1 });
  const before = branchRuntime;
  assert.throws(() => (branchRuntime = advanceBattle(branchRuntime, [
    { type: 'TRIGGER_BRANCH', branchId: 'extra', isLoop: false },
    { type: 'TRIGGER_BRANCH', branchId: 'missing', isLoop: false },
  ])), /unknown scheduler branch/);
  assert.equal(branchRuntime, before);
  assert.deepEqual(getSpawnScheduleCounts(branchRuntime.schedule), { spawnedCount: 0, unspawnedCount: 1 });
  let triggered = initializeBattle({ ...spec, schedule: branches.schedule });
  (triggered = advanceBattle(triggered, []));
  const spawned = (triggered = advanceBattle(triggered, [{ type: 'TRIGGER_BRANCH', branchId: 'extra', isLoop: false }]));
  assert.deepEqual(getSpawnScheduleCounts(triggered.schedule), { spawnedCount: 1, unspawnedCount: 1 });
  assert.deepEqual(spawned.events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 0, tick: 1 }]);
  assert.deepEqual(triggered.battlefield.units.get(0).definition.route.startPosition, branches.level.extraRoutes[0].startPosition);
  assert.strictEqual(triggered.battlefield.units.get(0).route.main.definition, triggered.battlefield.units.get(0).definition.route);
});


test('raw 01 dragon branch waits for an explicit trigger and uses its own actual flying prefab and extra route', () => {
  const raw = arknightsFixture('level_act1autochess_01');
  const catalog = {
    character: () => assert.fail('no selected predefined characters'),
    skill: () => assert.fail('no selected predefined skills'),
    enemy: key => arknightsFixture(key),
    prefab: key => arknightsFixture(`prefab_${key}`),
  };
  const selection = { actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }], branches: ['dragon'], predefines: [] };
  const scenario = loadMovementScenario(raw, selection, catalog, 123);
  assert.deepEqual(scenario.inactiveBranches, []);
  let runtime = initializeBattle(scenario.spec);
  assert.deepEqual(runtime.schedule.activeBranches, []);
  while (runtime.tick < 95) (runtime = advanceBattle(runtime, []));
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.definition.id), ['enemy_1007_slime']);
  const first = (runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: false }]));
  assert.deepEqual(first.events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 1, tick: 95 }]);
  const dragon = runtime.battlefield.units.get(1);
  assert.equal(dragon.definition.id, 'enemy_9012_acloon');
  assert.equal(dragon.definition.locomotion.steeringParameters.steeringFactor, 8 / 30);
  assert.equal(dragon.definition.locomotion.steeringParameters.maxSteeringForce, 10 / 900);
  assert.equal(dragon.definition.locomotion.halfBodyWidth,
    arknightsFixture('prefab_enemy_9012_acloon').components.find(component =>
      Object.hasOwn(component.fields, '_halfBodyWidth')).fields._halfBodyWidth);
  assert.deepEqual(dragon.definition.route.startPosition, scenario.level.extraRoutes[0].startPosition);
  assert.strictEqual(dragon.route.main.definition, dragon.definition.route);
  assert.equal(dragon.definition.route.pathMotionMode, 'FLY');
  assert.equal('timing' in dragon.route.main, false);
  assert.deepEqual(runtime.schedule.managedWaveUnitIds, [0]);
  assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0, 1]);
  assert.equal((runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: false }]))
    .events.filter(event => event.type === 'ENEMY_SPAWNED').length, 0);
  assert.deepEqual((runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: true }]))
    .events.filter(event => event.type === 'ENEMY_SPAWNED'), [{ type: 'ENEMY_SPAWNED', unitId: 2, tick: 97 }]);
  while (runtime.result === null) (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(runtime.result.spawnedCount, 4);
  assert.equal(runtime.result.completedRouteCount, 4);
  assert.deepEqual(runtime.result.remainingUnitIds, []);
  const delayed = arknightsFixture('prefab_enemy_1007_slime');
  delayed.components.find(component => Object.hasOwn(component.fields, '_delayToBorn')).fields._delayToBorn = 1;
  assert.throws(() => loadMovementScenario(raw, selection, {
    ...catalog, prefab: key => key === 'enemy_1007_slime' ? delayed : catalog.prefab(key),
  }, 123), /synchronous enemy births/);
});


test('core blocked enemies at their route end stay in combat until their blocker dies', () => {
  const route = createRouteDefinition({
    pathMotionMode: 'WALK', startPosition: [0, 0], endPosition: [0, 0],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [],
    visitEveryCheckPoint: true,
  });
  let runtime = createLegacyCombatBattle({
    rows: 1, columns: 5, maxTicks: 20,
    operators: [{ definition: guard({ stats: { maxHp: 2, atk: 0, def: 0, blockCnt: 1 } }), position: [0, 0] }],
    enemies: [{ definition: walker({ hp: 100, atk: 1, bat: 0.1 }), route }],
  });
  const first = (runtime = advanceBattle(runtime, []));
  assert.equal(first.result, null);
  assert.equal(first.events.some(event => event.type === 'ACTION' && event.sourceUnitId === 1), false);
  assert.equal(first.events.some(event => event.type === 'ROUTE_COMPLETED' || event.type === 'UNIT_REMOVED'), false);
  const held = runtime;
  assert.deepEqual([...held.battlefield.units.values()].map(unit => unit.id), [0, 1]);
  assert.deepEqual(blockingQueries.relations(held).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  assert.deepEqual(held.schedule.managedFinalUnitIds, [1]);
  assert.equal(held.battlefield.units.get(1).route.main.phase.type, 'COMPLETED');
  assert.equal(held.battlefield.units.get(0).vitality.hp, 2);
  for (let tick = 1; tick < 4; tick++) {
    const waiting = (runtime = advanceBattle(runtime, []));
    assert.equal(waiting.result, null);
    assert.equal(waiting.events.some(event => event.type === 'ROUTE_COMPLETED' || event.type === 'UNIT_REMOVED'), false);
    assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), blockingQueries.relations(held).map(({ blocker, blocked }) => [blocker.id, blocked.id]));
  }
  const released = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(released.events.filter(event => event.type === 'UNIT_REMOVED').map(event => [event.unitId, event.reason]), [[0, 'DEATH'], [1, 'SCRIPT']]);
  assert.deepEqual(released.events.filter(event => event.type === 'ROUTE_COMPLETED').map(event => event.unitId), [1]);
  assert.equal(released.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(released.result.elapsedTicks, 5);
  assert.equal(released.result.completedRouteCount, 1);
  assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
  assert.equal(runtime.battlefield.units.size, 0);
});


test('core blocked route waits can teleport away, release their blocker and resume movement', () => {
  const route = createRouteDefinition({
    pathMotionMode: 'WALK', startPosition: [0, 0], endPosition: [0, 4],
    spawnOffset: [0, 0], spawnRandomRange: [0, 0],
    checkpoints: [
      { type: 'WAIT_FOR_TICKS', durationTicks: 2 },
      { type: 'APPEAR_AT_POS', position: [0, 3], reachOffset: [0, 0] },
    ],
    visitEveryCheckPoint: true,
  });
  let runtime = createLegacyCombatBattle({
    rows: 1, columns: 5, maxTicks: 20,
    operators: [{ definition: guard({ stats: { maxHp: 100, atk: 0, def: 0, blockCnt: 1 } }), position: [0, 0] }],
    enemies: [{ definition: walker({ hp: 100, atk: 1, bat: 0.1 }), route }],
  });
  (runtime = advanceBattle(runtime, []));
  assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  assert.equal(runtime.battlefield.units.get(1).route.main.phase.checkpointState.deadlineTick, 2);
  const stillWaiting = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(stillWaiting.events.filter(event => event.type === 'ROUTE'), []);
  assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  const teleported = (runtime = advanceBattle(runtime, []));
  assert.deepEqual(teleported.events.filter(event => event.type === 'ROUTE'), [
    { type: 'ROUTE', unitId: 1, signal: { type: 'APPEAR_AT_POS', position: [3, 0] }, position: [3, 0], tick: 2 },
  ]);
  assert.ok(runtime.battlefield.units.get(1).position[0] > 3);
  assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
  assert.equal(teleported.result, null);
  for (let tick = 3; tick <= 5; tick++) {
    const moving = (runtime = advanceBattle(runtime, []));
    assert.equal(moving.events.some(event => event.type === 'ACTION' && event.sourceUnitId === 1), false);
    assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
    assert.ok(runtime.battlefield.units.get(1).position[0] > 3);
    assert.ok(runtime.battlefield.units.get(1).locomotion.velocity[0] > 0);
    assert.equal(runtime.battlefield.units.get(0).vitality.hp, 99);
  }
});


test('core same-position alternative disappearance and appearance replace an existing blocking relation', () => {
  const route = createRouteDefinition({
    pathMotionMode: 'WALK', startPosition: [0, 1], endPosition: [0, 4],
    spawnOffset: [0.4, 0], spawnRandomRange: [0, 0],
    checkpoints: [{ type: 'WAIT_FOR_TICKS', durationTicks: 30 }],
    visitEveryCheckPoint: true,
  });
  let source = createLegacyCombatBattle({
    rows: 1, columns: 5, maxTicks: 20,
    operators: [{ definition: guard({ stats: { maxHp: 100, atk: 0, def: 0, blockCnt: 1 } }), position: [0, 1] }],
    enemies: [{ definition: walker({ hp: 100, atk: 1, bat: 0.1 }), route }],
  });
  (source = advanceBattle(source, []));
  const [operator, enemy] = source.battlefield.units.values();
  const map = createMap(1, 5, tileEntries(Array.from({ length: 5 }, () => ({
    heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
  }))));
  let runtime = initializeBattle({
    map, initialUnits: [{ definition: operator.definition, position: [1, 0] }],
    predefines: [{ id: 99, alias: null, initiallyPresent: false, creation: {
      type: 'UNIT', definition: operator.definition, position: [1.5, 0], } }],
    schedule: { type: 'TIMELINE', spawns: [{
      definition: enemy.definition, route, tick: 0,
      timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0 },
      alwaysCheckCurrentPoint: true, notCountInTotal: false,
    }] },
    initialMechanisms: [], maxTicks: 20, routeMoveMultiplier: 1,
    rngState: 1,
  });
  (runtime = advanceBattle(runtime, []));
  const before = runtime;
  assert.deepEqual(blockingQueries.relations(before).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  const hidden = normalizeRoute(createRouteDefinition({ ...route, checkpoints: [{ type: 'DISAPPEAR' }] }),
    { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, route.spawnOffset, true);
  const appeared = normalizeRoute(createRouteDefinition({ ...route, checkpoints: [
    { type: 'APPEAR_AT_POS', position: [0, 1], reachOffset: [0.4, 0] },
    { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ] }), { waveStartedAtTick: 0, fragmentStartedAtTick: 0 }, route.spawnOffset, true);
  const disappeared = (runtime = advanceBattle(runtime, [
    { type: 'APPEAR_PREDEFINED', definitionId: 99 },
    { type: 'SET_ALTERNATIVE_ROUTE', unitId: 1, route: hidden },
  ]));
  assert.deepEqual(disappeared.events.filter(event => event.type === 'ROUTE').map(event => [event.signal.type, event.position]), [
    ['DISAPPEAR', [1.4, 0]],
  ]);
  assert.deepEqual(blockingQueries.relations(runtime).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
  const step = (runtime = advanceBattle(runtime, [{ type: 'SET_ALTERNATIVE_ROUTE', unitId: 1, route: appeared }]));
  assert.deepEqual(step.events.filter(event => event.type === 'ROUTE').map(event => [event.signal.type, event.position]), [
    ['APPEAR_AT_POS', [1.4, 0]],
  ]);
  const after = runtime;
  assert.deepEqual(after.battlefield.units.get(1).position, before.battlefield.units.get(1).position);
  assert.equal(after.battlefield.units.get(1).spatialPresence.present, true);
  assert.deepEqual(blockingQueries.relations(after).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[0, 1]]);
  assert.notEqual(after.battlefield.units.get(0).blocker.blocked[0],
    before.battlefield.units.get(0).blocker.blocked[0]);
  assert.equal(step.result, null);
});


function deploymentBattleInput(overrides = {}, cards = []) {
  const source = routeCommandBattle([{ type: 'WAIT_FOR_TICKS', durationTicks: 100 }], {
    route: { startPosition: [0, 5], endPosition: [0, 5] }, maxTicks: 100,
  });
  return {
    ...withTimelineSpawns(source, [{ ...source.schedule.spawns[0], tick: 99 }]),
    deployment: { definition: { initialDp: 99, maxDp: 99, dpRecoveryTicks: null, slotLimit: null }, cards },
    map: createMap(1, 6, tileEntries(Array.from({ length: 6 }, () => ({
      heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
      terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
    })))),
    ...overrides,
  };
}


const deployableDefinition = (id = 'test_deployable') => Object.freeze({ hooks: [],
  id, occupancy: { slot: 'OCCUPANT' }, deployable: createDeployableDefinition({ cost: 0, redeployTicks: 0, slots: 1, buildableType: 'ALL' }),
  vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }), allegiance: Object.freeze({ side: 'ALLY' }),
  layer: Object.freeze({ type: 'GROUND' }),
  blocker: Object.freeze({ capacity: 1, geometry: Object.freeze({ radius: 0.7 }) }),
});


test('core battle deploys and retreats units with immutable occupancy and current tile navigation costs', () => {
  const definition = deployableDefinition();
  let runtime = initializeBattle(deploymentBattleInput({}, [{ unit: definition, supply: {
    stockLimit: null, activeLimit: null, recharge: 'DEPLOYMENT', costPenalty: false,
  } }]));
  const maps = runtime.battlefield.navigation;
  const deployed = (runtime = advanceBattle(runtime, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 1] }]));
  const unit = runtime.battlefield.units.get(0);
  assert.equal(unit.id, 0);
  assert.equal(unit.definition, definition);
  assert.deepEqual(unit.position, [1, 0]);
  assert.deepEqual(unit.occupancy.tile, [0, 1]);
  assert.equal(unit.definition.occupancy.slot, 'OCCUPANT');
  assert.deepEqual(deployed.events.filter(event => event.type === 'UNIT_DEPLOYED').map(event => event.unitId), [0]);
  assert.equal(runtime.battlefield.navigation, maps);

  (runtime = advanceBattle(runtime, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 3] }]));
  assert.deepEqual([...runtime.battlefield.units.values()].map(value => [value.id, value.position]), [[0, [1, 0]], [1, [3, 0]]]);
  const retreated = (runtime = advanceBattle(runtime, [{ type: 'RETREAT_UNIT', unitId: 0 }]));
  assert.deepEqual(retreated.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [0]);
  assert.deepEqual([...runtime.battlefield.units.values()].map(value => value.id), [1]);
  (runtime = advanceBattle(runtime, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 1] }]));
  assert.deepEqual([...runtime.battlefield.units.values()].map(value => [value.id, value.position]), [[1, [3, 0]], [2, [1, 0]]]);
  assert.equal(runtime.battlefield.navigation, maps);

  const occupancy = { tile: [0, 5] };
  const initialInput = deploymentBattleInput({
    initialUnits: [{ definition: Object.freeze({ hooks: [], id: 'reserved_home', occupancy: { slot: 'OCCUPANT' } }), position: [5, 0], tile: occupancy.tile,
       }],
  }, [{ unit: definition }]);
  let reserved = initializeBattle(initialInput);
  assert.equal(reserved.battlefield.units.get(0).occupancy.tile, occupancy.tile);
  assert.deepEqual(reserved.battlefield.units.get(0).occupancy.tile, [0, 5]);
  assert.equal(reserved.battlefield.units.get(0).definition.occupancy.slot, 'OCCUPANT');


  const before = reserved;
  const rejected = (reserved = advanceBattle(reserved, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 5] }]));
  assert.deepEqual(rejected.events.filter(event => event.type === 'DEPLOYMENT_REJECTED').map(event => event.reason), ['OCCUPIED']);
  assert.deepEqual(reserved.battlefield.units, before.battlefield.units);
  assert.deepEqual(reserved.deployment, before.deployment);
  assert.deepEqual(reserved.execution, before.execution);

  const level = parseLevelDefinition(arknightsFixture('level_act1autochess_m02'), {
    consumeTileBlackboard: (_, entry) => ['isValidHand', 'previewNotAlloed'].includes(entry.key),
  });
  const recipe = parsePredefinedDefinition(50,
    level.predefines.tokenInsts.find(instance => instance.inst.characterKey === 'trap_1105_accrate'),
    parsePredefinedPrefab(arknightsFixture('prefab_trap_1105_accrate')), arknightsFixture('character_trap_1105_accrate'));
  const crate = recipe.creation.definition;
  let crates = initializeBattle(deploymentBattleInput({}, [{ unit: crate }, { unit: definition }]));
  const baseline = crates.battlefield.navigation;
  (crates = advanceBattle(crates, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 1] }]));
  assert.deepEqual(navigationMap(crates.battlefield.navigation).cells.map(cell => cell.cost), [1, 1000, 1, 1, 1, 1]);
  assert.deepEqual(navigationMap(crates.battlefield.navigation).cells.map(cell => cell.passable), navigationMap(baseline).cells.map(cell => cell.passable));
  assert.deepEqual(crates.battlefield.navigation.baseline.FLY.cells, baseline.baseline.FLY.cells);
  assert.deepEqual(crates.battlefield.navigation.overlays.WALK, []);
  assert.equal(crates.battlefield.map.tiles.get(1).state.walkCost, 1000);
  assert.equal(crates.battlefield.map.tiles.get(1).definition.initial.walkCost, 1);
  assert.equal(crates.battlefield.units.get(0).definition, crate);
  assert.equal(occupancyAt(crates.battlefield, [0, 1])?.occupant?.id, 0);
  assert.equal(occupancyAt(crates.battlefield, [0, 1])?.support ?? null, null);
  const crateBlockedDeployment = advanceBattle(crates, [
    { type: 'DEPLOY_UNIT', cardId: 1, tilePosition: [0, 1] },
  ]);
  assert.deepEqual(crateBlockedDeployment.events.filter(event => event.type === 'DEPLOYMENT_REJECTED')
    .map(event => event.reason), ['OCCUPIED']);
  assert.deepEqual([...crateBlockedDeployment.battlefield.units.keys()], [0]);
  const initialCrate = crates;
  (crates = advanceBattle(crates, [{ type: 'RETREAT_UNIT', unitId: 0 }]));
  assert.equal(crates.battlefield.units.size, 0);
  assert.deepEqual(initialCrate.battlefield.units.get(0).position, [1, 0]);
  assert.deepEqual(initialCrate.battlefield.units.get(0).occupancy.tile, [0, 1]);
  assert.equal(initialCrate.battlefield.units.get(0).definition.occupancy.slot, 'OCCUPANT');
  assert.deepEqual(crates.battlefield.navigation.overlays.WALK, []);

  assert.deepEqual(navigationMap(crates.battlefield.navigation).cells, navigationMap(baseline).cells);
  assert.deepEqual(crates.battlefield.navigation.baseline.FLY.cells, baseline.baseline.FLY.cells);
});


test('core battle accepts the first deployment and rejects an occupied destination without consuming another identity', () => {
  const definition = deployableDefinition();
  const spec = deploymentBattleInput({}, [{ unit: definition, supply: {
    stockLimit: null, activeLimit: null, recharge: 'DEPLOYMENT', costPenalty: false,
  } }]);
  let runtime = initializeBattle(spec), replay = initializeBattle(spec);
  const deploy = tilePosition => ({ type: 'DEPLOY_UNIT', cardId: 0, tilePosition });
  const before = runtime, maps = runtime.battlefield.navigation;
  const result = (runtime = advanceBattle(runtime, [deploy([0, 1]), deploy([0, 1])]));
  assert.deepEqual(result.events.filter(event => event.type === 'DEPLOYMENT_REJECTED').map(event => event.reason), ['OCCUPIED']);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => [unit.id, unit.position]), [[0, [1, 0]]]);
  assert.equal(runtime.execution.nextUnitId, before.execution.nextUnitId + 1);
  assert.equal(runtime.deployment.dp, before.deployment.dp);
  assert.equal(runtime.battlefield.navigation, maps);
  let deployed = initializeBattle(spec);
  assert.deepEqual((deployed = advanceBattle(deployed, [deploy([0, 1]), deploy([0, 2])])), (replay = advanceBattle(replay, [deploy([0, 1]), deploy([0, 2])])));
  assert.deepEqual(deployed, replay);

  (replay = advanceBattle(replay, [{ type: 'RETREAT_UNIT', unitId: 0 }, deploy([0, 1])]));
  assert.deepEqual([...replay.battlefield.units.values()].map(unit => unit.id), [1, 2]);
});


test('core visibility: commands from different domains execute in phase order before array order', () => {
  const definition = deployableDefinition();
  const spec = deploymentBattleInput({ predefines: [{
    id: 17, alias: null, initiallyPresent: true, creation: {
      type: 'UNIT', definition, position: [1, 0], tile: [0, 1],
    },
  }] }, [{ unit: definition }]);
  let runtime = initializeBattle(spec);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.id), [0]);
  const unitAtRemoval = runtime.battlefield.units.get(0);
  const step = (runtime = advanceBattle(runtime, [
    { type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 1] },
    { type: 'REMOVE_PREDEFINED', definitionId: 17, reason: 'SCRIPT' },
  ]));

  assert.deepEqual(step.events.filter(event => event.type === 'UNIT_DEPLOYED' || event.type === 'UNIT_REMOVED'), [
    { type: 'UNIT_DEPLOYED', unitId: 1, position: [1, 0], tick: 0 },
    { type: 'UNIT_REMOVED', unitId: 0, reason: 'SCRIPT', tick: 0,
      unit: { ...unitAtRemoval, lifecycle: 'LEAVING' } },
  ]);
  assert.equal(unitAtRemoval.lifecycle, 'PRESENT');
  const snapshot = runtime;
  assert.deepEqual([...snapshot.battlefield.units.values()].map(unit => [unit.id, unit.position]), [[1, [1, 0]]]);
  assert.deepEqual(snapshot.predefinedPresence, []);
  assert.equal(snapshot.execution.nextUnitId, 2);
});




test('core elevated support disables blocking without changing target layer and leaves its occupant without content cleanup', () => {
  const provider = Object.freeze({ id: 'platform_provider', occupancy: { slot: 'SUPPORT', hooks: [] },
    hooks: [{ id: "test/enter", stage: "enter", invoke(battle, self) { return { state: changeTile(battle, self.occupancy.tile, { elevation: 'HIGHLAND', allowsBlocking: false }), value: undefined }; } }, { id: "test/leave", stage: "leave", invoke(battle, { unit }) {
      const position = unit.occupancy.tile;
      const initial = battle.battlefield.map.tiles.get(position[0] * battle.battlefield.map.columns + position[1]).definition.initial;
      return { state: changeTile(battle, position, { elevation: initial.elevation, allowsBlocking: initial.allowsBlocking }), value: undefined };
    } }],


  });
  const definition = deployableDefinition();
  const enemyDefinition = Object.freeze({ hooks: [], id: 'standing_enemy',
    vitality: Object.freeze({ maxHp: 100, defense: 0, resistance: 0 }), allegiance: Object.freeze({ side: 'ENEMY' }),
    layer: Object.freeze({ type: 'GROUND' }), blockable: Object.freeze({ volume: 1 }),
  });
  const occupancy = { tile: [0, 1] };
  const recipe = createPredefinedDefinition({ id: 50, alias: 'test_platform', initiallyPresent: true, creation: {
    type: 'UNIT', definition: provider, position: [1, 0], tile: occupancy.tile,
  } });
  assert.equal(recipe.creation.tile, occupancy.tile);
  assert.deepEqual(recipe.creation.tile, [0, 1]);
  const tile = [0, 1];
  const hiddenRecipe = createPredefinedDefinition({ ...recipe, initiallyPresent: false,
    creation: { ...recipe.creation, tile } });
  let runtime = initializeBattle(deploymentBattleInput({
    initialUnits: [{ definition: enemyDefinition, position: [1, 0] }],
    predefines: [hiddenRecipe],
  }, [{ unit: definition }]));
  assert.equal(hiddenRecipe.creation.tile, tile);

  assert.deepEqual(runtime.predefinedPresence, []);
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId: 50 }]));
  const platformId = runtime.predefinedPresence[0].source.unitId;
  const platform = runtime.battlefield.units.get(platformId);
  assert.equal(platform.occupancy.tile, hiddenRecipe.creation.tile);
  assert.deepEqual(platform.occupancy.tile, [0, 1]);
  assert.equal(platform.definition.occupancy.slot, 'SUPPORT');



  const deployed = (runtime = advanceBattle(runtime, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 1] }]));
  const occupantId = deployed.events.find(event => event.type === 'UNIT_DEPLOYED').unitId;
  const supported = runtime;
  const supportedEntry = occupancyAt(supported.battlefield, [0, 1]);
  assert.equal(supportedEntry.occupant.id, occupantId);
  assert.equal(supported.battlefield.units.get(supportedEntry.support.id), platform);
  assert.deepEqual(blockingQueries.relations(supported).map(({ blocker, blocked }) => [blocker.id, blocked.id]), []);
  assert.equal(supported.battlefield.units.get(occupantId).layer.type, 'GROUND');
  const removed = (runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId: 50, reason: 'SCRIPT' }]));
  assert.deepEqual(removed.events.filter(event => event.type === 'UNIT_REMOVED').map(event => event.unitId), [platformId]);
  const after = runtime;
  const remainingEntry = occupancyAt(after.battlefield, [0, 1]);
  assert.equal(remainingEntry.occupant.id, occupantId);
  assert.equal(remainingEntry.support, null);
  assert.equal(supported.battlefield.units.get(occupancyAt(supported.battlefield, [0, 1]).support.id), platform);
  assert.equal(after.battlefield.units.get(occupantId).definition, definition);
  assert.deepEqual(after.battlefield.units.get(occupantId).position, [1, 0]);
  assert.equal(after.battlefield.units.get(occupantId).vitality.hp, 100);
  assert.equal(after.battlefield.units.get(occupantId).layer.type, 'GROUND');
  assert.deepEqual(blockingQueries.relations(after).map(({ blocker, blocked }) => [blocker.id, blocked.id]), [[occupantId, [...after.battlefield.units.values()].find(unit => unit.definition === enemyDefinition).id]]);
});
