// Contract: [deployment](../../docs/architecture/deployment.md).
import { attribute as defineAttribute, vitality as defineVitality } from "../helpers/attribute.js";
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import * as unitObservers from "../../dist/core/battle/unit-hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
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
    deployable: { retreatRestrictions: [] },
    vitality: defineVitality(100),
};
const operatorCard = {
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
};
const account = {
    initialDp: 50,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: 3,
};

test("Card initialization reserves identity and Card writes refresh deployment order", () => {
    const definition = (rank) => ({
        ...operatorCard,
        initialize: (state) => ({ state, value: { rank } }),
    });
    let state = battle([], { deployment: { definition: account, cards: [] } });
    state = deployment.setOrdering(state, (current, references) =>
        [...references].sort((left, right) =>
            cards.get(current, left).state.rank - cards.get(current, right).state.rank,
        ),
    );
    const first = cards.initialize(state, { definition: definition(10), unitDefinition: operator });
    const second = cards.initialize(first.state, { definition: definition(5), unitDefinition: operator });
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
    assert.deepEqual([...deployment.ordered(state)].map(cards.ref), [secondRef, firstRef]);

    state = cards.setState(state, firstRef, { rank: 1 });
    assert.deepEqual([...deployment.ordered(state)].map(cards.ref), [firstRef, secondRef]);
});

