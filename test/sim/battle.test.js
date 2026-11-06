import * as unitQueries from "../../dist/core/unit/query.js";
import { Hooks } from "../../dist/core/hook.js";

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createMechanismDefinition } from "../../dist/core/battle/mechanism.js";
import { initialize as initializeBattle, step as advanceBattle, simulateBattle } from "../../dist/core/battle/runtime.js";
import { advanceSpawnSchedule, getSpawnScheduleCounts, getSpawnedCount, getUnspawnedCount, isSpawnScheduleCompleted, recordScheduleSpawns, resolveScheduleUnits } from "../../dist/core/battle/schedule/index.js";
import { createSpawnScheduleExecution } from "../../dist/core/battle/schedule/state.js";
import { createSpawnScheduleDefinition } from "../../dist/core/battle/schedule/definition.js";
import { createInput as createRouteDefinition } from "../../dist/core/battle/creation/route.js";
import { secondsToTicks } from "../../dist/data/arknights/tick.js";
import { parseLevelContent, parseLevelDefinition } from "../../dist/data/arknights/level.js";
import { parseEnemyMovementContent, parseEnemyMovementDefinition } from "../../dist/data/arknights/enemy.js";
import { parseEnemyMovementPrefab } from "../../dist/data/arknights/prefab.js";
import { compileSpawnSchedule } from "../../dist/data/arknights/schedule.js";
import { compileLevelMovementFragment } from "../../dist/data/arknights/movement-fragment.js";
import { loadMovementScenario } from "../../dist/data/arknights/movement-scenario.js";

function arknightsFixture(name) {
  return JSON.parse(readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), 'utf8'));
}

function slimeMovementFragment(rawLevel = arknightsFixture('level_act1autochess_01'), actionIndices = [0]) {
  const rawEnemy = arknightsFixture('enemy_1007_slime');
  const profile = parseEnemyMovementPrefab(arknightsFixture('prefab_enemy_1007_slime'));
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
  const profile = parseEnemyMovementPrefab(arknightsFixture('prefab_enemy_1007_slime'));
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
  const { rawLevel, spec, omittedActions, inactiveBranches } = slimeMovementFragment();
  assert.equal(spec.map.rows, rawLevel.mapData.map.length);
  assert.equal(spec.map.columns, rawLevel.mapData.map[0].length);
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.tick), [90, 240]);
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
  while (runtime.tick < 90) runtime = advanceBattle(runtime, []);
  assert.equal(runtime.tick, 90);
  assert.equal(runtime.battlefield.units.size, 0);
  runtime = advanceBattle(runtime, []);

  const first = runtime;
  assert.equal(first.schedule.spawnedCount, 1);
  assert.deepEqual(first.schedule.managedFinalUnitIds, [0]);
  assert.equal(first.battlefield.units.get(0).vitality.hp, 550);
  assert.equal(first.battlefield.units.get(0).route.main.phase.type, 'END');
  assert.equal(first.battlefield.units.get(0).position[1], 9);
  assert.ok(first.battlefield.units.get(0).position[0] < 10);
  while (runtime.tick < 240) (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.tick, 240);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.id), [0]);
  runtime = advanceBattle(runtime, []);

  const second = runtime;
  assert.equal(second.schedule.spawnedCount, 2);
  assert.deepEqual(second.schedule.managedFinalUnitIds, [0, 1]);
  assert.deepEqual([...second.battlefield.units.values()].map(unit => unit.route.main.phase.type), ['END', 'END']);
});

