import assert from "node:assert/strict";
import { test } from "node:test";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { available, scope } from "../../dist/core/lifetime/index.js";
import { key } from "../../dist/core/lifetime/dependency.js";
import { remove, update, lifetime as unitLifetime } from "../../dist/core/battle/unit.js";
import { setHook as setBlockerHook, setRule } from "../../dist/core/unit/capability/blocking/blocker.js";
import { initialize, getUnit } from "../helpers/unit.js";
import { effectFixtureWork, definition } from "../helpers/effects.js";
import { definition as skillDefinition } from "../helpers/skill.js";
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

test("a removed Activation still delays its owner until the entire ended Hook returns", () => {
    const trace = [];
    const skill = skillDefinition({ sp: null, activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
    } });
    const host = unit(1, { skill, hooks: [{ id: "left", stage: "leave", invoke(battle) {
        trace.push("owner:left");
        return { state: battle, value: undefined };
    } }] });
    let battle = effectFixtureWork(host);
    battle = update(battle, [{ ...host, skill: skills.setEndedHook(host.skill, {
        id: "remove-owner-after-slot-clear",
        invoke(current, { host, event }) {
            assert.equal(skills.get(current, skills.ref(event.activation)), undefined);
            assert.equal(getUnit(current, host.id).skill.active, null);
            trace.push("ended:begin");
            current = remove(current, host.id, "SCRIPT");
            assert.equal(getUnit(current, host.id).lifecycle, "LEAVING");
            assert.deepEqual(trace, ["ended:begin"]);
            trace.push("ended:return");
            return { state: current, value: undefined };
        },
    }) }]);
    const started = skills.activate(battle, { id: 1 });
    assert.equal(started.value.type, "ACTIVATED");
    battle = skills.finish(started.state, started.value.ref);
    assert.deepEqual(trace, ["ended:begin", "ended:return", "owner:left"]);
    assert.equal(getUnit(battle, 1), undefined);
    settled(battle);
});

