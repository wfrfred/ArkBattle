// Contract: [capability](../../docs/architecture/capability.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import { Hooks, dispatch } from "../../dist/core/hook.js";
import { appear } from "../../dist/core/battle/predefined.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as skills from "../../dist/core/unit/capability/skill/index.js";
import * as facing from "../../dist/core/unit/capability/facing/index.js";
import * as targetable from "../../dist/core/unit/capability/targetable/capability.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import { add, update, remove } from "../../dist/core/unit/operations.js";
import { output as damageOutput } from "../../dist/core/battle/resource/hp/damage/index.js";
import { hasOccupancy } from "../../dist/core/unit/capability/occupancy/index.js";

test("Unit construction rejects conflicting roles and installs entry effects on the registered host", () => {
    const entryEffect = { id: "entry-effect", initialize: () => ({ charges: 2 }) };
    const definition = {
        id: "allied-unit",
        classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
        hooks: Hooks.empty().set(units.entered, {
            id: "install-entry-effect",
            invoke(state, self) {
                assert.ok(units.get(state, units.ref(self)));
                return { state: effects.install(state, units.ref(self), entryEffect).state, value: undefined };
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
    assert.equal(current.definition.classification.side, "ALLY");
    assert.equal(hasOccupancy(current), false);
    assert.equal(current.effects.values().find((effect) => effect.definition === entryEffect).state.charges, 2);
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
    const current = units.get(turned, host);
    assert.equal(current.facing.direction, "LEFT");
    assert.equal(targetable.allowsRestrictions(turned, current)(current), false);
});

test("direct Unit initialization shares instance identity allocation with predefines", () => {
    const predefined = { id: "predefined", hooks: Hooks.empty() };
    const summoned = { id: "summoned", hooks: Hooks.empty() };
    const initial = battle([], {
        predefines: [{
            id: 0, alias: null, initiallyPresent: false,
            creation: { type: "UNIT", definition: predefined, position: [1, 0] },
        }],
    });

    const created = units.initialize(initial, { definition: summoned, position: [0, 0] });
    const reference = units.ref(created.value);
    assert.equal(units.get(created.state, reference), undefined);
    const registered = add(created.state, created.value);
    const appeared = appear(registered, 0);
    const placed = units.all(appeared).find((unit) => unit.definition === predefined);

    assert.ok(placed);
    assert.notDeepEqual(units.ref(placed), reference);
    assert.equal(units.get(appeared, reference)?.definition, summoned);
});

test("Unit death preserves its attribution through Effect responses and the original departure", () => {
    const observed = [];
    const record = (id) => ({
        id,
        invoke(state) {
            observed.push(id);
            return { state, value: undefined };
        },
    });
    const definition = {
        id: "dynamic-lifecycle",
        vitality: defineVitality(40),
        hooks: Hooks.empty()
            .set(units.entered, {
                id: "first",
                invoke(state, self) {
                    assert.ok(units.get(state, units.ref(self)).hooks.find(damageOutput, "intrinsic-output"));
                    observed.push("first");
                    return {
                        state: update(state, units.ref(self), units.setHook(units.entered, {
                            ...record("replacement"), id: "existing",
                        })),
                        value: undefined,
                    };
                },
            })
            .set(units.entered, record("existing"))
            .set(units.removing, {
                id: "prepare",
                invoke(state, departure) {
                    assert.equal(skills.getSkill(state, skills.ref(killer, rewardSkill)).sp.value, 1);
                    assert.equal(effects.get(state, victimEffect).lifecycle, "ACTIVE");
                    assert.equal(departure, killedDeparture);
                    observed.push("victim-prepare");
                    return {
                        state: update(state, units.ref(departure.unit), units.setHook(units.removed, {
                            id: "late-leave",
                            invoke(current, original) {
                                assert.equal(units.get(current, units.ref(original.unit)), undefined);
                                assert.equal(original.unit.hooks.find(units.removed, "late-leave"), undefined);
                                assert.deepEqual(original.killer, killer);
                                observed.push("late-leave");
                                return { state: current, value: undefined };
                            },
                        })),
                        value: undefined,
                    };
                },
            })
            .set(damageOutput, {
                id: "intrinsic-output",
                invoke: (state, _context, value) => ({ state, value }),
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
    assert.deepEqual(observed, ["first", "replacement"]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    const victim = units.ref(current);
    const killer = units.ref(units.all(state).find(unit => unit.definition.id === "killer"));
    let killedDeparture;
    const response = {
        id: "death-response", initialize: () => ({}),
        onEnable(current, self) {
            return update(current, self.host, units.setHook(hpDamage.targetKilled, {
                id: "death-response",
                invoke(state, departure) {
                    assert.equal(departure.reason, "DEATH");
                    assert.deepEqual(departure.killer, killer);
                    assert.equal(units.get(state, units.ref(departure.unit)).lifecycle, "ENDING");
                    assert.equal(effects.get(state, effects.ref(self)).lifecycle, "ACTIVE");
                    killedDeparture = departure;
                    observed.push("death-response");
                    const recovered = skills.recover(state, departure.killer, "EXTERNAL", 1);
                    assert.deepEqual(recovered.value, { type: "APPLIED", amount: 1 });
                    return { state: recovered.state, value: undefined };
                },
            }));
        },
        onDisable(current, self) {
            return update(current, self.host, units.removeHook(hpDamage.targetKilled, "death-response"));
        },
    };
    state = effects.install(state, killer, response).state;
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
    });
    state = installed.state;
    const victimEffect = installed.value;
    const request = {
        source: null, killer, target: victim,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true,
        parameters: { type: "TRUE", attack: { power: 40, multiplier: 1, addition: 0 } },
    };
    const ended = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(ended.value.killed, true);
    assert.equal(skills.getSkill(ended.state, skills.ref(killer, rewardSkill)).sp.value, 1);
    assert.deepEqual(observed, ["first", "replacement", "death-response", "victim-prepare", "effect-disabled", "effect-ended", "late-leave"]);

    const created = units.initialize(ended.state, {
        position: [0, 0],
        definition: {
            ...definition, id: "instant-target",
            hooks: Hooks.empty().set(units.removing, {
                id: "observe-direct-death",
                invoke(current, departure) {
                    assert.equal(departure, killedDeparture);
                    assert.equal(departure.unit.vitality.health.hp, 40);
                    assert.equal(skills.getSkill(current, skills.ref(killer, rewardSkill)).sp.value, 2);
                    return { state: current, value: undefined };
                },
            }),
        },
    });
    const directTarget = units.ref(created.value);
    state = update(add(created.state, created.value), directTarget, units.setHook(units.removing, {
        id: "direct-death-notification", priority: 10000,
        invoke(current, departure) {
            assert.equal(units.get(current, directTarget).lifecycle, "ENDING");
            return dispatch(current, departure, undefined, {
                candidates: next => units.get(next, killer).hooks.get(hpDamage.targetKilled),
                find: (next, id) => units.get(next, killer)?.hooks.find(hpDamage.targetKilled, id),
            });
        },
    }));
    state = remove(state, directTarget, { reason: "DEATH", killer });
    assert.equal(units.get(state, directTarget), undefined);
    assert.equal(skills.getSkill(state, skills.ref(killer, rewardSkill)).sp.value, 2);
});
