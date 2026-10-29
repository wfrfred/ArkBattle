import { scope as lifetimeScope } from "../../dist/core/lifetime/index.js";
import { lifetime as skillLifetime } from "../../dist/core/unit/skill/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit } from "../helpers/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as skills from "../../dist/core/unit/skill/operations.js";
import * as sp from "../../dist/core/unit/skill/sp.js";
import { ref as activationRef } from "../../dist/core/unit/skill/activation.js";
import { getActivation as getActivation } from "../../dist/core/unit/skill/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { get as getHookHost, ref as unitRef } from "../../dist/core/unit/query.js";
import { ref as skillRef, fixture, setSkill } from "../helpers/skill.js";
import { definition as effectDefinition } from "../helpers/effects.js";

const hook = (id, invoke) => ({ id, invoke });

test("zero-duration activation completes lifecycle callbacks and records each lifecycle event once", () => {
    const trace = [];
    const dependent = effectDefinition("dependent", {}, { onEnd(battle) { trace.push("dependent"); return battle; } });
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "TIME", durationTicks: 0 }, initialize: () => ({}),
        onStart(battle, source, self) {
            trace.push("start");
            return effects.install(battle, source, dependent, { scopes: [lifetimeScope(skillLifetime, activationRef(source, self))] }).state;
        },
        onEnd(battle, source, self) {
            assert.equal(getUnit(battle, 1).skill.activation.status, "ENDING");
            assert.equal(getUnit(battle, 1).effects.values().toArray().length, 0);
            trace.push("end");
            return battle;
        },
    } });
    const settled = skills.activate(f.state, f.skillRef);
    assert.equal(settled.value.type, "ACTIVATED");
    assert.deepEqual(trace, ["start", "dependent", "end"]);
    assert.equal(getUnit(settled.state, 1).skill.activation, null);
    assert.deepEqual(settled.state.events.filter(({ type }) => type.startsWith("SKILL_")).map(({ type }) => type), ["SKILL_ACTIVATED", "SKILL_FINISHED"]);
    assert.equal(skills.finish(settled.state, settled.value.ref), settled.state);
    assert.deepEqual(f.state.events, []);
});

test("onStart self-termination follows creation notification and entered content can continue", () => {
    const trace = [];
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onStart(battle, source, self) {
            trace.push("start");
            battle = skills.finish(battle, activationRef(source, self));
            trace.push("continued");
            return battle;
        },
        onEnd(battle) { trace.push("end"); return battle; },
    } });
    const currentSkill = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill,
        activationStarted: [hook("created", (battle) => { trace.push("activationStarted"); return { state: battle, value: undefined }; })],
        activationEnded: [hook("ended", (battle) => { trace.push("activationEnded"); return { state: battle, value: undefined }; })],
    });
    const settled = skills.activate(state, f.skillRef);
    assert.deepEqual(trace, ["activationStarted", "start", "end", "activationEnded", "continued"]);
    assert.equal(getUnit(settled.state, 1).skill.activation, null);
    assert.equal(settled.state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
});

test("each nested dispatch gets fresh candidates while the outer dispatch keeps its selected sequence", () => {
    const trace = [];
    const later = hook("later", (battle, { event }) => { trace.push(["later", event.current]); return { state: battle, value: undefined }; });
    const f = fixture();
    const currentSkill2 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill2, spRecovered: [
        hook("install", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            trace.push(["install", event.current]);
            if (event.current !== 1) return { state: battle, value: undefined };
            const currentSkill3 = getUnit(battle, 1).skill;
            battle = setSkill(battle, { ...currentSkill3, spRecovered: [...currentSkill3.spRecovered, later] });
            return { state: sp.recover(battle, unitRef(self), "TIME", 1).state, value: undefined };
        }),
    ] });
    state = sp.pay(state, f.ref, 2).state;
    state = sp.recover(state, f.ref, "TIME", 1).state;
    assert.deepEqual(trace, [["install", 1], ["install", 2], ["later", 2]]);
});

test("removing a selected Hook during dispatch prevents its later invocation", () => {
    const trace = [];
    const f = fixture();
    const currentSkill4 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill4, spPaid: [
        hook("remove", (battle) => {
            trace.push("remove");
            const currentSkill5 = getUnit(battle, 1).skill;
            return { state: setSkill(battle, { ...currentSkill5, spPaid: currentSkill5.spPaid.filter(({ id }) => id !== "removed") }), value: undefined };
        }),
        hook("removed", (battle) => { trace.push("removed"); return { state: battle, value: undefined }; }),
    ] });
    state = sp.pay(state, f.ref, 1).state;
    assert.deepEqual(trace, ["remove"]);
});

