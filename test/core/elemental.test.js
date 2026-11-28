// Contract: [elemental](../../docs/architecture/elemental.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { attribute as defineAttribute, vitality as defineVitality, elemental as defineElemental } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/unit/operations.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as epDamage from "../../dist/core/battle/resource/ep/damage/index.js";
import * as epHealing from "../../dist/core/battle/resource/ep/healing/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as effects from "../../dist/core/effect/index.js";
import * as locomotion from "../../dist/core/unit/capability/locomotion/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { createStun } from "../../dist/core/effects/elemental/neural.js";
import { createSpDrain } from "../../dist/core/effects/elemental/necrosis.js";
import { silence, blockSpRecovery } from "../../dist/core/effects/control.js";
import { create as modifier } from "../../dist/core/common/modifier.js";
import { elementHealing } from "../../dist/core/battle/targeting/index.js";
import { hasTargetable } from "../../dist/core/unit/capability/targetable/capability.js";
import { allyBursts } from "../../dist/core/effects/elemental/index.js";

const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), presence: {}, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
    vitality: defineVitality(10000, { resistance: defineAttribute(50, 0, 100) }),
    elemental: defineElemental(allyBursts),
};

const recoveringElementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), presence: {}, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
    targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] },
    elemental: defineElemental(allyBursts, 15),
};

function injuryRequest(target, type, power, source = null) {
    return { target, source, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
}

test("EP-03: Burst recovery continues while absent, refills EP with the current budget and releases its output", () => {
    let state = battle([{ definition: elementalReceiver, hooks: Hooks.empty(), initial: {}, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "BURN", power: 1000 } };
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
    const burst = started.value.application.burst;
    state = started.state;
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 30);
    assert.equal(epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null).value.type, "REJECTED");
    const heal = { target, source: null, parameters: { power: 100 } };
    assert.equal(epHealing.applyHealing(heal, epHealing.calculateHealing(state, heal, null), null).value.type, "REJECTED");
    state = update(state, target, presence.disappear());
    state = effects.advance({ ...state, tick: 1 });
    for (const value of Object.values(get(state, 0).elemental.ep)) {
        assert.ok(Math.abs(value - 1000 / 300) < 1e-8);
    }
    state = update(state, target, elemental.setContribution("burstRecoverySpeed", {
        id: "clock", group: null, value: [modifier({ finalScaler: 0 })],
    }));
    for (let tick = 2; tick <= 4; tick++) {
        state = effects.advance({ ...state, tick });
    }
    state = update(state, target, units.compose(elemental.setContribution("burstRecoverySpeed", {
            id: "clock", group: null, value: [modifier({ finalScaler: 2 })],
        }), elemental.setRange("maxEp", { min: 2000, max: null })));
    state = effects.advance({ ...state, tick: 5 });
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(20));
    for (let tick = 6; tick <= 154; tick++) {
        state = effects.advance({ ...state, tick });
    }
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(elemental.getCurrentBurst(state, burst), undefined);
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
    state = update(state, target, presence.appear([0, 0]));
    const restart = { ...incoming, parameters: { ...incoming.parameters, power: 2000 } };
    const restarted = epDamage.applyDamage(restart, epDamage.calculateDamage(state, restart, null), null);
    state = elemental.cancel(restarted.state, restarted.value.application.burst, "CONTENT");
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(vitality.resolveResistance(state, get(state, 0)), 50);
    state = update(state, target, elemental.clearRange("maxEp"));
    assert.equal(elemental.resolveMaxEp(state, get(state, 0)), 1000);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    state = elemental.advance(state, target);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
});

