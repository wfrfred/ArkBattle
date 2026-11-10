import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { createChange } from "../../dist/core/unit/change.js";
import { update } from "../../dist/core/battle/unit.js";

test("composition associates without commuting, publishes the final Unit and preserves nested settlements", () => {
    const before = battle([
        { definition: { id: "first", hooks: Hooks.empty() }, position: [0, 0] },
        { definition: { id: "second", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const [first, second] = units.all(before).map(units.ref).toArray();
    const order = [];
    const increment = createChange(
        (self) => ({ ...self, position: [self.position[0] + 1, 0] }),
        (state, previous) => {
            assert.deepEqual(previous.position, [0, 0]);
            assert.deepEqual(units.get(state, first).position, [5, 0]);
            assert.deepEqual(units.get(state, second).position, [1, 0]);
            order.push("increment");
            return update(state, second, createChange(
                (self) => ({ ...self, position: [self.position[0], 1] }),
                (current) => {
                    order.push("nested");
                    return current;
                },
            ));
        },
    );
    const scale = createChange(
        (self) => ({ ...self, position: [self.position[0] * 3, 0] }),
        (state, previous) => {
            assert.deepEqual(previous.position, [1, 0]);
            assert.deepEqual(units.get(state, first).position, [5, 0]);
            assert.deepEqual(units.get(state, second).position, [1, 1]);
            order.push("scale");
            return state;
        },
    );
    const offset = createChange(
        (self) => ({ ...self, position: [self.position[0] + 2, 0] }),
        (state, previous) => {
            assert.deepEqual(previous.position, [3, 0]);
            order.push("offset");
            return state;
        },
    );
    const unchanged = createChange(
        (self) => self,
        () => assert.fail("unchanged input must not settle"),
    );
    const guardedScale = units.optional((self) => self.position[0] > 0, scale);
    const left = units.compose(units.compose(increment, guardedScale), offset);
    const right = units.compose(increment, units.compose(guardedScale, offset));
    const source = units.get(before, first);
    const skipped = guardedScale(source);
    assert.equal(skipped.next, source);
    assert.deepEqual(skipped.settlements, []);
    assert.deepEqual(left(source).next, right(source).next);
    assert.notDeepEqual(
        units.compose(increment, scale)(source).next.position,
        units.compose(scale, increment)(source).next.position,
    );
    assert.deepEqual(order, []);

    const after = update(before, first, units.compose(unchanged, left));
    assert.deepEqual(order, ["increment", "nested", "scale", "offset"]);
    assert.deepEqual(units.get(after, first).position, [5, 0]);
    assert.deepEqual(units.get(after, second).position, [1, 1]);
});
