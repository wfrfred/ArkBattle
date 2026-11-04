import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as hpHealing from "../../dist/core/battle/healing/hp/index.js";
import * as epHealing from "../../dist/core/battle/healing/ep/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import { update } from "../../dist/core/battle/unit.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { TacticalDemoPresentation } from "../../dist/legacy/tactical-demo-presentation.js";
import { select, elementHealing, first } from "../../dist/core/battle/targeting/index.js";

import { createArknightsElementalDefinition } from "../../dist/data/arknights/elemental.js";
const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), spatialPresence: {}, allegiance: { side: "ALLY" },
    targetable: { restrictions: [] },
    elemental: createArknightsElementalDefinition({ receiver: "CHARACTER", recoveryPerSecond: 15 }),
};

test("HP Healing calculates output before reception and full HP still notifies both self-target roles", () => {
    const calls = [];
    let state = battle([{ definition: {
        id: "patient", hooks: Hooks.empty(), vitality: { maxHp: 100.5, defense: 0, resistance: 0 },
    }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    assert.equal(get(state, 0).vitality.hp, 100.5);
    state = update(state, [
        vitality.setHook(target, "healingReceiving", {
            id: "receive", invoke(current, _context, pending) { calls.push("receive"); return { state: current, value: pending }; },
        }),
        units.setHook(target, hpHealing.targetApplied, {
            id: "target", invoke(current) { calls.push("target"); return { state: current, value: undefined }; },
        }),
        units.setHook(target, hpHealing.sourceApplied, {
            id: "source", invoke(current) { calls.push("source"); return { state: current, value: undefined }; },
        }),
    ]);
    const zero = { source: target, target, parameters: { power: 0, multiplier: 1 } };
    assert.equal(hpHealing.applyHealing(zero, hpHealing.calculateHealing(state, zero)).value.kind, "REJECTED");
    assert.deepEqual(calls, []);
    const request = { source: target, target, parameters: { power: 25, multiplier: 2 } };
    const calculated = hpHealing.calculateHealing(state, request);
    assert.equal(calculated.value.amount, 50);
    assert.equal(get(calculated.state, 0).vitality.hp, 100.5);
    assert.deepEqual(calls, []);
    const full = hpHealing.applyHealing(request, calculated);
    assert.equal(full.value.kind, "APPLIED");
    assert.deepEqual(full.value.application, { hpBefore: 100.5, hpAfter: 100.5, hpGain: 0 });
    assert.deepEqual(calls, ["receive", "target", "source"]);
});

test("EP-01/03: losses stay per element, healing gives every bar the full amount, and natural recovery is separate", () => {
    let healingNotices = 0;
    const hooks = Hooks.empty().set(epHealing.targetApplied, {
        id: "ordinary-healing",
        invoke(state) {
            healingNotices++;
            return { state, value: undefined };
        },
    });
    let state = battle([{ definition: { ...elementalReceiver, hooks }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    for (const [type, power] of [["NEURAL", 200], ["EROSION", 80], ["BURN", 40]]) {
        const incoming = { target, type, power, source: null };
        state = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming)).state;
    }
    assert.deepEqual(get(state, 0).elemental.ep, {
        NEURAL: 800, EROSION: 920, BURN: 960, NECROSIS: 1000,
    });
    const incoming = { target, source: null, power: 100 };
    const zero = { ...incoming, power: 0 };
    assert.equal(epHealing.applyHealing(zero, epHealing.calculateHealing(state, zero)).value.kind, "REJECTED");
    assert.equal(healingNotices, 0);
    const restored = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming));
    assert.deepEqual(restored.value.application.epGain, {
        NEURAL: 100, EROSION: 80, BURN: 40, NECROSIS: 0,
    });
    state = elemental.advance({ ...restored.state, tick: 1 }, target);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 900.5);
    assert.equal(healingNotices, 1);
    assert.equal("vitality" in get(state, 0), false);

    const toppedUp = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming));
    const full = epHealing.applyHealing(incoming, epHealing.calculateHealing(toppedUp.state, incoming));
    assert.equal(full.value.kind, "APPLIED");
    assert.deepEqual(full.value.application.epGain, elemental.elementValues(0));
    assert.equal(healingNotices, 3);

    const selection = {
        source: target, purposes: ["ELEMENTAL_INJURY_HEALED"],
        filter: elementHealing({ power: 100 }), selector: first(1, () => 0),
    };
    assert.deepEqual(select(full.state, selection).value, []);
    state = update(full.state, [elemental.setContribution(target, "maxEp", {
        id: "larger-pool", value: [modifier({ multiplier: 1 })],
    })]);
    const current = get(state, 0);
    const maximum = elemental.resolveMaxEp(state, current);
    assert.equal(maximum, 2000);
    assert.equal(elemental.resolveDamageRatio(state, current), 0.5);
    assert.deepEqual(select(state, selection).value.map(reference => reference.id), [0]);
    const view = new TacticalDemoPresentation({ lookup() {} });
    assert.equal(view.elements(state)[0][2], 0.5);
});
