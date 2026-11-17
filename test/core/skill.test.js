// Contract: [skill](../../docs/architecture/skill.md).
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
    const initializedAtSp = [];
    const payments = [];
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { completed: 0 } }),
        sp: { initial: 30, capacity: 40, recovery: { type: "NONE" } },
        activation: {
            trigger: "MANUAL",
            requirement: 20,
            cost: 10,
            initialize: (_state, _source, self) => {
                initializedAtSp.push(self.sp.value);
                return { state: { total: 3 }, duration: { type: "INFINITE" } };
            },
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
        presence: {},
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    state = update(state, source, units.compose(units.setHook(skill.activationStarted, {
            id: "hide-on-start",
            invoke: (state, { host }) => ({ state: update(state, host, presence.disappear()), value: undefined }),
        }), units.compose(units.setHook(skill.spPaid, {
            id: "observe-payment",
            invoke(state, { host, event }) {
                payments.push([event.amount, event.previous, event.current, get(state, host.id).skill.activation.id]);
                return { state, value: undefined };
            },
        }), units.setHook(skill.activationEnded, {
            id: "observe-end",
            invoke(state, { host, event }) {
                observed.push({
                    stage: "notified",
                    activation: get(state, host.id).skill.activation,
                    id: event.ref.id,
                });
                return { state, value: undefined };
            },
        }))));
    const insufficient = skills.modify(state, source, -15).state;
    const rejected = skills.activate(insufficient, reference);
    assert.equal(rejected.value, null);
    assert.equal(rejected.state, insufficient);
    assert.deepEqual(initializedAtSp, []);
    assert.deepEqual(payments, []);
    const first = skills.activate(state, reference);
    state = first.state;
    assert.deepEqual(initializedAtSp, [30]);
    assert.deepEqual(payments, [[10, 30, 20, first.value.id]]);
    assert.notEqual(first.value, null);
    assert.deepEqual(observed[0], { stage: "start", sp: 20, current: first.value.id });
    state = skills.finish(state, first.value);
    assert.deepEqual(observed.slice(1), [
        { stage: "end", total: 7, end: { type: "FINISHED" } },
        { stage: "notified", activation: null, id: first.value.id },
    ]);
    assert.equal(skills.getSkill(state, reference).state.completed, 1);

    assert.equal(skills.activate(state, reference).value, null);
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference);
    state = skills.finish(second.state, first.value);
    assert.equal(skills.getActivation(state, second.value).activation.lifecycle, "ACTIVE");
    state = skills.cancel(state, second.value, "STOPPED");
    assert.equal(skills.getSkill(state, reference).state.completed, 2);
    assert.deepEqual(initializedAtSp, [30, 20]);
    assert.equal(skills.activate(state, reference).value, null);
});

