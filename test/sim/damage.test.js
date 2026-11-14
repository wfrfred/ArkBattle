import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update } from "../../dist/core/battle/unit.js";
import { advance as advanceCombat } from "../../dist/core/battle/steps/combat.js";
import * as hpDamage from "../../dist/core/battle/damage/hp/index.js";
import * as epDamage from "../../dist/core/battle/damage/ep/index.js";
import * as hpHealing from "../../dist/core/battle/healing/hp/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../dist/core/unit/capability/elemental/index.js";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { invincible } from "../../dist/core/effects/protection.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { createArknightsElementalDefinition } from "../../dist/data/effect/elemental.js";

function damageRequest(source, target, power, type = "TRUE", penetration = { fixed: 0, proportional: 0 }) {
    const attack = { power, multiplier: 1, addition: 0 };
    return {
        source, target, nature: "DAMAGE", hitRecovery: true,
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
    return { target, source, parameters: { type, power } };
}

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
                invoke: (current, _context, parameters) => ({
                    state: current,
                    value: {
                        ...parameters,
                        attack: { ...parameters.attack, multiplier: 2 },
                    },
                }),
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
                vitality.setHook("damageReceiving", {
                    id: "receive",
                    invoke(current, _context, pending) {
                        receptions++;
                        return { state: current, value: pending };
                    },
                }),
            ),
            vitality.setRule({
                id: "arts-only",
                allows: (_current, context) => context.calculated.type === "ARTS",
            }),
        ),
    );
    const request = damageRequest(source, target, 100, "PHYSICAL");
    const calculated = hpDamage.calculateDamage(state, request);
    assert.deepEqual(calculated.value, { type: "ARTS", amount: 200 });
    assert.equal(request.parameters.type, "PHYSICAL");
    assert.equal(request.parameters.attack.multiplier, 1);
    assert.equal(get(calculated.state, 1).vitality.hp, 1000);
    assert.equal(receptions, 0);
    state = update(calculated.state, target, vitality.setContribution("resistance", {
        id: "later-resistance", value: [attribute.create({ finalAddition: 20 })],
    }));
    const applied = hpDamage.applyDamage(request, { ...calculated, state });
    assert.equal(applied.value.application.hpLoss, 200);
    assert.equal(applied.value.killed, false);
    assert.equal(get(applied.state, 1).vitality.hp, 800);
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
    state = update(state, target, vitality.setHook("damageReceivingStarted", {
        id: "count-receptions",
        invoke(current) { receptions++; return { state: current, value: undefined }; },
    }));

    const physicalRequest = damageRequest(source, target, 100, "PHYSICAL");
    const artsRequest = damageRequest(source, target, 100, "ARTS");
    const physical = hpDamage.calculateDamage(state, physicalRequest);
    const arts = hpDamage.calculateDamage(state, artsRequest);
    assert.equal(get(state, 0).vitality.hp, 100);
    assert.equal(get(physical.state, 0).vitality.hp, 110);
    assert.equal(get(arts.state, 0).vitality.hp, 120);
    assert.equal(receptions, 0);
    const result = hpDamage.applyDamage(artsRequest, arts);
    assert.equal(result.value.application.hpLoss, 180);
    assert.equal(get(result.state, 0).vitality.hp, 120);
    assert.equal(get(result.state, 1).vitality.hp, 320);
    assert.equal(receptions, 1);
    assert.equal(get(physical.state, 1).vitality.hp, 500);
});

