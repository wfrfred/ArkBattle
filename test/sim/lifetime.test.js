import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as lifetimes from "../../dist/core/lifetime/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as actions from "../../dist/core/unit/action/index.js";

test("an owner waits for dependent finalizers and repeated requests preserve the first reason", () => {
    const calls = [];
    let state = battle([
        {
            definition: {
                id: "owner",
                hooks: Hooks.empty().set(unitLifecycle.leave, {
                        id: "observe-removal",

                        invoke(current, departure) {
                            assert.equal(departure.reason, "DEATH");
                            assert.equal(units.get(current, units.ref(departure.unit)), undefined);
                            calls.push("owner-left");
                            return { state: current, value: undefined };
                        },
                    }),
            },
            position: [0, 0],
        },
    ]);
    const owner = units.ref(units.all(state).find(() => true));
    const installed = effects.install(state, owner, {
        id: "parent",
        initialize: () => ({ total: 0 }),
        onDisable(current, self) {
            calls.push("parent-disabled");
            return effects.setState(current, effects.ref(self), { total: 1 });
        },
        onEnd(current, self, reason) {
            assert.equal(reason, "FIRST");
            assert.equal(self.state.total, 3);
            assert.equal(units.get(current, owner).lifecycle, "LEAVING");
            calls.push("parent-ended");
            return remove(current, owner.id, "SCRIPT");
        },
    });
    state = installed.state;
    const parent = installed.value;
    state = effects.install(
        state,
        owner,
        {
            id: "child",
            initialize: () => ({}),
            onEnd(current, _self, reason) {
                assert.equal(reason, "FIRST");
                current = effects.end(current, parent, "SECOND");
                current = remove(current, owner.id, "DEATH");
                assert.equal(units.get(current, owner).lifecycle, "LEAVING");
                assert.equal(effects.get(current, parent).status, "ENDING");
                const previous = effects.get(current, parent);
                current = effects.setState(current, parent, { total: previous.state.total + 2 });
                calls.push("child-ended");
                return current;
            },
        },
        { scopes: [lifetimes.scope(effects.lifetime, parent)] },
    ).state;

    const after = effects.end(state, parent, "FIRST");

    assert.deepEqual(calls, ["parent-disabled", "child-ended", "parent-ended", "owner-left"]);
    assert.equal(units.get(after, owner), undefined);
    assert.equal(after.removedUnits.length, 1);
    assert.equal(units.get(state, owner).lifecycle, "PRESENT");
});

test("an ending ancestor rejects new dependents before its running Action receives the end request", () => {
    let execution;
    let attempted = "not attempted";
    let businessCalls = 0;
    const program = {
        id: "channel",
        intervalTicks: 1,
        speed: 100,
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: (state) => ({ state, value: false }),
    };
    const dependent = {
        id: "late-dependent",
        initialize: () => ({}),
        onInstall(state) {
            businessCalls++;
            return state;
        },
    };
    let state = battle([
        {
            definition: {
                id: "source",
                action: {
                    initialize: (current) =>
                        actions.createActions(current, actions.create(program)),
                },
                hooks: Hooks.empty().set(unitLifecycle.prepare, {
                        id: "bind-during-departure",

                        invoke(current) {
                            assert.equal(
                                actions.getExecution(current, execution).execution.status,
                                "RUNNING",
                            );
                            const recipient = units
                                .all(current)
                                .find((unit) => unit.definition.id === "recipient");
                            const installed = effects.install(
                                current,
                                units.ref(recipient),
                                dependent,
                                {
                                    scopes: [lifetimes.scope(actions.lifetime, execution)],
                                },
                            );
                            attempted = installed.value;
                            return { state: installed.state, value: undefined };
                        },
                    }),
            },
            position: [0, 0],
        },
        { definition: { id: "recipient", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const source = units.all(state).find((unit) => unit.definition.id === "source");
    const started = actions.start(state, actions.ref(units.ref(source), program));
    assert.equal(started.value.type, "STARTED");
    state = started.state;
    execution = started.value.ref;

    const after = remove(state, source.id, "DEATH");

    assert.equal(attempted, undefined);
    assert.equal(businessCalls, 0);
    assert.equal(
        units.all(after).find((unit) => unit.definition.id === "recipient").effects.size,
        0,
    );
    assert.equal(actions.getExecution(after, execution), undefined);
});