test('route waits use their birth, play, wave and fragment clocks', () => {
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
    let runtime = initializeBattle(input);
    while (runtime.result === null) {
      const tick = runtime.tick;
      runtime = advanceBattle(runtime, []);
      if (tick < 5) {
        assert.equal(runtime.battlefield.units.size, 0);
        continue;
      }
      const unit = runtime.battlefield.units.get(0), progress = unit.route.main.phase;
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
      const state = runtime.battlefield.units.get(0).route.main;
      assert.equal(runtime.schedule.waveIndex, 1);
      assert.equal(runtime.schedule.waveStartedAtTick, 5);
      assert.equal(runtime.schedule.fragmentStartedAtTick, tick < 7 ? 5 : 7);
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

test('patrol loop reentries keep their scheduled ownership', () => {
  const { spec } = slimeMovementFragment();
  const spawn = spec.schedule.spawns[0];
  const route = createRouteDefinition({ ...spawn.route, visitEveryCheckPoint: true, checkpoints: [10, 9].map(column => ({
    type: 'PATROL_MOVE', target: { position: [9, column], reachOffset: [0, 0] },
  })) });
  const definition = { spatialPresence: {}, ...spawn.definition,
    locomotion: { ...spawn.definition.locomotion, speed: 4 },
  };
  const input = { ...withTimelineSpawns(spec, [{ ...spawn, tick: 0, definition, route, alwaysCheckCurrentPoint: true }]), maxTicks: 24 };
  let runtime = initializeBattle(input), positions = [];
  while (runtime.result === null) {
    runtime = advanceBattle(runtime, []);
    assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0]);
    assert.equal(runtime.battlefield.units.get(0).route.main.phase.type, 'CHECKPOINT');
    positions.push(runtime.battlefield.units.get(0).position[0]);
  }
  assert.deepEqual(runtime.result, {
    reason: 'TIME_LIMIT', elapsedTicks: 24, spawnedCount: 1, completedRouteCount: 0, remainingUnitIds: [0], unspawnedCount: 0,
  });

  assert.ok(positions.filter((position, index) => index > 0 && position !== positions[index - 1]).length > 4);
  assert.ok(runtime.battlefield.units.get(0).definition.route.checkpoints.some(checkpoint => checkpoint.type === 'GOTO'));
});

test('core route disappearance and appearance preserve identity and scheduler ownership', () => {
  const input = routeCommandBattle([
    { type: 'DISAPPEAR' }, { type: 'WAIT_FOR_TICKS', durationTicks: 3 }, { type: 'ALERT' },
    { type: 'APPEAR_AT_POS', position: [9, 5], reachOffset: [0.25, 0] },
    { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ]);
  let runtime = initializeBattle(input);
  let appeared = false, observedHidden = false;
  while (runtime.result === null) {
    runtime = advanceBattle(runtime, []);
    const unit = runtime.battlefield.units.get(0);
    assert.equal(unit.id, 0);
    assert.equal(unit.vitality.hp, 550);
    assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0]);
    if (unit.spatialPresence.present) appeared = true;
    if (appeared) {
      assert.equal(unit.spatialPresence.present, true);
      assert.deepEqual(unit.position, [5.25, 9]);
    } else {
      assert.equal(unit.spatialPresence.present, false);
      observedHidden = true;
    }
  }
  assert.equal(observedHidden, true);
  assert.equal(appeared, true);

  assert.equal(runtime.result.reason, 'TIME_LIMIT');
  assert.equal(runtime.result.completedRouteCount, 0);
  assert.deepEqual(runtime.result.remainingUnitIds, [0]);
});

test('alternative route commands suspend Main deadlines and targets until cleared', () => {
  let waiting = initializeBattle(routeCommandBattle([{ type: 'WAIT_FOR_TICKS', durationTicks: 12 }]));
  (waiting = advanceBattle(waiting, []));
  const waitRoute = { ...waiting.battlefield.units.get(0).definition.route,
    checkpoints: [{ type: 'WAIT', tick: 30 }] };
  (waiting = advanceBattle(waiting, [{ type: 'SET_ALTERNATIVE_ROUTE', ref: unitQueries.ref(waiting.battlefield.units.get(0)), route: waitRoute }]));
  const active = waiting.battlefield.units.get(0);
  assert.equal(active.route.main.phase.checkpointState.deadlineTick, 12);
  assert.equal(active.route.alternative.phase.checkpointState.deadlineTick, 31);
  (waiting = advanceBattle(waiting, []));
  (waiting = advanceBattle(waiting, [{ type: 'CLEAR_ALTERNATIVE_ROUTE', ref: unitQueries.ref(waiting.battlefield.units.get(0)) }]));
  assert.equal(waiting.battlefield.units.get(0).route.alternative, null);
  assert.equal(waiting.battlefield.units.get(0).route.main.phase.checkpointState.deadlineTick, 12);

  const input = routeCommandBattle([{ type: 'MOVE', target: {
    position: [9, 8], reachOffset: [0.25, 0],
  } }]);
  let runtime = initializeBattle(input);
  runtime = advanceBattle(runtime, []);
  const main = runtime.battlefield.units.get(0).route.main;
  const route = { ...main.definition, startPosition: [100, 100], endPosition: [9, 10],
    checkpoints: [{ type: 'WAIT', tick: 3 }] };
  for (let tick = 1; tick < 10; tick++) {
    const commands = tick === 1 ? [{ type: 'SET_ALTERNATIVE_ROUTE', ref: unitQueries.ref(runtime.battlefield.units.get(0)), route }] : [];
    runtime = advanceBattle(runtime, commands);
    const unit = runtime.battlefield.units.get(0);
    assert.deepEqual(unit.route.main.phase, main.phase);
    assert.deepEqual(unit.position, [10, 9]);
  }
  assert.equal(runtime.battlefield.units.get(0).route.alternative.phase.type, 'COMPLETED');
  const clear = [{ type: 'CLEAR_ALTERNATIVE_ROUTE', ref: unitQueries.ref(runtime.battlefield.units.get(0)) }];
  runtime = advanceBattle(runtime, clear);
  assert.equal(runtime.battlefield.units.get(0).route.alternative, null);
  assert.deepEqual(runtime.battlefield.units.get(0).route.main.phase, main.phase);
});