test("APPLY-01: invincibility installed before reception rejects HIT recovery until protection ends", () => {
    const resource = {
        id: "hit-recovery", initialize: state => ({ state, value: {} }), activation: null,
        sp: { initial: 0, capacity: 5, requirement: 1, recovery: { type: "HIT", amount: 1 } },
    };
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(), targetable: { taunt: 0, restrictions: [] }, vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
            skill: { initialize: state => skills.create(state, resource) },
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    let protection;
    const receivedSp = [];
    let commits = 0;
    state = update(
        state,
        target,
        units.compose(
            units.setHook(hpDamage.beforeReceive, {
                id: "enable-immunity",
                invoke(current) {
                    const installed = effects.install(current, target, invincible);
                    protection = installed.value;
                    return { state: installed.state, value: undefined };
                },
            }),
            vitality.setHook("damageReceiving", {
                id: "receiving",
                invoke(current, _context, pending) {
                    receivedSp.push(get(current, 1).skill.sp.value);
                    return { state: current, value: pending };
                },
            }),
        ),
    );
    state = update(
        state,
        source,
        units.setHook(hpDamage.beforeCommit, {
            id: "commit",
            invoke(current) {
                commits++;
                return { state: current, value: undefined };
            },
        }),
    );
    const request = damageRequest(source, target, 30);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(result.value.type, "REJECTED");
    assert.equal(get(result.state, 1).vitality.hp, 100);
    assert.equal(get(result.state, 1).skill.sp.value, 0);
    assert.deepEqual(receivedSp, []);
    assert.equal(commits, 0);

    state = update(result.state, target, units.removeHook(hpDamage.beforeReceive, "enable-immunity"));
    state = effects.end(state, protection);
    const accepted = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(accepted.value.application.hpLoss, 30);
    assert.equal(get(accepted.state, 1).skill.sp.value, 1);
    assert.deepEqual(receivedSp, [1]);
    assert.equal(commits, 1);
});

test("APPLY-01: Receiving and BeforeCommit resource changes define the baseline while Applied preserves the report", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, target, 40);
    state = hpDamage.applyDamage(preparation, hpDamage.calculateDamage(state, preparation)).state;
    const calls = [];
    let observed;
    let healingNotifications = 0;
    state = update(
        state,
        target,
        units.compose(
            units.compose(
                units.compose(
                    units.setHook(hpHealing.targetApplied, {
                        id: "ordinary-healing",
                        invoke(current) {
                            healingNotifications++;
                            return { state: current, value: undefined };
                        },
                    }),
                    vitality.setHook("damageReceivingStarted", {
                        id: "started",
                        invoke(current) {
                            calls.push("started");
                            return { state: current, value: undefined };
                        },
                    }),
                ),
                vitality.setHook("damageReceiving", {
                    id: "larger-hp-pool",
                    invoke(current, _context, pending) {
                        calls.push("receiving");
                        return {
                            state: update(
                                current,
                                target,
                                vitality.setMaxHpContribution({
                                    id: "larger-hp",
                                    value: [attribute.create({ multiplier: 1 })],
                                }),
                            ),
                            value: pending,
                        };
                    },
                }),
            ),
            units.setHook(hpDamage.targetApplied, {
                id: "recover-after-commit",
                invoke(current, { application }) {
                    calls.push("targetApplied");
                    observed = application;
                    const request = healingRequest(null, target, 10);
                    return {
                        state: hpHealing.applyHealing(
                            request,
                            hpHealing.calculateHealing(current, request),
                        ).state,
                        value: undefined,
                    };
                },
            }),
        ),
    );
    state = update(
        state,
        source,
        units.compose(
            units.setHook(hpDamage.beforeCommit, {
                id: "recover-before-commit",
                invoke(current) {
                    calls.push("beforeCommit");
                    const request = healingRequest(null, target, 25);
                    return {
                        state: hpHealing.applyHealing(
                            request,
                            hpHealing.calculateHealing(current, request),
                        ).state,
                        value: undefined,
                    };
                },
            }),
            units.setHook(hpDamage.sourceApplied, {
                id: "observe-source",
                invoke(current, { application }) {
                    calls.push("sourceApplied");
                    assert.deepEqual(application, observed);
                    return { state: current, value: undefined };
                },
            }),
        ),
    );
    const request = damageRequest(source, target, 30);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.deepEqual(calls, ["started", "receiving", "beforeCommit", "targetApplied", "sourceApplied"]);
    assert.deepEqual(result.value.application, { hpBefore: 145, hpAfter: 115, hpLoss: 30 });
    assert.equal(get(result.state, 1).vitality.hp, 125);
    assert.equal(healingNotifications, 2);

    state = update(result.state, target, vitality.setMaxHpContribution({
        id: "larger-hp", value: [attribute.create({ multiplier: 2 })],
    }));
    assert.equal(get(state, 1).vitality.hp, 187.5);
    assert.equal(vitality.resolveMaxHp(get(state, 1).definition.vitality, get(state, 1).vitality), 300);
    state = update(state, target, vitality.removeMaxHpContribution("larger-hp"));
    assert.equal(get(state, 1).vitality.hp, 62.5);
    assert.equal(vitality.resolveMaxHp(get(state, 1).definition.vitality, get(state, 1).vitality), 100);
    assert.equal(healingNotifications, 2);
});

