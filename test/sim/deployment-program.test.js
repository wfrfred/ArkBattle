import { createDefinition as createDeployableDefinition } from "../../dist/core/unit/capability/deployable/index.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattle } from "../helpers/unit.js";
import { normal as normalCondition } from "../../dist/content/terrain/condition.js";
import { initialize as initializeDeployment } from "../../dist/core/battle/deployment/deployment.js";
import { addCard } from "../../dist/core/battle/deployment/resources.js";
import { deploy, retreat, canRetreat } from "../../dist/core/battle/deployment/operations.js";
import { preview, activeCount, usedSlots } from "../../dist/core/battle/deployment/query.js";
import { operator } from "../../dist/core/battle/deployment/normal.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import * as units from "../../dist/core/unit/query.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { add, remove, update } from "../../dist/core/battle/unit.js";
import { instantiateUnitPlacement } from "../../dist/core/battle/creation/placement.js";
import { setRule as setDeployableRule, removeRule as removeDeployableRule } from "../../dist/core/unit/capability/deployable/index.js";
import { setAttackContribution } from "../../dist/core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { ordered, setOrdering } from "../../dist/core/battle/deployment/order.js";

function definition(id, cost = 10, slots = 1) {
    return {
        id,
        hooks: [],
        occupancy: { slot: "OCCUPANT" },
        offense: { attack: 10 },
        deployable: createDeployableDefinition({
            card: {},
            cost,
            redeployTicks: 30,
            slots,
            placement: "ALL",
            allowedSiteConditions: [normalCondition],
            refund: { rate: 0.5, limit: "BASE_COST" },
        }),
    };
}

function fixture(definitions, options = {}) {
    let battle = {
        ...fixtureBattle(),
        deployment: initializeDeployment({
            initialDp: 20,
            maxDp: 100,
            dpRecoveryTicks: null,
            slotLimit: null,
            ...options,
        }),
    };
    const references = [];
    for (const content of definitions) {
        const added = addCard(battle, content, { stock: 1, stockLimit: 1, activeLimit: 1, program: operator });
        battle = added.state;
        references.push(added.value);
    }
    return { battle, references };
}

const request = (card, column = 0) => ({ card, tilePosition: [0, column] });
const reports = (battle) => battle.events.filter((event) => event.type === "UNIT_DEPLOYED");

test("ordinary zero payment and omitted payment remain distinct while a free instance retains refundable COST", () => {
    const initial = fixture([definition("zero", 0), definition("free", 10)]);
    const zero = deploy(initial.battle, request(initial.references[0]));
    assert.equal(zero.value.type, "DEPLOYED");
    const free = {
        id: "test/free-delivery",
        prepare(battle, input) {
            const planned = operator.prepare(battle, input);
            return planned.type === "PREPARED" ? { ...planned, payment: null } : planned;
        },
    };
    const delivered = deploy(zero.state, request(initial.references[1], 1), free);
    assert.equal(delivered.value.type, "DEPLOYED");
    assert.deepEqual(
        reports(delivered.state).map((report) => report.payment),
        [{ amount: 0 }, null],
    );
    assert.equal(cards.get(delivered.state, initial.references[0]).stock, 0);
    assert.equal(cards.get(delivered.state, initial.references[1]).stock, 0);
    assert.equal(delivered.state.deployment.dp, 20);
    const self = units.get(delivered.state, { id: delivered.value.unitId });
    assert.equal(self.deployable.cost, 10);
    const returned = retreat(delivered.state, units.ref(self));
    assert.equal(returned.deployment.dp, 25);
    assert.equal(cards.get(returned, initial.references[1]).recovery.pending, 1);
    assert.equal(cards.get(returned, initial.references[1]).cooldown, null);
});

