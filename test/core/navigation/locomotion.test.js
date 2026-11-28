// Contract: [navigation](../../../docs/architecture/navigation.md#locomotion).
import { attribute as defineAttribute } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import { ref } from "../../../dist/core/unit/query.js";
import { Map } from "../../../dist/core/battlefield/navigation/map.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../../dist/core/battle/tile.js";
import { integrate } from "../../../dist/core/unit/capability/locomotion/steering.js";
import { reflect } from "../../../dist/core/unit/capability/locomotion/motion.js";
import { update } from "../../../dist/core/unit/operations.js";
import { advance, setTarget, isMoving } from "../../../dist/core/unit/capability/locomotion/index.js";
import { unbalance } from "../../../dist/core/unit/capability/shifting/index.js";
import { step } from "../../../dist/core/battle/runtime.js";

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} ≈ ${expected}`);
const definition = {
    id: "mover", hooks: Hooks.empty(), presence: {},
    locomotion: { speed: defineAttribute(0.2), halfBodyWidth: 0,
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
    let state = battle([{ definition, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } }, position: [2, 1] }]);
    const host = ref(get(state, 0));
    assert.equal(isMoving(state, get(state, 0)), false);
    state = update(state, host, setTarget({ nextPoint: [2, 2], goal: [2, 2] }));
    assert.equal(isMoving(state, get(state, 0)), true);
    state = step(state, []);
    state = update(state, host, setTarget({ nextPoint: [2.05, 1.2], goal: [6, 1.2] }));
    assert.equal(isMoving(state, get(state, 0)), true);
    state = advance(state, host);
    near(get(state, 0).position[0], 2.2);
    near(get(state, 0).position[1], 1.2);
    assert.deepEqual(get(state, 0).locomotion.velocity, [0.2, 0]);

    const goal = [2.25, 1.2];
    state = update(state, host, setTarget({ nextPoint: [1, 1.2], goal }));
    state = advance(state, host);
    assert.deepEqual(get(state, 0).position, goal);
    assert.equal(isMoving(state, get(state, 0)), false);
    assert.deepEqual(get(state, 0).locomotion.velocity, [0.2, 0]);
});

test("runtime advances a routeless unit under force", () => {
    let state = battle([{
        position: [2, 1],
        definition: {
            ...definition,
            layer: { type: "GROUND" },
            shiftable: {
                massLevel: defineAttribute(0),
                restrictions: [],
                body: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 }, mass: 1, frictionFactor: 0 },
            },
        }, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } },
    }]);
    const host = ref(get(state, 0));
    state = unbalance.applyImpulse(state, host, [0.25, 0]).state;
    for (let i = 0; i < 2; i++) {
        const before = get(state, 0).position;
        state = step(state, []);
        assert.ok(get(state, 0).position[0] > before[0]);
    }
});

test("movement uses current terrain and reflects displacement while retaining controller velocity", () => {
    let state = battle([{ definition, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } }, position: [2, 1.4] }]);
    const host = ref(get(state, 0));
    const target = { nextPoint: [6, 1.4], goal: [6, 1.4] };
    state = update(state, host, setTarget(target));
    state = advance(state, host);
    const before = get(state, 0).position;
    state = updateTile(state, [2, 2], {
        ...getTile(state.battlefield.map, [2, 2]).state, walkCost: 1000,
    });
    state = advance(state, host);
    assert.ok(get(state, 0).position[0] > before[0]);
    assert.ok(get(state, 0).position[1] < before[1]);

    const approaching = get(state, 0).position;
    state = updateTile(state, [3, 1], {
        ...getTile(state.battlefield.map, [3, 1]).state, passability: "NONE",
    });
    state = advance(state, host);
    assert.ok(get(state, 0).position[0] < approaching[0]);
    assert.ok(get(state, 0).locomotion.velocity[0] > 0);
});
