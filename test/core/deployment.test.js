// Contract: [deployment](../../docs/architecture/deployment.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import * as unitObservers from "../../dist/core/battle/unit-hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import * as deck from "../../dist/core/battle/deployment/deck/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import * as units from "../../dist/core/unit/index.js";
import * as damage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as modifier from "../../dist/core/common/modifier.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { TICKS_PER_SECOND } from "../../dist/core/tick.js";

const operator = {
    id: "operator",
    hooks: Hooks.empty(),
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRestrictions: [], refund: { rate: 0.5, limit: "BASE_COST" } },
    vitality: defineVitality(100),
};

const commonCard = {
    dp: {
        parameters: cards.dp.create({ cost: 10, step: 0.5, maxMultiplier: 2 }),
    },
    slot: 1,
    supply: {
        stock: 1,
        stockLimit: 1,
        activeLimit: 1,
        cooldown: 10,
    },
    deploymentRestrictions: [],
    unitHooks: Hooks.empty(),
    initialize: (state) => ({ state, value: {} }),
};
const operatorCard = { ...commonCard, policy: "UNIQUE", dp: { ...commonCard.dp, increase: true } };
const account = {
    dp: { initial: 50, min: 0, max: 99, recoveryInterval: null },
    slot: { limit: 3 },
};

test("Card initialization reserves identity before Deck registration", () => {
    let state = battle([], { deployment: { definition: account, cards: [] } });
    const input = { definition: operatorCard, unitDefinition: operator };
    const first = cards.initialize(state, input);
    const second = cards.initialize(first.state, input);
    const firstRef = cards.ref(first.value);
    const secondRef = cards.ref(second.value);
    assert.notEqual(firstRef.id, secondRef.id);
    assert.equal(cards.get(second.state, firstRef), undefined);
    assert.equal(cards.get(second.state, secondRef), undefined);
    assert.deepEqual([...deployment.ordered(second.state)], []);

    state = cards.add(second.state, first.value);
    state = cards.add(state, second.value);
    assert.strictEqual(cards.get(state, firstRef), first.value);
    assert.deepEqual([...cards.all(state)].map(cards.ref), [firstRef, secondRef]);
    assert.deepEqual([...deployment.ordered(state)].map(cards.ref), [firstRef, secondRef]);
});

test("Deck uses the updated fees to sort and keeps the last order after the rule is cleared", () => {
    const input = (cost, adjustment) => {
        const contribution = { id: "tick-fee", value: cards.dp.create({ finalAddition: adjustment }) };
        return {
            definition: {
                ...operatorCard,
                dp: { ...operatorCard.dp, parameters: { ...operatorCard.dp.parameters, cost } },
                onTick: (state, self) =>
                    deck.replace(state, cards.dp.setCostContribution(self, contribution)),
            },
            unitDefinition: operator,
        };
    };
    let state = battle([], { deployment: { definition: account, cards: [input(5, 2), input(10, -4)] } });
    const [first, second] = [...cards.all(state)].map(cards.ref);
    const ordered = (state) => [...deployment.ordered(state)].map(cards.ref);
    const ordering = (state, references) => {
        const cost = (reference) => cards.dp.resolveCost(state, cards.get(state, reference));
        return references.toSorted((left, right) => cost(left) - cost(right));
    };

    state = deployment.setOrdering(state, ordering);
    state = step(state, []);
    assert.deepEqual(ordered(state), [second, first]);
    assert.deepEqual([...cards.all(state)].map(cards.ref), [first, second]);

    const surcharged = cards.dp.setCostContribution(cards.get(state, second), {
        id: "surcharge",
        value: cards.dp.create({ finalAddition: 4 }),
    });
    state = deck.replace(state, surcharged);
    assert.deepEqual(ordered(state), [second, first]);
    state = deployment.setOrdering(state, null);
    state = step(state, []);
    assert.deepEqual(ordered(state), [second, first]);

    state = deployment.setOrdering(state, ordering);
    assert.deepEqual(ordered(state), [second, first]);
    state = deployment.sort(state);
    assert.deepEqual(ordered(state), [first, second]);
});

