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
import * as epDamage from "../../dist/core/battle/resource/ep/damage/index.js";
import { create as createElementalDefinition } from "../../dist/content/elemental.js";

test("Skill and Burst end notifications observe their cleared state while the owner is ENDING", () => {
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
                    const current = host.get(state);
                    assert.equal(current.skill.activation, null);
                    observed.push(["activation", current.lifecycle]);
                    return { state, value: undefined };
                },
            })
            .set(elemental.burstEnded, {
                id: "burst-ended",
                invoke(state, { host }) {
                    const current = host.get(state);
                    assert.equal(current.elemental.burst, null);
                    observed.push(["burst", current.lifecycle]);
                    return { state, value: undefined };
                },
            }),
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const owner = units.ref(units.all(state).find(() => true));
    const activated = skills.activate(state, skills.ref(owner.get(state).skill));
    assert.notEqual(activated.value, null);
    const request = { source: null, target: owner, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1000 } };
    const burst = epDamage.applyDamage(request, epDamage.calculateDamage(activated.state, request));
    assert.notEqual(burst.value.application.burst, null);
    state = remove(burst.state, owner, { reason: "SCRIPT" });
    assert.equal(owner.get(state), undefined);
    assert.deepEqual(observed.sort(), [["activation", "ENDING"], ["burst", "ENDING"]]);
});

test("a node waits for dependent finalizers and repeated requests preserve the first reason", () => {
    const calls = [];
    let state = battle([
        {
            definition: {
                id: "owner",
                hooks: Hooks.empty().set(unitLifecycle.removed, {
                        id: "observe-removal",

                        invoke(current, departure) {
                            assert.equal(departure.reason, "DEATH");
                            assert.equal(units.ref(departure.unit).get(current), undefined);
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
            assert.equal(owner.get(current).lifecycle, "ENDING");
            calls.push("parent-ended");
            return remove(current, owner, { reason: "SCRIPT" });
        },
    });
    const parent = installed.value;
    const parentScope = lifetimes.scope(effects.lifetime, parent);
    const child = effects.install(
        installed.state,
        owner,
        {
            id: "child",
            initialize: () => ({}),
            onEnd(current, _self, reason) {
                assert.equal(reason, "CANCELLED");
                current = effects.remove(current, parent, "SECOND");
                current = remove(current, owner, { reason: "DEATH", killer: null });
                assert.equal(owner.get(current).lifecycle, "ENDING");
                assert.equal(parent.get(current).lifecycle, "ENDING");
                const previous = parent.get(current);
                current = effects.setState(current, parent, { total: previous.state.total + 2 });
                calls.push("child-ended");
                return current;
            },
        },
        { scopes: [parentScope] },
    );
    state = child.state;
    const childScope = lifetimes.scope(effects.lifetime, child.value);
    assert.throws(() => lifetimes.bind(state, effects.lifetime, parent, childScope), TypeError);

    const detached = effects.install(state, owner, {
        id: "detached",
        initialize: () => ({}),
        onEnd(current) {
            calls.push("detached-ended");
            return current;
        },
    }, { scopes: [parentScope] });
    state = lifetimes.unbind(detached.state, effects.lifetime, detached.value, parentScope);
    const after = effects.remove(state, parent, "FIRST");

    assert.deepEqual(calls, ["parent-disabled", "child-ended", "parent-ended", "detached-ended", "owner-left"]);
    assert.equal(owner.get(after), undefined);
});

test("defer executes immediately outside a settlement", () => {
    const state = battle([{ definition: { id: "owner", hooks: Hooks.empty() }, position: [0, 0] }]);
    const owner = units.ref(units.all(state).find(() => true));

    const result = lifetimes.defer(state, current => remove(current, owner, { reason: "SCRIPT" }));

    assert.equal(owner.get(result), undefined);
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
                                assert.equal(nested.get(next), undefined);
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
                                assert.equal(last.get(next), undefined);
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
                assert.equal(owner.get(next), undefined);
                calls.push("A-start");
                const removed = remove(next, nested, { reason: "SCRIPT" });
                assert.equal(nested.get(removed), undefined);
                calls.push("A-end");
                return lifetimes.defer(removed, latest => {
                    calls.push("D");
                    return latest;
                });
            });
        },
    });

    const result = remove(installed.state, owner, { reason: "SCRIPT" });
    assert.deepEqual(calls, [
        "effect-ended", "owner-removed", "A-start", "nested-removed", "A-end", "B", "C", "D",
    ]);
    assert.deepEqual([...units.all(result)], []);
});

test("an ending ancestor freezes dependency edges before its active Action execution receives the end request", () => {
    let execution;
    let attached;
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
                                execution.get(current).lifecycle,
                                "ACTIVE",
                            );
                            const recipient = units
                                .all(current)
                                .find((unit) => unit.definition.id === "recipient");
                            const scope = lifetimes.scope(actions.lifetime, execution);
                            current = lifetimes.unbind(current, effects.lifetime, attached, scope);
                            const installed = effects.install(
                                current,
                                units.ref(recipient),
                                dependent,
                                {
                                    scopes: [scope],
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
    const started = actions.start(state, actions.ref(source.action.actions.get(program)));
    assert.notEqual(started.value, null);
    execution = started.value;
    const recipient = units.all(started.state).find((unit) => unit.definition.id === "recipient");
    const installed = effects.install(started.state, units.ref(recipient), {
        id: "attached", initialize: () => ({}),
    }, { scopes: [lifetimes.scope(actions.lifetime, execution)] });
    assert.notEqual(installed.value, null);
    attached = installed.value;

    const after = remove(installed.state, units.ref(source), { reason: "DEATH", killer: null });

    assert.equal(attempted, null);
    assert.equal(businessCalls, 0);
    assert.equal(
        units.all(after).find((unit) => unit.definition.id === "recipient").effects.size,
        0,
    );
    assert.equal(execution.get(after), undefined);
});
