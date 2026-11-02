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


test("Card construction rejects impossible finite inventory", () => {
    assert.throws(() => createCard(0, definition(), { stock: 2 }), RangeError);
    for (const stock of [-1, 0.5]) {
        assert.throws(() => createCard(0, definition(), { stock }), RangeError);
    }
});
