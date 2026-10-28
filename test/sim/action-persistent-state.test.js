import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as actionLifetime } from "../../dist/core/unit/action/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/unit/initialize.js";
import { actionCapability } from "../helpers/actions.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { advance } from "../../dist/core/unit/action/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit, fixtureBattle } from "../helpers/unit.js";

const program = (id, configuration = {}) => ({
    id, intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: { count: 0 } }),
    prepare: (state, source, self) => ({ state, value: { sampledCount: self.state.count } }),
    onTick: state => ({ state, value: false }),
    ...configuration,
});

function create(battle, capability, id = 0) {
    const initialized = initialize(battle, { id, position: [id, 0], definition: { hooks: [], id: "persistent", action: capability } });
    return { state: addUnit(initialized.state, initialized.value), source: unitRef(initialized.value), unit: initialized.value };
}

test("Action initializes every aggregate before any start and threads battle results", () => {
    const calls = [];
    const make = id => program(id, {
        initialize(state) {
            calls.push([id, state.execution.rngState]);
            return { state: { ...state, execution: { ...state.execution, rngState: state.execution.rngState + 1 } }, value: { count: state.execution.rngState } };
        },
    });
    const first = make("first"), second = make("second");
    const capability = actionCapability(first, second);
    const initial = fixtureBattle(37, { rngState: 12 });
    const a = create(initial, capability), b = create(a.state, capability, 1);
    assert.deepEqual(calls, [["first", 12], ["second", 13], ["first", 14], ["second", 15]]);
    assert.equal(b.state.execution.rngState, 16);
    assert.equal(initial.execution.rngState, 12);
    assert.equal(getUnit(b.state, 0).action.actions.size, 2);
    assert.equal(actions.forUnit(b.state, a.source).length, 0);
    for (const [definition, count] of [[first, 12], [second, 13]]) {
        const stored = actions.getAction(b.state, actions.ref(a.source, definition));
        assert.equal(stored.definition, definition);
        assert.deepEqual(stored.state, { count });
        assert.deepEqual(stored.cooldown, { periodTicks: 10, readyAtTick: 37 });
        assert.equal(stored.execution, null);
        assert.notEqual(stored, actions.getAction(b.state, actions.ref(b.source, definition)));
        assert.notEqual(stored.state, actions.getAction(b.state, actions.ref(b.source, definition)).state);
    }
});

test("Action completion and cancellation clear execution while preserving persistent history", () => {
    let initialized = 0;
    const definition = program("history", {
        initialize(state) { initialized++; return { state, value: { count: 0 } }; },
        onTick(state, source, self) {
            const count = self.state.count;
            const currentState = actions.getAction(state, actions.ref(source, self.definition)).state;
            return { state: actions.setState(state, actions.ref(source, self.definition), { count: currentState.count + 1 }), value: count === 0 };
        },
    });
    const fixture = create(fixtureBattle(), actionCapability(definition));
    const reference = actions.ref(fixture.source, definition);
    const first = actions.start(fixture.state, reference);
    assert.equal(first.value.type, "STARTED");
    const completed = advance(first.state, first.value.ref);
    assert.equal(actions.getExecution(completed, first.value.ref), undefined);
    assert.deepEqual(actions.getAction(completed, reference).state, { count: 1 });
    assert.equal(actions.getAction(completed, reference).execution, null);
    const second = actions.start({ ...completed, tick: 10 }, reference);
    assert.equal(second.value.type, "STARTED");
    assert.equal(actions.getExecution(second.state, first.value.ref), undefined);
    assert.equal(actions.getAction(second.state, reference).execution.id, second.value.ref.id);
    assert.equal(actions.getExecution(second.state, second.value.ref).execution.state.sampledCount, 1);
    const progressed = advance(second.state, second.value.ref);
    const cancelled = actions.cancel(progressed, second.value.ref);
    assert.equal(actions.getExecution(cancelled, second.value.ref), undefined);
    assert.deepEqual(actions.getAction(cancelled, reference).state, { count: 2 });
    assert.deepEqual(actions.getAction(fixture.state, reference).state, { count: 0 });
    assert.equal(getUnit(cancelled, fixture.source.id).action.actions.size, 1);
    assert.deepEqual(actions.start(cancelled, reference).value, { type: "REJECTED", reason: "COOLDOWN" });
    assert.equal(initialized, 1);
});

