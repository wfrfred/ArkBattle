import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureBattle } from "../helpers/unit.js";
import { createCardDefinition } from "../helpers/deployable.js";
import { initialize as initializeDeployment } from "../../dist/core/battle/deployment/deployment.js";
import { addCard } from "../../dist/core/battle/deployment/resources.js";
import { deploy } from "../../dist/core/battle/deployment/operations.js";
import { createRequest, preview, activeCount, usedSlots } from "../../dist/core/battle/deployment/query.js";
import * as cards from "../../dist/core/battle/deployment/card/index.js";
import * as units from "../../dist/core/unit/query.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import { add, remove, update } from "../../dist/core/battle/unit.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import {
    setRule as setRetreatRule, removeRule as removeRetreatRule,
    retreat, canRetreat,
} from "../../dist/core/unit/capability/deployable/index.js";
import { setAttackContribution } from "../../dist/core/unit/capability/offense/capability.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { ordered, setOrdering } from "../../dist/core/battle/deployment/order.js";
import { createActions } from "../../dist/core/unit/action/index.js";

function definition(id, cost = 10, slots = 1, fields = {}) {
    return {
        id, hooks: [], occupancy: { slot: "OCCUPANT" },
        offense: { attack: 10 }, deployable: { retreatRules: [] },
        card: createCardDefinition({ cost, redeployTicks: 30, slots }), ...fields,
    };
}

function fixture(definitions, options = {}) {
    let battle = { ...fixtureBattle(), deployment: initializeDeployment({
        initialDp: 20, maxDp: 100, dpRecoveryTicks: null, slotLimit: null, ...options,
    }) };
    const references = [];
    for (const content of definitions) {
        const added = addCard(battle, content);
        battle = added.state;
        references.push(added.value);
    }
    return { battle, references };
}

const request = (battle, reference, column = 0) => createRequest(battle, reference, [0, column]);
const currentUnit = (battle, id) => units.get(battle, { id });

test("free payment keeps the deployment COST and refund basis independent", () => {
    const initial = fixture([definition("free-delivery")]);
    const ordinary = request(initial.battle, initial.references[0]);
    const free = { ...ordinary, quote: { ...ordinary.quote, dp: null } };
    assert.equal(preview(initial.battle, free).type, "ALLOWED");
    const deployed = deploy(initial.battle, free);
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(deployed.state.deployment.dp, 20);
    const self = currentUnit(deployed.state, deployed.value.unitId);
    assert.equal(self.deployable.cost, 10);
    assert.deepEqual(self.deployable.refund, { rate: 0.5, limit: 10 });
    assert.equal(cards.get(deployed.state, initial.references[0]).stock, 0);
    const returned = retreat(deployed.state, units.ref(self));
    assert.equal(returned.deployment.dp, 25);
});


test("successful initialization reads committed resources and preserves the exact static definition", () => {
    const trace = [];
    const content = definition("committed", 10, 1, {
        action: { initialize(battle) {
            trace.push(["initialize", battle.deployment.dp, battle.deployment.usedSlots, battle.deployment.cards[0].stock]);
            return createActions(battle);
        } },
    });
    content.hooks = [{ id: "read-committed", stage: "enter", invoke(battle, self) {
        trace.push(["enter", battle.deployment.dp, battle.deployment.usedSlots, battle.deployment.cards[0].stock]);
        assert.equal(self.definition, content);
        return { state: battle, value: undefined };
    } }];
    const initial = fixture([content]);
    const deployed = deploy(initial.battle, request(initial.battle, initial.references[0]));
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.deepEqual(trace, [["initialize", 10, 1, 0], ["enter", 10, 1, 0]]);
    assert.equal(currentUnit(deployed.state, deployed.value.unitId).definition, content);
});

test("request rules replace matching static Card rules before qualification", () => {
    const content = definition("overridden");
    let obsoleteCalls = 0;
    content.card.deploymentRules = [{ id: "content/permission", allows() { obsoleteCalls++; return false; } }];
    const initial = fixture([content]);
    const input = { ...request(initial.battle, initial.references[0]), rules: [{ id: "content/permission", allows: () => true }] };
    assert.equal(preview(initial.battle, input).type, "ALLOWED");
    assert.equal(deploy(initial.battle, input).value.type, "DEPLOYED");
    assert.equal(obsoleteCalls, 0);
});

