import { fixtureBattle, getUnit, initialize } from "../helpers/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { update as updateUnit } from "../../dist/core/battle/unit.js";

import * as skills from "../../dist/core/unit/skill/operations.js";
import { create } from "../../dist/core/unit/skill/initialize.js";
import * as sp from "../../dist/core/unit/skill/sp.js";
import { initialize as initializeSkill, removeRule } from "../../dist/core/unit/capability/skill/capability.js";
import { create as value } from "../../dist/core/unit/contribution/attribute.js";

import { get as getHookHost, ref } from "../../dist/core/unit/query.js";
import { effectFixtureWork } from "../helpers/effects.js";
import { actionCapability } from "../helpers/actions.js";
import { start as startAction, ref as actionRef } from "../../dist/core/unit/action/index.js";
import { advance as advanceAction } from "../../dist/core/unit/action/index.js";
import { ref as skillRef, fixture, definition, at, setSkill, currentRef } from "../helpers/skill.js";

const resource = (overrides = {}) => ({
    initial: 0, capacity: 6, requirement: 3, cost: 3,
    recovery: { type: "TIME", intervalTicks: 30 }, ...overrides,
});
const read = (battle) => getUnit(battle, 1).skill;
const observe = (id, invoke) => ({ id, invoke });

test("charged startup pays the remaining SP before extending only this activation", () => {
    const payments = [];
    const f = fixture({
        sp: resource({ initial: 10, capacity: 10, requirement: 2, cost: undefined }),
        activation: {
            trigger: "MANUAL", sustain: { type: "TIME", durationTicks: 120 }, initialize: () => ({}),
            onStart(battle, source, self) {
                const identity = currentRef(battle);
                const cost = self.definition.sp.requirement;
                const remaining = self.sp.value;
                const layers = Math.floor(remaining / cost) + 1;
                const extraTicks = self.definition.activation.sustain.durationTicks * layers * 0.4;
                assert.equal(battle.events.filter(({ type }) => type === "SKILL_ACTIVATED").at(-1).endsAtTick, 127);
                battle = sp.pay(battle, source, remaining).state;
                return skills.extendTime(battle, identity, extraTicks);
            },
        },
    });
    const input = at(f.state, 7);
    const before = read(input);
    let state = setSkill(input, { ...before, spPaid: [observe("payment", (battle, { event }) => {
        payments.push([event.amount, event.previous, event.current]);
        return { state: battle, value: undefined };
    })] });
    const started = skills.activate(state, f.skillRef);
    assert.equal(started.value.type, "ACTIVATED");
    assert.deepEqual(payments, [[2, 10, 8], [8, 8, 0]]);
    assert.equal(read(started.state).sp.value, 0);
    assert.equal(read(started.state).activation.sustain.endsAtTick, 367);
    assert.equal(started.state.events.find(({ type }) => type === "SKILL_ACTIVATED").endsAtTick, 127);
    assert.equal(read(started.state).definition, f.definition);
    assert.equal(f.definition.activation.sustain.durationTicks, 120);
    assert.equal(read(input).sp.value, 10);

    state = skills.finish(started.state, started.value.ref);
    state = sp.modify(state, f.ref, 2).state;
    const next = skills.activate(state, f.skillRef);
    assert.equal(next.value.type, "ACTIVATED");
    assert.equal(read(next.state).activation.sustain.endsAtTick, 175);
    assert.deepEqual(next.state.events.filter(({ type }) => type === "SKILL_ACTIVATED").map(({ endsAtTick }) => endsAtTick), [127, 127]);
    assert.equal(read(next.state).definition, f.definition);
    assert.equal(f.definition.activation.sustain.durationTicks, 120);
});