test("preview and failed common eligibility never consume the accepted program or allocate Unit identity", () => {
    const initial = fixture([definition("expensive")], { initialDp: 5 });
    let consumed = 0;
    const program = {
        id: "test/consumption",
        prepare(battle, input) {
            const planned = operator.prepare(battle, input);
            if (planned.type !== "PREPARED") return planned;
            return {
                ...planned,
                consume(current) {
                    consumed++;
                    return planned.consume(current);
                },
            };
        },
    };
    assert.deepEqual(preview(initial.battle, request(initial.references[0]), program), {
        type: "REJECTED",
        reason: "INSUFFICIENT_DP",
    });
    const rejected = deploy(initial.battle, request(initial.references[0]), program);
    assert.deepEqual(rejected.value, { type: "REJECTED", reason: "INSUFFICIENT_DP" });
    assert.equal(rejected.state, initial.battle);
    assert.equal(consumed, 0);
    assert.equal(rejected.state.execution.nextUnitId, initial.battle.execution.nextUnitId);

    const free = {
        id: "test/free-preview",
        prepare(battle, input) {
            const planned = program.prepare(battle, input);
            return planned.type === "PREPARED" ? { ...planned, payment: null } : planned;
        },
    };
    assert.deepEqual(preview(initial.battle, request(initial.references[0]), free), {
        type: "ALLOWED",
        cost: 10,
        payment: null,
    });
    assert.equal(consumed, 0);
    const outside = deploy(initial.battle, request(initial.references[0], 100), free);
    assert.deepEqual(outside.value, { type: "REJECTED", reason: "OUTSIDE_MAP" });
    assert.equal(outside.state, initial.battle);
    assert.equal(consumed, 0);
});

test("a shared one-shot opportunity is consumed in its source Effect before entry can deploy another Card", () => {
    const initial = fixture([definition("first"), definition("second")]);
    const source = instantiateUnitPlacement(initial.battle, {
        definition: { id: "opportunity-source", hooks: [] },
        position: [0, 20],
    });
    let battle = add(source.state, source.value);
    const installed = effects.install(battle, units.ref(source.value), {
        id: "shared-discount",
        initialize: () => ({ charges: 1 }),
    });
    battle = installed.state;
    const opportunity = installed.value;
    const program = {
        id: "test/shared-next-deployment",
        prepare(current, input) {
            const planned = operator.prepare(current, input);
            if (planned.type !== "PREPARED" || effects.get(current, opportunity).data.charges === 0)
                return planned;
            return {
                ...planned,
                payment: { amount: 0 },
                consume(state) {
                    state = effects.setData(state, opportunity, { charges: 0 });
                    return planned.consume(state);
                },
            };
        },
    };
    let nested;
    battle = cards.setHook(battle, initial.references[0], {
        id: "nested-deployment",
        stage: "enter",
        invoke(current) {
            assert.equal(effects.get(current, opportunity).data.charges, 0);
            nested = deploy(current, request(initial.references[1], 1), program);
            assert.equal(nested.value.type, "DEPLOYED");
            return { state: nested.state, value: undefined };
        },
    });
    const first = deploy(battle, request(initial.references[0]), program);
    assert.equal(first.value.type, "DEPLOYED");
    assert.equal(first.state.deployment.dp, 10);
    assert.equal(effects.get(first.state, opportunity).data.charges, 0);
    assert.deepEqual(
        reports(first.state).map((report) => report.payment),
        [{ amount: 0 }, { amount: 10 }],
    );
    assert.equal(
        units.get(first.state, { id: nested.value.unitId }).deployable.card.id,
        initial.references[1].id,
    );
});

test("Card entry hooks install ordinary Effects with grant-time data and resolve later output from current Unit facts", () => {
    const initial = fixture([definition("beneficiary")]);
    let grant = 3;
    const sampled = grant;
    const outputs = [];
    const effect = {
        id: "granted-follow-up",
        initialize: () => ({ amount: 0 }),
        onTick(battle, self) {
            outputs.push({ sampled: self.data.amount, attack: resolveAttack(battle, self.host) });
            return battle;
        },
    };
    let battle = cards.setHook(initial.battle, initial.references[0], {
        id: "install-follow-up",
        stage: "enter",
        invoke(current, self) {
            return {
                state: effects.install(current, units.ref(self), effect, {
                    data: { amount: sampled },
                }).state,
                value: undefined,
            };
        },
    });
    grant = 9;
    const deployed = deploy(battle, request(initial.references[0]));
    assert.equal(deployed.value.type, "DEPLOYED");
    const self = units.get(deployed.state, { id: deployed.value.unitId });
    assert.equal(
        self.effects.values().find((instance) => instance.definition === effect).data.amount,
        3,
    );
    battle = update(deployed.state, [
        setAttackContribution(units.ref(self), {
            id: "later-attack",
            value: [modifier({ addition: 5 })],
        }),
    ]);
    effects.advance(battle);
    assert.deepEqual(outputs, [{ sampled: 3, attack: 15 }]);
    assert.equal(grant, 9);
});

