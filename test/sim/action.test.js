import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import * as action from "../../dist/core/unit/capability/action/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { update } from "../../dist/core/battle/unit.js";
import { step } from "../../dist/core/battle/runtime.js";
import { first } from "../../dist/core/battle/targeting/index.js";
import { create as attack } from "../../dist/content/actions/attack.js";

test("prepare can reject without allocating a round; ending preserves the latest persistent state", () => {
    const program = {
        id: "two-tick-action",
        intervalTicks: 0,
        speed: 100,
        initialize: (state) => ({ state, value: { attempts: 0, ended: [] } }),
        prepare(state, source, self) {
            const attempts = self.state.attempts + 1;
            state = actions.setState(state, actions.ref(source, program), {
                ...self.state,
                attempts,
            });
            return { state, value: attempts === 1 ? null : { advances: 0 } };
        },
        onTick(state, source, self) {
            const advances = self.execution.state.advances + 1;
            state = actions.setExecutionState(state, actions.executionRef(source, self), {
                advances,
            });
            return { state, value: advances === 2 };
        },
        onEnd(state, source, self, end) {
            return actions.setState(state, actions.ref(source, program), {
                ...self.state,
                ended: [...self.state.ended, { end, advances: self.execution.state.advances }],
            });
        },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: { initialize: (state) => actions.createActions(state, actions.create(program)) },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const reference = actions.ref(source, program);

    const rejected = actions.start(state, reference);
    state = rejected.state;
    assert.deepEqual(rejected.value, { type: "REJECTED", reason: "CONDITION" });
    assert.equal(actions.getAction(state, reference).state.attempts, 1);
    assert.equal(get(state, 0).action.nextExecutionId, 0);

    const started = actions.start(state, reference);
    state = started.state;
    assert.equal(started.value.type, "STARTED");
    assert.equal(actions.getExecution(state, started.value.ref).execution.state.advances, 0);
    assert.equal(actions.start(state, reference).value.reason, "CASTING");
    state = actions.advance(state, started.value.ref);
    state = actions.advance({ ...state, tick: 1 }, started.value.ref);
    assert.equal(actions.getAction(state, reference).execution, null);
    assert.deepEqual(actions.getAction(state, reference).state, {
        attempts: 2,
        ended: [{ end: { type: "FINISHED" }, advances: 2 }],
    });

    const next = actions.start(state, reference);
    state = actions.cancel(next.state, started.value.ref, "OLD_ROUND");
    assert.equal(actions.getExecution(state, next.value.ref).execution.status, "RUNNING");
    state = actions.cancel(state, next.value.ref, "STOPPED");
    assert.deepEqual(actions.getAction(state, reference).state.ended[1], {
        end: { type: "CANCELLED", reason: "STOPPED" },
        advances: 0,
    });
});

test("independent cooldowns preserve progress when speed changes and survive finish or cancellation", () => {
    const fast = {
        id: "fast",
        intervalTicks: 10,
        speed: 100,
        initialize: (state) => ({ state, value: {} }),
        prepare: (state) => ({ state, value: {} }),
        onTick: (state) => ({ state, value: true }),
    };
    const slow = { ...fast, id: "slow", intervalTicks: 20 };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: {
            initialize: (state) =>
                actions.createActions(state, actions.create(fast), actions.create(slow)),
        },
    };
    let state = battle([{ definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const fastRef = actions.ref(source, fast);
    const slowRef = actions.ref(source, slow);
    const firstStart = actions.start(state, fastRef);
    state = actions.advance(firstStart.state, firstStart.value.ref);
    const secondStart = actions.start(state, slowRef);
    state = actions.cancel(secondStart.state, secondStart.value.ref, "STOPPED");
    assert.equal(actions.getAction(state, fastRef).cooldown.readyAtTick, 10);
    assert.equal(actions.getAction(state, slowRef).cooldown.readyAtTick, 20);

    state = update({ ...state, tick: 2 }, [
        action.setSpeedContribution(source, {
            id: "speed",
            value: [modifier({ addition: 100 })],
        }),
    ]);
    assert.equal(actions.getAction(state, fastRef).cooldown.readyAtTick, 6);
    assert.equal(actions.getAction(state, slowRef).cooldown.readyAtTick, 11);
    assert.equal(actions.start({ ...state, tick: 5 }, fastRef).value.reason, "COOLDOWN");
    state = { ...state, tick: 6 };
    const ready = actions.start(state, fastRef);
    assert.equal(ready.value.type, "STARTED");
    assert.equal(actions.start(ready.state, slowRef).value.reason, "COOLDOWN");
    state = actions.advance(ready.state, ready.value.ref);
    assert.equal(actions.getAction(state, fastRef).cooldown.readyAtTick, 11);
    assert.equal(actions.start({ ...state, tick: 11 }, slowRef).value.type, "STARTED");
});

test("interrupted attack, successful release, and damage output are separate business stages", () => {
    const program = attack({
        id: "attack",
        intervalTicks: 10,
        triggerBindingId: "target",
        targetGroups: [
            {
                id: "target",
                targeting: {
                    purposes: ["DAMAGE"],
                    filter: (_state, _request, target) => target.definition.id === "target",
                    selector: first(1, () => 0),
                },
                operations: [{ type: "DAMAGE", power: 7, damageType: "TRUE" }],
            },
        ],
    });
    const resource = {
        id: "attack-sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: { initial: 0, capacity: 5, requirement: 1, recovery: { type: "ACTION", amount: 1 } },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: { initialize: (state) => actions.createActions(state, actions.create(program)) },
        skill: { initialize: (state) => skills.create(state, resource) },
    };
    const target = {
        id: "target",
        hooks: Hooks.empty(),
        targetable: { restrictions: [] },
        vitality: { maxHp: 100, defense: 0, resistance: 0 },
    };
    let state = battle([
        { definition, position: [1, 1] },
        { definition: target, position: [2, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const reference = actions.ref(source, program);
    state = update(state, [
        action.setHook(source, "beforeRelease", {
            id: "interrupt",
            invoke: (state) => ({ state, value: { type: "INTERRUPT", recoveryTicks: 2 } }),
        }),
    ]);
    let started = actions.start(state, reference);
    state = actions.advance(started.state, started.value.ref);
    assert.equal(get(state, 0).skill.sp.value, 0);
    assert.equal(get(state, 1).vitality.hp, 100);


    state = update({ ...state, tick: 10 }, [
        action.removeHook(source, "beforeRelease", "interrupt"),
        action.setHook(source, "released", {
            id: "cancel-output",
            invoke: (state, { execution }) => ({
                state: actions.cancel(state, execution, "STOP_OUTPUT"),
                value: undefined,
            }),
        }),
    ]);
    started = actions.start(state, reference);
    state = actions.advance(started.state, started.value.ref);
    assert.equal(get(state, 0).skill.sp.value, 1);
    assert.equal(get(state, 1).vitality.hp, 100);


    state = update({ ...state, tick: 20 }, [action.removeHook(source, "released", "cancel-output")]);
    started = actions.start(state, reference);
    state = actions.advance(started.state, started.value.ref);
    assert.equal(get(state, 0).skill.sp.value, 2);
    assert.equal(get(state, 1).vitality.hp, 93);
});

test("Combat advances a zero-period action once per Tick with deterministic results", () => {
    const program = {
        id: "instant",
        intervalTicks: 0,
        speed: 100,
        initialize: (state) => ({ state, value: { completed: 0 } }),
        prepare: (state) => ({ state, value: {} }),
        onTick(state, source, self) {
            return {
                state: actions.setState(state, actions.ref(source, program), {
                    completed: self.state.completed + 1,
                }),
                value: true,
            };
        },
    };
    const resource = {
        id: "action-sp",
        initialize: (state) => ({ state, value: {} }),
        activation: null,
        sp: { initial: 0, capacity: 5, requirement: 1, recovery: { type: "ACTION", amount: 1 } },
    };
    const definition = {
        id: "actor",
        hooks: Hooks.empty(),
        action: { initialize: (state) => actions.createActions(state, actions.create(program)) },
        skill: { initialize: (state) => skills.create(state, resource) },
    };
    const firstRun = step(battle([{ definition, position: [1, 1] }], { rngState: 42 }), []);
    const repeated = step(battle([{ definition, position: [1, 1] }], { rngState: 42 }), []);
    const reference = actions.ref(units.ref(get(firstRun, 0)), program);
    assert.equal(actions.getAction(firstRun, reference).state.completed, 1);
    assert.equal(get(firstRun, 0).action.nextExecutionId, 1);
    assert.equal(get(firstRun, 0).skill.sp.value, 0);
    assert.equal(firstRun.tick, 1);

    assert.deepEqual(
        actions.getAction(firstRun, reference),
        actions.getAction(repeated, reference),
    );
    assert.equal(firstRun.execution.rngState, repeated.execution.rngState);
});