test("ENDING publication exposes Pending before a real Blocking Hook requests the same child and its owner", () => {
    const trace = [];
    let reference;
    const content = definition("blocking-lifetime", {}, {
        onDisable(battle) { trace.push("prepare"); return battle; },
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
    let blocker = setRule(host.blocker, {
        id: "release-on-ending",
        allows: self => !self.effects.values().some(effect =>
            effect.definition === content && effect.status === "ENDING"),
    });
    blocker = setBlockerHook(blocker, "released", hook("reenter-publication", current => {
        trace.push("publish");
        assert.equal(current.lifetime.settling, true);
        assert.equal(current.lifetime.endings.get(key(scope(effects.lifetime, reference))).phase, "PREPARING");
        assert.equal(effects.get(current, reference).status, "ENDING");
        assert.equal(effects.end(current, reference, "REENTERED"), current);
        assert.deepEqual(trace, ["publish"]);
        current = remove(current, 10, "SCRIPT");
        assert.equal(getUnit(current, 10).lifecycle, "LEAVING");
        assert.deepEqual(trace, ["publish"]);
        return current;
    }));
    battle = acquire(update(battle, [{ ...host, blocker }]));
    assert.equal(getUnit(battle, 10).blocker.blocked.length, 1);
    const installed = effects.install(battle, { id: 10 }, content);
    reference = installed.value;
    battle = effects.end(installed.state, reference, "FIRST");
    assert.deepEqual(trace, ["publish", "prepare", "finalize", "owner:left"]);
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

test("group fallback becomes ACTIVE in Prepare before dependent Prepare and the old winner's Finalize", () => {
    const trace = [];
    let weakRef;
    const weak = definition("weak", {}, { group: { id: "fallback", priority: 1 },
        onEnable(battle) { trace.push("weak:enable"); return battle; },
    });
    const strong = definition("strong", {}, { group: { id: "fallback", priority: 2 },
        onDisable(battle) { trace.push("strong:disable"); return battle; },
        onEnd(battle) {
            assert.equal(effects.get(battle, weakRef).status, "ACTIVE");
            trace.push("strong:end");
            return battle;
        },
    });
    const first = effects.install(effectFixtureWork(unit()), { id: 1 }, weak);
    weakRef = first.value;
    const winner = effects.install(first.state, { id: 1 }, strong);
    const dependent = effects.install(winner.state, { id: 1 }, definition("dependent", {}, {
        onDisable(battle) {
            assert.equal(effects.get(battle, weakRef).status, "ACTIVE");
            trace.push("child:prepare");
            return battle;
        },
        onEnd(battle) { trace.push("child:end"); return battle; },
    }), { scopes: [scope(effects.lifetime, winner.value)] });
    trace.length = 0;
    const battle = effects.end(dependent.state, winner.value);
    assert.deepEqual(trace, ["strong:disable", "weak:enable", "child:prepare", "child:end", "strong:end"]);
    settled(battle);
});

test("stable bindings reject cycles and Prepare rejects a target whose ancestor is ENDING", () => {
    let middle, leaf;
    const base = effects.install(effectFixtureWork(unit()), { id: 1 }, definition("base"));
    const parent = effects.install(base.state, { id: 1 }, definition("middle", {}, {
        onDisable(battle) {
            assert.equal(effects.get(battle, middle).status, "ENDING");
            const scopes = effects.get(battle, base.value).scopes;
            const rejected = effects.bindLifetime(battle, base.value, scope(effects.lifetime, leaf));
            assert.equal(rejected.value, false);
            assert.equal(rejected.state, battle);
            assert.equal(effects.get(rejected.state, base.value).scopes, scopes);
            return battle;
        },
    }), { scopes: [scope(effects.lifetime, base.value)] });
    middle = parent.value;
    const child = effects.install(parent.state, { id: 1 }, definition("leaf"), {
        scopes: [scope(effects.lifetime, middle)],
    });
    leaf = child.value;
    assert.throws(() => effects.bindLifetime(child.state, base.value, scope(effects.lifetime, leaf)), /cycle/);
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
    const battle = remove(update(independent.state, [{
        ...owner,
        blocker: setBlockerHook(owner.blocker, "released", hook("admit-during-unit-end", current => {
            calls++;
            assert.equal(getUnit(current, 10).lifecycle, "LEAVING");
            assert.equal(current.lifetime.endings.get(key(scope(unitLifetime, { id: 10 }))).phase, "PREPARING");
            assert.equal(actions.getExecution(current, reference).execution.status, "RUNNING");
            assert.equal(current.lifetime.endings.has(key(actionScope)), false);
            const nextId = getUnit(current, 1).effects.nextId;
            const installed = effects.install(current, { id: 1 }, attempted, { scopes: [actionScope] });
            const bound = effects.bindLifetime(installed.state, independent.value, actionScope);
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
        })),
    }]), 10, "DEATH");
    assert.equal(calls, 1);
    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(getUnit(battle, 1).effects.size, 2);
    assert.deepEqual(effects.get(battle, independent.value).scopes, []);
    settled(battle);
});

test("Prepare rejects transitive dependencies if any upstream parent is ending", () => {
    let middle, leaf;
    const root = effects.install(effectFixtureWork(unit(), unit(2)), { id: 1 }, definition("root", {}, {
        onDisable(battle) {
            assert.equal(effects.get(battle, middle).status, "ACTIVE");
            assert.equal(effects.get(battle, leaf).status, "ACTIVE");
            assert.equal(battle.lifetime.endings.has(key(scope(effects.lifetime, middle))), false);
            assert.equal(battle.lifetime.endings.has(key(scope(effects.lifetime, leaf))), false);
            assert.equal(available(battle, scope(effects.lifetime, open.value)), true);
            const installed = effects.install(battle, { id: 2 }, definition("late-transitive"), {
                scopes: [scope(effects.lifetime, leaf)],
            });
            const bound = effects.bindLifetime(installed.state, independent.value, scope(effects.lifetime, leaf));
            assert.deepEqual({ installed: installed.value !== undefined, bound: bound.value }, {
                installed: false, bound: false,
            });
            assert.equal(bound.state, battle);
            return bound.state;
        },
    }));
    const open = effects.install(root.state, { id: 1 }, definition("open-parent"));
    const branch = effects.install(open.state, { id: 1 }, definition("middle"), {
        scopes: [scope(effects.lifetime, root.value)],
    });
    middle = branch.value;
    const child = effects.install(branch.state, { id: 1 }, definition("multi-parent-child"), {
        scopes: [scope(effects.lifetime, open.value), scope(effects.lifetime, middle)],
    });
    leaf = child.value;
    const independent = effects.install(child.state, { id: 2 }, definition("independent"));
    const battle = effects.end(independent.state, root.value);
    assert.equal(effects.get(battle, open.value).status, "ACTIVE");
    assert.equal(effects.get(battle, leaf), undefined);
    assert.deepEqual(effects.get(battle, independent.value).scopes, []);
    settled(battle);
});

test("Prepare exceptions propagate without mutating the input or forcing Finalize", () => {
    const failure = new Error("prepare failed");
    let finalized = 0;
    const installed = effects.install(effectFixtureWork(unit()), { id: 1 }, definition("failing", { value: 1 }, {
        onDisable(battle, self) {
            battle = effects.setData(battle, effects.ref(self), { value: 2 });
            throw failure;
        },
        onEnd(battle) { finalized++; return battle; },
    }));
    assert.throws(() => effects.end(installed.state, installed.value), error => error === failure);
    assert.equal(finalized, 0);
    assert.equal(effects.get(installed.state, installed.value).status, "ACTIVE");
    assert.deepEqual(effects.get(installed.state, installed.value).data, { value: 1 });
    settled(installed.state);
});
