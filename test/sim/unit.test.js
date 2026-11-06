import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { update, remove } from "../../dist/core/battle/unit.js";
import { output as damageOutput } from "../../dist/core/battle/damage/hp/index.js";

test("Unit construction pairs declared capabilities and installs initial effects after registration", () => {
    const entryEffect = { id: "entry-effect", initialize: () => ({ charges: 2 }) };
    const entries = [];
    const definition = {
        id: "allied-unit",
        allegiance: { side: "ALLY" },
        hooks: Hooks.empty().set(unitLifecycle.enter, {
                id: "install-entry-effect",

                invoke(state, self) {
                    assert.ok(units.get(state, units.ref(self)));
                    assert.equal(self.effects.size, 0);
                    entries.push(self.id);
                    return {
                        state: effects.install(state, units.ref(self), entryEffect).state,
                        value: undefined,
                    };
                },
            }),
    };
    const empty = battle();
    assert.throws(
        () =>
            units.initialize(empty, {
                id: 0,
                position: [0, 0],
                definition: {
                    id: "conflicting-roles",
                    hooks: Hooks.empty(),
                    blocker: { capacity: 1, layer: "GROUND", rules: [] },
                    blockable: { volume: 1 },
                },
            }),
        TypeError,
    );
    const constructed = units.initialize(empty, {
        id: 0,
        definition,
        position: [0, 0],
    }).value;

    assert.equal(constructed.allegiance.side, "ALLY");
    assert.equal(constructed.effects.size, 0);
    assert.equal(Object.hasOwn(constructed, "action"), false);
    assert.equal(units.get(empty, units.ref(constructed)), undefined);
    assert.deepEqual(entries, []);

    const state = battle([
        { definition, position: [0, 0] },
        { definition: { id: "plain-unit", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    assert.deepEqual(entries, [0]);
    assert.equal(
        current.effects.values().find((effect) => effect.definition === entryEffect).data.charges,
        2,
    );
    assert.equal(
        units.all(state).find((unit) => unit.definition.id === "plain-unit").effects.size,
        0,
    );
    assert.equal(constructed.effects.size, 0);
});

test("lifecycle dispatch reads current registrations and captures final leave programs before removal", () => {
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
            .set(unitLifecycle.enter, {
                id: "first",
                invoke(state, self) {
                    assert.ok(units.get(state, units.ref(self)).hooks.find(damageOutput, "intrinsic-output"));
                    observed.push("first");
                    return {
                        state: update(state, units.combine([
                            units.removeHook(units.ref(self), unitLifecycle.enter, "removed"),
                            units.setHook(units.ref(self), unitLifecycle.enter, record("new")),
                            units.setHook(units.ref(self), unitLifecycle.enter, {
                                ...record("replacement"), id: "existing",
                            }),
                        ])),
                        value: undefined,
                    };
                },
            })
            .set(unitLifecycle.enter, record("removed"))
            .set(unitLifecycle.enter, record("existing"))
            .set(unitLifecycle.prepare, {
                id: "prepare",
                invoke(state, departure) {
                    return {
                        state: update(state,
                            units.setHook(units.ref(departure.unit), unitLifecycle.leave, {
                                id: "late-leave",
                                invoke(current, original) {
                                    assert.equal(units.get(current, units.ref(original.unit)), undefined);
                                    assert.equal(original.unit.hooks.find(unitLifecycle.leave, "late-leave"), undefined);
                                    observed.push("late-leave");
                                    return { state: current, value: undefined };
                                },
                            })
                        ),
                        value: undefined,
                    };
                },
            })
            .set(damageOutput, {
                id: "intrinsic-output",
                invoke(state, _context, current) {
                    return { state, value: current };
                },
            }),
    };
    const state = battle([{ definition, position: [0, 0] }]);
    assert.deepEqual(observed, ["first", "replacement"]);
    const current = units.all(state).find((unit) => unit.definition === definition);
    const ended = remove(state, current.id, "SCRIPT");
    assert.equal(units.get(ended, units.ref(current)), undefined);
    assert.deepEqual(observed, ["first", "replacement", "late-leave"]);
    assert.deepEqual(definition.hooks.get(unitLifecycle.enter).map(({ id }) => id), ["first", "removed", "existing"]);
});
