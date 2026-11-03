import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { createChange } from "../../dist/core/unit/change.js";
import { update, remove } from "../../dist/core/battle/unit.js";
import * as hooks from "../../dist/core/hook.js";
import { setHook, removeHook } from "../../dist/core/battle/unit-hook.js";

test("a batch publishes every final transformation before settlements and preserves nested results", () => {
    const before = battle([
        { definition: { id: "first", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "second", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const [first, second] = units.all(before).map(units.ref).toArray();
    const order = [];
    const after = update(before, [
        createChange(
            first,
            (self) => ({ ...self, position: [self.position[0] + 1, 0] }),
            (state, previous) => {
                assert.deepEqual(previous.position, [0, 0]);
                assert.deepEqual(units.get(state, first).position, [3, 0]);
                assert.deepEqual(units.get(state, second).position, [5, 0]);
                order.push("first");
                return update(state, [
                    createChange(
                        second,
                        (self) => ({ ...self, position: [self.position[0], 1] }),
                        (current) => {
                            order.push("nested");
                            return current;
                        },
                    ),
                ]);
            },
        ),
        createChange(
            second,
            (self) => ({ ...self, position: [self.position[0] + 4, 0] }),
            (state) => {
                assert.deepEqual(units.get(state, second).position, [5, 1]);
                order.push("second");
                return state;
            },
        ),
        createChange(
            first,
            (self) => ({ ...self, position: [self.position[0] + 2, 0] }),
            (state, previous) => {
                assert.deepEqual(previous.position, [1, 0]);
                order.push("first-again");
                return state;
            },
        ),
    ]);

    assert.deepEqual(order, ["first", "nested", "second", "first-again"]);
    assert.deepEqual(units.get(after, first).position, [3, 0]);
    assert.deepEqual(units.get(after, second).position, [5, 1]);
    assert.deepEqual(units.get(before, first).position, [0, 0]);
    assert.deepEqual(units.get(before, second).position, [1, 0]);
});

test("Hook dispatch fixes its candidates, reads current registrations and gives nested dispatch its own candidates", () => {
    let state = battle([{ definition: { id: "observed", hooks: Hooks.empty() }, position: [0, 0] }]);
    const subject = units.all(state).find(() => true);
    const calls = [];
    let nested = false;
    const options = {
        candidates: (current) => current.unitHooks.leave.map((entry) => entry.id),
        find: (current, id) => current.unitHooks.leave.find((entry) => entry.id === id),
    };
    const record = (id) => ({
        id,
        invoke(current) {
            calls.push([nested ? "nested" : "outer", id]);
            return { state: current, value: undefined };
        },
    });
    state = setHook(state, "leave", {
        id: "first",
        invoke(current, departure) {
            calls.push([nested ? "nested" : "outer", "first"]);
            if (nested) return { state: current, value: undefined };
            assert.equal(units.get(current, units.ref(departure.unit)), undefined);
            current = removeHook(current, "leave", "removed");
            current = setHook(current, "leave", record("replacement"));
            current = setHook(current, "leave", record("added"));
            nested = true;
            const result = hooks.dispatch(current, departure, undefined, options);
            nested = false;
            return result;
        },
    });
    state = setHook(state, "leave", record("removed"));
    state = setHook(state, "leave", {
        id: "replacement",
        invoke() {
            assert.fail("the old registration must not run");
        },
    });

    remove(state, subject.id, "SCRIPT");

    assert.deepEqual(calls, [
        ["outer", "first"],
        ["nested", "first"],
        ["nested", "replacement"],
        ["nested", "added"],
        ["outer", "replacement"],
    ]);
});
