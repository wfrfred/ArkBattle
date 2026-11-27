// Contract: [skill](../../docs/architecture/skill.md).
import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import { step } from "../../dist/core/battle/index.js";
import * as units from "../../dist/core/unit/index.js";
import * as actions from "../../dist/core/unit/capability/action/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import { create as createSkillAttack } from "../../dist/content/actions/skill.js";
import { create as modifier } from "../../dist/core/common/modifier.js";
import { update } from "../../dist/core/unit/operations.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { attribute } from "../helpers/attribute.js";

test("activation publishes payment before onStart and clears only the completed round before notification", () => {
    const observed = [];
    const initializedAtSp = [];
    const payments = [];
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { completed: 0 } }),
        sp: { initial: 30, capacity: 40, recovery: { type: "NONE" }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [],
            requirement: 20,
            cost: 10,
            initialize: (_state, _source, self) => {
                initializedAtSp.push(self.sp.value);
                return { state: { total: 3 }, duration: { type: "INFINITE" } };
            },
            onStart(state, source, self) {
                observed.push({
                    stage: "start",
                    sp: source.get(state).skill.sp.value,
                    current: skills.ref(self).get(state).ref,
                });
                return skills.setActivationState(state, skills.ref(self), {
                    total: 7,
                });
            },
            onEnd(state, source, self, skill, end) {
                const reference = skills.ref(self);
                state = skills.setActivationState(state, reference, {
                    ...self.state,
                    cleaned: true,
                });
                const current = reference.get(state);
                assert.equal(current.lifecycle, "ENDING");
                assert.equal(current.state.cleaned, true);
                observed.push({ stage: "end", total: current.state.total, end });
                return skills.setState(state, skill, {
                    completed: skill.get(state).state.completed + 1,
                });
            },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        presence: {},
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source.get(state).skill);
    state = update(state, source, units.compose(units.setHook(skills.activationStarted, {
            id: "hide-on-start", priority: 0,
            invoke: (state, { host }) => ({ state: update(state, host, presence.disappear()), value: undefined }),
        }), units.compose(units.setHook(skills.spPaid, {
            id: "observe-payment", priority: 0,
            invoke(state, { host, event }) {
                payments.push([event.amount, event.previous, event.current, skills.ref(host.get(state).skill.activation)]);
                return { state, value: undefined };
            },
        }), units.setHook(skills.activationEnded, {
            id: "observe-end", priority: 0,
            invoke(state, { host, event }) {
                observed.push({
                    stage: "notified",
                    activation: host.get(state).skill.activation,
                    ref: event.ref,
                });
                return { state, value: undefined };
            },
        }))));
    const insufficient = skills.modify(state, source, -15, false).state;
    const rejected = skills.activate(insufficient, reference, null);
    assert.equal(rejected.value, null);
    assert.equal(rejected.state, insufficient);
    assert.deepEqual(initializedAtSp, []);
    assert.deepEqual(payments, []);
    const first = skills.activate(state, reference, null);
    state = first.state;
    assert.deepEqual(initializedAtSp, [30]);
    assert.deepEqual(payments, [[10, 30, 20, first.value]]);
    assert.equal(payments[0][3], first.value);
    assert.notEqual(first.value, null);
    assert.deepEqual(observed[0], { stage: "start", sp: 20, current: first.value });
    assert.equal(observed[0].current, first.value);
    state = skills.finish(state, first.value);
    assert.deepEqual(observed.slice(1), [
        { stage: "end", total: 7, end: { type: "FINISHED" } },
        { stage: "notified", activation: null, ref: first.value },
    ]);
    assert.equal(observed[2].ref, first.value);
    assert.equal(reference.get(state).state.completed, 1);
    assert.throws(() => skills.setActivationState(state, first.value, { total: 0 }), RangeError);

    assert.equal(skills.activate(state, reference, null).value, null);
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference, null);
    state = skills.finish(second.state, first.value);
    assert.equal(second.value.get(state).lifecycle, "ACTIVE");
    state = skills.cancel(state, second.value, "STOPPED");
    assert.equal(reference.get(state).state.completed, 2);
    assert.deepEqual(
        state.events.filter(event => event.type.startsWith("SKILL_")).map(event => event.type),
        ["SKILL_ACTIVATED", "SKILL_ENDED", "SKILL_ACTIVATED", "SKILL_ENDED"],
    );
    assert.deepEqual(initializedAtSp, [30, 20]);
    assert.equal(skills.activate(state, reference, null).value, null);
});

