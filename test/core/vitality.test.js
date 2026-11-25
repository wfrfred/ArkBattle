// Contract: [vitality](../../docs/architecture/vitality.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import { update, remove } from "../../dist/core/unit/operations.js";
import { step } from "../../dist/core/battle/runtime.js";
import { TICKS_PER_SECOND } from "../../dist/core/tick.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as hpHealing from "../../dist/core/battle/resource/hp/healing/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as modifier from "../../dist/core/common/modifier.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import * as effects from "../../dist/core/effect/index.js";
import * as actions from "../../dist/core/unit/capability/action/index.js";
import { healFree } from "../../dist/core/effects/protection.js";

const damageRequest = (source, target, power) => ({
    source, killer: source, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true,
    parameters: { type: "TRUE", attack: { power, multiplier: 1, addition: 0 } },
});

const healingRequest = (source, target, power) => ({
    source, target, parameters: { power, multiplier: 1 },
});

test("HP-07: natural recovery samples current attributes after Effects and before Action without ordinary healing", () => {
    const observed = [];
    const damageCommits = [];
    const ordinaryHealing = () => assert.fail("natural recovery must not enter ordinary healing");
    const observer = {
        id: "observe-recovery", applyWay: "NONE", period: { type: "FIXED", ticks: 0 },
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: {} }),
        onTick(state, source, self) {
            observed.push(get(state, 0).vitality.health.hp);
            return actions.finish(state, actions.executionRef(self));
        },
    };
    let state = battle([
        { definition: {
            id: "recovering", presence: {},
            vitality: defineVitality(100, { recoverySpeed: defineAttribute(3), recoveryRatio: defineAttribute(0.03, 0, 1) }),
            hooks: Hooks.empty()
                .set(hpHealing.targetFormula, { id: "formula", invoke: ordinaryHealing })
                .set(hpHealing.beforeReceive, { id: "before", invoke: ordinaryHealing })
                .set(hpHealing.targetApplied, { id: "applied", invoke: ordinaryHealing })
                .set(vitality.damageCommitting, {
                    id: "observe-damage-commit",
                    invoke(current, context, health) {
                        damageCommits.push([context.previous.hp, health.hp]);
                        return { state: current, value: health };
                    },
                }),
        }, position: [0, 0] },
        { definition: {
            id: "observer", hooks: Hooks.empty(),
            action: { speed: defineAttribute(100, 20), interval: defineAttribute(10), definitions: [observer] },
        }, position: [1, 0] },
    ]);
    const target = units.ref(get(state, 0));
    const loss = amount => ({
        source: null, target, attackType: "NONE", applyWay: "NONE", nature: "LOSS", hitRecovery: false, killer: null,
        parameters: { type: "TRUE", attack: { power: amount, multiplier: 1, addition: 0 } },
    });
    const initialLoss = loss(60);
    state = hpDamage.applyDamage(initialLoss, hpDamage.calculateDamage(state, initialLoss)).state;
    assert.deepEqual(damageCommits, [[100, 40]]);
    state = effects.install(state, target, healFree).state;
    state = effects.install(state, target, {
        id: "recovery-contributions", initialize: () => ({}),
        onTick(current, self) {
            return update(current, self.ref.host, units.compose(
                vitality.setContribution("recoverySpeed", {
                    id: "fixed", value: current => [modifier.create({ addition: current.tick * 3 })],
                }),
                vitality.setContribution("recoveryRatio", {
                    id: "ratio", value: [modifier.create({ addition: 0.03 })],
                }),
            ));
        },
    }).state;
    state = update(state, target, units.compose(
        presence.disappear(),
        units.setHook(hpHealing.receiving, { id: "receive", invoke: ordinaryHealing }),
    ));
    state = step(state, []);
    assert.equal(observed.length, 1);
    assert.ok(Math.abs(observed[0] - 40.3) < 1e-10);
    assert.equal(state.events.some(event => event.type === "HEAL"), false);

    state = update(state, target, vitality.setMaxHpContribution({
        id: "larger-pool", value: [modifier.create({ multiplier: 1 })],
    }));
    state = step(state, []);
    assert.equal(vitality.resolveRecoverySpeed(state, get(state, 0)), 21);
    assert.equal(observed.length, 2);
    assert.ok(Math.abs(observed[1] - 81.2) < 1e-10);
    assert.equal(state.events.some(event => event.type === "HEAL"), false);

    state = update(state, target, vitality.setContribution("recoveryRatio", {
        id: "ratio", value: [modifier.create({ addition: 2 })],
    }));
    assert.equal(vitality.resolveRecoverySpeed(state, get(state, 0)), 209);
    state = update(state, target, vitality.setContribution("recoverySpeed", {
        id: "fixed", value: [modifier.create({ addition: 10000 })],
    }));
    state = vitality.advance(state, target);
    assert.equal(get(state, 0).vitality.health.hp, 200);
    assert.equal(vitality.advance(state, target), state);
    assert.deepEqual(damageCommits, [[100, 40]]);

    state = update(state, target, units.setHook(hpDamage.targetApplied, {
        id: "zero-hp", invoke(current) {
            assert.equal(get(current, 0).vitality.health.hp, 0);
            assert.equal(vitality.advance(current, target), current);
            const restored = vitality.increaseHp(current, target, 30);
            assert.equal(get(restored.state, 0).vitality.health.hp, 30);
            assert.equal(restored.state.events.some(event => event.type === "HEAL"), false);
            return { state: current, value: undefined };
        },
    }));
    const lethal = loss(200);
    state = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(state, lethal)).state;
    assert.equal(get(state, 0), undefined);
});

