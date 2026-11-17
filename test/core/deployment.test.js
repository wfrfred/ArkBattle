// Contract: [deployment](../../docs/architecture/deployment.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import * as units from "../../dist/core/unit/query.js";
import * as damage from "../../dist/core/battle/resource/hp/damage/index.js";
import * as attribute from "../../dist/core/unit/attribute.js";
import * as actions from "../../dist/core/unit/action/index.js";

const operator = {
    id: "operator",
    hooks: Hooks.empty(),
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRestrictions: [] },
    vitality: defineVitality(100),
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
        deploymentRestrictions: [],
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
    const deployments = [];
    const definition = {
        ...operator,
        facing: { restrictions: [] },
        action: { speed: defineAttribute(100, 20), interval: defineAttribute(10),
            initialize(current, self) {
                constructions.push({
                    dp: current.deployment.dp,
                    stock: cards.get(current, card).stock,
                    slots: current.deployment.usedSlots,
                });
                return actions.createActions(current, self);
            },
        },
    };
    let state = battle([], { deployment: { definition: account, cards: [definition] } });
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
    for (const operation of [
        deployment.preview, deployment.evaluate, deployment.positions, deployment.deploy,
    ]) {
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
    assert.equal(state.deployment.dp, 50);
    assert.equal(cards.get(state, card).stock, 1);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(constructions, []);
    assert.deepEqual(deployments, []);

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
                    assert.deepEqual(deployment.cardForUnit(current, units.ref(self)), card);
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
    assert.deepEqual(deployments, [{ id: deployed.value.unitId, tile: [0, 2] }]);
    assert.deepEqual(constructions, [{ dp: 40, stock: 0, slots: 1 }]);
    assert.equal(entered, true);
    assert.deepEqual(get(state, deployed.value.unitId).occupancy.tile, [0, 2]);
    assert.equal(get(state, deployed.value.unitId).occupancy.direction, "LEFT");
    assert.equal(get(state, deployed.value.unitId).facing.direction, "LEFT");
});

