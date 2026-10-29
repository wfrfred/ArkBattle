import assert from "node:assert/strict";
import { test } from "node:test";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import { getUnit, initialize, replaceUnit } from "../helpers/unit.js";
import { changeTile } from "../helpers/tiles.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";

function standardHolder(layer = "GROUND", capacity = 2) {
    return holder(10, {
        definition: {
            layer: { type: "GROUND" },
            blocker: { layer, capacity, rules: [capability.sides("ENEMY")] },
        },
    });
}

function onReleased(battle, id, capabilityName, entry) {
    const unit = getUnit(battle, id);
    const setHook = capabilityName === "blocker"
        ? capability.setBlockerHook
        : capability.setBlockableHook;
    return replaceUnit(battle, {
        ...unit,
        [capabilityName]: setHook(unit[capabilityName], "released", entry),
    });
}

for (const [layer, radius] of [["GROUND", 0.7071], ["AIR", 0.8944]]) {
    test(`${layer} blocking initializes with the Core standard radius`, () => {
        const unit = standardHolder(layer);
        assert.equal(unit.blocker.layer, layer);
        assert.equal(unit.blocker.geometry.radius, radius);
        assert.equal(unit.definition.blocker.geometry, undefined);
        assert.equal(unit.layer.type, "GROUND", "blocking layer is independent of the unit's own layer");
    });
}

test("switching blocking layer replaces the standard radius and preserves Definition and own layer", () => {
    let battle = fixture([standardHolder()]);
    const definition = getUnit(battle, 10).definition;
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.equal(getUnit(battle, 10).blocker.layer, "AIR");
    assert.equal(getUnit(battle, 10).blocker.geometry.radius, 0.8944);
    assert.equal(getUnit(battle, 10).layer.type, "GROUND");
    assert.equal(getUnit(battle, 10).definition, definition);
    assert.equal(definition.blocker.layer, "GROUND");
    battle = blocking.setLayer(battle, { id: 10 }, "GROUND");
    assert.equal(getUnit(battle, 10).blocker.geometry.radius, 0.7071);
});

test("an explicit geometry is retained by initialization and both layer transitions", () => {
    const unit = holder(10, { radius: 0.4472 });
    const geometry = unit.definition.blocker.geometry;
    assert.equal(unit.blocker.geometry, geometry);
    let battle = fixture([unit]);
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.equal(getUnit(battle, 10).blocker.geometry, geometry);
    battle = blocking.setLayer(battle, { id: 10 }, "GROUND");
    assert.equal(getUnit(battle, 10).blocker.geometry, geometry);
});

for (const [layer, expected] of [["GROUND", [20]], ["AIR", [21]]]) {
    test(`${layer} blocking acquires only matching targets and still applies side rules`, () => {
        let battle = fixture([
            standardHolder(layer, 3),
            target(20),
            target(21, { layer: "AIR", position: [2.1, 1] }),
            target(22, { layer, side: "ALLY", position: [2.05, 1] }),
        ]);
        battle = acquire(battle);
        assert.deepEqual(blockedIds(battle), expected);
        assert.equal(ownerId(battle, 22), undefined);
    });
}

test("search uses the larger AIR standard radius without inheriting it after landing", () => {
    let battle = fixture([
        standardHolder(),
        target(20, { position: [2.8, 1] }),
        target(21, { layer: "AIR", position: [2.8, 1] }),
    ]);
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [21]);
    battle = blocking.setLayer(battle, { id: 10 }, "GROUND");
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
});

test("AIR search bypasses ground tile permission while GROUND search requires it", () => {
    let battle = fixture([standardHolder(), target(), target(21, { layer: "AIR" })]);
    battle = changeTile(battle, [1, 2], { allowsBlocking: false });
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), []);
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.deepEqual(blockedIds(battle), [], "switching layer does not perform a search");
    battle = acquire(battle);
    assert.deepEqual(blockedIds(battle), [21]);
});

test("an AIR relation survives a change to ground tile blocking permission", () => {
    let battle = acquire(fixture([standardHolder("AIR"), target(20, { layer: "AIR" })]));
    assert.equal(ownerId(battle), 10);
    battle = changeTile(battle, [1, 2], { allowsBlocking: false });
    assert.equal(ownerId(battle), 10);
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_RELEASED").length, 0);
});

for (const layer of ["GROUND", "AIR"]) {
    test(`${layer} blocking requires the target to have an explicit layer`, () => {
        const candidate = initialize({
            id: 20,
            position: [2.25, 1],
            definition: {
                id: "blockable-without-layer",
                allegiance: { side: "ENEMY" },
                spatialPresence: {},
                blockable: { volume: 1 },
            },
        });
        const battle = acquire(fixture([standardHolder(layer), candidate]));
        assert.deepEqual(blockedIds(battle), []);
        assert.equal(ownerId(battle), undefined);
    });
}

test("setting the current layer is a no-op and retains existing relations", () => {
    const battle = acquire(fixture([standardHolder(), target()]));
    assert.deepEqual(blockedIds(battle), [20]);
    assert.equal(blocking.setLayer(battle, { id: 10 }, "GROUND"), battle);
});

