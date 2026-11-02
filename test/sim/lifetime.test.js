import { set as setFixtureEntry } from "../../dist/core/hook.js";

import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import { setHook } from "../../dist/core/unit/capability/skill/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { scope, bind, dependencies, unbind } from "../../dist/core/lifetime/index.js";
import { key } from "../../dist/core/lifetime/dependency.js";
import { remove, replace as update, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { setHook as setBlockerHook } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { setRule } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { initialize, getUnit } from "../helpers/unit.js";
import { effectFixtureWork, definition } from "../helpers/effects.js";
import { ref as skillRef, definition as skillDefinition } from "../helpers/skill.js";
import { actionCapability } from "../helpers/actions.js";
import { fixture as blockingFixture, holder, target, acquire, hook } from "../helpers/blocking.js";

const unit = (id = 1, extra = {}) => initialize({
    id, position: [id, 0], definition: { id: `lifetime-host-${id}`, hooks: [], ...extra },
});
const settled = battle => {
    assert.equal(battle.lifetime.settling, false);
    assert.equal(battle.lifetime.endings.size, 0);
};

test("a child Finalize can request its owner while the owner survives until the callback returns", () => {
    const trace = [];
    const host = unit(1, { hooks: [{ id: "left", stage: "leave", invoke(battle) {
        trace.push("owner:left");
        return { state: battle, value: undefined };
    } }] });
    const installed = effects.install(effectFixtureWork(host), { id: 1 }, definition("child", {}, {
        onEnd(battle, self) {
            trace.push("child:begin");
            battle = remove(battle, self.host.id, "SCRIPT");
            assert.equal(getUnit(battle, 1).lifecycle, "LEAVING");
            assert.equal(effects.get(battle, effects.ref(self)).status, "ENDING");
            assert.deepEqual(trace, ["child:begin"]);
            trace.push("child:return");
            return battle;
        },
    }));
    const battle = effects.end(installed.state, installed.value);
    assert.deepEqual(trace, ["child:begin", "child:return", "owner:left"]);
    assert.equal(getUnit(battle, 1), undefined);
    assert.equal(getUnit(installed.state, 1).lifecycle, "PRESENT");
    settled(battle);
});

test("a removed Activation still delays its owner until the entire activationEnded Hook returns", () => {
    const trace = [];
    const skill = skillDefinition({ sp: null, activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
    } });
    const host = unit(1, { skill, hooks: [{ id: "left", stage: "leave", invoke(battle) {
        trace.push("owner:left");
        return { state: battle, value: undefined };
    } }] });
    let battle = effectFixtureWork(host);
    battle = applyUnitChanges(battle, [setHook({ id: host.id }, "activationEnded", {
        id: "remove-owner-after-slot-clear",
        invoke(current, { host, event }) {
            assert.equal(skills.getActivation(current, event.ref), undefined);
            assert.equal(getUnit(current, host.id).skill.activation, null);
            trace.push("activationEnded:begin");
            current = remove(current, host.id, "SCRIPT");
            assert.equal(getUnit(current, host.id).lifecycle, "LEAVING");
            assert.deepEqual(trace, ["activationEnded:begin"]);
            trace.push("activationEnded:return");
            return { state: current, value: undefined };
        },
    })]);
    const started = skills.activate(battle, skillRef(getUnit(battle, 1)));
    assert.equal(started.value.type, "ACTIVATED");
    battle = skills.finish(started.state, started.value.ref);
    assert.deepEqual(trace, ["activationEnded:begin", "activationEnded:return", "owner:left"]);
    assert.equal(getUnit(battle, 1), undefined);
    settled(battle);
});