test("DEPLOY-RESTRICTION-01: policy overrides retain resource and occupancy prerequisites while zero quotes remain legal", () => {
    let state = battle([], { deployment: {
        definition: { ...account, initialDp: 0, minDp: -5, slotLimit: 0 }, cards: [operator],
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
    const reject = (candidate, reason) => {
        const expected = { type: "REJECTED", reason };
        assert.deepEqual(deployment.evaluate(state, candidate), expected);
        assert.deepEqual(deployment.preview(state, candidate), expected);
        assert.deepEqual(deployment.deploy(state, candidate), { state, value: expected });
        const positions = deployment.positions(state, candidate);
        assert.equal(positions.some(tile => tile[0] === candidate.tilePosition[0] && tile[1] === candidate.tilePosition[1]), false);
        if (reason === "NO_STOCK" || reason === "INSUFFICIENT_DP") assert.deepEqual(positions, []);
    };
    reject({ ...request, quote: { dp: null, stock: 2, slots: 0 } }, "NO_STOCK");
    reject({ ...request, quote: { dp: 6, stock: 0, slots: 0 } }, "INSUFFICIENT_DP");
    reject({ ...request, quote: { dp: null, stock: 0, slots: 0 }, tilePosition: [-1, 2] }, "OUTSIDE_MAP");

    const free = { ...request, quote: { dp: null, stock: 0, slots: 0 } };
    const first = deployment.deploy(state, free);
    state = first.state;
    assert.equal(first.value.type, "DEPLOYED");
    reject(free, "OCCUPIED");
    const zero = { ...free, tilePosition: [0, 3], quote: { dp: 0, stock: 0, slots: 0 } };
    assert.equal(deployment.evaluate(state, zero), null);
    const second = deployment.deploy(state, zero);
    state = second.state;
    assert.equal(second.value.type, "DEPLOYED");
    assert.equal(cards.get(state, card).stock, 1);
    assert.equal(state.deployment.dp, 0);
    assert.equal(state.deployment.usedSlots, 0);
    assert.equal(get(state, first.value.unitId).deployable.cost, 10);
    assert.equal(get(state, second.value.unitId).deployable.slots, 0);
});

test("DEPLOY-RESTRICTION-02: Definition, Card and Request replace IDs before group resolution and deterministic rejection", () => {
    const permit = { allows: () => true };
    const deny = { allows: () => false };
    let state = battle([], { deployment: {
        definition: { ...account, slotLimit: 0 }, cards: [{ ...operator, card: {
            ...operator.card, activeLimit: 0,
            deploymentRestrictions: [
                { id: "@deployment/cooldown", value: deny },
                { id: "@deployment/active-limit", value: deny, group: { id: "permission", priority: 1 } },
            ],
        } }],
    } });
    const card = cards.ref([...cards.all(state)][0]);
    state = cards.startCooldown(state, card, 10);
    state = cards.setRestriction(state, card, { id: "@deployment/cooldown", value: permit });
    state = cards.setRestriction(state, card, {
        id: "@deployment/slots", value: deny, group: { id: "permission", priority: 2 },
    });
    const request = deployment.createRequest(state, card, [0, 2]);
    assert.deepEqual(deployment.evaluate(state, request), { type: "REJECTED", reason: "SLOT_LIMIT" });
    const allowed = { ...request, restrictions: [
        { id: "@deployment/slots", value: permit, group: { id: "permission", priority: 2 } },
    ] };
    assert.equal(deployment.evaluate(state, allowed), null);
    assert.equal(deployment.preview(state, allowed).type, "ALLOWED");
    const rejected = { ...allowed, restrictions: [
        ...allowed.restrictions,
        { id: "@deployment/cooldown", value: deny },
        { id: "@deployment/active-limit", value: deny },
    ] };
    assert.deepEqual(deployment.evaluate(state, rejected), { type: "REJECTED", reason: "ACTIVE_LIMIT" });
    assert.equal(deployment.deploy(state, allowed).value.type, "DEPLOYED");
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
    const firstUnit = units.ref(get(first.state, first.value.unitId));
    state = deployment.retreat(first.state, firstUnit);
    assert.equal(get(state, first.value.unitId), undefined);
    assert.deepEqual(deployment.cardForUnit(state, firstUnit), card);
    assert.equal(deployment.activeCount(state, card), 0);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(departures, [{ reason: "RETREAT", dp: 45, stage: 1, pending: 1, slots: 0 }]);

    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(cards.get(state, card).stock, 1);
    const second = deployment.deploy(state, deployment.createRequest(state, card, [1, 2]));
    state = second.state;
    assert.notEqual(second.value.unitId, first.value.unitId);
    assert.equal(get(state, second.value.unitId).deployable.card.id, card.id);
    const secondUnit = units.ref(get(state, second.value.unitId));
    assert.deepEqual(deployment.cardForUnit(state, firstUnit), card);
    assert.equal(deployment.activeCount(state, card), 1);
    assert.equal(state.deployment.dp, 30);
    const request = {
        source: null,
        target: units.ref(get(state, second.value.unitId)),
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    state = damage.applyDamage(request, damage.calculateDamage(state, request)).state;
    assert.equal(get(state, second.value.unitId), undefined);
    assert.deepEqual(deployment.cardForUnit(state, secondUnit), card);
    assert.equal(deployment.activeCount(state, card), 0);
    assert.equal(state.deployment.usedSlots, 0);
    assert.deepEqual(departures[1], { reason: "DEATH", dp: 30, stage: 2, pending: 1, slots: 0 });
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
    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(cards.get(state, card).stock, 1);
    state = cards.pauseCooldown({ ...state, tick: 15 }, card, "RECOVERY");
    state = deployment.advance({ ...state, tick: 100 });
    assert.equal(cards.get(state, card).stock, 1);
    state = cards.resumeCooldown(state, card, "RECOVERY");
    state = deployment.advance({ ...state, tick: 114 });
    assert.equal(cards.get(state, card).stock, 1);
    state = cards.reduceCooldown(state, card, 100, "RECOVERY");
    assert.equal(cards.get(state, card).stock, 2);
    state = deployment.advance({ ...state, tick: 133 });
    assert.equal(cards.get(state, card).stock, 2);
    state = deployment.advance({ ...state, tick: 134 });
    assert.equal(cards.get(state, card).stock, 3);
    assert.equal(cards.get(state, card).recovery, null);
    state = deployment.advance({ ...state, tick: 199 });
    assert.notEqual(cards.get(state, card).cooldown, null);
    state = deployment.advance({ ...state, tick: 200 });
    assert.equal(cards.get(state, card).cooldown, null);
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
