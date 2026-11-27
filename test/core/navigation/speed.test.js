// Contract: [navigation](../../../docs/architecture/navigation.md#locomotion).
import { compose } from "../../../dist/core/unit/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import { ref } from "../../../dist/core/unit/query.js";
import { update } from "../../../dist/core/unit/operations.js";
import { create } from "../../../dist/core/common/modifier.js";
import { advance, isMoving, setTarget, setSpeedContribution, removeSpeedContribution, setSpeedRange, clearSpeedRange, setRestriction, removeRestriction } from "../../../dist/core/unit/capability/locomotion/index.js";

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-12);

test("current movement speed, its minimum and movement permission remain separate", () => {
    let state = battle([{ definition: {
        id: "mover", hooks: Hooks.empty(), presence: {},
        locomotion: { speed: { default: 0.4, min: 0.05, max: null }, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    }, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } }, position: [0, 0] }], { moveMultiplier: 0.5 });
    const host = ref(get(state, 0));
    state = update(state, host, setTarget({ nextPoint: [5, 0], goal: [5, 0] }));
    const move = (current) => advance({ ...current, tick: current.tick + 1 }, host);
    state = move(state);
    close(get(state, 0).position[0], 0.2);
    state = update(state, host, setSpeedContribution({
        id: "slow", group: null, value: [create({ multiplier: -0.5 })],
    }));
    state = move(state);
    close(get(state, 0).position[0], 0.3);
    state = update(state, host, setSpeedContribution({
        id: "slow", group: null, value: [create({ multiplier: -2 })],
    }));
    state = update(state, host, setSpeedRange({ min: 0.1, max: null }));
    state = move(state);
    close(get(state, 0).position[0], 0.35);
    state = update(state, host, setSpeedRange({ min: 0.01, max: null }));
    state = move(state);
    close(get(state, 0).position[0], 0.355);
    state = update(state, host, clearSpeedRange());
    state = move(state);
    close(get(state, 0).position[0], 0.38);
    const velocity = get(state, 0).locomotion.velocity;
    state = update(state, host, setSpeedRange({ min: 0, max: 0 }));
    assert.equal(isMoving(state, get(state, 0)), false);
    state = move(state);
    close(get(state, 0).position[0], 0.38);
    state = update(state, host, clearSpeedRange());
    state = update(state, host, setRestriction({ id: "stop", group: null, value: { allows: () => false } }));
    assert.equal(isMoving(state, get(state, 0)), false);
    state = move(state);
    close(get(state, 0).position[0], 0.38);
    assert.deepEqual(get(state, 0).locomotion.velocity, velocity);
    state = update(state, host, compose(removeRestriction("stop"), removeSpeedContribution("slow")));
    state = move(state);
    close(get(state, 0).position[0], 0.58);
});