test("entry hooks install sampled Effects while later output reads current Unit facts", () => {
    const initial = fixture([definition("beneficiary")]);
    const outputs = [];
    const effect = {
        id: "granted-follow-up", initialize: () => ({ amount: 0 }),
        onTick(battle, self) {
            outputs.push({ sampled: self.data.amount, attack: resolveAttack(battle, self.host) });
            return battle;
        },
    };
    const battle = cards.setUnitHook(initial.battle, initial.references[0], {
        id: "install-follow-up", stage: "enter",
        invoke(current, self) {
            return { state: effects.install(current, units.ref(self), effect, { data: { amount: 3 } }).state, value: undefined };
        },
    });
    const deployed = deploy(battle, request(battle, initial.references[0]));
    const self = currentUnit(deployed.state, deployed.value.unitId);
    assert.equal(self.effects.values().find(instance => instance.definition === effect).data.amount, 3);
    const changed = update(deployed.state, [setAttackContribution(units.ref(self), {
        id: "later-attack", value: [modifier({ addition: 5 })],
    })]);
    effects.advance(changed);
    assert.deepEqual(outputs, [{ sampled: 3, attack: 15 }]);
});

test("zero stock consumption still respects active and global deployment quotas", () => {
    const content = definition("stocked");
    content.card.stock = content.card.stockLimit = 2;
    const initial = fixture([content, definition("other")], { slotLimit: 1 });
    const first = request(initial.battle, initial.references[0]);
    const deployed = deploy(initial.battle, { ...first, quote: { ...first.quote, stock: 0 } });
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(cards.get(deployed.state, initial.references[0]).stock, 2);
    assert.equal(activeCount(deployed.state, initial.references[0]), 1);
    assert.equal(usedSlots(deployed.state), 1);
    assert.deepEqual(deploy(deployed.state, request(deployed.state, initial.references[0], 1)).value,
        { type: "REJECTED", reason: "ACTIVE_LIMIT" });
    assert.deepEqual(deploy(deployed.state, request(deployed.state, initial.references[1], 2)).value,
        { type: "REJECTED", reason: "SLOT_LIMIT" });
});

test("Card presentation permission and manual retreat permission remain separate from forced removal", () => {
    const initial = fixture([definition("hidden")]);
    let battle = cards.setRule(initial.battle, initial.references[0], {
        id: "hidden-and-unselectable", allows: (_current, { purpose }) => purpose === "DEPLOY",
    });
    assert.equal(cards.allows(battle, { ref: initial.references[0], purpose: "DISPLAY" }), false);
    assert.equal(cards.allows(battle, { ref: initial.references[0], purpose: "SELECT" }), false);
    const deployed = deploy(battle, request(battle, initial.references[0]));
    const reference = units.ref(currentUnit(deployed.state, deployed.value.unitId));
    battle = update(deployed.state, [setRetreatRule(reference, { id: "cannot-retreat", allows: () => false })]);
    assert.equal(canRetreat(battle, reference), false);
    assert.equal(retreat(battle, reference), battle);
    assert.equal(update(battle, [removeRetreatRule(reference, "missing")]), battle);
    assert.equal(currentUnit(remove(battle, reference.id, "SCRIPT"), reference.id), undefined);
});

test("preview and deployment deliver the actual request to Card rules", () => {
    const initial = fixture([definition("request-rule")]);
    const seen = [];
    const battle = cards.setRule(initial.battle, initial.references[0], {
        id: "position-and-direction", allows(_current, context) {
            if (context.purpose !== "DEPLOY") return true;
            seen.push(context.request);
            return context.request.tilePosition[1] === 1 && context.request.direction === "LEFT";
        },
    });
    const rejected = { ...request(battle, initial.references[0]), direction: "RIGHT" };
    const accepted = { ...request(battle, initial.references[0], 1), direction: "LEFT" };
    assert.deepEqual(preview(battle, rejected), { type: "REJECTED", reason: "RULE" });
    assert.equal(preview(battle, accepted).type, "ALLOWED");
    assert.equal(deploy(battle, accepted).value.type, "DEPLOYED");
    assert.deepEqual(seen, [rejected, accepted, accepted]);
    assert.equal(cards.get(battle, initial.references[0]).stock, 1);
});

