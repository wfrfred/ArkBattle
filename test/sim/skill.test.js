import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import * as skill from "../../dist/core/unit/capability/skill/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { update } from "../../dist/core/battle/unit.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";

test("activation publishes payment before onStart and clears only the completed round before notification", () => {
    const observed = [];
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { completed: 0 } }),
        sp: { initial: 30, capacity: 40, requirement: 20, cost: 10, recovery: { type: "NONE" } },
        activation: {
            trigger: "MANUAL",
            sustain: { type: "INFINITE" },
            initialize: () => ({ total: 3 }),
            onStart(state, source, self) {
                observed.push({
                    stage: "start",
                    sp: get(state, source.id).skill.sp.value,
                    current: skills.getActivation(state, skills.activationRef(source, self))
                        .activation.id,
                });
                return skills.setActivationState(state, skills.activationRef(source, self), {
                    total: 7,
                });
            },
            onEnd(state, source, self, end) {
                observed.push({ stage: "end", total: self.activation.state.total, end });
                return skills.setState(state, skills.ref(source, program), {
                    completed: self.state.completed + 1,
                });
            },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        spatialPresence: {},
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    state = update(state, source, units.compose(skill.setHook("activationStarted", {
            id: "hide-on-start",
            invoke: (state, { host }) => ({ state: update(state, host, presence.disappear()), value: undefined }),
        }), skill.setHook("activationEnded", {
            id: "observe-end",
            invoke(state, { host, event }) {
                observed.push({
                    stage: "notified",
                    activation: get(state, host.id).skill.activation,
                    id: event.ref.id,
                });
                return { state, value: undefined };
            },
        })));
    const first = skills.activate(state, reference);
    state = first.state;
    assert.equal(first.value.type, "ACTIVATED");
    assert.deepEqual(observed[0], { stage: "start", sp: 20, current: first.value.ref.id });
    state = skills.finish(state, first.value.ref);
    assert.deepEqual(observed.slice(1), [
        { stage: "end", total: 7, end: { type: "FINISHED" } },
        { stage: "notified", activation: null, id: first.value.ref.id },
    ]);
    assert.equal(skills.getSkill(state, reference).state.completed, 1);

    assert.equal(skills.activate(state, reference).value.reason, "CONDITION");
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference);
    state = skills.finish(second.state, first.value.ref);
    assert.equal(skills.getActivation(state, second.value.ref).activation.status, "ACTIVE");
    state = skills.cancel(state, second.value.ref, "STOPPED");
    assert.equal(get(state, 0).skill.sp.value, 10);
    assert.equal(skills.getSkill(state, reference).state.completed, 2);
    assert.equal(skills.activate(state, reference).value.type, "REJECTED");
});

test("cancellation during payment notification retains payment and suppresses the old onStart", () => {
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { started: false } }),
        sp: { initial: 10, capacity: 10, requirement: 10, recovery: { type: "NONE" } },
        activation: {
            trigger: "MANUAL",
            sustain: { type: "INFINITE" },
            initialize: () => ({}),
            onStart: (state, source) =>
                skills.setState(state, skills.ref(source, program), { started: true }),
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    state = update(state, source, skill.setHook("spPaid", {
            id: "stop",
            invoke(state, { host }) {
                const current = get(state, host.id).skill;
                return {
                    state: skills.cancel(state, skills.activationRef(host, current), "STOPPED"),
                    value: undefined,
                };
            },
        }));
    const activated = skills.activate(state, skills.ref(source, program));
    state = activated.state;
    assert.equal(get(state, 0).skill.sp.value, 0);
    assert.equal(get(state, 0).skill.activation, null);
    assert.equal(get(state, 0).skill.state.started, false);
});