test("a source program can preserve stock while the deployed instance still consumes active and global quotas", () => {
    const initial = fixture([definition("reusable"), definition("other")], { slotLimit: 1 });
    const stocked = addCard(initial.battle, definition("stocked"), {
        stock: 2,
        stockLimit: 2,
        activeLimit: 1,
        program: operator,
    });
    const program = {
        id: "test/no-stock-consumption",
        prepare(battle, input) {
            const planned = operator.prepare(battle, input);
            if (planned.type !== "PREPARED") return planned;
            const { consume: _consume, ...withoutConsumption } = planned;
            return withoutConsumption;
        },
    };
    const deployed = deploy(stocked.state, request(stocked.value), program);
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(cards.get(deployed.state, stocked.value).stock, 2);
    assert.equal(activeCount(deployed.state, stocked.value), 1);
    assert.equal(usedSlots(deployed.state), 1);
    assert.deepEqual(deploy(deployed.state, request(stocked.value, 1), program).value, {
        type: "REJECTED",
        reason: "ACTIVE_LIMIT",
    });
    assert.deepEqual(deploy(deployed.state, request(initial.references[1], 2)).value, {
        type: "REJECTED",
        reason: "SLOT_LIMIT",
    });
});

test("Card presentation rules do not erase it or block deployment, and manual retreat rules do not block forced removal", () => {
    const initial = fixture([definition("hidden")]);
    let battle = cards.setRule(initial.battle, initial.references[0], {
        id: "hidden-and-unselectable",
        allows: (_current, { purpose }) => purpose === "DEPLOY",
    });
    assert.ok(cards.get(battle, initial.references[0]));
    assert.equal(cards.allows(battle, { ref: initial.references[0], purpose: "DISPLAY" }), false);
    assert.equal(cards.allows(battle, { ref: initial.references[0], purpose: "SELECT" }), false);
    const deployed = deploy(battle, request(initial.references[0]));
    assert.equal(deployed.value.type, "DEPLOYED");
    const self = units.get(deployed.state, { id: deployed.value.unitId });
    const reference = units.ref(self);
    battle = update(deployed.state, [
        setDeployableRule(reference, {
            id: "cannot-retreat",
            allows: (_current, { ref }) => ref.id !== reference.id,
        }),
    ]);
    assert.equal(canRetreat(battle, reference), false);
    assert.equal(retreat(battle, reference), battle);
    assert.equal(update(battle, [removeDeployableRule(reference, "missing")]), battle);
    battle = remove(battle, reference.id, "SCRIPT");
    assert.equal(units.get(battle, reference), undefined);
});

test("Card deployment rules receive the actual request in preview and deployment", () => {
    const initial = fixture([definition("request-rule")]);
    const reference = initial.references[0];
    const seen = [];
    const battle = cards.setRule(initial.battle, reference, {
        id: "specific-position-and-direction",
        allows(_current, context) {
            if (context.purpose !== "DEPLOY") return true;
            seen.push(context.request);
            return context.request.tilePosition[1] === 1 && context.request.direction === "LEFT";
        },
    });
    const rejected = { ...request(reference), direction: "RIGHT" };
    const accepted = { ...request(reference, 1), direction: "LEFT" };

    assert.deepEqual(preview(battle, rejected, operator), { type: "REJECTED", reason: "RULE" });
    assert.deepEqual(preview(battle, accepted, operator), {
        type: "ALLOWED",
        cost: 10,
        payment: { amount: 10 },
    });
    const result = deploy(battle, accepted);
    assert.equal(result.value.type, "DEPLOYED");
    assert.deepEqual(seen, [rejected, accepted, accepted]);
    assert.equal(cards.get(battle, reference).stock, 1);
    assert.equal(cards.get(result.state, reference).stock, 0);
});

