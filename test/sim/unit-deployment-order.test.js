
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { changeTile } from "../helpers/tiles.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { replace as update } from "../../dist/core/battle/unit.js";
import { addCard } from "../../dist/core/battle/deployment/index.js";
import { deploy } from "../../dist/core/battle/deployment/operations.js";
import { setHook as setBlockingHook } from "../../dist/core/unit/capability/blocking/blocker-operations.js";
import { createDefinition as createDeployable } from "../helpers/deployable.js";
import { setHook as setDeployedHook } from "../../dist/core/unit/capability/deployable/hook.js";
import * as occupancy from "../../dist/core/battlefield/occupancy.js";
import { acquire, blockedIds, fixture, holder, hook, ownerId, target } from "../helpers/blocking.js";
import { getUnit } from "../helpers/unit.js";

test("tile changes during entry release blocking before deployment observers", () => {
    const calls = [];
    const profile = createDeployable({ cost: 0, redeployTicks: 0, slots: 1, buildableType: "ALL" });
    const blocker = holder(10, {
        definition: { deployable: profile },
    });
    let battle = fixture([blocker, target()]);
    const current = getUnit(battle, blocker.id);
    battle = applyUnitChanges(battle, [setBlockingHook({ id: current.id }, "released", hook("observe-entry-maintenance", state => {
            calls.push("released");
            assert.equal(state.events.some(event => event.type === "UNIT_DEPLOYED"), true);
            assert.deepEqual(occupancy.at(state.battlefield, [1, 2]), {
                occupant: null, support: { id: 30 },
            });
            assert.equal(ownerId(state), undefined);
            return state;
        })), setDeployedHook({ id: current.id }, {
            id: "observe-completed-entry",
            invoke(state, fact) {
                calls.push("deployed");
                assert.equal(fact.unit.id, 30);
                assert.equal(fact.kind, "MANUAL");
                assert.equal(getUnit(state, fact.unit.id).vitality.hp, 75);
                assert.deepEqual(calls, ["entered", "released", "deployed"]);
                return { state, value: undefined };
            },
        })]);
    battle = acquire(battle);
    const before = battle;
    assert.equal(ownerId(before), blocker.id);

    const definition = {
        id: "entry-order-platform",
        occupancy: { slot: "SUPPORT", hooks: [] },
        deployable: profile,
        vitality: { maxHp: 100, defense: 0, resistance: 0 },

        hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
            calls.push("entered");
            assert.deepEqual(state.events.map(event => event.type), [
                "BLOCKING_ACQUIRED", "UNIT_DEPLOYED",
            ]);
            state = changeTile(state, [1, 2], { elevation: "HIGHLAND", allowsBlocking: false });
            const unit = getUnit(state, self.id);
            return { state: update(state, [{ ...unit, vitality: { ...unit.vitality, hp: 75 } }]), value: undefined };
        } }],
    };
    const added = addCard(battle, definition);
    const deployed = deploy({
        ...added.state,
        execution: { ...added.state.execution, nextUnitId: 30 },
    }, { card: added.value, tilePosition: [1, 2] });
    assert.equal(deployed.value.type, "DEPLOYED");
    battle = deployed.state;

    assert.deepEqual(blockedIds(battle), []);
    assert.equal(ownerId(before), blocker.id);
    assert.equal(before.battlefield.units.has(30), false);

    assert.deepEqual(calls, ["entered", "released", "deployed"]);
    assert.equal(battle.events.filter(event => event.type === "UNIT_DEPLOYED").length, 1);
});

test("manual deployment records its event before entry and notifies observers after entry completes", () => {
    const calls = [];
    const profile = createDeployable({ cost: 0, redeployTicks: 0, slots: 1, buildableType: "ALL" });
    const observer = holder(10, { definition: { deployable: profile } });
    let battle = fixture([observer]);
    const current = getUnit(battle, observer.id);
    battle = applyUnitChanges(battle, [setDeployedHook({ id: current.id }, {
            id: "observe-manual-entry",
            invoke(state, fact) {
                calls.push("deployed");
                assert.equal(fact.kind, "MANUAL");
                assert.equal(getUnit(state, fact.unit.id).vitality.hp, 60);
                assert.deepEqual(calls, ["entered", "deployed"]);
                return { state, value: undefined };
            },
        })]);
    const definition = {
        id: "manual-entry-order-platform",
        occupancy: { slot: "SUPPORT", hooks: [] },
        deployable: profile,
        vitality: { maxHp: 100, defense: 0, resistance: 0 },

        hooks: [{ id: "test/enter", stage: "enter", invoke(state, self) {
            calls.push("entered");
            assert.deepEqual(state.events.map(event => [event.type, event.unitId]), [["UNIT_DEPLOYED", self.id]]);
            assert.deepEqual(self.occupancy.tile, [0, 3]);
            return { state: update(state, [{ ...self, vitality: { ...self.vitality, hp: 60 } }]), value: undefined };
        } }],
    };
    const added = addCard(battle, definition);
    const result = deploy(added.state, {
        card: added.value,
        tilePosition: [0, 3],
    });

    assert.equal(result.value.type, "DEPLOYED");
    assert.deepEqual(calls, ["entered", "deployed"]);
    assert.equal(result.state.events.filter(event => event.type === "UNIT_DEPLOYED").length, 1);
    assert.equal(added.state.events.length, 0);
    assert.equal(added.state.battlefield.units.size, 1);
});
