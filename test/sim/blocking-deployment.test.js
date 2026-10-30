import { createChange } from "../../dist/core/unit/change.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { acquire, blockedIds, fixture, holder, hook, ownerId, target } from "../helpers/blocking.js";
import { getUnit, replaceUnit } from "../helpers/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import { search } from "../../dist/core/battle/blocking/operations.js";
import { setHook } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { createDefinition } from "../helpers/deployable.js";

test("retreat refunds use current deployment state after blocking release hooks", () => {
    const blocker = holder(10, {
        definition: {
            deployable: createDefinition({
                cost: 20,
                redeployTicks: 0,
                slots: 1,
                buildableType: "ALL",
            }),
        },
    });
    let battle = fixture([blocker, target()]);
    const currentUnit = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [createChange({ id: currentUnit.id }, unit => ({ ...unit, deployable: { ...currentUnit.deployable, refundAllowed: true } })), setHook({ id: currentUnit.id }, "released", hook("disable-refund", current => {
            const currentUnit2 = getUnit(current, 10);
            return replaceUnit(current, {
                ...currentUnit2,
                deployable: { ...currentUnit2.deployable, refundAllowed: false },
            });
        }))]);
    battle = acquire(battle);
    const before = battle;
    battle = remove(battle, 10, "RETREAT");

    assert.equal(battle.deployment.dp, before.deployment.dp);
    assert.equal(battle.removedUnits.find(({ unitId }) => unitId === 10).unit.deployable.refundAllowed, false);
    assert.equal(getUnit(before, 10).deployable.refundAllowed, true);
    assert.equal(ownerId(battle), undefined);
});

test("release hooks cannot reacquire a leaving target or restart its departure", () => {
    let calls = 0;
    let battle = fixture([holder(), target()]);
    const currentUnit3 = getUnit(battle, 10);
    battle = applyUnitChanges(battle, [setHook({ id: currentUnit3.id }, "released", hook("search-during-leave", current => {
            calls++;
            assert.equal(getUnit(current, 20).lifecycle, "LEAVING");
            assert.equal(ownerId(current), undefined);
            assert.deepEqual(blockedIds(current), []);
            current = remove(current, 20, "SCRIPT");
            return search(current, { id: 10 });
        }))]);
    battle = acquire(battle);
    const before = battle;
    battle = remove(battle, 20, "DEATH");

    assert.equal(calls, 1);
    assert.equal(getUnit(battle, 20), undefined);
    assert.deepEqual(blockedIds(battle), []);
    assert.equal(battle.removedUnits.length, 1);
    assert.equal(battle.removedUnits[0].reason, "DEATH");
    assert.deepEqual(battle.events.map(({ type }) => type), ["BLOCKING_ACQUIRED", "BLOCKING_RELEASED"]);
    assert.equal(ownerId(before), 10);
});
