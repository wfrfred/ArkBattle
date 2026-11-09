import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { update, remove } from "../../dist/core/battle/unit.js";
import { output as damageOutput } from "../../dist/core/battle/damage/hp/index.js";

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
            blocker: { capacity: 1, layer: "GROUND", rules: [] },
            blockable: { volume: 1, rules: [] },
        },
    }), TypeError);

    const state = battle([{ definition, position: [0, 0] }]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    assert.equal(current.allegiance.side, "ALLY");
    assert.equal(current.effects.values().find((effect) => effect.definition === entryEffect).state.charges, 2);
});

test("Unit lifecycle reads updated registrations while leave retains the original departure", () => {
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
    const state = battle([{ definition, position: [0, 0] }]);
    assert.deepEqual(observed, ["first", "replacement"]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    remove(state, units.ref(current), "SCRIPT");
    assert.deepEqual(observed, ["first", "replacement", "late-leave"]);
});