test('core alternative route commands execute pending teleport instructions during advancement', () => {
  let runtime = initializeBattle(routeCommandBattle([
    { type: 'DISAPPEAR' }, { type: 'WAIT_FOR_TICKS', durationTicks: 30 },
  ]));
  (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, false);
  const main = runtime.battlefield.units.get(0).route.main;
  const route = { ...main.definition, checkpoints: [{ type: 'WAIT', tick: 30 }] };
  (runtime = advanceBattle(runtime, [{ type: 'SET_ALTERNATIVE_ROUTE', ref: unitQueries.ref(runtime.battlefield.units.get(0)), route }]));
  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, false);
  const teleport = { ...route, checkpoints: [
    { type: 'APPEAR_AT_POS', position: [9, 7], offset: [0, 0] },
    { type: 'WAIT', tick: 30 },
  ] };
  (runtime = advanceBattle(runtime, [{ type: 'SET_ALTERNATIVE_ROUTE', ref: unitQueries.ref(runtime.battlefield.units.get(0)), route: teleport }]));

  assert.equal(runtime.battlefield.units.get(0).spatialPresence.present, true);
  assert.deepEqual(runtime.battlefield.units.get(0).position, [7, 9]);
  (runtime = advanceBattle(runtime, [{ type: 'CLEAR_ALTERNATIVE_ROUTE', ref: unitQueries.ref(runtime.battlefield.units.get(0)) }]));
  const unit = runtime.battlefield.units.get(0);
  assert.equal(unit.route.alternative, null);
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

  assert.equal(first.result, null);
  const afterFirst = runtime;
  assert.equal(afterFirst.schedule.waveIndex, 0);
  assert.equal(afterFirst.schedule.main.phase, 'WAITING');
  assert.deepEqual(afterFirst.schedule.managedWaveUnitIds, []);
  assert.deepEqual(afterFirst.schedule.managedFinalUnitIds, []);
  const second = (runtime = advanceBattle(runtime, []));

  assert.equal(second.result, null);
  assert.equal(runtime.schedule.waveIndex, 1);
  const final = (runtime = advanceBattle(runtime, []));

  assert.deepEqual(final.result, {
    reason: 'SCHEDULE_COMPLETED', elapsedTicks: 3, spawnedCount: 2, completedRouteCount: 2,
    remainingUnitIds: [], unspawnedCount: 0,
  });
});

test('core battle deadline keeps live units separate from spawns due at the excluded final edge', () => {
  const { spec } = slimeMovementFragment();
  const limited = { ...spec, maxTicks: 240 };
  let runtime = initializeBattle(limited);
  while (runtime.result === null) runtime = advanceBattle(runtime, []);
  assert.deepEqual(runtime.result, {
    reason: 'TIME_LIMIT', elapsedTicks: 240, spawnedCount: 1, completedRouteCount: 0,
    remainingUnitIds: [0], unspawnedCount: 1,
  });

  assert.equal(runtime.battlefield.units.get(0).vitality.hp, 550);
  assert.deepEqual(simulateBattle(limited), runtime.result);
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
  assert.deepEqual(spec.schedule.spawns.map(spawn => spawn.timing), [
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
    { waveStartedAtTick: 0, fragmentStartedAtTick: 90 },
  ]);
  let runtime = initializeBattle(spec);
  while (runtime.tick < 180) runtime = advanceBattle(runtime, []);
  runtime = advanceBattle(runtime, []);
  const units = [...runtime.battlefield.units.values()];
  assert.deepEqual(units.map(unit => unit.id), [0, 1]);
  assert.deepEqual(units.map(unit => unit.definition.route.startPosition), level.routes.slice(0, 2).map(route => route.startPosition));
  assert.deepEqual(units.map(unit => unit.definition.route.checkpoints), [[], []]);
});

