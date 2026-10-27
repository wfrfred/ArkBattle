import assert from "node:assert/strict";
import { test } from "node:test";
import * as actions from "../../dist/core/unit/action/index.js";
import { executionRef } from "../../dist/core/unit/action/index.js";
import { actionCapability } from "../helpers/actions.js";
import { initialize } from "../../dist/core/unit/initialize.js";
import * as units from "../../dist/core/unit/query.js";
import { add as addUnit, remove as removeUnit } from "../../dist/core/battle/unit.js";
import { fixtureBattle } from "../helpers/unit.js";

const program = (id = "primary", state = { count: 0 }, extra = {}) => ({
    id,
    intervalTicks: 10,
    speed: 100,
    initialize: battle => ({ state: battle, value: {} }),
    prepare: battle => ({ state: battle, value: { ...state } }),
    onTick: battle => ({ state: battle, value: false }),
    ...extra,
});

function create(programs = [program()]) {
    const initialized = initialize(fixtureBattle(), {         id: 0,
        position: [0, 0],
        definition: { hooks: [],
            id: "update-owner",
            action: actionCapability(...programs),
        },
    });
    const source = units.ref(initialized.value);
    let battle = addUnit(initialized.state, initialized.value);
    const references = [];

    for (const definition of programs) {
        const started = actions.start(battle, actions.ref(source, definition));
        assert.equal(started.value.type, "STARTED");
        battle = started.state;
        references.push(started.value.ref);
    }

    return { battle, source, references };
}

test("Action execution state writes preserve earlier instance snapshots", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const original = actions.getExecution(fixture.battle, reference);
    const first = actions.setExecutionState(fixture.battle, reference, { ...original.execution.state, count: original.execution.state.count + 1 });
    const firstInstance = actions.getExecution(first, reference);
    const second = actions.setExecutionState(first, reference, {
        ...firstInstance.execution.state, count: firstInstance.execution.state.count + 1,
    });

    assert.equal(actions.getExecution(second, reference).execution.state.count, 2);
    assert.equal(actions.getExecution(first, reference).execution.state.count, 1);
    assert.equal(actions.getExecution(fixture.battle, reference).execution.state.count, 0);
    assert.strictEqual(actions.getExecution(fixture.battle, reference), original);
});

test("Action update preserves identity, program, lifecycle and unrelated host state", () => {
    const fixture = create([program(), program("sibling", { message: "ready" })]);
    const [reference, siblingRef] = fixture.references;
    const original = actions.getExecution(fixture.battle, reference);
    const sibling = actions.getExecution(fixture.battle, siblingRef);
    const originalHost = units.get(fixture.battle, fixture.source);
    const currentState = actions.getExecution(fixture.battle, reference).execution.state;
    const changed = actions.setExecutionState(fixture.battle, reference, { ...currentState, count: 7 });
    const next = actions.getExecution(changed, reference);
    const nextHost = units.get(changed, fixture.source);

    assert.equal(next.execution.state.count, 7);
    assert.equal(next.execution.id, original.execution.id);
    assert.strictEqual(reference.host, fixture.source);
    assert.strictEqual(next.definition, original.definition);
    assert.equal(next.execution.startedAtTick, original.execution.startedAtTick);
    assert.equal(next.execution.status, original.execution.status);
    assert.strictEqual(actions.getExecution(changed, siblingRef), sibling);
    assert.equal(nextHost.action.nextExecutionId, originalHost.action.nextExecutionId);
    assert.strictEqual(next.state, original.state);
    assert.strictEqual(next.cooldown, original.cooldown);
    assert.strictEqual(nextHost.effects, originalHost.effects);
    assert.strictEqual(nextHost.position, originalHost.position);
    assert.deepEqual(changed.events, fixture.battle.events);
});

test("Writing the same Action execution state keeps the complete BattleState unchanged", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const original = actions.getExecution(fixture.battle, reference);
    const result = actions.setExecutionState(fixture.battle, reference, original.execution.state);

    assert.strictEqual(result, fixture.battle);
    assert.strictEqual(actions.getExecution(result, reference), original);
});

test("Action execution state writes reject removed instances and missing hosts", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const removed = actions.cancel(fixture.battle, reference, "TEST");
    const absentHost = removeUnit(fixture.battle, fixture.source.id, "SCRIPT");
    assert.throws(() => actions.setExecutionState(removed, reference, { count: 9 }), /unknown action execution: 0/);
    assert.throws(() => actions.setExecutionState(absentHost, reference, { count: 9 }), /unknown unit: 0/);
    assert.equal(actions.getExecution(removed, reference), undefined);
    assert.equal(actions.getExecution(absentHost, reference), undefined);
    assert.equal(actions.getExecution(fixture.battle, reference).execution.state.count, 0);
});

test("Action update rejects ENDING instances during synchronous termination callbacks", () => {
    let observed;
    const configured = program("ending", { count: 3 }, {
        onEnd(battle, source, self) {
            observed = actions.getExecution(battle, executionRef(source, self));
            assert.throws(() => actions.setExecutionState(battle, executionRef(source, self), { count: 100 }), /cannot update an ending action/);
            return battle;
        },
    });
    const fixture = create([configured]);
    const reference = fixture.references[0];
    const cancelled = actions.cancel(fixture.battle, reference, "TEST");

    assert.equal(observed.execution.status, "ENDING");
    assert.equal(observed.execution.state.count, 3);
    assert.equal(actions.getExecution(cancelled, reference), undefined);
    assert.equal(actions.getExecution(fixture.battle, reference).execution.state.count, 3);
});

test("Action update distinguishes identical local execution IDs on different hosts", () => {
    const configured = program();
    const fixture = create([configured]);
    const second = initialize(fixture.battle, {         id: 1,
        position: [1, 0],
        definition: { hooks: [], id: "second-owner", action: actionCapability(configured) },
    });
    const withSecond = addUnit(second.state, second.value);
    const started = actions.start(withSecond, actions.ref(units.ref(second.value), configured));
    assert.equal(started.value.type, "STARTED");
    const firstRef = fixture.references[0];
    const secondRef = started.value.ref;
    assert.equal(firstRef.id, secondRef.id);
    assert.notEqual(firstRef.host.id, secondRef.host.id);
    const first = actions.getExecution(started.state, firstRef);
    const currentState = actions.getExecution(started.state, secondRef).execution.state;
    const changed = actions.setExecutionState(started.state, secondRef, { ...currentState, count: 8 });

    assert.strictEqual(actions.getExecution(changed, firstRef), first);
    assert.equal(actions.getExecution(changed, secondRef).execution.state.count, 8);
    assert.equal(actions.getExecution(started.state, secondRef).execution.state.count, 0);
});
