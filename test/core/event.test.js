import { vitality as defineVitality, elemental as defineElemental } from "../helpers/attribute.js";
// Contract: [event](../../docs/architecture/event.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as hpDecrease from "../../dist/core/battle/resource/hp/decrease.js";
import * as hpHealing from "../../dist/core/battle/resource/hp/healing/index.js";
import * as hpIncrease from "../../dist/core/battle/resource/hp/increase.js";
import * as epDamage from "../../dist/core/battle/resource/ep/damage/index.js";
import * as epHealing from "../../dist/core/battle/resource/ep/healing/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { step } from "../../dist/core/battle/index.js";

import { allyCharacterBursts } from "../../dist/core/effects/elemental/index.js";
import { update } from "../../dist/core/unit/operations.js";

const elemental = defineElemental(allyCharacterBursts);

test("EVENT-01: resource operations emit actual changes and only HP cancellations emit zero", () => {
    let state = battle([{ hooks: Hooks.empty(), initial: {}, definition: {
        id: "receiver", hooks: Hooks.empty(), elemental,
        vitality: defineVitality(1000),
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const hp = {
        source: null, target,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "ELEMENTAL", attack: { power: 50, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(hp, hpDamage.calculateDamage(state, hp, null), null).state;
    const elementalRecovery = { source: null, target, parameters: { power: 40 } };
    state = epHealing.applyHealing(
        elementalRecovery, epHealing.calculateHealing(state, elementalRecovery, null), null,
    ).state;
    const injury = { source: null, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 100 } };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury, null), null).state;
    state = epHealing.applyHealing(elementalRecovery, epHealing.calculateHealing(state, elementalRecovery, null), null).state;
    const recovery = { source: null, target, parameters: { power: 30, multiplier: 1 } };
    state = hpHealing.applyHealing(recovery, hpHealing.calculateHealing(state, recovery, null), null).state;
    state = update(state, target, units.setHook(epDamage.receiving, {
        priority: 0,
        id: "reduction",
        invoke: (current, _context, pending) => ({
            state: current,
            value: { ...pending, amount: pending.amount - 200 },
        }),
    }));
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury, null), null).state;

    for (const [operation, direction] of [[hpDamage, hpDecrease], [hpHealing, hpIncrease], [epDamage, epDamage]]) {
        state = update(state, target, units.setHook(operation.beforeReceive, {
            priority: 0,
            id: "cancel",
            invoke: (current, { forbidden }, pending) => ({
                state: current,
                value: direction.cancel(pending, "UNSPECIFIED", forbidden),
            }),
        }));
    }
    const cancelledDamage = hpDamage.applyDamage(hp, hpDamage.calculateDamage(state, hp, null), null);
    const cancelledHealing = hpHealing.applyHealing(recovery, hpHealing.calculateHealing(cancelledDamage.state, recovery, null), null);
    const cancelledInjury = epDamage.applyDamage(injury, epDamage.calculateDamage(cancelledHealing.state, injury, null), null);
    assert.deepEqual(
        [cancelledDamage.value.type, cancelledHealing.value.type, cancelledInjury.value.type],
        ["CANCELLED", "CANCELLED", "CANCELLED"],
    );

    const events = [
        { type: "DAMAGE", targetUnitId: 0, amount: 50, damageType: "ELEMENTAL", tick: 0 },
        { type: "ELEMENTAL_INJURY_HEALED", targetUnitId: 0, amount: 0, tick: 0 },
        { type: "ELEMENTAL_INJURY", targetUnitId: 0, amount: 100, elementType: "NEURAL", tick: 0 },
        { type: "ELEMENTAL_INJURY_HEALED", targetUnitId: 0, amount: 40, tick: 0 },
        { type: "HEAL", targetUnitId: 0, amount: 30, tick: 0 },
        { type: "ELEMENTAL_INJURY", targetUnitId: 0, amount: 0, elementType: "NEURAL", tick: 0 },
        { type: "DAMAGE", targetUnitId: 0, amount: 0, damageType: "ELEMENTAL", tick: 0 },
        { type: "HEAL", targetUnitId: 0, amount: 0, tick: 0 },
    ];
    assert.deepEqual(step(cancelledInjury.state, []).events, []);
    assert.deepEqual(cancelledInjury.state.events, events);
});

test("EVENT-02: a Burst keeps its original position through movement and death in the same Tick", () => {
    let state = battle([{ hooks: Hooks.empty(), initial: {}, definition: {
        id: "receiver", hooks: Hooks.empty(), elemental, presence: {},
        vitality: defineVitality(2000),
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const injury = { source: null, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "BURN", power: 1000 } };
    state = epDamage.applyDamage(injury, epDamage.calculateDamage(state, injury, null), null).state;
    state = update(state, target, presence.appear([4, 1]));
    const lethal = {
        source: null, target,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 2000, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(state, lethal, null), null).state;

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