test("a missing Blocker makes layer switching a no-op", () => {
    const battle = fixture();
    assert.equal(blocking.setLayer(battle, { id: 10 }, "AIR"), battle);
});

test("switching a Blocker preserves its independent ownership as a Blockable", () => {
    const original = standardHolder();
    const both = initialize({
        id: original.id,
        position: original.position,
        definition: { ...original.definition, blockable: { volume: 1 } },
    });
    let battle = fixture([
        holder(11, { definition: {
            blocker: {
                capacity: 1, layer: "GROUND", geometry: { radius: 1 },
                rules: [capability.sides("ALLY")],
            },
        } }),
        both,
        target(),
    ]);
    battle = acquire(acquire(battle, 11));
    assert.equal(ownerId(battle, 10), 11);
    assert.equal(ownerId(battle, 20), 10);
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.equal(ownerId(battle, 10), 11);
    assert.deepEqual(blockedIds(battle, 11), [10]);
    assert.equal(ownerId(battle, 20), undefined);
    assert.deepEqual(blockedIds(battle), []);
});

test("layer switching publishes all old releases and the new geometry before ordered notifications", () => {
    let battle = fixture([
        standardHolder(), target(20), target(21), target(22, { layer: "AIR" }),
    ]);
    const observed = [];
    battle = onReleased(battle, 10, "blocker", hook("inspect-switch", (state, { relation }) => {
        const current = getUnit(state, 10);
        assert.equal(current.blocker.layer, "AIR");
        assert.equal(current.blocker.geometry.radius, 0.8944);
        assert.equal(current.layer.type, "GROUND");
        assert.deepEqual(blockedIds(state), []);
        assert.equal(ownerId(state, 20), undefined);
        assert.equal(ownerId(state, 21), undefined);
        observed.push(["blocker", relation.blocked.id]);
        return state;
    }));
    for (const id of [20, 21]) {
        battle = onReleased(battle, id, "blockable", hook("inspect-owner", (state, { relation }) => {
            observed.push(["blockable", relation.blocked.id]);
            return state;
        }));
    }
    battle = acquire(battle);
    const definition = getUnit(battle, 10).definition;
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.deepEqual(observed, [
        ["blocker", 20], ["blockable", 20], ["blocker", 21], ["blockable", 21],
    ]);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(battle, 22), undefined, "AIR targets wait for an explicit or scheduled search");
    assert.equal(getUnit(battle, 10).definition, definition);
    assert.deepEqual(
        battle.events.filter(event => event.type === "BLOCKING_RELEASED").map(event => event.blockedUnitId),
        [20, 21],
    );
});

test("a switch during an acquired Hook stops the stale acquisition notification", () => {
    let battle = fixture([standardHolder(), target()]);
    const observed = [];
    let unit = getUnit(battle, 10);
    battle = replaceUnit(battle, {
        ...unit,
        blocker: capability.setBlockerHook(unit.blocker, "acquired", hook("switch", state => {
            observed.push("blocker acquired");
            return blocking.setLayer(state, { id: 10 }, "AIR");
        })),
    });
    unit = getUnit(battle, 20);
    battle = replaceUnit(battle, {
        ...unit,
        blockable: capability.setBlockableHook(unit.blockable, "acquired", hook("stale", state => {
            observed.push("blockable acquired");
            return state;
        })),
    });
    battle = onReleased(battle, 20, "blockable", hook("release", state => {
        observed.push("blockable released");
        return state;
    }));
    battle = acquire(battle);
    assert.deepEqual(observed, ["blocker acquired", "blockable released"]);
    assert.equal(getUnit(battle, 10).blocker.layer, "AIR");
    assert.deepEqual(blockedIds(battle), []);
});

test("nested switches and searches retain their latest layer and rebuilt relation identities", () => {
    let battle = fixture([standardHolder(), target(20), target(21)]);
    const released = [];
    let rebuilt;
    battle = onReleased(battle, 10, "blocker", hook("rebuild", (state, { relation }) => {
        released.push(relation.blocked.id);
        if (relation.blocked.id !== 20) return state;
        state = blocking.setLayer(state, { id: 10 }, "GROUND");
        state = acquire(state);
        rebuilt = getUnit(state, 10).blocker.blocked;
        assert.deepEqual(blockedIds(state), [20, 21]);
        return state;
    }));
    battle = acquire(battle);
    const original = getUnit(battle, 10).blocker.blocked;
    battle = blocking.setLayer(battle, { id: 10 }, "AIR");
    assert.deepEqual(released, [20, 21]);
    assert.equal(getUnit(battle, 10).blocker.layer, "GROUND");
    assert.equal(getUnit(battle, 10).blocker.geometry.radius, 0.7071);
    assert.equal(getUnit(battle, 10).blocker.blocked, rebuilt);
    assert.deepEqual(blockedIds(battle), [20, 21]);
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 21), 10);
    assert.notEqual(rebuilt[0], original[0]);
    assert.notEqual(rebuilt[1], original[1]);
});
