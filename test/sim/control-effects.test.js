import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import * as sp from "../../dist/core/unit/skill/sp.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { advance as advanceLocomotion } from "../../dist/core/unit/capability/locomotion/index.js";
import { stun, silence, blockSpRecovery } from "../../dist/core/effects/control.js";

function actor(onEnd = state => state) {
    const action = {
        id: "held", intervalTicks: 0, speed: 100,
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick: state => ({ state, value: false }),
        onEnd,
    };
    const skill = {
        id: "control-skill", initialize: state => ({ state, value: {} }),
        sp: { initial: 10, capacity: 10, requirement: 10, cost: 10, recovery: { type: "TIME", intervalTicks: 30 } },
        activation: { trigger: "MANUAL", sustain: { type: "INFINITE" }, initialize: () => ({}) },
    };
    const definition = {
        id: "controlled", hooks: Hooks.empty(),
        action: { initialize: state => actions.createActions(state, actions.create(action)) },
        skill: { initialize: state => skills.create(state, skill) },
        blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 2 },
        locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 1, steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 } },
    };
    return { definition, action, skill };
}

function canMove(state, reference) {
    const self = units.get(state, reference);
    const goal = [self.position[0] + 0.05, self.position[1]];
    const moved = advanceLocomotion(state, reference, { nextPoint: goal, goal }, { mode: "WALK", speedMultiplier: 1 });
    return units.get(moved, reference).position[0] > self.position[0];
}

test("stun interrupts the current action, suppresses four capabilities, and withdraws only its own rules", () => {
    const endings = [];
    const content = actor((state, _source, _self, end) => { endings.push(end); return state; });
    let state = battle([
        { definition: content.definition, position: [1, 1] },
        { definition: { id: "blockable", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1, rules: [] } }, position: [1.5, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const action = actions.ref(source, content.action);
    const skill = skills.ref(source, content.skill);
    state = blocking.search(state, source);
    assert.equal(blocking.blockerOf(state, target).id, source.id);
    const started = actions.start(state, action);
    state = sp.pay(started.state, source, 5).state;
    const first = effects.install(state, source, stun);
    const second = effects.install(first.state, source, stun);
    state = second.state;

    assert.deepEqual(endings, [{ type: "CANCELLED", reason: "INTERRUPTED" }]);
    assert.equal(actions.getExecution(state, started.value), undefined);
    assert.equal(actions.start(state, action).value, null);
    assert.equal(canMove(state, source), false);
    assert.equal(blocking.blockerOf(state, target), undefined);
    state = sp.recover(state, source, "TIME", 5).state;
    assert.equal(get(state, 0).skill.sp.value, 10);
    assert.equal(skills.activate(state, skill).value, null);

    state = effects.setEnabled(state, first.value, false);
    assert.equal(actions.start(state, action).value, null);
    state = effects.end(state, second.value);
    state = { ...state, tick: 1 };
    assert.notEqual(actions.start(state, action).value, null);
    assert.equal(canMove(state, source), true);
    assert.notEqual(skills.activate(state, skill).value, null);
    assert.equal(blocking.blockerOf(state, target), undefined);
    state = blocking.search(state, source);
    assert.equal(blocking.blockerOf(state, target).id, source.id);
});

test("silence blocks activation while SP prevention independently blocks recovery", () => {
    const content = actor();
    let state = battle([{ definition: content.definition, position: [1, 1] }]);
    const source = units.ref(get(state, 0));
    const skill = skills.ref(source, content.skill);
    const silenced = effects.install(state, source, silence);
    state = silenced.state;
    assert.equal(skills.activate(state, skill).value, null);
    assert.notEqual(actions.start(state, actions.ref(source, content.action)).value, null);
    assert.equal(canMove(state, source), true);

    state = sp.pay(state, source, 1).state;
    const blocked = effects.install(state, source, blockSpRecovery);
    state = blocked.state;
    assert.equal(sp.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    state = effects.end(state, blocked.value);
    state = sp.recover(state, source, "EXTERNAL", 1).state;
    assert.equal(get(state, 0).skill.sp.value, 10);
    assert.equal(skills.activate(state, skill).value, null);
    state = effects.end(state, silenced.value);
    assert.notEqual(skills.activate(state, skill).value, null);
});
