import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import { ref } from "../../dist/core/unit/query.js";
import { advance as advanceBlocking, search as searchBlocking } from "../../dist/core/battle/blocking/operations.js";
import { advanceMovement, resolveRouteCompletion } from "../../dist/core/battle/steps/movement.js";
import { remove, update } from "../../dist/core/battle/unit.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../dist/core/battle/tile.js";
import { nextPoint as nextNavigationPoint } from "../../dist/core/battlefield/navigation/state.js";
import { appear } from "../../dist/core/unit/capability/presence/index.js";
import * as routeOperations from "../../dist/core/unit/capability/route/index.js";

const step = state => resolveRouteCompletion(advanceBlocking(advanceMovement(state, { routeMoveMultiplier: 1 })));
const route = overrides => ({
    pathMotionMode: "WALK", startPosition: [0, 0], endPosition: [0, 6], offset: [0, 0],
    checkpoints: [], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true, ...overrides,
});
const mover = overrides => ({
    id: "route-movement", hooks: Hooks.empty(), spatialPresence: {},
    locomotion: { speed: 0.2, minSpeed: 0, halfBodyWidth: 0,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    route: route(), ...overrides,
});

test("Main completion stops motion while blocked and departure waits for release", () => {
    let state = battle([
        { definition: {
            id: "blocker", hooks: Hooks.empty(), spatialPresence: {},
            allegiance: { side: "ALLY" }, layer: { type: "GROUND" },
            blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 1 },
        }, position: [0, 0] },
        { definition: mover({
            route: route({ endPosition: [0, 0] }), allegiance: { side: "ENEMY" },
            layer: { type: "GROUND" }, blockable: { volume: 1, rules: [] },
        }), position: [0, 0] },
    ]);
    state = searchBlocking(state, ref(get(state, 0)));
    state = step(state);
    assert.equal(get(state, 1).route.main.phase.type, "COMPLETED");
    assert.deepEqual(get(state, 1).position, [0, 0]);
    assert.equal(state.completedRouteCount, 0);
    state = step({ ...state, tick: 1 });
    assert.notEqual(get(state, 1), undefined);
    assert.equal(state.completedRouteCount, 0);

    state = step({ ...remove(state, 0, "SCRIPT"), tick: 2 });
    assert.equal(get(state, 1), undefined);
    assert.equal(state.completedRouteCount, 1);
});

test("a route wait preserves velocity from previous movement and resumes at its deadline", () => {
    let state = battle([{ definition: mover({
        route: route({ checkpoints: [
            { type: "MOVE", position: [0, 0], offset: [0.4, 0] },
            { type: "WAIT", tick: 3 },
        ] }),
    }), position: [0, 0] }]);
    state = step(state);
    state = step({ ...state, tick: 1 });
    const moving = get(state, 0);
    state = step({ ...state, tick: 2 });
    assert.deepEqual(get(state, 0).position, moving.position);
    assert.deepEqual(get(state, 0).locomotion.velocity, moving.locomotion.velocity);
    state = step({ ...state, tick: 5 });
    assert.ok(get(state, 0).position[0] > moving.position[0]);
});

test("Route keeps the navigation tracking point when its full body ray is blocked but this Tick can move", () => {
    let state = battle([{ definition: mover({
        locomotion: { speed: 0.01, minSpeed: 0, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
        route: route({
            endPosition: [1, 4], offset: [0, 0.4],
            checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0, 0] }],
        }),
    }), position: [0, 0.8] }], { rows: 2, columns: 5 });
    state = updateTile(state, [1, 1], {
        ...getTile(state.battlefield.map, [1, 1]).state, passability: "NONE",
    });
    const host = ref(get(state, 0));
    state = routeOperations.advance(state, host);
    assert.deepEqual(routeOperations.movementTarget(state, host), { nextPoint: [4, 0.4], goal: [4, 0.4] });
    const moved = get(step(state), 0);
    assert.ok(moved.position[0] > 0 && moved.position[0] < 0.1);
});

test("Route returns the final MOVE goal separately from the next navigation node", () => {
    let state = battle([{ definition: mover({
        route: route({
            endPosition: [2, 4], offset: [0, 0.1],
            checkpoints: [{ type: "MOVE", position: [1, 4], offset: [0, 0.2] }],
        }),
    }), position: [0, 1.1] }], { rows: 3, columns: 5 });
    state = updateTile(state, [1, 2], {
        ...getTile(state.battlefield.map, [1, 2]).state, passability: "NONE",
    });
    const host = ref(get(state, 0));
    state = routeOperations.advance(state, host);
    const target = routeOperations.movementTarget(state, host);
    assert.deepEqual(target.goal, [4, 1.3]);
    assert.notDeepEqual(target.nextPoint, target.goal);
    const next = nextNavigationPoint(state.battlefield.navigation, "WALK", [0, 1], [4, 1.2]);
    assert.deepEqual(target.nextPoint, [next[0], next[1] + 0.1]);
});

test("Runtime consumes the current path mode without changing the unit's ground identity", () => {
    let state = battle([{ definition: mover({
        layer: { type: "GROUND" }, route: route({ endPosition: [1, 4] }),
    }), position: [0, 1] }], { rows: 2, columns: 5 });
    state = updateTile(state, [1, 4], {
        ...getTile(state.battlefield.map, [1, 4]).state, passability: "FLY_ONLY",
    });
    const host = ref(get(state, 0));
    state = step(state);
    assert.deepEqual(get(state, 0).position, [0, 1]);
    state = step({ ...routeOperations.setPathMotionMode(state, host, "FLY"), tick: 1 });
    assert.ok(get(state, 0).position[0] > 0);
    assert.equal(get(state, 0).layer.type, "GROUND");
});

test("outside-map displacement recovers within the movement budget and keeps its MOVE checkpoint", () => {
    let state = battle([{ definition: {
        id: "displaced", hooks: Hooks.empty(), spatialPresence: {},
        locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0.1,
            steeringParameters: { steeringFactor: 0.25, maxSteeringForce: 1 } },
        route: {
            pathMotionMode: "WALK", startPosition: [1, 0], endPosition: [1, 7],
            offset: [0.1, 0.05], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true,
            checkpoints: [{ type: "MOVE", position: [1, 6], offset: [0.2, 0.1] }],
        },
    }, position: [0.1, 1.05] }]);
    const host = ref(get(state, 0));
    state = advanceMovement(state, { routeMoveMultiplier: 1 });
    const moving = get(state, 0);
    state = update(state, host, appear([moving.position[0] - 1, moving.position[1]]));
    const displaced = get(state, 0).position;
    state = advanceMovement({ ...state, tick: 1 }, { routeMoveMultiplier: 1 });
    const resumed = get(state, 0);
    assert.ok(resumed.position[0] > displaced[0]);
    assert.ok(Math.hypot(resumed.position[0] - displaced[0], resumed.position[1] - displaced[1]) <= 0.1 + 1e-12);
    assert.equal(resumed.route.main.phase.type, "CHECKPOINT");
    assert.equal(resumed.route.main.phase.index, 0);
    assert.equal(resumed.route.main.phase.checkpointState.type, "MOVING");
});
