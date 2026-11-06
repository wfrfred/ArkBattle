import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/unit/capability/route/capability.js";
import * as route from "../../dist/core/unit/capability/route/index.js";
import { add as addUnit, replace as updateUnit, update } from "../../dist/core/battle/unit.js";
import { compose } from "../../dist/core/unit/change.js";
import { getUnit } from "../helpers/unit.js";
import { setOverlay } from "../../dist/core/battlefield/navigation/state.js";
import { baseUnit, fixtureBattle } from "../helpers/unit.js";

function definition(overrides = {}) {
    return {
        pathMotionMode: "WALK",
        startPosition: [0, 0],
        endPosition: [0, 8],
        offset: [0, 0],
        checkpoints: [],
        requireAllCheckpoints: true,
        alwaysCheckCurrentPoint: true,
        ...overrides,
    };
}

function fixture(config = definition(), tick = 0, position = [0, 0]) {
    const battle = fixtureBattle(tick, { rngState: 17 });
    const initialized = initialize(battle, baseUnit(
        { hooks: Hooks.empty(), id: "route-test", route: config, spatialPresence: {} },
        { id: 3, position, spatialPresence: { present: true } },
    ));
    return { battle: addUnit(initialized.state, initialized.value), ref: { id: initialized.value.id } };
}

function current(battle, ref) {
    return getUnit(battle, ref.id);
}

function move(battle, ref, position) {
    return updateUnit(battle, [{ ...current(battle, ref), position }]);
}


test("relative waits use entry time and repeated advance does not consume waiting twice", () => {
    const { battle, ref } = fixture(definition({
        checkpoints: [{ type: "WAIT", tick: 3 }, { type: "MOVE", position: [0, 4], offset: [0, 0] }],
    }), 10);
    const entered = route.advance(battle, ref);
    assert.deepEqual(current(entered, ref).route.main.phase.checkpointState, { type: "WAITING", deadlineTick: 13 });
    assert.equal(route.advance(entered, ref), entered);
    assert.equal(route.movementTarget(entered, ref), null);
    const waiting = { ...entered, tick: 12 };
    assert.equal(route.advance(waiting, ref), waiting);
    const resumed = route.advance({ ...entered, tick: 13 }, ref);
    assert.deepEqual(current(resumed, ref).route.main.phase, {
        type: "CHECKPOINT", index: 1, checkpointState: { type: "MOVING" },
    });
    assert.deepEqual(route.movementTarget(resumed, ref), { nextPoint: [4, 0], goal: [4, 0] });
});

test("past absolute waits and zero relative waits advance immediately", () => {
    const { battle, ref } = fixture(definition({ checkpoints: [
        { type: "WAIT_UNTIL", tick: 2 }, { type: "WAIT", tick: 0 },
    ] }), 20);
    const advanced = route.advance(battle, ref);
    assert.deepEqual(current(advanced, ref).route.main.phase, { type: "END" });
    assert.deepEqual(route.movementTarget(advanced, ref), { nextPoint: [8, 0], goal: [8, 0] });
});

test("GOTO re-entry restarts relative waits while keeping absolute wait deadlines", () => {
    const { battle, ref } = fixture(definition({ checkpoints: [
        { type: "WAIT_UNTIL", tick: 5 }, { type: "WAIT", tick: 2 }, { type: "GOTO", index: 0 },
    ] }), 10);
    const first = route.advance(battle, ref);
    assert.deepEqual(current(first, ref).route.main.phase, {
        type: "CHECKPOINT", index: 1, checkpointState: { type: "WAITING", deadlineTick: 12 },
    });
    const second = route.advance({ ...first, tick: 12 }, ref);
    assert.deepEqual(current(second, ref).route.main.phase, {
        type: "CHECKPOINT", index: 1, checkpointState: { type: "WAITING", deadlineTick: 14 },
    });
});