test('raw enemy movement levels inherit only defined values and reject sparse, unknown and invalid entries', () => {
  const fixture = arknightsFixture('enemy_1007_slime');
  const profile = parseEnemyMovementPrefab(arknightsFixture('prefab_enemy_1007_slime'));
  const parseMovement = (value, level) => parseEnemyMovementDefinition(value, level, profile);
  assert.deepEqual(parseMovement(fixture, 0), { hooks: Hooks.empty(),
    id: 'enemy_1007_slime', spatialPresence: {}, vitality: { maxHp: 550, defense: 0, resistance: 0 }, locomotion: { halfBodyWidth: profile.halfBodyWidth, speed: 1 / 30, minSpeed: 0.1 / 30, steeringParameters: profile.steeringParameters },
  });
  assert.deepEqual(parseMovement(fixture, 1), { hooks: Hooks.empty(),
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
  const birthTicks = [];
  while (runtime.result === null) {
    const tick = runtime.tick;
    const count = runtime.schedule.spawnedCount;
    runtime = advanceBattle(runtime, []);
    if (runtime.schedule.spawnedCount !== count) birthTicks.push(tick);
  }
  assert.deepEqual(birthTicks, expected);

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
  for (let index = 0; index < 27; index++) runtime = advanceBattle(runtime, []);
  assert.equal(runtime.schedule.spawnedCount, 0);
  runtime = advanceBattle(runtime, []);
  assert.equal(runtime.schedule.spawnedCount, 1);
  assert.equal(runtime.battlefield.units.size, 1);

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
  for (const tick of [-1, 0.5]) {
    assert.throws(() => initializeBattle(withTimelineSpawns(boundary, [{ ...boundary.schedule.spawns[0], tick }])), /spawn.tick/);
  }
  assert.throws(() => initializeBattle(withTimelineSpawns(boundary, [{ ...boundary.schedule.spawns[0],
    timing: { waveStartedAtTick: 0, fragmentStartedAtTick: 0.5 },
  }])), /fragmentStartedAtTick/);
});

test('movement scenarios apply selected enemy overrides and distinguish unresolved inputs from unsupported content', () => {
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
  const catalog = {
    character: () => assert.fail('no selected predefined characters'),
    skill: () => assert.fail('no selected predefined skills'),
    enemy: () => source,
    prefab: key => arknightsFixture(`prefab_${key}`),
  };
  const selection = {
    actions: [0, 1].map(actionIndex => ({ waveIndex: 0, fragmentIndex: 0, actionIndex })),
    branches: [], predefines: [],
  };
  const scenario = loadMovementScenario(raw, selection, catalog, 123);
  const actions = scenario.spec.schedule.waves[0].fragments[0].actions;

  assert.equal(actions[0].spawn.definition.vitality.maxHp, 1234);
  assert.equal(actions[0].spawn.definition.locomotion.speed, 0);
  assert.equal(actions[0].spawn.notCountInTotal, true);
  assert.deepEqual(scenario.unsupportedRules, []);
  assert.deepEqual(scenario.level.unresolvedRules, parsed.unresolvedRules);
  let runtime = initializeBattle(scenario.spec);
  runtime = advanceBattle(runtime, []);
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
  assert.equal(step.state.branchCursors.extra, 2);
  assert.equal(step.state.activeBranches[0].spawns.length, 1);
  assert.equal(step.state.main.queue.spawns.length, 1);
  assert.deepEqual(step.state.managedFinalUnitIds, [0, 1, 2]);
  step = dispatchSchedule(step.state, 8, [3]);
  assert.equal(getSpawnedCount(step.state), 4);
  assert.equal(getUnspawnedCount(step.state), 1);
  assert.throws(() => advanceSpawnSchedule(step.state, { tick: 9, triggers: [{ branchId: 'missing', isLoop: false }] }), /unknown scheduler branch/);
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

test('schedule completion leaves unmanaged live units and explicit branches add their own route', () => {
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
  let triggered = initializeBattle({ ...spec, schedule: branches.schedule });
  (triggered = advanceBattle(triggered, []));
  (triggered = advanceBattle(triggered, [{ type: 'TRIGGER_BRANCH', branchId: 'extra', isLoop: false }]));
  assert.deepEqual(getSpawnScheduleCounts(triggered.schedule), { spawnedCount: 1, unspawnedCount: 1 });

  assert.deepEqual(triggered.battlefield.units.get(0).definition.route.startPosition, branches.level.extraRoutes[0].startPosition);
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
  (runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: false }]));

  const dragon = runtime.battlefield.units.get(1);
  assert.equal(dragon.definition.id, 'enemy_9012_acloon');
  assert.equal(dragon.definition.locomotion.steeringParameters.steeringFactor, 8 / 30);
  assert.equal(dragon.definition.locomotion.steeringParameters.maxSteeringForce, 10 / 900);
  assert.equal(dragon.definition.locomotion.halfBodyWidth,
    arknightsFixture('prefab_enemy_9012_acloon').components.find(component =>
      Object.hasOwn(component.fields, '_halfBodyWidth')).fields._halfBodyWidth);
  assert.deepEqual(dragon.definition.route.startPosition, scenario.level.extraRoutes[0].startPosition);
  assert.equal(dragon.definition.route.motionMode, 'FLY');
  assert.deepEqual(runtime.schedule.managedWaveUnitIds, [0]);
  assert.deepEqual(runtime.schedule.managedFinalUnitIds, [0, 1]);
  runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: false }]);
  runtime = advanceBattle(runtime, [{ type: 'TRIGGER_BRANCH', branchId: 'dragon', isLoop: true }]);
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