test("per-call activation parameters preserve ordinary policy and still require sufficient SP", () => {
    const payments = [];
    const program = {
        id: "special-start", sp: { initial: 3, capacity: 20, recovery: { type: "NONE" }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
        initialize: state => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [], requirement: 10, cost: 7,
            initialize: () => ({ state: {}, duration: { type: "INFINITE" } }),
        },
    };
    const definition = {
        id: "operator", hooks: Hooks.empty().set(skills.spPaid, {
            id: "observe-payment", priority: 0,
            invoke(state, { event }) {
                payments.push([event.amount, event.previous, event.current]);
                return { state, value: undefined };
            },
        }),
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source.get(state).skill);
    assert.equal(skills.activate(state, reference, null).value, null);
    const belowRequirement = skills.activate(state, reference, { requirement: 4, cost: 0 });
    assert.equal(belowRequirement.value, null);
    assert.equal(belowRequirement.state, state);
    const belowPayment = skills.activate(state, reference, { requirement: 0, cost: 4 });
    assert.equal(belowPayment.value, null);
    assert.equal(belowPayment.state, state);
    assert.deepEqual(payments, []);

    const free = skills.activate(state, reference, { requirement: 0, cost: 0 });
    state = free.state;
    assert.notEqual(free.value, null);
    assert.equal(get(state, 0).skill.sp.value, 3);
    assert.deepEqual(payments, [[0, 3, 3]]);
    assert.equal(reference.get(state).definition, program);
    assert.equal(program.activation.requirement, 10);
    assert.equal(program.activation.cost, 7);
    state = skills.finish(state, free.value);
    assert.equal(skills.activate(state, reference, null).value, null);
    state = skills.modify(state, source, 7, false).state;
    const ordinary = skills.activate(state, reference, null);
    assert.notEqual(ordinary.value, null);
    assert.equal(get(ordinary.state, 0).skill.sp.value, 3);
    assert.deepEqual(payments[1], [7, 10, 3]);
});

