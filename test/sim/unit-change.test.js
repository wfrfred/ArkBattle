import { setVolumeContribution } from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { update } from "../../dist/core/battle/unit.js";
import { createChange } from "../../dist/core/unit/change.js";
import * as blockers from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import * as blocking from "../../dist/core/battle/blocking/operations.js";
import { fixture, holder, target, blockedIds, ownerId, hook } from "../helpers/blocking.js";
import { getUnit } from "../helpers/unit.js";

test("a batch applies repeated targets in order and publishes every result before ordered settlements", () => {
    const initial = fixture([target(20), target(21)]);
    const previous = [];
    const trace = [];
    const settle = (label) => (battle, self) => {
        previous.push(self);
        trace.push([
            label,
            self.vitality.hp,
            getUnit(battle, 20).vitality.hp,
            getUnit(battle, 21).vitality.hp,
        ]);
        return battle;
    };
    const updated = update(initial, [
        createChange(
            { id: 20 },
            (self) => {
                trace.push("transform 20 first");
                return { ...self, vitality: { ...self.vitality, hp: 80 } };
            },
            settle("settle 20 first"),
        ),
        createChange(
            { id: 21 },
            (self) => {
                trace.push("transform 21");
                return { ...self, vitality: { ...self.vitality, hp: 60 } };
            },
            settle("settle 21"),
        ),
        createChange(
            { id: 20 },
            (self) => {
                assert.equal(self.vitality.hp, 80);
                trace.push("transform 20 second");
                return { ...self, vitality: { ...self.vitality, hp: self.vitality.hp - 10 } };
            },
            settle("settle 20 second"),
        ),
    ]);
    assert.deepEqual(trace, [
        "transform 20 first",
        "transform 21",
        "transform 20 second",
        ["settle 20 first", 100, 70, 60],
        ["settle 21", 100, 70, 60],
        ["settle 20 second", 80, 70, 60],
    ]);
    assert.equal(previous[0], getUnit(initial, 20));
    assert.equal(previous[1], getUnit(initial, 21));
    assert.notEqual(previous[2], previous[0]);
    assert.equal(previous[2].vitality.hp, 80);
    assert.equal(getUnit(updated, 20).vitality.hp, 70);
    assert.equal(getUnit(initial, 20).vitality.hp, 100);
});

test("settlements use the latest returned battle and may run without a Unit transformation", () => {
    const initial = fixture([target(20)]);
    const previous = getUnit(initial, 20);
    const trace = [];
    const updated = update(initial, [
        createChange(
            { id: 20 },
            (self) => self,
            (battle, self) => {
                assert.equal(self, previous);
                assert.equal(getUnit(battle, 20), previous);
                trace.push("first");
                return update(battle, [
                    createChange({ id: 20 }, (unit) => ({
                        ...unit,
                        vitality: { ...unit.vitality, hp: 43 },
                    })),
                ]);
            },
        ),
        createChange(
            { id: 20 },
            (self) => self,
            (battle, self) => {
                assert.equal(self, previous);
                trace.push(getUnit(battle, 20).vitality.hp);
                return { ...battle, tick: 7 };
            },
        ),
    ]);
    assert.deepEqual(trace, ["first", 43]);
    assert.equal(getUnit(updated, 20).vitality.hp, 43);
    assert.equal(updated.tick, 7);
    assert.equal(initial.tick, 0);
});

test("a capacity change and removal in one batch settle the final capacity instead of an intermediate zero", () => {
    const initial = blocking.acquire(fixture([holder(), target()]), { id: 10 }, { id: 20 });
    const relation = getUnit(initial, 10).blocker.blocked[0];
    const zero = blockers.setCapacityContribution(
        { id: 10 },
        { id: "temporary-zero", value: [{ type: "ZERO" }] },
    );
    const remove = blockers.removeCapacityContribution({ id: 10 }, "temporary-zero");
    const batched = update(initial, [zero, remove]);
    assert.deepEqual(blockedIds(batched), [20]);
    assert.equal(getUnit(batched, 10).blocker.blocked[0], relation);
    assert.equal(batched.events.filter((event) => event.type === "BLOCKING_RELEASED").length, 0);
    const separated = update(update(initial, [zero]), [remove]);
    assert.deepEqual(blockedIds(separated), []);
    assert.equal(ownerId(separated), undefined);
    assert.equal(separated.events.filter((event) => event.type === "BLOCKING_RELEASED").length, 1);
});

