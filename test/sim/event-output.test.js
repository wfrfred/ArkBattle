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
import { TacticalDemoPresentation } from "../../dist/legacy/tactical-demo-presentation.js";

import { createArknightsElementalDefinition } from "../../dist/data/arknights/elemental.js";
import { update } from "../../dist/core/battle/unit.js";

const elemental = createArknightsElementalDefinition({ receiver: "CHARACTER" });
const data = { lookup() {} };

test("EVENT-01: real HP and EP damage and healing produce the corresponding floating text", () => {
    let state = battle([{ definition: {
        id: "receiver", hooks: Hooks.empty(), elemental,
        vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    }, position: [1, 1] }]);
    const target = units.ref(get(state, 0));
    const hp = {
        source: null, target,
        parameters: { type: "ELEMENTAL", attack: { power: 50, multiplier: 1, addition: 0 } },
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

    const view = new TacticalDemoPresentation(data);
    assert.deepEqual(view.advance(state, state.events), [
        ["dmg", 0, 50, "true"],
        ["heal", 0, 0],
        ["dmg", 0, 100, "neural"],
        ["heal", 0, 40],
        ["heal", 0, 30],
        ["dmg", 0, 0, "neural"],
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
        parameters: { type: "TRUE", attack: { power: 2000, multiplier: 1, addition: 0 } },
    };
    state = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(state, lethal)).state;

    assert.equal(get(state, 0), undefined);
    const view = new TacticalDemoPresentation(data);
    assert.deepEqual(view.advance(state, state.events), [
        ["dmg", 0, 1000, "burn"],
        ["fx", "burst", 1, 1, { id: 0, element: "burn" }],
        ["dmg", 0, 1200, "arts"],
        ["dmg", 0, 800, "true"],
        ["die", 0, "killed"],
    ]);
    assert.deepEqual(view.units(state)[0].info.x, 4);
});

test("EVENT-03: UI output displays a route exit without changing simulation facts", () => {
    const initial = battle([{ definition: {
        id: "traveller", hooks: Hooks.empty(),
    }, position: [1, 1] }]);
    const output = appendEvents(initial, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);

    assert.equal(get(output, 0).lifecycle, "PRESENT");
    assert.deepEqual(new TacticalDemoPresentation(data).advance(output, output.events), [["leak", 0]]);
    const next = step(output, []);
    assert.deepEqual(next.events, []);
    assert.equal(get(next, 0).lifecycle, "PRESENT");
    assert.deepEqual(output.events, [{ type: "ROUTE_COMPLETED", unitId: 0, tick: 0 }]);
});
