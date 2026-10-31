import assert from "node:assert/strict";
import { test } from "node:test";
import { replace, update } from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as blockable from "../../dist/core/unit/capability/blocking/blockable-operations.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import { getUnit } from "../helpers/unit.js";
import { fixture, holder, target, hook, blockedIds, ownerId } from "../helpers/blocking.js";

function plan(battle, id, to, startTick = battle.tick) {
    const self = getUnit(battle, id);
    return replace(battle, [{
        ...self,
        blockable: {
            ...self.blockable,
            adjustment: { from: self.position, to, startTick },
        },
    }]);
}

test("stable blocking position uses the planned endpoint only while the relation exists", () => {
    const self = target();
    const endpoint = [3, 1];
    const adjusted = {
        ...self,
        blockable: { ...self.blockable, adjustment: { from: self.position, to: endpoint, startTick: 0 } },
    };
    assert.equal(capability.stableBlockPosition(self), self.position);
    assert.equal(capability.stableBlockPosition(adjusted), self.position);
    const blocked = { ...adjusted, blockable: { ...adjusted.blockable, blocker: { id: 10 } } };
    assert.equal(capability.stableBlockPosition(blocked), endpoint);
    assert.equal(capability.stableBlockPosition({ ...blocked, blockable: { ...blocked.blockable, adjustment: null } }), self.position);
});

test("position adjustment writes the linear midpoint, clears at 0.2 seconds, and retains old snapshots", () => {
    const endpoint = [2, 2];
    const initial = plan({ ...fixture([target(20, { position: [1, 1] })]), tick: 10 }, 20, endpoint);
    const original = getUnit(initial, 20);
    assert.equal(blockable.advancePosition(initial, { id: 20 }), initial);

    const halfway = blockable.advancePosition({ ...initial, tick: 13 }, { id: 20 });
    assert.deepEqual(getUnit(halfway, 20).position, [1.5, 1.5]);
    assert.equal(getUnit(halfway, 20).blockable.adjustment, original.blockable.adjustment);
    assert.deepEqual(capability.stableBlockPosition(getUnit(halfway, 20)), [1.5, 1.5]);

    const completed = capability.advancePosition({ ...halfway, tick: 16 }, { id: 20 });
    assert.equal(getUnit(completed, 20).position, endpoint);
    assert.equal(getUnit(completed, 20).blockable.adjustment, null);
    assert.equal(blockable.advancePosition(completed, { id: 20 }), completed);
    assert.deepEqual(original.position, [1, 1]);
    assert.equal(original.blockable.adjustment.to, endpoint);
});

test("relationship release preserves and continues the remaining position adjustment", () => {
    let battle = fixture([holder(), target()]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = plan(battle, 20, [2.5, 1]);
    const adjustment = getUnit(battle, 20).blockable.adjustment;

    battle = blocking.release(battle, { id: 10 });
    assert.equal(ownerId(battle), undefined);
    assert.equal(getUnit(battle, 20).blockable.adjustment, adjustment);
    battle = blockable.advancePosition({ ...battle, tick: 3 }, { id: 20 });
    assert.deepEqual(getUnit(battle, 20).position, [2.375, 1]);
    assert.equal(getUnit(battle, 20).blockable.adjustment, adjustment);
});

test("Blockable release publishes cancellation and incoming relationship cleanup before notification", () => {
    const both = target(20, {
        definition: { blocker: { capacity: 1, radius: 1, layer: "GROUND", rules: [] } },
    });
    let battle = fixture([holder(), both, target(30, { position: [2.6, 1] })]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = blocking.acquire(battle, { id: 20 }, { id: 30 });
    battle = plan(battle, 20, [2.5, 1]);
    let notifications = 0;
    battle = update(battle, [capability.setBlockableHook({ id: 20 }, "released", hook("inspect", state => {
        notifications++;
        assert.equal(getUnit(state, 20).blockable.adjustment, null);
        assert.equal(ownerId(state, 20), undefined);
        assert.deepEqual(blockedIds(state, 10), []);
        assert.equal(ownerId(state, 30), 20);
        return state;
    }))]);
    const previous = getUnit(battle, 20);

    battle = capability.releaseBlockable(battle, { id: 20 });
    assert.equal(notifications, 1);
    assert.equal(getUnit(battle, 20).position, previous.position);
    assert.equal(getUnit(battle, 20).blockable.adjustment, null);
    assert.deepEqual(blockedIds(battle, 20), [30]);
    assert.notEqual(previous.blockable.adjustment, null);
    assert.equal(blockable.release(battle, { id: 20 }), battle);
});

test("orphan position adjustment can be cancelled without movement or relation notifications", () => {
    let battle = plan(fixture([target()]), 20, [2.5, 1]);
    const position = getUnit(battle, 20).position;
    battle = blockable.release(battle, { id: 20 });
    assert.equal(getUnit(battle, 20).position, position);
    assert.equal(getUnit(battle, 20).blockable.adjustment, null);
    assert.deepEqual(battle.events, []);
});

test("position adjustment ignores autonomous movement Rules and preserves Locomotion velocity", () => {
    const self = target(20, { definition: { locomotion: {
        speed: 1, minSpeed: 0, halfBodyWidth: 0,
        steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 },
    } }, states: { locomotion: { velocity: [0.1, 0], speed: [], rules: [{ id: "cannot-move", allows: () => false }] } } });
    const initial = plan(fixture([self]), 20, [2.5, 1]);
    const advanced = blockable.advancePosition({ ...initial, tick: 3 }, { id: 20 });
    assert.deepEqual(getUnit(advanced, 20).position, [2.375, 1]);
    assert.equal(getUnit(advanced, 20).locomotion, self.locomotion);
});

test("position updates complete their blocking consequences using the published position", () => {
    let battle = fixture([holder(), target()]);
    battle = blocking.acquire(battle, { id: 10 }, { id: 20 });
    battle = plan(battle, 20, [2.5, 1]);
    let observed;
    battle = update(battle, [
        capability.setBlockableRule({ id: 20 }, {
            id: "position-bound", allows: (_state, _owner, unit) => unit.position[0] < 2.4,
        }),
        capability.setBlockableHook({ id: 20 }, "released", hook("position", state => {
            observed = getUnit(state, 20).position;
            return state;
        })),
    ]);
    const adjustment = getUnit(battle, 20).blockable.adjustment;

    battle = blockable.advancePosition({ ...battle, tick: 4 }, { id: 20 });
    assert.equal(ownerId(battle), undefined);
    assert.equal(observed, getUnit(battle, 20).position);
    assert.ok(observed[0] > 2.4);
    assert.equal(getUnit(battle, 20).blockable.adjustment, adjustment);
});
