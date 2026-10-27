import { executionRef } from "../../dist/core/unit/action/index.js";
import { setRule } from "../../dist/core/unit/capability/action/capability.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit } from "../helpers/action-fixture.js";
import { actionCapability } from "../helpers/actions.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { update as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { advance } from "../../dist/core/unit/action/index.js";

const program = (id, extra = {}) => ({
    id,
    intervalTicks: 10,
    speed: 100,
    initialize: (state) => ({ state, value: {} }),
    prepare: (state) => ({ state, value: { count: 0 } }),
    onTick: (state) => ({ state, value: false }),
    ...extra,
});

test("action start registers execution without invoking its first onTick", () => {
    const steps = [];
    const definition = program("registered", {
        onTick(state, source, self) {
            steps.push([state.tick, self.execution.state.count]);
            return { state, value: true };
        },
    });
    const initial = battle(unit(0, { action: definition }));
    const source = unitRef(getUnit(initial, 0));
    const started = actions.start(initial, actions.ref(source, definition));
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(steps, []);
    assert.equal(actions.getExecution(started.state, started.value.ref).execution.state.count, 0);
    assert.equal(actions.getAction(started.state, actions.ref(source, definition)).cooldown.readyAtTick, 10);
    assert.equal(getUnit(started.state, 0).action.nextExecutionId, 1);
    assert.equal(started.state.events.some(event => event.type === "ACTION_FINISHED"), false);
    const finished = advance(started.state, started.value.ref);
    assert.deepEqual(steps, [[0, 0]]);
    assert.equal(actions.getExecution(finished, started.value.ref), undefined);
    assert.equal(actions.getAction(initial, actions.ref(source, definition)).execution, null);
});

test("action storage: heterogeneous definitions retain their private state and callback pairing", () => {
    const first = program("number", { prepare: (state) => ({ state, value: { count: 3 } }) });
    const second = program("text", { prepare: (state) => ({ state, value: { message: "ready" } }) });
    const initial = battle(
        unit(0, { action: actionCapability(first, second) }),
    );
    const source = unitRef(getUnit(initial, 0));
    const a = actions.start(initial, actions.ref(source, first)),
        b = actions.start(a.state, actions.ref(source, second));
    assert.equal(actions.getExecution(b.state, a.value.ref).definition, first);
    assert.deepEqual(actions.getExecution(b.state, a.value.ref).execution.state, { count: 3 });
    assert.equal(actions.getExecution(b.state, b.value.ref).definition, second);
    assert.deepEqual(actions.getExecution(b.state, b.value.ref).execution.state, { message: "ready" });
    assert.equal(actions.forUnit(b.state, source).length, 2);
    assert.equal(actions.all(initial).length, 0);
});

test("action storage: same-definition reentry is rejected while another definition may start", () => {
    const first = program("first"),
        second = program("second");
    const initial = battle(
        unit(0, { action: actionCapability(first, second) }),
    );
    const source = unitRef(getUnit(initial, 0));
    const a = actions.start(initial, actions.ref(source, first));
    const retry = actions.start({ ...a.state, tick: 20 }, actions.ref(source, first));
    assert.deepEqual(retry.value, { type: "REJECTED", reason: "CASTING" });
    assert.equal(actions.start(retry.state, actions.ref(source, second)).value.type, "STARTED");
});

test("action storage: replacements preserve earlier instances and never recreate an ended identity", () => {
    const definition = program("branch");
    const initial = battle(unit(0, { action: definition })),
        source = unitRef(getUnit(initial, 0));
    const started = actions.start(initial, actions.ref(source, definition)),
        self = actions.getExecution(started.state, started.value.ref);
    const changed = actions.setExecutionState(started.state, executionRef(started.value.ref.host, self), { count: 1 });
    assert.equal(actions.getExecution(changed, started.value.ref).execution.state.count, 1);
    assert.equal(actions.getExecution(started.state, started.value.ref).execution.state.count, 0);
    const cancelled = actions.cancel(changed, started.value.ref, "SCRIPT");
    assert.throws(() => actions.setExecutionState(cancelled, executionRef(started.value.ref.host, self), { count: 9 }), /unknown action execution: 0/);
    const restarted = actions.start({ ...cancelled, tick: 10 }, actions.ref(source, definition));
    assert.equal(restarted.value.type, "STARTED");
    assert.notEqual(restarted.value.ref.id, started.value.ref.id);
    assert.equal(actions.getExecution(restarted.state, started.value.ref), undefined);
});

