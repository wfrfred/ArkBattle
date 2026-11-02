import assert from "node:assert/strict";
import { test } from "node:test";
import * as cards from "../../dist/core/battle/deployment/card/state.js";
import { get } from "../../dist/core/battle/deployment/card/index.js";
import { addCard } from "../../dist/core/battle/deployment/index.js";
import { fixtureBattle } from "../helpers/unit.js";
import { create as value } from "../../dist/core/unit/contribution/attribute.js";

const definition = (cost = 10, redeployTicks = 30) => ({
    id: "deployable",
    hooks: [],
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRules: [] },
    card: {
        cost,
        redeployTicks,
        slots: 1,
        stock: 1,
        stockLimit: 1,
        activeLimit: 1,
        cooldownOnDeploy: false,
        recoverOnLeave: true,
        increaseCostOnLeave: true,
        refund: { rate: 0.5, limit: "BASE_COST" },
        deploymentRules: [],
        unitHooks: [],
        initialize: battle => ({ state: battle, value: {} }),
    },
});
function createCard(id, definition, options) {
    const initial = fixtureBattle(0, { nextCardId: id });
    const content = options === undefined
        ? definition
        : { ...definition, card: { ...definition.card, ...options } };
    const created = addCard(initial, content);
    return get(created.state, created.value);
}
const operator = (cost = 10, redeployTicks = 30) => createCard(0, definition(cost, redeployTicks));
const token = (stockLimit = 3, redeployTicks = 10) =>
    createCard(1, definition(5, redeployTicks), {
        stock: stockLimit,
        stockLimit,
        activeLimit: stockLimit,
    });
const modification = (id, fields, group) => ({
    id,
    value: [value(fields)],
    ...(group === undefined ? {} : { group }),
});

test("ordinary Cards share definitions and have independent persistent progress", () => {
    const unit = definition();
    const first = createCard(0, unit);
    const second = createCard(1, unit);
    assert.equal(first.definition, unit);
    assert.deepEqual(first.state, {});
    assert.deepEqual(second.state, {});
    assert.notEqual(first.state, second.state);
    assert.equal(unit.card.onTick, undefined);
    assert.equal(first.stock, 1);
    assert.equal(first.definition.card.stockLimit, 1);
    assert.equal(first.definition.card.activeLimit, 1);
    assert.equal(first.cooldown, null);
    assert.equal(first.recovery, null);
    const changed = cards.incrementCostStage(first);
    assert.equal(changed.costStage, 1);
    assert.equal(second.costStage, 0);
    assert.equal(first.costStage, 0);
});

test("cost stages cap at two and preserve staged rounding", () => {
    const first = operator(11);
    const second = cards.incrementCostStage(first);
    const third = cards.incrementCostStage(second);
    assert.equal(cards.resolveCost(first), 11);
    assert.equal(cards.resolveCost(second), 16);
    assert.equal(cards.resolveCost(third), 22);
    assert.equal(cards.incrementCostStage(third), third);
    const doubled = cards.setCostContribution(second, modification("double", { multiplier: 1 }));
    assert.equal(cards.resolveCost(doubled), 32);
    assert.equal(cards.resolveCost(doubled, 20), 20);
});

test("cost penalty multiplies base additions without multiplying final cost reductions", () => {
    const initial = operator(10);
    let card = cards.incrementCostStage(initial);
    card = cards.setCostContribution(card, modification("base", { addition: 2 }));
    card = cards.setCostContribution(card, modification("discount", { finalAddition: -4 }));
    assert.equal(cards.resolveBaseCost(card), 12);
    assert.equal(cards.resolveCost(card), 14);
    assert.equal(cards.resolveCost(initial), 10);
    card = cards.setCostContribution(card, modification("discount", { finalAddition: -99 }));
    assert.equal(cards.resolveCost(card), 0);
    assert.equal(cards.resolveBaseCost(card), 12);
});

test("Card contribution groups select a winner and removing it restores the fallback", () => {
    const initial = operator();
    let card = cards.setCostContribution(
        initial,
        modification("weak", { finalAddition: -1 }, { id: "discount", priority: 1 }),
    );
    card = cards.setCostContribution(
        card,
        modification("strong", { finalAddition: -3 }, { id: "discount", priority: 2 }),
    );
    assert.equal(cards.resolveCost(card), 7);
    card = cards.removeCostContribution(card, "strong");
    assert.equal(cards.resolveCost(card), 9);
    assert.equal(cards.resolveCost(initial), 10);
    assert.equal(cards.removeCostContribution(card, "missing"), card);
});

test("an explicit use cooldown clears at its deadline without regenerating inventory", () => {
    const initial = token();
    const consumed = cards.consume(initial);
    assert.equal(consumed.stock, 2);
    assert.equal(consumed.cooldown, null);
    const waiting = cards.startCooldown(consumed, 10);
    assert.deepEqual(waiting.cooldown, { type: "RUNNING", readyAtTick: 20, durationTicks: 10 });
    assert.equal(cards.advance(waiting, 19), waiting);
    const ready = cards.advance(waiting, 20);
    assert.equal(ready.cooldown, null);
    assert.equal(ready.stock, 2);
    assert.equal(initial.stock, 3);
});

test("inventory recovery restores one item independently of a use cooldown", () => {
    const waiting = cards.enqueueRecovery(cards.startCooldown(cards.consume(token(1)), 5, 20), 7);
    assert.equal(cards.advance(waiting, 16), waiting);
    const ready = cards.advance(waiting, 17);
    assert.equal(ready.stock, 1);
    assert.equal(ready.recovery, null);
    assert.equal(ready.cooldown.readyAtTick, 25);
});

