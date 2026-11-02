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

test("Card construction rejects impossible finite inventory", () => {
    assert.throws(() => createCard(0, definition(), { stock: 2 }), RangeError);
    for (const stock of [-1, 0.5]) {
        assert.throws(() => createCard(0, definition(), { stock }), RangeError);
    }
});
