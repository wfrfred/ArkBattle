import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update, remove } from "../../dist/core/battle/unit.js";
import * as damage from "../../dist/core/battle/damage/ep/index.js";
import * as healing from "../../dist/core/battle/healing/ep/index.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as lifetime from "../../dist/core/lifetime/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

function definition(config = {}, hooks = Hooks.empty(), program = {}) {
    return {
        id: "ep-receiver",
        hooks,
        spatialPresence: {},
        allegiance: { side: "ALLY" },
        elemental: {
            maxEp: 1000,
            recoveryPerSecond: 0,
            elementResistance: 0,
            damageResistance: 0,
            burstRecoverySpeed: 1,
            bursts: Object.fromEntries(elemental.ELEMENT_TYPES.map(type => [type, {
                durationTicks: 6,
                onStart: state => state,
                ...program,
            }])),
            ...config,
        },
    };
}

function request(target, type, power, source = null) {
    return { target, type, power, source };
}

test("EP-01: calculated resistance and element survive later state changes; HP elemental resistance is independent", () => {
    const sourceHooks = Hooks.empty().set(damage.sourceFormula, {
        id: "converted-output",
        invoke: (state, _context, current) => ({
            state,
            value: { ...current, type: "NEURAL", power: 200 },
        }),
    }).set(damage.output, {
        id: "output-bonus",
        invoke: (state, _context, amount) => ({ state, value: amount + 20 }),
    });
    let state = battle([
        { definition: {
            ...definition({ elementResistance: 50, damageResistance: 80 }),
            vitality: { maxHp: 1000, defense: 1000, resistance: 99 },
        }, position: [0, 0] },
        { definition: { id: "resource-free-source", hooks: sourceHooks }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    const incoming = request(target, "BURN", 100, source);
    const calculated = damage.calculateDamage(state, incoming);
    assert.deepEqual(calculated.value, { type: "NEURAL", amount: 120 });
    assert.equal(incoming.type, "BURN");
    assert.deepEqual(get(calculated.state, 0).elemental.ep, elemental.elementValues(1000));
    state = update(calculated.state, [
        elemental.setContribution(target, "elementResistance", {
            id: "changed-after-calculation", value: [modifier({ finalScaler: 0 })],
        }),
        elemental.setRule(target, "damage", {
            id: "only-neural", allows: (_current, { type }) => type === "NEURAL",
        }),
    ]);
    const preceding = request(target, "NEURAL", 50);
    state = damage.applyDamage(preceding, damage.calculateDamage(state, preceding)).state;
    const applied = damage.applyDamage(incoming, { ...calculated, state });
    assert.deepEqual(applied.value.application, {
        type: "NEURAL", epBefore: 950, epAfter: 830, epLoss: 120, burst: null,
    });
    assert.equal(get(applied.state, 0).elemental.ep.BURN, 1000);
    const hpRequest = {
        source: null,
        target,
        parameters: { type: "ELEMENTAL", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    const hp = hpDamage.applyDamage(hpRequest, hpDamage.calculateDamage(applied.state, hpRequest));
    assert.equal(hp.value.application.hpLoss, 20);
    assert.equal(get(hp.state, 0).elemental.ep.NEURAL, 830);
});

test("EP-01/03: losses stay per element, healing gives every bar the full amount, and natural recovery is separate", () => {
    let healingNotices = 0;
    const hooks = Hooks.empty().set(healing.targetApplied, {
        id: "ordinary-healing",
        invoke(state) {
            healingNotices++;
            return { state, value: undefined };
        },
    });
    let state = battle([{ definition: definition({ recoveryPerSecond: 15 }, hooks), position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    for (const [type, power] of [["NEURAL", 200], ["EROSION", 80], ["BURN", 40]]) {
        const incoming = request(target, type, power);
        state = damage.applyDamage(incoming, damage.calculateDamage(state, incoming)).state;
    }
    assert.deepEqual(get(state, 0).elemental.ep, {
        NEURAL: 800, EROSION: 920, BURN: 960, NECROSIS: 1000,
    });
    const incoming = { target, source: null, power: 100 };
    const restored = healing.applyHealing(incoming, healing.calculateHealing(state, incoming));
    assert.deepEqual(restored.value.application.epGain, {
        NEURAL: 100, EROSION: 80, BURN: 40, NECROSIS: 0,
    });
    state = elemental.advance({ ...restored.state, tick: 1 }, target);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 900.5);
    assert.equal(healingNotices, 1);
    assert.equal("vitality" in get(state, 0), false);
});

test("APPLY-02: zero output is rejected, while fully absorbed damage and full-bar healing notify both self-target roles", () => {
    const notices = [];
    let receptions = 0;
    const hooks = Hooks.empty()
        .set(damage.beforeReceive, {
            id: "receive", invoke: state => { receptions++; return { state, value: undefined }; },
        })
        .set(healing.beforeReceive, {
            id: "receive", invoke: state => { receptions++; return { state, value: undefined }; },
        })
        .set(damage.targetApplied, {
            id: "applied", invoke: state => { notices.push("damage-target"); return { state, value: undefined }; },
        })
        .set(damage.sourceApplied, {
            id: "applied", invoke: state => { notices.push("damage-source"); return { state, value: undefined }; },
        })
        .set(healing.targetApplied, {
            id: "applied", invoke: state => { notices.push("healing-target"); return { state, value: undefined }; },
        })
        .set(healing.sourceApplied, {
            id: "applied", invoke: state => { notices.push("healing-source"); return { state, value: undefined }; },
        });
    let state = battle([{ definition: definition({}, hooks), position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    state = update(state, [elemental.setDamageReceivingHook(target, {
        id: "full-barrier",
        invoke: (current, _context, pending) => ({ state: current, value: { ...pending, amount: 0 } }),
    })]);
    const noDamage = request(target, "BURN", 0, target);
    const noHealing = { target, source: target, power: 0 };
    assert.equal(damage.applyDamage(noDamage, damage.calculateDamage(state, noDamage)).value.kind, "REJECTED");
    assert.equal(healing.applyHealing(noHealing, healing.calculateHealing(state, noHealing)).value.kind, "REJECTED");
    assert.deepEqual(notices, []);
    assert.equal(receptions, 0);
    const hit = request(target, "BURN", 100, target);
    const absorbed = damage.applyDamage(hit, damage.calculateDamage(state, hit));
    assert.equal(absorbed.value.kind, "APPLIED");
    assert.equal(absorbed.value.application.epLoss, 0);
    const heal = { target, source: target, power: 100 };
    const full = healing.applyHealing(heal, healing.calculateHealing(absorbed.state, heal));
    assert.equal(full.value.kind, "APPLIED");
    assert.deepEqual(full.value.application.epGain, elemental.elementValues(0));
    assert.deepEqual(notices, ["damage-target", "damage-source", "healing-target", "healing-source"]);
    assert.equal(receptions, 2);
    assert.equal(full.state.events.some(event => event.type === "ELEMENT_DAMAGE" || event.type === "ELEMENT_HEAL"), false);
});

test("EP-02: depletion creates a usable Burst before its notifications and program, then runs Battle Applied", () => {
    const order = [];
    let bound;
    const program = {
        onStart(state, burst) {
            order.push("program");
            const installed = effects.install(state, burst.host, {
                id: "burst-dependent", initialize: () => ({}),
            }, { scopes: [lifetime.scope(elemental.lifetime, elemental.ref(burst))] });
            bound = installed.value;
            return installed.state;
        },
    };
    const hooks = Hooks.empty().set(damage.targetApplied, {
        id: "applied", invoke: state => { order.push("applied"); return { state, value: undefined }; },
    });
    let state = battle([
        { definition: definition({}, hooks, program), position: [0, 0] },
        { definition: { id: "source", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    state = update(state, [
        elemental.setHook(target, "burstStarted", {
            id: "creation", invoke(current, { event }) {
                order.push("started");
                assert.equal(elemental.get(current, elemental.ref(event)).status, "ACTIVE");
                return { state: current, value: undefined };
            },
        }),
        elemental.setHook(target, "damaged", {
            id: "loss", invoke(current) { order.push("damaged"); return { state: current, value: undefined }; },
        }),
    ]);
    const preceding = request(target, "NEURAL", 200);
    state = damage.applyDamage(preceding, damage.calculateDamage(state, preceding)).state;
    order.length = 0;
    const incoming = request(target, "BURN", 1000, source);
    const result = damage.applyDamage(incoming, damage.calculateDamage(state, incoming));
    assert.deepEqual(order, ["started", "damaged", "program", "applied"]);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(0));
    assert.equal(effects.get(result.state, bound).status, "ACTIVE");
    assert.deepEqual(elemental.get(result.state, result.value.application.burst).source, source);
    const sourceRemoved = remove(result.state, source.id, "SCRIPT");
    assert.equal(elemental.get(sourceRemoved, result.value.application.burst).status, "ACTIVE");
    const removed = remove(sourceRemoved, target.id, "SCRIPT");
    assert.equal(get(removed, 0), undefined);
    assert.equal(elemental.get(removed, result.value.application.burst), undefined);
    assert.equal(effects.get(removed, bound), undefined);
    assert.equal(removed.events.filter(event => event.type === "ELEMENT_BURST_ENDED").length, 1);
});

test("EP-02: cancelling a newly created Burst suppresses its startup without rewriting the damage report", () => {
    const order = [];
    const hooks = Hooks.empty().set(damage.targetApplied, {
        id: "applied", invoke: state => { order.push("applied"); return { state, value: undefined }; },
    });
    let state = battle([{ definition: definition({}, hooks, {
        onStart() { throw new Error("cancelled Burst startup"); },
        onEnd(current) { order.push("ended"); return current; },
    }), position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    state = update(state, [
        elemental.setHook(target, "burstStarted", {
            id: "cancel", invoke(current, { event }) {
                order.push("started");
                return { state: elemental.cancel(current, elemental.ref(event), "CONTENT"), value: undefined };
            },
        }),
        elemental.setHook(target, "damaged", {
            id: "loss", invoke(current, { event }) {
                order.push("damaged");
                assert.equal(event.epLoss, 1000);
                return { state: current, value: undefined };
            },
        }),
    ]);
    const incoming = request(target, "BURN", 1000);
    const result = damage.applyDamage(incoming, damage.calculateDamage(state, incoming));
    assert.deepEqual(order, ["started", "ended", "damaged", "applied"]);
    assert.equal(result.value.application.epAfter, 0);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(1000));
    assert.equal(get(result.state, 0).elemental.burst, null);
});

test("EP-03: Burst lock, current recovery budget, and dependency cleanup remain resource operations", () => {
    let state = battle([{ definition: definition(), position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const incoming = request(target, "BURN", 1000);
    const started = damage.applyDamage(incoming, damage.calculateDamage(state, incoming));
    const burst = started.value.application.burst;
    const bound = effects.install(started.state, target, {
        id: "bound", initialize: () => ({}),
    }, { scopes: [lifetime.scope(elemental.lifetime, burst)] });
    const independent = effects.install(bound.state, target, { id: "independent", initialize: () => ({}) });
    state = independent.state;
    assert.equal(damage.applyDamage(incoming, damage.calculateDamage(state, incoming)).value.kind, "REJECTED");
    const heal = { target, source: null, power: 100 };
    assert.equal(healing.applyHealing(heal, healing.calculateHealing(state, heal)).value.kind, "REJECTED");
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
    const restarted = damage.applyDamage(incoming, damage.calculateDamage(state, incoming));
    state = elemental.cancel(restarted.state, restarted.value.application.burst, "CONTENT");
    assert.deepEqual(get(state, 0).elemental.ep, elemental.elementValues(1000));
    assert.equal(effects.get(state, independent.value).status, "ACTIVE");
});