test("explicit Effect cleanup exposes Pending before a Blocking Hook requests the same child and its owner", () => {
    const trace = [];
    let reference;
    const content = definition("blocking-lifetime", {}, {
        onDisable(battle, self) {
            trace.push("prepare");
            return applyUnitChanges(battle, [setRule(self.host, { id: "release-on-ending", allows: () => false })]);
        },
        onEnd(battle) {
            assert.equal(getUnit(battle, 10).lifecycle, "LEAVING");
            trace.push("finalize");
            return battle;
        },
    });
    let battle = blockingFixture([holder(10, { definition: { hooks: [{
        id: "left", stage: "leave", invoke(battle) {
            trace.push("owner:left");
            return { state: battle, value: undefined };
        },
    }] } }), target()]);
    const host = getUnit(battle, 10);
    const blocker = { ...host.blocker, released: setFixtureEntry(host.blocker.released, hook("reenter-publication", current => {
        trace.push("publish");
        assert.equal(current.lifetime.settling, true);
        assert.equal(current.lifetime.endings.get(key(scope(effects.lifetime, reference))).phase, "PREPARING");
        assert.equal(effects.get(current, reference).status, "ENDING");
        assert.equal(effects.end(current, reference, "REENTERED"), current);
        assert.deepEqual(trace, ["prepare", "publish"]);
        current = remove(current, 10, "SCRIPT");
        assert.equal(getUnit(current, 10).lifecycle, "LEAVING");
        assert.deepEqual(trace, ["prepare", "publish"]);
        return current;
    })) };
    battle = acquire(update(battle, [{ ...host, blocker }]));
    assert.equal(getUnit(battle, 10).blocker.blocked.length, 1);
    const installed = effects.install(battle, { id: 10 }, content);
    reference = installed.value;
    battle = effects.end(installed.state, reference, "FIRST");
    assert.deepEqual(trace, ["prepare", "publish", "finalize", "owner:left"]);
    assert.equal(getUnit(battle, 10), undefined);
    settled(battle);
});

test("shared descendants finalize once and Prepare keeps the first child's reason before automatic requests", () => {
    const trace = [];
    let a, b;
    let battle = effectFixtureWork(unit());
    const parent = effects.install(battle, { id: 1 }, definition("parent", {}, {
        onDisable(current) { return effects.end(current, a, "CUSTOM"); },
        onEnd(current, _self, reason) { trace.push(["parent", reason]); return current; },
    }));
    const left = effects.install(parent.state, { id: 1 }, definition("left", {}, {
        onEnd(current, _self, reason) {
            assert.equal(effects.get(current, b).status, "ENDING");
            trace.push(["left", reason]);
            return current;
        },
    }), { scopes: [scope(effects.lifetime, parent.value)] });
    a = left.value;
    const right = effects.install(left.state, { id: 1 }, definition("right", {}, {
        onEnd(current, _self, reason) { trace.push(["right", reason]); return current; },
    }), { scopes: [scope(effects.lifetime, parent.value)] });
    b = right.value;
    const shared = effects.install(right.state, { id: 1 }, definition("shared", {}, {
        onEnd(current, _self, reason) { trace.push(["shared", reason]); return current; },
    }), { scopes: [scope(effects.lifetime, a), scope(effects.lifetime, b)] });
    battle = effects.end(shared.state, parent.value, "PARENT");
    assert.deepEqual(trace, [["shared", "CUSTOM"], ["left", "CUSTOM"], ["right", "PARENT"], ["parent", "PARENT"]]);
    assert.equal(getUnit(battle, 1).effects.size, 0);
    settled(battle);
});

test("stable bindings reject cycles and Prepare rejects a target whose ancestor is ENDING", () => {
    let middle, leaf;
    const base = effects.install(effectFixtureWork(unit()), { id: 1 }, definition("base"));
    const parent = effects.install(base.state, { id: 1 }, definition("middle", {}, {
        onDisable(battle) {
            assert.equal(effects.get(battle, middle).status, "ENDING");
            const scopes = dependencies(battle, scope(effects.lifetime, base.value));
            const rejected = bind(battle, scope(effects.lifetime, base.value), scope(effects.lifetime, leaf));
            assert.equal(rejected.value, false);
            assert.equal(rejected.state, battle);
            assert.equal(dependencies(rejected.state, scope(effects.lifetime, base.value)), scopes);
            return battle;
        },
    }), { scopes: [scope(effects.lifetime, base.value)] });
    middle = parent.value;
    const child = effects.install(parent.state, { id: 1 }, definition("leaf"), {
        scopes: [scope(effects.lifetime, middle)],
    });
    leaf = child.value;
    assert.throws(() => bind(child.state, scope(effects.lifetime, base.value), scope(effects.lifetime, leaf)), /cycle/);
    const battle = effects.end(child.state, middle);
    assert.equal(effects.get(battle, base.value).status, "ACTIVE");
    assert.equal(effects.get(battle, leaf), undefined);
    settled(battle);
});

