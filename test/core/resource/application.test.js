// Contract: [resource](../../../docs/architecture/resource.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../../helpers/battle.js";
import { Hooks, key } from "../../../dist/core/hook.js";
import * as units from "../../../dist/core/unit/index.js";
import { update, remove } from "../../../dist/core/unit/operations.js";
import { advance as advanceCombat } from "../../../dist/core/battle/steps/combat.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import * as epDamage from "../../../dist/core/battle/resource/ep/damage/index.js";
import * as hpHealing from "../../../dist/core/battle/resource/hp/healing/index.js";
import * as epHealing from "../../../dist/core/battle/resource/ep/healing/index.js";
import * as vitality from "../../../dist/core/unit/capability/vitality/index.js";
import * as elemental from "../../../dist/core/unit/capability/elemental/index.js";
import * as modifier from "../../../dist/core/common/modifier.js";
import * as blocking from "../../../dist/core/battle/blocking/index.js";
import * as effects from "../../../dist/core/unit/effect/index.js";
import { invincible, invincibleHpDamageRestriction } from "../../../dist/core/effects/protection.js";
import * as presence from "../../../dist/core/unit/capability/presence/index.js";
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

test("HOOK-02: exclusions are local to each operation and match a key or one ID across its hosts", () => {
    const formulaCalls = [];
    const receptions = [];
    let expanded = false;
    const completions = [];
    const completion = (host, id) => ({
        id,
        invoke(state) { completions.push(`${host}:${id}`); return { state, value: undefined }; },
    });
    const receiving = host => ({
        id: "receive",
        invoke(state, _context, current) {
            receptions.push(host);
            return { state, value: current.type === "NORMAL" ? { ...current, amount: current.amount + 3 } : current };
        },
    });
    const sourceHooks = Hooks.empty()
        .set(hpDamage.sourceFormula, {
            id: "formula",
            invoke(state, _context, current) { formulaCalls.push("source"); return { state, value: current }; },
        })
        .set(hpDamage.output, {
            id: "boost",
            accepts() { formulaCalls.push("boost-accepts"); return true; },
            invoke(state, _context, current) { formulaCalls.push("boost"); return { state, value: current + 100 }; },
        })
        .set(hpDamage.output, {
            id: "keep",
            invoke(state, _context, current) { formulaCalls.push("keep"); return { state, value: current + 1 }; },
        })
        .set(hpDamage.beforeCommit, {
            id: "nested",
            invoke(state) {
                const inner = damageRequest(null, units.ref(get(state, 2)), 5);
                return { state: hpDamage.applyDamage(inner, hpDamage.calculateDamage(state, inner)).state, value: undefined };
            },
        })
        .set(hpDamage.completed, completion("source", "shared"))
        .set(hpDamage.completed, completion("source", "kept"));
    const targetHooks = Hooks.empty()
        .set(hpDamage.targetFormula, {
            id: "formula",
            invoke(state, _context, current) {
                formulaCalls.push("target");
                return { state, value: { ...current, attack: { ...current.attack, power: current.attack.power * 2 } } };
            },
        })
        .set(hpDamage.beforeReceive, {
            id: "receive",
            invoke(state, { request: { target } }, current) {
                receptions.push("before");
                if (!expanded) {
                    expanded = true;
                    const late = stage => ({
                        id: "late",
                        invoke(next, _context, pending) {
                            receptions.push(stage);
                            return { state: next, value: pending };
                        },
                    });
                    state = update(state, target, units.compose(
                        units.setHook(hpDamage.beforeReceive, late("late-before")),
                        units.setHook(hpDamage.receiving, late("late-receiving")),
                    ));
                }
                return {
                    state,
                    value: current.type === "NORMAL" ? { ...current, amount: current.amount + 2 } : current,
                };
            },
        })
        .set(hpDamage.receiving, receiving("outer"))
        .set(hpDamage.completed, completion("target", "shared"))
        .set(hpDamage.completed, completion("target", "kept"));
    const vitality = defineVitality(1000);
    let state = battle([
        { definition: { id: "source", hooks: sourceHooks }, position: [0, 0] },
        { definition: { id: "target", hooks: targetHooks, vitality }, position: [1, 0] },
        { definition: { id: "nested-target", vitality, hooks: Hooks.empty()
            .set(hpDamage.receiving, receiving("nested"))
            .set(hpDamage.completed, completion("nested", "shared")),
        }, position: [2, 0] },
    ]);
    const request = damageRequest(units.ref(get(state, 0)), units.ref(get(state, 1)), 10);
    const first = hpDamage.calculateDamage(state, request, {
        exclude: [[hpDamage.targetFormula, null], [hpDamage.output, "boost"], [hpDamage.beforeReceive, null], [hpDamage.receiving, null]],
    });
    assert.equal(first.value.amount, 11);
    assert.deepEqual(formulaCalls, ["source", "keep"]);
    const applied = hpDamage.applyDamage(request, first);
    assert.equal(applied.value.application.hpLoss, 16);
    assert.deepEqual(receptions, ["before", "outer", "late-receiving", "nested"]);
    assert.deepEqual(completions, ["nested:shared", "target:shared", "target:kept", "source:shared", "source:kept"]);

    formulaCalls.length = receptions.length = completions.length = 0;
    const sameName = key(hpDamage.targetFormula.name);
    const second = hpDamage.calculateDamage(applied.state, request, { exclude: [[sameName, null]] });
    assert.equal(second.value.amount, 121);
    assert.deepEqual(formulaCalls, ["source", "target", "boost-accepts", "boost", "keep"]);
    const excluded = hpDamage.applyDamage(request, second, {
        exclude: [[hpDamage.receiving, null], [hpDamage.completed, "shared"]],
    });
    assert.equal(excluded.value.application.hpLoss, 123);
    assert.deepEqual(receptions, ["before", "late-before", "nested"]);
    assert.deepEqual(completions, ["nested:shared", "target:kept", "source:kept"]);

    receptions.length = completions.length = 0;
    const normal = hpDamage.applyDamage(request, { state: excluded.state, value: second.value }, {
        exclude: [[hpDamage.beforeReceive, null]],
    });
    assert.equal(normal.value.application.hpLoss, 124);
    assert.deepEqual(receptions, ["outer", "late-receiving", "nested"]);
    assert.deepEqual(completions, ["nested:shared", "target:shared", "target:kept", "source:shared", "source:kept"]);
    assert.equal(get(normal.state, 2).vitality.health.hp, 976);
});

