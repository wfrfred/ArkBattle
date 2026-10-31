import * as blockerOperations from "../../dist/core/unit/capability/blocking/blocker-operations.js";

import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as query from "../../dist/core/battle/blocking/query.js";
import * as blocker from "../../dist/core/unit/capability/blocking/blocker.js";
import * as presence from "../../dist/core/unit/capability/presence/operations.js";
import * as blockable from "../../dist/core/unit/capability/blocking/blockable.js";
import * as blockableOperations from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, capacity, hook } from "../helpers/blocking.js";

const onBlocker = (battle, id, key, entry) => {
    const currentUnit = getUnit(battle, id);
    return applyUnitChanges(battle, [blockerOperations.setHook({ id: currentUnit.id }, key, entry)]);
};
const onBlockable = (battle, id, key, entry) => {
    const currentUnit2 = getUnit(battle, id);
    return applyUnitChanges(battle, [blockableOperations.setHook({ id: currentUnit2.id }, key, entry)]);
};

test("a failed acquire does not create transient relations or notifications", () => {
    let battle = fixture([holder(10, { capacity: 1 }), target(20, { volume: 2 })]);
    const notifications = [];
    for (const key of ["acquired", "released"]) battle = onBlocker(battle, 10, key, hook(key, state => {
        notifications.push(key);
        return state;
    }));
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle), undefined);
    assert.deepEqual(notifications, []);
});

test("both relation endpoints and indexes are coherent before the first acquired Hook", () => {
    let battle = fixture([holder(), holder(11), target()]);
    const observed = [];
    battle = onBlocker(battle, 10, "acquired", hook("inspect", (state, context) => {
        assert.equal(context.host.id, 10);
        assert.equal(context.relation.blocker.id, 10);
        assert.equal(context.relation.blocked.id, 20);
        assert.equal(ownerId(state), 10);
        assert.deepEqual(blockedIds(state), [20]);
        assert.equal(getUnit(state, 10).blocker.blocked[0], context.relation.blocked);
        assert.equal(query.usedCapacity(state, { id: 10 }), 1);
        observed.push("blocker");
        state = acquire(state, 11);
        assert.equal(ownerId(state), 10, "nested search must observe exclusive ownership");
        return state;
    }));
    battle = onBlockable(battle, 20, "acquired", hook("inspect", state => {
        observed.push("blockable");
        return state;
    }));
    battle = acquire(battle);
    assert.deepEqual(observed, ["blocker", "blockable"]);
    assert.deepEqual(blockedIds(battle, 11), []);
});

test("search fixes candidate identities but reads live capacity after each acquired Hook", () => {
    let battle = fixture([holder(), target(20), target(21), target(22)]);
    battle = onBlocker(battle, 10, "acquired", hook("expand", (state, { relation }) => {
        if (relation.blocked.id !== 20) return state;
        state = capacity(state, 10, 4);
        return addUnit(state, target(19));
    }));
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [20, 21, 22]);
    assert.equal(ownerId(battle, 19), undefined, "a newly registered candidate waits for another search");
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [20, 21, 22, 19]);
});

test("later candidates are checked against live eligibility and live ownership", () => {
    let battle = fixture([holder(10, { capacity: 3 }), holder(11, { capacity: 3 }), target(20), target(21), target(22)]);
    battle = onBlocker(battle, 10, "acquired", hook("alter-candidates", (state, { relation }) => {
        if (relation.blocked.id !== 20) return state;
        state = applyUnitChanges(state, [blockableOperations.setRule({ id: 21 }, { id: "disabled", allows: () => false })]);
        return acquire(state, 11);
    }));
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(ownerId(battle, 21), undefined);
    assert.equal(ownerId(battle, 22), 11);
});

test("a capacity reduction in an acquired Hook changes subsequent attempts immediately", () => {
    let battle = fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]);
    battle = onBlocker(battle, 10, "acquired", hook("shrink", (state, { relation }) => (
        relation.blocked.id === 20 ? capacity(state, 10, 1) : state
    )));
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [20]);
});