test("one ordering program follows current prices without changing identity storage and can be stopped at the current order", () => {
    const initial = fixture([
        definition("expensive", 20),
        definition("cheap", 5),
        definition("middle", 10),
    ]);
    const storage = initial.battle.deployment.cards;
    let battle = setOrdering(initial.battle, (current, references) =>
        [...references].sort(
            (left, right) =>
                cards.resolveCost(cards.get(current, left)) -
                cards.resolveCost(cards.get(current, right)),
        ),
    );
    assert.deepEqual(
        ordered(battle)
            .map((self) => self.id)
            .toArray(),
        [1, 2, 0],
    );
    assert.equal(battle.deployment.cards, storage);
    assert.deepEqual(
        cards
            .all(battle)
            .map((self) => self.id)
            .toArray(),
        [0, 1, 2],
    );

    battle = cards.setCostContribution(battle, initial.references[0], {
        id: "price-discount",
        value: [modifier({ finalAddition: -19 })],
    });
    assert.deepEqual(
        ordered(battle)
            .map((self) => self.id)
            .toArray(),
        [0, 1, 2],
    );
    assert.deepEqual(
        cards
            .all(battle)
            .map((self) => self.id)
            .toArray(),
        [0, 1, 2],
    );
    assert.equal(battle.deployment.cards[1], storage[1]);
    assert.equal(battle.deployment.cards[2], storage[2]);

    const frozenOrder = battle.deployment.order;
    battle = setOrdering(battle, null);
    battle = cards.setCostContribution(battle, initial.references[1], {
        id: "later-price-increase",
        value: [modifier({ finalAddition: 50 })],
    });
    assert.equal(battle.deployment.order, frozenOrder);
    assert.deepEqual(
        ordered(battle)
            .map((self) => self.id)
            .toArray(),
        [0, 1, 2],
    );
    assert.equal(cards.resolveCost(cards.get(battle, initial.references[1])), 55);
});

test("entry rules see due inventory without preview publication and successful consumption preserves the latest private state", () => {
    const content = definition("due-inventory", 0);
    content.deployable.card = {
        initialize: (battle) => ({ state: battle, value: { revision: 0 } }),
    };
    const initial = fixture([]);
    const added = addCard(initial.battle, content, {
        stock: 0,
        stockLimit: 1,
        activeLimit: 1,
        program: operator,
    });
    let battle = cards.enqueueRecovery(added.state, added.value);
    battle = cards.setRule(battle, added.value, {
        id: "recovered-inventory",
        allows(current, context) {
            const self = cards.get(current, context.purpose === "DEPLOY" ? context.request.card : context.ref);
            return self.stock === 1 && self.recovery === null;
        },
    });
    battle = { ...battle, tick: 30 };
    const stored = cards.get(battle, added.value);
    const execution = battle.execution;
    const program = {
        id: "test/latest-private-state",
        prepare(current, input) {
            const planned = operator.prepare(current, input);
            if (planned.type !== "PREPARED") return planned;
            return {
                ...planned,
                consume(latest) {
                    latest = cards.setState(latest, input.card, { revision: 1 });
                    return planned.consume(latest);
                },
            };
        },
    };

    assert.deepEqual(preview(battle, request(added.value), program), {
        type: "ALLOWED",
        cost: 0,
        payment: { amount: 0 },
    });
    assert.equal(cards.get(battle, added.value), stored);
    assert.equal(stored.stock, 0);
    assert.equal(stored.recovery.pending, 1);
    assert.equal(battle.execution, execution);

    const rejected = deploy(battle, request(added.value, 100), program);
    assert.deepEqual(rejected.value, { type: "REJECTED", reason: "OUTSIDE_MAP" });
    assert.equal(rejected.state, battle);
    assert.equal(cards.get(rejected.state, added.value), stored);
    assert.equal(rejected.state.execution, execution);

    const deployed = deploy(battle, request(added.value), program);
    assert.equal(deployed.value.type, "DEPLOYED");
    const current = cards.get(deployed.state, added.value);
    assert.equal(current.stock, 0);
    assert.equal(current.recovery, null);
    assert.deepEqual(current.state, { revision: 1 });
    assert.deepEqual(stored.state, { revision: 0 });
    assert.equal(deployed.state.execution.nextUnitId, execution.nextUnitId + 1);
});
