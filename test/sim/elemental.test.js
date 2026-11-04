import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/battle/unit.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as epHealing from "../../dist/core/battle/healing/ep/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as lifetime from "../../dist/core/lifetime/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

const burst = { durationTicks: 6, onStart: state => state };
const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), spatialPresence: {}, allegiance: { side: "ALLY" },
    elemental: {
        maxEp: 1000, recoveryPerSecond: 0, elementResistance: 0,
        damageResistance: 0, burstRecoverySpeed: 1,
        bursts: Object.fromEntries(elemental.ELEMENT_TYPES.map(type => [type, burst])),
    },
};

test("EP-03: Burst lock, current recovery budget, and dependency cleanup remain resource operations", () => {
    let state = battle([{ definition: elementalReceiver, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = { target, type: "BURN", power: 1000, source: null };
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    const burst = started.value.application.burst;
    const bound = effects.install(started.state, target, {
        id: "bound", initialize: () => ({}),
    }, { scopes: [lifetime.scope(elemental.lifetime, burst)] });
    const independent = effects.install(bound.state, target, { id: "independent", initialize: () => ({}) });
    state = independent.state;
    assert.equal(epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming)).value.kind, "REJECTED");
    const heal = { target, source: null, power: 100 };
    assert.equal(epHealing.applyHealing(heal, epHealing.calculateHealing(state, heal)).value.kind, "REJECTED");
    state = elemental.advance({ ...state, tick: 1 }, target);
    assert.equal(elemental.get(state, burst).remainingTicks, 5);
    state = update(state, [elemental.setContribution(target, "burstRecoverySpeed", {
        id: "clock", value: [modifier({ finalScaler: 0 })],
    })]);
    for (let tick = 2; tick <= 4; tick++) {
        state = elemental.advance({ ...state, tick }, target);
    }
    assert.equal(elemental.get(state, burst).remainingTicks, 5);
    state = update(state, [elemental.setContribution(target, "burstRecoverySpeed", {
        id: "clock", value: [modifier({ finalScaler: 2 })],
    })]);
    state = elemental.advance({ ...state, tick: 5 }, target);
    assert.equal(elemental.get(state, burst).remainingTicks, 3);
    for (let tick = 6; tick <= 7; tick++) {
        state = elemental.advance({ ...state, tick }, target);
    }
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(effects.get(state, bound.value), undefined);
    assert.equal(effects.get(state, independent.value).status, "ACTIVE");
    const restarted = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    state = elemental.cancel(restarted.state, restarted.value.application.burst, "CONTENT");
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    assert.equal(effects.get(state, independent.value).status, "ACTIVE");
});