test("advance fixes the Blocker list before Hooks register additional blockers", () => {
    let battle = fixture([holder(), target(), target(30, { position: [7.25, 1] })]);
    battle = onBlocker(battle, 10, "acquired", hook("spawn-blocker", state => addUnit(
        state, holder(11, { position: [7, 1] }),
    )));
    battle = blocking.advance(battle);
    assert.equal(ownerId(battle), 10);
    assert.equal(ownerId(battle, 30), undefined);
    battle = blocking.advance({ ...battle, tick: battle.tick + 1 });
    assert.equal(ownerId(battle, 30), 11);
});

test("release synchronously notifies both sides and does not search again", () => {
    let battle = fixture([holder(), target()]);
    const observed = [];
    battle = onBlocker(battle, 10, "released", hook("first", (state, context) => {
        observed.push([context.host.id, context.relation.blocked.id]);
        assert.equal(ownerId(state), undefined);
        assert.deepEqual(blockedIds(state), []);
        return state;
    }));
    battle = onBlockable(battle, 20, "released", hook("second", (state, context) => {
        observed.push([context.host.id, context.relation.blocker.id]);
        return state;
    }));
    battle = acquire(battle);
    battle = blocking.release(battle, blocking.relations(battle, { id: 20 }));
    assert.deepEqual(observed, [[10, 20], [20, 10]]);
    assert.equal(ownerId(battle), undefined);
    assert.equal(blocking.release(battle, blocking.relations(battle, { id: 20 })), battle);
});

test("relation queries project original identities for the field and either endpoint", () => {
    let battle = acquire(fixture([
        holder(10, { capacity: 2 }), holder(11, { position: [7, 1] }),
        target(20), target(21), target(30, { position: [7.25, 1] }),
    ]));
    battle = acquire(battle, 11);
    const all = blocking.relations(battle);
    assert.deepEqual(all.map(({ blocker, blocked }) => [blocker.id, blocked.id]), [
        [10, 20], [10, 21], [11, 30],
    ]);
    assert.deepEqual(blocking.relations(battle, { id: 10 }).map(({ blocked }) => blocked.id), [20, 21]);
    assert.deepEqual(blocking.relations(battle, { id: 20 }).map(({ blocker }) => blocker.id), [10]);
    assert.deepEqual(blocking.relations(battle, { id: 99 }), []);
    assert.equal(all[0].blocked, getUnit(battle, 10).blocker.blocked[0]);
    assert.equal(blocking.relations(battle, { id: 20 })[0].blocked, all[0].blocked);
});

test("batch release deduplicates old identities, publishes all owners, and records facts before reentrant acquisition", () => {
    let battle = acquire(fixture([
        holder(10, { capacity: 3 }), holder(11, { position: [7, 1] }),
        target(20), target(21), target(22), target(30, { position: [7.25, 1] }),
    ]));
    battle = acquire(battle, 11);
    const old = blocking.relations(battle);
    battle = blocking.release(battle, [old[1]]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 21 });
    const retained = getUnit(battle, 10).blocker.blocked[2];
    const calls = [];
    battle = onBlocker(battle, 10, "released", hook("inspect-batch", (state, { relation }) => {
        calls.push(relation.blocked.id);
        if (relation.blocked.id === 22) {
            assert.deepEqual(blockedIds(state, 10), [21, 20]);
            return state;
        }
        assert.deepEqual(blockedIds(state, 10), [21]);
        assert.deepEqual(blockedIds(state, 11), []);
        assert.equal(ownerId(state, 20), undefined);
        assert.equal(ownerId(state, 22), undefined);
        assert.equal(ownerId(state, 30), undefined);
        assert.equal(getUnit(state, 10).blocker.blocked[0], retained);
        assert.deepEqual(state.events.map(({ type, blockedUnitId }) => [type, blockedUnitId]), [
            ["BLOCKING_RELEASED", 20], ["BLOCKING_RELEASED", 30], ["BLOCKING_RELEASED", 22],
        ]);
        return blocking.acquire(state, { id: 10 }, { id: 20 });
    }));
    battle = onBlocker(battle, 11, "released", hook("other-owner", (state, { relation }) => {
        calls.push(relation.blocked.id);
        assert.deepEqual(blockedIds(state, 10), [21, 20]);
        return state;
    }));
    battle = { ...battle, events: [] };
    battle = blocking.release(battle, [old[0], old[0], { ...old[0] }, old[1], old[3], old[2]]);

    assert.deepEqual(calls, [20, 30, 22]);
    assert.deepEqual(blockedIds(battle, 10), [21, 20]);
    assert.notEqual(getUnit(battle, 10).blocker.blocked[1], old[0].blocked);
    assert.deepEqual(battle.events.map(({ type, blockedUnitId }) => [type, blockedUnitId]), [
        ["BLOCKING_RELEASED", 20], ["BLOCKING_RELEASED", 30], ["BLOCKING_RELEASED", 22], ["BLOCKING_ACQUIRED", 20],
    ]);
    assert.equal(blocking.release(battle, old), battle, "old references cannot release rebuilt relationships");
});

