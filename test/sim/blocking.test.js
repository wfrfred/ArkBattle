import { compose } from "../../dist/core/unit/index.js";
import { Hooks } from "../../dist/core/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as units from "../../dist/core/unit/query.js";
import * as unit from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import * as layer from "../../dist/core/unit/capability/layer/index.js";
import * as tiles from "../../dist/core/battle/tile.js";
import * as maps from "../../dist/core/battlefield/map/map.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { advanceMovement } from "../../dist/core/battle/steps/movement.js";
import { Vec2 } from "../../dist/core/common/vector.js";

const blocker = {
    id: "guard",
    hooks: Hooks.empty(),
    blocker: { capacity: 3, layer: "GROUND", rules: [] },
};
const enemy = {
    id: "enemy",
    presence: {},
    hooks: Hooks.empty(),
    blockable: { volume: 1, rules: [] },
    layer: { type: "GROUND" },
    allegiance: { side: "ENEMY" },
};

test("search and maintenance use current pair rules, volume, layers and ground tile eligibility", () => {
    let state = battle([
        {
            definition: {
                ...blocker,
                blocker: { capacity: 2, layer: "GROUND", rules: [capability.sides("ENEMY")] },
            },
            position: [2, 1],
        },
        { definition: { ...enemy, allegiance: { side: "ALLY" } }, position: [2.1, 1] },
        { definition: { ...enemy, layer: { type: "AIR" } }, position: [2.15, 1] },
        { definition: { ...enemy, blockable: { volume: 2, rules: [] } }, position: [2.2, 1] },
        {
            definition: {
                ...enemy,
                blockable: {
                    volume: 1,
                    rules: [{ id: "cannot-be-held", allows: () => false }],
                },
            },
            position: [2.3, 1],
        },
    ]);
    const owner = units.ref(get(state, 0));
    state = blocking.search(state, owner);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [3],
    );
    assert.equal(blocking.usedCapacity(state, owner), 2);
    state = unit.update(state, units.ref(get(state, 3)), capability.setVolumeContribution({
        id: "larger-target", value: 1,
    }));
    state = blocking.search(state, owner);
    assert.deepEqual(blocking.blocked(state, owner), []);
    state = unit.update(
        state,
        units.ref(get(state, 4)),
        capability.removeBlockableRule("cannot-be-held"),
    );
    state = blocking.search(state, owner);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [4],
    );

    const tile = maps.get(state.battlefield.map, [1, 2]);
    state = tiles.update(state, [1, 2], { ...tile.state, allowsBlocking: false });
    state = blocking.search(state, owner);
    assert.deepEqual(blocking.blocked(state, owner), []);
    state = unit.update(state, owner, capability.setLayer("AIR"));
    state = blocking.search(state, owner);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [2],
    );
    state = unit.update(state, units.ref(get(state, 2)), capability.setBlockableRule({
        id: "first-tick-only", allows: (current) => current.tick === 0,
    }));
    state = blocking.advance({ ...state, tick: 1 });
    assert.deepEqual(blocking.blocked(state, owner), []);
});

test("capacity shrink releases the newest relation and observes callback changes before continuing", () => {
    let state = battle([
        { definition: blocker, position: [2, 1] },
        ...[0.1, 0.2, 0.3].map((offset) => ({ definition: enemy, position: [2 + offset, 1] })),
    ]);
    const owner = units.ref(get(state, 0));
    for (const id of [1, 2, 3]) {
        state = blocking.acquire(state, owner, units.ref(get(state, id)));
    }
    const released = [];
    state = unit.update(state, owner, compose(capability.setBlockerHook("released", {
            id: "restore-one-slot",
            invoke: (current, { relation }) => {
                released.push(relation.blocked.id);
                assert.equal(blocking.usedCapacity(current, owner), 2);
                assert.equal(
                    capability.resolveCapacity(
                        get(current, 0).definition.blocker,
                        get(current, 0).blocker,
                    ),
                    1,
                );
                return {
                    state: unit.update(current, owner, capability.setCapacityContribution({
                            id: "capacity-change",
                            value: [{ type: "ADD", value: -1 }],
                        })),
                    value: undefined,
                };
            },
        }), capability.setCapacityContribution({
            id: "capacity-change",
            value: [{ type: "ADD", value: -2 }],
        })));
    assert.deepEqual(released, [3]);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
    state = unit.update(state, owner, compose(
        capability.removeBlockerHook("released", "restore-one-slot"),
        capability.setCapacityContribution({ id: "capacity-change", value: [{ type: "ZERO" }] }),
    ));
    assert.deepEqual(blocking.blocked(state, owner), []);
    assert.equal(capability.resolveCapacity(get(state, 0).definition.blocker, get(state, 0).blocker), 0);
});

