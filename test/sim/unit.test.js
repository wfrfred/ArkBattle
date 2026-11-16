import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as skills from "../../dist/core/unit/skill/index.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import { update } from "../../dist/core/battle/unit.js";
import { output as damageOutput } from "../../dist/core/battle/resource/hp/damage/index.js";
import { hasOccupancy } from "../../dist/core/unit/capability/occupancy/index.js";

test("Unit construction rejects conflicting roles and installs entry effects on the registered host", () => {
    const entryEffect = { id: "entry-effect", initialize: () => ({ charges: 2 }) };
    const definition = {
        id: "allied-unit",
        allegiance: { side: "ALLY" },
        hooks: Hooks.empty().set(units.enter, {
            id: "install-entry-effect",
            invoke(state, self) {
                assert.ok(units.get(state, units.ref(self)));
                return { state: effects.install(state, units.ref(self), entryEffect).state, value: undefined };
            },
        }),
    };
    assert.throws(() => units.initialize(battle(), {
        id: 0, position: [0, 0], definition: {
            id: "conflicting-roles", hooks: Hooks.empty(),
            blocker: { capacity: 1, layer: "GROUND", restrictions: [] },
            blockable: { volume: 1, restrictions: [] },
        },
    }), TypeError);

    const state = battle([{
        definition, position: [0, 0], initial: { occupancy: { tile: [0, 0] } },
    }]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    assert.equal(current.allegiance.side, "ALLY");
    assert.equal(hasOccupancy(current), false);
    assert.equal(current.effects.values().find((effect) => effect.definition === entryEffect).state.charges, 2);
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
        vitality: { maxHp: 40, defense: 0, resistance: 0, recoverySpeed: 0, recoveryRatio: 0 },
        hooks: Hooks.empty()
            .set(units.enter, {
                id: "first",
                invoke(state, self) {
                    assert.ok(units.get(state, units.ref(self)).hooks.find(damageOutput, "intrinsic-output"));
                    observed.push("first");
                    return {
                        state: update(state, units.ref(self), units.setHook(units.enter, {
                            ...record("replacement"), id: "existing",
                        })),
                        value: undefined,
                    };
                },
            })
            .set(units.enter, record("existing"))
            .set(units.prepare, {
                id: "prepare",
                invoke(state, departure) {
                    return {
                        state: update(state, units.ref(departure.unit), units.setHook(units.leave, {
                            id: "late-leave",
                            invoke(current, original) {
                                assert.equal(units.get(current, units.ref(original.unit)), undefined);
                                assert.equal(original.unit.hooks.find(units.leave, "late-leave"), undefined);
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
        sp: { initial: 0, capacity: 10, requirement: 10, recovery: { type: "NONE" } },
        activation: null,
    };
    let state = battle([
        { definition, position: [0, 0] },
        { definition: {
            id: "killer", hooks: Hooks.empty(),
            skill: { initialize: current => skills.create(current, rewardSkill) },
        }, position: [1, 0] },
    ]);
    assert.deepEqual(observed, ["first", "replacement"]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    const victim = units.ref(current);
    const killer = units.ref(units.all(state).find(unit => unit.definition.id === "killer"));
    const response = {
        id: "death-response", initialize: () => ({}),
        onEnable(current, self) {
            return update(current, self.host, units.setHook(units.prepare, {
                id: "death-response", priority: 10,
                invoke(state, departure) {
                    assert.equal(departure.reason, "DEATH");
                    assert.deepEqual(departure.killer, killer);
                    assert.equal(units.get(state, victim).lifecycle, "LEAVING");
                    assert.equal(effects.get(state, effects.ref(self)).lifecycle, "ACTIVE");
                    observed.push("death-response");
                    const recovered = skills.recover(state, departure.killer, "EXTERNAL", 1);
                    assert.deepEqual(recovered.value, { type: "APPLIED", amount: 1 });
                    return { state: recovered.state, value: undefined };
                },
            }));
        },
        onDisable(current, self) {
            observed.push("effect-disabled");
            return update(current, self.host, units.removeHook(units.prepare, "death-response"));
        },
        onEnd(current) {
            observed.push("effect-ended");
            return current;
        },
    };
    state = effects.install(state, victim, response).state;
    const request = {
        source: null, killer, target: victim,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true,
        parameters: { type: "TRUE", attack: { power: 40, multiplier: 1, addition: 0 } },
    };
    const ended = hpDamage.applyDamage(request, hpDamage.calculateDamage(state, request));
    assert.equal(ended.value.killed, true);
    assert.equal(skills.getSkill(ended.state, skills.ref(killer, rewardSkill)).sp.value, 1);
    assert.deepEqual(observed, ["first", "replacement", "death-response", "effect-disabled", "effect-ended", "late-leave"]);
});