test("release affects only its supplied relationships without maintaining siblings or searching", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21), target(22)]);
    battle = applyUnitChanges(battle, [blockerOperations.setRule({ id: 10 }, {
        id: "second-needs-first",
        allows: (_state, owner, candidate) => candidate.id !== 21 || owner.blocker.blocked.some(entry => entry.id === 20),
    })]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = blocking.acquire(battle, { id: 10 }, { id: 21 });
    battle = { ...battle, events: [] };
    battle = blocking.release(battle, blocking.relations(battle, { id: 20 }));
    assert.deepEqual(blockedIds(battle), [21]);
    assert.equal(ownerId(battle, 22), undefined);
    assert.deepEqual(battle.events.map(({ type, blockedUnitId }) => [type, blockedUnitId]), [["BLOCKING_RELEASED", 20]]);

    battle = blocking.maintain(battle, blocking.relations(battle, { id: 21 })[0]);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 22), undefined);
});

test("tail release notification can restore capacity before the next relation is removed", () => {
    let battle = fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]);
    const removed = [];
    battle = onBlocker(battle, 10, "released", hook("restore", (state, { relation }) => {
        removed.push(relation.blocked.id);
        return relation.blocked.id === 22 ? capacity(state, 10, 2) : state;
    }));
    battle = capacity(acquire(battle), 10, 1);
    assert.deepEqual(removed, [22]);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(query.usedCapacity(battle, { id: 10 }), 2);
});

test("an unrelated Unit update leaves capacity maintenance to the enclosing Blocking operation", () => {
    let battle = fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22), target(30, { position: [10, 1] })]);
    const removed = [];
    battle = onBlocker(battle, 10, "released", hook("nested-update", (state, { relation }) => {
        removed.push(relation.blocked.id);
        if (relation.blocked.id !== 22) return state;
        const currentUnit4 = getUnit(state, 30);
        state = replaceUnit(state, { ...currentUnit4, position: [10.25, 1] });
        assert.deepEqual(blockedIds(state), [20, 21], "ordinary Unit updates do not recursively trim Blocking relations");
        return capacity(state, 10, 2);
    }));
    battle = capacity(acquire(battle), 10, 1);
    assert.deepEqual(removed, [22]);
    assert.deepEqual(blockedIds(battle), [20, 21]);
});

test("pure reverse-link maintenance does not trim the next relation before notifying this release", () => {
    let battle = fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]);
    const snapshots = [];
    battle = onBlocker(battle, 10, "released", hook("observe-prefix", (state, { relation }) => {
        snapshots.push([relation.blocked.id, blockedIds(state)]);
        return state;
    }));
    battle = capacity(acquire(battle), 10, 1);
    assert.deepEqual(snapshots, [[22, [20, 21]], [21, [20]]]);
    assert.deepEqual(blockedIds(battle), [20]);
});