test("different Card definitions can deploy the same Unit Definition used by an initial unit", () => {
    const discount = { ...operatorCard, cost: 7, slots: 0 };
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
    assert.strictEqual(initial.definition, operator);
    assert.equal(initial.deployable.card, null);
    assert.equal(deployment.cardForUnit(state, units.ref(initial)), null);
    assert.deepEqual(state.deployment.history, []);

    const [regular, discounted] = [...cards.all(state)];
    assert.strictEqual(regular.definition, operatorCard);
    assert.strictEqual(discounted.definition, discount);
    assert.strictEqual(regular.unitDefinition, operator);
    assert.strictEqual(discounted.unitDefinition, operator);

    state = unitObservers.setHook(state, unitObservers.entered, {
        id: "observe-deployment-history",
        invoke(current, unit) {
            assert.deepEqual(current.deployment.history.at(-1), {
                card: unit.deployable.card,
                unit: units.ref(unit),
            });
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
        assert.equal(unit.deployable.cost, card.definition.cost);
        assert.equal(unit.deployable.slots, card.definition.slots);
        assert.deepEqual(deployment.cardForUnit(state, units.ref(unit)), reference);
    }
    assert.equal(state.deployment.dp.value, 33);
    assert.equal(state.deployment.slot.used, 1);
    assert.equal(deployment.cardForUnit(state, units.ref(initial)), null);
    assert.deepEqual(state.deployment.history.map(({ card }) => card), [
        cards.ref(discounted),
        cards.ref(regular),
    ]);
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
                        dp: current.deployment.dp.value,
                        stock: cards.get(current, card).stock,
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
    assert.equal(state.deployment.dp.value, 50);
    assert.equal(cards.get(state, card).stock, 1);
    assert.equal(state.deployment.slot.used, 0);
    assert.deepEqual(constructions, []);
    assert.deepEqual(deployments, []);

    let entered = false;
    const allowed = {
        ...rejected,
        tilePosition: [0, 2],
        hooks: Hooks.empty().set(unitLifecycle.entered, {
                id: "observe-consumption",

                invoke: (current, self) => {
                    entered = true;
                    assert.equal(current.deployment.dp.value, 40);
                    assert.equal(cards.get(current, card).stock, 0);
                    assert.equal(current.deployment.slot.used, 1);
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
        definition: { ...account, initialDp: 0, minDp: -5, slotLimit: 0 },
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
    assert.equal(state.deployment.dp.value, 0);
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
    for (const operation of [
        deployment.preview, deployment.evaluate, deployment.positions, deployment.deploy,
    ]) {
        assert.throws(() => operation(state, request), /duplicate restriction identity/);
    }
});

test("DEPLOY-RESTRICTION-02: Definition, Card and Request replace IDs before group resolution and deterministic rejection", () => {
    const permit = { allows: () => true };
    const deny = { allows: () => false };
    let state = battle([], { deployment: {
        definition: { ...account, slotLimit: 0 }, cards: [{ unitDefinition: operator, definition: {
            ...operatorCard, activeLimit: 0,
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

test("retreat refunds before removal, and death delays global slot release independently of Card recovery", () => {
    const tilePosition = [1, 2];
    const departures = [];
    const retreats = [];
    let state = battle([], {
        deployment: {
            definition: { ...account, slotLimit: 1 },
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
                                        dp: current.deployment.dp.value,
                                        stage: card.costStage,
                                        recovery: card.recovery,
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
                                        dp: current.deployment.dp.value,
                                        stage: card.costStage,
                                        pending: card.recovery.pending,
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
    assert.deepEqual(deployment.cardForUnit(state, firstUnit), card);
    assert.equal(deployment.deployedCount(state, card), 0);
    assert.equal(state.deployment.slot.used, 0);
    assert.deepEqual(retreats, [{ dp: 45, stage: 0, recovery: null }]);
    assert.deepEqual(departures, [{ reason: "RETREAT", dp: 45, stage: 1, pending: 1, slots: 0 }]);

    state = deployment.advance({ ...state, tick: 10 });
    assert.equal(cards.get(state, card).stock, 1);
    const second = deployment.deploy(state, deployment.createRequest(state, card, tilePosition));
    state = second.state;
    assert.notEqual(second.value.unitId, first.value.unitId);
    assert.equal(get(state, second.value.unitId).deployable.card.id, card.id);
    const secondUnit = units.ref(get(state, second.value.unitId));
    assert.deepEqual(deployment.cardForUnit(state, firstUnit), card);
    assert.equal(deployment.deployedCount(state, card), 1);
    assert.equal(state.deployment.dp.value, 30);
    const request = {
        source: null,
        target: units.ref(get(state, second.value.unitId)),
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 100, multiplier: 1, addition: 0 } },
    };
    state = damage.applyDamage(request, damage.calculateDamage(state, request)).state;
    assert.equal(get(state, second.value.unitId), undefined);
    assert.equal(at(state.battlefield, tilePosition)?.occupant ?? null, null);
    assert.deepEqual(deployment.cardForUnit(state, secondUnit), card);
    assert.equal(deployment.deployedCount(state, card), 0);
    assert.equal(state.deployment.slot.used, 1);
    assert.deepEqual(departures[1], { reason: "DEATH", dp: 30, stage: 2, pending: 1, slots: 1 });

    const releasedAt = state.tick + TICKS_PER_SECOND;
    const beforeRelease = { ...state, tick: releasedAt - 1 };
    const next = deployment.createRequest(beforeRelease, nextCard, tilePosition);
    const rejection = { type: "REJECTED", reason: "SLOT_LIMIT" };
    assert.deepEqual(deployment.preview(beforeRelease, next), rejection);
    assert.deepEqual(deployment.evaluate(beforeRelease, next), rejection);
    assert.deepEqual(deployment.deploy(beforeRelease, next).value, rejection);

    const atRelease = { ...state, tick: releasedAt };
    assert.equal(deployment.preview(atRelease, next).type, "ALLOWED");
    assert.equal(deployment.evaluate(atRelease, next), null);
    const replaced = deployment.deploy(atRelease, next);
    assert.equal(replaced.value.type, "DEPLOYED");
    assert.equal(replaced.state.deployment.slot.used, 1);
    assert.equal(deployment.advance({ ...replaced.state, tick: releasedAt + 1 }).deployment.slot.used, 1);

    const advanced = deployment.advance(atRelease);
    assert.equal(advanced.deployment.slot.used, 0);
    assert.equal(deployment.advance({ ...advanced, tick: releasedAt + 1 }).deployment.slot.used, 0);
});

test("external movement recycles on departure and self movement keeps the card in use", () => {
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
        const observed = unitObservers.setHook(placed.state, unitObservers.removed, {
            id: "observe-card-recycle",
            invoke(state) {
                assert.equal(state.deployment.slot.used, 0);
                const current = cards.get(state, card);
                assert.equal(current.costStage, recycled ? 1 : 0);
                assert.equal(current.recovery?.pending, recycled ? 1 : undefined);
                return { state, value: undefined };
            },
        });

        const removed = units.remove(observed, unit, { reason });

        assert.equal(units.get(removed, unit), undefined);
        assert.equal(removed.deployment.dp.value, 40);
    }
});

test("stock recovers serially with sampled budgets; pause and reduction affect only the selected segment", () => {
    let state = battle([], {
        deployment: {
            definition: account,
            cards: [{
                unitDefinition: operator,
                definition: { ...operatorCard, stock: 0, stockLimit: 3 },
            }],
        },
    });
    const card = cards.ref([...cards.all(state)][0]);
    state = cards.enqueueRecovery(state, card, 3);
    state = cards.startCooldown(state, card, 200);
    state = cards.setRedeployTimeContribution({ ...state, tick: 5 }, card, {
        id: "longer-recovery",
        value: [modifier.create({ addition: 10 })],
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
    assert.equal(state.deployment.dp.value, -1);
    state = deployment.dp.recover(state, 2);
    assert.equal(state.deployment.dp.value, 1);
    state = deployment.advance({ ...state, tick: 15 });
    assert.equal(state.deployment.dp.value, 2);
    state = deployment.dp.recover(state, 8);
    state = deployment.advance({ ...state, tick: 100 });
    const paid = deployment.dp.pay(state, 5);
    assert.equal(paid.value, true);
    state = deployment.advance({ ...paid.state, tick: 109 });
    assert.equal(state.deployment.dp.value, 5);
    state = deployment.advance({ ...state, tick: 110 });
    assert.equal(state.deployment.dp.value, 6);
});
