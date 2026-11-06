import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import * as units from "../../dist/core/unit/query.js";
import * as damage from "../../dist/core/battle/damage/hp/index.js";
import * as attribute from "../../dist/core/unit/contribution/attribute.js";
import * as actions from "../../dist/core/unit/action/index.js";

const operator = {
    id: "operator",
    hooks: Hooks.empty(),
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRules: [] },
    vitality: { maxHp: 100, defense: 0, resistance: 0 },
    card: {
        cost: 10,
        redeployTicks: 10,
        slots: 1,
        stock: 1,
        stockLimit: 1,
        activeLimit: 1,
        cooldownOnDeploy: false,
        recoverOnRetreatOrDeath: true,
        increaseCostOnRetreatOrDeath: true,
        refund: { rate: 0.5, limit: "BASE_COST" },
        deploymentRules: [],
        unitHooks: Hooks.empty(),
        initialize: (state) => ({ state, value: {} }),
    },
};
const account = {
    initialDp: 50,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: 3,
};

test("preview, evaluation and deployment use one request; rejection consumes nothing and enter sees consumption", () => {
    const constructions = [];
    const definition = {
        ...operator,
        action: {
            initialize(current) {
                constructions.push({
                    dp: current.deployment.dp,
                    stock: cards.get(current, card).stock,
                    slots: current.deployment.usedSlots,
                });
                return actions.createActions(current);
            },
        },
    };
    let state = battle([], { deployment: { definition: account, cards: [definition] } });
    const card = cards.ref([...cards.all(state)][0]);
    const request = deployment.createRequest(state, card, [1, 2], "LEFT");
    const rejected = {
        ...request,
        rules: [
            {
                id: "front-row-only",
                allows: (_current, { request: current }) => current.tilePosition[0] === 0,
            },
        ],
    };
    assert.deepEqual(deployment.preview(state, rejected), { type: "REJECTED", reason: "RULE" });
    assert.deepEqual(deployment.evaluate(state, rejected), { type: "REJECTED", reason: "RULE" });
    assert.deepEqual(deployment.deploy(state, rejected), {
        state,
        value: { type: "REJECTED", reason: "RULE" },
    });
    assert.equal(state.deployment.dp, 50);
    assert.equal(cards.get(state, card).stock, 1);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(constructions, []);

    let entered = false;
    const allowed = {
        ...rejected,
        tilePosition: [0, 2],
        hooks: Hooks.empty().set(unitLifecycle.enter, {
                id: "observe-consumption",

                invoke: (current, self) => {
                    entered = true;
                    assert.equal(current.deployment.dp, 40);
                    assert.equal(cards.get(current, card).stock, 0);
                    assert.equal(current.deployment.usedSlots, 1);
                    assert.equal(get(current, self.id).deployable.card.id, card.id);
                    return { state: current, value: undefined };
                },
            }),
    };
    assert.equal(deployment.evaluate(state, allowed), null);
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
    assert.deepEqual(constructions, [{ dp: 40, stock: 0, slots: 1 }]);
    assert.equal(entered, true);
    assert.deepEqual(get(state, deployed.value.unitId).occupancy.tile, [0, 2]);
    assert.equal(get(state, deployed.value.unitId).occupancy.direction, "LEFT");
});

