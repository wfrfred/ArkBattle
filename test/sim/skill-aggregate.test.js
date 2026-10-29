import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit, fixtureBattle } from "../helpers/unit.js";
import { create, getSkill, getActivation, setState, setActivationState, ref, activationRef } from "../../dist/core/unit/skill/index.js";
import { initialize as initializeCapability } from "../../dist/core/unit/capability/skill/capability.js";
import { initialize as initializeUnit } from "../../dist/core/unit/index.js";
import * as operations from "../../dist/core/unit/skill/operations.js";
import * as sp from "../../dist/core/unit/skill/sp.js";
import { remove } from "../../dist/core/battle/unit.js";
import { fixture, definition, at } from "../helpers/skill.js";

test("Skill creation validates direct Definitions before running their initializer", () => {
    const battle = fixtureBattle(0);
    let initialized = false;
    const program = definition({
        initialize: state => {
            initialized = true;
            return { state, value: {} };
        },
    });
    const invalid = [
        { ...program, id: "" },
        { ...program, sp: { ...program.sp, initial: -1 } },
        { ...program, sp: { ...program.sp, initial: program.sp.capacity + 1 } },
        { ...program, activation: { ...program.activation, sustain: { type: "TIME", durationTicks: -1 } } },
        { ...program, activation: { ...program.activation, sustain: { type: "AMMO", amount: 0.5 } } },
    ];
    for (const candidate of invalid) {
        assert.throws(() => create(battle, candidate));
        assert.equal(initialized, false);
    }
});

test("Skill creation threads its initialization battle through capability and Unit creation before starting SP clocks", () => {
    const battle = fixtureBattle(11);
    const program = definition({
        initialize: current => ({
            state: { ...current, tick: 18, execution: { ...current.execution, rngState: 99 } },
            value: { count: 3 },
        }),
    });
    const factory = { initialize: current => create(current, program) };
    const created = create(battle, program);
    const capability = initializeCapability(battle, factory);
    const initialized = initializeUnit(battle, {
        id: 1, position: [0, 0], definition: { id: "threaded-skill", hooks: [], skill: factory },
    });
    for (const result of [created, capability, initialized]) {
        assert.equal(result.state.tick, 18);
        assert.equal(result.state.execution.rngState, 99);
    }
    for (const skill of [created.value, capability.value, initialized.value.skill]) {
        assert.equal(skill.definition, program);
        assert.deepEqual(skill.state, { count: 3 });
        assert.equal(skill.sp.lastTick, 18);
        assert.equal(skill.activation, null);
    }
    assert.equal(battle.tick, 11);
});

test("Skill programs receive persistent state and activation state in one aggregate with an explicit source", () => {
    const observed = [];
    const f = fixture({
        sp: null,
        initialize: battle => ({ state: battle, value: { count: 0 } }),
        onEnter(battle, source, self) {
            assert.equal(self.definition, f.definition);
            assert.equal(source.id, f.unit.id);
            return setState(battle, ref(source, self.definition), { count: self.state.count + 1 });
        },
        onTick(battle, source, self) {
            return setState(battle, ref(source, self.definition), { count: self.state.count + 1 });
        },
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" },
            initialize: (_battle, _source, self) => ({ sampled: self.state.count }),
            onStart(battle, source, self) {
                observed.push([self.activation.id, self.activation.state.sampled]);
                assert.equal(getActivation(battle, activationRef(source, self)), getSkill(battle, f.skillRef));
                return battle;
            },
        },
    });
    let battle = operations.enter(f.state, f.ref);
    const first = operations.activate(battle, f.skillRef);
    battle = operations.finish(first.state, first.value.ref);
    battle = operations.advance(at(battle, 1), f.ref);
    const second = operations.activate(battle, f.skillRef);
    assert.deepEqual(observed, [[0, 1], [1, 2]]);
    assert.deepEqual(getUnit(second.state, f.unit.id).skill.state, { count: 2 });
    assert.deepEqual(f.unit.skill.state, { count: 0 });
});

