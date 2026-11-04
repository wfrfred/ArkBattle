import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { createChange } from "../../dist/core/unit/change.js";
import { update } from "../../dist/core/battle/unit.js";

test("a batch publishes every final transformation before settlements and preserves nested results", () => {
    const before = battle([
        { definition: { id: "first", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "second", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const [first, second] = units.all(before).map(units.ref).toArray();
    const order = [];
    const after = update(before, [
        createChange(first, (self) => self, () => assert.fail("unchanged input must not settle")),
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