test("layer settlements release current relations acquired by earlier settlements", () => {
    for (const [change, targetLayer] of [
        [layer.setType("GROUND"), "GROUND"],
        [capability.setLayer("AIR"), "AIR"],
    ]) {
        let state = battle([
            { definition: {
                ...blocker,
                blocker: { ...blocker.blocker, radius: 1 },
                layer: { type: "GROUND" },
            }, position: [2, 1] },
            { definition: { ...enemy, allegiance: { side: "NEUTRAL" } }, position: [2.1, 1] },
            { definition: { ...enemy, layer: { type: targetLayer } }, position: [2.2, 1] },
        ]);
        const owner = units.ref(get(state, 0));
        const first = units.ref(get(state, 1));
        const next = units.ref(get(state, 2));
        state = blocking.acquire(state, owner, first);
        const released = [];
        state = unit.update(state, owner, capability.setBlockerHook("released", {
            id: "acquire-next",
            invoke(current, { relation }) {
                released.push(relation.blocked.id);
                return {
                    state: relation.blocked.id === first.id
                        ? blocking.acquire(current, owner, next)
                        : current,
                    value: undefined,
                };
            },
        }));

        state = unit.update(state, owner, compose(
            capability.setBlockerRule(capability.sides("ENEMY")),
            change,
        ));

        assert.deepEqual(released, [first.id, next.id]);
        assert.deepEqual(blocking.blocked(state, owner), []);
        assert.equal(blocking.blockerOf(state, next), undefined);
    }
});

test("own layer requests release current relations before hooks, including same-value requests", () => {
    let state = battle([
        { definition: { ...blocker, layer: { type: "GROUND" } }, position: [2, 1] },
        { definition: enemy, position: [2.1, 1] },
        { definition: enemy, position: [2.2, 1] },
    ]);
    const owner = units.ref(get(state, 0));
    const targets = [1, 2].map((id) => units.ref(get(state, id)));
    for (const target of targets) state = blocking.acquire(state, owner, target);
    const original = blocking.relations(state, owner);
    assert.equal(original[0], get(state, 0).blocker.relations[0]);
    assert.equal(get(state, original[0].blocked.id).blockable.relation, original[0]);
    assert.equal(blocking.relations(state, original[0].blocked)[0], original[0]);
    let notifications = 0;
    state = unit.update(state, owner, capability.setBlockerHook("released", {
            id: "reacquire",
            invoke: (current, { relation }) => {
                notifications++;
                if (notifications <= original.length) {
                    assert.equal(relation, original[notifications - 1]);
                }
                if (notifications === 1) {
                    assert.equal(get(current, 0).layer.type, "AIR");
                    assert.equal(get(current, 0).blocker.layer, "GROUND");
                    assert.deepEqual(blocking.blocked(current, owner), []);
                    assert.ok(
                        targets.every(
                            (target) => blocking.blockerOf(current, target) === undefined,
                        ),
                    );
                    for (const target of targets)
                        current = blocking.acquire(current, owner, target);
                }
                return { state: current, value: undefined };
            },
        }));
    state = unit.update(state, owner, layer.setType("AIR"));
    assert.equal(notifications, 2);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
    assert.notEqual(blocking.relations(state, owner)[0], original[0]);
    state = blocking.release(state, original);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
    assert.equal(notifications, 2);

    state = unit.update(state, owner, layer.setType("AIR"));
    assert.equal(notifications, 4);
    assert.deepEqual(blocking.blocked(state, owner), []);
    state = blocking.search(state, owner);

    let removedNotifications = 0;
    state = unit.update(state, owner, capability.setBlockerHook("released", {
            id: "reacquire",
            invoke: (current) => {
                removedNotifications++;
                assert.equal(get(current, owner.id).lifecycle, "LEAVING");
                assert.deepEqual(blocking.blocked(current, owner), []);
                assert.ok(
                    targets.every((target) => blocking.blockerOf(current, target) === undefined),
                );
                return { state: current, value: undefined };
            },
        }));
    state = unit.remove(state, owner, "SCRIPT");
    assert.equal(removedNotifications, 2);
    assert.ok(targets.every((target) => blocking.blockerOf(state, target) === undefined));
});

