import { Hooks } from "../../dist/core/hook.js";
import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { advance as advanceBlocking, search as searchBlocking } from "../../dist/core/battle/blocking/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { advanceMovement, resolveRouteCompletion } from "../../dist/core/battle/steps/movement.js";
import { remove } from "../../dist/core/battle/unit.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import { create } from "../../dist/core/battlefield/state.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { Map as NavigationMap } from "../../dist/core/battlefield/navigation/map.js";
import { create as createNavigation, nextPoint as nextNavigationPoint } from "../../dist/core/battlefield/navigation/state.js";
import * as routeOperations from "../../dist/core/unit/capability/route/index.js";


const step = battle => resolveRouteCompletion(advanceBlocking(advanceMovement(battle, { routeMoveMultiplier: 1 })));
const cell = overrides => ({
    passable: true, cost: 1, departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true }, ...overrides,
});
const route = overrides => ({
    pathMotionMode: "WALK", startPosition: [0, 0], endPosition: [4, 0], offset: [0, 0],
    checkpoints: [], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true, ...overrides,
});

function battle(rows = 5, columns = 3, cells = Array.from({ length: rows * columns }, () => cell())) {
    const tile = createTile({
        heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
        terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
    });
    const state = createBattleState(create(createMap(rows, columns, tileEntries(Array(rows * columns).fill(tile)))));
    const navigation = createNavigation({
        WALK: new NavigationMap(rows, columns, cells),
        FLY: new NavigationMap(rows, columns, cells.map(entry => ({ ...entry, cost: 1 }))),
    });
    return { ...state, battlefield: { ...state.battlefield, navigation } };
}

function unit(battle, id, definition, position = [0, 0]) {
    return initialize(battle, {         id, position,
        definition: { hooks: Hooks.empty(),
            id: `route-movement-${id}`, spatialPresence: {},
            locomotion: { speed: 2, minSpeed: 0, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
            route: route(), ...definition,
        },
    }).value;
}


test("Main completion stops motion while blocked and departure waits for release", () => {
    let state = battle();
    const blocker = initialize(state, { id: 1, position: [0, 0], definition: { hooks: Hooks.empty(),
        id: "route-movement-blocker", spatialPresence: {},
        allegiance: { side: "ALLY" }, layer: { type: "GROUND" },
        blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 1 },
    } }).value;
    const enemy = unit(state, 2, {
        route: route({ endPosition: [0, 0] }), allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" }, blockable: { volume: 1 },
    });
    state = addUnit(state, blocker);
    state = addUnit(state, {
        ...enemy, locomotion: { ...enemy.locomotion, velocity: [1, 0] },
    });
    state = searchBlocking(state, { id: 1 });
    const first = step(state);
    assert.equal(getUnit(first, 2).route.main.phase.type, "COMPLETED");
    assert.deepEqual(getUnit(first, 2).position, [0, 0]);
    assert.deepEqual(getUnit(first, 2).locomotion.velocity, [1, 0]);

    assert.equal(first.completedRouteCount, 0);
    const blockedAgain = step({ ...first, tick: 1 });
    assert.notEqual(getUnit(blockedAgain, 2), undefined);
    assert.equal(blockedAgain.completedRouteCount, 0);

    const departed = step(remove(blockedAgain, 1, "SCRIPT"));
    assert.equal(getUnit(departed, 2), undefined);
    assert.equal(departed.completedRouteCount, 1);
    assert.equal(step(departed).completedRouteCount, 1);
});


test("a route wait skips Locomotion without clearing its history velocity", () => {
    let state = battle();
    const initial = unit(state, 1, {
        route: route({ checkpoints: [{ type: "WAIT", tick: 3 }] }),
    });
    state = addUnit(state, {
        ...initial,
        locomotion: { ...initial.locomotion, velocity: [0.3, 0.4] },
    });
    const waiting = step(state);
    assert.deepEqual(getUnit(waiting, 1).position, [0, 0]);
    assert.deepEqual(getUnit(waiting, 1).locomotion.velocity, [0.3, 0.4]);
    const resumed = step({ ...waiting, tick: 3 });
    assert.notDeepEqual(getUnit(resumed, 1).position, [0, 0]);
});

test("Route keeps the navigation tracking point when its full body ray is blocked but this Tick can move", () => {
    const cells = Array.from({ length: 10 }, () => cell());
    cells[6] = cell({ passable: false });
    let state = battle(2, 5, cells);
    const initial = unit(state, 1, {
        locomotion: { speed: 0.01, minSpeed: 0, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
        route: route({
            endPosition: [1, 4], offset: [0, 0.4],
            checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0, 0] }],
        }),
    }, [0, 0.8]);
    state = addUnit(state, initial);
    state = routeOperations.advance(state, { id: 1 });
    const target = nextNavigationPoint(state.battlefield.navigation, "WALK", [0, 0.4], [4, 0]);
    assert.deepEqual(target, [4, 0]);
    assert.deepEqual(routeOperations.movementTarget(state, { id: 1 }), { nextPoint: [4, 0.4], goal: [4, 0.4] });
    const moved = getUnit(step(state), 1);
    assert.ok(moved.position[0] > initial.position[0]);
    assert.ok(moved.locomotion.velocity[0] > 0);
    assert.equal(moved.position[0] < 0.1, true);
});

test("Route returns the final MOVE goal separately from the next navigation node", () => {
    const cells = Array.from({ length: 15 }, () => cell());
    cells[7] = cell({ passable: false });
    let state = battle(3, 5, cells);
    state = addUnit(state, unit(state, 1, {
        route: route({
            endPosition: [2, 4], offset: [0, 0.1],
            checkpoints: [{ type: "MOVE", position: [1, 4], offset: [0, 0.2] }],
        }),
    }, [0, 1.1]));
    state = routeOperations.advance(state, { id: 1 });
    const target = routeOperations.movementTarget(state, { id: 1 });
    assert.deepEqual(target.goal, [4, 1.3]);
    assert.notDeepEqual(target.nextPoint, target.goal);
    const next = nextNavigationPoint(state.battlefield.navigation, "WALK", [0, 1], [4, 1.2]);
    assert.deepEqual(target.nextPoint, [next[0], next[1] + 0.1]);
});

test("Runtime consumes the current path mode without changing the unit's ground identity", () => {
    const cells = Array.from({ length: 10 }, () => cell());
    cells[9] = cell({ passable: false });
    let state = battle(2, 5, cells);
    const flyCells = Array.from({ length: 10 }, () => cell());
    state = {
        ...state,
        battlefield: {
            ...state.battlefield,
            navigation: createNavigation({
                WALK: state.battlefield.navigation.baseline.WALK,
                FLY: new NavigationMap(2, 5, flyCells),
            }),
        },
    };
    state = addUnit(state, unit(state, 1, {
        layer: { type: "GROUND" },
        route: route({ endPosition: [1, 4] }),
        locomotion: { speed: 0.1, minSpeed: 0, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    }, [0, 1]));
    assert.equal(step(state), state);
    const changed = routeOperations.setPathMotionMode(state, { id: 1 }, "FLY");
    const moved = getUnit(step(changed), 1);
    assert.ok(moved.position[0] > 0);
    assert.equal(moved.layer.type, "GROUND");
    assert.equal(moved.route.main.definition.pathMotionMode, "WALK");
    assert.equal(moved.route.main.pathMotionMode, "FLY");
});