test("different Card definitions can deploy the same Unit Definition used by an initial unit", () => {
    const discount = {
        ...operatorCard,
        dp: { ...operatorCard.dp, parameters: { ...operatorCard.dp.parameters, cost: 7 } },
        slot: 0,
    };
    let state = battle([
        { definition: operator, position: [7, 0], initial: { occupancy: { tile: [0, 7] } } },
    ], { deployment: {
        definition: account,
        cards: [
            { definition: operatorCard, unitDefinition: operator },
            { definition: discount, unitDefinition: operator },
        ],
    } });
    const initial = get(state, 0);
    assert.equal(initial.deployable.card, null);
    assert.equal(deployment.cardForUnit(state, units.ref(initial)), null);
    assert.deepEqual(state.deployment.history, []);

    const [regular, discounted] = [...cards.all(state)];
    const observedHistory = [];
    const expectedHistory = [];

    state = unitObservers.setHook(state, unitObservers.entered, {
        id: "observe-deployment-history",
        invoke(current) {
            observedHistory.push(current.deployment.history.at(-1));
            return { state: current, value: undefined };
        },
    });

    for (const [card, tile] of [[discounted, [1, 2]], [regular, [0, 2]]]) {
        const reference = cards.ref(card);
        const result = deployment.deploy(state, deployment.createRequest(state, reference, tile));
        assert.equal(result.value.type, "DEPLOYED");
        state = result.state;
        const unit = get(state, result.value.unitId);
        assert.strictEqual(unit.definition, operator);
        assert.equal(unit.deployable.cost, card.definition.dp.parameters.cost);
        assert.equal(unit.deployable.slots, card.definition.slot);
        expectedHistory.push({ card: reference, unit: units.ref(unit) });
    }
    assert.equal(state.deployment.dp.balance, 33);
    assert.deepEqual(observedHistory, expectedHistory);
    assert.deepEqual(state.deployment.history, expectedHistory);
});

