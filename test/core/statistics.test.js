// Contract: [statistics](../../docs/architecture/statistics.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import { isCompleted, registerWait } from "../../dist/core/battle/schedule/index.js";
import { register, markKilled } from "../../dist/core/battle/statistics.js";
import { battle } from "../helpers/battle.js";

const plan = {
    startPosition: [1, 1], destination: null,
    checkpoints: [{ type: "WAIT", anchor: "ENTER", tick: 1000, timer: null }],
};

function spawn(id, atTick, wait, statistics, hooks = Hooks.empty()) {
    return {
        definition: {
            id, hooks,
            route: { alwaysCheckCurrentPoint: true },
            locomotion: { speed: { default: 0, min: 0, max: null }, halfBodyWidth: 0, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
        },
        plan, mode: "WALK", offset: [0, 0], randomRange: [0, 0], atTick, wait, statistics,
    };
}

function unit(id, onEntered) {
    return {
        definition: {
            id,
            hooks: Hooks.empty().set(units.entered, {
                id: "fixture/entered", priority: 0,
                invoke: (state, self) => ({ state: onEntered(state, self), value: undefined }),
            }),
        },
        hooks: Hooks.empty(), initial: {}, position: [0, 0],
    };
}

function counts(state) {
    const { total, finished, killed } = state.statistics;
    return { total, finished, killed };
}

function find(state, id) {
    return units.all(state).find(self => self.definition.id === id);
}

test("counting qualification is published before entry and settles independently of schedule waiting", () => {
    const initial = unit("initial", (state, self) => units.remove(state, units.ref(self), { reason: "SCRIPT" }));
    const death = unit("death", (state, self) => units.remove(state, units.ref(self), { reason: "DEATH", killer: null }));
    let state = battle([{ ...initial, statistics: "ALWAYS_KILLED" }], {
        statistics: { total: 4 },
        schedule: {
            waves: [{ preDelayTicks: 0, postDelayTicks: 0, maxWaitingTicks: null,
                fragments: [{ preDelayTicks: 0, entries: [
                    spawn("death", 0, "NONE", "NORMAL", death.definition.hooks),
                    spawn("exit", 1, "FINAL", "NORMAL"),
                    spawn("uncounted", 1, "WAVE", null),
                ] }],
            }],
            branches: {},
        },
    });
    assert.deepEqual(counts(state), { total: 4, finished: 1, killed: 1 });
    assert.equal(find(state, "initial"), undefined);

    state = step(state, []);
    assert.equal(find(state, "exit"), undefined);
    assert.equal(find(state, "death"), undefined);
    assert.deepEqual(counts(state), { total: 4, finished: 2, killed: 2 });

    state = step(state, []);
    state = units.remove(state, units.ref(find(state, "exit")), { reason: "EXIT" });
    const dynamic = units.initialize(state, unit("dynamic", (state, self) => markKilled(state, units.ref(self))));
    const reference = units.ref(dynamic.value);
    state = registerWait(dynamic.state, reference, "WAVE");
    state = units.add(register(state, reference, "NORMAL"), dynamic.value);
    assert.deepEqual(counts(state), { total: 4, finished: 4, killed: 3 });
    assert.equal(reference.get(state).lifecycle, "ACTIVE");
    assert.ok(state.schedule.waiting.wave.includes(reference));
    assert.ok(state.schedule.waiting.final.includes(reference));

    state = units.remove(state, units.ref(find(state, "dynamic")), { reason: "DEATH", killer: null });
    state = units.remove(state, units.ref(find(state, "uncounted")), { reason: "DEATH", killer: null });
    state = step(state, []);
    assert.deepEqual(counts(state), { total: 4, finished: 4, killed: 3 });
    assert.equal(isCompleted(state.schedule), true);
});
