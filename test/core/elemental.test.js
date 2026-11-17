// Contract: [elemental](../../docs/architecture/elemental.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/battle/unit.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as epDamage from "../../dist/core/battle/resource/ep/damage/index.js";
import * as epHealing from "../../dist/core/battle/resource/ep/healing/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { createStun } from "../../dist/core/effects/elemental/neural.js";
import { createSpDrain } from "../../dist/core/effects/elemental/necrosis.js";
import { silence, blockSpRecovery } from "../../dist/core/effects/control.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { elementHealing } from "../../dist/core/battle/targeting/index.js";
import { hasTargetable } from "../../dist/core/unit/capability/targetable/capability.js";
import { createArknightsElementalDefinition } from "../../dist/data/effect/elemental.js";

const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), presence: {}, allegiance: { side: "ALLY" },
    vitality: { maxHp: 10000, defense: 0, resistance: 50, recoverySpeed: 0, recoveryRatio: 0 },
    elemental: createArknightsElementalDefinition({ receiver: "CHARACTER" }),
};

const recoveringElementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), presence: {}, allegiance: { side: "ALLY" },
    targetable: { taunt: 0, restrictions: [] },
    elemental: createArknightsElementalDefinition({ receiver: "CHARACTER", recoveryPerSecond: 15 }),
};

function injuryRequest(target, type, power, source = null) {
    return { target, source, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
}

test("EP-03: Burst recovery continues while absent, refills EP with the current budget and releases its output", () => {
    let state = battle([{ definition: elementalReceiver, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "BURN", power: 1000 } };
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    const burst = started.value.application.burst;
    state = started.state;
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 30);
    assert.equal(epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming)).value.type, "REJECTED");
    const heal = { target, source: null, parameters: { power: 100 } };
    assert.equal(epHealing.applyHealing(heal, epHealing.calculateHealing(state, heal)).value.type, "REJECTED");
    state = update(state, target, presence.disappear());
    state = effects.advance({ ...state, tick: 1 });
    for (const value of Object.values(get(state, 0).elemental.ep)) {
        assert.ok(Math.abs(value - 1000 / 300) < 1e-8);
    }
    state = update(state, target, elemental.setContribution("burstRecoverySpeed", {
        id: "clock", value: [modifier({ finalScaler: 0 })],
    }));
    for (let tick = 2; tick <= 4; tick++) {
        state = effects.advance({ ...state, tick });
    }
    state = update(state, target, units.compose(elemental.setContribution("burstRecoverySpeed", {
            id: "clock", value: [modifier({ finalScaler: 2 })],
        }), elemental.setContribution("maxEp", {
            id: "capacity", value: [modifier({ addition: 1000 })],
        })));
    state = effects.advance({ ...state, tick: 5 });
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(20));
    for (let tick = 6; tick <= 154; tick++) {
        state = effects.advance({ ...state, tick });
    }
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(elemental.get(state, burst), undefined);
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
    state = update(state, target, presence.appear([0, 0]));
    const restart = { ...incoming, parameters: { ...incoming.parameters, power: 2000 } };
    const restarted = epDamage.applyDamage(restart, epDamage.calculateDamage(state, restart));
    state = elemental.cancel(restarted.state, restarted.value.application.burst, "CONTENT");
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
});

