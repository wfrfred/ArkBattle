import { fixtureBattle } from "../helpers/unit.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { create as createNavigation } from "../../dist/core/battlefield/navigation/state.js";
import { createInput, createTiming } from "../../dist/core/battle/creation/route.js";
import { initialize as initializeRoutedUnit } from "../../dist/core/battle/creation/routed-unit.js";
import { add as addUnit, replace as updateUnit } from "../../dist/core/battle/unit.js";
import { ref, get } from "../../dist/core/unit/query.js";
import * as route from "../../dist/core/unit/capability/route/index.js";
import { advance as advanceLocomotion } from "../../dist/core/unit/capability/locomotion/index.js";
import { createSteeringParameters } from "../../dist/core/unit/capability/locomotion/steering.js";


function coreMotionMap(blocked = [], mode = 'WALK') {
  return new NavigationMap(3, 8, Array.from({ length: 24 }, (_, index) => ({
    passable: !blocked.includes(index), cost: 1,
    departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
  })));
}


const coreSteeringParameters = createSteeringParameters({ steeringFactor: 0.25, maxSteeringForce: 1 });


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