test("Card ordering reacts to current prices without changing identity storage", () => {
    const initial = fixture([definition("expensive", 20), definition("cheap", 5), definition("middle", 10)]);
    const storage = initial.battle.deployment.cards;
    let battle = setOrdering(initial.battle, (current, references) => [...references].sort((left, right) =>
        cards.resolveCost(cards.get(current, left)) - cards.resolveCost(cards.get(current, right))));
    assert.deepEqual(ordered(battle).map(self => self.id).toArray(), [1, 2, 0]);
    assert.equal(battle.deployment.cards, storage);
    battle = cards.setCostContribution(battle, initial.references[0], { id: "discount", value: [modifier({ finalAddition: -19 })] });
    assert.deepEqual(ordered(battle).map(self => self.id).toArray(), [0, 1, 2]);
    const frozen = battle.deployment.order;
    battle = setOrdering(battle, null);
    battle = cards.setCostContribution(battle, initial.references[1], { id: "later", value: [modifier({ finalAddition: 50 })] });
    assert.equal(battle.deployment.order, frozen);
});

test("preview sees due inventory without publication and successful entry preserves current Card state", () => {
    const content = definition("due-inventory", 0);
    content.card = { ...content.card, stock: 0, initialize: battle => ({ state: battle, value: { revision: 0 } }) };
    const initial = fixture([content]);
    const reference = initial.references[0];
    let battle = cards.enqueueRecovery(initial.battle, reference);
    battle = cards.setRule(battle, reference, { id: "recovered", allows(current, context) {
        const self = cards.get(current, context.purpose === "DEPLOY" ? context.request.card : context.ref);
        return self.stock === 1 && self.recovery === null;
    } });
    battle = { ...battle, tick: 30 };
    const stored = cards.get(battle, reference);
    const input = request(battle, reference);
    assert.equal(preview(battle, input).type, "ALLOWED");
    assert.equal(cards.get(battle, reference), stored);
    assert.equal(stored.stock, 0);
    const outside = deploy(battle, { ...input, tilePosition: [0, 100] });
    assert.equal(outside.value.type, "REJECTED");
    assert.equal(outside.state, battle);
    const deployed = deploy(battle, { ...input, hooks: [{ id: "latest-private-state", stage: "enter", invoke(current) {
        return { state: cards.setState(current, reference, { revision: 1 }), value: undefined };
    } }] });
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(cards.get(deployed.state, reference).stock, 0);
    assert.equal(cards.get(deployed.state, reference).recovery, null);
    assert.deepEqual(cards.get(deployed.state, reference).state, { revision: 1 });
    assert.deepEqual(stored.state, { revision: 0 });
});

test("a one-shot grant in the request is consumed before the Unit's own entry starts a second deployment", () => {
    let opportunity;
    let second;
    let nested;
    const discounted = (battle, reference, column) => {
        const input = request(battle, reference, column);
        if (effects.get(battle, opportunity).data.charges === 0) return input;
        return { ...input, quote: { ...input.quote, dp: 0 }, hooks: [{
            id: "consume-opportunity", stage: "enter", invoke(current) {
                return { state: effects.setData(current, opportunity, { charges: 0 }), value: undefined };
            },
        }] };
    };
    const first = definition("first", 10, 1, { hooks: [{
        id: "nested-entry", stage: "enter", invoke(current) {
            assert.equal(effects.get(current, opportunity).data.charges, 0);
            nested = deploy(current, discounted(current, second, 1));
            return { state: nested.state, value: undefined };
        },
    }] });
    const initial = fixture([first, definition("second")]);
    second = initial.references[1];
    const sourceBattle = { ...initial.battle, execution: { ...initial.battle.execution, nextUnitId: initial.battle.execution.nextUnitId + 1 } };
    const source = initializeUnit(sourceBattle, {
        id: initial.battle.execution.nextUnitId, definition: { id: "opportunity-source", hooks: [] }, position: [20, 0],
    });
    const installed = effects.install(add(source.state, source.value), units.ref(source.value), {
        id: "shared-discount", initialize: () => ({ charges: 1 }),
    });
    opportunity = installed.value;
    const invalid = discounted(installed.state, initial.references[0], 100);
    assert.equal(deploy(installed.state, invalid).value.type, "REJECTED");
    assert.equal(effects.get(installed.state, opportunity).data.charges, 1);
    const deployed = deploy(installed.state, discounted(installed.state, initial.references[0], 0));
    assert.equal(deployed.value.type, "DEPLOYED");
    assert.equal(nested.value.type, "DEPLOYED");
    assert.equal(deployed.state.deployment.dp, 10);
    assert.equal(effects.get(deployed.state, opportunity).data.charges, 0);
});
