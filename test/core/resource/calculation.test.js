// Contract: [resource](../../../docs/architecture/resource.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import * as units from "../../../dist/core/unit/index.js";
import { update } from "../../../dist/core/battle/unit.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as epDamage from "../../../dist/core/battle/resource/ep/damage/index.js";
import * as hpHealing from "../../../dist/core/battle/resource/hp/healing/index.js";
import * as epHealing from "../../../dist/core/battle/resource/ep/healing/index.js";
import * as vitality from "../../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../../dist/core/unit/capability/elemental/index.js";
import * as attribute from "../../../dist/core/unit/contribution/attribute.js";
import { createArknightsElementalDefinition } from "../../../dist/data/effect/elemental.js";

function damageRequest(source, target, power, type = "TRUE", penetration = { fixed: 0, proportional: 0 }) {
    const attack = { power, multiplier: 1, addition: 0 };
    return {
        source, killer: source, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true,
        parameters: type === "PHYSICAL" || type === "ARTS"
            ? { type, attack, penetration }
            : { type, attack },
    };
}

const healingRequest = (source, target, power) => ({
    source, target, parameters: { power, multiplier: 1 },
});

function elementalDefinition(config = {}, hooks = Hooks.empty()) {
    return {
        id: "ep-receiver", hooks, presence: {}, allegiance: { side: "ALLY" },
        elemental: { ...createArknightsElementalDefinition({ receiver: "CHARACTER" }), ...config },
    };
}

function injuryRequest(target, type, power, source = null) {
    return { target, source, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
}

const elementalReceiver = {
    id: "ep-receiver", hooks: Hooks.empty(), presence: {}, allegiance: { side: "ALLY" },
    targetable: { taunt: 0, restrictions: [] },
    elemental: createArknightsElementalDefinition({ receiver: "CHARACTER", recoveryPerSecond: 15 }),
};

test("HP-01: formulas use the calculated type and sampled defenses without beginning reception", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: { maxHp: 1000, defense: 150, resistance: 80, recoverySpeed: 0, recoveryRatio: 0 },
            elemental: {
                ...createArknightsElementalDefinition({ receiver: "CHARACTER" }),
                elementResistance: 95, damageResistance: 40,
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
        assert.equal(hpDamage.calculateDamage(state, damageRequest(source, target, power, type, penetration)).value.amount, expected);
    }

    let receptions = 0;
    state = update(
        state,
        source,
        units.compose(
            units.setHook(hpDamage.sourceFormula, {
                id: "stronger-output",
                invoke(current, { request }, parameters) {
                    assert.equal(request.attackType, "ADDITION");
                    assert.equal(request.applyWay, "ALL");
                    return {
                        state: current,
                        value: { ...parameters, attack: { ...parameters.attack, multiplier: 2 } },
                    };
                },
            }),
            units.setHook(hpDamage.output, {
                id: "final-output",
                invoke: (current, _context, amount) => ({ state: current, value: amount + 5 }),
            }),
        ),
    );
    state = update(
        state,
        target,
        units.compose(
            units.compose(
                units.setHook(hpDamage.targetFormula, {
                    id: "arts-conversion",
                    invoke: (current, _context, parameters) => ({
                        state: current,
                        value: {
                            type: "ARTS",
                            attack: { ...parameters.attack, power: parameters.attack.power + 50 },
                            penetration: { fixed: 10, proportional: 0.5 },
                        },
                    }),
                }),
                units.setHook(hpDamage.receiving, {
                    id: "receive",
                    invoke(current, _context, pending) {
                        receptions++;
                        return { state: current, value: pending };
                    },
                }),
            ),
            vitality.setRestriction({
                id: "arts-only",
                value: { allows: (_current, { request, calculated }) =>
                    calculated.type === "ARTS" && request.attackType === "ADDITION" && request.applyWay === "ALL" },
            }),
        ),
    );
    const request = { ...damageRequest(source, target, 100, "PHYSICAL"), attackType: "ADDITION", applyWay: "ALL" };
    const calculated = hpDamage.calculateDamage(state, request);
    assert.deepEqual(calculated.value, { type: "ARTS", amount: 200 });
    assert.equal(request.parameters.type, "PHYSICAL");
    assert.equal(request.parameters.attack.multiplier, 1);
    assert.equal(get(calculated.state, 1).vitality.health.hp, 1000);
    assert.equal(receptions, 0);
    state = update(calculated.state, target, vitality.setContribution("resistance", {
        id: "later-resistance", value: [attribute.create({ finalAddition: 20 })],
    }));
    const applied = hpDamage.applyDamage(request, { ...calculated, state });
    assert.equal(applied.value.application.hpLoss, 200);
    assert.equal(applied.value.killed, false);
    assert.equal(get(applied.state, 1).vitality.health.hp, 800);
    assert.equal(receptions, 1);
});

