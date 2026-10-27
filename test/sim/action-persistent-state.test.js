import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/unit/initialize.js";
import { Definitions } from "../../dist/core/unit/action/definitions.js";
import * as actions from "../../dist/core/unit/action/operations.js";
import * as effects from "../../dist/core/unit/effect/operations.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit, fixtureBattle } from "../helpers/unit.js";

const program = (id, configuration = {}) => ({
    id, intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: { count: 0 } }),
    start: (state, source, self) => ({ state, value: { sampledCount: self.state.count } }),
    step: state => ({ state, value: false }),
    ...configuration,
});

function create(battle, definitions, id = 0) {
    const initialized = initialize(battle, { id, position: [id, 0], definition: { hooks: [], id: "persistent", action: { definitions } } });
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
    const definitions = Definitions.empty().add(first).add(second);
    const initial = fixtureBattle(37, { rngState: 12 });
    const a = create(initial, definitions), b = create(a.state, definitions, 1);
    assert.deepEqual(calls, [["first", 12], ["second", 13], ["first", 14], ["second", 15]]);
    assert.equal(b.state.execution.rngState, 16);
    assert.equal(initial.execution.rngState, 12);
    assert.equal(getUnit(b.state, 0).action.actions.size, 2);
    assert.equal(actions.forUnit(b.state, a.source).length, 0);
    for (const [definition, count] of [[first, 12], [second, 13]]) {
        const stored = actions.getAction(b.state, a.source, definition);
        assert.equal(stored.definition, definition);
        assert.deepEqual(stored.state, { count });
        assert.deepEqual(stored.cooldown, { periodTicks: 10, readyAtTick: 37 });
        assert.equal(stored.execution, null);
        assert.notEqual(stored, actions.getAction(b.state, b.source, definition));
        assert.notEqual(stored.state, actions.getAction(b.state, b.source, definition).state);
    }
});

test("Action completion and cancellation clear execution while preserving persistent history", () => {
    let initialized = 0;
    const definition = program("history", {
        initialize(state) { initialized++; return { state, value: { count: 0 } }; },
        step(state, source, self) {
            const count = self.state.count;
            return { state: actions.updateState(state, source, self.definition, current => ({ count: current.count + 1 })), value: count === 0 };
        },
    });
    const fixture = create(fixtureBattle(), Definitions.empty().add(definition));
    const first = actions.start(fixture.state, fixture.source, definition);
    assert.equal(first.value.type, "STARTED");
    assert.equal(actions.get(first.state, first.value.ref), undefined);
    assert.deepEqual(actions.getAction(first.state, fixture.source, definition).state, { count: 1 });
    assert.equal(actions.getAction(first.state, fixture.source, definition).execution, null);
    const second = actions.start({ ...first.state, tick: 10 }, fixture.source, definition);
    assert.equal(second.value.type, "STARTED");
    assert.equal(actions.get(second.state, second.value.ref).execution.state.sampledCount, 1);
    const cancelled = actions.cancel(second.state, second.value.ref);
    assert.equal(actions.get(cancelled, second.value.ref), undefined);
    assert.deepEqual(actions.getAction(cancelled, fixture.source, definition).state, { count: 2 });
    assert.deepEqual(actions.getAction(fixture.state, fixture.source, definition).state, { count: 0 });
    assert.equal(getUnit(cancelled, fixture.source.id).action.actions.size, 1);
    assert.deepEqual(actions.start(cancelled, fixture.source, definition).value, { type: "REJECTED", reason: "COOLDOWN" });
    assert.equal(initialized, 1);
});

test("Action startup commits cooldown using the latest aggregate after callbacks", () => {
    const sibling = program("sibling");
    const definition = program("nested", {
        start(state, source, self) {
            state = actions.updateState(state, source, self.definition, () => ({ count: 7 }));
            state = actions.updateState(state, source, sibling, () => ({ count: 9 }));
            state = actions.resetCooldown(state, source, sibling.id);
            return { state, value: { sampledCount: self.state.count } };
        },
    });
    const fixture = create(fixtureBattle(), Definitions.empty().add(definition).add(sibling));
    const started = actions.start(fixture.state, fixture.source, definition);
    assert.equal(started.value.type, "STARTED");
    assert.deepEqual(actions.getAction(started.state, fixture.source, definition).state, { count: 7 });
    assert.deepEqual(actions.getAction(started.state, fixture.source, sibling).state, { count: 9 });
    assert.equal(actions.getAction(started.state, fixture.source, definition).cooldown.readyAtTick, 10);
    assert.equal(actions.getAction(started.state, fixture.source, sibling).cooldown.readyAtTick, 10);
    assert.equal(actions.get(started.state, started.value.ref).execution.state.sampledCount, 0);
    assert.equal(getUnit(fixture.state, fixture.source.id).action.actions.get(definition.id).state.count, 0);
});

test("Action termination preserves persistent and cooldown updates from dependencies and onEnd", () => {
    const trace = [];
    const definition = program("ending", {
        onEnd(state, source, self) {
            trace.push(["end", self.execution.status, self.state.count, self.cooldown.readyAtTick]);
            assert.deepEqual(actions.start(state, source, self.definition).value, { type: "REJECTED", reason: "CASTING" });
            state = actions.updateState(state, source, self.definition, current => ({ count: current.count + 1 }));
            return actions.updateCooldown(state, source, self.definition.id, current => ({ ...current, readyAtTick: 80 }));
        },
    });
    const fixture = create(fixtureBattle(), Definitions.empty().add(definition));
    const started = actions.start(fixture.state, fixture.source, definition);
    const dependency = {
        id: "ending-dependency", initialize: () => ({}),
        onEnd(state) {
            trace.push(["dependency"]);
            state = actions.updateState(state, fixture.source, definition, current => ({ count: current.count + 1 }));
            return actions.updateCooldown(state, fixture.source, definition.id, current => ({ ...current, readyAtTick: 50 }));
        },
    };
    const installed = effects.install(started.state, fixture.source, dependency, { scopes: [{ type: "ACTION", ref: started.value.ref }] });
    const finished = actions.cancel(installed.state, started.value.ref, "TEST");
    const aggregate = actions.getAction(finished, fixture.source, definition);
    assert.deepEqual(trace, [["dependency"], ["end", "ENDING", 1, 50]]);
    assert.deepEqual(aggregate.state, { count: 2 });
    assert.equal(aggregate.cooldown.readyAtTick, 80);
    assert.equal(aggregate.execution, null);
    assert.equal(actions.get(finished, started.value.ref), undefined);
    assert.equal(actions.get(started.state, started.value.ref).execution.status, "RUNNING");
});
