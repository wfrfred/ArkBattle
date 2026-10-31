import assert from "node:assert/strict";
import { test } from "node:test";
import * as blocking from "../../dist/core/battle/blocking/operations.js";
import { advanceMovement } from "../../dist/core/battle/steps/movement.js";
import { remove, update } from "../../dist/core/battle/unit.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import * as presence from "../../dist/core/unit/capability/presence/operations.js";
import * as route from "../../dist/core/unit/capability/route/operations.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/capability.js";
import { initialize, getUnit } from "../helpers/unit.js";
import { fixture, holder, target, hook, blockedIds } from "../helpers/blocking.js";

const routeDefinition = {
    pathMotionMode: "WALK", startPosition: [1, 2], endPosition: [1, 10], offset: [0, 0],
    checkpoints: [], requireAllCheckpoints: true, alwaysCheckCurrentPoint: true,
};
const locomotionDefinition = {
    speed: 0.1, minSpeed: 0, halfBodyWidth: 0,
    steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
};
const advance = battle => advanceMovement(battle, { routeMoveMultiplier: 1 });

test("acquire publishes the position plan with both relation endpoints before notification", () => {
    let battle = fixture([holder(), target()]);
    let observed;
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "acquired", hook("position", (state) => {
        const current = getUnit(state, 20);
        assert.equal(current.blockable.blocker.id, 10);
        assert.deepEqual(blockedIds(state), [20]);
        observed = current.blockable.adjustment;
        assert.deepEqual(current.position, [2.25, 1]);
        return state;
    }))]);
    const initial = battle;
    battle = blocking.search(battle, { id: 10 });
    assert.deepEqual(observed, { from: [2.25, 1], to: [2.5, 1], startTick: 0 });
    assert.equal(getUnit(initial, 20).blockable.adjustment, null);

    const halfway = advance({ ...battle, tick: 3 });
    assert.deepEqual(getUnit(halfway, 20).position, [2.375, 1]);
    assert.equal(getUnit(halfway, 20).route, undefined);
});

test("later acquisitions use the earlier target's endpoint while both bodies are still unshifted", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    battle = blocking.search(battle, { id: 10 });
    const first = getUnit(battle, 20);
    const second = getUnit(battle, 21);
    assert.deepEqual(first.position, second.position);
    assert.notDeepEqual(first.blockable.adjustment.to, second.blockable.adjustment.to);
    assert.ok(second.blockable.adjustment.to[1] < 1);
    assert.ok(Math.abs(Math.hypot(second.blockable.adjustment.to[0] - 2, second.blockable.adjustment.to[1] - 1) - 0.5) < 1e-12);
});

test("reacquisition replaces an orphaned position plan from the current position and tick", () => {
    let battle = blocking.search(fixture([holder(), target()]), { id: 10 });
    battle = blocking.release(battle, { id: 10 });
    battle = advance({ ...battle, tick: 3 });
    const previous = getUnit(battle, 20);
    battle = blocking.search(battle, { id: 10 });
    const current = getUnit(battle, 20);
    assert.deepEqual(current.blockable.adjustment.from, previous.position);
    assert.equal(current.blockable.adjustment.startTick, 3);
    assert.notEqual(current.blockable.adjustment, previous.blockable.adjustment);
    assert.deepEqual(current.position, previous.position);
});

test("released targets advance both an unfinished position plan and autonomous movement in the same tick", () => {
    const moving = target(20, { definition: { route: routeDefinition, locomotion: locomotionDefinition } });
    let battle = blocking.search(fixture([holder(), moving]), { id: 10 });
    battle = blocking.release(battle, { id: 10 });
    const halfway = advance({ ...battle, tick: 3 });
    assert.notEqual(getUnit(halfway, 20).blockable.adjustment, null);
    assert.ok(getUnit(halfway, 20).position[0] > 2.375);
    const completed = advance({ ...battle, tick: 6 });
    assert.equal(getUnit(completed, 20).blockable.adjustment, null);
    assert.ok(getUnit(completed, 20).position[0] > 2.5);
});

test("all initial position plans advance before the first autonomous movement Rule reads other targets", () => {
    const moving = target(20, { definition: { route: routeDefinition, locomotion: locomotionDefinition } });
    let battle = blocking.search(fixture([holder(10, { capacity: 2 }), moving, target(21)]), { id: 10 });
    const second = getUnit(battle, 21);
    const expected = second.position.map((value, i) => (value + second.blockable.adjustment.to[i]) / 2);
    let observed;
    battle = update(battle, [locomotion.setRule({ id: 20 }, {
        id: "observe-shift", allows(state) { observed = getUnit(state, 21).position; return false; },
    })]);
    battle = blocking.release(battle, { id: 10 });
    battle = advance({ ...battle, tick: 3 });
    assert.deepEqual(observed, expected);
});

test("spatial changes cancel plans with new position and relation cleanup visible in the first Released Hook", () => {
    let battle = blocking.search(fixture([holder(), target()]), { id: 10 });
    let observed = false;
    battle = update(battle, [capability.setBlockableHook({ id: 20 }, "released", hook("teleport", (state) => {
        const current = getUnit(state, 20);
        assert.deepEqual(current.position, [8, 1]);
        assert.equal(current.blockable.adjustment, null);
        assert.equal(current.blockable.blocker, null);
        assert.deepEqual(blockedIds(state), []);
        observed = true;
        return state;
    }))]);
    battle = presence.appear(battle, { id: 20 }, [8, 1]);
    assert.equal(observed, true);
    assert.deepEqual(getUnit(advance({ ...battle, tick: 100 }), 20).position, [8, 1]);
});

test("route position commands without SpatialPresence cancel the old plan and release before notification", () => {
    const moving = initialize({ id: 20, position: [2.25, 1], definition: {
        id: "route-position", hooks: [], allegiance: { side: "ENEMY" },
        layer: { type: "GROUND" }, blockable: { volume: 1 },
        route: { ...routeDefinition, checkpoints: [{ type: "APPEAR_AT_POS", position: [1, 8], offset: [0, 0] }] },
    } });
    let battle = blocking.search(fixture([holder(), moving]), { id: 10 });
    let observed;
    battle = update(battle, [capability.setBlockableHook({ id: 20 }, "released", hook("route-jump", (state) => {
        observed = getUnit(state, 20);
        return state;
    }))]);
    battle = route.advance(battle, { id: 20 });
    assert.deepEqual(observed.position, [8, 1]);
    assert.equal(observed.blockable.adjustment, null);
    assert.equal(observed.blockable.blocker, null);
    assert.deepEqual(getUnit(advance({ ...battle, tick: 100 }), 20).position, [8, 1]);
});

test("leaving targets cancel their own plan while a leaving blocker preserves its former targets' plans", () => {
    let battle = blocking.search(fixture([holder(), target()]), { id: 10 });
    const initial = battle;
    let observed;
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "released", hook("departure", (state) => {
        observed = getUnit(state, 20);
        return state;
    }))]);
    const removedTarget = remove(battle, 20, "SCRIPT");
    assert.equal(observed.lifecycle, "LEAVING");
    assert.equal(observed.blockable.adjustment, null);
    assert.equal(getUnit(removedTarget, 20), undefined);

    const removedOwner = remove(initial, 10, "SCRIPT");
    assert.equal(getUnit(removedOwner, 20).blockable.blocker, null);
    assert.notEqual(getUnit(removedOwner, 20).blockable.adjustment, null);
    assert.deepEqual(getUnit(advance({ ...removedOwner, tick: 3 }), 20).position, [2.375, 1]);
});