test("APPLY-01: cancellation before immunity preserves its outcome and suppresses HIT until protection ends", () => {
    const resource = {
        id: "hit-recovery", initialize: state => ({ state, value: {} }), activation: null,
        sp: { initial: 0, capacity: 5, recovery: { type: "HIT", amount: 1 }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
    };
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(), targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] }, vitality: defineVitality(100),
            skill: { definition: resource },
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
                invoke(current, context, pending) {
                    const installed = effects.install(current, target, invincible);
                    protection = installed.value;
                    return {
                        state: installed.state,
                        value: hpDamage.cancel(pending, "MISS", context.forbidden),
                    };
                },
            }),
            units.setHook(hpDamage.receiving, {
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
    assert.equal(result.value.type, "CANCELLED");
    assert.deepEqual(result.value.received, { type: "CANCELLED", amount: 30, reason: "MISS" });
    assert.equal(get(result.state, 1).vitality.health.hp, 100);
    assert.equal(get(result.state, 1).skill.sp.value, 0);
    assert.deepEqual(receivedSp, []);
    assert.equal(commits, 0);

    const rejected = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), {
        forbidden: new Set(["MISS"]),
    });
    assert.equal(rejected.value.type, "REJECTED");
    assert.equal(get(rejected.state, 1).skill.sp.value, 0);
    assert.deepEqual(receivedSp, []);
    assert.equal(commits, 0);

    state = update(rejected.state, target, units.removeHook(hpDamage.beforeReceive, "enable-immunity"));
    state = effects.remove(state, protection);
    const accepted = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(accepted.value.application.hpLoss, 30);
    assert.equal(get(accepted.state, 1).skill.sp.value, 1);
    assert.deepEqual(receivedSp, [1]);
    assert.equal(commits, 1);

    state = update(accepted.state, target, units.setHook(hpDamage.beforeReceive, {
        id: "zero-reception",
        invoke(current, _context, pending) {
            return {
                state: current,
                value: pending.type === "NORMAL" ? { ...pending, amount: 0 } : pending,
            };
        },
    }));
    const zeroed = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(zeroed.value.type, "APPLIED");
    assert.equal(zeroed.value.application.hpLoss, 0);
    assert.equal(get(zeroed.state, 1).skill.sp.value, 1);
    assert.deepEqual(receivedSp, [1, 1]);
    assert.equal(commits, 2);
});