test("activation-specific payment samples the current SP without changing the configured cost", () => {
    const payments = [];
    const f = fixture({
        sp: resource({ initial: 7, capacity: 10, requirement: 3, cost: 2 }),
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
            cost: (_battle, _source, self) => self.sp.value,
        },
    });
    const before = read(f.state);
    const state = setSkill(f.state, { ...before, spPaid: [observe("payment", (battle, { event }) => {
        payments.push(event);
        return { state: battle, value: undefined };
    })] });
    assert.equal(sp.resolveCost(state, f.ref), 2);
    const started = skills.activate(state, f.skillRef);
    assert.equal(started.value.type, "ACTIVATED");
    assert.equal(read(started.state).sp.value, 0);
    assert.deepEqual(payments, [{ amount: 7, previous: 7, current: 0 }]);
    assert.equal(sp.resolveRequirement(started.state, f.ref), 3);
    assert.equal(sp.resolveCost(started.state, f.ref), 2);
    assert.equal(read(started.state).definition, f.definition);
});

test("skill definitions are shared and deployments initialize independent private state", () => {
    const f = fixture({ initialize: battle => ({ state: battle, value: ({ count: 0 }) }), sp: resource({ initial: 1 }) });
    assert.equal(f.unit.skill.definition, f.definition);
    const another = initializeSkill(fixtureBattle(90), f.unit.definition.skill).value;
    assert.deepEqual(another.state, { count: 0 });
    assert.notEqual(another.state, f.unit.skill.state);
    assert.equal(another.sp.value, 1);
    assert.equal(another.sp.lastTick, 90);
    assert.throws(() => create(f.state, definition({ sp: resource({ initial: 7 }) })), /capacity/);
    assert.throws(() => create(f.state, definition({ sp: resource({ initial: 0.5 }) })), /integer/);
});

for (const source of ["TIME", "ACTION", "HIT"]) {
    test(`${source} recovery caps capacity and preserves ordinary charge budgets`, () => {
        const recovery = source === "TIME" ? { type: source, intervalTicks: 30 } : { type: source, amount: 1 };
        const f = fixture({ sp: resource({ recovery }) });
        const gained = sp.recover(f.state, f.ref, source, 5);
        assert.equal(read(gained.state).sp.value, 5);
        assert.equal(read(sp.recover(gained.state, f.ref, source, 10).state).sp.value, 6);
        const paid = sp.pay(gained.state, f.ref);
        assert.equal(read(paid.state).sp.value, 2);
        const refused = sp.pay(paid.state, f.ref);
        assert.equal(refused.value.type, "REJECTED");
        assert.equal(refused.state, paid.state);
        assert.equal(sp.recover(gained.state, f.ref, source === "ACTION" ? "HIT" : "ACTION").value.type, "REJECTED");
        assert.throws(() => sp.recover(gained.state, f.ref, source, 0.5), /integer/);
    });
}

test("capacity, requirement and payment are independent configuration values and missing cost follows requirement", () => {
    for (const cost of [2, undefined]) {
        const f = fixture({ sp: resource({ initial: 5, capacity: 10, requirement: 5, cost }) });
        assert.equal(sp.resolveCapacity(f.state, f.ref), 10);
        assert.equal(sp.resolveRequirement(f.state, f.ref), 5);
        assert.equal(sp.resolveCost(f.state, f.ref), cost ?? 5);
        const activated = skills.activate(f.state, f.skillRef);
        assert.equal(activated.value.type, "ACTIVATED");
        assert.equal(read(activated.state).sp.value, 5 - (cost ?? 5));
        assert.equal(read(activated.state).definition, f.definition);
        assert.equal(read(f.state).sp.value, 5);
    }
});

test("payment needs no Activation and ignores recovery and activation Rules", () => {
    const f = fixture({ sp: resource({ initial: 5 }), activation: null });
    const currentSkill9 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill9, rules: [{
        id: "blocked", allowsActivation: () => false, allowsRecovery: () => false,
    }] });
    state = sp.pay(state, f.ref, 3).state;
    assert.equal(read(state).sp.value, 2);
    assert.equal(read(state).activation, null);
    assert.equal(read(state).nextActivationId, 0);
});

