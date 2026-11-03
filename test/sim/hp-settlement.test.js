import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/battle/unit.js";
import * as damage from "../../dist/core/battle/damage/hp/index.js";
import * as healing from "../../dist/core/battle/healing/hp/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";

function damageRequest(source, target, power, type = "TRUE", penetration = { fixed: 0, proportional: 0 }) {
    const attack = { power, multiplier: 1, addition: 0 };
    return {
        source, target,
        parameters: type === "PHYSICAL" || type === "ARTS"
            ? { type, attack, penetration }
            : { type, attack },
    };
}

const healingRequest = (source, target, power) => ({
    source, target, parameters: { power, multiplier: 1 },
});

test("HP-01: formulas use the calculated type and sampled defenses without beginning reception", () => {
    const burst = { durationTicks: 30, onStart: state => state };
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: { maxHp: 1000, defense: 150, resistance: 80 },
            elemental: {
                maxEp: 1000, recoveryPerSecond: 0, elementResistance: 95,
                damageResistance: 40, burstRecoverySpeed: 1,
                bursts: { NEURAL: burst, EROSION: burst, BURN: burst, NECROSIS: burst },
            },
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    for (const [type, power, penetration, expected] of [
        ["PHYSICAL", 1000, { fixed: 100, proportional: 0.5 }, 975],
        ["PHYSICAL", 100, { fixed: 0, proportional: 0 }, 5],
        ["ARTS", 1000, { fixed: 10, proportional: 0.5 }, 650],
        ["TRUE", 1000, undefined, 1000],
        ["ELEMENTAL", 1000, undefined, 600],
    ]) {
        assert.equal(damage.calculateDamage(state, damageRequest(source, target, power, type, penetration)).value.amount, expected);
    }

    const recovery = {
        source, target, parameters: { power: 25, multiplier: 2 },
    };
    const healingCalculation = healing.calculateHealing(state, recovery);
    assert.equal(healingCalculation.value.amount, 50);
    assert.equal(get(healingCalculation.state, 1).vitality.hp, 1000);

    let receptions = 0;
    state = update(state, [
        units.setHook(source, damage.sourceFormula, {
            id: "stronger-output",
            invoke: (current, _context, parameters) => ({ state: current, value: {
                ...parameters, attack: { ...parameters.attack, multiplier: 2 },
            } }),
        }),
        units.setHook(target, damage.targetFormula, {
            id: "arts-conversion",
            invoke: (current, _context, parameters) => ({ state: current, value: {
                type: "ARTS", attack: { ...parameters.attack, power: parameters.attack.power + 50 },
                penetration: { fixed: 10, proportional: 0.5 },
            } }),
        }),
        units.setHook(source, damage.output, {
            id: "final-output",
            invoke: (current, _context, amount) => ({ state: current, value: amount + 5 }),
        }),
        vitality.setDamageReceivingHook(target, {
            id: "receive",
            invoke(current, _context, pending) {
                receptions++;
                return { state: current, value: pending };
            },
        }),
        vitality.setRule(target, {
            id: "arts-only", allows: (_current, context) => context.calculated.type === "ARTS",
        }),
    ]);
    const request = damageRequest(source, target, 100, "PHYSICAL");
    const calculated = damage.calculateDamage(state, request);
    assert.deepEqual(calculated.value, { type: "ARTS", amount: 200 });
    assert.equal(request.parameters.type, "PHYSICAL");
    assert.equal(request.parameters.attack.multiplier, 1);
    assert.equal(get(calculated.state, 1).vitality.hp, 1000);
    assert.equal(receptions, 0);
    state = update(calculated.state, [vitality.setResistanceContribution(target, {
        id: "later-resistance", value: [attribute.create({ finalAddition: 20 })],
    })]);
    const applied = damage.applyDamage(request, { ...calculated, state });
    assert.equal(applied.value.application.hpLoss, 200);
    assert.equal(get(applied.state, 1).vitality.hp, 800);
    assert.equal(receptions, 1);
});

