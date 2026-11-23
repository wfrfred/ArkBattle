// Contract: [effect](../../../docs/architecture/effect.md#10-标准效果库与候选范围).
import { attribute as defineAttribute } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import * as units from "../../../dist/core/unit/index.js";
import * as blocking from "../../../dist/core/battle/blocking/index.js";
import * as actions from "../../../dist/core/unit/capability/action/index.js";
import * as skills from "../../../dist/core/unit/capability/skill/index.js";
import * as sp from "../../../dist/core/unit/capability/skill/sp.js";
import * as effects from "../../../dist/core/unit/effect/index.js";
import { scope } from "../../../dist/core/lifetime/index.js";
import { advance as advanceLocomotion } from "../../../dist/core/unit/capability/locomotion/index.js";
import * as facing from "../../../dist/core/unit/capability/facing/index.js";
import { stun, stunRestriction, silence, blockSpRecovery } from "../../../dist/core/effects/control.js";

function actor(ignoreRestrictions, onEnd = state => state) {
    const action = {
        id: "held", applyWay: "NONE", period: { type: "FIXED", ticks: 0 },
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick: state => state,
        onEnd,
    };
    const skill = {
        id: "control-skill", initialize: state => ({ state, value: {} }),
        sp: { initial: 10, capacity: 10, recovery: { type: "TIME" }, recoverySpeed: defineAttribute(1), recoveryMultiplier: defineAttribute(1) },
        activation: { trigger: "MANUAL", ignoreRestrictions, requirement: 10, cost: 10, initialize: () => ({ state: {}, duration: { type: "INFINITE" } }) },
    };
    const definition = {
        id: "controlled", hooks: Hooks.empty(),
        action: { speed: defineAttribute(100, 20), interval: defineAttribute(10), definitions: [action] },
        skill: { definition: skill },
        blocker: { layer: "GROUND", restrictions: [], capacity: 1, radius: 2 },
        facing: { restrictions: [] },
        locomotion: { halfBodyWidth: 0, speed: defineAttribute(1), steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 } },
    };
    return { definition, action, skill };
}

function canMove(state, reference) {
    const self = units.get(state, reference);
    const goal = [self.position[0] + 0.05, self.position[1]];
    const moved = advanceLocomotion(state, reference, { nextPoint: goal, goal }, { mode: "WALK", speedMultiplier: 1 });
    return units.get(moved, reference).position[0] > self.position[0];
}

test("stun interrupts the current action, suppresses its affected capabilities, and withdraws only its own restrictions", () => {
    const endings = [];
    const content = actor([], (state, _source, _self, end) => { endings.push(end); return state; });
    let state = battle([
        { definition: content.definition, position: [1, 1], initial: { facing: { direction: "RIGHT" } } },
        { definition: { id: "blockable", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1, restrictions: [] } }, position: [1.5, 1] },
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
    assert.equal(facing.turn(state, source, "LEFT"), state);
    assert.equal(blocking.blockerOf(state, target), undefined);
    state = sp.recover(state, source, "TIME", 5).state;
    assert.equal(get(state, 0).skill.sp.value, 10);
    assert.equal(skills.activate(state, skill).value, null);

    state = effects.setEnabled(state, first.value, false);
    assert.equal(actions.start(state, action).value, null);
    assert.equal(facing.turn(state, source, "LEFT"), state);
    state = effects.remove(state, second.value);
    state = { ...state, tick: 1 };
    assert.notEqual(actions.start(state, action).value, null);
    assert.equal(canMove(state, source), true);
    state = facing.turn(state, source, "LEFT");
    assert.equal(get(state, 0).facing.direction, "LEFT");
    assert.notEqual(skills.activate(state, skill).value, null);
    assert.equal(blocking.blockerOf(state, target), undefined);
    state = blocking.search(state, source);
    assert.equal(blocking.blockerOf(state, target).id, source.id);
});

test("silence blocks activation while SP prevention independently blocks recovery", () => {
    const content = actor([]);
    let state = battle([{ definition: content.definition, position: [1, 1], initial: { facing: { direction: "RIGHT" } } }]);
    const source = units.ref(get(state, 0));
    const skill = skills.ref(source, content.skill);
    const parent = effects.install(state, source, { id: "combined-control", initialize: () => ({}) });
    const scopes = [scope(effects.lifetime, parent.value)];
    const silenced = effects.install(parent.state, source, silence, { scopes });
    state = silenced.state;
    assert.equal(skills.activate(state, skill).value, null);
    assert.notEqual(actions.start(state, actions.ref(source, content.action)).value, null);
    assert.equal(canMove(state, source), true);

    state = sp.pay(state, source, 1).state;
    const blocked = effects.install(state, source, blockSpRecovery, { scopes });
    state = blocked.state;
    assert.equal(sp.recover(state, source, "EXTERNAL", 1).value.type, "REJECTED");
    state = effects.setEnabled(state, blocked.value, false);
    state = sp.recover(state, source, "EXTERNAL", 1).state;
    assert.equal(get(state, 0).skill.sp.value, 10);
    assert.equal(skills.activate(state, skill).value, null);
    state = effects.remove(state, parent.value);
    assert.equal(effects.get(state, silenced.value), undefined);
    assert.equal(effects.get(state, blocked.value), undefined);
    assert.notEqual(skills.activate(state, skill).value, null);
});

test("a skill can ignore every stun source for activation while silence, SP and other stun constraints remain", () => {
    const content = actor([stunRestriction]);
    let state = battle([
        { definition: content.definition, position: [1, 1], initial: { facing: { direction: "RIGHT" } } },
        { definition: { id: "blockable", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1, restrictions: [] } }, position: [1.5, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const reference = skills.ref(source, content.skill);
    const first = effects.install(state, source, stun);
    const second = effects.install(first.state, source, stun);
    const silenced = effects.install(second.state, source, silence);
    state = silenced.state;
    const rejected = skills.activate(state, reference);
    assert.equal(rejected.value, null);
    assert.equal(rejected.state, state);
    state = effects.remove(state, silenced.value);
    state = sp.pay(state, source, 5).state;
    const insufficient = skills.activate(state, reference);
    assert.equal(insufficient.value, null);
    assert.equal(insufficient.state, state);
    state = sp.recover(state, source, "TIME", 5).state;
    const activated = skills.activate(state, reference);
    state = activated.state;
    assert.notEqual(activated.value, null);
    assert.equal(get(state, 0).skill.sp.value, 0);
    assert.equal(effects.get(state, first.value).lifecycle, "ACTIVE");
    assert.equal(effects.get(state, second.value).lifecycle, "ACTIVE");
    assert.equal(actions.start(state, actions.ref(source, content.action)).value, null);
    assert.equal(canMove(state, source), false);
    assert.equal(facing.turn(state, source, "LEFT"), state);
    state = blocking.search(state, source);
    assert.equal(blocking.blockerOf(state, target), undefined);
});