test("HP-02: independent Calculate results retain their own business state and only the supplied result is applied", () => {
    const sourceHooks = Hooks.empty()
        .set(hpDamage.sourceFormula, {
            id: "recover-on-output",
            invoke(state, { request }, parameters) {
                const recovery = healingRequest(request.source, request.source, parameters.type === "ARTS" ? 20 : 10);
                return { state: hpHealing.applyHealing(recovery, hpHealing.calculateHealing(state, recovery)).state, value: parameters };
            },
        })
        .set(hpDamage.output, {
            id: "arts-output",
            invoke: (state, { type }, amount) => ({ state, value: type === "ARTS" ? amount * 2 : amount }),
        });
    let state = battle([
        { definition: { id: "source", hooks: sourceHooks, vitality: { maxHp: 200, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 } }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 500, defense: 0, resistance: 10, recoverySpeed: 0, recoveryRatio: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, source, 100);
    state = hpDamage.applyDamage(preparation, hpDamage.calculateDamage(state, preparation)).state;
    let receptions = 0;
    state = update(state, target, units.setHook(hpDamage.receiving, {
        id: "count-receptions",
        invoke(current, _context, pending) { receptions++; return { state: current, value: pending }; },
    }));

    const physicalRequest = damageRequest(source, target, 100, "PHYSICAL");
    const artsRequest = damageRequest(source, target, 100, "ARTS");
    const physical = hpDamage.calculateDamage(state, physicalRequest);
    const arts = hpDamage.calculateDamage(state, artsRequest);
    assert.equal(get(state, 0).vitality.health.hp, 100);
    assert.equal(get(physical.state, 0).vitality.health.hp, 110);
    assert.equal(get(arts.state, 0).vitality.health.hp, 120);
    assert.equal(receptions, 0);
    const result = hpDamage.applyDamage(artsRequest, arts);
    assert.equal(result.value.application.hpLoss, 180);
    assert.equal(get(result.state, 0).vitality.health.hp, 120);
    assert.equal(get(result.state, 1).vitality.health.hp, 320);
    assert.equal(receptions, 1);
    assert.equal(get(physical.state, 1).vitality.health.hp, 500);
});

test("EP-01: full resistance preserves formula floors and sampled EP output; HP elemental resistance is independent", () => {
    const sourceHooks = Hooks.empty().set(epDamage.sourceFormula, {
        id: "converted-output",
        invoke: (state, _context, current) => ({
            state,
            value: { ...current, type: "NEURAL", power: 200 },
        }),
    }).set(epDamage.output, {
        id: "output-scale",
        invoke: (state, _context, amount) => ({ state, value: amount / 2 }),
    });
    let state = battle([
        { definition: {
            ...elementalDefinition({ elementResistance: 100, damageResistance: 100 }),
            vitality: { maxHp: 1000, defense: 1000, resistance: 99, recoverySpeed: 0, recoveryRatio: 0 },
        }, position: [0, 0] },
        { definition: { id: "resource-free-source", hooks: sourceHooks }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    assert.deepEqual([
        elemental.resolveElementResistance(state, get(state, 0)),
        elemental.resolveDamageResistance(state, get(state, 0)),
    ], [100, 100]);
    const incoming = injuryRequest(target, "BURN", 100, source);
    const calculated = epDamage.calculateDamage(state, incoming);
    assert.deepEqual(calculated.value, { type: "NEURAL", amount: 5 });
    assert.equal(incoming.parameters.type, "BURN");
    assert.deepEqual(get(calculated.state, 0).elemental.ep, elemental.elementValues(1000));
    state = update(calculated.state, target, units.compose(elemental.setContribution("elementResistance", {
            id: "changed-after-calculation", value: [attribute.create({ finalAddition: -50 })],
        }), elemental.setRestriction("damageRestrictions", {
            id: "only-neural", value: { allows: (_current, { type }) => type === "NEURAL" },
        })));
    const preceding = injuryRequest(target, "NEURAL", 50);
    state = epDamage.applyDamage(preceding, epDamage.calculateDamage(state, preceding)).state;
    const applied = epDamage.applyDamage(incoming, { ...calculated, state });
    assert.deepEqual(applied.value.application, {
        type: "NEURAL", epBefore: 975, epAfter: 970, epLoss: 5, burst: null,
    });
    assert.equal(get(applied.state, 0).elemental.ep.BURN, 1000);
    const hpRequest = {
        source: null,
        target,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "ELEMENTAL", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    const hp = hpDamage.applyDamage(hpRequest, hpDamage.calculateDamage(applied.state, hpRequest));
    assert.equal(hp.value.application.hpLoss, 5);
    assert.equal(get(hp.state, 0).elemental.ep.NEURAL, 970);
});

test("APPLY-02: Calculate normalizes final HP/EP output before Apply starts receiving", () => {
    for (const [name, operation, parameters] of [
        ["HP Damage", hpDamage, {
            type: "TRUE", attack: { power: -10, multiplier: 1, addition: 0 },
        }],
        ["EP Damage", epDamage, { type: "BURN", power: -10 }],
        ["HP Healing", hpHealing, { power: -10, multiplier: 1 }],
        ["EP Healing", epHealing, { power: -10 }],
    ]) {
        const hooks = Hooks.empty().set(operation.sourceFormula, {
            id: "formula",
            invoke(state, _context, current) {
                assert.equal(current.attack?.power ?? current.power, -10, name);
                return {
                    state,
                    value: current.attack === undefined
                        ? { ...current, power: 10 }
                        : { ...current, attack: { ...current.attack, power: 10 } },
                };
            },
        }).set(operation.output, {
            id: "output",
            invoke(state, _context, amount) {
                assert.equal(amount, 10, name);
                return { state, value: -5 };
            },
        });
        const state = battle([
            { definition: { id: "source", hooks }, position: [0, 0] },
            { definition: {
                ...elementalReceiver,
                vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
                hooks: Hooks.empty().set(operation.beforeReceive, {
                    id: "receive",
                    invoke: () => assert.fail(`${name}: zero output cannot start receiving`),
                }),
            }, position: [1, 0] },
        ]);
        const request = {
            source: units.ref(get(state, 0)),
            target: units.ref(get(state, 1)),
            parameters,
            ...(operation === hpDamage || operation === epDamage ? { attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE" } : {}),
            ...(operation === hpDamage ? { hitRecovery: true, killer: units.ref(get(state, 0)) } : {}),
        };
        const calculate = operation.calculateDamage ?? operation.calculateHealing;
        const apply = operation.applyDamage ?? operation.applyHealing;
        const calculated = calculate(state, request);
        assert.equal(calculated.value.amount, 0, name);
        const result = apply(request, calculated);
        assert.equal(result.value.type, "REJECTED", name);
    }
});
