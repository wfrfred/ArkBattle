import assert from "node:assert/strict";
import { test } from "node:test";
import { update } from "../../dist/core/battle/unit.js";
import * as blocking from "../../dist/core/battle/blocking/index.js";
import * as capability from "../../dist/core/unit/capability/blocking/index.js";
import { getUnit } from "../helpers/unit.js";

import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";


test("the Blocking phase rechecks time-dependent Rules before searching new relationships", () => {
    let battle = fixture([holder(10), holder(11), target()]);
    battle = update(battle, [capability.setBlockerRule({ id: 10 }, {
        id: "before-tick-five", allows: state => state.tick < 5,
    })]);
    battle = acquire(battle);
    battle = { ...battle, tick: 5, events: [] };
    assert.equal(ownerId(battle), 10);

    battle = blocking.advance(battle);

    assert.equal(ownerId(battle), 11);
    assert.deepEqual(battle.events.map(({ type, blockerUnitId }) => [type, blockerUnitId]), [
        ["BLOCKING_RELEASED", 10], ["BLOCKING_ACQUIRED", 11],
    ]);
});


test("capacity Settlement trims the tail without taking over a later Rule Settlement", () => {
    let battle = acquire(fixture([holder(10, { capacity: 3 }), target(20), target(21), target(22)]));
    const observed = [];
    battle = update(battle, [capability.setBlockerHook({ id: 10 }, "released", hook("settlement-order", (state, { relation }) => {
        observed.push([relation.blocked.id, blockedIds(state)]);
        assert.equal(getUnit(state, 20).blockable.rules[0].id, "first-disabled");
        return state;
    }))]);

    battle = update(battle, [
        capability.setCapacityContribution({ id: 10 }, {
            id: "capacity-two", value: [{ type: "ADD", value: -1 }],
        }),
        capability.setBlockableRule({ id: 20 }, { id: "first-disabled", allows: () => false }),
    ]);

    assert.deepEqual(observed, [
        [22, [20, 21]], [20, [21]],
    ]);
    assert.deepEqual(blockedIds(battle), [21]);
});