test("operation Rules gate user controls but cannot veto timeout or forced cancellation", () => {
    const seen = [];
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onOperation(battle, source, _self, operation) { seen.push(operation); return battle; },
    } });
    let state = skills.activate(f.state, f.skillRef).state;
    const reference = activationRef(unitRef(getUnit(state, 1)), getUnit(state, 1).skill);
    const currentSkill6 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill6, rules: [...currentSkill6.rules, { id: "no-control", allowsOperation: () => false }] });
    assert.equal(skills.operate(state, reference, "STOP").value.type, "REJECTED");
    assert.deepEqual(seen, []);
    state = skills.cancel(state, reference, "DEPARTURE");
    assert.equal(getUnit(state, 1).skill.activation, null);
});

test("activation payment and identity are committed together before a payment Hook can terminate it", () => {
    let starts = 0;
    const facts = [];
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onStart(battle) { starts++; return battle; },
    } });
    const currentSkill7 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill7,
        spPaid: [hook("stop", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            assert.equal(self.skill.sp.value, 0);
            assert.equal(self.skill.activation.status, "ACTIVE");
            assert.deepEqual([event.previous, event.current], [2, 0]);
            return { state: skills.finish(battle, activationRef(unitRef(self), self.skill)), value: undefined };
        })],
        activationStarted: [hook("created", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            facts.push({ id: event.ref.id, currentId: self.skill.activation.id, status: self.skill.activation.status });
            return { state: battle, value: undefined };
        })],
    });
    const result = skills.activate(state, f.skillRef);
    assert.equal(result.value.type, "ACTIVATED");
    assert.equal(starts, 0);
    assert.deepEqual(facts, [{ id: 0, currentId: 0, status: "ACTIVE" }]);
    assert.equal(getUnit(result.state, 1).skill.activation, null);
    assert.deepEqual(result.state.events.filter(({ type }) => type.startsWith("SKILL_")).map(({ type }) => type), ["SKILL_ACTIVATED", "SKILL_FINISHED"]);
});

test("creation notification precedes departure triggered by the activation payment Hook", () => {
    const trace = [];
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onStart: () => assert.fail("a departed host cannot enter its start program"),
        onEnd(battle, source, self) {
            assert.equal(getUnit(battle, source.id).lifecycle, "LEAVING");
            trace.push("onEnd");
            return battle;
        },
    } });
    const currentSkill8 = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill8,
        activationStarted: [hook("created", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            assert.equal(self.skill.sp.value, 0);
            assert.equal(self.skill.activation.id, event.ref.id);
            trace.push("activationStarted");
            return { state: battle, value: undefined };
        })],
        spPaid: [hook("depart", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            assert.deepEqual(event, { amount: 2, previous: 2, current: 0 });
            trace.push("spPaid");
            return { state: remove(battle, self.id, "RETREAT"), value: undefined };
        })],
        activationEnded: [hook("ended", (battle) => { trace.push("activationEnded"); return { state: battle, value: undefined }; })],
    });
    const settled = skills.activate(state, f.skillRef);
    assert.equal(settled.value.type, "ACTIVATED");
    assert.deepEqual(trace, ["activationStarted", "spPaid", "onEnd", "activationEnded"]);
    assert.equal(getUnit(settled.state, 1), undefined);
    assert.deepEqual(settled.state.events.filter(({ type }) => type.startsWith("SKILL_")).map(({ type }) => type), ["SKILL_ACTIVATED", "SKILL_FINISHED"]);
});

