import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as hpHealing from "../../dist/core/battle/healing/hp/index.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as epHealing from "../../dist/core/battle/healing/ep/index.js";
import * as elementalCapability from "../../dist/core/unit/capability/elemental/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { appendEvents } from "../../dist/core/battle/state.js";
import { step } from "../../dist/core/battle/index.js";

import { createArknightsElementalDefinition } from "../../dist/data/effect/elemental.js";
import { update } from "../../dist/core/battle/unit.js";

const elemental = createArknightsElementalDefinition({ receiver: "CHARACTER" });

test("EVENT-01: real HP and EP operations emit display facts including zero changes", () => {
    let state = battle([{ definition: {
        id: "receiver", hooks: Hooks.empty(), elemental,
        vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const hp = {
        source: null, target,
        nature: "DAMAGE", hitRecovery: true, parameters: { type: "ELEMENTAL", attack: { power: 50, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(hp, hpDamage.calculateDamage(state, hp)).state;
    const elementalRecovery = { source: null, target, parameters: { power: 40 } };
    state = epHealing.applyHealing(
        elementalRecovery, epHealing.calculateHealing(state, elementalRecovery),
    ).state;
    const injury = { source: null, target, parameters: { type: "NEURAL", power: 100 } };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury)).state;
    state = epHealing.applyHealing(elementalRecovery, epHealing.calculateHealing(state, elementalRecovery)).state;
    const recovery = { source: null, target, parameters: { power: 30, multiplier: 1 } };
    state = hpHealing.applyHealing(recovery, hpHealing.calculateHealing(state, recovery)).state;
    state = update(state, target, elementalCapability.setHook("damageReceiving", {
        id: "reduction",
        invoke: (current, _context, pending) => ({
            state: current,
            value: { ...pending, amount: pending.amount - 200 },
        }),
    }));
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury)).state;

    assert.deepEqual(state.events, [
        { type: "DAMAGE", targetUnitId: 0, amount: 50, damageType: "ELEMENTAL", tick: 0 },
        { type: "ELEMENTAL_INJURY_HEALED", targetUnitId: 0, amount: 0, tick: 0 },
        { type: "ELEMENTAL_INJURY", targetUnitId: 0, amount: 100, elementType: "NEURAL", tick: 0 },
        { type: "ELEMENTAL_INJURY_HEALED", targetUnitId: 0, amount: 40, tick: 0 },
        { type: "HEAL", targetUnitId: 0, amount: 30, tick: 0 },
        { type: "ELEMENTAL_INJURY", targetUnitId: 0, amount: 0, elementType: "NEURAL", tick: 0 },
    ]);
});

test("EVENT-02: a Burst keeps its original position through movement and death in the same Tick", () => {
    let state = battle([{ definition: {
        id: "receiver", hooks: Hooks.empty(), elemental, presence: {},
        vitality: { maxHp: 2000, defense: 0, resistance: 0 },
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const injury = { source: null, target, parameters: { type: "BURN", power: 1000 } };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury)).state;
    state = update(state, target, presence.appear([4, 1]));
    const lethal = {
        source: null, target,
        nature: "DAMAGE", hitRecovery: true, parameters: { type: "TRUE", attack: { power: 2000, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(state, lethal)).state;

    assert.equal(get(state, 0), undefined);
    assert.deepEqual(state.events.map(({ type }) => type), [
        "ELEMENTAL_INJURY", "ELEMENTAL_BURST", "DAMAGE", "DAMAGE", "UNIT_REMOVED",
    ]);
    assert.deepEqual(state.events.find(({ type }) => type === "ELEMENTAL_BURST"), {
        type: "ELEMENTAL_BURST", unitId: 0, elementType: "BURN", position: [1, 1], tick: 0,
    });
    const removed = state.events.find(({ type }) => type === "UNIT_REMOVED");
    assert.equal(removed.reason, "DEATH");
    assert.deepEqual(removed.unit.position, [4, 1]);
});

test("EVENT-03: route output is independent of simulation facts and clears next Tick", () => {
    const initial = battle([{ definition: {
        id: "traveller", hooks: Hooks.empty(),
    }, position: [1, 1] }]);
    const output = appendEvents(initial, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);

    assert.equal(get(output, 0).lifecycle, "PRESENT");
    const next = step(output, []);
    assert.deepEqual(next.events, []);
    assert.equal(get(next, 0).lifecycle, "PRESENT");
    assert.deepEqual(output.events, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);
});
