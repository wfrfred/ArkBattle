import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import { TacticalDemoPresentation } from "../../dist/legacy/tactical-demo-presentation.js";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import * as projectiles from "../../dist/core/battle/projectile.js";
import { remove } from "../../dist/core/battle/unit.js";
import { advance as advanceLocomotion } from "../../dist/core/unit/capability/locomotion/index.js";
import { createArrow } from "../../dist/content/enemies/crossbowman/action.js";

const metadata = new Map([
    ["char_311_mudrok", {
        kind: "op", name: "泥岩", spine: "char_311_mudrok", avatar: "char_311_mudrok_2", skillIndex: 1,
        animation: { attack: "Attack", skillAttack: "Skill_1", skill: "ATTACK" },
    }],
    ["char_208_melan", {
        kind: "op", name: "玫兰莎", spine: "char_208_melan", avatar: "char_208_melan", skillIndex: 0,
        animation: { skill: "BUFF" },
    }],
    ["enemy_1003_ncbow", { kind: "enemy", name: "弩手", spine: "enemy_1003_ncbow" }],
]);
const presentation = () => new TacticalDemoPresentation({ lookup() {} }, {
    projectileActions: true,
    unitMetadata: unit => metadata.get(unit.definition.id),
});
const definition = (id, fields = {}) => ({
    id, hooks: Hooks.empty(), allegiance: { side: "ALLY" }, layer: { type: "GROUND" },
    vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    ...fields,
});
const skill = {
    id: "presentation-skill",
    initialize: state => ({ state, value: {} }),
    sp: { initial: 10, capacity: 10, requirement: 10, recovery: { type: "TIME", intervalTicks: 30 } },
    activation: {
        trigger: "MANUAL", sustain: { type: "TIME", durationTicks: 30 },
        initialize: () => ({}),
    },
};
const skillCapability = { initialize: state => skills.create(state, skill) };
const action = {
    id: "presentation-action", intervalTicks: 10, speed: 100,
    initialize: state => ({ state, value: {} }),
    prepare: state => ({ state, value: {} }),
    onTick: state => ({ state, value: true }),
};
const actionCapability = {
    initialize: state => actions.createActions(state, actions.create(action)),
};

test("death presentation preserves configured operator metadata after physical removal", () => {
    const view = presentation();
    const initial = battle([{ definition: definition("char_311_mudrok", { skill: skillCapability }), position: [1, 1] }]);
    const after = remove(initial, units.ref(get(initial, 0)), "DEATH");
    assert.deepEqual(view.advance(after, after.events), [["die", 0, "killed"]]);
    const presented = view.units(after)[0];
    assert.equal(presented.info.name, "泥岩");
    assert.equal(presented.info.kind, "op");
    assert.equal(presented.info.skillIndex, 1);
    assert.equal(presented.tuple[3], 0);
    assert.equal(presented.tuple[8], 4);
});

test("an active action waits for release animation while every AoE damage remains visible", () => {
    const view = presentation();
    const initial = battle([{ definition: definition("char_208_melan", { action: actionCapability }), position: [1, 1] }]);
    const source = units.ref(get(initial, 0));
    const started = actions.start(initial, actions.ref(source, action));
    assert.deepEqual(view.advance(started.state, [
        { type: "ATTACK_STARTED", sourceUnitId: 0, targetUnitId: 1, tick: 0 },
    ]), []);

    const finished = actions.advance({ ...started.state, tick: 1 }, started.value.ref);
    assert.deepEqual(view.advance(finished, [
        { type: "ACTION_RELEASED", sourceUnitId: 0, tick: 1 },
        { type: "DAMAGE", targetUnitId: 1, amount: 100, damageType: "PHYSICAL", tick: 1 },
        { type: "DAMAGE", targetUnitId: 2, amount: 100, damageType: "PHYSICAL", tick: 1 },
        ...finished.events,
    ]), [["atk", 0, 1, "none"], ["dmg", 1, 100, "phys"], ["dmg", 2, 100, "phys"]]);
});