test("APPLY-01: cancellation retains recovery and reflection but skips the original commit and Applied", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 } }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const preparation = damageRequest(null, source, 40);
    state = hpDamage.applyDamage(preparation, hpDamage.calculateDamage(state, preparation)).state;
    state = update(
        state,
        target,
        units.compose(
            units.compose(
                vitality.setHook("damageReceiving", {
                    id: "evade",
                    priority: 10,
                    invoke(current, _context, pending) {
                        const recovery = healingRequest(null, source, 6);
                        current = hpHealing.applyHealing(
                            recovery,
                            hpHealing.calculateHealing(current, recovery),
                        ).state;
                        return { state: current, value: hpDamage.cancel(pending, "EVADE") };
                    },
                }),
                vitality.setHook("damageReceiving", {
                    id: "reflect",
                    invoke(current, _context, pending) {
                        assert.equal(pending.cancellation.reason, "EVADE");
                        const reflection = damageRequest(target, source, 10);
                        return {
                            state: hpDamage.applyDamage(
                                reflection,
                                hpDamage.calculateDamage(current, reflection),
                            ).state,
                            value: pending,
                        };
                    },
                }),
            ),
            units.setHook(hpDamage.targetApplied, {
                id: "applied",
                invoke: () => assert.fail("cancelled request cannot produce Applied"),
            }),
        ),
    );
    state = update(
        state,
        source,
        units.setHook(hpDamage.beforeCommit, {
            id: "commit",
            invoke: () => assert.fail("cancelled request cannot reach BeforeCommit"),
        }),
    );
    const request = damageRequest(source, target, 20);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.deepEqual(result.value, { type: "CANCELLED", received: { amount: 20, cancellation: { reason: "EVADE" } } });
    assert.equal(get(result.state, 0).vitality.hp, 56);
    assert.equal(get(result.state, 1).vitality.hp, 100);
});

