import { combine } from "../../dist/core/unit/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import { ref } from "../../dist/core/unit/query.js";
import { update } from "../../dist/core/battle/unit.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";
import { advance, setSpeedContribution, removeSpeedContribution, setRule, removeRule } from "../../dist/core/unit/capability/locomotion/index.js";

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12);

test("current movement speed, its minimum and movement permission remain separate", () => {
    let state = battle([{ definition: {
        id: "mover", hooks: Hooks.empty(), spatialPresence: {},
        locomotion: { speed: 0.2, minSpeed: 0.05, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    }, position: [0, 0] }]);
    const host = ref(get(state, 0));
    const move = (current, speedMultiplier = 1) => advance({ ...current, tick: current.tick + 1 }, host,
        { nextPoint: [5, 0], goal: [5, 0] }, { mode: "WALK", speedMultiplier });
    state = move(state);
    close(get(state, 0).position[0], 0.2);
    state = update(state, setSpeedContribution(host, {
        id: "slow", value: [create({ multiplier: -0.5 })],
    }));
    state = move(state);
    close(get(state, 0).position[0], 0.3);
    state = update(state, setSpeedContribution(host, {
        id: "slow", value: [create({ multiplier: -2 })],
    }));
    state = move(state);
    close(get(state, 0).position[0], 0.35);
    state = move(state, 0.5);
    close(get(state, 0).position[0], 0.375);
    const velocity = get(state, 0).locomotion.velocity;
    state = move(state, 0);
    close(get(state, 0).position[0], 0.375);
    assert.deepEqual(get(state, 0).locomotion.velocity, velocity);
    state = update(state, setRule(host, { id: "stop", allows: () => false }));
    state = move(state);
    close(get(state, 0).position[0], 0.375);
    assert.deepEqual(get(state, 0).locomotion.velocity, velocity);
    state = update(state, combine([removeRule(host, "stop"), removeSpeedContribution(host, "slow")]));
    state = move(state);
    close(get(state, 0).position[0], 0.575);
});