test("HP-08: Health protection commits before its consequences and preserves the original report", () => {
    const calls = [];
    let committed = 0;
    let applied = 0;
    let observed;
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target",
            vitality: defineVitality(100),
            hooks: Hooks.empty()
                .set(hpDamage.beforeReceive, {
                    id: "fixed-reception",
                    invoke: (current, _context, pending) => ({ state: current, value: hpDamage.fix(pending) }),
                })
                .set(vitality.damageCommitting, {
                    id: "last",
                    invoke(current, context, health) {
                        calls.push("last");
                        assert.deepEqual(context.previous, { hp: 100, minusHp: 0 });
                        assert.deepEqual(health, { hp: 1, minusHp: 10 });
                        return { state: current, value: { hp: 10, minusHp: 0 } };
                    },
                })
                .set(vitality.damageCommitting, {
                    id: "first", priority: 10,
                    invoke(current, context, health) {
                        calls.push("first");
                        assert.deepEqual(context.previous, { hp: 100, minusHp: 0 });
                        assert.deepEqual(health, { hp: 1, minusHp: 50 });
                        return {
                            state: update(current, context.request.target, vitality.setContribution("defense", {
                                id: "armor", value: [modifier.create({ addition: 20 })],
                            })),
                            value: { ...health, minusHp: 10 },
                        };
                    },
                })
                .set(vitality.damageCommitted, {
                    id: "commit-consequences",
                    invoke(current, { request, application }) {
                        calls.push("committed");
                        committed++;
                        observed = application;
                        assert.deepEqual(get(current, request.target.id).vitality.health, application.after);
                        current = update(current, request.target, vitality.setMaxHpContribution({
                            id: "larger-pool", value: [modifier.create({ multiplier: 1 })],
                        }));
                        const recovery = healingRequest(null, request.target, 10);
                        return {
                            state: hpHealing.applyHealing(recovery, hpHealing.calculateHealing(current, recovery)).state,
                            value: undefined,
                        };
                    },
                })
                .set(hpDamage.targetApplied, {
                    id: "target-observer",
                    invoke(current, { request, application }) {
                        calls.push("targetApplied");
                        assert.equal(application, observed);
                        assert.deepEqual(get(current, request.target.id).vitality.health, { hp: 30, minusHp: 0 });
                        return { state: current, value: undefined };
                    },
                }),
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(state, target, vitality.setMaxMinusHpRatio(1));
    state = update(state, source, units.setHook(hpDamage.sourceApplied, {
        id: "source-observer",
        invoke(current, { application }) {
            calls.push("sourceApplied");
            applied++;
            assert.equal(application, observed);
            return { state: current, value: undefined };
        },
    }));
    const request = damageRequest(source, target, 150);
    const protectedHit = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), {
        exclude: [[vitality.damageCommitting, null], [vitality.damageCommitted, null]],
    });
    assert.equal(protectedHit.value.type, "APPLIED");
    assert.deepEqual(protectedHit.value.received, { type: "FIXED", amount: 150 });
    assert.deepEqual(calls, ["first", "last", "committed", "targetApplied", "sourceApplied"]);
    assert.deepEqual(protectedHit.value.application, {
        before: { hp: 100, minusHp: 0 }, after: { hp: 10, minusHp: 0 }, hpLoss: 90, minusHpGain: 0,
    });
    assert.deepEqual(protectedHit.state.events.map(({ type, amount }) => [type, amount]), [
        ["DAMAGE", 90],
        ["HEAL", 10],
    ]);
    assert.equal(protectedHit.value.killed, false);
    assert.equal(vitality.resolveDefense(protectedHit.state, get(protectedHit.state, target.id)), 20);
    assert.equal(committed, 1);
    assert.equal(applied, 1);

    state = update(protectedHit.state, target, units.setHook(vitality.damageCommitting, {
        id: "remove-host", priority: 10000,
        invoke(current, context, value) {
            return { state: remove(current, context.request.target, { reason: "SCRIPT" }), value };
        },
    }));
    const unavailable = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.deepEqual(unavailable.value, { type: "UNAVAILABLE", received: { type: "FIXED", amount: 150 } });
    assert.equal(get(unavailable.state, target.id), undefined);
    assert.equal(committed, 1);
    assert.equal(applied, 1);
    assert.equal(unavailable.state.events.filter(event => event.type === "DAMAGE").length,
        protectedHit.state.events.filter(event => event.type === "DAMAGE").length);
});

