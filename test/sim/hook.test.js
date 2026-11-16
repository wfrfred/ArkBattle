import { Hooks, key } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { remove, update } from "../../dist/core/battle/unit.js";
import * as hooks from "../../dist/core/hook.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { leave, setHook, removeHook } from "../../dist/core/battle/unit-hook.js";

test("HOOK-01: registration reuses identical entries and replaces an ID without changing its position", () => {
    const stage = key("test.stage");
    const sameName = key("test.stage");
    const first = { id: "first", priority: -10 };
    const second = { id: "second", priority: 10 };
    const registered = Hooks.empty().set(stage, first).set(stage, second);
    assert.equal(registered.set(stage, first), registered);
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
        candidates: (current) => current.unitHooks.get(leave),
        find: (current, id) => current.unitHooks.find(leave, id),
    };
    const record = (id, priority) => ({
        id,
        priority,
        invoke(current) {
            calls.push([nested ? "nested" : "outer", id]);
            return { state: current, value: undefined };
        },
    });
    state = setHook(state, leave, record("removed"));
    state = setHook(state, leave, {
        id: "replacement", priority: -10,
        invoke() {
            assert.fail("the old registration must not run");
        },
    });
    state = setHook(state, leave, record("z-tie"));
    state = setHook(state, leave, record("a-tie", 0));
    state = setHook(state, leave, {
        id: "first",
        priority: 10,
        invoke(current, departure) {
            calls.push([nested ? "nested" : "outer", "first"]);
            if (nested) return { state: current, value: undefined };
            assert.equal(units.get(current, units.ref(departure.unit)), undefined);
            current = removeHook(current, leave, "removed");
            current = setHook(current, leave, record("replacement", 100));
            current = setHook(current, leave, record("added", 1000));
            nested = true;
            const result = hooks.dispatch(current, departure, undefined, options);
            nested = false;
            return result;
        },
    });
    remove(state, units.ref(subject), "SCRIPT");

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

test("Unit prepare prioritizes responses while leave orders the latest captured programs after removal", () => {
    const calls = [];
    let state = battle([{ definition: { id: "departing", hooks: Hooks.empty() }, position: [0, 0] }]);
    const subject = units.ref(units.all(state).find(() => true));
    state = effects.install(state, subject, {
        id: "death-response", initialize: () => ({}),
        onInstall(current, self) {
            return update(current, self.host, units.setHook(units.prepare, {
                id: "death-output",
                invoke(next) {
                    assert.equal(units.get(next, subject).lifecycle, "LEAVING");
                    assert.equal(effects.get(next, effects.ref(self)).lifecycle, "ACTIVE");
                    calls.push("death-output");
                    return { state: next, value: undefined };
                },
            }));
        },
        onEnd(current, self) {
            assert.equal(units.get(current, subject).lifecycle, "LEAVING");
            calls.push("effect-end");
            return update(current, self.host, units.setHook(units.leave, {
                id: "latest-leave", priority: 200,
                invoke(next, departure) {
                    assert.equal(units.get(next, subject), undefined);
                    assert.equal(departure.unit.hooks.find(units.leave, "latest-leave").priority, -10);
                    calls.push("latest-leave");
                    return { state: next, value: undefined };
                },
            }));
        },
    }).state;
    state = update(state, subject, units.compose(
        units.setHook(units.prepare, {
            id: "earlier-response", priority: 100,
            invoke(current) {
                assert.equal(units.get(current, subject).lifecycle, "LEAVING");
                calls.push("earlier-response");
                return { state: current, value: undefined };
            },
        }),
        units.compose(
            units.setHook(units.leave, {
                id: "latest-leave", priority: -10,
                invoke: () => assert.fail("leave must capture the replacement installed during finalization"),
            }),
            units.setHook(units.leave, {
                id: "high-leave", priority: 100,
                invoke(current) {
                    assert.equal(units.get(current, subject), undefined);
                    calls.push("high-leave");
                    return { state: current, value: undefined };
                },
            }),
        ),
    ));

    remove(state, subject, "DEATH");
    assert.deepEqual(calls, ["earlier-response", "death-output", "effect-end", "latest-leave", "high-leave"]);
});