test("recovery processes every pending item serially while consumption remains independent", () => {
    const initial = token(3, 30);
    let card = cards.consume(cards.consume(initial));
    card = cards.enqueueRecovery(card, 5);
    card = cards.enqueueRecovery(card, 10);
    assert.equal(card.stock, 1);
    assert.equal(card.recovery.pending, 2);
    assert.deepEqual(card.recovery.clock, { type: "RUNNING", readyAtTick: 35, durationTicks: 30 });
    card = cards.consume(card);
    assert.equal(card.stock, 0);
    const firstReady = cards.advance(card, 35);
    assert.equal(firstReady.stock, 1);
    assert.equal(firstReady.recovery.pending, 1);
    assert.equal(firstReady.recovery.clock.readyAtTick, 65);
    assert.equal(cards.advance(firstReady, 64), firstReady);
    const nextReady = cards.advance(firstReady, 65);
    assert.equal(nextReady.stock, 2);
    assert.equal(nextReady.recovery, null);
    assert.equal(initial.stock, 3);
});

test("recovery can cross multiple elapsed deadlines without losing pending items", () => {
    const waiting = cards.enqueueRecovery(cards.consume(token(3, 10), 3), 1, 3);
    const ready = cards.advance(waiting, 31);
    assert.equal(ready.stock, 3);
    assert.equal(ready.recovery, null);
    assert.equal(waiting.stock, 0);
    assert.equal(waiting.recovery.pending, 3);
});

test("zero-duration cooldown and all pending recoveries complete at the same tick", () => {
    const waiting = cards.enqueueRecovery(
        cards.startCooldown(cards.consume(token(3, 0), 3), 7),
        7,
        3,
    );
    const ready = cards.advance(waiting, 7);
    assert.equal(ready.stock, 3);
    assert.equal(ready.recovery, null);
    assert.equal(ready.cooldown, null);
});

test("future duration modifiers do not rescale a use cooldown that already started", () => {
    const waiting = cards.startCooldown(operator(10, 30), 5);
    const modified = cards.setRedeployTimeContribution(
        waiting,
        modification("shorter", { multiplier: -0.5 }),
    );
    assert.equal(cards.resolveRedeployTicks(modified), 15);
    assert.equal(modified.cooldown, waiting.cooldown);
    const shortened = cards.reduceCooldown(modified, 10, 10, "COOLDOWN");
    assert.equal(shortened.cooldown.readyAtTick, 25);
    assert.equal(shortened.cooldown.durationTicks, 30);
    assert.equal(cards.advance(shortened, 25).cooldown, null);
    assert.equal(cards.startCooldown(shortened, 50).cooldown.readyAtTick, 65);
    assert.equal(
        cards.resolveRedeployTicks(cards.removeRedeployTimeContribution(modified, "shorter")),
        30,
    );
    assert.equal(cards.removeRedeployTimeContribution(modified, "missing"), modified);
});

test("recovery keeps its current duration and samples the next duration when that segment starts", () => {
    let card = cards.enqueueRecovery(cards.consume(token(2, 30), 2), 0, 2);
    card = cards.setRedeployTimeContribution(card, modification("shorter", { multiplier: -0.5 }));
    assert.equal(card.recovery.clock.readyAtTick, 30);
    const firstReady = cards.advance(card, 30);
    assert.equal(firstReady.stock, 1);
    assert.deepEqual(firstReady.recovery.clock, {
        type: "RUNNING",
        readyAtTick: 45,
        durationTicks: 15,
    });
    assert.equal(cards.advance(firstReady, 45).stock, 2);
});

test("excess reduction applies to the current recovery segment only", () => {
    const waiting = cards.enqueueRecovery(cards.consume(token(3, 30), 3), 0, 3);
    const firstReady = cards.advance(cards.reduceCooldown(waiting, 100, 20, "RECOVERY"), 20);
    assert.equal(firstReady.stock, 1);
    assert.equal(firstReady.recovery.pending, 2);
    assert.equal(firstReady.recovery.clock.readyAtTick, 50);
    assert.equal(cards.advance(firstReady, 49), firstReady);
    assert.equal(cards.advance(firstReady, 50).stock, 2);
});

test("explicit recharge caps inventory without discarding either clock", () => {
    const initial = createCard(1, definition(), {
        stockLimit: 5,
        activeLimit: 2,
        stock: 2,
    });
    const consumed = cards.consume(initial);
    const waiting = cards.enqueueRecovery(cards.startCooldown(consumed, 10), 10);
    const replenished = cards.recharge(waiting, 10);
    assert.equal(replenished.stock, 5);
    assert.equal(replenished.definition.card.activeLimit, 2);
    assert.equal(replenished.cooldown, waiting.cooldown);
    assert.equal(replenished.recovery, waiting.recovery);
    assert.equal(cards.recharge(replenished, 1), replenished);
    const ordinary = operator();
    assert.equal(cards.recharge(ordinary, 5), ordinary);
    assert.equal(consumed.stock, 1);
});

test("Card construction rejects impossible finite inventory", () => {
    assert.throws(() => createCard(0, definition(), { stock: 2 }), RangeError);
    for (const stock of [-1, 0.5]) {
        assert.throws(() => createCard(0, definition(), { stock }), RangeError);
    }
});