test("HP-02: independent Calculate results retain their own business state and only the supplied result is applied", () => {
    const sourceHooks = Hooks.empty()
        .set(damage.sourceFormula, {
            id: "recover-on-output",
            invoke(state, { request }, parameters) {
                const recovery = healingRequest(request.source, request.source, parameters.type === "ARTS" ? 20 : 10);
                return { state: healing.applyHealing(recovery, healing.calculateHealing(state, recovery)).state, value: parameters };
            },
        })
        .set(damage.output, {
            id: "arts-output",
            invoke: (state, { type }, amount) => ({ state, value: type === "ARTS" ? amount * 2 : amount }),
        });
    let state = battle([
        { definition: { id: "source", hooks: sourceHooks, vitality: { maxHp: 200, defense: 0, resistance: 0 } }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 500, defense: 0, resistance: 10 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, source, 100);
    state = damage.applyDamage(preparation, damage.calculateDamage(state, preparation)).state;
    let receptions = 0;
    state = update(state, [vitality.setDamageReceivingStartedHook(target, {
        id: "count-receptions",
        invoke(current) { receptions++; return { state: current, value: undefined }; },
    })]);

    const physicalRequest = damageRequest(source, target, 100, "PHYSICAL");
    const artsRequest = damageRequest(source, target, 100, "ARTS");
    const physical = damage.calculateDamage(state, physicalRequest);
    const arts = damage.calculateDamage(state, artsRequest);
    assert.equal(get(state, 0).vitality.hp, 100);
    assert.equal(get(physical.state, 0).vitality.hp, 110);
    assert.equal(get(arts.state, 0).vitality.hp, 120);
    assert.equal(receptions, 0);
    const result = damage.applyDamage(artsRequest, arts);
    assert.equal(result.value.application.hpLoss, 180);
    assert.equal(get(result.state, 0).vitality.hp, 120);
    assert.equal(get(result.state, 1).vitality.hp, 320);
    assert.equal(receptions, 1);
    assert.deepEqual(result.state.events.slice(-2).map(event => [event.type, event.amount]), [["HEAL", 20], ["DAMAGE", 180]]);
    assert.equal(get(physical.state, 1).vitality.hp, 500);
});

test("APPLY-01: BeforeReceive can change reception permission before any Receiving or commit", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(state, [
        units.setHook(target, damage.beforeReceive, {
            id: "enable-immunity",
            invoke: current => ({ state: update(current, [vitality.setRule(target, { id: "immune", allows: () => false })]), value: undefined }),
        }),
        vitality.setDamageReceivingHook(target, { id: "receiving", invoke: () => assert.fail("rejected reception cannot execute Receiving") }),
        units.setHook(source, damage.beforeCommit, { id: "commit", invoke: () => assert.fail("rejected reception cannot reach BeforeCommit") }),
    ]);
    const request = damageRequest(source, target, 30);
    const result = damage.applyDamage(request, damage.calculateDamage(state, request));
    assert.equal(result.value.kind, "REJECTED");
    assert.equal(get(result.state, 1).vitality.hp, 100);
});

test("APPLY-01: Receiving and BeforeCommit resource changes define the baseline while Applied preserves the report", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, target, 40);
    state = damage.applyDamage(preparation, damage.calculateDamage(state, preparation)).state;
    const calls = [];
    let observed;
    state = update(state, [
        vitality.setDamageReceivingStartedHook(target, {
            id: "started", invoke(current) { calls.push("started"); return { state: current, value: undefined }; },
        }),
        vitality.setDamageReceivingHook(target, {
            id: "larger-hp-pool",
            invoke(current, _context, pending) {
                calls.push("receiving");
                return { state: update(current, [vitality.setMaxHpContribution(target, {
                    id: "larger-hp", value: [attribute.create({ multiplier: 1 })],
                })]), value: pending };
            },
        }),
        units.setHook(source, damage.beforeCommit, {
            id: "recover-before-commit",
            invoke(current) {
                calls.push("beforeCommit");
                const request = healingRequest(null, target, 25);
                return { state: healing.applyHealing(request, healing.calculateHealing(current, request)).state, value: undefined };
            },
        }),
        units.setHook(target, damage.targetApplied, {
            id: "recover-after-commit",
            invoke(current, { application }) {
                calls.push("targetApplied");
                observed = application;
                const request = healingRequest(null, target, 10);
                return { state: healing.applyHealing(request, healing.calculateHealing(current, request)).state, value: undefined };
            },
        }),
        units.setHook(source, damage.sourceApplied, {
            id: "observe-source",
            invoke(current, { application }) {
                calls.push("sourceApplied");
                assert.equal(application, observed);
                return { state: current, value: undefined };
            },
        }),
    ]);
    const request = damageRequest(source, target, 30);
    const result = damage.applyDamage(request, damage.calculateDamage(state, request));
    assert.deepEqual(calls, ["started", "receiving", "beforeCommit", "targetApplied", "sourceApplied"]);
    assert.deepEqual(result.value.application, { hpBefore: 145, hpAfter: 115, hpLoss: 30 });
    assert.equal(result.value.application, observed);
    assert.equal(get(result.state, 1).vitality.hp, 125);
});

test("APPLY-01: cancellation retains recovery and reflection but skips the original commit and Applied", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, source, 40);
    state = damage.applyDamage(preparation, damage.calculateDamage(state, preparation)).state;
    state = update(state, [
        vitality.setDamageReceivingHook(target, {
            id: "evade", priority: 10,
            invoke(current, _context, pending) {
                const recovery = healingRequest(null, source, 6);
                current = healing.applyHealing(recovery, healing.calculateHealing(current, recovery)).state;
                return { state: current, value: damage.cancel(pending, "EVADE") };
            },
        }),
        vitality.setDamageReceivingHook(target, {
            id: "reflect",
            invoke(current, _context, pending) {
                assert.equal(pending.cancellation.reason, "EVADE");
                const reflection = damageRequest(target, source, 10);
                return { state: damage.applyDamage(reflection, damage.calculateDamage(current, reflection)).state, value: pending };
            },
        }),
        units.setHook(source, damage.beforeCommit, { id: "commit", invoke: () => assert.fail("cancelled request cannot reach BeforeCommit") }),
        units.setHook(target, damage.targetApplied, { id: "applied", invoke: () => assert.fail("cancelled request cannot produce Applied") }),
    ]);
    const request = damageRequest(source, target, 20);
    const result = damage.applyDamage(request, damage.calculateDamage(state, request));
    assert.deepEqual(result.value, { kind: "CANCELLED", received: { amount: 20, cancellation: { reason: "EVADE" } } });
    assert.equal(get(result.state, 0).vitality.hp, 56);
    assert.equal(get(result.state, 1).vitality.hp, 100);
});

