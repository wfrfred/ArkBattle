// Contract: [action](../../docs/architecture/action.md).
import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as actions from "../../dist/core/unit/capability/action/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import { create as modifier } from "../../dist/core/common/modifier.js";
import { createRng } from "../../dist/core/common/rng.js";
import { attribute, vitality } from "../helpers/attribute.js";
import { actionCapability } from "../helpers/actions.js";
import { update } from "../../dist/core/unit/operations.js";
import { step } from "../../dist/core/battle/runtime.js";
import { create as attack } from "../../dist/content/actions/attack.js";
import { damage, parameters } from "../helpers/vitality.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";

test("capabilities initialize declared programs in order and carry their battle state forward", () => {
    const seed = 7;
    const initialize = (state) => {
        const rng = createRng(state.execution.rngState);
        const sample = rng.next();
        return {
            state: { ...state, execution: { ...state.execution, rngState: rng.state() } },
            value: { sample },
        };
    };
    const first = {
        id: "first",
        applyWay: "NONE",
        period: { type: "FIXED", ticks: 1 },
        initialize,
        prepare: (state) => ({ state, value: null }),
        onTick: state => state,
    };
    const second = { ...first, id: "second" };
    const skill = { id: "skill", initialize, sp: null, activation: null };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: actionCapability(first, second),
        skill: { definition: skill },
    };
    const state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }], { rngState: seed });
    const host = units.ref(get(state, 0));
    const rng = createRng(seed);

    assert.equal(host.get(state).action.actions.get(first).state.sample, rng.next());
    assert.equal(host.get(state).action.actions.get(second).state.sample, rng.next());
    assert.equal(host.get(state).skill.state.sample, rng.next());
    assert.equal(state.execution.rngState, rng.state());
});

