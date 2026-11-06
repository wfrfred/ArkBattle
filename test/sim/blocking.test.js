import { combine } from "../../dist/core/unit/index.js";
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
    spatialPresence: {},
    hooks: Hooks.empty(),
    blockable: { volume: 1 },
    layer: { type: "GROUND" },
    allegiance: { side: "ENEMY" },
};

test("search applies pair rules, current volume, target layer and ground tile eligibility", () => {
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
        { definition: { ...enemy, blockable: { volume: 2 } }, position: [2.2, 1] },
        { definition: enemy, position: [2.3, 1] },
    ]);
    const owner = units.ref(get(state, 0));
    assert.equal(get(state, 0).blocker.radius, 0.7071);

    state = blocking.search(state, owner);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [3],
    );
    assert.equal(blocking.usedCapacity(state, owner), 2);
    state = unit.update(state,
        capability.setBlockableRule(units.ref(get(state, 3)), {
            id: "cannot-be-held",
            allows: () => false,
        })
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
    state = unit.update(state, capability.setLayer(owner, "AIR"));
    state = blocking.search(state, owner);
    assert.equal(get(state, 0).blocker.radius, 0.8944);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [2],
    );
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
    state = unit.update(state, combine([
        capability.setBlockerHook(owner, "released", {
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
                    state: unit.update(current,
                        capability.setCapacityContribution(owner, {
                            id: "capacity-change",
                            value: [{ type: "ADD", value: -1 }],
                        })
                    ),
                    value: undefined,
                };
            },
        }),
        capability.setCapacityContribution(owner, {
            id: "capacity-change",
            value: [{ type: "ADD", value: -2 }],
        }),
    ]));
    assert.deepEqual(released, [3]);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
});

test("own layer requests release old relations before hooks, including same-value requests", () => {
    let state = battle([
        { definition: { ...blocker, layer: { type: "GROUND" } }, position: [2, 1] },
        { definition: enemy, position: [2.1, 1] },
        { definition: enemy, position: [2.2, 1] },
    ]);
    const owner = units.ref(get(state, 0));
    const targets = [1, 2].map((id) => units.ref(get(state, id)));
    for (const target of targets) state = blocking.acquire(state, owner, target);
    const original = blocking.relations(state, owner);
    let notifications = 0;
    state = unit.update(state,
        capability.setBlockerHook(owner, "released", {
            id: "reacquire",
            invoke: (current) => {
                notifications++;
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
        })
    );
    state = unit.update(state, layer.setType(owner, "AIR"));
    assert.equal(notifications, 2);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
    assert.notEqual(blocking.relations(state, owner)[0].blocked, original[0].blocked);
    state = blocking.release(state, original);
    assert.deepEqual(
        blocking.blocked(state, owner).map(({ id }) => id),
        [1, 2],
    );
    assert.equal(notifications, 2);

    state = unit.update(state, layer.setType(owner, "AIR"));
    assert.equal(notifications, 4);
    assert.deepEqual(blocking.blocked(state, owner), []);
    state = blocking.search(state, owner);

    let removedNotifications = 0;
    state = unit.update(state,
        capability.setBlockerHook(owner, "released", {
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
        })
    );
    state = unit.remove(state, owner.id, "RETREAT");
    assert.equal(removedNotifications, 2);
    assert.ok(targets.every((target) => blocking.blockerOf(state, target) === undefined));
});

test("position plans survive relation release while active departure and spatial overrides cancel them", () => {
    let state = battle([
        { definition: { ...blocker, spatialPresence: {} }, position: [2, 1] },
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
    assert.ok(separated[1] < 1);
    assert.ok(Math.abs(Vec2.distanceSquared(separated, get(state, 0).position) - 0.25) < 1e-12);
    state = unit.update(state, layer.setType(departing, "AIR"));
    assert.equal(blocking.blockerOf(state, departing), undefined);
    assert.equal(get(state, 2).blockable.adjustment, null);

    state = advanceMovement({ ...state, tick: 3 }, { routeMoveMultiplier: 1 });
    assert.ok(Math.abs(get(state, 1).position[0] - 2.35) < 1e-12);
    state = blocking.release(state, blocking.relations(state, target));
    assert.notEqual(get(state, 1).blockable.adjustment, null);
    state = advanceMovement({ ...state, tick: 6 }, { routeMoveMultiplier: 1 });
    assert.deepEqual(get(state, 1).position, [2.5, 1]);
    assert.equal(get(state, 1).blockable.adjustment, null);

    state = unit.update(state, layer.setType(departing, "GROUND"));
    state = blocking.acquire(state, owner, departing);
    assert.notEqual(get(state, 2).blockable.adjustment, null);
    const independentPlan = get(state, 2).blockable.adjustment;
    state = unit.update(state, presence.disappear(owner));
    assert.equal(blocking.blockerOf(state, departing), undefined);
    assert.equal(get(state, 2).blockable.adjustment, independentPlan);
    state = advanceMovement({ ...state, tick: 9 }, { routeMoveMultiplier: 1 });
    assert.notDeepEqual(get(state, 2).position, independentPlan.from);
    state = unit.update(state, presence.disappear(departing));
    assert.equal(get(state, 2).blockable.adjustment, null);
    state = unit.update(state, combine([presence.appear(owner, [2, 1]), presence.appear(departing, [2.3, 1])]));
    state = blocking.acquire(state, owner, departing);
    let observed = false;
    state = unit.update(state,
        capability.setBlockableHook(departing, "released", {
            id: "observe-space-override",
            invoke(current) {
                observed = true;
                assert.deepEqual(get(current, 2).position, [5, 1]);
                assert.equal(get(current, 2).spatialPresence.present, true);
                assert.equal(get(current, 2).blockable.adjustment, null);
                assert.equal(blocking.blockerOf(current, departing), undefined);
                assert.deepEqual(blocking.blocked(current, owner), []);
                return { state: current, value: undefined };
            },
        })
    );
    state = unit.update(state, presence.appear(departing, [5, 1]));
    assert.equal(observed, true);
    assert.deepEqual(get(state, 2).position, [5, 1]);
    assert.equal(get(state, 2).blockable.adjustment, null);
});
