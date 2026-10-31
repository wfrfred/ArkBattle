import assert from "node:assert/strict";
import { test } from "node:test";
import { update } from "../../dist/core/battle/unit.js";
import * as blockers from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { resolveCapacity } from "../../dist/core/unit/capability/blocking/blocker.js";
import { getUnit } from "../helpers/unit.js";
import {
    fixture,
    holder,
    target,
    acquire,
    blockedIds,
    ownerId,
    hook,
} from "../helpers/blocking.js";

for (const first of ["capacity", "layer"]) {
    test(`${first} settles first after a batch publishes the new capacity and blocking layer`, () => {
        let initial = acquire(
            fixture([
                holder(10, {
                    definition: { blocker: { capacity: 3, layer: "GROUND", rules: [] } },
                }),
                target(20),
                target(21),
                target(22),
            ]),
        );
        const original = getUnit(initial, 10).blocker.blocked;
        const observed = [];
        initial = update(initial, [
            blockers.setHook(
                { id: 10 },
                "released",
                hook("observe-batch-order", (battle, { relation }) => {
                    const current = getUnit(battle, 10);
                    assert.equal(current.blocker.layer, "AIR");
                    assert.equal(current.blocker.radius, 0.8944);
                    assert.equal(resolveCapacity(current.definition.blocker, current.blocker), 1);
                    assert.equal(
                        relation.blocked,
                        original.find((entry) => entry.id === relation.blocked.id),
                    );
                    assert.equal(ownerId(battle, relation.blocked.id), undefined);
                    for (const retained of current.blocker.blocked) {
                        assert.equal(
                            retained,
                            original.find((entry) => entry.id === retained.id),
                        );
                        assert.equal(ownerId(battle, retained.id), 10);
                    }
                    observed.push({ released: relation.blocked, remaining: blockedIds(battle) });
                    return battle;
                }),
            ),
        ]);
        const capacity = blockers.setCapacityContribution(
            { id: 10 },
            {
                id: "smaller-capacity",
                value: [{ type: "ADD", value: -2 }],
            },
        );
        const layer = blockers.setLayer({ id: 10 }, "AIR");

        const updated = update(
            initial,
            first === "capacity" ? [capacity, layer] : [layer, capacity],
        );

        assert.deepEqual(
            observed.map((entry) => entry.released),
            first === "capacity" ? [...original].reverse() : original,
        );
        assert.deepEqual(
            observed.map((entry) => entry.remaining),
            first === "capacity" ? [[20, 21], [20], []] : [[], [], []],
        );
        assert.deepEqual(blockedIds(updated), []);
        for (const id of [20, 21, 22]) assert.equal(ownerId(updated, id), undefined);
        assert.equal(
            updated.events.filter((event) => event.type === "BLOCKING_RELEASED").length,
            3,
        );
        assert.equal(getUnit(initial, 10).blocker.layer, "GROUND");
        assert.equal(
            resolveCapacity(getUnit(initial, 10).definition.blocker, getUnit(initial, 10).blocker),
            3,
        );
        assert.deepEqual(blockedIds(initial), [20, 21, 22]);
    });
}

test("a same-batch layer round trip clears captured old relationships and preserves Hook-created replacements", () => {
    let initial = acquire(
        fixture([
            holder(10, { definition: { blocker: { capacity: 2, layer: "GROUND", rules: [] } } }),
            target(20),
            target(21),
        ]),
    );
    const original = getUnit(initial, 10).blocker.blocked;
    const released = [];
    initial = update(initial, [
        blockers.setHook(
            { id: 10 },
            "released",
            hook("rebuild-after-layer-round-trip", (battle, { relation }) => {
                released.push(relation.blocked);
                assert.equal(
                    relation.blocked,
                    original.find((entry) => entry.id === relation.blocked.id),
                );
                assert.equal(getUnit(battle, 10).blocker.layer, "GROUND");
                assert.equal(getUnit(battle, 10).blocker.radius, 0.7071);
                if (released.length === 1) {
                    assert.deepEqual(blockedIds(battle), []);
                    assert.equal(ownerId(battle, 20), undefined);
                    assert.equal(ownerId(battle, 21), undefined);
                    battle = acquire(battle);
                }
                assert.deepEqual(blockedIds(battle), [20, 21]);
                for (const current of getUnit(battle, 10).blocker.blocked) {
                    assert.notEqual(
                        current,
                        original.find((entry) => entry.id === current.id),
                    );
                }
                return battle;
            }),
        ),
    ]);

    const updated = update(initial, [
        blockers.setLayer({ id: 10 }, "AIR"),
        blockers.setLayer({ id: 10 }, "GROUND"),
    ]);

    assert.deepEqual(released, original);
    assert.deepEqual(blockedIds(updated), [20, 21]);
    assert.equal(getUnit(updated, 10).blocker.layer, "GROUND");
    for (const current of getUnit(updated, 10).blocker.blocked) {
        assert.notEqual(
            current,
            original.find((entry) => entry.id === current.id),
        );
        assert.equal(ownerId(updated, current.id), 10);
    }
    assert.equal(updated.events.filter((event) => event.type === "BLOCKING_RELEASED").length, 2);
    assert.equal(updated.events.filter((event) => event.type === "BLOCKING_ACQUIRED").length, 4);
    assert.equal(getUnit(initial, 10).blocker.blocked, original);
    assert.equal(getUnit(initial, 10).blocker.layer, "GROUND");
});