test("a nested release stops the old relation's acquired Hooks without leaving contributions", () => {
    let battle = fixture([holder(), target()]);
    const order = [];
    let acquiredRelation;
    battle = onBlocker(battle, 10, "acquired", hook("release-now", (state, { relation }) => {
        acquiredRelation = relation;
        order.push("blocker acquired");
        return blocking.release(state, blocking.relations(state, { id: 20 }));
    }));
    battle = onBlocker(battle, 10, "acquired", hook("later", state => {
        order.push("later blocker acquired");
        return state;
    }));
    battle = onBlocker(battle, 10, "released", hook("released", (state, { relation }) => {
        order.push("blocker released");
        assert.equal(relation.blocked, acquiredRelation.blocked);
        return state;
    }));
    battle = onBlockable(battle, 20, "released", hook("released", (state, { relation }) => {
        order.push("blockable released");
        assert.equal(relation.blocked, acquiredRelation.blocked);
        return applyUnitChanges(state, [blockableOperations.removeVolumeContribution({ id: 20 }, "relation-volume")]);
    }));
    battle = onBlockable(battle, 20, "acquired", hook("install-contribution", state => {
        order.push("blockable acquired");
        return applyUnitChanges(state, [blockableOperations.setVolumeContribution({ id: 20 }, { id: "relation-volume", value: 1 })]);
    }));
    battle = acquire(battle);
    assert.deepEqual(order, ["blocker acquired", "blocker released", "blockable released"]);
    assert.equal(ownerId(battle), undefined);
    assert.deepEqual(getUnit(battle, 20).blockable.volume, []);
    assert.deepEqual(battle.events.map(({ type }) => type), ["BLOCKING_ACQUIRED", "BLOCKING_RELEASED"]);
});

test("blockable acquired Hooks also stop when their relation is released", () => {
    let battle = fixture([holder(), target()]);
    const calls = [];
    battle = onBlockable(battle, 20, "acquired", hook("release", state => {
        calls.push("blockable acquired");
        return blocking.release(state, blocking.relations(state, { id: 20 }));
    }));
    battle = onBlockable(battle, 20, "acquired", hook("later", state => {
        calls.push("later blockable acquired");
        return state;
    }));
    battle = acquire(battle);
    assert.deepEqual(calls, ["blockable acquired"]);
    assert.equal(ownerId(battle), undefined);
});

test("a same-pair reacquire does not resume the old relation's acquired Hooks", () => {
    let battle = fixture([holder(), target()]);
    const calls = [];
    let previous;
    battle = onBlocker(battle, 10, "acquired", hook("replace", (state, { relation }) => {
        calls.push(["blocker first", relation.blocked]);
        if (previous !== undefined) return state;
        previous = relation;
        return acquire(blocking.release(state, blocking.relations(state, { id: 20 })));
    }));
    battle = onBlocker(battle, 10, "acquired", hook("later", (state, { relation }) => {
        calls.push(["blocker later", relation.blocked]);
        return state;
    }));
    battle = onBlockable(battle, 20, "acquired", hook("observe", (state, { relation }) => {
        calls.push(["blockable", relation.blocked]);
        return state;
    }));
    battle = acquire(battle);
    const current = getUnit(battle, 10).blocker.blocked[0];
    assert.notEqual(current, previous.blocked);
    assert.deepEqual(calls, [
        ["blocker first", previous.blocked],
        ["blocker first", current],
        ["blocker later", current],
        ["blockable", current],
    ]);
    assert.equal(ownerId(battle), 10);
    assert.deepEqual(battle.events.map(({ type }) => type), ["BLOCKING_ACQUIRED", "BLOCKING_RELEASED", "BLOCKING_ACQUIRED"]);
});

for (const key of ["acquired", "released"]) test(`${key} fixes both sides' Hook IDs and reads current replacements and accepts`, () => {
    let battle = fixture([holder(), target()]);
    const calls = [];
    const allows = state => (ownerId(state) === 10) === (key === "acquired");
    battle = onBlocker(battle, 10, key, hook("a", state => {
        calls.push("blocker a");
        state = onBlocker(state, 10, key, hook("b", latest => {
            calls.push("new blocker b");
            return latest;
        }, allows));
        state = onBlocker(state, 10, key, hook("c", latest => {
            calls.push("new blocker c");
            return latest;
        }));
        state = onBlockable(state, 20, key, hook("b", latest => {
            calls.push("new blockable b");
            return latest;
        }, allows));
        return onBlockable(state, 20, key, hook("c", latest => {
            calls.push("new blockable c");
            return latest;
        }));
    }));
    battle = onBlocker(battle, 10, key, hook("b", state => {
        calls.push("old blocker b");
        return state;
    }, () => false));
    battle = onBlockable(battle, 20, key, hook("b", state => {
        calls.push("old blockable b");
        return state;
    }, () => false));
    battle = acquire(battle);
    if (key === "released") battle = blocking.release(battle, blocking.relations(battle, { id: 20 }));
    assert.deepEqual(calls, ["blocker a", "new blocker b", "new blockable b"]);
});