test("recovery Rules block ordinary positive modification, but not drains, payment or explicit force", () => {
    const f = fixture({ sp: resource({ initial: 4 }) });
    const currentSkill10 = getUnit(f.state, 1).skill;
    const state = setSkill(f.state, { ...currentSkill10, rules: [{ id: "block", allowsRecovery: () => false }] });
    assert.equal(sp.recover(state, f.ref, "TIME", 1).state, state);
    assert.equal(sp.modify(state, f.ref, 1).state, state);
    assert.equal(read(sp.modify(state, f.ref, -2).state).sp.value, 2);
    assert.equal(read(sp.pay(state, f.ref, 3).state).sp.value, 1);
    assert.equal(read(sp.modify(state, f.ref, 20, true).state).sp.value, 6);
    assert.equal(read(sp.modify(state, f.ref, -20, true).state).sp.value, 0);
});

test("active recovery is a removable default Rule and payment remains legal during activation", () => {
    const f = fixture({ sp: resource({ initial: 6 }) });
    let state = skills.activate(f.state, f.skillRef).state;
    assert.equal(read(state).sp.value, 3);
    assert.equal(sp.recover(state, f.ref, "TIME", 1).value.type, "REJECTED");
    state = sp.pay(state, f.ref, 1).state;
    assert.equal(read(state).sp.value, 2);
    const currentSkill11 = getUnit(state, 1).skill;
    state = setSkill(state, removeRule(currentSkill11, "@skill/active-recovery"));
    state = sp.recover(state, f.ref, "TIME", 1).state;
    assert.equal(read(state).sp.value, 3);
    assert.equal(read(state).activation.status, "ACTIVE");
});

test("natural SP pauses while full and resumes the saved remainder without a backlog", () => {
    const f = fixture({ sp: resource({ capacity: 2, requirement: 2, cost: 2 }) });
    let state = skills.advance(at(f.state, 15), f.ref);
    assert.equal(read(state).sp.recovery.remainingTicks, 15);
    state = sp.modify(state, f.ref, 2).state;
    state = skills.advance(at(state, 100), f.ref);
    assert.equal(read(state).sp.recovery.remainingTicks, 15);
    state = sp.pay(state, f.ref, 2).state;
    state = skills.advance(at(state, 114), f.ref);
    assert.equal(read(state).sp.value, 0);
    state = skills.advance(at(state, 115), f.ref);
    assert.equal(read(state).sp.value, 1);
    assert.equal(read(f.state).sp.recovery.remainingTicks, 30);
});

test("recovery restrictions pause the natural timer and do not accumulate missed periods", () => {
    const f = fixture({ sp: resource() });
    let state = skills.advance(at(f.state, 12), f.ref);
    const currentSkill12 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill12, rules: [{ id: "block", allowsRecovery: () => false }] });
    state = skills.advance(at(state, 200), f.ref);
    assert.equal(read(state).sp.value, 0);
    assert.equal(read(state).sp.recovery.remainingTicks, 18);
    const currentSkill13 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill13, rules: currentSkill13.rules.filter(({ id }) => id !== "block") });
    state = skills.advance(at(state, 217), f.ref);
    assert.equal(read(state).sp.value, 0);
    state = skills.advance(at(state, 218), f.ref);
    assert.equal(read(state).sp.value, 1);
});

test("a zero-HP host preserves its natural remainder while advancing the paused clock", () => {
    const unit = initialize({ id: 1, position: [0, 0], definition: {
        id: "reviving-host", vitality: { maxHp: 100, defense: 0, resistance: 0 }, skill: definition({ sp: resource() }),
    } });
    const reference = ref(unit);
    let state = sp.advance(at(effectFixtureWork(unit), 12), reference);
    const before = state;
    let current = getUnit(state, 1);
    state = updateUnit(state, [{ ...current, vitality: { ...current.vitality, hp: 0 } }]);
    state = sp.advance(at(state, 200), reference);
    assert.equal(read(state).sp.value, 0);
    assert.equal(read(state).sp.lastTick, 200);
    assert.equal(read(state).sp.recovery.remainingTicks, 18);
    assert.throws(() => sp.advance(at(state, 199), reference), /earlier tick/);
    current = getUnit(state, 1);
    state = updateUnit(state, [{ ...current, vitality: { ...current.vitality, hp: 100 } }]);
    state = sp.advance(at(state, 217), reference);
    assert.equal(read(state).sp.value, 0);
    assert.equal(read(state).sp.recovery.remainingTicks, 1);
    state = sp.advance(at(state, 218), reference);
    assert.equal(read(state).sp.value, 1);
    assert.equal(read(before).sp.lastTick, 12);
    assert.equal(read(before).sp.recovery.remainingTicks, 18);
});

