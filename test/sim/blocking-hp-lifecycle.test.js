
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { acquire as acquirePair } from "../../dist/core/battle/blocking/index.js";
import { setHook as setDamageHook } from "../../dist/core/battle/damage/index.js";
import { setHook as setBlockerHook } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { setCapacityContribution } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { damage, parameters } from "../helpers/vitality.js";
import { getUnit } from "../helpers/unit.js";
import { fixture, holder, target, acquire, blockedIds, ownerId, hook } from "../helpers/blocking.js";

for (const [role, victimId] of [["Blocker", 10], ["Blockable", 20]]) {
    test(`a PRESENT zero-HP ${role} cannot establish a new otherwise eligible relationship`, () => {
        const initial = fixture([holder(10, { capacity: 2 }), target()]);
        assert.equal(ownerId(acquirePair(initial, { id: 10 }, { id: 20 })), 10,
            "the same pair is eligible while both endpoints have positive HP");
        const victim = getUnit(initial, victimId);
        const battle = updateUnit(initial, [{ ...victim, vitality: { ...victim.vitality, hp: 0 } }]);
        assert.equal(getUnit(battle, 10).lifecycle, "PRESENT");
        assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
        assert.equal(getUnit(battle, victimId === 10 ? 20 : 10).vitality.hp, 100);
        assert.deepEqual(blockedIds(battle), [], "the Blocker has spare capacity");
        assert.equal(getUnit(battle, 10).definition.blocker.capacity, 2);
        assert.equal(ownerId(battle), undefined, "the target is unowned");

        assert.equal(acquirePair(battle, { id: 10 }, { id: 20 }), battle);
        assert.deepEqual(blockedIds(battle), []);
        assert.equal(ownerId(battle), undefined);
        assert.deepEqual(battle.events, []);
    });

    test(`hpApplied can rescue a zero-HP ${role} without replacing or releasing its relationship`, () => {
        let battle = acquire(fixture([holder(), target()]));
        const originalEntry = getUnit(battle, 10).blocker.blocked[0];
        const originalOwner = getUnit(battle, 20).blockable.blocker;
        const victim = getUnit(battle, victimId);
        let applied = 0;
        battle = applyUnitChanges(battle, [setDamageHook({ id: victim.id }, {
                id: "rescue-after-hp-application", stage: "hpApplied", priority: 0,
                invoke(state) {
                    applied++;
                    const current = getUnit(state, victimId);
                    assert.equal(current.vitality.hp, 0);
                    assert.equal(current.lifecycle, "PRESENT");
                    assert.equal(getUnit(state, 10).blocker.blocked[0], originalEntry);
                    assert.equal(getUnit(state, 20).blockable.blocker, originalOwner);
                    state = applyUnitChanges(state, [setCapacityContribution({ id: 10 }, {
                        id: "observed-during-hpApplied", value: [{ type: "ADD", value: 0 }],
                    })]);
                    assert.equal(getUnit(state, 10).blocker.blocked[0], originalEntry,
                        "another complete Blocking operation must retain a relationship at transient HP zero");
                    const surviving = getUnit(state, victimId);
                    return {
                        state: updateUnit(state, [{ ...surviving, vitality: { ...surviving.vitality, hp: 25 } }]),
                        value: undefined,
                    };
                },
            })]);
        const before = battle;
        const result = damage(battle, { source: null, target: { id: victimId }, parameters: parameters(200, "TRUE") });

        assert.equal(applied, 1);
        assert.equal(result.value.kind, "APPLIED");
        assert.deepEqual(result.value.application, { hpBefore: 100, hpAfter: 0, hpLoss: 100 });
        assert.equal(getUnit(result.state, victimId).vitality.hp, 25);
        assert.equal(getUnit(result.state, victimId).lifecycle, "PRESENT");
        assert.equal(getUnit(result.state, 10).blocker.blocked[0], originalEntry);
        assert.equal(getUnit(result.state, 20).blockable.blocker, originalOwner);
        assert.deepEqual(blockedIds(result.state), [20]);
        assert.equal(ownerId(result.state), 10);
        assert.equal(result.state.events.some(event => event.type === "BLOCKING_RELEASED"), false);
        assert.equal(result.state.removedUnits.length, 0);
        assert.equal(getUnit(before, victimId).vitality.hp, 100);
    });

    test(`an unrescued ${role} releases only after hpApplied, while LEAVING and before physical removal`, () => {
        const trace = [];
        const leave = {
            id: "observe-physical-removal", stage: "leave",
            invoke(state) {
                trace.push("left");
                assert.equal(getUnit(state, victimId), undefined);
                return { state, value: undefined };
            },
        };
        let battle = acquire(fixture([
            holder(10, { definition: { hooks: victimId === 10 ? [leave] : [] } }),
            target(20, { definition: { hooks: victimId === 20 ? [leave] : [] } }),
        ]));
        const originalEntry = getUnit(battle, 10).blocker.blocked[0];
        const victim = getUnit(battle, victimId);
        battle = applyUnitChanges(battle, [setDamageHook({ id: victim.id }, {
                id: "observe-lethal-application", stage: "hpApplied", priority: 0,
                invoke(state) {
                    trace.push("hpApplied");
                    assert.equal(getUnit(state, victimId).vitality.hp, 0);
                    assert.equal(getUnit(state, victimId).lifecycle, "PRESENT");
                    assert.equal(getUnit(state, 10).blocker.blocked[0], originalEntry);
                    assert.equal(ownerId(state), 10);
                    return { state, value: undefined };
                },
            })]);
        const owner = getUnit(battle, 10);
        battle = applyUnitChanges(battle, [setBlockerHook({ id: owner.id }, "released", hook("observe-death-release", (state, { relation }) => {
                trace.push("released");
                assert.deepEqual(trace, ["hpApplied", "released"]);
                assert.equal(getUnit(state, victimId).lifecycle, "LEAVING");
                assert.equal(relation.blocked, originalEntry);
                assert.deepEqual(blockedIds(state), []);
                assert.equal(ownerId(state), undefined);
                return state;
            }))]);
        const result = damage(battle, { source: null, target: { id: victimId }, parameters: parameters(200, "TRUE") });

        assert.deepEqual(trace, ["hpApplied", "released", "left"]);
        assert.equal(getUnit(result.state, victimId), undefined);
        assert.deepEqual(blockedIds(result.state), []);
        assert.equal(ownerId(result.state), undefined);
        assert.equal(result.state.events.filter(event => event.type === "BLOCKING_RELEASED").length, 1);
        assert.deepEqual(result.state.removedUnits.map(({ unitId, reason }) => [unitId, reason]), [[victimId, "DEATH"]]);
    });
}