test("cancellation during payment notification retains payment and suppresses the old onStart", () => {
    const program = {
        id: "skill",
        initialize: (state) => ({ state, value: { started: false } }),
        sp: { initial: 10, capacity: 10, recovery: { type: "NONE" }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [],
            requirement: 10,
            cost: 10,
            initialize: () => ({ state: {}, duration: { type: "INFINITE" } }),
            onStart: (state, _source, _self, skill) =>
                skills.setState(state, skill, { started: true }),
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    state = update(state, source, units.setHook(skills.spPaid, {
            id: "stop", priority: 0,
            invoke(state, { host }) {
                const current = host.get(state).skill.activation;
                return {
                    state: skills.cancel(state, skills.ref(current), "STOPPED"),
                    value: undefined,
                };
            },
        }));
    const activated = skills.activate(state, skills.ref(source.get(state).skill), null);
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
            trigger: "MANUAL", ignoreRestrictions: [],
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
                    return skills.setActivationState(state, skills.ref(self), {
                        ready: true,
                    });
                },
                STOP(state, source, self) {
                    return skills.finish(state, skills.ref(self));
                },
            },
        },
    };
    let state = battle([ordinary, controlled].map((program) => ({
        definition: {
            id: program.id,
            hooks: Hooks.empty(),
            skill: { definition: program },
        }, hooks: Hooks.empty(), initial: {},
        position: [1, 1],
    })));
    const source = units.ref(get(state, 0));
    const first = skills.activate(state, skills.ref(source.get(state).skill), null);
    state = first.state;
    const unsupported = skills.operate(state, first.value, "STOP");
    assert.equal(unsupported.value, false);
    assert.equal(unsupported.state, state);
    state = skills.finish(state, first.value);
    assert.equal(get(state, 0).skill.activation, null);

    const controlledSource = units.ref(get(state, 1));
    const second = skills.activate(state, skills.ref(controlledSource.get(state).skill), null);
    state = update(second.state, controlledSource, skills.setRestriction("operationRestrictions", {
        id: "not-ready", group: null,
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
    assert.equal(second.value.get(state).state.ready, true);
    const stopped = skills.operate(state, second.value, "STOP");
    assert.equal(stopped.value, true);
    assert.equal(get(stopped.state, 1).skill.activation, null);

    const command = operation => ({ type: "SKILL", ref: controlledSource, operation });
    const commandStarted = step(stopped.state, [command("STOP"), command("ACTIVATE"), command("RETRIGGER")]);
    assert.equal(get(commandStarted, 1).skill.activation.state.ready, true);
    const commandStopped = step(commandStarted, [command("STOP"), command("RETRIGGER")]);
    assert.equal(get(commandStopped, 1).skill.activation, null);
});

test("natural SP recovery pauses without backlog and uses current recovery speed", () => {
    const program = {
        id: "sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: {
            initial: 1,
            capacity: 2,
            recovery: { type: "TIME" },
            recoverySpeed: attribute(7.5),
            recoveryMultiplier: attribute(1),
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    for (let i = 0; i < 4; i++) state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 2);
    for (let i = 0; i < 2; i++) state = step(state, []);
    state = update(state, source, skills.setRestriction("recoveryRestrictions", { id: "blocked", group: null, value: { allows: () => false } }));
    const payment = skills.pay(state, source, 2);
    state = payment.state;
    assert.deepEqual(payment.value, { type: "APPLIED", amount: 2 });
    assert.equal(skills.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    assert.equal(skills.modify(state, source, 1, false).value.type, "REJECTED");
    for (let i = 0; i < 5; i++) state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 0);
    state = update(state, source, skills.removeRestriction("recoveryRestrictions", "blocked"));
    for (let i = 0; i < 3; i++) state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 0);

    let stopped = update(state, source, skills.setSpContribution("recoverySpeed", {
        id: "stopped", group: null, value: [modifier({ multiplier: -1 })],
    }));
    stopped = step(stopped, []);
    let restarted = update(stopped, source, skills.removeSpContribution("recoverySpeed", "stopped"));
    for (let i = 0; i < 4; i++) restarted = step(restarted, []);
    assert.equal(get(restarted, 0).skill.sp.value, 0);
    restarted = step(restarted, []);
    assert.equal(get(restarted, 0).skill.sp.value, 1);

    state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 1);

    state = update(state, source, skills.setSpContribution("recoverySpeed", {
            id: "haste", group: null,
            value: [modifier({ multiplier: 1 })],
        }));
    state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 1);
    state = step(state, []);
    assert.equal(get(state, 0).skill.sp.value, 2);
    assert.equal(skills.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    state = skills.modify(state, source, -1, false).state;
    assert.equal(skills.recover(state, source, "EXTERNAL", 5).value.amount, 1);
});

test("TIME extension stays in its round while persistent state selects a later INFINITE duration", () => {
    const program = {
        id: "timed",
        sp: null,
        initialize: (state) => ({ state, value: { completed: 0 } }),
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [],
            requirement: 0,
            cost: 0,
            initialize: (_state, _source, self) => ({
                state: { ticks: 0 },
                duration: self.state.completed === 0
                    ? { type: "TIME", durationTicks: 5 }
                    : { type: "INFINITE" },
            }),
            onTick(state, source, self) {
                return skills.setActivationState(state, skills.ref(self), {
                    ticks: self.state.ticks + 1,
                });
            },
            onEnd(state, _source, _self, skill) {
                return skills.setState(state, skill, {
                    completed: skill.get(state).state.completed + 1,
                });
            },
        },
    };
    const definition = {
        id: "operator",
        hooks: Hooks.empty(),
        presence: {},
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source.get(state).skill);
    const first = skills.activate(state, reference, null);
    state = skills.extendTime(step(step(first.state, []), []), first.value, 3);
    state = update(state, source, presence.disappear());
    while (state.tick <= 5) state = step(state, []);
    assert.equal(first.value.get(state).duration.endsAtTick, 8);
    assert.equal(first.value.get(state).state.ticks, 6);
    while (state.tick <= 8) state = step(state, []);
    assert.equal(get(state, 0).skill.activation, null);
    state = update(state, source, presence.appear([1, 1]));
    const second = skills.activate(state, reference, null);
    state = second.state;
    while (state.tick <= 15) state = step(state, []);
    assert.deepEqual(second.value.get(state).duration, { type: "INFINITE" });
});

