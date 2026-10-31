import * as conditions from "../../dist/content/terrain/condition.js";
import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import * as unitQueries from "../../dist/core/unit/query.js";
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialize as initializeBattle, step as stepBattle } from '../../dist/core/battle/runtime.js';
import { add, replace as updateUnit, remove } from '../../dist/core/battle/unit.js';
import { getUnit, initialize, fixtureBattle } from '../helpers/unit.js';
import { instantiateUnitPlacement } from '../../dist/core/battle/creation/placement.js';
import { advancePredefined } from '../../dist/core/battle/steps/predefined.js';
import { resolveScheduleUnits } from '../../dist/core/battle/schedule/index.js';
import { create as createMap } from '../../dist/core/battlefield/map/map.js';
import { createInput as createRouteDefinition } from '../../dist/core/battle/creation/route.js';


const map = createMap(2, 4, tileEntries(Array.from({ length: 8 }, () => ({
  heightType: 'LOWLAND', meleeBlockable: true, buildableType: 'ALL', passableMask: 'ALL',
  terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
}))));
const route = createRouteDefinition({
  pathMotionMode: 'WALK', startPosition: [1, 3], endPosition: [1, 0],
  spawnOffset: [0, 0], spawnRandomRange: [0, 0], checkpoints: [{ type: 'WAIT_FOR_TICKS', durationTicks: 1000 }],
  allowDiagonalMove: false, visitEveryTileCenter: false, visitEveryNodeCenter: false, visitEveryCheckPoint: true,
});
const spawn = (definition, tick = 0) => ({
  tick, definition, route, alwaysCheckCurrentPoint: true, notCountInTotal: false,
  timing: { waveStartedAtTick: tick, fragmentStartedAtTick: tick },
});
const input = (fields = {}) => ({
  map, schedule: { type: 'TIMELINE', spawns: [] }, initialUnits: [], predefines: [],
  initialMechanisms: [], maxTicks: 30, routeMoveMultiplier: 1,
  rngState: 123, ...fields,
});
const markEntered = (trace, id) => ({
  id, vitality: { maxHp: 100, defense: 0, resistance: 0 },
  hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
    trace.push([id, self.id, self.vitality.hp]);
    return { state: updateUnit(state, [{ ...self, vitality: { ...self.vitality, hp: 75 } }]), value: undefined };
  } }],
});

test('enter registers one complete Unit before Skill entry and passes its latest state to Unit entry', () => {
  const trace = [];
  const skill = ({
    id: 'entry-program', initialize: battle => ({ state: battle, value: ({}) }), sp: null, activation: null,
    onEnter(battle, source, self) {
      const host = unitQueries.get(battle, source);
      trace.push(['skill', host.id, host.vitality.hp]);
      return updateUnit(battle, [{ ...host, vitality: { ...host.vitality, hp: 63 } }]);
    },
  });
  const unit = initialize({ id: 3, position: [1, 0], definition: {
    id: 'complete-entry', skill, vitality: { maxHp: 100, defense: 0, resistance: 0 },
    hooks: [{ id: "test/enter", stage: "enter", invoke(battle, self) {
      assert.strictEqual(self, getUnit(battle, self.id));
      trace.push(['unit', self.id, self.vitality.hp]);
      return { state: updateUnit(battle, [{ ...self, vitality: { ...self.vitality, hp: 47 } }]), value: undefined };
    } }],
  } });
  const initial = fixtureBattle();
  const entered = add(initial, unit);

  assert.deepEqual(trace, [['skill', 3, 100], ['unit', 3, 63]]);
  assert.equal(getUnit(entered, 3).vitality.hp, 47);
  assert.equal(getUnit(initial, 3), undefined);
  assert.equal(unit.vitality.hp, 100);
  assert.throws(() => add(entered, unit), /duplicate unit/);
  assert.equal(trace.length, 2);
});

test('Skill entry can synchronously remove its host before the Unit entry callback', () => {
  const skill = ({
    id: 'depart-on-entry', initialize: battle => ({ state: battle, value: ({}) }), sp: null, activation: null,
    onEnter: (battle, source, self) => remove(battle, source.id, 'SCRIPT'),
  });
  const unit = initialize({ id: 3, position: [1, 0], definition: {
    id: 'departing-entry', skill,
    hooks: [{ id: "test/enter", stage: "enter", invoke() { assert.fail('removed Unit must not receive entry callback'); } }],
  } });
  const initial = fixtureBattle();
  const entered = add(initial, unit);

  assert.equal(getUnit(entered, 3), undefined);
  assert.deepEqual(entered.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[3, 'SCRIPT']]);
  assert.deepEqual(initial.removedUnits, []);
});

