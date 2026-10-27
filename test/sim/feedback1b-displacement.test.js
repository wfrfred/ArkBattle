import { fixtureBattle } from "../helpers/unit.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { create as createNavigation } from "../../dist/core/battlefield/navigation/state.js";
import { createInput, createTiming } from "../../dist/core/battle/creation/route.js";
import { initialize as initializeRoutedUnit } from "../../dist/core/battle/creation/routed-unit.js";
import { add as addUnit, update as updateUnit } from "../../dist/core/battle/unit.js";
import { ref, get } from "../../dist/core/unit/query.js";
import * as route from "../../dist/core/unit/capability/route/index.js";
import { advance as advanceLocomotion } from "../../dist/core/unit/capability/locomotion/index.js";
import { createSteeringParameters, integrate } from "../../dist/core/unit/capability/locomotion/steering.js";
import { reflect as reflectNavigationMovement } from "../../dist/core/unit/capability/locomotion/motion.js";

const approx = (a, b, eps, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} ${a} ≈ ${b}`);


function coreMotionMap(blocked = [], mode = 'WALK') {
  return new NavigationMap(3, 8, Array.from({ length: 24 }, (_, index) => ({
    passable: !blocked.includes(index), cost: 1,
    departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
  })));
}


const coreSteeringParameters = createSteeringParameters({ steeringFactor: 0.25, maxSteeringForce: 1 });



test('core steering: a zero heading decelerates without mutating its history', () => {
  const velocity = [0.2, 0.1];
  const before = structuredClone(velocity);
  const waiting = integrate(velocity, [0, 0], 0.4, [0, 0], coreSteeringParameters);
  approx(waiting[0], 0.15, 1e-12);
  approx(waiting[1], 0.075, 1e-12);
  assert.deepEqual(velocity, before);
});

test('core movement: an impassable landing tile reflects the displacement around its centre', () => {
  const map = coreMotionMap([11]);
  const start = [2.4, 1], next = [2.6, 1.2];
  const reflected = reflectNavigationMovement(start, next, map);
  approx(reflected[0], 2.2, 1e-12);
  approx(reflected[1], 1.2, 1e-12);
  approx(Math.hypot(reflected[0] - start[0], reflected[1] - start[1]), Math.hypot(0.2, 0.2), 1e-12);
  assert.equal(reflectNavigationMovement([2.4, 1], [2.49, 1.2], map)[0], 2.49);
  assert.equal(reflectNavigationMovement(start, next, coreMotionMap()), next);
  assert.deepEqual(reflectNavigationMovement([0, 1], [-0.6, 1], map), [0.6, 1]);
  assert.deepEqual(reflectNavigationMovement([-1, 1], [-2, 1], map), [-2, 1]);
});



function coreDisplacedEnemy(checkpoints = [{
  type: 'MOVE', target: { position: [1, 6], reachOffset: [0.2, 0.1] },
}]) {
  const initialized = initializeRoutedUnit(
    fixtureBattle(0, { rngState: 42 }),
    {
      id: 1,
      alwaysCheckCurrentPoint: true,
      definition: { hooks: [],
        spatialPresence: {},
        id: 'enemy_displacement_boundary',
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
        locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0.1, steeringParameters: coreSteeringParameters },
      },
      route: createInput({
        pathMotionMode: 'WALK',
        startPosition: [1, 0],
        endPosition: [1, 7],
        spawnOffset: [0.1, 0.05],
        spawnRandomRange: [0, 0],
        checkpoints,
        visitEveryCheckPoint: true,
      }),
      timing: createTiming({ waveStartedAtTick: 0, fragmentStartedAtTick: 0 }),
    },
  );
  const unitRef = ref(initialized.value);
  let battle = addUnit(initialized.state, initialized.value);
  battle = {
    ...battle,
    battlefield: {
      ...battle.battlefield,
      navigation: createNavigation({ WALK: coreMotionMap(), FLY: coreMotionMap() }),
    },
  };
  return {
    battle,
    unitRef,
    step(battle, tick) {
      battle = route.advance({ ...battle, tick }, unitRef);
      const target = route.movementTarget(battle, unitRef);
      return target === null ? battle : advanceLocomotion(battle, unitRef, target, {
        mode: route.pathMotionMode(get(battle, unitRef).route), speedMultiplier: 1,
      });
    },
  };
}


test('core displacement preserves route progress, sampled definition and deterministic inputs', () => {
  const h = coreDisplacedEnemy();
  const walking = h.step(h.battle, 0);
  const walkingUnit = get(walking, h.unitRef);
  const progress = walkingUnit.route.main;
  const before = JSON.stringify(walkingUnit);
  const displace = battle => {
    const self = get(battle, h.unitRef);
    return updateUnit(battle, [{
      ...self, position: [self.position[0] + 1, self.position[1] + 0.1],
    }]);
  };
  const forced = displace(walking);
  const forcedUnit = get(forced, h.unitRef);
  approx(forcedUnit.position[0], walkingUnit.position[0] + 1, 1e-12);
  approx(forcedUnit.position[1], walkingUnit.position[1] + 0.1, 1e-12);
  assert.equal(forcedUnit.route.main, progress);
  assert.equal(forcedUnit.locomotion.velocity, walkingUnit.locomotion.velocity);
  assert.equal(forced.execution, walking.execution);
  assert.equal(JSON.stringify(walkingUnit), before);
  assert.deepEqual(displace(walking), forced);
  const resumed = h.step(forced, 2);
  const resumedUnit = get(resumed, h.unitRef);
  assert.ok(resumedUnit.position[0] > forcedUnit.position[0]);
  assert.equal(resumedUnit.route.main.definition, progress.definition);
  assert.deepEqual(resumedUnit.route.main.phase, progress.phase);
  assert.equal(resumed.execution.rngState, forced.execution.rngState);
});


test('core displacement does not suspend the route absolute wait deadline', () => {
  const h = coreDisplacedEnemy([{ type: 'WAIT_FOR_TICKS', durationTicks: 3 }]);
  let battle = route.advance(h.battle, h.unitRef);
  const initial = get(battle, h.unitRef);
  const velocity = [0.05, 0];
  battle = updateUnit(battle, [{
    ...initial, position: [initial.position[0] + 1, initial.position[1]],
    locomotion: { ...initial.locomotion, velocity },
  }]);
  const forced = get(battle, h.unitRef);
  assert.deepEqual(forced.position, [1.1, 1.05]);
  assert.deepEqual(forced.route.main.phase.checkpointState, {
    type: 'WAITING', deadlineTick: 3,
  });
  assert.equal(forced.locomotion.velocity, velocity);
  battle = route.advance({ ...battle, tick: 1 }, h.unitRef);
  assert.equal(get(battle, h.unitRef).route.main, forced.route.main);
  const goal = [forced.position[0] + 1, forced.position[1]];
  battle = advanceLocomotion(battle, h.unitRef, { nextPoint: goal, goal }, { mode: "WALK", speedMultiplier: 1 });
  assert.ok(get(battle, h.unitRef).position[0] > forced.position[0]);
  assert.equal(get(battle, h.unitRef).route.main.phase.checkpointState.deadlineTick, 3);
  const sameTick = route.advance(battle, h.unitRef);
  assert.equal(get(sameTick, h.unitRef).route.main, forced.route.main);
  const elapsed = route.advance({ ...sameTick, tick: 3 }, h.unitRef);
  assert.equal(get(elapsed, h.unitRef).route.main.phase.type, 'END');
});


test('core displacement outside the map resumes with budgeted recovery and preserved route facts', () => {
  const h = coreDisplacedEnemy();
  let battle = route.advance(h.battle, h.unitRef);
  const initial = get(battle, h.unitRef);
  battle = updateUnit(battle, [{
    ...initial,
    position: [initial.position[0] - 1, initial.position[1]],
    locomotion: { ...initial.locomotion, velocity: [0.02, 0.04] },
  }]);
  const forced = get(battle, h.unitRef);
  const before = JSON.stringify(forced);
  const resumed = h.step(battle, 1);
  const unit = get(resumed, h.unitRef);
  assert.ok(unit.position[0] > forced.position[0]);
  assert.ok(Math.hypot(unit.position[0] - forced.position[0], unit.position[1] - forced.position[1]) <= 0.1 + 1e-12);
  assert.equal(unit.route.main.definition, forced.route.main.definition);
  assert.deepEqual(unit.route.main.phase, forced.route.main.phase);
  assert.equal(resumed.execution.rngState, battle.execution.rngState);
  assert.equal(JSON.stringify(forced), before);
});