test("cancellation during payment notification retains payment and suppresses the old onStart", () => {
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { started: false } }),
        sp: { initial: 10, capacity: 10, recovery: { type: "NONE" } },
        activation: {
            trigger: "MANUAL",
            requirement: 10,
            cost: 10,
            initialize: () => ({ state: {}, duration: { type: "INFINITE" } }),
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
    state = update(state, source, units.setHook(skill.spPaid, {
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
    assert.notEqual(activated.value, null);
    assert.equal(get(state, 0).skill.sp.value, 0);
    assert.equal(get(state, 0).skill.activation, null);
    assert.equal(get(state, 0).skill.state.started, false);
});

test("active operations require a declared handler and current permission, while acceptance and ending are independent", () => {
    const ordinary = {
        id: "ordinary",
        sp: null,
        initialize: (state) => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL",
            requirement: 0,
            cost: 0,
            initialize: () => ({ state: { ready: false }, duration: { type: "INFINITE" } }),
        },
    };
    const controlled = {
        ...ordinary,
        id: "controlled",
        activation: {
            ...ordinary.activation,
            operations: {
                RETRIGGER(state, source, self) {
                    return skills.setActivationState(state, skills.activationRef(source, self), {
                        ready: true,
                    });
                },
                STOP(state, source, self) {
                    return skills.finish(state, skills.activationRef(source, self));
                },
            },
        },
    };
    let state = battle([ordinary, controlled].map((program) => ({
        definition: {
            id: program.id,
            hooks: Hooks.empty(),
            skill: { initialize: (state) => skills.create(state, program) },
        },
        position: [1, 1],
    })));
    const source = units.ref(get(state, 0));
    const first = skills.activate(state, skills.ref(source, ordinary));
    state = first.state;
    const unsupported = skills.operate(state, first.value, "STOP");
    assert.equal(unsupported.value, false);
    assert.equal(unsupported.state, state);
    state = skills.finish(state, first.value);
    assert.equal(get(state, 0).skill.activation, null);

    const controlledSource = units.ref(get(state, 1));
    const second = skills.activate(state, skills.ref(controlledSource, controlled));
    state = update(second.state, controlledSource, skill.setRestriction("operationRestrictions", {
        id: "not-ready",
        value: {
            allows: (_state, { self, operation }) =>
                operation !== "STOP" || self.skill.activation.state.ready,
        },
    }));
    const denied = skills.operate(state, second.value, "STOP");
    assert.equal(denied.value, false);
    assert.equal(denied.state, state);
    const retriggered = skills.operate(state, second.value, "RETRIGGER");
    state = retriggered.state;
    assert.equal(retriggered.value, true);
    assert.equal(skills.getActivation(state, second.value).activation.state.ready, true);
    const stopped = skills.operate(state, second.value, "STOP");
    assert.equal(stopped.value, true);
    assert.equal(get(stopped.state, 1).skill.activation, null);
});

test("natural SP recovery pauses without backlog and uses current recovery speed", () => {
    const program = {
        id: "sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: {
            initial: 2,
            capacity: 2,
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
    state = update(state, source, skill.setRestriction("recoveryRestrictions", { id: "blocked", value: { allows: () => false } }));
    const payment = skills.pay(state, source, 2);
    state = payment.state;
    assert.deepEqual(payment.value, { type: "APPLIED", amount: 2 });
    assert.equal(skills.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    assert.equal(skills.modify(state, source, 1).value.type, "REJECTED");
    for (let tick = 6; tick <= 10; tick++) state = skills.advance({ ...state, tick }, source);
    assert.equal(get(state, 0).skill.sp.value, 0);
    state = update(state, source, skill.removeRestriction("recoveryRestrictions", "blocked"));
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
    assert.equal(skills.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    state = skills.modify(state, source, -1).state;
    assert.equal(skills.recover(state, source, "EXTERNAL", 5).value.amount, 1);
});

test("TIME extension stays in its round while persistent state selects a later INFINITE duration", () => {
    const program = {
        id: "timed",
        sp: null,
        initialize: (state) => ({ state, value: { completed: 0 } }),
        activation: {
            trigger: "MANUAL",
            requirement: 0,
            cost: 0,
            initialize: (_state, _source, self) => ({
                state: { ticks: 0 },
                duration: self.state.completed === 0
                    ? { type: "TIME", durationTicks: 5 }
                    : { type: "INFINITE" },
            }),
            onTick(state, source, self) {
                return skills.setActivationState(state, skills.activationRef(source, self), {
                    ticks: self.activation.state.ticks + 1,
                });
            },
            onEnd(state, source, self) {
                return skills.setState(state, skills.ref(source, program), {
                    completed: self.state.completed + 1,
                });
            },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        presence: {},
        skill: { initialize: (state) => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    const first = skills.activate(state, reference);
    state = skills.extendTime({ ...first.state, tick: 2 }, first.value, 3);
    state = update(state, source, presence.disappear());
    state = skills.advance({ ...state, tick: 5 }, source);
    assert.equal(skills.getActivation(state, first.value).activation.duration.endsAtTick, 8);
    assert.equal(skills.getActivation(state, first.value).activation.state.ticks, 1);
    state = skills.advance({ ...state, tick: 8 }, source);
    assert.equal(get(state, 0).skill.activation, null);
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference);
    state = skills.extendTime(second.state, first.value, 10);
    assert.deepEqual(skills.getActivation(state, second.value).activation.duration, { type: "INFINITE" });
    state = skills.advance({ ...state, tick: 100 }, source);
    assert.notEqual(skills.getActivation(state, second.value), undefined);
});

test("AMMO samples its charged base before payment and applies capacity, consumption, refill and exhaustion policies", () => {
    const program = {
        id: "ammo",
        sp: { initial: 2, capacity: 2, recovery: { type: "NONE" } },
        initialize: (state) => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL",
            requirement: 1,
            cost: 1,
            initialize: (_state, _source, self) => ({
                state: { charged: self.sp.value === 2 },
                duration: { type: "AMMO", amount: self.sp.value === 2 ? 20 : 8 },
            }),
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
    assert.equal(skills.getActivation(state, first.value).activation.duration.initial, 32);
    assert.equal(skills.getActivation(state, first.value).activation.state.charged, true);
    assert.equal(get(state, 0).skill.sp.value, 1);
    assert.equal(skills.resolveAmmoCapacity(5, [{ addition: 0, ratio: 0.5 }]), 7);
    state = skills.consume(state, first.value, 32).state;
    assert.equal(skills.getActivation(state, first.value).activation.duration.remaining, 0);
    let restored = skills.replenish(state, first.value, 40);
    state = restored.state;
    assert.equal(restored.value.amount, 32);
    state = skills.consume(state, first.value, 32).state;
    restored = skills.replenish(state, first.value, 1);
    state = restored.state;
    assert.equal(restored.value.amount, 0);
    state = skills.grant(state, first.value, 1).state;
    assert.equal(skills.getActivation(state, first.value).activation.duration.replenished, 32);
    state = skills.consume(state, first.value).state;
    state = skills.check(state, first.value);
    assert.equal(get(state, 0).skill.activation, null);
    const second = skills.activate(state, reference);
    state = skills.consume(second.state, first.value).state;
    assert.equal(skills.getActivation(state, second.value).activation.duration.remaining, 8);
});

test("Ammo contributions registered and withdrawn during TIME affect only later AMMO durations", () => {
    const program = {
        id: "changing-duration",
        sp: null,
        initialize: state => ({ state, value: { ammo: false } }),
        activation: {
            trigger: "MANUAL", requirement: 0, cost: 0,
            initialize: (_state, _source, self) => ({
                state: {},
                duration: self.state.ammo
                    ? { type: "AMMO", amount: 10 }
                    : { type: "TIME", durationTicks: 5 },
            }),
        },
    };
    const definition = {
        id: "operator", hooks: Hooks.empty(),
        skill: { initialize: state => skills.create(state, program) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source, program);
    const timed = skills.activate(state, reference);
    state = update(timed.state, source, units.compose(
        skill.setAmmoContribution({ id: "kept", value: [{ addition: 0, ratio: 0.5 }] }),
        skill.setAmmoContribution({ id: "withdrawn", value: [{ addition: 7, ratio: 0 }] }),
    ));
    state = update(state, source, skill.removeAmmoContribution("withdrawn"));
    assert.deepEqual(skills.getActivation(state, timed.value).activation.duration, { type: "TIME", endsAtTick: 5 });
    state = skills.finish(state, timed.value);
    state = skills.setState(state, reference, { ammo: true });
    const ammo = skills.activate(state, reference);
    assert.equal(skills.getActivation(ammo.state, ammo.value).activation.duration.initial, 15);
});