test('initial Units finish entry before allocating and registering the next Unit', () => {
  const trace = [];
  const firstEntry = markEntered(trace, 'first');
  const first = { ...firstEntry, hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
    assert.deepEqual([...state.battlefield.units.keys()], [self.id]);
    assert.equal(state.execution.nextUnitId, 1);
    state = firstEntry.hooks[0].invoke(state, self).state;
    const child = instantiateUnitPlacement(state, {
      definition: markEntered(trace, 'child'), position: [2, 0],
    });
    return { state: add(child.state, child.value), value: undefined };
  } }] };
  const secondEntry = markEntered(trace, 'second');
  const second = { ...secondEntry, hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
    assert.equal(self.id, 2);
    assert.equal(getUnit(state, 0).vitality.hp, 75);
    assert.equal(getUnit(state, 1).definition.id, 'child');
    assert.equal(getUnit(state, 1).vitality.hp, 75);
    return secondEntry.hooks[0].invoke(state, self);
  } }] };
  let runtime = initializeBattle(input({ initialUnits: [
    { definition: first, position: [0, 0] },
    { definition: second, position: [1, 0] },
  ] }));
  assert.deepEqual(trace, [['first', 0, 100], ['child', 1, 100], ['second', 2, 100]]);
  assert.equal(runtime.execution.nextUnitId, 3);
  assert.deepEqual(unitQueries.all(runtime).toArray().map(unit => unit.vitality.hp), [75, 75, 75]);
  assert.equal(second.vitality.maxHp, 100);
});

test('initial predefined entry uses the same sequential bindings as later appearances', () => {
  const trace = [];
  const definitions = [{
    id: 0, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', position: [0, 0], definition: {
      id: 'first-predefined',
      hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
        trace.push(self.id);
        assert.equal(state.execution.nextUnitId, 1);
        assert.deepEqual(state.predefinedPresence, [
          { definitionId: 0, source: { type: 'UNIT', unitId: self.id } },
        ]);
        return { state: advancePredefined(state, definitions, [
          { type: 'APPEAR_PREDEFINED', definitionId: 1 },
        ]), value: undefined };
      } }],
    } },
  }, {
    id: 1, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', position: [1, 0], definition: {
      id: 'second-predefined', hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) { trace.push(self.id); return { state: state, value: undefined }; } }],
    } },
  }];
  let runtime = initializeBattle(input({ predefines: definitions }));
  assert.deepEqual(trace, [0, 1]);
  assert.equal(runtime.execution.nextUnitId, 2);
  assert.deepEqual(runtime.predefinedPresence, [
    { definitionId: 0, source: { type: 'UNIT', unitId: 0 } },
    { definitionId: 1, source: { type: 'UNIT', unitId: 1 } },
  ]);
});

test('same-tick spawns expose only completed entries and preserve nested allocations and schedule updates', () => {
  const trace = [];
  const first = {
    id: 'first-spawn',
    hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
      trace.push(self.id);
      assert.deepEqual([...state.battlefield.units.keys()], [0]);
      assert.equal(state.schedule.spawnedCount, 1);
      assert.equal(state.schedule.pendingSpawnCount, 1);
      assert.deepEqual(state.schedule.managedFinalUnitIds, [0]);
      assert.deepEqual(state.events.map(event => event.unitId), [0]);
      const child = instantiateUnitPlacement(state, {
        definition: { hooks: [], id: 'spawn-child' }, position: [2, 0],
      });
      state = add(child.state, child.value);
      return { state: { ...state, schedule: resolveScheduleUnits(state.schedule, [self.id]) }, value: undefined };
    } }],
  };
  const second = {
    id: 'second-spawn',
    hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
      trace.push(self.id);
      assert.equal(self.id, 2);
      assert.equal(getUnit(state, 1).definition.id, 'spawn-child');
      assert.equal(state.schedule.spawnedCount, 2);
      assert.equal(state.schedule.pendingSpawnCount, 0);
      assert.deepEqual(state.schedule.managedFinalUnitIds, [2]);
      assert.deepEqual(state.events.map(event => event.unitId), [0, 2]);
      return { state: state, value: undefined };
    } }],
  };
  let runtime = initializeBattle(input({
    schedule: { type: 'TIMELINE', spawns: [spawn(first), spawn(second)] },
  }));
  const before = runtime;
  const step = (runtime = stepBattle(runtime, []));
  assert.deepEqual(trace, [0, 2]);
  assert.deepEqual(step.events.filter(event => event.type === 'ENEMY_SPAWNED').map(event => event.unitId), [0, 2]);
  assert.equal(runtime.execution.nextUnitId, 3);
  assert.deepEqual(runtime.schedule.managedFinalUnitIds, [2]);
  assert.deepEqual(unitQueries.all(before).toArray(), []);
  assert.equal(before.execution.nextUnitId, 0);
});

test('scheduled Units enter after spawning and keep immutable old snapshots', () => {
  const trace = [];
  const definition = { spatialPresence: {}, ...markEntered(trace, 'spawned'), locomotion: {
    halfBodyWidth: 0, speed: 0, minSpeed: 0,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
  } };
  let runtime = initializeBattle(input({ schedule: { type: 'TIMELINE', spawns: [spawn(definition)] } }));
  const before = runtime;
  runtime = stepBattle(runtime, []);
  runtime = stepBattle(runtime, []);
  assert.deepEqual(trace, [['spawned', 0, 100]]);
  assert.equal(unitQueries.all(runtime).toArray()[0].vitality.hp, 75);
  assert.deepEqual(unitQueries.all(before).toArray(), []);
});

