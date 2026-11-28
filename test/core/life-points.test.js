// Contract: [Life Points](../../docs/architecture/life-points.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as lifePoints from "../../dist/core/battle/life-points.js";
import * as statistics from "../../dist/core/battle/statistics.js";
import * as units from "../../dist/core/unit/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import { battle } from "../helpers/battle.js";

test("exit losses are registered before entry and independent of ordinary statistics and other departures", () => {
    const initial = {
        definition: {
            id: "initial",
            hooks: Hooks.empty().set(units.entered, {
                id: "exit/entered",
                priority: 0,
                invoke: (state, self) => ({
                    state: units.remove(state, units.ref(self), { reason: "EXIT" }),
                    value: undefined,
                }),
            }),
        },
        hooks: Hooks.empty(), initial: {}, position: [0, 0], lifePointLoss: 2,
    };
    const spawn = (id, loss, policy, destination = null) => ({
        definition: {
            id, hooks: Hooks.empty(), route: { alwaysCheckCurrentPoint: true },
            locomotion: { speed: { default: 0, min: 0, max: null }, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
        },
        plan: { startPosition: [1, 1], destination, checkpoints: [] },
        mode: "WALK", offset: [0, 0], randomRange: [0, 0], atTick: 0, wait: "NONE",
        statistics: policy, lifePointLoss: loss,
    });
    let state = battle([initial], {
        lifePoints: { balance: 10, temporary: 2 },
        schedule: {
            waves: [{ preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null,
                fragments: [{ preDelayTicks: 0, entries: [
                    spawn("natural", 3, null, { type: "EXIT", position: [1, 1], requireFinish: true }),
                    spawn("forced", 2, "NORMAL"),
                    spawn("death", 4, "NORMAL"),
                    spawn("harmless", 3, "ALWAYS_KILLED"),
                ] }],
            }],
            branches: {},
        },
    });
    assert.equal(state.lifePoints.balance, 10);
    assert.equal(state.lifePoints.temporary, 0);

    state = step(state, []);
    assert.equal(state.lifePoints.balance, 7);
    const find = id => units.ref(units.all(state).find(self => self.definition.id === id));
    const forced = find("forced");
    state = statistics.markKilled(state, forced);
    state = lifePoints.register(state, forced, 3);
    state = units.remove(state, forced, { reason: "EXIT" });
    assert.equal(state.lifePoints.balance, 4);

    state = units.remove(state, find("death"), { reason: "DEATH", killer: null });
    const harmless = find("harmless");
    state = lifePoints.register(state, harmless, 0);
    state = units.remove(state, harmless, { reason: "EXIT" });
    assert.equal(state.lifePoints.balance, 4);
    assert.equal(state.lifePoints.pending.size, 0);
});

test("both accounts share modification hooks and actual losses may trigger a second settlement", () => {
    let state = battle([], { lifePoints: { balance: 3, temporary: 0 } });
    const changes = [];
    state = lifePoints.setHook(state, lifePoints.beforeModify, {
        id: "mode/loss-and-temporary", priority: 0,
        invoke: (state, target, delta) => ({
            state,
            value: delta < 0 ? delta * 1.5 : target === "TEMPORARY" ? delta + 1 : delta,
        }),
    });
    state = lifePoints.setHook(state, lifePoints.modified, {
        id: "observe", priority: 1,
        invoke: (state, change) => {
            changes.push({ ...change, balance: state.lifePoints.balance, temporary: state.lifePoints.temporary });
            return { state, value: undefined };
        },
    });
    state = lifePoints.setHook(state, lifePoints.modified, {
        id: "first-loss", priority: 0,
        invoke: (state, { balanceDelta }) => ({
            state: balanceDelta >= 0 ? state : lifePoints.modify(
                lifePoints.removeHook(state, lifePoints.modified, "first-loss"), -2,
            ),
            value: undefined,
        }),
    });

    state = lifePoints.addTemporary(state, 2);
    state = lifePoints.modify(state, -1);
    state = lifePoints.modify(state, -1);
    state = lifePoints.modify(state, -1);
    state = lifePoints.modify(state, 5);
    assert.deepEqual(changes, [
        { balanceDelta: 0, temporaryDelta: 3, balance: 3, temporary: 3 },
        { balanceDelta: 0, temporaryDelta: -2, balance: 3, temporary: 1 },
        { balanceDelta: -1, temporaryDelta: -1, balance: 2, temporary: 0 },
        { balanceDelta: -2, temporaryDelta: 0, balance: 0, temporary: 0 },
        { balanceDelta: 5, temporaryDelta: 0, balance: 5, temporary: 0 },
    ]);
});