test("a paused zero-HP host still applies natural speed changes and zero-rate invalidation", () => {
    const unit = initialize({ id: 1, position: [0, 0], definition: {
        id: "paused-speed-host", vitality: { maxHp: 100, defense: 0, resistance: 0 }, skill: definition({ sp: resource() }),
    } });
    const reference = ref(unit);
    let state = sp.advance(at(effectFixtureWork(unit), 12), reference);
    const current = getUnit(state, 1);
    state = updateUnit(state, [{ ...current, vitality: { ...current.vitality, hp: 0 } }]);
    const currentSkill14 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill14, sp: sp.setContribution(currentSkill14.sp, "recoverySpeed", {
        id: "double", value: [value({ finalScaler: 2 })],
    }) });
    state = sp.advance(at(state, 100), reference);
    assert.deepEqual(read(state).sp.recovery, { periodTicks: 15, remainingTicks: 3 });
    assert.equal(read(state).sp.lastTick, 100);
    const currentSkill15 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill15, sp: sp.setContribution(currentSkill15.sp, "recoveryMultiplier", {
        id: "zero", value: [value({ finalScaler: 0 })],
    }) });
    state = sp.advance(at(state, 200), reference);
    assert.equal(read(state).sp.recovery, null);
    assert.equal(read(state).sp.lastTick, 200);
    const currentSkill16 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill16, sp: sp.removeContribution(currentSkill16.sp, "recoveryMultiplier", "zero") });
    state = sp.advance(at(state, 300), reference);
    assert.deepEqual(read(state).sp.recovery, { periodTicks: 15, remainingTicks: 15 });
    assert.equal(read(state).sp.value, 0);
    assert.equal(read(state).sp.lastTick, 300);
});

test("natural advancement supports a host without Vitality and leaves a LEAVING host unchanged", () => {
    const f = fixture({ sp: resource() });
    const state = sp.advance(at(f.state, 30), f.ref);
    assert.equal(read(state).sp.value, 1);
    assert.equal(read(state).sp.lastTick, 30);
    const current = getUnit(state, 1);
    const leaving = at(updateUnit(state, [{ ...current, lifecycle: "LEAVING" }]), 200);
    assert.equal(sp.advance(leaving, f.ref), leaving);
    assert.equal(read(leaving).sp.lastTick, 30);
});

test("a long natural advance stops its timer when the first pulse fills SP", () => {
    const f = fixture({ sp: resource({ initial: 1, capacity: 2, requirement: 2, cost: 2 }) });
    let state = skills.advance(at(f.state, 15), f.ref);
    assert.equal(read(state).sp.recovery.remainingTicks, 15);
    state = skills.advance(at(state, 100), f.ref);
    assert.equal(read(state).sp.value, 2);
    assert.equal(read(state).sp.recovery.remainingTicks, 30);
    state = sp.pay(state, f.ref, 2).state;
    state = skills.advance(at(state, 129), f.ref);
    assert.equal(read(state).sp.value, 0);
    state = skills.advance(at(state, 130), f.ref);
    assert.equal(read(state).sp.value, 1);
});