test("action storage: private state updates cannot change the fixed definition association", () => {
    const definition = program("fixed"),
        other = program("fixed");
    const initial = battle(unit(0, { action: definition }));
    const started = actions.start(initial, actions.ref(unitRef(getUnit(initial, 0)), definition));
    const self = actions.getExecution(started.state, started.value.ref);
    const currentState = actions.getExecution(started.state, executionRef(started.value.ref.host, self)).execution.state;
    const changed = actions.setExecutionState(started.state, executionRef(started.value.ref.host, self), { ...currentState, definition: other });
    assert.equal(actions.getExecution(changed, started.value.ref).definition, definition);
    assert.equal(actions.getExecution(changed, started.value.ref).execution.state.definition, other);
    assert.equal(actions.getExecution(started.state, started.value.ref), self);
});

test("action storage: a throwing later instance cannot mutate earlier published progress", () => {
    const advanceCount = (state, source, self) => {
        const currentState2 = actions.getExecution(state, executionRef(source, self)).execution.state;
        return ({
        state: actions.setExecutionState(state, executionRef(source, self), { count: currentState2.count + 1 }),
        value: false,
    });
    };
    const first = program("first", { onTick: advanceCount });
    const second = program("second", {
        onTick(state, source, self) {
            if (state.tick > 0) throw new Error("later failure");
            return advanceCount(state, source, self);
        },
    });
    const initial = battle(
        unit(0, { action: actionCapability(first, second) }),
    );
    const source = unitRef(getUnit(initial, 0)),
        a = actions.start(initial, actions.ref(source, first)),
        b = actions.start(a.state, actions.ref(source, second));
    const before = advance(advance(b.state, a.value.ref), b.value.ref);
    assert.throws(() => {
        const next = advance({ ...before, tick: 1 }, a.value.ref);
        advance(next, b.value.ref);
    }, /later failure/);
    assert.equal(actions.getExecution(before, a.value.ref).execution.state.count, 1);
    assert.equal(actions.getExecution(before, b.value.ref).execution.state.count, 1);
});

test("action: startup rules prohibit new instances while an accepted program keeps its own continuation", () => {
    const first = program("running", {
        onTick(state, source, self) {
            const currentState2 = actions.getExecution(state, executionRef(source, self)).execution.state;
            return {
                state: actions.setExecutionState(state, executionRef(source, self), { count: currentState2.count + 1 }),
                value: state.tick >= 1,
            };
        },
    });
    const second = program("blocked");
    const initial = battle(
        unit(0, { action: actionCapability(first, second) }),
    );
    const source = unitRef(getUnit(initial, 0)),
        started = actions.start(initial, actions.ref(source, first));
    const current = getUnit(started.state, 0);
    const prohibited = updateUnit(
        { ...started.state, tick: 1 },
        [{
            ...current,
            action: setRule(current.action, { id: "prohibit-start", allows: () => false }),
        }],
    );
    assert.deepEqual(actions.start(prohibited, actions.ref(source, second)).value, {
        type: "REJECTED",
        reason: "RULE",
    });
    const finished = advance(prohibited, started.value.ref);
    assert.equal(actions.getExecution(finished, started.value.ref), undefined);
    assert.equal(
        finished.events.some((event) => event.type === "ACTION_FINISHED"),
        true,
    );
    assert.equal(
        finished.events.some((event) => event.type === "ACTION_CANCELLED"),
        false,
    );
});

test("action: cancellation preserves the accepted cooldown instead of resetting or clearing it", () => {
    const definition = program("cooldown"),
        initial = battle(unit(0, { action: definition }));
    const source = unitRef(getUnit(initial, 0)),
        started = actions.start(initial, actions.ref(source, definition));
    const cancelled = actions.cancel({ ...started.state, tick: 1 }, started.value.ref, "SCRIPT");
    assert.equal(getUnit(cancelled, 0).action.actions.get(definition.id).cooldown.readyAtTick, 10);
    assert.deepEqual(actions.start(cancelled, actions.ref(source, definition)).value, {
        type: "REJECTED",
        reason: "COOLDOWN",
    });
    assert.equal(
        actions.start({ ...cancelled, tick: 10 }, actions.ref(source, definition)).value.type,
        "STARTED",
    );
});
