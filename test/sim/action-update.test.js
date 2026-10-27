import assert from "node:assert/strict";
import { test } from "node:test";
import * as actions from "../../dist/core/unit/action/operations.js";
import { ref } from "../../dist/core/unit/action/action.js";
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
    start: battle => ({ state: battle, value: { ...state } }),
    step: battle => ({ state: battle, value: false }),
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
        const started = actions.start(battle, source, definition);
        assert.equal(started.value.type, "STARTED");
        battle = started.state;
        references.push(started.value.ref);
    }

    return { battle, source, references };
}

test("Action update transforms the latest private state rather than an earlier instance snapshot", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const original = actions.get(fixture.battle, reference);
    const first = actions.update(fixture.battle, reference, current => ({ ...current, count: current.count + 1 }));
    const firstInstance = actions.get(first, reference);
    let received;
    const second = actions.update(first, reference, current => {
        received = current;
        return { ...current, count: current.count + 1 };
    });

    assert.strictEqual(received, firstInstance.execution.state);
    assert.equal(actions.get(second, reference).execution.state.count, 2);
    assert.equal(actions.get(first, reference).execution.state.count, 1);
    assert.equal(actions.get(fixture.battle, reference).execution.state.count, 0);
    assert.strictEqual(actions.get(fixture.battle, reference), original);
});

test("Action update preserves identity, program, lifecycle and unrelated host state", () => {
    const fixture = create([program(), program("sibling", { message: "ready" })]);
    const [reference, siblingRef] = fixture.references;
    const original = actions.get(fixture.battle, reference);
    const sibling = actions.get(fixture.battle, siblingRef);
    const originalHost = units.get(fixture.battle, fixture.source);
    const changed = actions.update(fixture.battle, reference, current => ({ ...current, count: 7 }));
    const next = actions.get(changed, reference);
    const nextHost = units.get(changed, fixture.source);

    assert.equal(next.execution.state.count, 7);
    assert.equal(next.execution.id, original.execution.id);
    assert.strictEqual(reference.host, fixture.source);
    assert.strictEqual(next.definition, original.definition);
    assert.equal(next.execution.startedAtTick, original.execution.startedAtTick);
    assert.equal(next.execution.status, original.execution.status);
    assert.strictEqual(actions.get(changed, siblingRef), sibling);
    assert.equal(nextHost.action.nextExecutionId, originalHost.action.nextExecutionId);
    assert.strictEqual(next.state, original.state);
    assert.strictEqual(next.cooldown, original.cooldown);
    assert.strictEqual(nextHost.effects, originalHost.effects);
    assert.strictEqual(nextHost.position, originalHost.position);
    assert.deepEqual(changed.events, fixture.battle.events);
});

test("Action update returning the current private state keeps the complete BattleState unchanged", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const original = actions.get(fixture.battle, reference);
    let calls = 0;
    const result = actions.update(fixture.battle, reference, current => {
        calls++;
        assert.strictEqual(current, original.execution.state);
        return current;
    });

    assert.equal(calls, 1);
    assert.strictEqual(result, fixture.battle);
    assert.strictEqual(actions.get(result, reference), original);
});

test("Action update does not invoke transforms for removed instances or missing hosts", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const removed = actions.cancel(fixture.battle, reference, "TEST");
    const absentHost = removeUnit(fixture.battle, fixture.source.id, "SCRIPT");
    const forbidden = () => assert.fail("an absent Action must not execute its state transform");

    assert.throws(() => actions.update(removed, reference, forbidden), /unknown action execution: 0/);
    assert.throws(() => actions.update(absentHost, reference, forbidden), /unknown unit: 0/);
    assert.equal(actions.get(removed, reference), undefined);
    assert.equal(actions.get(absentHost, reference), undefined);
    assert.equal(actions.get(fixture.battle, reference).execution.state.count, 0);
});

test("Action update rejects ENDING instances during synchronous termination callbacks", () => {
    let attempts = 0;
    let observed;
    const configured = program("ending", { count: 3 }, {
        onEnd(battle, source, self) {
            observed = actions.get(battle, ref(source, self));
            assert.throws(() => actions.update(battle, ref(source, self), () => {
                attempts++;
                return { count: 100 };
            }), /cannot update an ending action/);
            return battle;
        },
    });
    const fixture = create([configured]);
    const reference = fixture.references[0];
    const cancelled = actions.cancel(fixture.battle, reference, "TEST");

    assert.equal(attempts, 0);
    assert.equal(observed.execution.status, "ENDING");
    assert.equal(observed.execution.state.count, 3);
    assert.equal(actions.get(cancelled, reference), undefined);
    assert.equal(actions.get(fixture.battle, reference).execution.state.count, 3);
});

test("Action update distinguishes identical local execution IDs on different hosts", () => {
    const configured = program();
    const fixture = create([configured]);
    const second = initialize(fixture.battle, {         id: 1,
        position: [1, 0],
        definition: { hooks: [], id: "second-owner", action: actionCapability(configured) },
    });
    const withSecond = addUnit(second.state, second.value);
    const started = actions.start(withSecond, units.ref(second.value), configured);
    assert.equal(started.value.type, "STARTED");
    const firstRef = fixture.references[0];
    const secondRef = started.value.ref;
    assert.equal(firstRef.id, secondRef.id);
    assert.notEqual(firstRef.host.id, secondRef.host.id);
    const first = actions.get(started.state, firstRef);
    const changed = actions.update(started.state, secondRef, current => ({ ...current, count: 8 }));

    assert.strictEqual(actions.get(changed, firstRef), first);
    assert.equal(actions.get(changed, secondRef).execution.state.count, 8);
    assert.equal(actions.get(started.state, secondRef).execution.state.count, 0);
});

test("A throwing Action transform cannot modify any already published instance", () => {
    const fixture = create();
    const reference = fixture.references[0];
    const changed = actions.update(fixture.battle, reference, current => ({ ...current, count: 1 }));
    const prior = actions.get(changed, reference);

    assert.throws(() => actions.update(changed, reference, () => {
        throw new Error("transform failed");
    }), /transform failed/);
    assert.strictEqual(actions.get(changed, reference), prior);
    assert.equal(actions.get(changed, reference).execution.state.count, 1);
    assert.equal(actions.get(fixture.battle, reference).execution.state.count, 0);
});