test("Unit ENDING publication rejects remote dependencies on its still RUNNING Action", () => {
    const content = {
        id: "blocking-action", intervalTicks: 30, speed: 100,
        initialize: battle => ({ state: battle, value: {} }),
        prepare: battle => ({ state: battle, value: {} }),
        onTick: battle => ({ state: battle, value: false }),
    };
    const initial = blockingFixture([
        holder(10, { definition: { action: actionCapability(content) } }), target(), unit(),
    ]);
    const started = actions.start(initial, actions.ref({ id: 10 }, content));
    assert.equal(started.value.type, "STARTED");
    const active = acquire(started.state);
    assert.equal(getUnit(active, 10).blocker.blocked.length, 1);
    const reference = started.value.ref;
    const actionScope = scope(actions.lifetime, reference);
    const blockedCalls = [];
    const attempted = {
        id: "late-action-dependent",
        initialize() { blockedCalls.push("initialize"); return {}; },
        onInstall(battle) { blockedCalls.push("install"); return battle; },
        onEnable(battle) { blockedCalls.push("enable"); return battle; },
    };
    const independent = effects.install(active, { id: 1 }, definition("independent"));
    const owner = getUnit(independent.state, 10);
    let calls = 0;
    const battle = remove(applyUnitChanges(independent.state, [setBlockerHook({ id: owner.id }, "released", hook("admit-during-unit-end", current => {
            calls++;
            assert.equal(getUnit(current, 10).lifecycle, "LEAVING");
            assert.equal(current.lifetime.endings.get(key(scope(unitLifetime, { id: 10 }))).phase, "PREPARING");
            assert.equal(actions.getExecution(current, reference).execution.status, "RUNNING");
            assert.equal(current.lifetime.endings.has(key(actionScope)), false);
            const nextId = getUnit(current, 1).effects.nextId;
            const installed = effects.install(current, { id: 1 }, attempted, { scopes: [actionScope] });
            const bound = bind(installed.state, scope(effects.lifetime, independent.value), actionScope);
            const free = effects.install(bound.state, { id: 1 }, definition("free-during-unit-end"));
            assert.deepEqual({
                installed: installed.value !== undefined,
                bound: bound.value,
                blockedCalls,
                independent: free.value !== undefined,
            }, { installed: false, bound: false, blockedCalls: [], independent: true });
            assert.equal(installed.state, current);
            assert.equal(bound.state, current);
            assert.equal(free.value.id, nextId);
            return free.state;
        }))]), 10, "DEATH");
    assert.equal(calls, 1);
    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(getUnit(battle, 1).effects.size, 2);
    assert.deepEqual(dependencies(battle, scope(effects.lifetime, independent.value)), []);
    settled(battle);
});

test("public Lifetime binding owns explicit dependencies without duplicating the Effect or owner", () => {
    let battle = effectFixtureWork(unit(1), unit(2));
    const installed = effects.install(battle, { id: 1 }, definition("bindable"));
    battle = installed.state;
    const target = scope(effects.lifetime, installed.value);
    const parent = scope(unitLifetime, { id: 2 });
    const original = effects.get(battle, installed.value);
    const bound = bind(battle, target, parent);
    assert.equal(bound.value, true);
    assert.equal(effects.get(bound.state, installed.value), original);
    assert.deepEqual(dependencies(bound.state, target), [parent]);
    assert.equal(bind(bound.state, target, parent).state, bound.state);
    const unbound = unbind(bound.state, target, parent);
    assert.deepEqual(dependencies(unbound, target), []);
    assert.equal(effects.get(unbound, installed.value), original);
    assert.equal(effects.get(remove(unbound, 2, "SCRIPT"), installed.value), original);
    assert.equal(effects.get(remove(unbound, 1, "SCRIPT"), installed.value), undefined);
    assert.deepEqual(dependencies(bound.state, target), [parent]);
});

test("owner teardown follows relationship registration across domains and finishes dependencies first", () => {
    const trace = [];
    const action = {
        id: "registered-second", intervalTicks: 1, speed: 100,
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick: state => ({ state, value: false }),
        onEnd(state) { trace.push("action"); return state; },
    };
    const skill = skillDefinition({ sp: null, activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onEnd(state) { trace.push("skill"); return state; },
    } });
    const host = unit(1, { action: actionCapability(action), skill });
    let battle = effectFixtureWork(host, unit(2));
    battle = effects.install(battle, { id: 1 }, definition("registered-first", {}, {
        onEnd(state) { trace.push("effect"); return state; },
    })).state;
    const started = actions.start(battle, actions.ref({ id: 1 }, action));
    assert.equal(started.value.type, "STARTED");
    const activated = skills.activate(started.state, skillRef(getUnit(started.state, 1)));
    battle = effects.install(activated.state, { id: 2 }, definition("skill-child", {}, {
        onEnd(state) { trace.push("child"); return state; },
    }), { scopes: [scope(skills.lifetime, activated.value.ref)] }).state;

    battle = remove(battle, 1, "SCRIPT");
    assert.deepEqual(trace, ["effect", "action", "child", "skill"]);
    assert.equal(getUnit(battle, 1), undefined);
    assert.equal(getUnit(battle, 2).effects.size, 0);
    settled(battle);
});