test("prepare can reject without allocating a round; ending preserves the latest persistent state", () => {
    const program = {
        id: "two-tick-action",
        applyWay: "NONE",
        period: { type: "FIXED", ticks: 0 },
        initialize: (state) => ({ state, value: { attempts: 0, ended: [] } }),
        prepare(state, source, self) {
            const attempts = self.state.attempts + 1;
            state = actions.setState(state, actions.ref(self), {
                ...self.state,
                attempts,
            });
            return { state, value: attempts === 1 ? null : { advances: 0 } };
        },
        onTick(state, source, self) {
            const advances = self.state.advances + 1;
            const reference = actions.ref(self);
            state = actions.setExecutionState(state, reference, { advances });
            return advances === 2 ? actions.finish(state, reference) : state;
        },
        onEnd(state, source, self, action, end) {
            const reference = actions.ref(self);
            state = actions.setExecutionState(state, reference, {
                ...self.state,
                cleaned: true,
            });
            const current = reference.get(state);
            assert.equal(current.lifecycle, "ENDING");
            assert.equal(current.state.cleaned, true);
            assert.equal(actions.hasExecution(state, source, program.id), true);
            const { state: persistent } = action.get(state);
            return actions.setState(state, action, {
                ...persistent,
                ended: [...persistent.ended, { end, advances: current.state.advances }],
            });
        },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: actionCapability(program),
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = actions.ref(source.get(state).action.actions.get(program));

    const rejected = actions.start(state, reference);
    state = rejected.state;
    assert.equal(rejected.value, null);
    assert.equal(reference.get(state).state.attempts, 1);

    const started = actions.start(state, reference);
    state = started.state;
    assert.notEqual(started.value, null);
    assert.equal(actions.start(state, reference).value, null);
    state = actions.advance(state, started.value);
    state = actions.advance({ ...state, tick: 1 }, started.value);
    assert.equal(reference.get(state).execution, null);
    assert.equal(actions.hasExecution(state, source, program.id), false);
    assert.throws(() => actions.setExecutionState(state, started.value, { advances: 0 }), RangeError);
    assert.deepEqual(reference.get(state).state, {
        attempts: 2,
        ended: [{ end: { type: "FINISHED" }, advances: 2 }],
    });

    const next = actions.start(state, reference);
    state = actions.cancel(next.state, started.value, "OLD_ROUND");
    assert.equal(next.value.get(state).lifecycle, "ACTIVE");
    state = actions.cancel(state, next.value, "STOPPED");
    assert.deepEqual(reference.get(state).state.ended[1], {
        end: { type: "CANCELLED", reason: "STOPPED" },
        advances: 0,
    });
});

test("attribute changes preserve independent attack cooldown progress and leave fixed cooldowns untouched", () => {
    const first = {
        id: "first", applyWay: "NONE", period: { type: "ATTACK_SPEED" },
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick: (state, source, self) => actions.finish(state, actions.ref(self)),
    };
    const second = { ...first, id: "second" };
    const fixed = { ...first, id: "fixed", period: { type: "FIXED", ticks: 20 } };
    let state = battle([{ definition: {
        id: "actor", hooks: Hooks.empty(), action: actionCapability(first, second, fixed),
    }, hooks: Hooks.empty(), initial: {}, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const references = [first, second, fixed].map(definition => actions.ref(source.get(state).action.actions.get(definition)));
    const startAt = (index, tick) => {
        const started = actions.start({ ...state, tick }, references[index]);
        state = actions.advance(started.state, started.value);
    };
    const ready = () => references.map(reference => reference.get(state).cooldown.readyAtTick);
    startAt(0, 0);
    startAt(1, 2);
    startAt(2, 2);
    assert.deepEqual(ready(), [10, 12, 22]);

    state = update({ ...state, tick: 4 }, source, actions.setSpeedContribution({
        id: "speed", group: null, value: [modifier({ addition: 100 })],
    }));
    assert.deepEqual(ready(), [7, 8, 22]);
    state = update({ ...state, tick: 5 }, source, actions.removeSpeedContribution("speed"));
    assert.deepEqual(ready(), [9, 11, 22]);
    state = update(state, source, units.compose(
        actions.setIntervalContribution({ id: "interval", group: null, value: [modifier({ addition: 10 })] }),
        actions.setSpeedContribution({ id: "speed", group: null, value: [modifier({ addition: 100 })] }),
    ));
    assert.deepEqual(ready(), [9, 11, 22]);

    state = update(state, source, actions.setSpeedRange({ min: 10, max: 10 }));
    assert.deepEqual(ready(), [85, 125, 22]);
    state = update(state, source, actions.clearSpeedRange());
    assert.deepEqual(ready(), [9, 11, 22]);
    state = update(state, source, actions.setIntervalRange({ min: 5, max: 5 }));
    assert.deepEqual(ready(), [6, 6.5, 22]);
    state = update(state, source, actions.clearIntervalRange());
    assert.deepEqual(ready(), [9, 11, 22]);
});

test("interrupted attack, successful release, and damage output are separate business stages", () => {
    const program = attack({
        id: "attack",
        period: { type: "FIXED", ticks: 10 },
        timing: { type: "FIXED", windupTicks: 0, recoveryTicks: 0 },
        applyWay: "MELEE",
        select(state) {
            return {
                state,
                value: units.all(state)
                    .filter(target => target.definition.id === "target")
                    .take(1)
                    .map(units.ref)
                    .toArray(),
            };
        },
        output(state, source, self) {
            return damage(state, { source, target: self.state.targets[0], applyWay: "MELEE", parameters: parameters(7, "TRUE") }).state;
        },
    });
    const resource = {
        id: "attack-sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: { initial: 0, capacity: 5, recovery: { type: "ACTION", amount: 1 }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        presence: {},
        action: {
            ...actionCapability(program),
            select: state => ({ state, value: [] }),
        },
        skill: { definition: resource },
    };
    const target = {
        id: "target",
        hooks: Hooks.empty(),
        targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions: [] },
        vitality: vitality(100),
    };
    let state = battle([
        { definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] },
        { definition: target, hooks: Hooks.empty(), initial: {}, position: [2, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const reference = actions.ref(source.get(state).action.actions.get(program));
    state = update(state, source, units.setHook(actions.beforeRelease, {
            id: "interrupt", priority: 0,
            invoke: (state) => ({ state, value: { type: "INTERRUPT", recoveryTicks: 2 } }),
        }));
    let started = actions.start(state, reference);
    state = step(started.state, []);
    assert.equal(get(state, 0).skill.sp.value, 0);
    assert.equal(get(state, 1).vitality.health.hp, 100);

    while (state.tick < 10) state = step(state, []);
    state = update(state, source, units.compose(units.removeHook(actions.beforeRelease, "interrupt"), units.setHook(actions.released, {
            id: "hide-after-release", priority: 0,
            invoke: (state, { execution }) => ({
                state: update(state, execution.host, presence.disappear()),
                value: undefined,
            }),
        })));
    started = actions.start(state, reference);
    state = step(started.state, []);
    assert.equal(get(state, 0).skill.sp.value, 1);
    assert.equal(get(state, 1).vitality.health.hp, 100);
    assert.equal(started.value.get(state), undefined);

    while (state.tick < 20) state = step(state, []);
    state = update(state, source, presence.appear([1, 1]));
    state = update(state, source, units.removeHook(actions.released, "hide-after-release"));
    started = actions.start(state, reference);
    state = step(started.state, []);
    assert.equal(get(state, 0).skill.sp.value, 2);
    assert.equal(get(state, 1).vitality.health.hp, 93);
    assert.deepEqual(state.events.map(event => event.type), ["ATTACK_STARTED", "ACTION_RELEASED", "DAMAGE", "ACTION_FINISHED"]);
});

test("Combat advances an instantaneous action once per Tick and skips selection while absent", () => {
    let selections = 0;
    const program = {
        id: "instant",
        applyWay: "NONE",
        period: { type: "FIXED", ticks: 0 },
        initialize: (state) => ({ state, value: { completed: 0 } }),
        prepare: (state) => ({ state, value: {} }),
        onTick(state, source, self, action) {
            state = actions.setState(state, action, {
                completed: action.get(state).state.completed + 1,
            });
            return actions.finish(state, actions.ref(self));
        },
    };
    const resource = {
        id: "action-sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: { initial: 0, capacity: 5, recovery: { type: "ACTION", amount: 1 }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        presence: {},
        action: {
            ...actionCapability(program),
            select(state) {
                selections++;
                return { state, value: [program.id, program.id] };
            },
        },
        skill: { definition: resource },
    };
    const firstRun = step(battle([{ definition, hooks: Hooks.empty(), initial: {}, position: [1, 1] }], { rngState: 42 }), []);
    const reference = actions.ref(get(firstRun, 0).action.actions.get(program));
    assert.equal(reference.get(firstRun).state.completed, 1);
    assert.equal(get(firstRun, 0).skill.sp.value, 0);

    const hidden = update(firstRun, units.ref(get(firstRun, 0)), presence.disappear());
    const after = step(hidden, []);
    assert.equal(selections, 1);
    assert.equal(reference.get(after).state.completed, 1);
});