test("EP-06: reducing recovery preserves elapsed time, immediately refills from current MaxEP and does not replay periodic output", () => {
    let healed = 0;
    const hooks = Hooks.empty().set(elemental.healed, {
        id: "ordinary-healing",
        invoke(state) { healed++; return { state, value: undefined }; },
    });
    let state = battle([{ definition: { ...elementalReceiver, hooks }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = injuryRequest(target, "NECROSIS", 1000);
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    const burst = started.value.application.burst;
    state = started.state;
    for (let tick = 1; tick <= 30; tick++) {
        state = effects.advance({ ...state, tick });
    }
    const hp = get(state, 0).vitality.health.hp;
    const damageEvents = state.events.filter(event => event.type === "DAMAGE");
    assert.equal(damageEvents.length, 1);
    assert.equal(get(state, 0).effects.values().some(effect => effect.definition === silence), true);
    state = update(state, target, elemental.setContribution("maxEp", {
        id: "capacity", value: [modifier({ addition: 1000 })],
    }));

    state = elemental.reduceDuration(state, burst, 150);
    assert.deepEqual(elemental.get(state, burst).expiration, {
        type: "DURATION", duration: 300, remaining: 270, rate: 0,
    });
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(200));

    state = elemental.reduceDuration(state, burst, 270);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(elemental.get(state, burst), undefined);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(get(state, 0).effects.values().some(effect =>
        effect.definition === silence || effect.definition === blockSpRecovery), false);
    assert.equal(get(state, 0).vitality.health.hp, hp);
    assert.deepEqual(state.events.filter(event => event.type === "DAMAGE"), damageEvents);
    assert.equal(healed, 0);
});

test("EP-06: immediate recovery completion retains independent stun and cannot overwrite a reentrant Burst", () => {
    let original;
    let restarted;
    const hooks = Hooks.empty().set(elemental.burstEnded, {
        id: "restart-recovery",
        invoke(state, { event }) {
            if (event.burst.id !== original.id) return { state, value: undefined };
            const incoming = injuryRequest(event.burst.host, "BURN", 1000);
            const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
            restarted = result.value.application.burst;
            return { state: result.state, value: undefined };
        },
    });
    const definition = {
        ...elementalReceiver, hooks,
        locomotion: {
            speed: 1, minSpeed: 0, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
        },
    };
    let state = battle([{ definition, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = injuryRequest(target, "NEURAL", 1000);
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    original = started.value.application.burst;
    state = started.state;
    for (let tick = 1; tick <= 30; tick++) {
        state = effects.advance({ ...state, tick });
    }

    state = elemental.reduceDuration(state, original, 270);
    assert.equal(elemental.get(state, original), undefined);
    assert.notEqual(restarted.id, original.id);
    assert.deepEqual(get(state, 0).elemental.burst, restarted);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(0));
    assert.deepEqual(elemental.get(state, restarted).expiration, {
        type: "DURATION", duration: 300, remaining: 300, rate: 0,
    });
    assert.equal(elemental.reduceDuration(state, original, 1), state);

    for (let tick = 31; tick < 300; tick++) {
        state = effects.advance({ ...state, tick });
    }
    const goal = { nextPoint: [0.5, 0], goal: [0.5, 0] };
    const movement = { mode: "WALK", speedMultiplier: 1 };
    state = locomotion.advance(state, target, goal, movement);
    assert.deepEqual(get(state, 0).position, [0, 0]);
    state = effects.advance({ ...state, tick: 300 });
    state = locomotion.advance(state, target, goal, movement);
    assert.deepEqual(get(state, 0).position, goal.goal);
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
    const neural = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1000 } };
    const result = epDamage.applyDamage(neural, epDamage.calculateDamage(state, neural));
    state = result.state;
    assert.equal(get(state, 0).vitality.health.hp, 9000);
    assert.equal(elemental.get(state, result.value.application.burst), undefined);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    const goal = { nextPoint: [0.5, 0], goal: [0.5, 0] };
    const movement = { mode: "WALK", speedMultiplier: 1 };
    state = locomotion.advance(state, target, goal, movement);
    assert.deepEqual(get(state, 0).position, [0, 0]);
    state = effects.advance({ ...state, tick: 300 });
    state = locomotion.advance(state, target, goal, movement);
    assert.deepEqual(get(state, 0).position, goal.goal);

    const necrosis = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NECROSIS", power: 1000 } };
    state = epDamage.applyDamage(necrosis, epDamage.calculateDamage(state, necrosis)).state;
    state = effects.advance({ ...state, tick: 750 });
    assert.equal(get(state, 0).vitality.health.hp, 9000);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(state.events.filter(event => event.type === "DAMAGE").length, 1);
});

test("EP-02: depletion registers the Burst and completes standard output before resource notifications and Applied", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", invoke: (current, _context, pending) => {
                order.push("program");
                return { state: current, value: pending };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([
        { definition: {
            ...elementalReceiver, hooks,
            vitality: { maxHp: 10000, defense: 0, resistance: 50, recoverySpeed: 0, recoveryRatio: 0 },
        }, position: [0, 0] },
        { definition: { id: "source", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    state = update(state, target, units.compose(units.setHook(elemental.burstStarted, {
            id: "creation", invoke(current, { event }) {
                order.push("started");
                const reference = effects.ref(event);
                assert.equal(get(current, 0).elemental.burst.id, reference.id);
                return { state: current, value: undefined };
            },
        }), units.setHook(elemental.damaged, {
            id: "loss", invoke(current) { order.push("damaged"); return { state: current, value: undefined }; },
        })));
    const preceding = injuryRequest(target, "NEURAL", 200);
    state = epDamage.applyDamage(preceding, epDamage.calculateDamage(state, preceding)).state;
    order.length = 0;
    const incoming = injuryRequest(target, "BURN", 1000, source);
    const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    assert.deepEqual(order, ["started", "program", "damaged", "applied"]);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(0));
    assert.equal(get(result.state, 0).vitality.health.hp, 9160);
    assert.equal(vitality.resolveResistance(result.state, get(result.state, 0)), 30);
    assert.deepEqual(elemental.get(result.state, result.value.application.burst).source, source);

});

test("EP-02: cancelling a newly registered Burst suppresses standard output without rewriting the loss report", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", invoke: (current, _context, pending) => {
                order.push("program"); return { state: current, value: pending };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([{ definition: {
        ...elementalReceiver, hooks,
        vitality: { maxHp: 10000, defense: 0, resistance: 50, recoverySpeed: 0, recoveryRatio: 0 },
    }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    state = update(state, target, units.compose(units.compose(units.setHook(elemental.burstStarted, {
            id: "cancel", invoke(current, { event }) {
                order.push("started");
                return { state: elemental.cancel(current, effects.ref(event), "CONTENT"), value: undefined };
            },
        }), units.setHook(elemental.burstEnded, {
            id: "end", invoke(current) { order.push("ended"); return { state: current, value: undefined }; },
        })), units.setHook(elemental.damaged, {
            id: "loss", invoke(current, { event }) {
                order.push("damaged");
                assert.equal(event.epLoss, 1000);
                return { state: current, value: undefined };
            },
        })));
    const incoming = injuryRequest(target, "BURN", 1000);
    const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    assert.deepEqual(order, ["started", "ended", "damaged", "applied"]);
    assert.equal(result.value.application.epAfter, 0);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(1000));
    assert.equal(get(result.state, 0).elemental.burst, null);
    assert.equal(get(result.state, 0).vitality.health.hp, 10000);
    assert.equal(vitality.resolveResistance(result.state, get(result.state, 0)), 50);
});

test("EP-01/03: losses stay per element, healing gives every bar the full amount, and natural recovery is separate", () => {
    let healingNotices = 0;
    let resourceNotices = 0;
    const hooks = Hooks.empty().set(epHealing.beforeReceive, {
        id: "healing-reduction",
        invoke(state, _context, pending) {
            return { state, value: { ...pending, amount: pending.amount - 100 } };
        },
    }).set(elemental.healed, {
        id: "actual-recovery",
        invoke(state) {
            resourceNotices++;
            return { state, value: undefined };
        },
    }).set(epHealing.targetApplied, {
        id: "ordinary-healing",
        invoke(state) {
            healingNotices++;
            return { state, value: undefined };
        },
    });
    let state = battle([{ definition: { ...recoveringElementalReceiver, hooks }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    for (const [type, power] of [["NEURAL", 200], ["EROSION", 80], ["BURN", 40]]) {
        const incoming = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
        state = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming)).state;
    }
    assert.deepEqual(get(state, 0).elemental.ep, {
        NEURAL: 800, EROSION: 920, BURN: 960, NECROSIS: 1000, MANIA: 1000,
    });
    const incoming = { target, source: null, parameters: { power: 200 } };
    const restored = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming));
    assert.deepEqual(restored.value.received, { amount: 100, cancellation: null });
    assert.deepEqual(restored.value.application.epGain, {
        NEURAL: 100, EROSION: 80, BURN: 40, NECROSIS: 0, MANIA: 0,
    });
    state = elemental.advance({ ...restored.state, tick: 1 }, target);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 900.5);
    assert.equal(healingNotices, 1);
    assert.equal(resourceNotices, 1);
    assert.equal("vitality" in get(state, 0), false);

    const toppedUp = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming));
    const full = epHealing.applyHealing(incoming, epHealing.calculateHealing(toppedUp.state, incoming));
    assert.equal(full.value.type, "APPLIED");
    assert.deepEqual(full.value.application.epGain, elemental.elementValues(0));
    assert.equal(healingNotices, 3);
    assert.equal(resourceNotices, 2);

    const recipients = state => units.all(state)
        .filter(hasTargetable)
        .filter(elementHealing(state, units.get(state, target)))
        .map(units.ref)
        .toArray();
    assert.deepEqual(recipients(full.state), []);
    state = update(full.state, target, elemental.setContribution("maxEp", {
        id: "larger-pool", value: [modifier({ multiplier: 1 })],
    }));
    const current = get(state, 0);
    const maximum = elemental.resolveMaxEp(state, current);
    assert.equal(maximum, 2000);
    assert.equal(elemental.resolveDamageRatio(state, current), 0.5);
    assert.deepEqual(recipients(state).map(reference => reference.id), [0]);

    const reducedRequest = { target, source: null, parameters: { power: 50 } };
    const reduced = epHealing.applyHealing(reducedRequest, epHealing.calculateHealing(state, reducedRequest));
    assert.equal(reduced.value.type, "APPLIED");
    assert.deepEqual(reduced.value.received, { amount: 0, cancellation: null });
    assert.deepEqual(reduced.value.application.epGain, elemental.elementValues(0));
    assert.deepEqual(get(reduced.state, 0).elemental.ep, current.elemental.ep);
    assert.equal(resourceNotices, 2);

    const smaller = update(full.state, target, elemental.setContribution("maxEp", {
        id: "smaller-pool", value: [modifier({ multiplier: -0.5 })],
    }));
    const zeroDamage = update(smaller, target, units.setHook(epDamage.receiving, {
        id: "zero-reception",
        invoke: (state, _context, pending) => ({ state, value: { ...pending, amount: 0 } }),
    }));
    const injury = { target, source: null, attackType: "BUFF", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1 } };
    const damaged = epDamage.applyDamage(injury, epDamage.calculateDamage(zeroDamage, injury));
    const healed = epHealing.applyHealing(incoming, epHealing.calculateHealing(smaller, incoming));
    assert.equal(damaged.value.type, "APPLIED");
    assert.equal(healed.value.type, "APPLIED");
    assert.equal(damaged.value.application.epAfter, 500);
    assert.deepEqual(healed.value.application.epAfter, elemental.elementValues(500));
    assert.deepEqual([get(damaged.state, 0).elemental.ep, get(healed.state, 0).elemental.ep], [
        elemental.elementValues(500), elemental.elementValues(500),
    ]);
    assert.equal(resourceNotices, 2);
});