test("natural speed changes preserve absolute elapsed time instead of a completion fraction", () => {
    const f = fixture({ sp: resource() });
    let state = skills.advance(at(f.state, 12), f.ref);
    const currentSkill17 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill17, sp: { ...currentSkill17.sp, recoverySpeed: [
        { id: "double", value: [value({ finalScaler: 2 })] },
    ] } });
    state = skills.advance(state, f.ref);
    assert.equal(read(state).sp.recovery.periodTicks, 15);
    assert.equal(read(state).sp.recovery.remainingTicks, 3);
    state = skills.advance(at(state, 15), f.ref);
    assert.equal(read(state).sp.value, 1);
});

test("zero natural speed invalidates the timer and resumption starts a full period", () => {
    const f = fixture({ sp: resource() });
    let state = skills.advance(at(f.state, 12), f.ref);
    const currentSkill18 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill18, sp: { ...currentSkill18.sp, recoveryMultiplier: [
        { id: "zero", value: [value({ finalScaler: 0 })] },
    ] } });
    state = skills.advance(state, f.ref);
    assert.equal(read(state).sp.recovery, null);
    const currentBattle2 = at(state, 100);
    const currentSkill19 = getUnit(currentBattle2, 1).skill;
    state = setSkill(currentBattle2, { ...currentSkill19, sp: { ...currentSkill19.sp, recoveryMultiplier: [] } });
    state = skills.advance(state, f.ref);
    assert.equal(read(state).sp.recovery.remainingTicks, 30);
    state = skills.advance(at(state, 129), f.ref);
    assert.equal(read(state).sp.value, 0);
    state = skills.advance(at(state, 130), f.ref);
    assert.equal(read(state).sp.value, 1);
});

test("SP Hooks keep settled reports across nested payment and dispatch only their own business", () => {
    const seen = [];
    const f = fixture({ sp: resource({ initial: 9, capacity: 20, requirement: 10 }) });
    const currentSkill20 = getUnit(f.state, 1).skill;
    let state = setSkill(f.state, { ...currentSkill20,
        spRecovered: [
            observe("nested", (battle, { host, event }) => {
                const self = getHookHost(battle, host);

                seen.push(["first", event.previous, event.current]);
                return { state: sp.pay(battle, ref(self), 11).state, value: undefined };
            }),
            observe("after", (battle, { event }) => {
                seen.push(["after", event.previous, event.current, read(battle).sp.value]);
                return { state: battle, value: undefined };
            }),
        ],
        spPaid: [observe("payment", (battle, { event }) => {
            seen.push(["paid", event.previous, event.current]);
            return { state: battle, value: undefined };
        })],
        spModified: [observe("not-modification", () => ({ state: assert.fail("wrong resource notification"), value: undefined }))],
    });
    state = sp.recover(state, f.ref, "TIME", 2).state;
    assert.deepEqual(seen, [["first", 9, 11], ["paid", 11, 0], ["after", 9, 11, 0]]);
    assert.equal(read(state).sp.value, 0);
});

test("persistent state survives activations and activation state is initialized independently", () => {
    const f = fixture({ initialize: battle => ({ state: battle, value: ({ count: 0 }) }), sp: null,
        activation: { trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({ count: 0 }) },
    });
    let state = skills.activate(f.state, f.skillRef).state;
    const currentSkill21 = getUnit(state, 1).skill;
    state = setSkill(state, { ...currentSkill21, state: { count: 7 } });
    state = skills.finish(state, currentRef(state));
    state = skills.activate(state, f.skillRef).state;
    assert.deepEqual(read(state).state, { count: 7 });
    assert.deepEqual(read(state).activation.state, { count: 0 });
    assert.equal(read(state).activation.id, 1);
});

test("normal activation refusal allocates no identity and preserves the input state", () => {
    const f = fixture({ sp: resource() });
    const rejected = skills.activate(f.state, f.skillRef);
    assert.equal(rejected.value.type, "REJECTED");
    assert.equal(rejected.state, f.state);
    assert.equal(read(rejected.state).nextActivationId, 0);
    assert.equal(skills.activate(f.state, f.skillRef, "AUTO").value.type, "REJECTED");
});