test("a persistent Skill Ref requires its configured Definition and survives successive activations", () => {
    const f = fixture({
        initialize: battle => ({ state: battle, value: { count: 1 } }), sp: null,
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
            onStart(battle, source, self) {
                return setState(battle, ref(source, self.definition), { count: self.state.count + 1 });
            },
        },
    });
    const started = operations.activate(f.state, f.skillRef);
    const other = definition({ id: f.definition.id });
    assert.notEqual(other, f.definition);
    assert.equal(getSkill(started.state, ref(f.ref, other)), undefined);
    assert.deepEqual(getSkill(started.state, f.skillRef).state, { count: 2 });
    assert.equal(getActivation(started.state, started.value.ref), getSkill(started.state, f.skillRef));
    const finished = operations.finish(started.state, started.value.ref);
    assert.equal(getActivation(finished, started.value.ref), undefined);
    assert.deepEqual(getSkill(finished, f.skillRef).state, { count: 2 });
    const next = operations.activate(finished, f.skillRef);
    assert.notEqual(next.value.ref.id, started.value.ref.id);
    assert.deepEqual(getSkill(next.state, f.skillRef).state, { count: 3 });
});

test("Activation state writes preserve the latest duration and reject a previous identity", () => {
    const f = fixture({ sp: null });
    const first = operations.activate(f.state, f.skillRef);
    const active = getActivation(first.state, first.value.ref);
    const extended = operations.extendTime(first.state, first.value.ref, 15);
    const updated = setActivationState(extended, first.value.ref, { count: 2 });
    const current = getActivation(updated, first.value.ref);
    assert.deepEqual(current.activation.state, { count: 2 });
    assert.equal(current.activation.sustain, getActivation(extended, first.value.ref).activation.sustain);
    assert.equal(current.activation.sustain.endsAtTick, 45);
    assert.equal(current.activation.id, active.activation.id);
    assert.equal(current.activation.startedAtTick, active.activation.startedAtTick);
    assert.equal(setActivationState(updated, first.value.ref, current.activation.state), updated);
    assert.deepEqual(active.activation.state, {});
    assert.equal(active.activation.sustain.endsAtTick, 30);
    const finished = operations.finish(updated, first.value.ref);
    const second = operations.activate(finished, f.skillRef);
    assert.notEqual(first.value.ref.id, second.value.ref.id);
    assert.throws(() => setActivationState(second.state, first.value.ref, { count: 9 }), /unknown skill activation/);
    assert.deepEqual(getActivation(second.state, second.value.ref).activation.state, {});
});

test("persistent state writes preserve fresh SP and Activation rather than restoring a sampled aggregate", () => {
    const f = fixture({
        initialize: battle => ({ state: battle, value: { count: 0 } }),
        sp: { initial: 4, capacity: 8, requirement: 1, cost: 1, recovery: { type: "NONE" } },
    });
    const sampled = getSkill(f.state, f.skillRef);
    const charged = sp.modify(f.state, f.ref, 2, true).state;
    const started = operations.activate(charged, f.skillRef);
    const before = getUnit(started.state, f.ref.id).skill;
    const persistentState = { count: 1 };
    const updated = setState(started.state, f.skillRef, persistentState);
    const current = getUnit(updated, f.ref.id).skill;
    assert.equal(current.state, persistentState);
    assert.equal(current.sp, before.sp);
    assert.equal(current.sp.value, 5);
    assert.equal(current.activation, before.activation);
    assert.equal(current.nextActivationId, 1);
    assert.equal(current.rules, before.rules);
    assert.equal(setState(updated, f.skillRef, persistentState), updated);
    assert.deepEqual(sampled.state, { count: 0 });
    assert.equal(sampled.sp.value, 4);
    assert.equal(sampled.activation, null);
});

test("ending callbacks may write persistent state while ordinary Activation writes remain closed", () => {
    let saved;
    const f = fixture({
        initialize: battle => ({ state: battle, value: { count: 0 } }), sp: null,
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
            onEnd(battle, source, self) {
                saved = ref(source, self.definition);
                assert.throws(() => setActivationState(battle, activationRef(source, self), { count: 1 }), /ending skill activation/);
                return setState(battle, saved, { count: self.state.count + 1 });
            },
        },
    });
    const started = operations.activate(f.state, f.skillRef);
    const finished = operations.finish(started.state, started.value.ref);
    assert.deepEqual(getUnit(finished, f.ref.id).skill.state, { count: 1 });
    const removed = remove(finished, f.ref.id, "SCRIPT");
    assert.throws(() => setState(removed, saved, { count: 2 }), /unknown unit/);
    assert.throws(() => setActivationState(removed, started.value.ref, {}), /unknown unit/);
});