test("EP-06: reducing recovery preserves elapsed time, immediately refills from current MaxEP and does not replay periodic output", () => {
    let healed = 0;
    const hooks = Hooks.empty().set(elemental.healed, {
        id: "ordinary-healing", priority: 0,
        invoke(state) { healed++; return { state, value: undefined }; },
    });
    let state = battle([{ definition: { ...elementalReceiver, hooks }, hooks: Hooks.empty(), initial: {}, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = injuryRequest(target, "NECROSIS", 1000);
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
    const burst = started.value.application.burst;
    state = started.state;
    for (let tick = 1; tick <= 30; tick++) {
        state = effects.advance({ ...state, tick });
    }
    const hp = get(state, 0).vitality.health.hp;
    const damageEvents = state.events.filter(event => event.type === "DAMAGE");
    assert.equal(damageEvents.length, 1);
    assert.equal(effects.forHost(state, units.ref(get(state, 0))).some(effect => effect.definition === silence), true);
    state = update(state, target, elemental.setContribution("maxEp", {
        id: "capacity", group: null, value: [modifier({ addition: 1000 })],
    }));

    state = elemental.reduceDuration(state, burst, 150);
    assert.deepEqual(elemental.getCurrentBurst(state, burst).expiration, {
        type: "DURATION", duration: 300, remaining: 270, rate: 0,
    });
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(200));

    state = elemental.reduceDuration(state, burst, 270);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(elemental.getCurrentBurst(state, burst), undefined);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(2000));
    assert.equal(effects.forHost(state, units.ref(get(state, 0))).some(effect =>
        effect.definition === silence || effect.definition === blockSpRecovery), false);
    assert.equal(get(state, 0).vitality.health.hp, hp);
    assert.deepEqual(state.events.filter(event => event.type === "DAMAGE"), damageEvents);
    assert.equal(healed, 0);
});

test("EP-06: immediate recovery completion retains independent stun and cannot overwrite a reentrant Burst", () => {
    let original;
    let restarted;
    const hooks = Hooks.empty().set(elemental.burstEnded, {
        id: "restart-recovery", priority: 0,
        invoke(state, { event }) {
            if (effects.ref(event.burst) !== original) return { state, value: undefined };
            const incoming = injuryRequest(event.burst.ref.host, "BURN", 1000);
            const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
            restarted = result.value.application.burst;
            return { state: result.state, value: undefined };
        },
    });
    const definition = {
        ...elementalReceiver, hooks,
        locomotion: {
            speed: defineAttribute(1), halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
        },
    };
    let state = battle([{ definition, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = injuryRequest(target, "NEURAL", 1000);
    const started = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
    original = started.value.application.burst;
    state = started.state;
    for (let tick = 1; tick <= 30; tick++) {
        state = effects.advance({ ...state, tick });
    }

    state = elemental.reduceDuration(state, original, 270);
    assert.equal(elemental.getCurrentBurst(state, original), undefined);
    assert.notEqual(restarted, original);
    assert.deepEqual(get(state, 0).elemental.burst, restarted);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(0));
    assert.deepEqual(elemental.getCurrentBurst(state, restarted).expiration, {
        type: "DURATION", duration: 300, remaining: 300, rate: 0,
    });
    assert.equal(elemental.reduceDuration(state, original, 1), state);

    for (let tick = 31; tick < 300; tick++) {
        state = effects.advance({ ...state, tick });
    }
    const goal = { nextPoint: [0.5, 0], goal: [0.5, 0] };
    state = units.update(state, target, locomotion.setTarget(goal));
    state = locomotion.advance(state, target);
    assert.deepEqual(get(state, 0).position, [0, 0]);
    state = effects.advance({ ...state, tick: 300 });
    state = locomotion.advance(state, target);
    assert.deepEqual(get(state, 0).position, goal.goal);
});

test("EP-03: zero recovery budgets keep installation output and independent stun without later periodic output", () => {
    const definition = {
        ...elementalReceiver,
        locomotion: {
            speed: defineAttribute(1), halfBodyWidth: 0,
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
    let state = battle([{ definition, hooks: Hooks.empty(), initial: { locomotion: { mode: "WALK" } }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const neural = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1000 } };
    const result = epDamage.applyDamage(neural, epDamage.calculateDamage(state, neural, null), null);
    state = result.state;
    assert.equal(get(state, 0).vitality.health.hp, 9000);
    assert.equal(elemental.getCurrentBurst(state, result.value.application.burst), undefined);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    const goal = { nextPoint: [0.5, 0], goal: [0.5, 0] };
    state = units.update(state, target, locomotion.setTarget(goal));
    state = locomotion.advance(state, target);
    assert.deepEqual(get(state, 0).position, [0, 0]);
    state = effects.advance({ ...state, tick: 300 });
    state = locomotion.advance(state, target);
    assert.deepEqual(get(state, 0).position, goal.goal);

    const necrosis = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NECROSIS", power: 1000 } };
    state = epDamage.applyDamage(necrosis, epDamage.calculateDamage(state, necrosis, null), null).state;
    state = effects.advance({ ...state, tick: 750 });
    assert.equal(get(state, 0).vitality.health.hp, 9000);
    assert.equal(get(state, 0).elemental.burst, null);
    assert.equal(state.events.filter(event => event.type === "DAMAGE").length, 1);
});

test("EP-02: depletion registers the Burst and completes standard output before resource notifications and Applied", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", priority: 0, invoke: (current, _context, pending) => {
                order.push("program");
                return { state: current, value: pending };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", priority: 0, invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([
        { definition: {
            ...elementalReceiver, hooks,
            vitality: defineVitality(10000, { resistance: defineAttribute(50, 0, 100) }),
        }, hooks: Hooks.empty(), initial: {}, position: [0, 0] },
        { definition: { id: "source", hooks: Hooks.empty() }, hooks: Hooks.empty(), initial: {}, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    state = update(state, target, units.compose(units.setHook(elemental.burstStarted, {
            id: "creation", priority: 0, invoke(current, { event }) {
                order.push("started");
                const reference = effects.ref(event);
                assert.equal(get(current, 0).elemental.burst, reference);
                return { state: current, value: undefined };
            },
        }), units.setHook(elemental.damaged, {
            id: "loss", priority: 0, invoke(current) { order.push("damaged"); return { state: current, value: undefined }; },
        })));
    const preceding = injuryRequest(target, "NEURAL", 200);
    state = epDamage.applyDamage(preceding, epDamage.calculateDamage(state, preceding, null), null).state;
    order.length = 0;
    const incoming = injuryRequest(target, "BURN", 1000, source);
    const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
    assert.deepEqual(order, ["started", "program", "damaged", "applied"]);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(0));
    assert.equal(get(result.state, 0).vitality.health.hp, 9160);
    assert.equal(vitality.resolveResistance(result.state, get(result.state, 0)), 30);
    assert.deepEqual(elemental.getCurrentBurst(result.state, result.value.application.burst).source, source);

});

test("EP-02: cancelling a newly registered Burst suppresses standard output without rewriting the loss report", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", priority: 0, invoke: (current, _context, pending) => {
                order.push("program"); return { state: current, value: pending };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", priority: 0, invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([{ definition: {
        ...elementalReceiver, hooks,
        vitality: defineVitality(10000, { resistance: defineAttribute(50, 0, 100) }),
    }, hooks: Hooks.empty(), initial: {}, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    state = update(state, target, units.compose(units.compose(units.setHook(elemental.burstStarted, {
            id: "cancel", priority: 0, invoke(current, { event }) {
                order.push("started");
                return { state: elemental.cancel(current, effects.ref(event), "CONTENT"), value: undefined };
            },
        }), units.setHook(elemental.burstEnded, {
            id: "end", priority: 0, invoke(current) { order.push("ended"); return { state: current, value: undefined }; },
        })), units.setHook(elemental.damaged, {
            id: "loss", priority: 0, invoke(current, { event }) {
                order.push("damaged");
                assert.equal(event.epLoss, 1000);
                return { state: current, value: undefined };
            },
        })));
    const incoming = injuryRequest(target, "BURN", 1000);
    const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null);
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
        id: "healing-reduction", priority: 0,
        invoke(state, _context, pending) {
            return { state, value: { ...pending, amount: pending.amount - 100 } };
        },
    }).set(elemental.healed, {
        id: "actual-recovery", priority: 0,
        invoke(state) {
            resourceNotices++;
            return { state, value: undefined };
        },
    }).set(epHealing.targetApplied, {
        id: "ordinary-healing", priority: 0,
        invoke(state) {
            healingNotices++;
            return { state, value: undefined };
        },
    });
    let state = battle([{ definition: { ...recoveringElementalReceiver, hooks }, hooks: Hooks.empty(), initial: {}, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    for (const [type, power] of [["NEURAL", 200], ["EROSION", 80], ["BURN", 40]]) {
        const incoming = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
        state = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming, null), null).state;
    }
    assert.deepEqual(get(state, 0).elemental.ep, {
        NEURAL: 800, EROSION: 920, BURN: 960, NECROSIS: 1000, MANIA: 1000,
    });
    const incoming = { target, source: null, parameters: { power: 200 } };
    const restored = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming, null), null);
    assert.deepEqual(restored.value.received, { amount: 100 });
    assert.deepEqual(restored.value.application.epGain, {
        NEURAL: 100, EROSION: 80, BURN: 40, NECROSIS: 0, MANIA: 0,
    });
    state = elemental.advance({ ...restored.state, tick: 1 }, target);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 900.5);
    assert.equal(healingNotices, 1);
    assert.equal(resourceNotices, 1);
    assert.equal("vitality" in get(state, 0), false);

    const toppedUp = epHealing.applyHealing(incoming, epHealing.calculateHealing(state, incoming, null), null);
    const full = epHealing.applyHealing(incoming, epHealing.calculateHealing(toppedUp.state, incoming, null), null);
    assert.equal(full.value.type, "APPLIED");
    assert.deepEqual(full.value.application.epGain, elemental.elementValues(0));
    assert.equal(healingNotices, 3);
    assert.equal(resourceNotices, 2);

    const recipients = state => units.all(state)
        .filter(hasTargetable)
        .filter(elementHealing(target.get(state))(state))
        .map(units.ref)
        .toArray();
    assert.deepEqual(recipients(full.state), []);
    state = update(full.state, target, elemental.setContribution("maxEp", {
        id: "larger-pool", group: null, value: [modifier({ multiplier: 1 })],
    }));
    const current = get(state, 0);
    const maximum = elemental.resolveMaxEp(state, current);
    assert.equal(maximum, 2000);
    assert.equal(elemental.resolveDamageRatio(state, current), 0.5);
    assert.deepEqual(recipients(state).map(reference => reference.id), [0]);

    const reducedRequest = { target, source: null, parameters: { power: 50 } };
    const reduced = epHealing.applyHealing(reducedRequest, epHealing.calculateHealing(state, reducedRequest, null), null);
    assert.equal(reduced.value.type, "APPLIED");
    assert.deepEqual(reduced.value.received, { amount: 0 });
    assert.deepEqual(reduced.value.application.epGain, elemental.elementValues(0));
    assert.deepEqual(get(reduced.state, 0).elemental.ep, current.elemental.ep);
    assert.equal(resourceNotices, 2);

    const smaller = update(full.state, target, elemental.setRange("maxEp", { min: null, max: 500 }));
    const zeroDamage = update(smaller, target, units.setHook(epDamage.receiving, {
        id: "zero-reception", priority: 0,
        invoke: (state, _context, pending) => ({ state, value: { ...pending, amount: 0 } }),
    }));
    const injury = { target, source: null, attackType: "BUFF", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 1 } };
    const damaged = epDamage.applyDamage(injury, epDamage.calculateDamage(zeroDamage, injury, null), null);
    const healed = epHealing.applyHealing(incoming, epHealing.calculateHealing(smaller, incoming, null), null);
    assert.equal(damaged.value.type, "APPLIED");
    assert.equal(healed.value.type, "APPLIED");
    assert.equal(damaged.value.application.epAfter, 500);
    assert.deepEqual(healed.value.application.epAfter, elemental.elementValues(500));
    assert.deepEqual([get(damaged.state, 0).elemental.ep, get(healed.state, 0).elemental.ep], [
        elemental.elementValues(500), elemental.elementValues(500),
    ]);
    assert.equal(resourceNotices, 2);
});