test("projectile release uses its registered trace target and later damage does not repeat the attack", () => {
    const view = presentation();
    const initial = battle([
        { definition: definition("enemy_1003_ncbow"), position: [0, 1] },
        { definition: definition("first-target"), position: [1, 1] },
        { definition: definition("trace-target"), position: [2, 1] },
    ]);
    const created = projectiles.create(initial, createArrow(), {
        position: [0, 1],
        state: {
            source: units.ref(get(initial, 0)), target: units.ref(get(initial, 2)),
            destination: [2, 1], cachedAtk: 80, speedPerTick: 1,
            stopDelayTicks: 0, stopAtTick: null, hitAttempted: false, launchedAtTick: 0,
        },
    });
    assert.deepEqual(view.advance(created.state, [
        { type: "ATTACK_STARTED", sourceUnitId: 0, targetUnitId: 1, tick: 0 },
        { type: "ACTION_RELEASED", sourceUnitId: 0, tick: 0 },
        { type: "ACTION_FINISHED", sourceUnitId: 0, tick: 0 },
    ]), [["atk", 0, 2, "none"]]);
    assert.deepEqual(view.advance(created.state, [
        { type: "DAMAGE", targetUnitId: 2, amount: 80, damageType: "PHYSICAL", tick: 1 },
    ]), [["dmg", 2, 80, "phys"]]);
});

test("attack skills decorate attack cues while buff skills keep a separate activation indicator", () => {
    const view = presentation();
    let state = battle([
        { definition: definition("char_311_mudrok", { skill: skillCapability }), position: [1, 1] },
        { definition: definition("char_208_melan", { skill: skillCapability }), position: [2, 1] },
    ]);
    const attackSource = units.ref(get(state, 0));
    const buffSource = units.ref(get(state, 1));
    const attacking = skills.activate(state, skills.ref(attackSource, skill));
    const buffing = skills.activate(attacking.state, skills.ref(buffSource, skill));
    state = buffing.state;
    assert.deepEqual(view.advance(state, state.events), [["skill", 1, true]]);
    const presented = view.units(state);
    assert.equal(presented[0].info.skillActive, false);
    assert.equal(presented[1].info.skillActive, true);
    assert.deepEqual(view.advance(state, [
        { type: "ATTACK_STARTED", sourceUnitId: 0, targetUnitId: 2, tick: 0 },
        { type: "ACTION_RELEASED", sourceUnitId: 0, tick: 0 },
        { type: "ACTION_FINISHED", sourceUnitId: 0, tick: 0 },
        { type: "ATTACK_STARTED", sourceUnitId: 1, targetUnitId: 2, tick: 0 },
        { type: "ACTION_RELEASED", sourceUnitId: 1, tick: 0 },
        { type: "ACTION_FINISHED", sourceUnitId: 1, tick: 0 },
    ]), [["atk", 0, 2, "none", { skill: true }], ["atk", 1, 2, "none"]]);

    const offset = state.events.length;
    state = skills.finish(state, attacking.value.ref);
    state = skills.finish(state, buffing.value.ref);
    assert.deepEqual(view.advance(state, state.events.slice(offset)), [["skill", 1, false]]);
    assert.equal(view.units(state)[1].info.skillActive, false);
});

test("walk animation follows real position changes and stops when only steering velocity remains", () => {
    const view = presentation();
    const initial = battle([{ definition: definition("enemy_1003_ncbow", {
        locomotion: {
            halfBodyWidth: 0, minSpeed: 0, speed: 0.02,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
        },
    }), position: [1, 1] }]);
    assert.equal(view.units(initial)[0].tuple[8], 0);
    const goal = [2, 1];
    const moved = advanceLocomotion(initial, units.ref(get(initial, 0)), { nextPoint: goal, goal }, {
        mode: "WALK", speedMultiplier: 1,
    });
    const walking = { ...moved, tick: 1 };
    assert.equal(view.units(walking)[0].tuple[8], 1);
    assert.ok(get(walking, 0).locomotion.velocity[0] > 0);
    assert.equal(view.units({ ...walking, tick: 2 })[0].tuple[8], 0);
});
