import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { executionRef } from "../../dist/core/unit/action/index.js";
import { setRule } from "../../dist/core/unit/capability/action/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit } from "../helpers/action-fixture.js";
import { actionCapability } from "../helpers/actions.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";

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
    const prohibited = applyUnitChanges({ ...started.state, tick: 1 }, [setRule({ id: current.id }, { id: "prohibit-start", allows: () => false })]);
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