test('predefined appearances and deployment initialize once', () => {
  const trace = [];
  const deployable = { ...markEntered(trace, 'deployed'), occupancy: { slot: "OCCUPANT" }, deployable: { cost: 0, redeployTicks: 0, slots: 1, placement: 'ALL', allowedSiteConditions: [conditions.normal], refund: { rate: 0.5, limit: 'BASE_COST' } } };
  let runtime = initializeBattle(input({ deployment: {
    definition: { initialDp: 0, maxDp: 99, dpRecoveryTicks: null, slotLimit: null },
    cards: [{ unit: deployable }],
  }, predefines: [{
    id: 9, alias: null, initiallyPresent: true,
    creation: { type: 'UNIT', definition: markEntered(trace, 'predefined'), position: [2, 0] },
  }], schedule: { type: 'TIMELINE', spawns: [spawn({ hooks: [],
    spatialPresence: {},
    id: 'later', vitality: { maxHp: 100, defense: 0, resistance: 0 }, locomotion: {
      halfBodyWidth: 0, speed: 0, minSpeed: 0,
      steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
    },
  }, 1000)] } }));
  runtime = stepBattle(runtime, [{ type: 'DEPLOY_UNIT', cardId: 0, tilePosition: [0, 0] }]);
  const before = runtime;
  runtime = stepBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId: 9, reason: 'SCRIPT' },
    { type: 'APPEAR_PREDEFINED', definitionId: 9 }]);
  assert.deepEqual(trace, [['predefined', 0, 100], ['deployed', 1, 100], ['predefined', 2, 100]]);
  assert.equal(unitQueries.all(before).find(unit => unit.id === 1).vitality.hp, 75);
  assert.deepEqual(unitQueries.all(before).find(unit => unit.id === 1).position, [0, 0]);
  assert.deepEqual(unitQueries.all(runtime).find(unit => unit.id === 1).position, [0, 0]);
});

test('unit initialization exposes registered lifecycle hooks and selected capability state', async () => {
  const { default: ts } = await import('typescript');
  const directory = mkdtempSync(join(tmpdir(), 'stronghold-entry-types-'));
  const module = JSON.stringify(fileURLToPath(new URL('../../src/core/unit/initialize.js', import.meta.url)));
  const path = join(directory, 'entry.mts');
  try {
    writeFileSync(path, `
import { initialize } from ${module};
import type { EnterHook } from ${JSON.stringify(fileURLToPath(new URL('../../src/core/unit/hook.js', import.meta.url)))};
import type { Unit } from ${JSON.stringify(fileURLToPath(new URL('../../src/core/unit/unit.js', import.meta.url)))};
import * as operations from ${JSON.stringify(fileURLToPath(new URL('../../src/core/battle/unit.js', import.meta.url)))};
import { createChange } from ${JSON.stringify(fileURLToPath(new URL('../../src/core/unit/change.js', import.meta.url)))};
import { ref } from ${JSON.stringify(fileURLToPath(new URL('../../src/core/unit/query.js', import.meta.url)))};
import * as state from ${JSON.stringify(fileURLToPath(new URL('../../src/core/battle/state.js', import.meta.url)))};
declare const battle: import(${JSON.stringify(fileURLToPath(new URL('../../src/core/battle/state.js', import.meta.url)))}).State;
const enter: EnterHook = {
  id: 'typed-entry', stage: 'enter',
  invoke(state, self) { const id: number = self.id; return { state, value: undefined }; },
};
const unit = initialize(battle, { id: 0, position: [0, 0], definition: {
  id: 'typed-content', hooks: [enter], vitality: { maxHp: 100, defense: 0, resistance: 0 },
} }).value;
enter.invoke(battle, unit, undefined);
// @ts-expect-error Unit entry hooks receive the fixed Unit snapshot, not its numeric identity.
enter.invoke(battle, unit.id, undefined);
const hp: number = unit.vitality.hp;
const entered = operations.add(battle, unit);
const updated = operations.update(entered, [createChange(ref(unit), self => ({ ...self, vitality: { ...self.vitality, hp: 75 } }))]);
const departed = operations.remove(updated, unit.id, "SCRIPT");
const advanced: state.State = operations.advance(departed);
// @ts-expect-error entry accepts a complete Unit, not an already registered identity.
operations.add(battle, unit.id);
// @ts-expect-error Battle State no longer exports a separate registration operation.
state.addUnit;
// @ts-expect-error Battle State no longer exposes an incomplete removal operation.
state.removeUnit;
// @ts-expect-error Unit updates belong to battle/unit.ts.
state.updateUnit;
`);
    const program = ts.createProgram([path], {
      noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext, strict: true, exactOptionalPropertyTypes: true,
      noUncheckedIndexedAccess: true, skipLibCheck: true, types: [],
    });
    assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')), []);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
