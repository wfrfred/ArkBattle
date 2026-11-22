// Contract: [lifetime](../../docs/architecture/lifetime.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { remove } from "../../dist/core/unit/operations.js";
import * as lifetimes from "../../dist/core/lifetime/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as actions from "../../dist/core/unit/capability/action/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as epDamage from "../../dist/core/battle/resource/ep/damage/index.js";
import { create as createElementalDefinition } from "../../dist/content/elemental.js";

test("HOOK-03: Skill and Burst end notifications observe their cleared state while the owner is ENDING", () => {
    const observed = [];
    const program = {
        id: "active-until-departure",
        initialize: state => ({ state, value: {} }),
        sp: { initial: 1, capacity: 1, recovery: { type: "NONE" }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
        activation: { trigger: "MANUAL", ignoreRestrictions: [], requirement: 1, cost: 1, initialize: () => ({ state: {}, duration: { type: "INFINITE" } }) },
    };
    const definition = {
        id: "owner",
        vitality: defineVitality(10000),
        elemental: createElementalDefinition({ receiver: "CHARACTER" }),
        skill: { definition: program },
        hooks: Hooks.empty()
            .set(skills.activationEnded, {
                id: "activation-ended",
                invoke(state, { host }) {
                    const current = units.get(state, host);
                    assert.equal(current.skill.activation, null);
                    assert.equal(vitality.isAlive(current), true);
                    assert.ok(vitality.hpRatio(current) > 0);
                    observed.push(["activation", current.lifecycle]);
                    return { state, value: undefined };
                },
            })
            .set(elemental.burstEnded, {
                id: "burst-ended",
                invoke(state, { host }) {
                    const current = units.get(state, host);
                    assert.equal(current.elemental.burst, null);
                    observed.push(["burst", current.lifecycle]);
                    return { state, value: undefined };
                },
            }),
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const owner = units.ref(units.all(state).find(() => true));
    const activated = skills.activate(state, skills.ref(owner, program));
    assert.notEqual(activated.value, null);
    const request = { source: null, target: owner, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1000 } };
    const burst = epDamage.applyDamage(request, epDamage.calculateDamage(activated.state, request));
    assert.notEqual(burst.value.application.burst, null);
    state = remove(burst.state, owner, { reason: "SCRIPT" });
    assert.equal(units.get(state, owner), undefined);
    assert.deepEqual(observed.sort(), [["activation", "ENDING"], ["burst", "ENDING"]]);
});

test("an owner waits for dependent finalizers and repeated requests preserve the first reason", () => {
    const calls = [];
    let state = battle([
        {
            definition: {
                id: "owner",
                hooks: Hooks.empty().set(unitLifecycle.removed, {
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
            assert.equal(units.get(current, owner).lifecycle, "ENDING");
            calls.push("parent-ended");
            return remove(current, owner, { reason: "SCRIPT" });
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
                current = effects.remove(current, parent, "SECOND");
                current = remove(current, owner, { reason: "DEATH", killer: null });
                assert.equal(units.get(current, owner).lifecycle, "ENDING");
                assert.equal(effects.get(current, parent).lifecycle, "ENDING");
                const previous = effects.get(current, parent);
                current = effects.setState(current, parent, { total: previous.state.total + 2 });
                calls.push("child-ended");
                return current;
            },
        },
        { scopes: [lifetimes.scope(effects.lifetime, parent)] },
    ).state;

    const after = effects.remove(state, parent, "FIRST");

    assert.deepEqual(calls, ["parent-disabled", "child-ended", "parent-ended", "owner-left"]);
    assert.equal(units.get(after, owner), undefined);
});

test("defer executes immediately outside a settlement", () => {
    const state = battle([{ definition: { id: "owner", hooks: Hooks.empty() }, position: [0, 0] }]);
    const owner = units.ref(units.all(state).find(() => true));

    const result = lifetimes.defer(state, current => remove(current, owner, { reason: "SCRIPT" }));

    assert.equal(units.get(result, owner), undefined);
    assert.equal(result.tick, state.tick);
});

test("defer waits for finalizers and flushes in registration order across new settlements", () => {
    const calls = [];
    const initial = battle([
        {
            definition: {
                id: "owner",
                hooks: Hooks.empty().set(unitLifecycle.removed, {
                    id: "defer-b",
                    invoke(current) {
                        calls.push("owner-removed");
                        return {
                            state: lifetimes.defer(current, next => {
                                assert.equal(units.get(next, nested), undefined);
                                calls.push("B");
                                return remove(next, last, { reason: "SCRIPT" });
                            }),
                            value: undefined,
                        };
                    },
                }),
            },
            position: [0, 0],
        },
        {
            definition: {
                id: "nested",
                hooks: Hooks.empty().set(unitLifecycle.removed, {
                    id: "defer-c",
                    invoke(current) {
                        calls.push("nested-removed");
                        return {
                            state: lifetimes.defer(current, next => {
                                assert.equal(units.get(next, last), undefined);
                                calls.push("C");
                                return next;
                            }),
                            value: undefined,
                        };
                    },
                }),
            },
            position: [1, 0],
        },
        { definition: { id: "last", hooks: Hooks.empty() }, position: [2, 0] },
    ]);
    const [owner, nested, last] = [...units.all(initial)].map(units.ref);
    const installed = effects.install(initial, owner, {
        id: "defer-a",
        initialize: () => ({}),
        onEnd(current) {
            calls.push("effect-ended");
            return lifetimes.defer(current, next => {
                assert.equal(units.get(next, owner), undefined);
                calls.push("A-start");
                const removed = remove(next, nested, { reason: "SCRIPT" });
                assert.equal(units.get(removed, nested), undefined);
                calls.push("A-end");
                return lifetimes.defer(removed, latest => {
                    calls.push("D");
                    return latest;
                });
            });
        },
    });

    const result = remove(installed.state, owner, { reason: "SCRIPT" });
    lifetimes.defer(result, current => {
        calls.push("after-settlement");
        return current;
    });

    assert.deepEqual(calls, [
        "effect-ended", "owner-removed", "A-start", "nested-removed", "A-end", "B", "C", "D",
        "after-settlement",
    ]);
    assert.deepEqual([...units.all(result)], []);
    assert.equal(result.tick, initial.tick);
});

test("an ending ancestor rejects new dependents before its active Action execution receives the end request", () => {
    let execution;
    let attempted = "not attempted";
    let businessCalls = 0;
    const program = {
        id: "channel",
        applyWay: "NONE",
        period: { type: "FIXED", ticks: 1 },
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: state => state,
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
                action: { speed: defineAttribute(100, 20), interval: defineAttribute(10),
                    definitions: [program],
                },
                hooks: Hooks.empty().set(unitLifecycle.removing, {
                        id: "bind-during-departure",

                        invoke(current) {
                            assert.equal(
                                actions.getExecution(current, execution).execution.lifecycle,
                                "ACTIVE",
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
    assert.notEqual(started.value, null);
    state = started.state;
    execution = started.value;

    const after = remove(state, units.ref(source), { reason: "DEATH", killer: null });

    assert.equal(attempted, null);
    assert.equal(businessCalls, 0);
    assert.equal(
        units.all(after).find((unit) => unit.definition.id === "recipient").effects.size,
        0,
    );
    assert.equal(actions.getExecution(after, execution), undefined);
});
