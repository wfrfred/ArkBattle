// Contract: [api-conventions](../../docs/architecture/api-conventions.md#51-unit-完整操作与批量变更).
import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { createChange } from "../../dist/core/unit/change.js";
import { update } from "../../dist/core/unit/operations.js";

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
            assert.deepEqual(first.get(state).position, [5, 0]);
            assert.deepEqual(second.get(state).position, [1, 0]);
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
            assert.deepEqual(first.get(state).position, [5, 0]);
            assert.deepEqual(second.get(state).position, [1, 1]);
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
    const source = first.get(before);
    assert.deepEqual(left(source).next, right(source).next);
    assert.notDeepEqual(
        units.compose(increment, scale)(source).next.position,
        units.compose(scale, increment)(source).next.position,
    );
    assert.deepEqual(order, []);

    const after = update(before, first, units.compose(unchanged, left));
    assert.deepEqual(order, ["increment", "nested", "scale", "offset"]);
    assert.deepEqual(first.get(after).position, [5, 0]);
    assert.deepEqual(second.get(after).position, [1, 1]);

    const original = first.get(after);
    const temporary = createChange(
        (self) => ({ ...self, position: [6, 0] }),
        (state) => {
            assert.equal(first.get(state), original);
            order.push("restore-settlement");
            return state;
        },
    );
    const restored = update(after, first, units.compose(temporary, createChange(() => original)));
    assert.equal(first.get(restored), original);
    assert.equal(order.at(-1), "restore-settlement");
});