test("RESTRICTION-02: damage exemptions cover one mechanism through reentrant checks without leaking to nested damage", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(), targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] },
            vitality: defineVitality(100),
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = effects.install(state, target, invincible).state;
    state = effects.install(state, target, invincible).state;
    const separateMechanism = { allows: invincibleHpDamageRestriction.allows };
    state = update(state, target, vitality.setRestriction({ id: "separate", value: separateMechanism }));
    const request = damageRequest(source, target, 30);
    const options = { ignore: restriction => restriction === invincibleHpDamageRestriction };
    const rejected = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), options);
    assert.equal(rejected.value.type, "REJECTED");
    assert.equal(get(rejected.state, 1).vitality.health.hp, 100);

    state = update(rejected.state, target, units.compose(
        vitality.removeRestriction("separate"),
        units.setHook(hpDamage.receiving, {
            id: "protect-again",
            invoke(current, _context, pending) {
                return { state: effects.install(current, target, invincible).state, value: pending };
            },
        }),
    ));
    let nested;
    state = update(state, source, units.setHook(hpDamage.beforeCommit, {
        id: "protect-and-nest",
        invoke(current) {
            current = effects.install(current, target, invincible).state;
            const next = damageRequest(source, target, 5);
            const applied = hpDamage.applyDamage(next, hpDamage.calculateDamage(current, next));
            nested = applied.value.type;
            return { state: applied.state, value: undefined };
        },
    }));
    const accepted = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), options);
    assert.equal(accepted.value.application.hpLoss, 30);
    assert.equal(nested, "REJECTED");
    assert.equal(get(accepted.state, 1).vitality.health.hp, 70);
    assert.equal(hpDamage.applyDamage(request, hpDamage.calculateDamage(accepted.state, request)).value.type, "REJECTED");
    state = remove(accepted.state, target, { reason: "SCRIPT" });
    assert.equal(hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), { ignore: () => true }).value.type, "REJECTED");
});

