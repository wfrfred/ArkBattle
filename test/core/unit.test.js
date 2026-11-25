// Contract: [capability](../../docs/architecture/capability.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import { Hooks, dispatch } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/effect/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import * as facing from "../../dist/core/unit/capability/facing/index.js";
import * as targetable from "../../dist/core/unit/capability/targetable/capability.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import { add, update, remove } from "../../dist/core/unit/operations.js";
import { hasOccupancy } from "../../dist/core/unit/capability/occupancy/index.js";
import { effectInitial } from "../helpers/effect.js";

test("Unit construction rejects conflicting roles and installs entry effects on the registered host", () => {
    const entryEffect = { id: "entry-effect", initialize: () => ({ charges: 2 }) };
    const definition = {
        id: "allied-unit",
        hooks: Hooks.empty().set(units.entered, {
            id: "install-entry-effect",
            invoke(state, self) {
                assert.ok(units.ref(self).get(state));
                return { state: effects.install(state, units.ref(self), entryEffect, effectInitial).state, value: undefined };
            },
        }),
    };
    assert.throws(() => units.initialize(battle(), {
        position: [0, 0], definition: {
            id: "conflicting-roles", hooks: Hooks.empty(),
            blocker: { capacity: 1, layer: "GROUND", restrictions: [] },
            blockable: { volume: 1, restrictions: [] },
        },
    }), TypeError);

    const state = battle([{
        definition, position: [0, 0], initial: { occupancy: { tile: [0, 0] } },
    }]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    assert.equal(hasOccupancy(current), false);
    assert.equal(effects.forHost(state, units.ref(current)).find((effect) => effect.definition === entryEffect).state.charges, 2);
});

test("Unit construction requires unique restriction IDs within each capability list", () => {
    const blocked = { id: "locked", value: { allows: () => false } };
    const allowed = { id: "locked", value: { allows: () => true } };
    const definition = {
        id: "restricted", hooks: Hooks.empty(),
        facing: { restrictions: [blocked] },
        targetable: { category: "DEFAULT", taunt: defineAttribute(0, -2, 2), restrictions: [blocked] },
    };
    const input = { definition, position: [0, 0], initial: { facing: { direction: "RIGHT" } } };
    const initial = battle();
    for (const key of ["facing", "targetable"]) {
        const duplicate = {
            ...definition, [key]: { ...definition[key], restrictions: [blocked, allowed] },
        };
        assert.throws(() => units.initialize(initial, { ...input, definition: duplicate }), TypeError);
    }

    const created = units.initialize(initial, input);
    const host = units.ref(created.value);
    const registered = add(created.state, created.value);
    assert.equal(facing.turn(registered, host, "LEFT"), registered);
    const updated = update(registered, host, facing.setRestriction(allowed));
    const turned = facing.turn(updated, host, "LEFT");
    const current = host.get(turned);
    assert.equal(current.facing.direction, "LEFT");
    assert.equal(targetable.allowsRestrictions(turned, current)(current), false);
});

test("initial and later Units share their instance identity allocator", () => {
    const starting = { id: "starting", hooks: Hooks.empty() };
    const summoned = { id: "summoned", hooks: Hooks.empty() };
    const initial = battle([{ definition: starting, position: [1, 0] }]);
    const placed = units.all(initial).find((unit) => unit.definition === starting);

    const created = units.initialize(initial, { definition: summoned, position: [0, 0] });
    const reference = units.ref(created.value);
    assert.equal(reference.get(created.state), undefined);
    const registered = add(created.state, created.value);

    assert.notDeepEqual(units.ref(placed), reference);
    assert.equal(units.ref(placed).get(registered), placed);
    assert.equal(reference.get(registered)?.definition, summoned);

    const index = new Map([[reference, summoned]]);
    const updated = update(registered, reference, units.setHook(units.tick, {
        id: "update",
        invoke: state => ({ state, value: undefined }),
    }));
    assert.notEqual(reference.get(updated), created.value);
    assert.equal(index.get(units.ref(reference.get(updated))), summoned);

    const alternative = units.initialize(initial, { definition: summoned, position: [0, 1] });
    const branch = add(alternative.state, alternative.value);
    assert.equal(alternative.value.ref.id, reference.id);
    assert.equal(reference.get(branch), undefined);
    assert.equal(remove(branch, reference, { reason: "SCRIPT" }), branch);
});

test("Unit death preserves its attribution through Effect responses and the original departure", () => {
    const observed = [];
    const definition = {
        id: "dynamic-lifecycle",
        vitality: defineVitality(40),
        hooks: Hooks.empty()
            .set(units.removing, {
                id: "prepare",
                invoke(state, departure) {
                    assert.equal(killer.get(state).skill.sp.value, 1);
                    assert.equal(victimEffect.get(state).lifecycle, "ACTIVE");
                    assert.equal(departure, killedDeparture);
                    observed.push("victim-prepare");
                    return { state, value: undefined };
                },
            })
            .set(units.removed, {
                id: "retain-departure",
                invoke(state, departure) {
                    assert.deepEqual(departure, killedDeparture);
                    assert.equal(departure.unit, killedDeparture.unit);
                    observed.push("victim-removed");
                    return { state, value: undefined };
                },
            }),
    };
    const rewardSkill = {
        id: "reward-skill",
        initialize: state => ({ state, value: {} }),
        sp: { initial: 0, capacity: 10, recovery: { type: "NONE" }, recoverySpeed: defineAttribute(0), recoveryMultiplier: defineAttribute(1) },
        activation: null,
    };
    let state = battle([
        { definition, position: [0, 0] },
        { definition: {
            id: "killer", hooks: Hooks.empty(),
            skill: { definition: rewardSkill },
        }, position: [1, 0] },
    ]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    const victim = units.ref(current);
    const killer = units.ref(units.all(state).find(unit => unit.definition.id === "killer"));
    let killedDeparture;
    const response = {
        id: "death-response", initialize: () => ({}),
        onEnable(current, self) {
            return update(current, self.ref.host, units.setHook(hpDamage.targetKilled, {
                id: "death-response",
                invoke(state, departure) {
                    assert.equal(departure.reason, "DEATH");
                    assert.deepEqual(departure.killer, killer);
                    assert.equal(units.ref(departure.unit).get(state).lifecycle, "ENDING");
                    assert.equal(effects.ref(self).get(state).lifecycle, "ACTIVE");
                    killedDeparture = departure;
                    observed.push("death-response");
                    const recovered = skills.recover(state, departure.killer, "EXTERNAL", 1);
                    assert.deepEqual(recovered.value, { type: "APPLIED", amount: 1 });
                    return { state: recovered.state, value: undefined };
                },
            }));
        },
        onDisable(current, self) {
            return update(current, self.ref.host, units.removeHook(hpDamage.targetKilled, "death-response"));
        },
    };
    state = effects.install(state, killer, response, effectInitial).state;
    const installed = effects.install(state, victim, {
        id: "victim-effect", initialize: () => ({}),
        onDisable(current) {
            observed.push("effect-disabled");
            return current;
        },
        onEnd(current) {
            observed.push("effect-ended");
            return current;
        },
    }, effectInitial);
    state = installed.state;
    const victimEffect = installed.value;
    const request = {
        source: null, killer, target: victim,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true,
        parameters: { type: "TRUE", attack: { power: 40, multiplier: 1, addition: 0 } },
    };
    const ended = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(ended.value.killed, true);
    assert.equal(killer.get(ended.state).skill.sp.value, 1);
    assert.deepEqual(observed, ["death-response", "victim-prepare", "effect-disabled", "effect-ended", "victim-removed"]);

    const created = units.initialize(ended.state, {
        position: [0, 0],
        definition: {
            ...definition, id: "instant-target",
            hooks: Hooks.empty().set(units.removing, {
                id: "observe-direct-death",
                invoke(current, departure) {
                    assert.equal(departure, killedDeparture);
                    assert.equal(departure.unit.vitality.health.hp, 40);
                    assert.equal(killer.get(current).skill.sp.value, 2);
                    return { state: current, value: undefined };
                },
            }),
        },
    });
    const directTarget = units.ref(created.value);
    state = update(add(created.state, created.value), directTarget, units.setHook(units.removing, {
        id: "direct-death-notification", priority: 10000,
        invoke(current, departure) {
            assert.equal(directTarget.get(current).lifecycle, "ENDING");
            return dispatch(current, departure, undefined, {
                candidates: next => killer.get(next).hooks.get(hpDamage.targetKilled),
                find: (next, id) => killer.get(next)?.hooks.find(hpDamage.targetKilled, id),
            });
        },
    }));
    state = remove(state, directTarget, { reason: "DEATH", killer });
    assert.equal(directTarget.get(state), undefined);
    assert.equal(killer.get(state).skill.sp.value, 2);
});
