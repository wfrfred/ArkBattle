import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/index.js";
import { createChange } from "../../dist/core/unit/change.js";
import { update } from "../../dist/core/battle/unit.js";
import { hasOffense, resolveAttack, setAttackContribution } from "../../dist/core/unit/capability/offense/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

test("combined changes prepare in leaf order, publish once and preserve nested settlement results", () => {
    const before = battle([
        { definition: { id: "first", hooks: Hooks.empty(), offense: { attack: 100 } }, position: [0, 0] },
        { definition: { id: "second", hooks: Hooks.empty() }, position: [1, 0] },
    ]);
    const [first, second] = units.all(before).map(units.ref).toArray();
    const order = [];
    const after = update(before, units.combine([
        units.combine([]),
        units.combine([
            createChange(first, (self) => self, () => assert.fail("unchanged input must not settle")),
            units.combine([
                createChange(
                    first,
                    (self) => ({ ...self, position: [self.position[0] + 1, 0] }),
                    (state, previous) => {
                        assert.deepEqual(previous.position, [0, 0]);
                        assert.deepEqual(units.get(state, first).position, [3, 0]);
                        assert.deepEqual(units.get(state, second).position, [5, 0]);
                        assert.equal(resolveAttack(state, units.get(state, first)), 110);
                        order.push("first");
                        return update(
                            state,
                            createChange(
                                second,
                                (self) => ({ ...self, position: [self.position[0], 1] }),
                                (current) => {
                                    order.push("nested");
                                    return current;
                                },
                            ),
                        );
                    },
                ),
                units.combine(first, (self) => {
                    assert.deepEqual(self.position, [1, 0]);
                    assert.deepEqual(order, []);
                    return hasOffense(self) ? [setAttackContribution(units.ref(self), {
                        id: "prepared-bonus", value: [modifier({ addition: 10 })],
                    })] : [];
                }),
                createChange(
                    second,
                    (self) => ({ ...self, position: [self.position[0] + 4, 0] }),
                    (state, previous) => {
                        assert.deepEqual(previous.position, [1, 0]);
                        assert.deepEqual(units.get(state, second).position, [5, 1]);
                        order.push("second");
                        return state;
                    },
                ),
            ]),
        ]),
        units.combine(second, (self) => {
            assert.deepEqual(self.position, [5, 0]);
            return hasOffense(self) ? [setAttackContribution(units.ref(self), {
                id: "prepared-bonus", value: [modifier({ addition: 10 })],
            })] : [];
        }),
        createChange(
            first,
            (self) => ({ ...self, position: [self.position[0] + 2, 0] }),
            (state, previous) => {
                assert.deepEqual(previous.position, [1, 0]);
                order.push("first-again");
                return state;
            },
        ),
    ]));

    assert.deepEqual(order, ["first", "nested", "second", "first-again"]);
    assert.deepEqual(units.get(after, first).position, [3, 0]);
    assert.deepEqual(units.get(after, second).position, [5, 1]);
    assert.deepEqual(units.get(before, first).position, [0, 0]);
    assert.deepEqual(units.get(before, second).position, [1, 0]);
});