test("preview, evaluation and deployment share a request, rejection spends nothing, and the entered hook sees consumption", () => {
    const constructions = [];
    const deployments = [];
    const definition = {
        ...operator,
        facing: { restrictions: [] },
        action: {
            speed: defineAttribute(100, 20),
            interval: defineAttribute(10),
            definitions: [{
                id: "observe-construction",
                applyWay: "NONE",
                period: { type: "FIXED", ticks: 1 },
                initialize(current) {
                    constructions.push({
                        dp: current.deployment.dp.balance,
                        stock: cards.get(current, card).supply.stock,
                        slots: current.deployment.slot.used,
                    });
                    return { state: current, value: {} };
                },
                prepare: state => ({ state, value: null }),
                onTick: state => state,
            }],
        },
    };
    let state = battle([], {
        deployment: { definition: account, cards: [{ definition: operatorCard, unitDefinition: definition }] },
    });
    state = deployment.setHook(state, deployment.deployed, {
        id: "deployed",
        invoke(current, { unit, request }) {
            assert.notEqual(get(current, unit.id), undefined);
            deployments.push({ id: unit.id, tile: request.tilePosition });
            return { state: current, value: undefined };
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    const request = deployment.createRequest(state, card, [1, 2], "LEFT");
    const invalid = { ...request, quote: { ...request.quote, dp: -1 } };
    for (const operation of [deployment.preview, deployment.deploy]) {
        assert.throws(() => operation(state, invalid), RangeError);
    }
    const rejected = {
        ...request,
        restrictions: [
            {
                id: "front-row-only",
                value: { allows: (_current, { request: current }) => current.tilePosition[0] === 0 },
            },
        ],
    };
    assert.deepEqual(deployment.preview(state, rejected), { type: "REJECTED", reason: "RULE" });
    assert.deepEqual(deployment.evaluate(state, rejected), { type: "REJECTED", reason: "RULE" });
    assert.deepEqual(deployment.deploy(state, rejected), {
        state,
        value: { type: "REJECTED", reason: "RULE" },
    });
    assert.deepEqual(deployments, []);

    let entered = false;
    const allowed = {
        ...rejected,
        tilePosition: [0, 2],
        hooks: Hooks.empty().set(unitLifecycle.entered, {
                id: "observe-consumption",

                invoke: (current, self) => {
                    entered = true;
                    assert.equal(current.deployment.dp.balance, 40);
                    assert.equal(cards.get(current, card).supply.stock, 0);
                    assert.equal(current.deployment.slot.used, 1);
                    assert.equal(get(current, self.id).deployable.card.id, card.id);
                    return { state: current, value: undefined };
                },
            }),
    };
    assert.deepEqual(deployment.preview(state, allowed), {
        type: "ALLOWED",
        cost: 10,
        quote: allowed.quote,
    });
    const positions = deployment.positions(state, allowed);
    assert.ok(positions.every(([row]) => row === 0));
    assert.ok(positions.some(([row, column]) => row === 0 && column === 2));
    assert.deepEqual(constructions, []);
    const deployed = deployment.deploy(state, allowed);
    state = deployed.state;
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.deepEqual(deployments, [{ id: deployed.value.unitId, tile: [0, 2] }]);
    assert.deepEqual(constructions, [{ dp: 40, stock: 0, slots: 1 }]);
    assert.equal(entered, true);
    assert.deepEqual(get(state, deployed.value.unitId).occupancy.tile, [0, 2]);
    assert.equal(get(state, deployed.value.unitId).occupancy.direction, "LEFT");
    assert.equal(get(state, deployed.value.unitId).facing.direction, "LEFT");
});

test("DEPLOY-RESTRICTION-01: policy overrides retain resource and occupancy prerequisites while zero quotes remain legal", () => {
    let state = battle([], { deployment: {
        definition: { ...account, dp: { ...account.dp, initial: 0, min: -5 }, slot: { limit: 0 } },
        cards: [{ definition: operatorCard, unitDefinition: operator }],
    } });
    const card = cards.ref([...cards.all(state)][0]);
    const permit = { allows: () => true };
    const request = {
        ...deployment.createRequest(state, card, [0, 2]),
        restrictions: [
            ...deployment.defaultRestrictions.map(({ id }) => ({ id, value: permit })),
            ...["stock", "dp", "map", "occupancy"].map(name => ({ id: `@deployment/${name}`, value: permit })),
        ],
    };
    const reject = (candidate, reason) => assert.deepEqual(deployment.deploy(state, candidate), {
        state, value: { type: "REJECTED", reason },
    });
    const unavailable = { ...request, quote: { dp: null, stock: 2, slots: 0 } };
    reject(unavailable, "NO_STOCK");
    assert.deepEqual(deployment.positions(state, unavailable), []);
    reject({ ...request, quote: { dp: 6, stock: 0, slots: 0 } }, "INSUFFICIENT_DP");
    reject({ ...request, quote: { dp: null, stock: 0, slots: 0 }, tilePosition: [-1, 2] }, "OUTSIDE_MAP");

    const free = { ...request, quote: { dp: null, stock: 0, slots: 0 } };
    const first = deployment.deploy(state, free);
    state = first.state;
    assert.equal(first.value.type, "DEPLOYED");
    reject(free, "OCCUPIED");
    const zero = { ...free, tilePosition: [0, 3], quote: { dp: 0, stock: 0, slots: 0 } };
    const second = deployment.deploy(state, zero);
    state = second.state;
    assert.equal(second.value.type, "DEPLOYED");
    assert.equal(cards.get(state, card).supply.stock, 1);
    assert.equal(state.deployment.dp.balance, 0);
    assert.equal(state.deployment.slot.used, 0);
    assert.equal(get(state, first.value.unitId).deployable.cost, 10);
    assert.equal(get(state, second.value.unitId).deployable.slots, 0);
});

test("Card Definition and DeployRequest each reject duplicate restriction IDs", () => {
    const restrictions = [
        { id: "placement", value: { allows: () => false } },
        { id: "placement", value: { allows: () => true } },
    ];
    const state = battle([], {
        deployment: {
            definition: account,
            cards: [{ definition: operatorCard, unitDefinition: operator }],
        },
    });

    assert.throws(() => cards.initialize(state, {
        definition: { ...operatorCard, deploymentRestrictions: restrictions },
        unitDefinition: operator,
    }), /duplicate restriction identity/);

    const card = cards.ref([...cards.all(state)][0]);
    const request = { ...deployment.createRequest(state, card, [0, 2]), restrictions };
    assert.throws(() => deployment.deploy(state, request), /duplicate restriction identity/);
});

test("DEPLOY-RESTRICTION-02: Definition, Card and Request replace IDs before group resolution and deterministic rejection", () => {
    const permit = { allows: () => true };
    const deny = { allows: () => false };
    let state = battle([], { deployment: {
        definition: { ...account, slot: { limit: 0 } }, cards: [{ unitDefinition: operator, definition: {
            ...operatorCard, supply: { ...operatorCard.supply, activeLimit: 0 },
            deploymentRestrictions: [
                { id: "@deployment/cooldown", value: deny },
                { id: "@deployment/active-limit", value: deny, group: { id: "permission", priority: 1 } },
            ],
        } }],
    } });
    const card = cards.ref([...cards.all(state)][0]);
    state = deck.replace(state, cards.supply.setCooldown(cards.get(state, card), 10));
    state = cards.setRestriction(state, card, { id: "@deployment/cooldown", value: permit });
    state = cards.setRestriction(state, card, {
        id: "@deployment/slots", value: deny, group: { id: "permission", priority: 2 },
    });
    const request = deployment.createRequest(state, card, [0, 2]);
    assert.deepEqual(deployment.evaluate(state, request), { type: "REJECTED", reason: "SLOT_LIMIT" });
    const allowed = { ...request, restrictions: [
        { id: "@deployment/slots", value: permit, group: { id: "permission", priority: 2 } },
    ] };
    const rejected = { ...allowed, restrictions: [
        ...allowed.restrictions,
        { id: "@deployment/cooldown", value: deny },
        { id: "@deployment/active-limit", value: deny },
    ] };
    assert.deepEqual(deployment.evaluate(state, rejected), { type: "REJECTED", reason: "ACTIVE_LIMIT" });
    assert.equal(deployment.deploy(state, allowed).value.type, "DEPLOYED");
});

test("retreat refunds before removal, and death delays global slot release independently of Card recovery", () => {
    const tilePosition = [1, 2];
    const departures = [];
    const retreats = [];
    let state = battle([], {
        deployment: {
            definition: { ...account, slot: { limit: 1 } },
            cards: [
                {
                    unitDefinition: operator,
                    definition: {
                        ...operatorCard,
                        unitHooks: Hooks.empty()
                            .set(unitLifecycle.removing, {
                                id: "observe-retreat-refund",
                                accepts: (_current, { reason }) => reason === "RETREAT",
                                invoke: (current, { unit }) => {
                                    const card = cards.get(current, unit.deployable.card);
                                    retreats.push({
                                        dp: current.deployment.dp.balance,
                                        stage: card.dp.stage,
                                        stock: card.supply.stock,
                                        cooldown: card.supply.cooldown,
                                    });
                                    return { state: current, value: undefined };
                                },
                            })
                            .set(unitLifecycle.removed, {
                                id: "observe-departure",
                                invoke: (current, { unit, reason }) => {
                                    const card = cards.get(current, unit.deployable.card);
                                    departures.push({
                                        reason,
                                        dp: current.deployment.dp.balance,
                                        stage: card.dp.stage,
                                        stock: card.supply.stock,
                                        cooldown: card.supply.cooldown,
                                        slots: current.deployment.slot.used,
                                    });
                                    return { state: current, value: undefined };
                                },
                            }),
                    },
                },
                { unitDefinition: operator, definition: operatorCard },
            ],
        },
    });
    const [card, nextCard] = [...cards.all(state)].map(cards.ref);
    const first = deployment.deploy(state, deployment.createRequest(state, card, tilePosition));
    const firstUnit = units.ref(get(first.state, first.value.unitId));
    state = deployment.retreat(first.state, firstUnit);
    assert.equal(get(state, first.value.unitId), undefined);
    assert.equal(deployment.deployedCount(state, card), 0);
    assert.deepEqual(retreats, [{ dp: 45, stage: 0, stock: 0, cooldown: 0 }]);
    assert.deepEqual(departures, [
        { reason: "RETREAT", dp: 45, stage: 1, stock: 1, cooldown: 10, slots: 0 },
    ]);

    const returning = deployment.createRequest(state, card, tilePosition);
    assert.deepEqual(deployment.evaluate(state, returning), { type: "REJECTED", reason: "COOLDOWN" });
    for (let elapsed = 0; elapsed < 10; elapsed++) {
        state = step(state, []);
    }
    const second = deployment.deploy(state, returning);
    assert.equal(second.value.type, "DEPLOYED");
    state = second.state;
    assert.notEqual(second.value.unitId, first.value.unitId);
    const secondUnit = units.ref(get(state, second.value.unitId));
    assert.deepEqual(deployment.cardForUnit(state, firstUnit), card);
    assert.equal(deployment.deployedCount(state, card), 1);
    assert.equal(state.deployment.dp.balance, 30);
    const request = {
        source: null,
        target: secondUnit,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    state = damage.applyDamage(request, damage.calculateDamage(state, request)).state;
    assert.equal(get(state, second.value.unitId), undefined);
    assert.equal(at(state.battlefield, tilePosition)?.occupant ?? null, null);
    assert.deepEqual(deployment.cardForUnit(state, secondUnit), card);
    assert.equal(deployment.deployedCount(state, card), 0);
    assert.deepEqual(departures[1], {
        reason: "DEATH", dp: 30, stage: 2, stock: 1, cooldown: 10, slots: 1,
    });

    const adjusted = cards.dp.setCostContribution(cards.get(state, card), {
        id: "next-deployment-cost",
        value: cards.dp.create({
            cost: 17, baseAddition: 4, maxMultiplier: -0.25, costScale: 0.75, finalAddition: -2,
        }),
    });
    state = deck.replace(state, adjusted);
    assert.equal(deployment.createRequest(state, card, tilePosition).quote.dp, 19);
    state = deck.replace(state, cards.dp.removeCostContribution(adjusted, "next-deployment-cost"));
    assert.equal(deployment.createRequest(state, card, tilePosition).quote.dp, 20);

    const releasedAt = state.tick + TICKS_PER_SECOND;
    while (state.tick < releasedAt) {
        state = step(state, []);
    }
    const next = deployment.createRequest(state, nextCard, tilePosition);
    assert.deepEqual(deployment.deploy(state, next), {
        state, value: { type: "REJECTED", reason: "SLOT_LIMIT" },
    });

    const placedOnRelease = step(state, [{ type: "DEPLOY_UNIT", ref: nextCard, tilePosition }]);
    assert.deepEqual(placedOnRelease.deployment.history.at(-1)?.card, nextCard);
    assert.equal(placedOnRelease.deployment.slot.used, 1);
    assert.deepEqual(placedOnRelease.deployment.slot.pending, []);
});

test("slot limit contributions affect new deployments without changing occupied slots", () => {
    const { slot } = deployment;
    let state = battle([], {
        deployment: {
            definition: { ...account, slot: { limit: 1 } },
            cards: [1, 1, 1, 0].map(slots => ({
                unitDefinition: operator,
                definition: { ...operatorCard, slot: slots },
            })),
        },
    });
    const requests = [...cards.all(state)].map((card, index) =>
        deployment.createRequest(state, cards.ref(card), [1, index + 1]),
    );
    const [first, second, third, free] = requests;
    const occupied = deployment.deploy(state, first);
    assert.equal(occupied.value.type, "DEPLOYED");
    state = occupied.state;
    const rejection = { type: "REJECTED", reason: "SLOT_LIMIT" };
    assert.deepEqual(deployment.evaluate(state, second), rejection);

    const bonus = { id: "extra-slot", value: modifier.create({ addition: 1 }) };
    state = slot.setLimitContribution(state, bonus);
    assert.equal(slot.remaining(state), 1);
    const extra = deployment.deploy(state, second);
    assert.equal(extra.value.type, "DEPLOYED");

    state = slot.removeLimitContribution(extra.state, bonus.id);
    assert.equal(slot.remaining(state), 0);
    assert.equal(state.deployment.slot.used, 2);
    assert.deepEqual(deployment.evaluate(state, third), rejection);
    const withoutSlot = deployment.deploy(state, free);
    assert.equal(withoutSlot.value.type, "DEPLOYED");
    assert.equal(withoutSlot.state.deployment.slot.used, 2);
});

test("an unlimited slot configuration remains unlimited with limit contributions", () => {
    const { slot } = deployment;
    const initial = battle([], {
        deployment: {
            definition: { ...account, slot: { limit: null } },
            cards: [{ unitDefinition: operator, definition: operatorCard }],
        },
    });
    const state = slot.setLimitContribution(initial, {
        id: "extra-slot",
        value: modifier.create({ addition: 1 }),
    });
    assert.equal(slot.resolveLimit(state), null);
    assert.equal(slot.remaining(state), null);
    const card = cards.ref([...cards.all(state)][0]);
    const deployed = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(deployed.state.deployment.slot.used, 1);
});

test("only external movement recycles the card, and neither movement refunds DP", () => {
    for (const [reason, recycled] of [["REDEPLOY_SELF", false], ["REDEPLOY_EXTERNAL", true]]) {
        const initial = battle([], {
            deployment: {
                definition: account,
                cards: [{ definition: operatorCard, unitDefinition: operator }],
            },
        });
        const card = cards.ref([...cards.all(initial)][0]);
        const placed = deployment.deploy(initial, deployment.createRequest(initial, card, [1, 2]));
        const unit = units.ref(get(placed.state, placed.value.unitId));
        const removed = units.remove(placed.state, unit, { reason });
        const current = cards.get(removed, card);
        assert.equal(current.dp.stage, recycled ? 1 : 0);
        assert.equal(current.supply.stock, recycled ? 1 : 0);
        assert.equal(current.supply.cooldown, recycled ? 10 : 0);
        assert.equal(removed.deployment.dp.balance, 40);
    }
});

test("default cards start cooldown on deployment and only explicit recharge restores stock", () => {
    const initial = battle([], {
        deployment: {
            definition: account,
            cards: [{
                unitDefinition: operator,
                definition: {
                    ...commonCard,
                    policy: "DEFAULT",
                    supply: { ...commonCard.supply, cooldown: 2 },
                },
            }],
        },
    });
    const card = cards.ref([...cards.all(initial)][0]);
    const request = deployment.createRequest(initial, card, [1, 2]);
    const deployed = deployment.deploy(initial, request);
    assert.equal(deployed.value.type, "DEPLOYED");
    const reference = units.ref(get(deployed.state, deployed.value.unitId));
    assert.equal(cards.get(deployed.state, card).supply.cooldown, 2);
    let state = deployment.retreat(step(deployed.state, []), reference);
    assert.equal(cards.get(state, card).supply.stock, 0);

    state = deck.replace(state, cards.supply.recharge(cards.get(state, card), 1));
    assert.deepEqual(deployment.evaluate(state, request), { type: "REJECTED", reason: "COOLDOWN" });
    state = step(state, []);
    assert.equal(deployment.deploy(state, request).value.type, "DEPLOYED");
});

test("queued recovery preserves the current interval and transfers at most one available share per Tick", () => {
    let observedStock;
    let state = battle([], {
        deployment: {
            definition: account,
            cards: [{
                unitDefinition: operator,
                definition: {
                    ...commonCard,
                    policy: "QUEUED",
                    supply: {
                        ...commonCard.supply,
                        pending: 0,
                        stockLimit: 3,
                        cooldown: 2,
                    },
                    onTick(current, self) {
                        observedStock = {
                            self: self.supply.stock,
                            registered: cards.get(current, cards.ref(self)).supply.stock,
                        };
                        return current;
                    },
                },
            }],
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    const assertSupply = (expected) => {
        const { stock, pending, cooldown } = cards.get(state, card).supply;
        assert.deepEqual({ stock, pending, cooldown }, expected);
    };
    const first = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    assert.equal(first.value.type, "DEPLOYED");
    state = deployment.retreat(first.state, units.ref(get(first.state, first.value.unitId)));
    assertSupply({ stock: 0, pending: 1, cooldown: 2 });
    state = step(state, []);
    state = deck.replace(state, cards.supply.enqueue(cards.get(state, card), 2));
    assertSupply({ stock: 0, pending: 3, cooldown: 1 });
    assert.throws(() => cards.supply.consume(cards.get(state, card)), RangeError);

    const extended = cards.supply.setRedeployTimeContribution(cards.get(state, card), {
        id: "recovery-duration",
        value: [modifier.create({ addition: 2 })],
    });
    state = deck.replace(state, cards.supply.setPaused(extended, true));
    state = step(step(state, []), []);
    assertSupply({ stock: 0, pending: 3, cooldown: 1 });
    state = deck.replace(state, cards.supply.setPaused(cards.get(state, card), false));
    state = step(state, []);
    assertSupply({ stock: 1, pending: 2, cooldown: 4 });
    assert.deepEqual(observedStock, { self: 1, registered: 1 });

    const next = deployment.createRequest(state, card, [1, 2]);
    const deployed = deployment.deploy(state, next);
    assert.equal(deployed.value.type, "DEPLOYED");
    state = deployed.state;
    assertSupply({ stock: 0, pending: 2, cooldown: 4 });
    state = deck.replace(state, cards.supply.reduceCooldown(cards.get(state, card), 2));
    assertSupply({ stock: 0, pending: 2, cooldown: 2 });
    state = deck.replace(state, cards.supply.setCooldown(cards.get(state, card), 0));
    assertSupply({ stock: 0, pending: 2, cooldown: 0 });
    assert.deepEqual(deployment.evaluate(state, next), { type: "REJECTED", reason: "NO_STOCK" });

    const shortened = cards.supply.setRedeployTimeContribution(cards.get(state, card), {
        id: "recovery-duration",
        value: [modifier.create({ addition: -2 })],
    });
    state = deck.replace(state, shortened);
    state = step(state, []);
    assertSupply({ stock: 1, pending: 1, cooldown: 0 });
    state = step(state, []);
    assertSupply({ stock: 2, pending: 0, cooldown: 0 });
});

test("stock limit includes pending recovery and active limit only gates new deployments", () => {
    let state = battle([], {
        deployment: {
            definition: account,
            cards: [{
                unitDefinition: operator,
                definition: {
                    ...commonCard,
                    policy: "QUEUED",
                    supply: {
                        ...commonCard.supply,
                        pending: 1,
                        stockLimit: 2,
                    },
                },
            }],
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    const first = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    assert.equal(first.value.type, "DEPLOYED");
    state = first.state;
    const stockBonus = { id: "extra-stock", value: modifier.create({ addition: 2 }) };
    const expanded = cards.supply.setStockLimitContribution(cards.get(state, card), stockBonus);
    state = deck.replace(state, cards.supply.recharge(expanded, 4));
    assert.equal(cards.get(state, card).supply.stock, 3);

    const truncated = cards.supply.removeStockLimitContribution(cards.get(state, card), stockBonus.id);
    state = deck.replace(state, truncated);
    const { stock, pending, cooldown } = cards.get(state, card).supply;
    assert.deepEqual({ stock, pending, cooldown }, { stock: 1, pending: 1, cooldown: 10 });

    const paused = cards.supply.setPaused(cards.get(state, card), true);
    const depleted = cards.supply.setStockLimitContribution(paused, {
        id: "no-stock",
        value: modifier.create({ addition: -2 }),
    });
    const empty = depleted.supply;
    assert.deepEqual(
        [empty.stock, empty.pending, empty.cooldown, empty.paused],
        [0, 0, 0, false],
    );

    const request = deployment.createRequest(state, card, [1, 3]);
    assert.deepEqual(deployment.evaluate(state, request), { type: "REJECTED", reason: "ACTIVE_LIMIT" });
    const activeBonus = { id: "extra-active", value: modifier.create({ addition: 1 }) };
    const withActiveBonus = cards.supply.setActiveLimitContribution(cards.get(state, card), activeBonus);
    state = deck.replace(state, withActiveBonus);
    const extra = deployment.deploy(state, request);
    assert.equal(extra.value.type, "DEPLOYED");
    const restored = cards.supply.removeActiveLimitContribution(cards.get(extra.state, card), activeBonus.id);
    state = deck.replace(extra.state, cards.supply.recharge(restored, 1));
    assert.equal(deployment.deployedCount(state, card), 2);
    const third = deployment.createRequest(state, card, [1, 4]);
    assert.deepEqual(deployment.evaluate(state, third), { type: "REJECTED", reason: "ACTIVE_LIMIT" });
});

test("natural DP recovery can fund deployment during the same battle step", () => {
    const initial = battle([], {
        deployment: {
            definition: { ...account, dp: { initial: 0, min: 0, max: 10, recoveryInterval: 2 } },
            cards: [{
                definition: {
                    ...operatorCard,
                    dp: { ...operatorCard.dp, parameters: { ...operatorCard.dp.parameters, cost: 1 } },
                },
                unitDefinition: operator,
            }],
        },
    });
    const state = step(initial, []);
    const card = cards.ref([...cards.all(state)][0]);
    const tilePosition = [1, 2];
    const request = deployment.createRequest(state, card, tilePosition);
    assert.deepEqual(deployment.deploy(state, request), {
        state, value: { type: "REJECTED", reason: "INSUFFICIENT_DP" },
    });

    const deployed = step(state, [{ type: "DEPLOY_UNIT", ref: card, tilePosition }]);
    assert.deepEqual(deployed.deployment.history.at(-1)?.card, card);
    assert.equal(deployed.deployment.dp.balance, 0);
});

test("negative DP halves natural recovery, crossing zero keeps progress, and a full account banks none", () => {
    const { dp } = deployment;
    let state = battle([], {
        deployment: {
            definition: { ...account, dp: { initial: -2, min: -5, max: 3, recoveryInterval: 2 } },
            cards: [],
        },
    });
    for (let tick = 0; tick < 3; tick++) {
        state = step(state, []);
    }
    assert.equal(state.deployment.dp.balance, -2);
    state = step(state, []);
    assert.equal(state.deployment.dp.balance, -1);

    state = step(step(state, []), []);
    assert.equal(state.deployment.dp.balance, -1);
    state = dp.modify(state, 2);
    assert.equal(state.deployment.dp.balance, 1);
    state = step(state, []);
    assert.equal(state.deployment.dp.balance, 2);

    state = dp.modify(state, 8);
    assert.equal(state.deployment.dp.balance, 3);
    state = step(step(state, []), []);
    const paid = dp.pay(state, 1);
    assert.equal(paid.value, true);
    state = step(paid.state, []);
    assert.equal(state.deployment.dp.balance, 2);
    assert.equal(step(state, []).deployment.dp.balance, 3);
});

test("DP limits preserve excess unless clamped and payments honor the effective minimum", () => {
    const { dp } = deployment;
    let state = battle([], {
        deployment: {
            definition: { ...account, dp: { initial: 8, min: 0, max: 10, recoveryInterval: 2 } },
            cards: [],
        },
    });
    const lowerMax = { id: "lower-limit", value: modifier.create({ addition: -4 }) };
    state = dp.setMaxContribution(state, lowerMax);
    assert.equal(dp.resolveMax(state.deployment.dp), 6);
    assert.equal(state.deployment.dp.balance, 8);
    state = step(step(state, []), []);
    assert.equal(state.deployment.dp.balance, 8);
    assert.equal(dp.modify(state, 1).deployment.dp.balance, 8);
    assert.equal(dp.modify(state, -1).deployment.dp.balance, 7);

    state = dp.setMaxContribution(state, lowerMax, true);
    assert.equal(state.deployment.dp.balance, 6);
    state = dp.setMaxContribution(
        state,
        { ...lowerMax, value: modifier.create({ addition: -3 }) },
        true,
    );
    assert.equal(dp.resolveMax(state.deployment.dp), 7);
    assert.equal(state.deployment.dp.balance, 6);
    state = dp.removeMaxContribution(state, lowerMax.id);
    assert.equal(dp.resolveMax(state.deployment.dp), 10);
    assert.equal(state.deployment.dp.balance, 6);

    const raised = dp.setMaxContribution(state, {
        id: "raise-limit",
        value: modifier.create({ addition: 2 }),
    });
    assert.equal(dp.resolveMax(raised.deployment.dp), 12);
    assert.equal(dp.modify(raised, 5).deployment.dp.balance, 11);
    const atBaseMax = dp.modify(raised, 4);
    assert.equal(step(step(atBaseMax, []), []).deployment.dp.balance, 11);

    const lowerMin = { id: "allow-negative", value: modifier.create({ addition: -2 }) };
    state = dp.setMinContribution(state, lowerMin);
    assert.equal(dp.resolveMin(state.deployment.dp), -2);
    assert.deepEqual(dp.pay(state, 9), { state, value: false });
    const paid = dp.pay(state, 8);
    assert.equal(paid.value, true);
    assert.equal(paid.state.deployment.dp.balance, -2);
    state = dp.removeMinContribution(paid.state, lowerMin.id);
    assert.equal(dp.resolveMin(state.deployment.dp), 0);
    assert.equal(state.deployment.dp.balance, 0);
});

test("changing and removing DP recovery speed contributions preserves accrued progress", () => {
    const { dp } = deployment;
    let state = battle([], {
        deployment: {
            definition: { ...account, dp: { initial: 0, min: 0, max: 10, recoveryInterval: 4 } },
            cards: [],
        },
    });
    const slow = { id: "slow-recovery", value: modifier.create({ multiplier: -0.5 }) };
    state = step(state, []);
    state = dp.setRecoverySpeedContribution(state, slow);
    assert.equal(dp.resolveRecoverySpeed(state.deployment.dp), 1 / 8);
    state = step(state, []);
    state = dp.removeRecoverySpeedContribution(state, slow.id);
    assert.equal(dp.resolveRecoverySpeed(state.deployment.dp), 1 / 4);

    state = step(step(state, []), []);
    assert.equal(state.deployment.dp.balance, 0);
    assert.equal(step(state, []).deployment.dp.balance, 1);
});