test("nested changes to another Blocker keep their own settlement and old relation identities", () => {
    let initial = fixture([
        holder(10, { position: [2, 1] }),
        holder(11, { position: [7, 1] }),
        target(20, { position: [2.25, 1] }),
        target(21, { position: [7.25, 1] }),
    ]);
    initial = blocking.acquire(initial, { id: 10 }, { id: 20 });
    initial = blocking.acquire(initial, { id: 11 }, { id: 21 });
    const oldOther = getUnit(initial, 11).blocker.blocked[0];
    const releases = [];
    initial = update(initial, [
        blockers.setHook(
            { id: 10 },
            "released",
            hook("nested-other-layer", (battle) => {
                releases.push(20);
                assert.equal(getUnit(battle, 10).blocker.layer, "AIR");
                assert.equal(getUnit(battle, 11).blocker.layer, "AIR");
                assert.equal(getUnit(battle, 11).blocker.blocked[0], oldOther);
                battle = update(battle, [blockers.setLayer({ id: 11 }, "GROUND")]);
                return blocking.acquire(battle, { id: 11 }, { id: 21 });
            }),
        ),
        blockers.setHook(
            { id: 11 },
            "released",
            hook("observe-other-release", (battle) => {
                releases.push(21);
                assert.equal(getUnit(battle, 11).blocker.layer, "GROUND");
                return battle;
            }),
        ),
    ]);
    const updated = update(initial, [
        blockers.setLayer({ id: 10 }, "AIR"),
        blockers.setLayer({ id: 11 }, "AIR"),
    ]);
    assert.deepEqual(releases, [20, 21]);
    assert.deepEqual(blockedIds(updated, 10), []);
    assert.deepEqual(blockedIds(updated, 11), [21]);
    assert.notEqual(getUnit(updated, 11).blocker.blocked[0], oldOther);
    assert.equal(getUnit(updated, 11).blocker.layer, "GROUND");
    assert.equal(getUnit(updated, 10).blocker.layer, "AIR");
    assert.equal(
        updated.events.filter(
            (event) => event.type === "BLOCKING_RELEASED" && event.blockedUnitId === 21,
        ).length,
        1,
    );
});

test("a nested change to an unrelated Blocker does not take over the outer owner's unfinished maintenance", () => {
    let initial = fixture([
        holder(10, { capacity: 3 }),
        holder(11, { capacity: 3, position: [7, 1] }),
        target(20),
        target(21),
        target(22),
        target(23, { position: [7.25, 1] }),
    ]);
    for (const id of [20, 21, 22]) initial = blocking.acquire(initial, { id: 10 }, { id });
    initial = blocking.acquire(initial, { id: 11 }, { id: 23 });
    const retained = getUnit(initial, 10).blocker.blocked.slice(0, 2);
    const released = [];
    initial = update(initial, [
        blockers.setHook(
            { id: 10 },
            "released",
            hook("restore-after-unrelated-write", (battle) => {
                released.push(22);
                assert.deepEqual(blockedIds(battle, 10), [20, 21]);
                battle = update(battle, [
                    blockers.setCapacityContribution(
                        { id: 11 },
                        { id: "limit", value: [{ type: "ADD", value: -1 }] },
                    ),
                ]);
                assert.deepEqual(getUnit(battle, 10).blocker.blocked, retained);
                return update(battle, [
                    blockers.setCapacityContribution(
                        { id: 10 },
                        { id: "limit", value: [{ type: "ADD", value: -1 }] },
                    ),
                ]);
            }),
        ),
    ]);
    const updated = update(initial, [
        blockers.setCapacityContribution(
            { id: 10 },
            { id: "limit", value: [{ type: "ADD", value: -2 }] },
        ),
    ]);
    assert.deepEqual(released, [22]);
    assert.deepEqual(blockedIds(updated, 10), [20, 21]);
    assert.deepEqual(getUnit(updated, 10).blocker.blocked, retained);
    for (let index = 0; index < retained.length; index++)
        assert.equal(getUnit(updated, 10).blocker.blocked[index], retained[index]);
    assert.deepEqual(blockedIds(updated, 11), [23]);
});

test("volume settlement follows the target's current owner after an earlier settlement transfers it", () => {
    const visited = [];
    let initial = fixture([holder(10), holder(11, { capacity: 2 }), target()]);
    for (const id of [10, 11])
        initial = update(initial, [
            blockers.setRule(
                { id },
                {
                    id: "observe-volume-owner",
                    allows(battle, owner) {
                        if (battle.tick === 1) visited.push(owner.id);
                        return true;
                    },
                },
            ),
        ]);
    initial = blocking.acquire(initial, { id: 10 }, { id: 20 });
    const updated = update(initial, [
        createChange(
            { id: 20 },
            (self) => self,
            (battle) => {
                battle = blocking.release(battle, { id: 20 });
                battle = blocking.acquire(battle, { id: 11 }, { id: 20 });
                assert.equal(ownerId(battle), 11);
                return { ...battle, tick: 1 };
            },
        ),
        setVolumeContribution({ id: 20 }, { id: "larger", value: 1 }),
    ]);
    assert.deepEqual(visited, [11]);
    assert.equal(ownerId(updated), 11);
    assert.deepEqual(blockedIds(updated, 10), []);
    assert.deepEqual(blockedIds(updated, 11), [20]);
    assert.equal(ownerId(initial), 10);
});
