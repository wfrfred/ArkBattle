import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattle } from "../helpers/unit.js";
import { addCard, advance } from "../../dist/core/battle/deployment/resources.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

function fixture(stock = 0, redeployTicks = 30) {
    const definition = {
        id: "resource-card",
        hooks: [],
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        card: {
            cost: 5,
            redeployTicks,
            slots: 0,
            stock,
            stockLimit: 3,
            activeLimit: null,
            cooldownOnDeploy: false,
            recoverOnLeave: true,
            increaseCostOnLeave: false,
            refund: { rate: 0.5, limit: "BASE_COST" },
            deploymentRules: [],
            unitHooks: [],
            initialize: battle => ({ state: battle, value: {} }),
        },
    };
    return addCard(fixtureBattle(), definition);
}

const at = (battle, tick) => advance({ ...battle, tick }, tick);

test("queue stores every return and samples a new duration only when the next segment starts", () => {
    const added = fixture();
    const reference = added.value;
    let battle = cards.enqueueRecovery(added.state, reference, 2);
    const original = cards.get(battle, reference);
    battle = cards.enqueueRecovery({ ...battle, tick: 10 }, reference);
    assert.equal(cards.get(battle, reference).recovery.pending, 3);
    assert.equal(cards.get(battle, reference).recovery.clock, original.recovery.clock);

    battle = cards.setRedeployTimeContribution(battle, reference, {
        id: "future-half-time",
        value: [modifier({ multiplier: -0.5 })],
    });
    assert.equal(cards.get(battle, reference).recovery.clock.readyAtTick, 30);
    battle = at(battle, 30);
    assert.equal(cards.get(battle, reference).stock, 1);
    assert.equal(cards.get(battle, reference).recovery.pending, 2);
    assert.deepEqual(cards.get(battle, reference).recovery.clock, {
        type: "RUNNING",
        durationTicks: 15,
        readyAtTick: 45,
    });
    battle = at(battle, 60);
    assert.equal(cards.get(battle, reference).stock, 3);
    assert.equal(cards.get(battle, reference).recovery, null);
    assert.equal(original.stock, 0);
    assert.equal(original.recovery.pending, 2);
});

test("use cooldown and inventory recovery are independent clocks", () => {
    const added = fixture();
    let battle = cards.startCooldown(added.state, added.value, 10);
    battle = cards.enqueueRecovery(battle, added.value);
    battle = at(battle, 10);
    assert.equal(cards.get(battle, added.value).cooldown, null);
    assert.equal(cards.get(battle, added.value).stock, 0);
    assert.equal(cards.get(battle, added.value).recovery.clock.readyAtTick, 30);
    battle = cards.clearCooldown(battle, added.value, "RECOVERY");
    assert.equal(cards.get(battle, added.value).stock, 1);
    assert.equal(cards.get(battle, added.value).recovery, null);
});

test("reduction completes only the current recovery segment without carrying excess into later segments", () => {
    const added = fixture();
    let battle = cards.enqueueRecovery(added.state, added.value, 3);
    battle = cards.reduceCooldown({ ...battle, tick: 10 }, added.value, 100, "RECOVERY");
    assert.equal(cards.get(battle, added.value).stock, 1);
    assert.equal(cards.get(battle, added.value).recovery.pending, 2);
    assert.equal(cards.get(battle, added.value).recovery.clock.readyAtTick, 40);
});

test("paused recovery preserves its remaining time and settles a cleared segment after resume", () => {
    const added = fixture();
    let battle = cards.enqueueRecovery(added.state, added.value, 2);
    battle = cards.pauseCooldown({ ...battle, tick: 10 }, added.value, "RECOVERY");
    assert.deepEqual(cards.get(battle, added.value).recovery.clock, {
        type: "PAUSED",
        durationTicks: 30,
        remainingTicks: 20,
    });
    battle = at(battle, 100);
    assert.equal(cards.get(battle, added.value).stock, 0);
    battle = cards.clearCooldown(battle, added.value, "RECOVERY");
    assert.equal(cards.get(battle, added.value).stock, 0);
    assert.equal(cards.get(battle, added.value).recovery.clock.remainingTicks, 0);
    battle = cards.resumeCooldown(battle, added.value, "RECOVERY");
    assert.equal(cards.get(battle, added.value).stock, 1);
    assert.equal(cards.get(battle, added.value).recovery.clock.readyAtTick, 130);
});

test("zero-duration serial recovery completes all pending inventory in the current tick", () => {
    const added = fixture(0, 0);
    const battle = cards.enqueueRecovery(added.state, added.value, 3);
    assert.equal(cards.get(battle, added.value).stock, 3);
    assert.equal(cards.get(battle, added.value).recovery, null);
});

test("Card selection rules are independent and future Unit hooks use ordinary registration", () => {
    const added = fixture();
    const entry = {
        id: "on-entry",
        stage: "enter",
        invoke: (battle) => ({ state: battle, value: undefined }),
    };
    let battle = cards.setHook(added.state, added.value, entry);
    battle = cards.setRule(battle, added.value, {
        id: "cannot-select",
        allows: (_battle, { purpose }) => purpose !== "SELECT",
    });
    assert.equal(cards.allows(battle, { ref: added.value, purpose: "DISPLAY" }), true);
    assert.equal(cards.allows(battle, { ref: added.value, purpose: "SELECT" }), false);
    assert.equal(cards.allows(battle, {
        purpose: "DEPLOY",
        request: { card: added.value, tilePosition: [0, 0], quote: { dp: 5, stock: 1, slots: 0 }, rules: [], hooks: [] },
    }), true);
    assert.deepEqual(cards.get(battle, added.value).hooks, [entry]);
    assert.equal(cards.setHook(battle, added.value, entry), battle);
    assert.equal(cards.removeRule(battle, added.value, "missing"), battle);
    battle = cards.removeHook(battle, added.value, entry.id);
    assert.deepEqual(cards.get(battle, added.value).hooks, []);
});