test("old captured Ref entries never release a same-pair relationship reestablished by a Hook", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    let reentered = false;
    battle = onBlocker(battle, 10, "released", hook("replace-relations", (state, { relation }) => {
        if (reentered || relation.blocked.id !== 20) return state;
        reentered = true;
        state = blocking.release(state, blocking.relations(state, { id: 21 }));
        return acquire(state);
    }));
    battle = acquire(battle);
    const old = blocking.relations(battle, { id: 10 });
    assert.equal(old.length, 2);
    battle = blocking.release(battle, old);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    const current = getUnit(battle, 10).blocker.blocked;
    assert.notEqual(current[0], old[0].blocked);
    assert.notEqual(current[1], old[1].blocked);
    assert.equal(blocking.release(battle, old), battle);
});

test("a fresh same-owner Ref in an ordinary update does not notify or rebuild the relationship", () => {
    let battle = fixture([holder(), target()]);
    const calls = [];
    for (const key of ["acquired", "released"]) battle = onBlocker(battle, 10, key, hook(key, state => {
        calls.push(key);
        return state;
    }));
    battle = acquire(battle);
    const previous = getUnit(battle, 10).blocker.blocked;
    const currentUnit7 = getUnit(battle, 20);
    battle = replaceUnit(battle, { ...currentUnit7, blockable: { ...currentUnit7.blockable, blocker: { id: 10 } } });
    assert.equal(getUnit(battle, 10).blocker.blocked, previous);
    assert.deepEqual(calls, ["acquired"]);
});

test("an initially occupied candidate can be acquired after an earlier Hook releases its old owner", () => {
    let battle = fixture([
        holder(10, { capacity: 2 }), holder(11, { position: [3, 1] }),
        target(20), target(21, { position: [2.8, 1] }),
    ]);
    battle = acquire(battle, 11);
    assert.equal(ownerId(battle, 21), 11);
    battle = onBlocker(battle, 10, "acquired", hook("free-later-candidate", (state, { relation }) => (
        relation.blocked.id === 20 ? blocking.release(state, blocking.relations(state, { id: 21 })) : state
    )));
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.deepEqual(blockedIds(battle, 11), []);
});

test("independent Blockers retain only their own relationships when their capacities change", () => {
    let battle = fixture([
        holder(),
        holder(11, { position: [7, 1] }),
        target(20),
        target(30, { position: [7.25, 1] }),
    ]);
    battle = acquire(acquire(battle), 11);
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 30), 11);
    assert.deepEqual(blockedIds(battle, 10), [20]);
    assert.deepEqual(blockedIds(battle, 11), [30]);
    battle = capacity(battle, 10, 0);
    assert.equal(ownerId(battle, 20), undefined);
    assert.equal(ownerId(battle, 30), 11);
    battle = capacity(battle, 10, 1);
    battle = acquire(battle);
    battle = capacity(battle, 11, 0);
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 30), undefined);
    assert.deepEqual(blockedIds(battle, 11), []);
});


test("explicit spatial changes publish the new position before releasing only the captured old relationships", () => {
    let battle = fixture([holder(10, { capacity: 2 }), target(20), target(21)]);
    let reentered = false;
    battle = onBlocker(battle, 10, "released", hook("reestablish-after-position-change", (state, { relation }) => {
        assert.deepEqual(getUnit(state, 10).position, [2.125, 1]);
        if (reentered || relation.blocked.id !== 20) return state;
        reentered = true;
        state = blocking.release(state, blocking.relations(state, { id: 21 }));
        return acquire(state);
    }));
    battle = acquire(battle);
    const old = getUnit(battle, 10).blocker.blocked;
    const previous = battle;
    battle = presence.appear(battle, { id: 10 }, [2.125, 1]);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.notEqual(getUnit(battle, 10).blocker.blocked[0], old[0]);
    assert.notEqual(getUnit(battle, 10).blocker.blocked[1], old[1]);
    assert.deepEqual(getUnit(previous, 10).position, [2, 1]);
});