test("position plans survive relation release while active departure and spatial overrides cancel them", () => {
    let state = battle([
        { definition: { ...blocker, presence: {} }, position: [2, 1] },
        { definition: enemy, position: [2.2, 1] },
        { definition: enemy, position: [2.3, 1] },
    ]);
    const owner = units.ref(get(state, 0));
    const target = units.ref(get(state, 1));
    state = blocking.acquire(state, owner, target);
    assert.deepEqual(get(state, 1).blockable.adjustment.to, [2.5, 1]);

    const departing = units.ref(get(state, 2));
    state = blocking.acquire(state, owner, departing);
    const separated = get(state, 2).blockable.adjustment.to;
    assert.deepEqual(get(state, 1).position, [2.2, 1]);
    assert.deepEqual(get(state, 2).position, [2.3, 1]);
    assert.notDeepEqual(separated, get(state, 1).blockable.adjustment.to);
    assert.ok(Math.abs(Vec2.distanceSquared(separated, get(state, 0).position) - 0.25) < 1e-12);
    state = unit.update(state, departing, layer.setType("AIR"));
    assert.equal(blocking.blockerOf(state, departing), undefined);
    assert.equal(get(state, 2).blockable.adjustment, null);

    state = advanceMovement({ ...state, tick: 3 }, { routeMoveMultiplier: 1 });
    assert.ok(Math.abs(get(state, 1).position[0] - 2.35) < 1e-12);
    state = blocking.release(state, blocking.relations(state, target));
    assert.notEqual(get(state, 1).blockable.adjustment, null);
    state = advanceMovement({ ...state, tick: 6 }, { routeMoveMultiplier: 1 });
    assert.deepEqual(get(state, 1).position, [2.5, 1]);
    assert.equal(get(state, 1).blockable.adjustment, null);

    state = unit.update(state, departing, layer.setType("GROUND"));
    state = blocking.acquire(state, owner, departing);
    assert.notEqual(get(state, 2).blockable.adjustment, null);
    const independentPlan = get(state, 2).blockable.adjustment;
    state = unit.update(state, owner, presence.disappear());
    assert.equal(blocking.blockerOf(state, departing), undefined);
    assert.deepEqual(get(state, 2).blockable.adjustment, independentPlan);
    state = advanceMovement({ ...state, tick: 9 }, { routeMoveMultiplier: 1 });
    assert.notDeepEqual(get(state, 2).position, independentPlan.from);
    state = unit.update(state, departing, presence.disappear());
    assert.equal(get(state, 2).blockable.adjustment, null);
    state = unit.update(state, owner, presence.appear([2, 1]));
    state = unit.update(state, departing, presence.appear([2.3, 1]));
    state = blocking.acquire(state, owner, departing);
    let observed = false;
    state = unit.update(state, departing, capability.setBlockableHook("released", {
            id: "observe-space-override",
            invoke(current) {
                observed = true;
                assert.deepEqual(get(current, 2).position, [5, 1]);
                assert.equal(get(current, 2).presence.present, true);
                assert.equal(get(current, 2).blockable.adjustment, null);
                assert.equal(blocking.blockerOf(current, departing), undefined);
                assert.deepEqual(blocking.blocked(current, owner), []);
                return { state: current, value: undefined };
            },
        }));
    state = unit.update(state, departing, presence.appear([5, 1]));
    assert.equal(observed, true);
});
