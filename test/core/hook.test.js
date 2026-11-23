// Contract: [hook](../../docs/architecture/hook.md).
import { Hooks, key } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { remove, update } from "../../dist/core/unit/operations.js";
import * as hooks from "../../dist/core/hook.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { entered as unitEntered, removed as unitRemoved, setHook, removeHook } from "../../dist/core/battle/unit-hook.js";

test("Hook keys preserve identity and replacing an ID preserves its position", () => {
    const stage = key("test.stage");
    const sameName = key("test.stage");
    const first = { id: "first", priority: -10 };
    const second = { id: "second", priority: 10 };
    const registered = Hooks.empty().set(stage, first).set(stage, second);
    const replacement = { id: "first", priority: 100, revised: true };
    const replaced = registered.set(stage, replacement);
    assert.deepEqual(replaced.get(stage), [replacement, second]);
    assert.deepEqual(registered.get(stage), [first, second]);
    assert.deepEqual(replaced.get(sameName), []);
});

test("Hook priority fixes this dispatch's order while replacement and nested dispatch read current registrations", () => {
    let state = battle([{ definition: { id: "observed", hooks: Hooks.empty() }, position: [0, 0] }]);
    const subject = units.all(state).find(() => true);
    const calls = [];
    let nested = false;
    const options = {
        candidates: (current) => current.unitHooks.get(unitRemoved),
        find: (current, id) => current.unitHooks.find(unitRemoved, id),
    };
    const record = (id, priority) => ({
        id,
        priority,
        invoke(current) {
            calls.push([nested ? "nested" : "outer", id]);
            return { state: current, value: undefined };
        },
    });
    state = setHook(state, unitRemoved, record("removed"));
    state = setHook(state, unitRemoved, {
        id: "replacement", priority: -10,
        invoke() {
            assert.fail("the old registration must not run");
        },
    });
    state = setHook(state, unitRemoved, record("z-tie"));
    state = setHook(state, unitRemoved, record("a-tie", 0));
    state = setHook(state, unitRemoved, {
        id: "first",
        priority: 10,
        invoke(current, departure) {
            calls.push([nested ? "nested" : "outer", "first"]);
            if (nested) return { state: current, value: undefined };
            assert.equal(units.get(current, units.ref(departure.unit)), undefined);
            current = removeHook(current, unitRemoved, "removed");
            current = setHook(current, unitRemoved, record("replacement", 100));
            current = setHook(current, unitRemoved, record("added", 1000));
            nested = true;
            const result = hooks.dispatch(current, departure, undefined, options);
            nested = false;
            return result;
        },
    });
    remove(state, units.ref(subject), { reason: "SCRIPT" });

    assert.deepEqual(calls, [
        ["outer", "first"],
        ["nested", "added"],
        ["nested", "replacement"],
        ["nested", "first"],
        ["nested", "z-tie"],
        ["nested", "a-tie"],
        ["outer", "z-tie"],
        ["outer", "a-tie"],
        ["outer", "replacement"],
    ]);
});

test("Battle entered applies a global Effect before the Unit runs its own entered", () => {
    const effect = { id: "global-effect", initialize: () => ({}) };
    const initial = battle([], {
        initialMechanisms: [{
            definition: {
                id: "global-rule",
                initialize: () => ({}),
                onEnter(state) {
                    return setHook(state, unitEntered, {
                        id: "apply-global-effect",
                        invoke(current, unit) {
                            const reference = units.ref(unit);
                            assert.equal(units.get(current, reference), unit);
                            return { state: effects.install(current, reference, effect).state, value: undefined };
                        },
                    });
                },
            },
        }],
    });
    let localEntered = false;
    const created = units.initialize(initial, {
        position: [0, 0],
        definition: {
            id: "later-unit",
            hooks: Hooks.empty().set(units.entered, {
                id: "observe-global-effect",
                invoke(current, self) {
                    assert.ok(self.effects.values().some((instance) => instance.definition === effect));
                    localEntered = true;
                    return { state: current, value: undefined };
                },
            }),
        },
    });
    const registered = units.add(created.state, created.value);
    assert.equal(localEntered, true);
    const self = units.get(registered, units.ref(created.value));
    assert.ok(self?.effects.values().some((instance) => instance.definition === effect));
});

test("An ended Unit skips the remaining Battle and local entered programs", () => {
    let state = setHook(battle(), unitEntered, {
        id: "remove-on-entry",
        invoke: (current, unit) => ({
            state: units.remove(current, units.ref(unit), { reason: "SCRIPT" }),
            value: undefined,
        }),
    });
    state = setHook(state, unitEntered, {
        id: "remaining-observer",
        invoke: () => assert.fail("an ended Unit cannot run another Battle entered program"),
    });
    const created = units.initialize(state, {
        position: [0, 0],
        definition: {
            id: "ending-on-entry",
            hooks: Hooks.empty().set(units.entered, {
                id: "unit-entry",
                invoke: () => assert.fail("an ended Unit cannot run its local entered program"),
            }),
        },
    });
    const next = units.add(created.state, created.value);
    assert.equal(units.get(next, units.ref(created.value)), undefined);
});

test("Unit removing uses priority and removed uses the registrations captured before unlinking", () => {
    const calls = [];
    let state = battle([{ definition: { id: "departing", hooks: Hooks.empty() }, position: [0, 0] }]);
    const subject = units.ref(units.all(state).find(() => true));
    state = effects.install(state, subject, {
        id: "death-response", initialize: () => ({}),
        onInstall(current, self) {
            return update(current, self.host, units.setHook(units.removing, {
                id: "death-output",
                invoke(next) {
                    assert.equal(units.get(next, subject).lifecycle, "ENDING");
                    assert.equal(effects.get(next, effects.ref(self)).lifecycle, "ACTIVE");
                    calls.push("death-output");
                    return { state: next, value: undefined };
                },
            }));
        },
        onEnd(current, self) {
            assert.equal(units.get(current, subject).lifecycle, "ENDING");
            calls.push("effect-end");
            return update(current, self.host, units.setHook(units.removed, {
                id: "latest-leave", priority: 200,
                invoke(next, departure) {
                    assert.equal(units.get(next, subject), undefined);
                    assert.equal(departure.unit.hooks.find(units.removed, "latest-leave").priority, -10);
                    calls.push("latest-leave");
                    return { state: next, value: undefined };
                },
            }));
        },
    }).state;
    state = update(state, subject, units.compose(
        units.setHook(units.removing, {
            id: "earlier-response", priority: 100,
            invoke(current) {
                assert.equal(units.get(current, subject).lifecycle, "ENDING");
                calls.push("earlier-response");
                return { state: current, value: undefined };
            },
        }),
        units.compose(
            units.setHook(units.removed, {
                id: "latest-leave", priority: -10,
                invoke: () => assert.fail("removed must capture the replacement installed during finalization"),
            }),
            units.setHook(units.removed, {
                id: "high-leave", priority: 100,
                invoke(current) {
                    assert.equal(units.get(current, subject), undefined);
                    calls.push("high-leave");
                    return { state: current, value: undefined };
                },
            }),
        ),
    ));

    state = setHook(state, unitRemoved, {
        id: "observe-departure", priority: 300,
        invoke(current) {
            calls.push("battle-removed");
            return { state: current, value: undefined };
        },
    });
    remove(state, subject, { reason: "DEATH", killer: null });
    assert.deepEqual(calls, [
        "earlier-response", "death-output", "effect-end", "latest-leave", "high-leave", "battle-removed",
    ]);
});