test("definition admission rejects before payment and activation allocation", () => {
    const f = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
        accepts: () => false, onStart: () => assert.fail("rejected content must not run"),
    } });
    const rejected = skills.activate(f.state, f.skillRef);
    assert.equal(rejected.value.type, "REJECTED");
    assert.equal(rejected.state, f.state);
    assert.equal(read(rejected.state).sp.value, 2);
    assert.equal(read(rejected.state).nextActivationId, 0);
});

test("dead and leaving hosts cannot activate or recover natural SP", () => {
    const skill = definition({ sp: resource() });
    const initial = initialize({ id: 1, position: [0, 0], definition: { hooks: [], id: "dead", skill, vitality: { maxHp: 100, defense: 0, resistance: 0 } } });
    for (const unit of [
        { ...initial, vitality: { ...initial.vitality, hp: 0 } },
        { ...initial, lifecycle: "LEAVING" },
    ]) {
        const state = effectFixtureWork(unit);
        assert.equal(skills.activate(state, skillRef(unit)).value.type, "REJECTED");
        assert.equal(read(skills.advance(at(state, 300), ref(unit))).sp.value, 0);
    }
});

test("TIME ends at its deadline and INFINITE requires an explicit end", () => {
    const f = fixture();
    let state = skills.activate(f.state, f.skillRef).state;
    assert.deepEqual(read(state).activation.sustain, { type: "TIME", endsAtTick: 30 });
    state = skills.advance(at(state, 29), f.ref);
    assert.ok(read(state).activation);
    state = skills.advance(at(state, 30), f.ref);
    assert.equal(read(state).activation, null);
    const infinite = fixture({ activation: {
        trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
    } });
    state = skills.activate(infinite.state, infinite.skillRef).state;
    state = skills.advance(at(state, 1000), infinite.ref);
    assert.equal(read(state).activation.sustain.type, "INFINITE");
    assert.equal(read(skills.finish(state, currentRef(state))).activation, null);
});

test("a deployment passive can have a finite TIME duration without natural reactivation", () => {
    const f = fixture({ sp: null, activation: {
        trigger: "PASSIVE", sustain: { type: "TIME", durationTicks: 3 }, initialize: () => ({}),
    } });
    let state = skills.enter(f.state, f.ref);
    assert.equal(read(state).activation.sustain.endsAtTick, 3);
    state = skills.advance(at(state, 3), f.ref);
    assert.equal(read(state).activation, null);
    state = skills.advance(at(state, 30), f.ref);
    assert.equal(read(state).activation, null);
    assert.equal(read(state).nextActivationId, 1);
});

test("generic Action scheduling does not itself award ACTION SP", () => {
    const action = { id: "reload-like", intervalTicks: 30, speed: 100,
        initialize: battle => ({ state: battle, value: {} }),
        prepare: (battle) => ({ state: battle, value: {} }),
        onTick: (battle) => ({ state: battle, value: true }),
    };
    const unit = initialize({ id: 1, position: [0, 0], definition: {
        id: "actor", skill: definition({ sp: resource({ recovery: { type: "ACTION", amount: 1 } }) }),
        action: actionCapability(action),
    } });
    const started = startAction(effectFixtureWork(unit), actionRef(ref(unit), action));
    const battle = advanceAction(started.state, started.value.ref);
    assert.equal(read(battle).sp.value, 0);
});


test("non-TIME recovery does not evaluate natural speed or publish tick-only Unit updates", () => {
    for (const type of ["ACTION", "HIT", "NONE"]) {
        const recovery = type === "NONE" ? { type } : { type, amount: 1 };
        const f = fixture({ sp: resource({ recovery }) });
        const current = read(f.state);
        const skill = { ...current, sp: sp.setContribution(current.sp, "recoverySpeed", {
            id: "unexpected-natural-speed",
            value: () => assert.fail(`${type} must not resolve natural recovery speed`),
        }) };
        const state = at(setSkill(f.state, skill), 90);
        assert.equal(sp.advance(state, f.ref), state);
        assert.equal(read(state), skill);
        assert.equal(read(state).sp.lastTick, 0);
        assert.equal(read(state).sp.recovery, null);
    }
});
