import assert from "node:assert/strict";
import { test } from "node:test";
import { getUnit } from "../helpers/unit.js";
import { get, setData, setActivationData } from "../../dist/core/unit/skill/index.js";
import { get as getInstance } from "../../dist/core/unit/skill/instance.js";
import * as operations from "../../dist/core/unit/skill/operations.js";
import { ref } from "../../dist/core/unit/skill/activation.js";
import * as sp from "../../dist/core/unit/skill/sp.js";
import { remove } from "../../dist/core/battle/unit.js";
import { fixture, definition, at } from "../helpers/skill.js";

test("Skill programs receive paired private state without specializing their host capability", () => {
    const observed = [];
    const f = fixture({
        sp: null,
        initialize: () => ({ count: 0 }),
        onEnter(battle, self) {
            assert.equal(self.definition, f.definition);
            assert.equal(self.host.id, f.unit.id);
            return setData(battle, self, { count: self.state.data.count + 1 });
        },
        onTick(battle, self) {
            return setData(battle, self, { count: self.state.data.count + 1 });
        },
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" },
            initialize: (_battle, self) => ({ sampled: self.state.data.count }),
            onStart(battle, self) {
                observed.push([self.id, self.data.sampled]);
                assert.equal(get(battle, ref(self)), self);
                return battle;
            },
        },
    });
    let battle = operations.enter(f.state, f.ref);
    const first = operations.activate(battle, f.ref);
    battle = operations.finish(first.state, first.value.ref);
    battle = operations.advance(at(battle, 1), f.ref);
    const second = operations.activate(battle, f.ref);
    assert.deepEqual(observed, [[0, 1], [1, 2]]);
    assert.deepEqual(getUnit(second.state, f.unit.id).skill.data, { count: 2 });
    assert.deepEqual(f.unit.skill.data, { count: 0 });
});

test("a Skill Definition token restores activation data only for its configured program", () => {
    const f = fixture({
        initialize: () => ({ count: 1 }), sp: null,
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
            onStart(battle, self) {
                const program = getInstance(battle, self.host, f.definition);
                return setData(battle, program, { count: program.state.data.count + 1 });
            },
        },
    });
    const started = operations.activate(f.state, f.ref);
    const other = definition({ id: f.definition.id });
    assert.notEqual(other, f.definition);
    assert.equal(getInstance(started.state, f.ref, other), undefined);
    assert.deepEqual(getInstance(started.state, f.ref, f.definition).state.data, { count: 2 });
    assert.equal(get(started.state, started.value.ref, other), undefined);
    assert.equal(get(started.state, started.value.ref, f.definition), getUnit(started.state, f.unit.id).skill.active);
    const finished = operations.finish(started.state, started.value.ref);
    assert.equal(get(finished, started.value.ref, f.definition), undefined);
});

test("Activation data writes preserve the latest duration and reject a previous identity", () => {
    const f = fixture({ sp: null });
    const first = operations.activate(f.state, f.ref);
    const active = get(first.state, first.value.ref);
    const extended = operations.extendTime(first.state, first.value.ref, 15);
    const updated = setActivationData(extended, first.value.ref, { count: 2 });
    const current = get(updated, first.value.ref);
    assert.deepEqual(current.data, { count: 2 });
    assert.equal(current.sustain, get(extended, first.value.ref).sustain);
    assert.equal(current.sustain.endsAtTick, 45);
    assert.equal(current.id, active.id);
    assert.equal(current.startedAtTick, active.startedAtTick);
    assert.equal(setActivationData(updated, first.value.ref, current.data), updated);
    assert.deepEqual(active.data, {});
    assert.equal(active.sustain.endsAtTick, 30);
    const finished = operations.finish(updated, first.value.ref);
    const second = operations.activate(finished, f.ref);
    assert.notEqual(first.value.ref.id, second.value.ref.id);
    assert.throws(() => setActivationData(second.state, first.value.ref, { count: 9 }), /unknown skill activation/);
    assert.deepEqual(get(second.state, second.value.ref).data, {});
});

test("persistent data writes use a sampled Instance only as proof and preserve fresh SP and Activation", () => {
    const f = fixture({
        initialize: () => ({ count: 0 }),
        sp: { initial: 4, capacity: 8, requirement: 1, cost: 1, recovery: { type: "NONE" } },
    });
    const sampled = getInstance(f.state, f.ref, f.definition);
    const charged = sp.modify(f.state, f.ref, 2, true).state;
    const started = operations.activate(charged, f.ref);
    const before = getUnit(started.state, f.ref.id).skill;
    const data = { count: 1 };
    const updated = setData(started.state, sampled, data);
    const current = getUnit(updated, f.ref.id).skill;
    assert.equal(current.data, data);
    assert.equal(current.sp, before.sp);
    assert.equal(current.sp.value, 5);
    assert.equal(current.active, before.active);
    assert.equal(current.nextActivationId, 1);
    assert.equal(current.rules, before.rules);
    assert.equal(setData(updated, sampled, data), updated);
    assert.deepEqual(sampled.state.data, { count: 0 });
    assert.equal(sampled.state.sp.value, 4);
    assert.equal(sampled.state.active, null);
    assert.equal(sampled.state.nextActivationId, 0);
});

test("ending callbacks may write persistent data while ordinary Activation writes remain closed", () => {
    let saved;
    const f = fixture({
        initialize: () => ({ count: 0 }), sp: null,
        activation: {
            trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}),
            onEnd(battle, self) {
                saved = getInstance(battle, self.host, f.definition);
                assert.throws(() => setActivationData(battle, ref(self), { count: 1 }), /ending skill activation/);
                return setData(battle, saved, { count: saved.state.data.count + 1 });
            },
        },
    });
    const started = operations.activate(f.state, f.ref);
    const finished = operations.finish(started.state, started.value.ref);
    assert.deepEqual(getUnit(finished, f.ref.id).skill.data, { count: 1 });
    const removed = remove(finished, f.ref.id, "SCRIPT");
    assert.throws(() => setData(removed, saved, { count: 2 }), /unknown unit/);
    assert.throws(() => setActivationData(removed, started.value.ref, {}), /unknown unit/);
});