test("AMMO samples its charged base before payment and applies capacity, consumption, refill and exhaustion policies", () => {
    const replenishments = [];
    const program = {
        id: "ammo",
        sp: { initial: 2, capacity: 2, recovery: { type: "NONE" }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
        initialize: (state) => ({ state, value: {} }),
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [],
            requirement: 1,
            cost: 1,
            initialize: (_state, _source, self) => ({
                state: { charged: self.sp.value === 2 },
                duration: { type: "AMMO", amount: self.sp.value === 2 ? 20 : 8 },
            }),
        },
    };
    const attack = createSkillAttack({
        id: "last-shot", ammoPerAction: 1, followUps: [],
        period: { type: "FIXED", ticks: 1 },
        timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 },
        triggerBindingId: "self",
        targetGroups: [{
            id: "self", select: (state, source) => ({ state, value: [source] }), operations: [],
        }],
        afterOutput(state, source) {
            const activation = source.get(state).skill.activation;
            if (activation.duration.remaining > 0) {
                return state;
            }
            state = skills.check(state, skills.ref(activation));
            return skills.activate(state, skills.ref(source.get(state).skill), null).state;
        },
    });
    const definition = {
        id: "operator",
        hooks: Hooks.empty().set(skills.ammoReplenished, {
            id: "observe-refill", priority: 0,
            invoke(state, { event }) {
                replenishments.push(event);
                assert.deepEqual(event.ref.get(state).duration, event.current);
                return { state, value: undefined };
            },
        }),
        action: {
            speed: attribute(100), interval: attribute(1), definitions: [attack],
            select: state => ({ state, value: [] }),
        },
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source.get(state).skill);
    state = update(state, source, skills.setAmmoContribution({
            id: "magazine", group: null,
            value: [{ addition: 2, ratio: 0.5 }],
        }));
    const first = skills.activate(state, reference, null);
    state = update(first.state, source, skills.removeAmmoContribution("magazine"));
    assert.equal(first.value.get(state).duration.initial, 32);
    assert.equal(first.value.get(state).state.charged, true);
    assert.equal(get(state, 0).skill.sp.value, 1);
    assert.equal(skills.resolveAmmoCapacity(5, [{ addition: 0, ratio: 0.5 }]), 7);
    state = skills.consume(state, first.value, 32).state;
    assert.equal(first.value.get(state).duration.remaining, 0);
    let restored = skills.replenish(state, first.value, 40);
    state = restored.state;
    assert.equal(restored.value.amount, 32);
    assert.deepEqual(replenishments, [{
        ref: first.value, requested: 40, amount: 32,
        previous: { type: "AMMO", initial: 32, remaining: 0, replenished: 0 },
        current: { type: "AMMO", initial: 32, remaining: 32, replenished: 32 },
    }]);
    state = skills.consume(state, first.value, 32).state;
    restored = skills.replenish(state, first.value, 1);
    state = restored.state;
    assert.equal(restored.value.amount, 0);
    state = skills.grant(state, first.value, 1).state;
    assert.equal(first.value.get(state).duration.replenished, 32);
    state = skills.consume(state, first.value).state;
    const fired = actions.start(state, actions.ref(source.get(state).action.actions.get(attack)));
    state = step(fired.state, []);
    assert.equal(first.value.get(state), undefined);
    assert.equal(get(state, 0).skill.activation.duration.remaining, 8);
    const nextShot = actions.start(state, actions.ref(source.get(state).action.actions.get(attack)));
    state = step(nextShot.state, []);
    assert.equal(get(state, 0).skill.activation.duration.remaining, 7);
});

test("Ammo contributions registered and withdrawn during TIME affect only later AMMO durations", () => {
    const program = {
        id: "changing-duration",
        sp: null,
        initialize: state => ({ state, value: { ammo: false } }),
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [], requirement: 0, cost: 0,
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
        skill: { definition: program },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = skills.ref(source.get(state).skill);
    const timed = skills.activate(state, reference, null);
    state = update(timed.state, source, units.compose(
        skills.setAmmoContribution({ id: "kept", group: null, value: [{ addition: 0, ratio: 0.5 }] }),
        skills.setAmmoContribution({ id: "withdrawn", group: null, value: [{ addition: 7, ratio: 0 }] }),
    ));
    state = update(state, source, skills.removeAmmoContribution("withdrawn"));
    assert.deepEqual(timed.value.get(state).duration, { type: "TIME", endsAtTick: 5 });
    state = skills.finish(state, timed.value);
    state = skills.setState(state, reference, { ammo: true });
    const ammo = skills.activate(state, reference, null);
    assert.equal(ammo.value.get(ammo.state).duration.initial, 15);
});