test("natural SP recovery pauses without backlog and uses current recovery speed", () => {
    const program = {
        id: "sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: {
            initial: 2,
            capacity: 2,
            requirement: 1,
            cost: 1,
            recovery: { type: "TIME", intervalTicks: 4 },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    for (let tick = 0; tick <= 5; tick++) state = skills.advance({ ...state, tick }, source);
    state = update(state, source, skill.setRule("recoveryRules", { id: "blocked", allows: () => false }));
    const payment = skills.pay(state, source, 2);
    state = payment.state;
    assert.deepEqual(payment.value, { type: "APPLIED", amount: 2 });
    assert.equal(skills.recover(state, source, "EXTERNAL", 1).value.reason, "RULE");
    assert.equal(skills.modify(state, source, 1).value.reason, "RULE");
    for (let tick = 6; tick <= 10; tick++) state = skills.advance({ ...state, tick }, source);
    assert.equal(get(state, 0).skill.sp.value, 0);
    state = update(state, source, skill.removeRule("recoveryRules", "blocked"));
    for (let tick = 11; tick <= 13; tick++) state = skills.advance({ ...state, tick }, source);
    assert.equal(get(state, 0).skill.sp.value, 0);
    state = skills.advance({ ...state, tick: 14 }, source);
    assert.equal(get(state, 0).skill.sp.value, 1);

    state = update(state, source, skills.setSpContribution("recoverySpeed", {
            id: "haste",
            value: [modifier({ multiplier: 1 })],
        }));
    state = skills.advance({ ...state, tick: 15 }, source);
    assert.equal(get(state, 0).skill.sp.value, 1);
    state = skills.advance({ ...state, tick: 16 }, source);
    assert.equal(get(state, 0).skill.sp.value, 2);
    assert.deepEqual(skills.recover(state, source, "EXTERNAL", 1).value, {
        type: "REJECTED",
        reason: "FULL",
    });
    state = skills.modify(state, source, -1).state;
    assert.equal(skills.recover(state, source, "EXTERNAL", 5).value.amount, 1);
});

test("TIME extension changes this activation rather than the next activation's budget", () => {
    const program = {
        id: "timed",
        sp: null,
        initialize: (state) => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL",
            sustain: { type: "TIME", durationTicks: 5 },
            initialize: () => ({ ticks: 0 }),
            onTick(state, source, self) {
                return skills.setActivationState(state, skills.activationRef(source, self), {
                    ticks: self.activation.state.ticks + 1,
                });
            },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        spatialPresence: {},
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    const first = skills.activate(state, reference);
    state = skills.extendTime({ ...first.state, tick: 2 }, first.value.ref, 3);
    state = update(state, source, presence.disappear());
    state = skills.advance({ ...state, tick: 5 }, source);
    assert.equal(skills.getActivation(state, first.value.ref).activation.sustain.endsAtTick, 8);
    assert.equal(skills.getActivation(state, first.value.ref).activation.state.ticks, 1);
    state = skills.advance({ ...state, tick: 8 }, source);
    assert.equal(get(state, 0).skill.activation, null);
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference);
    state = skills.extendTime(second.state, first.value.ref, 10);
    assert.equal(skills.getActivation(state, second.value.ref).activation.sustain.endsAtTick, 13);
});

test("AMMO samples its own capacity formula and distinguishes consumption, refill quota, grants, and exhaustion", () => {
    const program = {
        id: "ammo",
        sp: null,
        initialize: (state) => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL",
            sustain: { type: "AMMO", amount: 10 },
            initialize: () => ({}),
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    state = update(state, source, skill.setAmmoContribution({
            id: "magazine",
            value: [{ addition: 2, ratio: 0.5 }],
        }));
    const first = skills.activate(state, reference);
    state = update(first.state, source, skill.removeAmmoContribution("magazine"));
    assert.equal(skills.getActivation(state, first.value.ref).activation.sustain.initial, 17);
    assert.equal(skills.resolveAmmoCapacity(5, [{ addition: 0, ratio: 0.5 }]), 7);
    state = skills.consume(state, first.value.ref, 17).state;
    assert.equal(skills.getActivation(state, first.value.ref).activation.sustain.remaining, 0);
    let restored = skills.replenish(state, first.value.ref, 30);
    state = restored.state;
    assert.equal(restored.value.amount, 17);
    state = skills.consume(state, first.value.ref, 17).state;
    restored = skills.replenish(state, first.value.ref, 1);
    state = restored.state;
    assert.equal(restored.value.amount, 0);
    state = skills.grant(state, first.value.ref, 1).state;
    assert.equal(skills.getActivation(state, first.value.ref).activation.sustain.replenished, 17);
    state = skills.consume(state, first.value.ref).state;
    state = skills.check(state, first.value.ref);
    assert.equal(get(state, 0).skill.activation, null);
    const second = skills.activate(state, reference);
    state = skills.consume(second.state, first.value.ref).state;
    assert.equal(skills.getActivation(state, second.value.ref).activation.sustain.remaining, 10);
});