test("APPLY-02: HP zero output rejects while excess receiving reduction still commits and notifies", () => {
    const calls = [];
    let state = battle([
        { definition: { id: "source-without-vitality", hooks: Hooks.empty().set(hpDamage.output, {
            id: "strong-output", invoke(current, _context, amount) { calls.push("output"); return { state: current, value: amount * 2 }; },
        }) }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: { maxHp: 100, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 } }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(
        state,
        target,
        units.compose(
            vitality.setHook("damageReceiving", {
                id: "absorb",
                invoke: (current, _context, pending) => ({
                    state: current,
                    value: { ...pending, amount: pending.amount - 100 },
                }),
            }),
            units.setHook(hpDamage.targetApplied, {
                id: "target",
                invoke(current, { received }) {
                    assert.equal(received.amount, 0);
                    calls.push("targetApplied");
                    return { state: current, value: undefined };
                },
            }),
        ),
    );
    state = update(
        state,
        source,
        units.compose(
            units.setHook(hpDamage.beforeCommit, {
                id: "commit",
                invoke(current, { received }) {
                    assert.equal(received.amount, 0);
                    calls.push("beforeCommit");
                    return { state: current, value: undefined };
                },
            }),
            units.setHook(hpDamage.sourceApplied, {
                id: "source",
                invoke(current, { received }) {
                    assert.equal(received.amount, 0);
                    calls.push("sourceApplied");
                    return { state: current, value: undefined };
                },
            }),
        ),
    );
    const zeroDamage = damageRequest(source, target, 0);
    assert.equal(hpDamage.applyDamage(zeroDamage, hpDamage.calculateDamage(state, zeroDamage)).value.type, "REJECTED");
    assert.deepEqual(calls, ["output"]);
    calls.length = 0;
    const positiveDamage = damageRequest(source, target, 10);
    const absorbed = hpDamage.applyDamage(positiveDamage, hpDamage.calculateDamage(state, positiveDamage));
    assert.equal(absorbed.value.type, "APPLIED");
    assert.equal(absorbed.value.received.amount, 0);
    assert.equal(absorbed.value.application.hpLoss, 0);
    assert.equal(absorbed.value.killed, false);
    assert.equal(get(absorbed.state, 1).vitality.hp, 100);
    assert.deepEqual(calls, ["output", "beforeCommit", "targetApplied", "sourceApplied"]);
});

test("HP-05/06: LOSS completes the shared pipeline against an invincible absent target without HIT recovery", () => {
    const resource = {
        id: "hit-recovery", initialize: state => ({ state, value: {} }), activation: null,
        sp: { initial: 0, capacity: 5, requirement: 1, recovery: { type: "HIT", amount: 1 } },
    };
    const calls = [];
    const observe = stage => ({
        id: stage,
        invoke(current, context) {
            calls.push([stage, get(current, context.target.id).vitality.hp,
                get(current, context.target.id).skill.sp.value]);
            return { state: current, value: undefined };
        },
    });
    let state = battle([
        { definition: {
            id: "source",
            hooks: Hooks.empty()
                .set(hpDamage.sourceFormula, {
                    id: "source-formula",
                    invoke(current, _context, parameters) {
                        return { state: current, value: {
                            ...parameters, attack: { ...parameters.attack, power: parameters.attack.power + 10 },
                        } };
                    },
                })
                .set(hpDamage.output, {
                    id: "output", invoke: (current, _context, amount) => ({ state: current, value: amount - 10 }),
                })
                .set(hpDamage.beforeCommit, observe("beforeCommit"))
                .set(hpDamage.sourceApplied, observe("sourceApplied")),
        }, position: [0, 0] },
        { definition: {
            id: "target", presence: {}, targetable: { taunt: 0, restrictions: [] },
            vitality: { maxHp: 35, defense: 20, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
            skill: { initialize: current => skills.create(current, resource) },
            hooks: Hooks.empty()
                .set(hpDamage.targetFormula, {
                    id: "target-formula",
                    invoke(current, _context, parameters) {
                        return { state: current, value: {
                            ...parameters, attack: { ...parameters.attack, multiplier: 2 },
                        } };
                    },
                })
                .set(hpDamage.beforeReceive, observe("beforeReceive"))
                .set(hpDamage.targetApplied, observe("targetApplied")),
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = effects.install(state, target, invincible).state;
    state = update(state, target, units.compose(
        presence.disappear(),
        units.compose(
            vitality.setHook("damageReceivingStarted", observe("receivingStarted")),
            vitality.setHook("damageReceiving", {
                id: "receiving",
                invoke(current, context, pending) {
                    assert.equal(context.request.nature, "LOSS");
                    assert.equal(pending.amount, 70);
                    calls.push(["receiving", get(current, target.id).vitality.hp,
                        get(current, target.id).skill.sp.value]);
                    return { state: current, value: pending };
                },
            }),
        ),
    ));
    const request = { ...damageRequest(source, target, 40, "PHYSICAL"), nature: "LOSS" };
    const calculated = hpDamage.calculateDamage(state, request);
    assert.equal(calculated.value.amount, 70);
    assert.equal(get(calculated.state, target.id).vitality.hp, 35);
    assert.deepEqual(calls, []);
    const applied = hpDamage.applyDamage(request, calculated);
    assert.equal(applied.value.type, "APPLIED");
    assert.deepEqual(applied.value.application, { hpBefore: 35, hpAfter: 0, hpLoss: 35 });
    assert.deepEqual(calls, [
        ["beforeReceive", 35, 0], ["receivingStarted", 35, 0], ["receiving", 35, 0],
        ["beforeCommit", 35, 0], ["targetApplied", 0, 0], ["sourceApplied", 0, 0],
    ]);
    assert.equal(get(applied.state, target.id), undefined);
});

test("HP-03: lethal HP remains present through nested Combat and both Applied roles before death releases blocking", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "guard", hooks: Hooks.empty(), vitality: { maxHp: 40, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
            blocker: { capacity: 1, layer: "GROUND", rules: [] },
        }, position: [2, 1] },
        { definition: { id: "enemy", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1, rules: [] } }, position: [2.2, 1] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const enemy = units.ref(get(state, 2));
    state = blocking.acquire(state, target, enemy);
    const calls = [];
    state = update(
        state,
        target,
        units.setHook(hpDamage.targetApplied, {
            id: "target-observer",
            invoke(current) {
                calls.push([
                    "target",
                    get(current, 1).vitality.hp,
                    get(current, 1).lifecycle,
                    blocking.blockerOf(current, enemy).id,
                ]);
                const recovery = healingRequest(null, target, 20);
                const attempted = hpHealing.applyHealing(
                    recovery,
                    hpHealing.calculateHealing(current, recovery),
                );
                assert.equal(attempted.value.type, "REJECTED");
                const resumed = advanceCombat(attempted.state);
                assert.equal(get(resumed, 1)?.lifecycle, "PRESENT");
                return { state: resumed, value: undefined };
            },
        }),
    );
    state = update(
        state,
        source,
        units.setHook(hpDamage.sourceApplied, {
            id: "source-observer",
            invoke(current) {
                calls.push([
                    "source",
                    get(current, 1).vitality.hp,
                    get(current, 1).lifecycle,
                    blocking.blockerOf(current, enemy).id,
                ]);
                return { state: current, value: undefined };
            },
        }),
    );
    const request = damageRequest(source, target, 100);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.deepEqual(calls, [["target", 0, "PRESENT", 1], ["source", 0, "PRESENT", 1]]);
    assert.deepEqual(result.value.application, { hpBefore: 40, hpAfter: 0, hpLoss: 40 });
    assert.equal(result.value.killed, true);
    assert.equal(get(result.state, 1), undefined);
    assert.equal(get(result.state, 2).blockable.relation, null);
});

test("KILL-02: nested damage owns its kill even while Lifetime defers the victim's final removal", () => {
    const reports = [];
    const observe = {
        id: "kill-result",
        invoke(current, { request, outcome }) {
            reports.push([request.source.id, outcome.killed]);
            return { state: current, value: undefined };
        },
    };
    let state = battle([
        { definition: { id: "outer-source", hooks: Hooks.empty().set(hpDamage.completed, observe) }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: { maxHp: 40, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
        }, position: [1, 0] },
        { definition: { id: "inner-source", hooks: Hooks.empty().set(hpDamage.completed, observe) }, position: [2, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const otherSource = units.ref(get(state, 2));
    let nested;
    let outer;
    state = update(state, source, units.setHook(hpDamage.sourceApplied, {
        id: "additional-damage",
        invoke(current) {
            const request = damageRequest(otherSource, target, 40);
            nested = hpDamage.applyDamage(request, hpDamage.calculateDamage(current, request));
            assert.equal(get(nested.state, target.id).lifecycle, "LEAVING");
            return { state: nested.state, value: undefined };
        },
    }));
    const installed = effects.install(state, source, {
        id: "damage-on-end", initialize: () => ({}),
        onEnd(current) {
            const request = damageRequest(source, target, 10);
            outer = hpDamage.applyDamage(request, hpDamage.calculateDamage(current, request));
            assert.equal(get(outer.state, target.id).lifecycle, "LEAVING");
            return outer.state;
        },
    });
    state = effects.end(installed.state, installed.value);

    assert.equal(nested.value.killed, true);
    assert.equal(outer.value.killed, false);
    assert.deepEqual(outer.value.application, { hpBefore: 40, hpAfter: 30, hpLoss: 10 });
    assert.deepEqual(reports, [[otherSource.id, true], [source.id, false]]);
    assert.equal(get(state, target.id), undefined);
});

test("KILL-02: damage started by Completed cannot change the already determined outer kill result", () => {
    let nested;
    let observed;
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: { maxHp: 40, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(state, source, units.setHook(hpDamage.completed, {
        id: "late-damage",
        invoke(current, { outcome }) {
            observed = outcome;
            const request = damageRequest(null, target, 40);
            nested = hpDamage.applyDamage(request, hpDamage.calculateDamage(current, request));
            return { state: nested.state, value: undefined };
        },
    }));
    const request = damageRequest(source, target, 10);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));

    assert.equal(observed.killed, false);
    assert.equal(result.value.killed, false);
    assert.equal(nested.value.killed, true);
    assert.equal(get(result.state, target.id), undefined);
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
        }), elemental.setRule("damageRules", {
            id: "only-neural", allows: (_current, { type }) => type === "NEURAL",
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
        nature: "DAMAGE", hitRecovery: true, parameters: { type: "ELEMENTAL", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    const hp = hpDamage.applyDamage(hpRequest, hpDamage.calculateDamage(applied.state, hpRequest));
    assert.equal(hp.value.application.hpLoss, 5);
    assert.equal(get(hp.state, 0).elemental.ep.NEURAL, 970);
});

test("EP-02: depletion registers the Burst and completes standard output before resource notifications and Applied", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", invoke: current => {
                order.push("program");
                return { state: current, value: undefined };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([
        { definition: {
            ...elementalDefinition({}, hooks),
            vitality: { maxHp: 10000, defense: 0, resistance: 50, recoverySpeed: 0, recoveryRatio: 0 },
        }, position: [0, 0] },
        { definition: { id: "source", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const source = units.ref(get(state, 1));
    state = update(state, target, units.compose(elemental.setHook("burstStarted", {
            id: "creation", invoke(current, { event }) {
                order.push("started");
                const reference = effects.ref(event);
                assert.equal(get(current, 0).elemental.burst.id, reference.id);
                return { state: current, value: undefined };
            },
        }), elemental.setHook("damaged", {
            id: "loss", invoke(current) { order.push("damaged"); return { state: current, value: undefined }; },
        })));
    const preceding = injuryRequest(target, "NEURAL", 200);
    state = epDamage.applyDamage(preceding, epDamage.calculateDamage(state, preceding)).state;
    order.length = 0;
    const incoming = injuryRequest(target, "BURN", 1000, source);
    const result = epDamage.applyDamage(incoming, epDamage.calculateDamage(state, incoming));
    assert.deepEqual(order, ["started", "program", "damaged", "applied"]);
    assert.deepEqual(get(result.state, 0).elemental.ep, elemental.elementValues(0));
    assert.equal(get(result.state, 0).vitality.hp, 9160);
    assert.equal(vitality.resolveResistance(result.state, get(result.state, 0)), 30);
    assert.deepEqual(elemental.get(result.state, result.value.application.burst).source, source);

});

test("EP-02: cancelling a newly registered Burst suppresses standard output without rewriting the loss report", () => {
    const order = [];
    const hooks = Hooks.empty()
        .set(hpDamage.beforeReceive, {
            id: "standard-output", invoke: current => {
                order.push("program"); return { state: current, value: undefined };
            },
        })
        .set(epDamage.targetApplied, {
            id: "applied", invoke: current => { order.push("applied"); return { state: current, value: undefined }; },
        });
    let state = battle([{ definition: {
        ...elementalDefinition({}, hooks),
        vitality: { maxHp: 10000, defense: 0, resistance: 50, recoverySpeed: 0, recoveryRatio: 0 },
    }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    state = update(state, target, units.compose(units.compose(elemental.setHook("burstStarted", {
            id: "cancel", invoke(current, { event }) {
                order.push("started");
                return { state: elemental.cancel(current, effects.ref(event), "CONTENT"), value: undefined };
            },
        }), elemental.setHook("burstEnded", {
            id: "end", invoke(current) { order.push("ended"); return { state: current, value: undefined }; },
        })), elemental.setHook("damaged", {
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
    assert.equal(get(result.state, 0).vitality.hp, 10000);
    assert.equal(vitality.resolveResistance(result.state, get(result.state, 0)), 50);
});