test("an activationStarted Hook can end the instance while later candidates and payment retain their original facts", () => {
    const trace = [];
    let originalRef;
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        onStart: () => assert.fail("the ended instance cannot enter its start program"),
        onEnd(battle) { trace.push("onEnd"); return battle; },
    } });
    const currentSkill9 = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill9,
        activationStarted: [
            hook("first", (battle, { host, event }) => {
                const self = getHookHost(battle, host);

                assert.equal(self.skill.sp.value, 0);
                originalRef = event.ref;
                trace.push("activationStarted:first");
                battle = skills.finish(battle, event.ref);
                battle = sp.modify(battle, unitRef(self), 1, true).state;
                trace.push("activationStarted:return");
                return { state: battle, value: undefined };
            }),
            hook("later", (battle, { host, event }) => {
                const self = getHookHost(battle, host);

                assert.equal(self.skill.activation, null);
                assert.equal(event.ref.id, 0);
                assert.equal(event.ref, originalRef);
                assert.equal(getActivation(battle, event.ref), undefined);
                trace.push("activationStarted:later");
                return { state: battle, value: undefined };
            }),
        ],
        activationEnded: [hook("ended", (battle) => { trace.push("activationEnded"); return { state: battle, value: undefined }; })],
        spPaid: [hook("paid", (battle, { host, event }) => {
            const self = getHookHost(battle, host);

            assert.equal(self.skill.activation, null);
            assert.equal(self.skill.sp.value, 1);
            assert.deepEqual(event, { amount: 2, previous: 2, current: 0 });
            trace.push("spPaid");
            return { state: battle, value: undefined };
        })],
    });
    const settled = skills.activate(state, f.skillRef);
    assert.equal(settled.value.type, "ACTIVATED");
    assert.deepEqual(trace, ["activationStarted:first", "onEnd", "activationEnded", "activationStarted:return", "activationStarted:later", "spPaid"]);
    assert.equal(getUnit(settled.state, 1).skill.activation, null);
    assert.equal(settled.state.events.filter(({ type }) => type === "SKILL_FINISHED").length, 1);
});

test("an activationEnded Hook may start a replacement without running the old start or timeout against it", () => {
    const starts = [];
    const payments = [];
    const f = fixture({
        sp: { initial: 4, capacity: 4, requirement: 2, cost: 2, recovery: { type: "NONE" } },
        activation: {
            trigger: "MANUAL", sustain: { type: "TIME", durationTicks: 0 }, initialize: () => ({}),
            onStart(battle, source, self) {
                starts.push(self.activation.id);
                assert.equal(self.activation.id, 1);
                return skills.extendTime(battle, activationRef(source, self), 5);
            },
        },
    });
    const currentSkill10 = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill10,
        activationStarted: [hook("replace-first", (battle, { event }) => ({ state: event.ref.id === 0 ? skills.finish(battle, event.ref) : battle, value: undefined }))],
        activationEnded: [hook("restart", (battle, { host, event }) => {
            const self = getHookHost(battle, host);
            return { state: event.ref.id === 0 ? skills.activate(battle, skillRef(self)).state : battle, value: undefined };
        })],
        spPaid: [hook("paid", (battle, { event }) => {
            payments.push([event.previous, event.current]);
            return { state: battle, value: undefined };
        })],
    });
    const settled = skills.activate(state, f.skillRef);
    assert.equal(settled.value.type, "ACTIVATED");
    assert.equal(settled.value.ref.id, 0);
    assert.equal(getActivation(settled.state, settled.value.ref), undefined);
    assert.deepEqual(starts, [1]);
    assert.deepEqual(payments, [[2, 0], [4, 2]]);
    assert.equal(getUnit(settled.state, 1).skill.activation.id, 1);
    assert.deepEqual(getUnit(settled.state, 1).skill.activation.sustain, { type: "TIME", endsAtTick: 5 });
    assert.deepEqual(settled.state.events.filter(({ type }) => type.startsWith("SKILL_")).map(({ type, activationId }) => [type, activationId]), [
        ["SKILL_ACTIVATED", 0], ["SKILL_FINISHED", 0], ["SKILL_ACTIVATED", 1],
    ]);
});


test("activation replacement changes live state while remaining observers retain the original context", () => {
    const f = fixture({
        sp: { initial: 4, capacity: 4, requirement: 2, cost: 2, recovery: { type: "NONE" } },
        activation: { trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}) },
    });
    const seen = [];
    let original;
    const currentSkill11 = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill11, activationStarted: [
        {
            id: "replace",
            invoke(battle, context) {
                if (context.event.ref.id === 0) {
                    original = context;
                    battle = skills.finish(battle, context.event.ref);
                    battle = skills.activate(battle, skillRef(getUnit(battle, context.host.id))).state;
                }
                return { state: battle, value: undefined };
            },
        },
        {
            id: "observe",
            invoke(battle, context) {
                if (context.event.ref.id === 0) {
                    assert.equal(context, original);
                }
                const current = getHookHost(battle, context.host).skill.activation;
                seen.push([context.event.ref.id, current.id]);
                return { state: battle, value: undefined };
            },
        },
    ] });
    const result = skills.activate(state, f.skillRef);
    assert.deepEqual(seen, [[1, 1], [0, 1]]);
    assert.equal(getUnit(result.state, f.ref.id).skill.activation.id, 1);
});
