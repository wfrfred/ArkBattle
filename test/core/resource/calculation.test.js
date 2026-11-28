// Contract: [resource](../../../docs/architecture/resource.md).
import { attribute as defineAttribute, vitality as defineVitality, elemental as defineElemental } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks } from "../../../dist/core/hook.js";
import * as units from "../../../dist/core/unit/index.js";
import { update } from "../../../dist/core/unit/operations.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as hpDecrease from "../../../dist/core/battle/resource/hp/decrease.js";
import * as epDamage from "../../../dist/core/battle/resource/ep/damage/index.js";
import * as hpHealing from "../../../dist/core/battle/resource/hp/healing/index.js";
import * as epHealing from "../../../dist/core/battle/resource/ep/healing/index.js";
import * as vitality from "../../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../../dist/core/unit/capability/elemental/index.js";
import * as modifier from "../../../dist/core/common/modifier.js";
import { allyBursts } from "../../../dist/core/effects/elemental/index.js";

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
        id: "ep-receiver", hooks, presence: {}, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
        elemental: { ...defineElemental(allyBursts), ...config },
    };
}

function injuryRequest(target, type, power, source = null) {
    return { target, source, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type, power } };
}

test("HP-01: formulas use the calculated type and sampled defenses without beginning reception", () => {
    let state = battle([
        { hooks: Hooks.empty(), initial: {}, definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { hooks: Hooks.empty(), initial: {}, definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: defineVitality(1000, { defense: defineAttribute(150), resistance: defineAttribute(80, 0, 100) }),
            elemental: {
                ...defineElemental(allyBursts),
                elementResistance: defineAttribute(95, 0, 100), damageResistance: defineAttribute(40, 0, 100),
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
        assert.equal(hpDamage.calculateDamage(state, damageRequest(source, target, power, type, penetration), null).value.amount, expected);
    }

    let receptions = 0;
    state = update(
        state,
        source,
        units.compose(
            units.setHook(hpDamage.sourceFormula, {
                priority: 0,
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
                priority: 0,
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
                    priority: 0,
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
                units.setHook(hpDecrease.receiving, {
                    priority: 0,
                    id: "receive",
                    invoke(current, _context, pending) {
                        receptions++;
                        return { state: current, value: pending };
                    },
                }),
            ),
            vitality.setRestriction({
                group: null,
                id: "arts-only",
                value: { allows: (_current, { request, calculated }) =>
                    calculated.type === "ARTS" && request.attackType === "ADDITION" && request.applyWay === "ALL" },
            }),
        ),
    );
    const request = { ...damageRequest(source, target, 100, "PHYSICAL"), attackType: "ADDITION", applyWay: "ALL" };
    const calculated = hpDamage.calculateDamage(state, request, null);
    assert.deepEqual(calculated.value, { type: "ARTS", amount: 200 });
    assert.equal(request.parameters.type, "PHYSICAL");
    assert.equal(request.parameters.attack.multiplier, 1);
    assert.equal(get(calculated.state, 1).vitality.health.hp, 1000);
    assert.equal(receptions, 0);
    state = update(calculated.state, target, vitality.setContribution("resistance", {
        group: null,
        id: "later-resistance", value: [modifier.create({ finalAddition: 20 })],
    }));
    const applied = hpDamage.applyDamage(request, { ...calculated, state }, null);
    assert.equal(applied.value.application.hpLoss, 200);
    assert.equal(applied.value.killed, false);
    assert.equal(get(applied.state, 1).vitality.health.hp, 800);
    assert.equal(receptions, 1);
});

test("HP-02: independent Calculate results retain their own business state and only the supplied result is applied", () => {
    const sourceHooks = Hooks.empty()
        .set(hpDamage.sourceFormula, {
            priority: 0,
            id: "recover-on-output",
            invoke(state, { request }, parameters) {
                const recovery = healingRequest(request.source, request.source, parameters.type === "ARTS" ? 20 : 10);
                return { state: hpHealing.applyHealing(recovery, hpHealing.calculateHealing(state, recovery, null), null).state, value: parameters };
            },
        })
        .set(hpDamage.output, {
            priority: 0,
            id: "arts-output",
            invoke: (state, { type }, amount) => ({ state, value: type === "ARTS" ? amount * 2 : amount }),
        });
    let state = battle([
        { hooks: Hooks.empty(), initial: {}, definition: { id: "source", hooks: sourceHooks, vitality: defineVitality(200) }, position: [0, 0] },
        { hooks: Hooks.empty(), initial: {}, definition: { id: "target", hooks: Hooks.empty(), vitality: defineVitality(500, { resistance: defineAttribute(10, 0, 100) }) }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, source, 100);
    state = hpDamage.applyDamage(preparation, hpDamage.calculateDamage(state, preparation, null), null).state;
    let receptions = 0;
    state = update(state, target, units.setHook(hpDecrease.receiving, {
        priority: 0,
        id: "count-receptions",
        invoke(current, _context, pending) { receptions++; return { state: current, value: pending }; },
    }));

    const physicalRequest = damageRequest(source, target, 100, "PHYSICAL");
    const artsRequest = damageRequest(source, target, 100, "ARTS");
    const physical = hpDamage.calculateDamage(state, physicalRequest, null);
    const arts = hpDamage.calculateDamage(state, artsRequest, null);
    assert.equal(get(state, 0).vitality.health.hp, 100);
    assert.equal(get(physical.state, 0).vitality.health.hp, 110);
    assert.equal(get(arts.state, 0).vitality.health.hp, 120);
    assert.equal(receptions, 0);
    const result = hpDamage.applyDamage(artsRequest, arts, null);
    assert.equal(result.value.application.hpLoss, 180);
    assert.equal(get(result.state, 0).vitality.health.hp, 120);
    assert.equal(get(result.state, 1).vitality.health.hp, 320);
    assert.equal(receptions, 1);
    assert.equal(get(physical.state, 1).vitality.health.hp, 500);
});

test("EP-01: full resistance preserves formula floors and sampled EP output; HP elemental resistance is independent", () => {
    const sourceHooks = Hooks.empty().set(epDamage.sourceFormula, {
        priority: 0,
        id: "converted-output",
        invoke: (state, _context, current) => ({
            state,
            value: { ...current, type: "NEURAL", power: 200 },
        }),
    }).set(epDamage.output, {
        priority: 0,
        id: "output-scale",
        invoke: (state, _context, amount) => ({ state, value: amount / 2 }),
    });
    let state = battle([
        { hooks: Hooks.empty(), initial: {}, definition: {
            ...elementalDefinition({ elementResistance: defineAttribute(100, 0, 100), damageResistance: defineAttribute(100, 0, 100) }),
            vitality: defineVitality(1000, { defense: defineAttribute(1000), resistance: defineAttribute(99, 0, 100) }),
        }, position: [0, 0] },
        { hooks: Hooks.empty(), initial: {}, definition: { id: "resource-free-source", hooks: sourceHooks }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    assert.deepEqual([
        elemental.resolveElementResistance(state, get(state, 0)),
        elemental.resolveDamageResistance(state, get(state, 0)),
    ], [100, 100]);
    const incoming = injuryRequest(target, "BURN", 100, source);
    const calculated = epDamage.calculateDamage(state, incoming, null);
    assert.deepEqual(calculated.value, { type: "NEURAL", amount: 5 });
    assert.equal(incoming.parameters.type, "BURN");
    assert.deepEqual(get(calculated.state, 0).elemental.ep, elemental.elementValues(1000));
    state = update(calculated.state, target, units.compose(elemental.setContribution("elementResistance", {
            group: null,
            id: "changed-after-calculation", value: [modifier.create({ finalAddition: -50 })],
        }), elemental.setRestriction("damageRestrictions", {
            group: null,
            id: "only-neural", value: { allows: (_current, { type }) => type === "NEURAL" },
        })));
    const preceding = injuryRequest(target, "NEURAL", 50);
    state = epDamage.applyDamage(preceding, epDamage.calculateDamage(state, preceding, null), null).state;
    const applied = epDamage.applyDamage(incoming, { ...calculated, state }, null);
    assert.deepEqual(applied.value.application, {
        type: "NEURAL", epBefore: 975, epAfter: 970, epLoss: 5, burst: null,
    });
    assert.equal(get(applied.state, 0).elemental.ep.BURN, 1000);
    const hpRequest = {
        source: null,
        target,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "ELEMENTAL", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    const hp = hpDamage.applyDamage(hpRequest, hpDamage.calculateDamage(applied.state, hpRequest, null), null);
    assert.equal(hp.value.application.hpLoss, 5);
    assert.equal(get(hp.state, 0).elemental.ep.NEURAL, 970);
});

test("APPLY-02: a formula can change negative input and final Calculate output clamps before reception", () => {
    const hooks = Hooks.empty()
        .set(epHealing.sourceFormula, {
            priority: 0,
            id: "formula",
            invoke(state, _context, current) {
                assert.equal(current.power, -10);
                return { state, value: { ...current, power: 10 } };
            },
        }).set(epHealing.output, {
            priority: 0,
            id: "output",
            invoke(state, _context, amount) {
                assert.equal(amount, 10);
                return { state, value: -5 };
            },
        });
    const receiver = elementalDefinition({}, Hooks.empty().set(epHealing.beforeReceive, {
        priority: 0,
        id: "receive",
        invoke: () => assert.fail("zero output cannot start receiving"),
    }));
    const state = battle([
        { hooks: Hooks.empty(), initial: {}, definition: { id: "source", hooks }, position: [0, 0] },
        { hooks: Hooks.empty(), initial: {}, definition: receiver, position: [1, 0] },
    ]);
    const request = {
        source: units.ref(get(state, 0)),
        target: units.ref(get(state, 1)),
        parameters: { power: -10 },
    };
    const calculated = epHealing.calculateHealing(state, request, null);
    assert.equal(calculated.value.amount, 0);
    assert.equal(epHealing.applyHealing(request, calculated, null).value.type, "REJECTED");
});