test("HP-09: Vitality settles life debt across damage, recovery and MaxHP changes", () => {
    let committing = 0;
    let committed = 0;
    let healing = 0;
    let capacityReport;
    let state = battle([{ definition: {
        id: "life-debt",
        vitality: defineVitality(100, { recoverySpeed: defineAttribute(TICKS_PER_SECOND) }),
        hooks: Hooks.empty()
            .set(vitality.damageCommitting, {
                id: "observe-committing",
                invoke(current, _context, health) {
                    committing++;
                    return { state: current, value: health };
                },
            })
            .set(vitality.damageCommitted, {
                id: "observe-committed",
                invoke(current) {
                    committed++;
                    return { state: current, value: undefined };
                },
            })
            .set(hpHealing.targetApplied, {
                id: "observe-healing",
                invoke(current) {
                    healing++;
                    return { state: current, value: undefined };
                },
            }),
    }, position: [0, 0] }, { definition: {
        id: "recovery-source",
        hooks: Hooks.empty().set(hpHealing.sourceApplied, {
            id: "observe-finished-recovery",
            invoke(current, { request, application }) {
                assert.equal(get(current, request.target.id), undefined);
                capacityReport = application;
                return { state: current, value: undefined };
            },
        }),
    }, position: [1, 0] }]);
    const target = units.ref(get(state, 0));
    assert.equal(vitality.resolveMaxMinusHp(get(state, 0).definition.vitality, get(state, 0).vitality), 0);
    state = update(state, target, vitality.setMaxMinusHpRatio(1));

    const initial = damageRequest(null, target, 150);
    const first = hpDamage.applyDamage(initial, hpDamage.calculateDamage(state, initial));
    assert.deepEqual(first.value.application, {
        before: { hp: 100, minusHp: 0 }, after: { hp: 1, minusHp: 50 }, hpLoss: 99, minusHpGain: 50,
    });
    assert.equal(first.value.killed, false);
    const followUp = damageRequest(null, target, 30);
    const second = hpDamage.applyDamage(followUp, hpDamage.calculateDamage(first.state, followUp));
    assert.deepEqual(get(second.state, 0).vitality.health, { hp: 1, minusHp: 80 });
    assert.equal(second.value.application.hpLoss, 0);
    assert.equal(second.value.application.minusHpGain, 30);
    assert.equal(vitality.isAlive(get(second.state, 0)), true);
    assert.equal(vitality.hpRatio(get(second.state, 0)), 0.01);

    const directRecoveryState = update(second.state, target, units.setHook(hpHealing.receiving, {
        id: "reject-ordinary-healing",
        invoke: () => assert.fail("direct HP recovery must not enter Healing"),
    }));
    const directlyRecovered = vitality.increaseHp(directRecoveryState, target, 200);
    assert.deepEqual(directlyRecovered.value, {
        before: { hp: 1, minusHp: 80 }, after: { hp: 100, minusHp: 0 }, hpGain: 99, minusHpLoss: 80, overflow: 21,
    });
    assert.equal(directlyRecovered.state.events.some(event => event.type === "HEAL"), false);
    assert.deepEqual([committing, committed, healing], [2, 2, 0]);

    const naturallyRecovered = vitality.advance(second.state, target);
    assert.deepEqual(get(naturallyRecovered, 0).vitality.health, { hp: 1, minusHp: 79 });
    assert.equal(naturallyRecovered.events.some(event => event.type === "HEAL"), false);
    const enlarged = update(second.state, target, vitality.setMaxHpContribution({
        id: "larger-pool", value: [modifier.create({ multiplier: 1 })],
    }));
    assert.deepEqual(get(enlarged, 0).vitality.health, { hp: 1, minusHp: 79 });
    assert.equal(vitality.resolveMaxMinusHp(get(enlarged, 0).definition.vitality, get(enlarged, 0).vitality), 200);
    const lowerCapacity = update(second.state, target, vitality.setMaxMinusHpRatio(0.5));
    assert.deepEqual(get(lowerCapacity, 0).vitality.health, { hp: 1, minusHp: 80 });
    assert.equal(vitality.resolveMaxMinusHp(get(lowerCapacity, 0).definition.vitality, get(lowerCapacity, 0).vitality), 50);
    const pausedRecovery = update(lowerCapacity, target, vitality.setContribution("recoverySpeed", {
        id: "pause-recovery", value: [modifier.create({ addition: -TICKS_PER_SECOND })],
    }));
    assert.equal(vitality.advance(pausedRecovery, target), pausedRecovery);
    assert.equal(get(vitality.advance(lowerCapacity, target), 0), undefined);
    assert.deepEqual([committing, committed, healing], [2, 2, 0]);

    const capacityRecovery = healingRequest(units.ref(get(lowerCapacity, 1)), target, 1);
    const departedRecovery = hpHealing.applyHealing(capacityRecovery,
        hpHealing.calculateHealing(lowerCapacity, capacityRecovery));
    assert.equal(departedRecovery.value.type, "APPLIED");
    assert.equal(departedRecovery.value.application, capacityReport);
    assert.deepEqual(capacityReport.before, { hp: 1, minusHp: 80 });
    assert.deepEqual(capacityReport.after, { hp: 0, minusHp: 50 });
    assert.equal(get(departedRecovery.state, 0), undefined);
    const recoveryEvents = departedRecovery.state.events.slice(lowerCapacity.events.length);
    assert.deepEqual(recoveryEvents.map(event => event.type), ["HEAL", "UNIT_REMOVED"]);
    assert.equal(recoveryEvents[0].amount, 0);

    const recovery = healingRequest(null, target, 100);
    const restored = hpHealing.applyHealing(recovery, hpHealing.calculateHealing(second.state, recovery));
    assert.deepEqual(restored.value.application, {
        before: { hp: 1, minusHp: 80 }, after: { hp: 21, minusHp: 0 }, hpGain: 20, minusHpLoss: 80, overflow: 0,
    });
    const excess = healingRequest(null, target, 200);
    const overflowing = hpHealing.applyHealing(excess, hpHealing.calculateHealing(restored.state, excess));
    assert.deepEqual(overflowing.value.application, {
        before: { hp: 21, minusHp: 0 }, after: { hp: 100, minusHp: 0 }, hpGain: 79, minusHpLoss: 0, overflow: 121,
    });

    const lethal = damageRequest(null, target, 20);
    const ended = hpDamage.applyDamage(lethal, hpDamage.calculateDamage(second.state, lethal));
    assert.deepEqual(ended.value.application, {
        before: { hp: 1, minusHp: 80 }, after: { hp: 0, minusHp: 100 }, hpLoss: 1, minusHpGain: 20,
    });
    assert.equal(ended.value.killed, true);
    assert.equal(get(ended.state, 0), undefined);
    const bounded = update(restored.state, target, vitality.setRange("maxHp", { min: null, max: 50 }));
    assert.deepEqual(get(bounded, 0).vitality.health, { hp: 10.5, minusHp: 0 });
    const cleared = update(bounded, target, vitality.clearRange("maxHp"));
    assert.deepEqual(get(cleared, 0).vitality.health, { hp: 21, minusHp: 0 });
    const reducedCapacity = update(second.state, target, vitality.setRange("maxHp", { min: null, max: 50 }));
    assert.equal(get(reducedCapacity, 0), undefined);
    assert.deepEqual([committing, committed, healing], [3, 3, 2]);
    assert.deepEqual(get(second.state, 0).vitality.health, { hp: 1, minusHp: 80 });
});