test("APPLY-01: Receiving and BeforeCommit resource changes define the baseline while Applied preserves the report", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: defineVitality(100) }, position: [1, 0] },
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
                units.setHook(hpHealing.targetApplied, {
                    id: "ordinary-healing",
                    invoke(current) {
                        healingNotifications++;
                        return { state: current, value: undefined };
                    },
                }),
                units.setHook(hpDamage.receiving, {
                    id: "larger-hp-pool",
                    invoke(current, _context, pending) {
                        calls.push("receiving");
                        return {
                            state: update(
                                current,
                                target,
                                vitality.setMaxHpContribution({
                                    id: "larger-hp",
                                    value: [modifier.create({ multiplier: 1 })],
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
    assert.deepEqual(calls, ["receiving", "beforeCommit", "targetApplied", "sourceApplied"]);
    assert.deepEqual(result.value.application, { before: { hp: 145, minusHp: 0 }, after: { hp: 115, minusHp: 0 }, hpLoss: 30, minusHpGain: 0 });
    assert.equal(get(result.state, 1).vitality.health.hp, 125);
    assert.equal(healingNotifications, 2);

    state = update(result.state, target, vitality.setMaxHpContribution({
        id: "larger-hp", value: [modifier.create({ multiplier: 2 })],
    }));
    assert.equal(get(state, 1).vitality.health.hp, 187.5);
    assert.equal(vitality.resolveMaxHp(get(state, 1).definition.vitality, get(state, 1).vitality), 300);
    state = update(state, target, vitality.removeMaxHpContribution("larger-hp"));
    assert.equal(get(state, 1).vitality.health.hp, 62.5);
    assert.equal(vitality.resolveMaxHp(get(state, 1).definition.vitality, get(state, 1).vitality), 100);
    assert.equal(healingNotifications, 2);
});

test("APPLY-01: cancellation permissions retain recovery and reflection while only uncancelled work commits", () => {
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), vitality: defineVitality(100) }, position: [0, 0] },
        { definition: { id: "target", hooks: Hooks.empty(), vitality: defineVitality(100) }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const forbidden = new Set(["MISS", "BLOCKED"]);
    const receivingForbiddens = [];
    let commits = 0;
    let applied = 0;
    const preparation = damageRequest(null, source, 40);
    state = hpDamage.applyDamage(preparation, hpDamage.calculateDamage(state, preparation)).state;
    state = update(
        state,
        target,
        units.compose(
            units.compose(
                units.setHook(hpDamage.receiving, {
                    id: "evade",
                    priority: 10,
                    invoke(current, context, pending) {
                        receivingForbiddens.push(context.forbidden);
                        const recovery = healingRequest(null, source, 6);
                        current = hpHealing.applyHealing(
                            recovery,
                            hpHealing.calculateHealing(current, recovery),
                        ).state;
                        const next = hpDamage.cancel(pending, "MISS", context.forbidden);
                        if (context.forbidden.has("MISS")) {
                            assert.equal(next, pending);
                            assert.equal(next.type, "NORMAL");
                        }
                        return { state: current, value: next };
                    },
                }),
                units.setHook(hpDamage.receiving, {
                    id: "reflect",
                    invoke(current, context, pending) {
                        assert.equal(context.forbidden, receivingForbiddens.at(-1));
                        let next;
                        if (pending.type === "CANCELLED") {
                            assert.equal(pending.reason, "MISS");
                            next = hpDamage.cancel(pending, "BLOCKED", context.forbidden);
                            assert.equal(next, pending);
                        } else {
                            const fixed = hpDamage.fix(pending);
                            next = hpDamage.cancel(fixed, "BLOCKED", context.forbidden);
                            assert.equal(next, fixed);
                            assert.equal(next.type, "FIXED");
                        }
                        const reflection = damageRequest(target, source, 10);
                        return {
                            state: hpDamage.applyDamage(
                                reflection,
                                hpDamage.calculateDamage(current, reflection),
                            ).state,
                            value: next,
                        };
                    },
                }),
            ),
            units.setHook(hpDamage.targetApplied, {
                id: "applied",
                invoke(current, context) {
                    assert.equal(context.forbidden, receivingForbiddens.at(-1));
                    applied++;
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
                invoke(current, context) {
                    assert.equal(context.forbidden, receivingForbiddens.at(-1));
                    commits++;
                    return { state: current, value: undefined };
                },
            }),
            units.setHook(hpDamage.receiving, {
                id: "observe-reflection",
                invoke(current, context, pending) {
                    assert.notEqual(context.forbidden, receivingForbiddens.at(-1));
                    assert.equal(context.forbidden.size, 0);
                    return { state: current, value: pending };
                },
            }),
        ),
    );
    const request = damageRequest(source, target, 20);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.deepEqual(result.value, { type: "CANCELLED", received: { type: "CANCELLED", amount: 20, reason: "MISS" } });
    assert.equal(get(result.state, 0).vitality.health.hp, 56);
    assert.equal(get(result.state, 1).vitality.health.hp, 100);
    assert.equal(commits, 0);
    assert.equal(applied, 0);
    assert.equal(receivingForbiddens[0].size, 0);

    const accepted = hpDamage.applyDamage(request, hpDamage.calculateDamage(result.state, request), { forbidden });
    assert.equal(accepted.value.type, "APPLIED");
    assert.equal(accepted.value.received.type, "FIXED");
    assert.equal(accepted.value.application.hpLoss, 20);
    assert.equal(get(accepted.state, 0).vitality.health.hp, 52);
    assert.equal(get(accepted.state, 1).vitality.health.hp, 80);
    assert.equal(commits, 1);
    assert.equal(applied, 1);
    assert.equal(receivingForbiddens[1], forbidden);

    let earlyForbidden;
    state = update(accepted.state, target, units.setHook(hpDamage.beforeReceive, {
        id: "cancel-before",
        invoke(current, context, pending) {
            earlyForbidden = context.forbidden;
            return { state: current, value: hpDamage.cancel(pending, "MISS", context.forbidden) };
        },
    }));
    const independent = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(independent.value.type, "CANCELLED");
    assert.equal(independent.value.received.reason, "MISS");
    assert.equal(get(independent.state, 0).vitality.health.hp, 48);
    assert.equal(get(independent.state, 1).vitality.health.hp, 80);
    assert.equal(receivingForbiddens[2].size, 0);
    assert.equal(receivingForbiddens[2], earlyForbidden);
    assert.notEqual(receivingForbiddens[2], receivingForbiddens[0]);
    assert.notEqual(receivingForbiddens[2], forbidden);
    assert.equal(commits, 1);
    assert.equal(applied, 1);
});

test("APPLY-02: HP zero output rejects while excess receiving reduction still commits and notifies", () => {
    const calls = [];
    let committedReport;
    let state = battle([
        { definition: { id: "source-without-vitality", hooks: Hooks.empty().set(hpDamage.output, {
            id: "strong-output", invoke(current, _context, amount) { calls.push("output"); return { state: current, value: amount * 2 }; },
        }) }, position: [0, 0] },
        { definition: {
            id: "target",
            vitality: defineVitality(100),
            hooks: Hooks.empty().set(vitality.damageCommitted, {
                id: "observe-committed",
                invoke(current, { application }) {
                    calls.push("committed");
                    committedReport = application;
                    assert.deepEqual(application, {
                        before: { hp: 100, minusHp: 0 }, after: { hp: 100, minusHp: 0 }, hpLoss: 0, minusHpGain: 0,
                    });
                    return { state: current, value: undefined };
                },
            }),
        }, position: [1, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = update(
        state,
        target,
        units.compose(
            units.setHook(hpDamage.receiving, {
                id: "absorb",
                invoke: (current, _context, pending) => ({
                    state: current,
                    value: { ...pending, amount: pending.amount - 100 },
                }),
            }),
            units.setHook(hpDamage.targetApplied, {
                id: "target",
                invoke(current, { received, application }) {
                    assert.equal(received.amount, 0);
                    assert.equal(application, committedReport);
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
                invoke(current, { received, application }) {
                    assert.equal(received.amount, 0);
                    assert.equal(application, committedReport);
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
    assert.equal(get(absorbed.state, 1).vitality.health.hp, 100);
    assert.deepEqual(calls, ["output", "beforeCommit", "committed", "targetApplied", "sourceApplied"]);

    calls.length = 0;
    state = update(absorbed.state, target, units.setHook(vitality.damageCommitted, {
        id: "observe-committed",
        invoke(current, { request, application }) {
            calls.push("committed");
            committedReport = application;
            return { state: remove(current, request.target, { reason: "SCRIPT" }), value: undefined };
        },
    }));
    const departed = hpDamage.applyDamage(positiveDamage, hpDamage.calculateDamage(state, positiveDamage));
    assert.equal(departed.value.type, "APPLIED");
    assert.equal(departed.value.application, committedReport);
    assert.deepEqual(departed.value.application, absorbed.value.application);
    assert.equal(departed.value.killed, false);
    assert.equal(get(departed.state, 1), undefined);
    assert.deepEqual(calls, ["output", "beforeCommit", "committed", "sourceApplied"]);
});

test("HP-05/06: LOSS completes the shared pipeline against an invincible absent target without HIT recovery", () => {
    const resource = {
        id: "hit-recovery", initialize: state => ({ state, value: {} }), activation: null,
        sp: { initial: 0, capacity: 5, recovery: { type: "HIT", amount: 1 }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
    };
    const calls = [];
    const observe = stage => ({
        id: stage,
        invoke(current, context, pending) {
            calls.push([stage, get(current, context.request.target.id).vitality.health.hp,
                get(current, context.request.target.id).skill.sp.value]);
            return { state: current, value: pending };
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
            id: "target", presence: {}, targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [] },
            vitality: defineVitality(35, { defense: defineAttribute(20) }),
            skill: { definition: resource },
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
        units.setHook(hpDamage.receiving, {
            id: "receiving",
            invoke(current, context, pending) {
                assert.equal(context.request.nature, "LOSS");
                assert.equal(pending.amount, 70);
                calls.push(["receiving", get(current, target.id).vitality.health.hp,
                    get(current, target.id).skill.sp.value]);
                return { state: current, value: pending };
            },
        }),
    ));
    const request = { ...damageRequest(source, target, 40, "PHYSICAL"), attackType: "NONE", nature: "LOSS" };
    const calculated = hpDamage.calculateDamage(state, request);
    assert.equal(calculated.value.amount, 70);
    assert.equal(get(calculated.state, target.id).vitality.health.hp, 35);
    assert.deepEqual(calls, []);
    const applied = hpDamage.applyDamage(request, calculated);
    assert.equal(applied.value.type, "APPLIED");
    assert.deepEqual(applied.value.application, { before: { hp: 35, minusHp: 0 }, after: { hp: 0, minusHp: 0 }, hpLoss: 35, minusHpGain: 0 });
    assert.deepEqual(calls, [
        ["beforeReceive", 35, 0], ["receiving", 35, 0],
        ["beforeCommit", 35, 0], ["targetApplied", 0, 0], ["sourceApplied", 0, 0],
    ]);
    assert.equal(get(applied.state, target.id), undefined);
});

test("EP-05: environmental EP uses ordinary resistance and reception, with immunity controlled by the existing hook", () => {
    const received = [];
    const applied = [];
    let state = battle([{ definition: {
        id: "environmental-ep-target",
        elemental: {
            ...createArknightsElementalDefinition({ receiver: "CHARACTER" }),
            elementResistance: defineAttribute(50, 0, 100),
        },
        hooks: Hooks.empty().set(epDamage.receiving, {
            id: "observe-reception",
            invoke(current, { request }, pending) {
                received.push(request.nature);
                return { state: current, value: pending };
            },
        }).set(epDamage.targetApplied, {
            id: "observe-application",
            invoke(current, { request }) {
                applied.push(request.nature);
                return { state: current, value: undefined };
            },
        }),
    }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    const environment = {
        source: null, target, attackType: "NONE", applyWay: "NONE", nature: "ENVIRONMENT",
        parameters: { type: "EROSION", power: 100 },
    };
    const first = epDamage.calculateDamage(state, environment);
    assert.equal(first.value.amount, 50);
    const unprotected = epDamage.applyDamage(environment, first);
    assert.equal(unprotected.value.type, "APPLIED");
    assert.equal(unprotected.value.application.epLoss, 50);
    state = update(unprotected.state, target, units.setHook(epDamage.beforeReceive, {
        id: "environment-immunity",
        accepts: (_current, { request }) => request.nature === "ENVIRONMENT",
        invoke: (current, context, pending) => ({
            state: current,
            value: epDamage.cancel(pending, "UNHURTABLE", context.forbidden),
        }),
    }));
    const ordinary = { ...environment, nature: "DAMAGE" };
    const accepted = epDamage.applyDamage(ordinary, epDamage.calculateDamage(state, ordinary));
    assert.equal(accepted.value.type, "APPLIED");
    assert.equal(accepted.value.application.epLoss, 50);
    const immune = epDamage.applyDamage(environment, epDamage.calculateDamage(accepted.state, environment));
    assert.equal(immune.value.type, "CANCELLED");
    assert.equal(immune.value.received.reason, "UNHURTABLE");
    assert.equal(get(immune.state, 0).elemental.ep.EROSION, 900);
    const bypassed = epDamage.applyDamage(environment, epDamage.calculateDamage(immune.state, environment), {
        exclude: [[epDamage.beforeReceive, "environment-immunity"]],
    });
    assert.equal(bypassed.value.type, "APPLIED");
    assert.equal(bypassed.value.application.epLoss, 50);
    assert.equal(get(bypassed.state, 0).elemental.ep.EROSION, 850);
    assert.deepEqual(received, ["ENVIRONMENT", "DAMAGE", "ENVIRONMENT", "ENVIRONMENT"]);
    assert.deepEqual(applied, ["ENVIRONMENT", "DAMAGE", "ENVIRONMENT"]);
});

test("HP-03: lethal HP remains present through nested Combat and both Applied roles before death releases blocking", () => {
    let prepared = false;
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "guard", hooks: Hooks.empty(), vitality: defineVitality(40),
            blocker: { capacity: 1, layer: "GROUND", restrictions: [] },
        }, position: [2, 1] },
        { definition: { id: "enemy", hooks: Hooks.empty(), layer: { type: "GROUND" }, blockable: { volume: 1, restrictions: [] } }, position: [2.2, 1] },
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
                    get(current, 1).vitality.health.hp,
                    get(current, 1).lifecycle,
                    blocking.blockerOf(current, enemy).id,
                ]);
                assert.equal(vitality.isAlive(get(current, 1)), false);
                const zeroRecovery = vitality.increaseHp(current, target, 0);
                assert.equal(zeroRecovery.state, current);
                assert.deepEqual(zeroRecovery.value, {
                    before: { hp: 0, minusHp: 0 }, after: { hp: 0, minusHp: 0 },
                    hpGain: 0, minusHpLoss: 0, overflow: 0,
                });
                const recovery = healingRequest(null, target, 20);
                const attempted = hpHealing.applyHealing(
                    recovery,
                    hpHealing.calculateHealing(zeroRecovery.state, recovery),
                );
                assert.equal(attempted.value.type, "REJECTED");
                const resumed = advanceCombat(attempted.state);
                assert.equal(get(resumed, 1)?.lifecycle, "ACTIVE");
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
                    get(current, 1).vitality.health.hp,
                    get(current, 1).lifecycle,
                    blocking.blockerOf(current, enemy).id,
                ]);
                assert.equal(vitality.isAlive(get(current, 1)), false);
                return { state: current, value: undefined };
            },
        }),
    );
    state = update(state, source, units.setHook(hpDamage.targetKilled, {
        id: "kill-reward",
        invoke() { assert.fail("the excluded death response must not run"); },
    }));
    state = update(state, target, units.setHook(units.removing, {
        id: "kill-reward",
        invoke(current, departure) {
            assert.equal(departure.reason, "DEATH");
            assert.deepEqual(departure.killer, source);
            prepared = true;
            return { state: current, value: undefined };
        },
    }));
    const request = damageRequest(source, target, 100);
    const result = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request), {
        exclude: [[hpDamage.targetKilled, "kill-reward"]],
    });
    assert.deepEqual(calls, [["target", 0, "ACTIVE", 1], ["source", 0, "ACTIVE", 1]]);
    assert.deepEqual(result.value.application, { before: { hp: 40, minusHp: 0 }, after: { hp: 0, minusHp: 0 }, hpLoss: 40, minusHpGain: 0 });
    assert.equal(result.value.killed, true);
    assert.equal(prepared, true);
    assert.equal(get(result.state, 1), undefined);
    assert.equal(get(result.state, 2).blockable.relation, null);
});

test("KILL-02: nested damage owns its kill even while Lifetime defers the victim's final removal", () => {
    const reports = [];
    const departures = [];
    let leavingNotified = false;
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
            vitality: defineVitality(40),
        }, position: [1, 0] },
        { definition: { id: "inner-source", hooks: Hooks.empty().set(hpDamage.completed, observe) }, position: [2, 0] },
        { definition: { id: "death-attribution", hooks: Hooks.empty() }, position: [3, 0] },
    ]);
    const source = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    const otherSource = units.ref(get(state, 2));
    const killer = units.ref(get(state, 3));
    state = update(state, killer, units.compose(
        units.setHook(hpDamage.targetKilled, {
            id: "start-leaving", priority: 1,
            invoke(current, departure) {
                departures.push(["killed", departure.killer.id]);
                return { state: remove(current, killer, { reason: "SCRIPT" }), value: undefined };
            },
        }),
        units.setHook(hpDamage.targetKilled, {
            id: "fact-after-leaving",
            invoke(current) {
                assert.equal(get(current, killer.id).lifecycle, "ENDING");
                leavingNotified = true;
                return { state: current, value: undefined };
            },
        }),
    ));
    state = update(state, target, units.compose(
        units.setHook(units.removing, {
            id: "preserve-first-death",
            invoke(current, departure) {
                assert.deepEqual(departure.killer, killer);
                departures.push(["prepare", departure.killer.id]);
                return {
                    state: remove(current, target, { reason: "DEATH", killer: source }),
                    value: undefined,
                };
            },
        }),
        units.setHook(units.removed, {
            id: "preserve-first-death",
            invoke(current, departure) {
                departures.push(["leave", departure.killer.id]);
                return { state: current, value: undefined };
            },
        }),
    ));
    let nested;
    let outer;
    state = update(state, source, units.setHook(hpDamage.sourceApplied, {
        id: "additional-damage",
        invoke(current) {
            const request = { ...damageRequest(otherSource, target, 40), killer };
            nested = hpDamage.applyDamage(request, hpDamage.calculateDamage(current, request));
            assert.equal(get(nested.state, target.id).lifecycle, "ENDING");
            return { state: nested.state, value: undefined };
        },
    }));
    const installed = effects.install(state, source, {
        id: "damage-on-end", initialize: () => ({}),
        onEnd(current) {
            const request = damageRequest(source, target, 10);
            outer = hpDamage.applyDamage(request, hpDamage.calculateDamage(current, request));
            assert.equal(get(outer.state, target.id).lifecycle, "ENDING");
            return outer.state;
        },
    });
    state = effects.remove(installed.state, installed.value);

    assert.equal(nested.value.killed, true);
    assert.equal(outer.value.killed, false);
    assert.deepEqual(outer.value.application, { before: { hp: 40, minusHp: 0 }, after: { hp: 30, minusHp: 0 }, hpLoss: 10, minusHpGain: 0 });
    assert.deepEqual(reports, [[otherSource.id, true], [source.id, false]]);
    assert.deepEqual(departures, [["killed", killer.id], ["prepare", killer.id], ["leave", killer.id]]);
    assert.equal(leavingNotified, true);
    assert.equal(get(state, target.id), undefined);
});

test("KILL-02: damage started by Completed cannot change the already determined outer kill result", () => {
    let nested;
    let observed;
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: {
            id: "target", hooks: Hooks.empty(),
            vitality: defineVitality(40),
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

test("HP Healing accepts full resources and absent patients while damage requires presence", () => {
    const calls = [];
    const damageCommits = [];
    let state = battle([{ definition: {
        id: "patient", presence: {},
        hooks: Hooks.empty().set(vitality.damageCommitting, {
            id: "observe-damage-commit",
            invoke(current, context, health) {
                damageCommits.push([context.previous.hp, health.hp]);
                return { state: current, value: health };
            },
        }),
        vitality: defineVitality(100.5),
        elemental: createArknightsElementalDefinition({ receiver: "CHARACTER", recoveryPerSecond: 15 }),
    }, position: [0, 0] }]);
    const target = units.ref(get(state, 0));
    assert.equal(get(state, 0).vitality.health.hp, 100.5);
    state = update(state, target, units.compose(units.compose(units.setHook(hpHealing.receiving, {
            id: "receive", invoke(current, _context, pending) {
                calls.push("receive");
                return { state: current, value: { ...pending, amount: pending.amount - 10 } };
            },
        }), units.setHook(hpHealing.targetApplied, {
            id: "target", invoke(current) { calls.push("target"); return { state: current, value: undefined }; },
        })), units.setHook(hpHealing.sourceApplied, {
            id: "source", invoke(current) { calls.push("source"); return { state: current, value: undefined }; },
        })));
    const request = { source: target, target, parameters: { power: 25, multiplier: 2 } };
    const calculated = hpHealing.calculateHealing(state, request);
    assert.equal(calculated.value.amount, 50);
    assert.equal(get(calculated.state, 0).vitality.health.hp, 100.5);
    assert.deepEqual(calls, []);
    const full = hpHealing.applyHealing(request, calculated);
    assert.equal(full.value.type, "APPLIED");
    assert.equal(full.value.received.amount, 40);
    assert.deepEqual(full.value.application, { before: { hp: 100.5, minusHp: 0 }, after: { hp: 100.5, minusHp: 0 }, hpGain: 0, minusHpLoss: 0, overflow: 40 });
    assert.deepEqual(calls, ["receive", "target", "source"]);
    assert.deepEqual(damageCommits, []);

    const hpLoss = { source: null, target, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: {
        type: "TRUE", attack: { power: 30, multiplier: 1, addition: 0 },
    } };
    const epLoss = { target, source: null, attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", parameters: { type: "NEURAL", power: 200 } };
    state = hpDamage.applyDamage(hpLoss, hpDamage.calculateDamage(full.state, hpLoss)).state;
    state = epDamage.applyDamage(epLoss, epDamage.calculateDamage(state, epLoss)).state;
    assert.equal(get(state, 0).vitality.health.hp, 70.5);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 800);

    state = update(state, target, presence.disappear());
    assert.equal(hpDamage.applyDamage(hpLoss, hpDamage.calculateDamage(state, hpLoss)).value.type, "REJECTED");
    assert.equal(epDamage.applyDamage(epLoss, epDamage.calculateDamage(state, epLoss)).value.type, "REJECTED");
    const hpRestored = hpHealing.applyHealing(request, hpHealing.calculateHealing(state, request));
    assert.equal(hpRestored.value.application.hpGain, 30);
    assert.deepEqual(damageCommits, [[100.5, 70.5]]);
    const epRequest = { target, source: null, parameters: { power: 100 } };
    const epRestored = epHealing.applyHealing(epRequest, epHealing.calculateHealing(hpRestored.state, epRequest));
    assert.equal(epRestored.value.application.epGain.NEURAL, 100);
    state = elemental.advance({ ...epRestored.state, tick: 1 }, target);
    assert.equal(get(state, 0).elemental.ep.NEURAL, 900.5);

    state = update(state, target, presence.appear([0, 0]));
    const hpAccepted = hpDamage.applyDamage(hpLoss, hpDamage.calculateDamage(state, hpLoss));
    assert.equal(hpAccepted.value.application.hpLoss, 30);
    const epAccepted = epDamage.applyDamage(epLoss, epDamage.calculateDamage(hpAccepted.state, epLoss));
    assert.equal(epAccepted.value.application.epLoss, 200);
});