test("Action startup commits cooldown using the latest aggregate after callbacks", () => {
    const sibling = program("sibling");
    const definition = program("nested", {
        prepare(state, source, self) {
            state = actions.setState(state, actions.ref(source, self.definition), { count: 7 });
            state = actions.setState(state, actions.ref(source, sibling), { count: 9 });
            state = actions.resetCooldown(state, actions.ref(source, sibling));
            return { state, value: { sampledCount: self.state.count } };
        },
    });
    const fixture = create(fixtureBattle(), actionCapability(definition, sibling));
    const started = actions.start(fixture.state, actions.ref(fixture.source, definition));
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(actions.getAction(started.state, actions.ref(fixture.source, definition)).state, { count: 7 });
    assert.deepEqual(actions.getAction(started.state, actions.ref(fixture.source, sibling)).state, { count: 9 });
    assert.equal(actions.getAction(started.state, actions.ref(fixture.source, definition)).cooldown.readyAtTick, 10);
    assert.equal(actions.getAction(started.state, actions.ref(fixture.source, sibling)).cooldown.readyAtTick, 10);
    assert.equal(actions.getExecution(started.state, started.value.ref).execution.state.sampledCount, 0);
    assert.equal(getUnit(fixture.state, fixture.source.id).action.actions.get(definition.id).state.count, 0);
});

test("Action termination preserves persistent and cooldown updates from dependencies and onEnd", () => {
    const trace = [];
    const definition = program("ending", {
        onEnd(state, source, self) {
            trace.push(["end", self.execution.status, self.state.count, self.cooldown.readyAtTick]);
            assert.deepEqual(actions.start(state, actions.ref(source, self.definition)).value, { type: "REJECTED", reason: "CASTING" });
            const currentState = actions.getAction(state, actions.ref(source, self.definition)).state;
            state = actions.setState(state, actions.ref(source, self.definition), { count: currentState.count + 1 });
            const currentCooldown = actions.getAction(state, actions.ref(source, self.definition)).cooldown;
            return actions.setCooldown(state, actions.ref(source, self.definition), { ...currentCooldown, readyAtTick: 80 });
        },
    });
    const fixture = create(fixtureBattle(), actionCapability(definition));
    const started = actions.start(fixture.state, actions.ref(fixture.source, definition));
    const dependency = {
        id: "ending-dependency", initialize: () => ({}),
        onEnd(state) {
            trace.push(["dependency"]);
            const currentState = actions.getAction(state, actions.ref(fixture.source, definition)).state;
            state = actions.setState(state, actions.ref(fixture.source, definition), { count: currentState.count + 1 });
            const currentCooldown = actions.getAction(state, actions.ref(fixture.source, definition)).cooldown;
            return actions.setCooldown(state, actions.ref(fixture.source, definition), { ...currentCooldown, readyAtTick: 50 });
        },
    };
    const installed = effects.install(started.state, fixture.source, dependency, { scopes: [lifetimeScope(actionLifetime, started.value.ref)] });
    const finished = actions.cancel(installed.state, started.value.ref, "TEST");
    const aggregate = actions.getAction(finished, actions.ref(fixture.source, definition));
    assert.deepEqual(trace, [["dependency"], ["end", "ENDING", 1, 50]]);
    assert.deepEqual(aggregate.state, { count: 2 });
    assert.equal(aggregate.cooldown.readyAtTick, 80);
    assert.equal(aggregate.execution, null);
    assert.equal(actions.getExecution(finished, started.value.ref), undefined);
    assert.equal(actions.getExecution(started.state, started.value.ref).execution.status, "RUNNING");
});
