import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/battle/unit.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as epHealing from "../../dist/core/battle/healing/ep/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import { createStun } from "../../dist/core/effects/elemental/neural.js";
import { createSpDrain } from "../../dist/core/effects/elemental/necrosis.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { createArknightsElementalDefinition } from "../../dist/data/arknights/elemental.js";

const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), spatialPresence: {}, allegiance: { side: "ALLY" },
    vitality: { maxHp: 10000, defense: 0, resistance: 50 },
    elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
};

test("EP-03: Burst recovery refills all EP with the current budget and releases its scoped output", () => {
    let state = battle([{ definition: elementalReceiver, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = { target, type: "BURN", power: 1000, source: null };
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    const burst = started.value.application.burst;
    state = started.state;
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 30);
    assert.equal(epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming)).value.kind, "REJECTED");
    const heal = { target, source: null, power: 100 };
    assert.equal(epHealing.applyHealing(heal, epHealing.calculateHealing(state, heal)).value.kind, "REJECTED");
    state = effects.advance({ ...state, tick: 1 });
    assert.equal(elemental.get(state, burst).expiration.elapsed, 1);
    for (const value of Object.values(get(state, 0).elemental.ep)) {
        assert.ok(Math.abs(value - 1000 / 300) < 1e-8);
    }
    state = update(state, [elemental.setContribution(target, "burstRecoverySpeed", {
        id: "clock", value: [modifier({ finalScaler: 0 })],
    })]);
    for (let tick = 2; tick <= 4; tick++) {
        state = effects.advance({ ...state, tick });
    }
    assert.equal(elemental.get(state, burst).expiration.elapsed, 1);
    state = update(state, [
        elemental.setContribution(target, "burstRecoverySpeed", {
            id: "clock", value: [modifier({ finalScaler: 2 })],
        }),
        elemental.setContribution(target, "maxEp", {
            id: "capacity", value: [modifier({ addition: 1000 })],
        }),
    ]);
    state = effects.advance({ ...state, tick: 5 });
    assert.equal(elemental.get(state, burst).expiration.elapsed, 3);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(20));
    for (let tick = 6; tick <= 154; tick++) {
        state = effects.advance({ ...state, tick });
    }
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(elemental.get(state, burst), undefined);
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
    const restart = { ...incoming, power: 2000 };
    const restarted = epDamage.applyDamage(restart, epDamage.calculateDamage(state, restart));
    state = elemental.cancel(restarted.state, restarted.value.application.burst, "CONTENT");
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
});

test("EP-03: zero recovery budgets keep installation output and independent stun without later periodic output", () => {
    const definition = {
        ...elementalReceiver,
        locomotion: {
            speed: 1, minSpeed: 0, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
        },
        elemental: {
            ...elementalReceiver.elemental,
            bursts: {
                ...elementalReceiver.elemental.bursts,
                NEURAL: createStun({ durationTicks: 0, stunDurationTicks: 300, damage: 1000 }),
                NECROSIS: createSpDrain({ durationTicks: 0, damagePerSecond: 100, spDrainPerSecond: 1 }),
            },
        },
    };
    let state = battle([{ definition, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const neural = { target, type: "NEURAL", power: 1000, source: null };
    const result = epDamage.applyDamage(neural, epDamage.calculateDamage(state, neural));
    state = result.state;
    assert.equal(get(state, 0).vitality.hp, 9000);
    assert.equal(elemental.get(state, result.value.application.burst), undefined);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    const goal = { nextPoint: [0.5, 0], goal: [0.5, 0] };
    const movement = { mode: "WALK", speedMultiplier: 1 };
    assert.equal(locomotion.advance(state, target, goal, movement), state);
    state = effects.advance({ ...state, tick: 300 });
    state = locomotion.advance(state, target, goal, movement);
    assert.deepEqual(get(state, 0).position, goal.goal);

    const necrosis = { target, type: "NECROSIS", power: 1000, source: null };
    state = epDamage.applyDamage(necrosis, epDamage.calculateDamage(state, necrosis)).state;
    state = effects.advance({ ...state, tick: 750 });
    assert.equal(get(state, 0).vitality.hp, 9000);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(state.events.filter(event => event.type === "DAMAGE").length, 1);
});