test("retreat settles refund and the persistent Card before departure; confirmed death never refunds", () => {
    const departures = [];
    let state = battle([], {
        deployment: {
            definition: account,
            cards: [
                {
                    ...operator,
                    card: {
                        ...operator.card,
                        unitHooks: Hooks.empty().set(unitLifecycle.leave, {
                                id: "observe-departure",

                                invoke: (current, { unit, reason }) => {
                                    const card = cards.get(current, unit.deployable.card);
                                    departures.push({
                                        reason,
                                        dp: current.deployment.dp,
                                        stage: card.costStage,
                                        pending: card.recovery.pending,
                                        slots: current.deployment.usedSlots,
                                    });
                                    return { state: current, value: undefined };
                                },
                            }),
                    },
                },
            ],
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    const first = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    state = deployment.retreat(first.state, units.ref(get(first.state, first.value.unitId)));
    assert.equal(get(state, first.value.unitId), undefined);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(departures, [{ reason: "RETREAT", dp: 45, stage: 1, pending: 1, slots: 0 }]);

    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(cards.get(state, card).stock, 1);
    const second = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    state = second.state;
    assert.notEqual(second.value.unitId, first.value.unitId);
    assert.equal(get(state, second.value.unitId).deployable.card.id, card.id);
    assert.equal(state.deployment.dp, 30);
    const request = {
        source: null,
        target: units.ref(get(state, second.value.unitId)),
        parameters: { type: "TRUE", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    state = damage.applyDamage(request, damage.calculateDamage(state, request)).state;
    assert.equal(get(state, second.value.unitId), undefined);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(departures[1], { reason: "DEATH", dp: 30, stage: 2, pending: 1, slots: 0 });
});

test("occupancy pairs notify once and an old departure cannot clear the replacement pair", () => {
    const notifications = [];
    const support = {
        ...operator,
        id: "support",
        occupancy: {
            slot: "SUPPORT",
            onOccupantAdded: (state, pair) => {
                notifications.push(["occupantAdded", pair.occupant.id]);
                return state;
            },
            onOccupantRemoved: (state, pair) => {
                notifications.push(["occupantRemoved", pair.occupant.id]);
                return state;
            },
        },
        card: {
            ...operator.card,
            cost: 0,
            slots: 0,
            recoverOnRetreatOrDeath: false,
            increaseCostOnRetreatOrDeath: false,
        },
    };
    const summon = {
        ...operator,
        card: {
            ...operator.card,
            cost: 0,
            stock: 2,
            stockLimit: 2,
            activeLimit: null,
            recoverOnRetreatOrDeath: false,
            increaseCostOnRetreatOrDeath: false,
        },
    };
    let state = battle([], {
        deployment: { definition: { ...account, slotLimit: 1 }, cards: [support, summon] },
    });
    const [supportCard, unitCard] = [...cards.all(state)].map(cards.ref);
    const placedSupport = deployment.deploy(
        state,
        deployment.createRequest(state, supportCard, [1, 2]),
    );
    state = placedSupport.state;
    let replacement;
    const request = deployment.createRequest(state, unitCard, [1, 2]);
    const placedUnit = deployment.deploy(state, {
        ...request,
        hooks: Hooks.empty().set(unitLifecycle.leave, {
                id: "replace-on-leave",

                invoke: (current) => {
                    assert.equal(current.deployment.usedSlots, 0);
                    const result = deployment.deploy(
                        current,
                        deployment.createRequest(current, unitCard, [1, 2]),
                    );
                    assert.equal(result.value.type, "DEPLOYED");
                    replacement = result.value.unitId;
                    return { state: result.state, value: undefined };
                },
            }),
    });
    state = placedUnit.state;
    const denied = deployment.deploy(state, {
        ...request,
        quote: { ...request.quote, slots: 0 },
    });
    assert.deepEqual(denied.value, { type: "REJECTED", reason: "OCCUPIED" });
    state = deployment.retreat(state, units.ref(get(state, placedUnit.value.unitId)));
    assert.deepEqual(notifications, [
        ["occupantAdded", placedUnit.value.unitId],
        ["occupantRemoved", placedUnit.value.unitId],
        ["occupantAdded", replacement],
    ]);
    const pair = get(state, placedSupport.value.unitId).occupancy.pair;
    assert.equal(pair.occupant.id, replacement);
    assert.equal(get(state, replacement).occupancy.pair, pair);
    assert.equal(state.deployment.usedSlots, 1);
});

test("stock recovers serially with sampled budgets; pause and reduction affect only the selected segment", () => {
    let state = battle([], {
        deployment: {
            definition: account,
            cards: [{ ...operator, card: { ...operator.card, stock: 0, stockLimit: 3 } }],
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    state = cards.enqueueRecovery(state, card, 3);
    state = cards.startCooldown(state, card, 200);
    state = cards.setRedeployTimeContribution({ ...state, tick: 5 }, card, {
        id: "longer-recovery",
        value: [attribute.create({ addition: 10 })],
    });
    assert.equal(cards.get(state, card).recovery.clock.readyAtTick, 10);
    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(cards.get(state, card).stock, 1);
    assert.deepEqual(cards.get(state, card).recovery, {
        pending: 2,
        clock: { type: "RUNNING", readyAtTick: 30, durationTicks: 20 },
    });
    state = cards.pauseCooldown({ ...state, tick: 15 }, card, "RECOVERY");
    state = deployment.advance({ ...state, tick: 100 });
    assert.equal(cards.get(state, card).stock, 1);
    assert.equal(cards.get(state, card).recovery.clock.remainingTicks, 15);
    state = cards.resumeCooldown(state, card, "RECOVERY");
    assert.equal(cards.get(state, card).recovery.clock.readyAtTick, 115);
    state = cards.reduceCooldown(state, card, 100, "RECOVERY");
    assert.equal(cards.get(state, card).stock, 2);
    assert.deepEqual(cards.get(state, card).recovery, {
        pending: 1,
        clock: { type: "RUNNING", readyAtTick: 120, durationTicks: 20 },
    });
    assert.equal(cards.get(state, card).cooldown.readyAtTick, 200);
    state = deployment.advance({ ...state, tick: 120 });
    assert.equal(cards.get(state, card).stock, 3);
    assert.equal(cards.get(state, card).recovery, null);
    assert.notEqual(cards.get(state, card).cooldown, null);
});

test("negative DP halves only natural recovery, preserves progress across zero, and full time is not banked", () => {
    let state = battle([], {
        deployment: {
            definition: { ...account, initialDp: -1, minDp: -5, maxDp: 10, dpRecoveryTicks: 10 },
            cards: [],
        },
    });
    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(state.deployment.dp, -1);
    state = deployment.dp.recover(state, 2);
    assert.equal(state.deployment.dp, 1);
    state = deployment.advance({ ...state, tick: 15 });
    assert.equal(state.deployment.dp, 2);
    state = deployment.dp.recover(state, 8);
    state = deployment.advance({ ...state, tick: 100 });
    const paid = deployment.dp.pay(state, 5);
    assert.equal(paid.value, true);
    state = deployment.advance({ ...paid.state, tick: 109 });
    assert.equal(state.deployment.dp, 5);
    state = deployment.advance({ ...state, tick: 110 });
    assert.equal(state.deployment.dp, 6);
});