test("Alternative replacement always starts over and clear preserves Main deadlines", () => {
    const { battle, ref } = fixture(definition({ checkpoints: [{ type: "WAIT", tick: 5 }] }), 10);
    const entered = route.advance(battle, ref);
    const main = current(entered, ref).route.main;
    const alternate = definition({ checkpoints: [{ type: "WAIT", tick: 2 }] });
    const installed = update(entered, ref, route.setAlternative(alternate));
    const advanced = route.advance(installed, ref);
    const previousAlternative = current(advanced, ref).route.alternative;
    const repeated = update(advanced, ref, route.setAlternative(alternate));
    assert.notEqual(current(repeated, ref).route.alternative, previousAlternative);
    assert.equal(current(repeated, ref).route.main, main);
    assert.equal(current(repeated, ref).route.alternative.phase.checkpointState.type, "PENDING");
    const cleared = update({ ...repeated, tick: 16 }, ref, route.clearAlternative());
    assert.equal(current(cleared, ref).route.main, main);
    assert.equal(current(cleared, ref).route.alternative, null);
    assert.equal(update(cleared, ref, route.clearAlternative()), cleared);
    const resumed = route.advance(cleared, ref);
    assert.equal(current(resumed, ref).route.main.phase.type, "END");
});

test("path mode changes preserve route progress and each route retains its current mode", () => {
    const { battle, ref } = fixture(definition({ checkpoints: [{ type: "WAIT", tick: 5 }] }), 10);
    const entered = route.advance(battle, ref);
    const phase = current(entered, ref).route.main.phase;
    const changed = update(entered, ref, route.setPathMotionMode("FLY"));
    const main = current(changed, ref).route.main;
    assert.equal(route.pathMotionMode(current(changed, ref).route), "FLY");
    assert.equal(main.definition.pathMotionMode, "WALK");
    assert.equal(main.phase, phase);
    assert.equal(update(changed, ref, route.setPathMotionMode("FLY")), changed);

    const alternate = definition({ checkpoints: [{ type: "WAIT", tick: 2 }] });
    const installed = route.advance(update(changed, ref, compose(
        route.setAlternative(alternate), route.setPathMotionMode("FLY"),
    )), ref);
    assert.equal(current(installed, ref).route.main, main);
    assert.equal(route.pathMotionMode(current(installed, ref).route), "FLY");

    const restarted = update(installed, ref, route.setAlternative(alternate));
    assert.equal(route.pathMotionMode(current(restarted, ref).route), "WALK");
    const restored = update(restarted, ref, compose(
        route.clearAlternative(), route.setPathMotionMode("WALK"),
    ));
    assert.equal(current(restored, ref).route.alternative, null);
    assert.equal(current(restored, ref).route.main.phase, phase);
    assert.equal(route.pathMotionMode(current(restored, ref).route), "WALK");
});

test("completed Alternative remains active until its owner clears it", () => {
    const { battle, ref } = fixture();
    const main = current(battle, ref).route.main;
    const installed = update(battle, ref, route.setAlternative(definition({ endPosition: [0, 0] })));
    const completed = route.advance(installed, ref);
    assert.equal(current(completed, ref).route.alternative.phase.type, "COMPLETED");
    assert.equal(current(completed, ref).route.main, main);
    assert.equal(route.movementTarget(completed, ref), null);
    assert.equal(route.isCompleted(current(completed, ref).route), false);
    assert.equal(route.advance(completed, ref), completed);
    assert.deepEqual(route.movementTarget(update(completed, ref, route.clearAlternative()), ref), { nextPoint: [8, 0], goal: [8, 0] });
});

test("Main early completion is controlled by requireAllCheckpoints even while Alternative is active", () => {
    for (const requireAllCheckpoints of [true, false]) {
        const { battle, ref } = fixture(definition({
            requireAllCheckpoints,
            checkpoints: [{ type: "WAIT", tick: 100 }],
        }), 0, [8, 0]);
        const installed = update(battle, ref, route.setAlternative(definition({ endPosition: [0, 12] })));
        const advanced = route.advance(installed, ref);
        assert.equal(route.isCompleted(current(advanced, ref).route), !requireAllCheckpoints);

        assert.notEqual(current(advanced, ref), undefined);
    }
});

