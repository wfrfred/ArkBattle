import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import { ref } from "../../dist/core/unit/query.js";
import { Map } from "../../dist/core/battlefield/navigation/map.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../dist/core/battle/tile.js";
import { integrate } from "../../dist/core/unit/capability/locomotion/steering.js";
import { reflect } from "../../dist/core/unit/capability/locomotion/motion.js";
import { advance } from "../../dist/core/unit/capability/locomotion/index.js";

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} ≈ ${expected}`);
const context = { mode: "WALK", speedMultiplier: 1 };
const definition = {
    id: "mover", hooks: Hooks.empty(), presence: {},
    locomotion: { speed: 0.2, minSpeed: 0, halfBodyWidth: 0,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
};

test("Steering limits the combined force before integrating and limiting speed", () => {
    const turning = integrate([0, 0.1], [4, 0], 0.2, [0, 0.05], {
        steeringFactor: 0.5, maxSteeringForce: 0.05,
    });
    near(turning[0], 0.05);
    near(turning[1], 0.1);

    const limited = integrate([0.2, 0], [1, 0], 0.2, [0, 0.3], {
        steeringFactor: 1, maxSteeringForce: 0.3,
    });
    near(limited[0], 0.2 * 2 / Math.sqrt(13));
    near(limited[1], 0.2 * 3 / Math.sqrt(13));
});

test("destination-cell reflection changes displacement without sweeping or a second pass", () => {
    const map = new Map(3, 5, Array.from({ length: 15 }, (_, index) => ({
        passable: index !== 6 && index !== 8, cost: 1,
        departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
    })));
    const reflected = reflect([2.4, 1], [2.7, 1.1], map);
    near(reflected[0], 2.1);
    near(reflected[1], 1.1);
    assert.deepEqual(reflect([2, 1], [4, 1], map), [4, 1]);
    assert.deepEqual(reflect([2, 1], [3, 1], map), [1, 1]);
});

test("movement passes intermediate tracking points and reaches the final goal with its history velocity", () => {
    let state = battle([{ definition, position: [2, 1] }]);
    const host = ref(get(state, 0));
    state = advance(state, host, { nextPoint: [2, 2], goal: [2, 2] }, context);
    state = advance({ ...state, tick: 1 }, host, { nextPoint: [2.05, 1.2], goal: [6, 1.2] }, context);
    near(get(state, 0).position[0], 2.2);
    near(get(state, 0).position[1], 1.2);
    assert.deepEqual(get(state, 0).locomotion.velocity, [0.2, 0]);

    const goal = [2.25, 1.2];
    state = advance({ ...state, tick: 2 }, host, { nextPoint: [1, 1.2], goal }, context);
    assert.deepEqual(get(state, 0).position, goal);
    assert.deepEqual(get(state, 0).locomotion.velocity, [0.2, 0]);
});

test("movement uses current terrain and reflects displacement while retaining controller velocity", () => {
    let state = battle([{ definition, position: [2, 1.4] }]);
    const host = ref(get(state, 0));
    const target = { nextPoint: [6, 1.4], goal: [6, 1.4] };
    state = advance(state, host, target, context);
    const before = get(state, 0).position;
    state = updateTile(state, [2, 2], {
        ...getTile(state.battlefield.map, [2, 2]).state, walkCost: 1000,
    });
    state = advance({ ...state, tick: 1 }, host, target, context);
    assert.ok(get(state, 0).position[0] > before[0]);
    assert.ok(get(state, 0).position[1] < before[1]);

    const approaching = get(state, 0).position;
    state = updateTile(state, [1, 3], {
        ...getTile(state.battlefield.map, [1, 3]).state, passability: "NONE",
    });
    state = advance({ ...state, tick: 2 }, host, target, context);
    assert.ok(get(state, 0).position[0] < approaching[0]);
    assert.ok(get(state, 0).locomotion.velocity[0] > 0);
});
