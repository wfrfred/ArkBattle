// Contract: [deployment](../../docs/architecture/deployment.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import * as unitObservers from "../../dist/core/battle/unit-hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import { redeploy, retreat } from "../../dist/core/unit/capability/deployable/index.js";
import { step } from "../../dist/core/battle/runtime.js";
import * as deck from "../../dist/core/battle/deployment/deck/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import { available } from "../../dist/core/lifetime/index.js";
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
        consumption: 1,
        stock: 1,
        stockLimit: 1,
        activeLimit: 1,
        cooldown: 10,
    },
    restrictions: [],
    hooks: Hooks.empty(),
    initialize: (state) => ({ state, value: {} }),
};
const operatorCard = { ...commonCard, policy: "UNIQUE", dp: { ...commonCard.dp, increase: true } };
const account = {
    costCeiling: 99,
    dp: { initial: 50, min: 0, max: 99, recoveryInterval: null },
    slot: { limit: 3 },
};

function assertRefOrder(actual, expected) {
    assert.equal(actual.length, expected.length);
    for (const [index, reference] of actual.entries()) {
        assert.equal(reference, expected[index]);
    }
}

test("Card initialization reserves identity before Deck registration", () => {
    let state = battle([], { deployment: account, initialCards: [] });
    const input = { definition: operatorCard, unitDefinition: operator };
    const first = cards.initialize(state, input);
    const second = cards.initialize(first.state, input);
    const firstRef = cards.ref(first.value);
    const secondRef = cards.ref(second.value);
    assert.notEqual(firstRef, secondRef);
    assert.equal(firstRef.get(second.state), undefined);
    assert.equal(available(second.state, firstRef), false);
    assert.equal(secondRef.get(second.state), undefined);
    assert.deepEqual([...deck.ordered(second.state)], []);

    state = cards.add(second.state, first.value);
    state = cards.add(state, second.value);
    assert.strictEqual(firstRef.get(state), first.value);
    assert.equal(available(state, firstRef), true);
    assertRefOrder([...cards.all(state)].map(cards.ref), [firstRef, secondRef]);
    assertRefOrder([...deck.ordered(state)].map(cards.ref), [firstRef, secondRef]);
});