test("route tracking applies the same sampled offset to MOVE and end targets", () => {
    const { battle, ref } = fixture(definition({
        offset: [0.2, 0.1],
        checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0.15, 0] }],
    }), 0, [0.2, 0.1]);
    assert.equal(route.movementTarget(battle, ref), null);
    const advanced = route.advance(battle, ref);
    assert.deepEqual(route.movementTarget(advanced, ref), {
        nextPoint: [4.3500000000000005, 0.1], goal: [4.3500000000000005, 0.1],
    });
    const reached = route.advance(move(advanced, ref, [4.35, 0.1]), ref);
    assert.equal(current(reached, ref).route.main.phase.type, "END");
    assert.deepEqual(route.movementTarget(reached, ref), { nextPoint: [8.2, 0.1], goal: [8.2, 0.1] });
});

test("Alternative movement targets use their own goal and offset until cleared", () => {
    const { battle, ref } = fixture(definition({ offset: [0.2, 0] }), 0, [0.2, 0]);
    const installed = update(battle, ref, route.setAlternative(definition({
        offset: [-0.1, 0.2],
        checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0.25, 0] }],
    })));
    const advanced = route.advance(installed, ref);
    assert.deepEqual(route.movementTarget(advanced, ref), {
        nextPoint: [4.15, 0.2], goal: [4.15, 0.2],
    });
    assert.deepEqual(route.movementTarget(update(advanced, ref, route.clearAlternative()), ref), {
        nextPoint: [8.2, 0], goal: [8.2, 0],
    });
});

test("unreachable MOVE skips only when the route permits it", () => {
    for (const alwaysCheckCurrentPoint of [true, false]) {
        const { battle, ref } = fixture(definition({
            alwaysCheckCurrentPoint,
            checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0, 0] }],
        }));
        const navigation = setOverlay(battle.battlefield.navigation, "WALK", {
            id: 1, cells: [[0, 4]], denyPassage: true, denyDepartures: [],
        });
        const advanced = route.advance({ ...battle, battlefield: { ...battle.battlefield, navigation } }, ref);
        assert.equal(current(advanced, ref).route.main.phase.type, alwaysCheckCurrentPoint ? "CHECKPOINT" : "END");
    }
});

test("navigation and unreachable checks use the current path mode", () => {
    const { battle, ref } = fixture(definition({
        alwaysCheckCurrentPoint: false,
        checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0, 0] }],
    }));
    const navigation = setOverlay(battle.battlefield.navigation, "WALK", {
        id: 1, cells: [[0, 4]], denyPassage: true, denyDepartures: [],
    });
    const blocked = { ...battle, battlefield: { ...battle.battlefield, navigation } };
    const flying = route.advance(update(blocked, ref, route.setPathMotionMode("FLY")), ref);
    assert.equal(current(flying, ref).route.main.phase.type, "CHECKPOINT");
    assert.deepEqual(route.movementTarget(flying, ref), { nextPoint: [4, 0], goal: [4, 0] });
    const walking = update(flying, ref, route.setPathMotionMode("WALK"));
    assert.equal(route.movementTarget(walking, ref), null);
    assert.equal(current(route.advance(walking, ref), ref).route.main.phase.type, "END");
});

test("outside-map recovery keeps the current MOVE rather than treating it as unreachable", () => {
    const { battle, ref } = fixture(definition({
        alwaysCheckCurrentPoint: false,
        offset: [0.2, 0],
        checkpoints: [{ type: "MOVE", position: [0, 4], offset: [0, 0] }],
    }), 0, [-1, 0]);
    const advanced = route.advance(battle, ref);
    assert.equal(current(advanced, ref).route.main.phase.type, "CHECKPOINT");
    const target = route.movementTarget(advanced, ref);
    assert.ok(target.nextPoint[0] > -0.3 && target.nextPoint[0] < 0);
    assert.equal(target.nextPoint[1], 0);
    assert.deepEqual(target.goal, target.nextPoint);
});

test("instant instructions apply presence and teleport effects once before continuing", () => {
    const { battle, ref } = fixture(definition({ offset: [0.2, 0.1], checkpoints: [
        { type: "DISAPPEAR" }, { type: "APPEAR_AT_POS", position: [0, 3], offset: [0.2, 0] },
        { type: "ALERT" }, { type: "WAIT", tick: 5 },
    ] }), 0, [0.2, 0.1]);
    const advanced = route.advance(battle, ref);
    assert.equal(current(advanced, ref).spatialPresence.present, true);
    assert.deepEqual(current(advanced, ref).position, [3.2, 0]);

    assert.equal(route.advance(advanced, ref), advanced);
});