test("APPLY-02: zero output rejects, absorption and full-HP healing succeed, and self-healing dispatches both roles", () => {
    const calls = [];
    let state = battle([
        { definition: { id: "source-without-vitality", hooks: Hooks.empty().set(damage.output, {
            id: "strong-output", invoke(current, _context, amount) { calls.push("output"); return { state: current, value: amount * 2 }; },
        }) }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(state, [
        vitality.setDamageReceivingHook(target, { id: "absorb", invoke: (current, _context, pending) => ({ state: current, value: { ...pending, amount: 0 } }) }),
        units.setHook(target, damage.targetApplied, { id: "target", invoke(current) { calls.push("targetApplied"); return { state: current, value: undefined }; } }),
        units.setHook(source, damage.sourceApplied, { id: "source", invoke(current) { calls.push("sourceApplied"); return { state: current, value: undefined }; } }),
    ]);
    const zeroDamage = damageRequest(source, target, 0);
    assert.equal(damage.applyDamage(zeroDamage, damage.calculateDamage(state, zeroDamage)).value.kind, "REJECTED");
    assert.deepEqual(calls, ["output"]);
    calls.length = 0;
    const positiveDamage = damageRequest(source, target, 10);
    const absorbed = damage.applyDamage(positiveDamage, damage.calculateDamage(state, positiveDamage));
    assert.equal(absorbed.value.kind, "APPLIED");
    assert.equal(absorbed.value.application.hpLoss, 0);
    assert.deepEqual(calls, ["output", "targetApplied", "sourceApplied"]);

    const healingCalls = [];
    state = update(absorbed.state, [
        vitality.setHealingReceivingHook(target, { id: "receive", invoke(current, _context, pending) { healingCalls.push("receive"); return { state: current, value: pending }; } }),
        units.setHook(target, healing.targetApplied, { id: "target", invoke(current) { healingCalls.push("target"); return { state: current, value: undefined }; } }),
        units.setHook(target, healing.sourceApplied, { id: "source", invoke(current) { healingCalls.push("source"); return { state: current, value: undefined }; } }),
    ]);
    const zeroHealing = healingRequest(target, target, 0);
    assert.equal(healing.applyHealing(zeroHealing, healing.calculateHealing(state, zeroHealing)).value.kind, "REJECTED");
    assert.deepEqual(healingCalls, []);
    const positiveHealing = healingRequest(target, target, 20);
    const full = healing.applyHealing(positiveHealing, healing.calculateHealing(state, positiveHealing));
    assert.equal(full.value.kind, "APPLIED");
    assert.deepEqual(full.value.application, { hpBefore: 100, hpAfter: 100, hpGain: 0 });
    assert.deepEqual(healingCalls, ["receive", "target", "source"]);
});

test("HP-03: lethal HP remains present and blocking through both Applied roles, then death releases the relation", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "guard", hooks: Hooks.empty(), vitality: { maxHp: 40, defense: 0, resistance: 0 },
            blocker: { capacity: 1, layer: "GROUND", rules: [] },
        }, position: [2, 1] },
        { definition: { id: "enemy", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1 } }, position: [2.2, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const enemy = units.ref(get(state, 2));
    state = blocking.acquire(state, target, enemy);
    const calls = [];
    state = update(state, [
        units.setHook(target, damage.targetApplied, {
            id: "target-observer",
            invoke(current) {
                calls.push(["target", get(current, 1).vitality.hp, get(current, 1).lifecycle, blocking.blockerOf(current, enemy).id]);
                const recovery = healingRequest(null, target, 20);
                const attempted = healing.applyHealing(recovery, healing.calculateHealing(current, recovery));
                assert.equal(attempted.value.kind, "REJECTED");
                return { state: attempted.state, value: undefined };
            },
        }),
        units.setHook(source, damage.sourceApplied, {
            id: "source-observer",
            invoke(current) {
                calls.push(["source", get(current, 1).vitality.hp, get(current, 1).lifecycle, blocking.blockerOf(current, enemy).id]);
                return { state: current, value: undefined };
            },
        }),
    ]);
    const request = damageRequest(source, target, 100);
    const result = damage.applyDamage(request, damage.calculateDamage(state, request));
    assert.deepEqual(calls, [["target", 0, "PRESENT", 1], ["source", 0, "PRESENT", 1]]);
    assert.deepEqual(result.value.application, { hpBefore: 40, hpAfter: 0, hpLoss: 40 });
    assert.equal(get(result.state, 1), undefined);
    assert.equal(get(result.state, 2).blockable.blocker, null);
    assert.deepEqual(result.state.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[1, "DEATH"]]);
});