test("Deck uses the updated fees to sort and keeps the last order after the rule is cleared", () => {
    const input = (cost, adjustment) => {
        const contribution = { group: null, id: "tick-fee", value: cards.dp.create({ finalAddition: adjustment }) };
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
    let state = battle([], { deployment: account, initialCards: [input(5, 2), input(10, -4)] });
    const [first, second] = [...cards.all(state)].map(cards.ref);
    const ordered = (state) => [...deck.ordered(state)].map(cards.ref);
    const ordering = (state, left, right) =>
        cards.dp.resolveCost(state, left) - cards.dp.resolveCost(state, right);

    state = deck.setOrdering(state, ordering);
    state = step(state, []);
    assertRefOrder(ordered(state), [second, first]);
    assertRefOrder([...cards.all(state)].map(cards.ref), [first, second]);

    state = deck.sort(deck.setOrdering(state, () => 0));
    assertRefOrder(ordered(state), [second, first]);
    state = deck.setOrdering(state, ordering);

    const surcharged = cards.dp.setCostContribution(second.get(state), {
        group: null,
        id: "surcharge",
        value: cards.dp.create({ finalAddition: 4 }),
    });
    state = deck.replace(state, surcharged);
    assertRefOrder(ordered(state), [second, first]);
    state = deck.setOrdering(state, null);
    state = step(state, []);
    assertRefOrder(ordered(state), [second, first]);

    state = deck.setOrdering(state, ordering);
    assertRefOrder(ordered(state), [second, first]);
    state = deck.sort(state);
    assertRefOrder(ordered(state), [first, second]);
});

test("different Card definitions can deploy the same Unit Definition used by an initial unit", () => {
    const discount = {
        ...operatorCard,
        dp: { ...operatorCard.dp, parameters: { ...operatorCard.dp.parameters, cost: 7 } },
        slot: 0,
    };
    let state = battle([
        { hooks: Hooks.empty(), definition: operator, position: [7, 0], initial: { occupancy: { direction: null, tile: [0, 7] } } },
    ], {
        deployment: account,
        initialCards: [
            { definition: operatorCard, unitDefinition: operator },
            { definition: discount, unitDefinition: operator },
        ],
    });
    const initial = get(state, 0);
    assert.equal(initial.deployable.card, null);
    assert.equal(deployment.cardForUnit(state, units.ref(initial)), null);
    assert.deepEqual(state.deployment.history, []);

    const [regular, discounted] = [...cards.all(state)];
    const observedHistory = [];
    const expectedHistory = [];

    state = unitObservers.setHook(state, unitObservers.entered, {
        priority: 0,
        id: "observe-deployment-history",
        invoke(current) {
            const record = current.deployment.history.at(-1);
            assertRefOrder(record.card.get(current).units, [record.unit]);
            observedHistory.push(record);
            return { state: current, value: undefined };
        },
    });

    for (const [card, tile] of [[discounted, [1, 2]], [regular, [0, 2]]]) {
        const reference = cards.ref(card);
        const result = cards.deploy(state, { card: reference, tilePosition: tile, direction: null, quote: null, restrictions: [] });
        assert.notEqual(result.value, null);
        state = result.state;
        const unit = result.value.get(state);
        assert.strictEqual(unit.definition, operator);
        assert.equal(unit.deployable.cost, card.definition.dp.parameters.cost);
        assert.equal(unit.deployable.slots, card.definition.slot);
        expectedHistory.push({ card: reference, unit: units.ref(unit) });
    }
    assert.equal(state.deployment.dp.balance, 33);
    for (const history of [observedHistory, state.deployment.history]) {
        assertRefOrder(history.map(({ card }) => card), expectedHistory.map(({ card }) => card));
        assertRefOrder(history.map(({ unit }) => unit), expectedHistory.map(({ unit }) => unit));
    }
});

test("evaluation and deployment share a request, rejection spends nothing, and Card prepares Unit input after consumption", () => {
    const constructions = [];
    const preparations = [];
    const deployments = [];
    let entered = false;
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
                    assert.equal(preparations.length, 1);
                    constructions.push({
                        dp: current.deployment.dp.balance,
                        stock: card.get(current).supply.stock,
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
        deployment: account, initialCards: [
            { definition: operatorCard, unitDefinition: definition },
            { definition: operatorCard, unitDefinition: definition },
        ],
    });
    const [card, otherCard] = [...cards.all(state)].map(cards.ref);
    state = cards.setHook(state, otherCard, cards.beforeDeploy, {
        priority: 0,
        id: "before-deploy",
        invoke: () => assert.fail("another Card cannot prepare this deployment"),
    });
    state = cards.setHook(state, card, cards.beforeDeploy, {
        priority: 0,
        id: "before-deploy",
        invoke(current, request, input) {
            assert.equal(entered, false);
            assert.deepEqual(constructions, []);
            assert.equal(request.card, card);
            assert.equal(current.deployment.dp.balance, 40);
            assert.equal(card.get(current).supply.stock, 0);
            assert.equal(current.deployment.slot.used, 1);
            preparations.push(request);
            return {
                state: current,
                value: {
                    ...input,
                    hooks: input.hooks.set(unitLifecycle.entered, {
                        priority: 0,
                        id: "observe-consumption",
                        invoke: (current, self) => {
                            entered = true;
                            assert.equal(current.deployment.dp.balance, 40);
                            assert.equal(card.get(current).supply.stock, 0);
                            assert.equal(current.deployment.slot.used, 1);
                            assert.equal(units.ref(self).get(current).deployable.card, card);
                            return { state: current, value: undefined };
                        },
                    }).set(unitLifecycle.entered, {
                        priority: 0,
                        id: "observe-prepared-unit",
                        invoke(current, unit) {
                            assert.notEqual(unit.ref.get(current), undefined);
                            deployments.push({ id: unit.ref.id, tile: request.tilePosition });
                            return { state: current, value: undefined };
                        },
                    }),
                },
            };
        },
    });
    const request = { card, tilePosition: [1, 2], direction: "LEFT", quote: null, restrictions: [] };
    const invalid = { ...request, quote: { dp: -1, stock: 1, slots: 1 } };
    for (const operation of [cards.canDeploy, cards.deploy]) {
        assert.throws(() => operation(state, invalid), RangeError);
    }
    const rejected = {
        ...request,
        restrictions: [
            {
                group: null,
                id: "front-row-only",
                value: { allows: (_current, { request: current }) => current.tilePosition[0] === 0 },
            },
        ],
    };
    assert.equal(cards.canDeploy(state, rejected), false);
    assert.deepEqual(cards.deploy(state, rejected), {
        state,
        value: null,
    });
    assert.deepEqual(preparations, []);
    assert.deepEqual(deployments, []);

    const allowed = {
        ...rejected,
        tilePosition: [0, 2],
    };
    assert.equal(cards.canDeploy(state, allowed), true);
    const positions = cards.positions(state, card);
    assert.ok(positions.some(([row]) => row !== 0));
    assert.ok(positions.some(([row, column]) => row === 0 && column === 2));
    assert.deepEqual(preparations, []);
    assert.deepEqual(constructions, []);
    const deployed = cards.deploy(state, allowed);
    state = deployed.state;
    assert.notEqual(deployed.value, null);
    assert.deepEqual(preparations, [allowed]);
    assert.deepEqual(deployments, [{ id: deployed.value.id, tile: [0, 2] }]);
    assert.deepEqual(constructions, [{ dp: 40, stock: 0, slots: 1 }]);
    assert.equal(entered, true);
    assert.deepEqual(deployed.value.get(state).occupancy.tile, [0, 2]);
    assert.equal(deployed.value.get(state).occupancy.direction, "LEFT");
    assert.equal(deployed.value.get(state).facing.direction, "LEFT");
});

test("DEPLOY-RESTRICTION-01: policy overrides retain resource and occupancy prerequisites while zero quotes remain legal", () => {
    let state = battle([], {
        deployment: { ...account, dp: { ...account.dp, initial: 0, min: -5 }, slot: { limit: 0 } },
        initialCards: [{ definition: operatorCard, unitDefinition: operator }],
    });
    const card = cards.ref([...cards.all(state)][0]);
    const permit = { allows: () => true };
    const request = {
        card, tilePosition: [0, 2], direction: null, quote: null,
        restrictions: [
            ...["cooldown", "active-limit", "slots", "placement", "stock", "dp", "map", "occupancy"].map(name => ({ group: null, id: `@deployment/${name}`, value: permit })),
        ],
    };
    const reject = candidate => assert.deepEqual(cards.deploy(state, candidate), {
        state, value: null,
    });
    const unavailable = { ...request, quote: { dp: null, stock: 2, slots: 0 } };
    reject(unavailable);
    assert.equal(cards.canDeploy(state, unavailable), false);
    reject({ ...request, quote: { dp: 6, stock: 0, slots: 0 } });
    reject({ ...request, quote: { dp: null, stock: 0, slots: 0 }, tilePosition: [-1, 2] });

    const free = { ...request, quote: { dp: null, stock: 0, slots: 0 } };
    const first = cards.deploy(state, free);
    state = first.state;
    assert.notEqual(first.value, null);
    reject(free);
    const zero = { ...free, tilePosition: [0, 3], quote: { dp: 0, stock: 0, slots: 0 } };
    const second = cards.deploy(state, zero);
    state = second.state;
    assert.notEqual(second.value, null);
    assert.equal(card.get(state).supply.stock, 1);
    assert.equal(state.deployment.dp.balance, 0);
    assert.equal(state.deployment.slot.used, 0);
    assert.equal(first.value.get(state).deployable.cost, 10);
    assert.equal(second.value.get(state).deployable.slots, 0);
});

test("Card Definition and DeployRequest each reject duplicate restriction IDs", () => {
    const restrictions = [
        { group: null, id: "placement", value: { allows: () => false } },
        { group: null, id: "placement", value: { allows: () => true } },
    ];
    const state = battle([], {
        deployment: account,
        initialCards: [{ definition: operatorCard, unitDefinition: operator }],
    });

    assert.throws(() => cards.initialize(state, {
        definition: { ...operatorCard, restrictions: restrictions },
        unitDefinition: operator,
    }), /duplicate restriction identity/);

    const card = cards.ref([...cards.all(state)][0]);
    const request = { card, tilePosition: [0, 2], direction: null, quote: null, restrictions };
    assert.throws(() => cards.deploy(state, request), /duplicate restriction identity/);
});

test("DEPLOY-RESTRICTION-02: Definition, Card and Request replace IDs before group resolution", () => {
    const permit = { allows: () => true };
    const deny = { allows: () => false };
    let state = battle([], {
        deployment: { ...account, slot: { limit: 0 } },
        initialCards: [{ unitDefinition: operator, definition: {
            ...operatorCard, supply: { ...operatorCard.supply, activeLimit: 0 },
            restrictions: [
                { group: null, id: "@deployment/cooldown", value: deny },
                { id: "@deployment/active-limit", value: deny, group: { id: "permission", priority: 1 } },
            ],
        } }],
    });
    const card = cards.ref([...cards.all(state)][0]);
    state = deck.replace(state, cards.supply.setCooldown(card.get(state), 10));
    state = cards.setRestriction(state, card, { group: null, id: "@deployment/cooldown", value: permit });
    state = cards.setRestriction(state, card, {
        id: "@deployment/slots", value: deny, group: { id: "permission", priority: 2 },
    });
    const request = { card, tilePosition: [0, 2], direction: null, quote: null, restrictions: [] };
    assert.equal(cards.canDeploy(state, request), false);
    const allowed = { ...request, restrictions: [
        { id: "@deployment/slots", value: permit, group: { id: "permission", priority: 2 } },
    ] };
    const rejected = { ...allowed, restrictions: [
        ...allowed.restrictions,
        { group: null, id: "@deployment/cooldown", value: deny },
    ] };
    assert.equal(cards.canDeploy(state, rejected), false);
    assert.notEqual(cards.deploy(state, allowed).value, null);
});

test("retreat refunds before removal, and death delays global slot release independently of Card recovery", () => {
    const tilePosition = [1, 2];
    const departures = [];
    const retreats = [];
    let state = battle([], {
        deployment: { ...account, slot: { limit: 1 } },
        initialCards: [
            {
                definition: operatorCard,
                unitDefinition: {
                    ...operator,
                    hooks: Hooks.empty()
                        .set(unitLifecycle.removing, {
                            priority: 0,
                            id: "observe-retreat-refund",
                            accepts: (_current, { reason }) => reason === "RETREAT",
                            invoke: (current, { unit }) => {
                                const card = unit.deployable.card.get(current);
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
                            priority: -1,
                            id: "observe-departure",
                            invoke: (current, { unit, reason }) => {
                                const card = unit.deployable.card.get(current);
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
    });
    const [card, nextCard] = [...cards.all(state)].map(cards.ref);
    const first = cards.deploy(state, { card, tilePosition, direction: null, quote: null, restrictions: [] });
    const firstUnit = first.value;
    state = retreat(first.state, firstUnit);
    assert.equal(first.value.get(state), undefined);
    assert.deepEqual(card.get(state).units, []);
    assert.deepEqual(retreats, [{ dp: 45, stage: 0, stock: 0, cooldown: 0 }]);
    assert.deepEqual(departures, [
        { reason: "RETREAT", dp: 45, stage: 1, stock: 1, cooldown: 10, slots: 0 },
    ]);

    const returning = { card, tilePosition, direction: null, quote: null, restrictions: [] };
    assert.equal(cards.canDeploy(state, returning), false);
    for (let elapsed = 0; elapsed < 10; elapsed++) {
        state = step(state, []);
    }
    const second = cards.deploy(state, returning);
    assert.notEqual(second.value, null);
    state = second.state;
    assert.notEqual(second.value, first.value);
    const secondUnit = second.value;
    assert.equal(deployment.cardForUnit(state, firstUnit), card);
    assertRefOrder(card.get(state).units, [secondUnit]);
    assert.equal(state.deployment.dp.balance, 30);
    const request = {
        source: null,
        target: secondUnit,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    state = damage.applyDamage(request, damage.calculateDamage(state, request, null), null).state;
    assert.equal(second.value.get(state), undefined);
    assert.equal(at(state.battlefield, tilePosition)?.occupant ?? null, null);
    assert.equal(deployment.cardForUnit(state, secondUnit), card);
    assert.deepEqual(card.get(state).units, []);
    assert.deepEqual(departures[1], {
        reason: "DEATH", dp: 30, stage: 2, stock: 1, cooldown: 10, slots: 1,
    });

    const releasedAt = state.tick + TICKS_PER_SECOND;
    while (state.tick < releasedAt) {
        state = step(state, []);
    }
    const next = { card: nextCard, tilePosition, direction: null, quote: null, restrictions: [] };
    assert.deepEqual(cards.deploy(state, next), {
        state, value: null,
    });

    const released = step(state, []);
    const adjusted = cards.dp.setCostContribution(card.get(released), {
        group: null,
        id: "next-deployment-cost",
        value: cards.dp.create({
            cost: 17, baseAddition: 4, maxMultiplier: -0.25, costScale: 0.75, finalAddition: -2,
        }),
    });
    const surcharged = deck.replace(released, adjusted);
    assert.equal(cards.deploy(surcharged, returning).state.deployment.dp.balance, 11);
    const restored = deck.replace(surcharged, cards.dp.removeCostContribution(adjusted, "next-deployment-cost"));
    assert.equal(cards.deploy(restored, returning).state.deployment.dp.balance, 10);

    const placedOnRelease = step(state, [{ direction: null, type: "DEPLOY_UNIT", ref: nextCard, tilePosition }]);
    assert.equal(placedOnRelease.deployment.history.at(-1)?.card, nextCard);
    assert.equal(placedOnRelease.deployment.slot.used, 1);
    assert.deepEqual(placedOnRelease.deployment.slot.pending, []);
});

test("slot limit contributions affect new deployments without changing occupied slots", () => {
    const { slot } = deployment;
    let state = battle([], {
        deployment: { ...account, slot: { limit: 1 } },
        initialCards: [1, 1, 1, 0].map(slots => ({
            unitDefinition: operator,
            definition: { ...operatorCard, slot: slots },
        })),
    });
    const requests = [...cards.all(state)].map((card, index) => ({
        card: cards.ref(card), tilePosition: [1, index + 1], direction: null, quote: null, restrictions: [],
    }));
    const [first, second, third, free] = requests;
    const occupied = cards.deploy(state, first);
    assert.notEqual(occupied.value, null);
    state = occupied.state;
    assert.equal(cards.canDeploy(state, second), false);

    const bonus = { group: null, id: "extra-slot", value: modifier.create({ addition: 1 }) };
    state = slot.setLimitContribution(state, bonus);
    assert.equal(slot.remaining(state), 1);
    const extra = cards.deploy(state, second);
    assert.notEqual(extra.value, null);

    state = slot.removeLimitContribution(extra.state, bonus.id);
    assert.equal(slot.remaining(state), 0);
    assert.equal(state.deployment.slot.used, 2);
    assert.equal(cards.canDeploy(state, third), false);
    const withoutSlot = cards.deploy(state, free);
    assert.notEqual(withoutSlot.value, null);
    assert.equal(withoutSlot.state.deployment.slot.used, 2);
});

test("an unlimited slot configuration remains unlimited with limit contributions", () => {
    const { slot } = deployment;
    const initial = battle([], {
        deployment: { ...account, slot: { limit: null } },
        initialCards: [{ unitDefinition: operator, definition: operatorCard }],
    });
    const state = slot.setLimitContribution(initial, {
        group: null,
        id: "extra-slot",
        value: modifier.create({ addition: 1 }),
    });
    assert.equal(slot.resolveLimit(state), null);
    assert.equal(slot.remaining(state), null);
    const card = cards.ref([...cards.all(state)][0]);
    const deployed = cards.deploy(state, { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] });
    assert.notEqual(deployed.value, null);
    assert.equal(deployed.state.deployment.slot.used, 1);
});

test("special movement replaces the Unit on the same Card using current deployment facts and normal entered notifications", () => {
    const entered = [];
    const departures = [];
    let state = battle([], {
        deployment: { ...account, slot: { limit: 2 } },
        initialCards: [{
            definition: operatorCard,
            unitDefinition: {
                ...operator,
                hooks: Hooks.empty().set(unitLifecycle.removed, {
                    priority: 0,
                    id: "observe-movement",
                    invoke(current, { unit, reason }) {
                        departures.push({ unit: unit.ref, reason });
                        return { state: current, value: undefined };
                    },
                }),
            },
        }],
    });
    const card = cards.ref([...cards.all(state)][0]);
    state = unitObservers.setHook(state, unitObservers.entered, {
        priority: 0,
        id: "observe-redeployment",
        invoke(current, unit) {
            assertRefOrder(card.get(current).units, [unit.ref]);
            assert.equal(current.deployment.history.at(-1).unit, unit.ref);
            entered.push(unit.ref);
            return { state: current, value: undefined };
        },
    });
    const placed = cards.deploy(state, {
        card, tilePosition: [1, 2], direction: "LEFT",
        quote: { dp: 8, stock: 1, slots: 2 }, restrictions: [],
    });
    const original = placed.value;
    assert.equal(original.get(placed.state).deployable.cost, 10);
    state = deck.replace(placed.state, cards.dp.setCostContribution(card.get(placed.state), {
        group: null, id: "new-cost", value: cards.dp.create({ baseAddition: 8 }),
    }));
    const moved = redeploy(state, original, [1, 3], null, "SELF");
    assert.notEqual(moved.value, null);
    assert.notEqual(moved.value, original);
    state = moved.state;
    assert.equal(original.get(state), undefined);
    assert.equal(at(state.battlefield, [1, 2])?.occupant ?? null, null);
    assert.deepEqual(moved.value.get(state).occupancy.tile, [1, 3]);
    assert.equal(moved.value.get(state).occupancy.direction, "LEFT");
    assert.equal(moved.value.get(state).deployable.cost, 18);
    assert.equal(moved.value.get(state).deployable.refund.limit, 18);
    assert.equal(moved.value.get(state).deployable.slots, 1);
    assert.deepEqual([card.get(state).dp.stage, card.get(state).supply.stock, card.get(state).supply.cooldown], [0, 0, 0]);

    const movedAgain = redeploy(state, moved.value, [1, 4], "RIGHT", "EXTERNAL");
    assert.notEqual(movedAgain.value, null);
    assert.notEqual(movedAgain.value, moved.value);
    state = movedAgain.state;
    assert.equal(moved.value.get(state), undefined);
    assert.equal(at(state.battlefield, [1, 3])?.occupant ?? null, null);
    assert.deepEqual(movedAgain.value.get(state).occupancy.tile, [1, 4]);
    assert.equal(movedAgain.value.get(state).occupancy.direction, "RIGHT");
    assert.equal(movedAgain.value.get(state).deployable.cost, 27);
    assert.equal(state.deployment.dp.balance, 42);
    assert.equal(state.deployment.slot.used, 1);
    assert.deepEqual(state.deployment.slot.pending, []);
    assert.deepEqual([card.get(state).dp.stage, card.get(state).supply.stock, card.get(state).supply.cooldown], [1, 1, 10]);
    assert.deepEqual(departures.map(({ reason }) => reason), ["REDEPLOY_SELF", "REDEPLOY_EXTERNAL"]);
    assertRefOrder(departures.map(({ unit }) => unit), [original, moved.value]);
    assertRefOrder(entered, [original, moved.value, movedAgain.value]);
    assertRefOrder(state.deployment.history.map(({ unit }) => unit), entered);
    assertRefOrder(state.deployment.history.map(({ card }) => card), [card, card, card]);
    assert.deepEqual(redeploy(state, original, [1, 2], null, "SELF"), { state, value: null });
});

test("rejected movement ends the old Unit and recycles its Card exactly once without refund", () => {
    for (const [kind, tilePosition] of [["SELF", [1, 3]], ["EXTERNAL", [-1, 2]]]) {
        const initial = battle([
            { hooks: Hooks.empty(), definition: operator, position: [3, 1], initial: { occupancy: { direction: null, tile: [1, 3] } } },
        ], {
            deployment: { ...account, slot: { limit: 1 } },
            initialCards: [{ definition: operatorCard, unitDefinition: operator }],
        });
        const blocker = get(initial, 0).ref;
        assert.deepEqual(redeploy(initial, blocker, [1, 4], null, kind), { state: initial, value: null });
        const card = cards.ref([...cards.all(initial)][0]);
        const placed = cards.deploy(initial, { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] });
        const moved = redeploy(placed.state, placed.value, tilePosition, null, kind);
        assert.equal(moved.value, null);
        const state = moved.state;
        assert.equal(placed.value.get(state), undefined);
        assert.notEqual(blocker.get(state), undefined);
        assert.equal(at(state.battlefield, [1, 2])?.occupant ?? null, null);
        assert.deepEqual(card.get(state).units, []);
        assert.deepEqual([card.get(state).dp.stage, card.get(state).supply.stock, card.get(state).supply.cooldown], [1, 1, 10]);
        assert.equal(state.deployment.dp.balance, 40);
        assert.equal(state.deployment.slot.used, 0);
        assert.deepEqual(state.deployment.slot.pending, []);
        assertRefOrder(state.deployment.history.map(({ unit }) => unit), [placed.value]);
    }
});

test("scripts and expiry unlink without recycling or refund", () => {
    for (const reason of ["SCRIPT", "EXPIRED"]) {
        const initial = battle([], {
            deployment: account,
            initialCards: [{ definition: operatorCard, unitDefinition: operator }],
        });
        const card = cards.ref([...cards.all(initial)][0]);
        const placed = cards.deploy(initial, { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] });
        const unit = placed.value;
        const removed = units.remove(placed.state, unit, { reason });
        const current = card.get(removed);
        assert.deepEqual(current.units, []);
        assert.equal(current.dp.stage, 0);
        assert.equal(current.supply.stock, 0);
        assert.equal(current.supply.cooldown, 0);
        assert.equal(removed.deployment.dp.balance, 40);
    }
});

test("default cards start cooldown even without stock consumption and only explicit recharge restores stock", () => {
    for (const consumption of [1, 0]) {
        const initial = battle([], {
            deployment: account,
            initialCards: [{
                unitDefinition: operator,
                definition: {
                    ...commonCard,
                    policy: "DEFAULT",
                    supply: { ...commonCard.supply, consumption, stock: consumption, cooldown: 2 },
                },
            }],
        });
        const card = cards.ref([...cards.all(initial)][0]);
        const request = { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] };
        const deployed = cards.deploy(initial, request);
        assert.notEqual(deployed.value, null);
        const reference = deployed.value;
        assert.equal(card.get(deployed.state).supply.cooldown, 2);
        assert.equal(card.get(deployed.state).supply.stock, 0);
        let state = retreat(step(deployed.state, []), reference);
        assert.equal(card.get(state).supply.stock, 0);

        if (consumption > 0) {
            state = deck.replace(state, cards.supply.recharge(card.get(state), 1));
        }
        assert.equal(cards.canDeploy(state, request), false);
        state = step(state, []);
        const redeployed = cards.deploy(state, request);
        assert.notEqual(redeployed.value, null);
        assert.equal(card.get(redeployed.state).supply.stock, 0);
        assert.equal(card.get(redeployed.state).supply.cooldown, 2);
    }
});

test("queued recovery preserves the current interval and transfers at most one available share per Tick", () => {
    let observedStock;
    let state = battle([], {
        deployment: account,
        initialCards: [{
            unitDefinition: operator,
            definition: {
                ...commonCard,
                policy: "QUEUED",
                supply: {
                    ...commonCard.supply,
                    pending: 0,
                    stockLimit: 3,
                    activeLimit: null,
                    cooldown: 2,
                },
                onTick(current, self) {
                    observedStock = {
                        self: self.supply.stock,
                        registered: cards.ref(self).get(current).supply.stock,
                    };
                    return current;
                },
            },
        }],
    });
    const card = cards.ref([...cards.all(state)][0]);
    const assertSupply = (expected) => {
        const { stock, pending, cooldown } = card.get(state).supply;
        assert.deepEqual({ stock, pending, cooldown }, expected);
    };
    const first = cards.deploy(state, { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] });
    assert.notEqual(first.value, null);
    state = retreat(first.state, first.value);
    assertSupply({ stock: 0, pending: 1, cooldown: 2 });
    state = step(state, []);
    state = deck.replace(state, cards.supply.enqueue(card.get(state), 2));
    assertSupply({ stock: 0, pending: 3, cooldown: 1 });
    assert.throws(() => cards.supply.consume(card.get(state)), RangeError);

    const extended = cards.supply.setRedeployTimeContribution(card.get(state), {
        group: null,
        id: "recovery-duration",
        value: [modifier.create({ addition: 2 })],
    });
    state = deck.replace(state, cards.supply.setPaused(extended, true));
    state = step(step(state, []), []);
    assertSupply({ stock: 0, pending: 3, cooldown: 1 });
    state = deck.replace(state, cards.supply.setPaused(card.get(state), false));
    state = step(state, []);
    assertSupply({ stock: 1, pending: 2, cooldown: 4 });
    assert.deepEqual(observedStock, { self: 1, registered: 1 });

    const next = { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] };
    const deployed = cards.deploy(state, next);
    assert.notEqual(deployed.value, null);
    state = deployed.state;
    assertSupply({ stock: 0, pending: 2, cooldown: 4 });
    state = deck.replace(state, cards.supply.reduceCooldown(card.get(state), 2));
    assertSupply({ stock: 0, pending: 2, cooldown: 2 });
    state = deck.replace(state, cards.supply.setCooldown(card.get(state), 0));
    assertSupply({ stock: 0, pending: 2, cooldown: 0 });
    assert.equal(cards.canDeploy(state, { ...next, tilePosition: [1, 3] }), false);

    const shortened = cards.supply.setRedeployTimeContribution(card.get(state), {
        group: null,
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
        deployment: account,
        initialCards: [{
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
    });
    const card = cards.ref([...cards.all(state)][0]);
    const first = cards.deploy(state, { card, tilePosition: [1, 2], direction: null, quote: null, restrictions: [] });
    assert.notEqual(first.value, null);
    state = first.state;
    const stockBonus = { group: null, id: "extra-stock", value: modifier.create({ addition: 2 }) };
    const expanded = cards.supply.setStockLimitContribution(card.get(state), stockBonus);
    state = deck.replace(state, cards.supply.recharge(expanded, 4));
    assert.equal(card.get(state).supply.stock, 3);

    const truncated = cards.supply.removeStockLimitContribution(card.get(state), stockBonus.id);
    state = deck.replace(state, truncated);
    const { stock, pending, cooldown } = card.get(state).supply;
    assert.deepEqual({ stock, pending, cooldown }, { stock: 1, pending: 1, cooldown: 10 });

    const paused = cards.supply.setPaused(card.get(state), true);
    const depleted = cards.supply.setStockLimitContribution(paused, {
        group: null,
        id: "no-stock",
        value: modifier.create({ addition: -2 }),
    });
    const empty = depleted.supply;
    assert.deepEqual(
        [empty.stock, empty.pending, empty.cooldown, empty.paused],
        [0, 0, 0, false],
    );

    const request = { card, tilePosition: [1, 3], direction: null, quote: null, restrictions: [] };
    assert.equal(cards.canDeploy(state, request), false);
    const activeBonus = { group: null, id: "extra-active", value: modifier.create({ addition: 1 }) };
    const withActiveBonus = cards.supply.setActiveLimitContribution(card.get(state), activeBonus);
    state = deck.replace(state, withActiveBonus);
    const extra = cards.deploy(state, request);
    assert.notEqual(extra.value, null);
    const restored = cards.supply.removeActiveLimitContribution(card.get(extra.state), activeBonus.id);
    state = deck.replace(extra.state, cards.supply.recharge(restored, 1));
    assertRefOrder(card.get(state).units, [first.value, extra.value]);
    const third = { card, tilePosition: [1, 4], direction: null, quote: null, restrictions: [] };
    assert.equal(cards.canDeploy(state, third), false);
});

test("natural DP recovery can fund deployment during the same battle step", () => {
    const initial = battle([], {
        deployment: { ...account, dp: { initial: 0, min: 0, max: 10, recoveryInterval: 2 } },
        initialCards: [{
            definition: {
                ...operatorCard,
                dp: { ...operatorCard.dp, parameters: { ...operatorCard.dp.parameters, cost: 1 } },
            },
            unitDefinition: operator,
        }],
    });
    const state = step(initial, []);
    const card = cards.ref([...cards.all(state)][0]);
    const tilePosition = [1, 2];
    const request = { card, tilePosition, direction: null, quote: null, restrictions: [] };
    assert.deepEqual(cards.deploy(state, request), {
        state, value: null,
    });

    const deployed = step(state, [{ direction: null, type: "DEPLOY_UNIT", ref: card, tilePosition }]);
    assert.equal(deployed.deployment.history.at(-1)?.card, card);
    assert.equal(deployed.deployment.dp.balance, 0);
});

test("negative DP halves natural recovery, crossing zero keeps progress, and a full account banks none", () => {
    const { dp } = deployment;
    let state = battle([], {
        deployment: { ...account, dp: { initial: -2, min: -5, max: 3, recoveryInterval: 2 } },
        initialCards: [],
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
        deployment: { ...account, dp: { initial: 8, min: 0, max: 10, recoveryInterval: 2 } },
        initialCards: [],
    });
    const lowerMax = { group: null, id: "lower-limit", value: modifier.create({ addition: -4 }) };
    state = dp.setMaxContribution(state, lowerMax, false);
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
        group: null,
        id: "raise-limit",
        value: modifier.create({ addition: 2 }),
    }, false);
    assert.equal(dp.resolveMax(raised.deployment.dp), 12);
    assert.equal(dp.modify(raised, 5).deployment.dp.balance, 11);
    const atBaseMax = dp.modify(raised, 4);
    assert.equal(step(step(atBaseMax, []), []).deployment.dp.balance, 11);

    const lowerMin = { group: null, id: "allow-negative", value: modifier.create({ addition: -2 }) };
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
        deployment: { ...account, dp: { initial: 0, min: 0, max: 10, recoveryInterval: 4 } },
        initialCards: [],
    });
    const slow = { group: null, id: "slow-recovery", value: modifier.create({ multiplier: -0.5 }) };
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
