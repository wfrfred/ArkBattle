// Contract: [occupancy](../../docs/architecture/occupancy.md).
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle } from "../helpers/battle.js";
import { createCardDefinition } from "../helpers/deployable.js";
import * as deployment from "../../dist/core/battle/deployment/index.js";
import * as cards from "../../dist/core/battle/deployment/deck/card/index.js";
import { setDirection } from "../../dist/core/unit/capability/occupancy/index.js";
import { update } from "../../dist/core/unit/operations.js";
import * as units from "../../dist/core/unit/query.js";

const operator = {
    id: "occupant",
    hooks: Hooks.empty(),
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRestrictions: [], refund: null },
};
const operatorCard = createCardDefinition({ policy: "DEFAULT", slots: 1 });
const account = {
    costCeiling: 99,
    dp: { initial: 50, min: 0, max: 99, recoveryInterval: null },
    slot: { limit: 3 },
};

test("occupancy pairs notify once and an old departure cannot clear the replacement pair", () => {
    const notifications = [];
    const support = {
        ...operator,
        id: "support",
        occupancy: {
            slot: "SUPPORT",
            onOccupantAdded: (state, pair) => {
                notifications.push(["occupantAdded", units.ref(pair.occupant)]);
                assert.equal(units.ref(pair.occupant).get(state).occupancy.pair, pair);
                assert.equal(units.ref(pair.support).get(state).occupancy.pair, pair);
                return state;
            },
            onOccupantRemoved: (state, pair) => {
                notifications.push(["occupantRemoved", units.ref(pair.occupant)]);
                assert.notEqual(units.ref(pair.occupant).get(state)?.occupancy.pair, pair);
                assert.notEqual(units.ref(pair.support).get(state)?.occupancy.pair, pair);
                return state;
            },
        },
    };
    const supportDefinition = {
        ...operatorCard,
        dp: { ...operatorCard.dp, parameters: cards.dp.create({ cost: 0 }) },
        slot: 0,
        supply: { ...operatorCard.supply, stock: 2, stockLimit: 2 },
    };
    const summonDefinition = {
        ...operatorCard,
        dp: { ...operatorCard.dp, parameters: cards.dp.create({ cost: 0 }) },
        supply: {
            ...operatorCard.supply,
            stock: 2,
            stockLimit: 2,
            activeLimit: null,
        },
    };
    let state = battle([], {
        deployment: { ...account, slot: { limit: 1 } },
        initialCards: [
            { definition: supportDefinition, unitDefinition: support },
            { definition: summonDefinition, unitDefinition: operator },
        ],
    });
    const [supportCard, unitCard] = [...cards.all(state)].map(cards.ref);
    const placedSupport = deployment.deploy(
        state,
        deployment.createRequest(state, supportCard, [1, 2], null),
    );
    state = placedSupport.state;
    let replacement;
    const request = deployment.createRequest(state, unitCard, [1, 2], null);
    const placedUnit = deployment.deploy(state, {
        ...request,
        hooks: Hooks.empty().set(unitLifecycle.removed, {
                id: "replace-on-leave", priority: 0,

                invoke: (current) => {
                    const result = deployment.deploy(
                        current,
                        deployment.createRequest(current, unitCard, [1, 2], null),
                    );
                    assert.notEqual(result.value, null);
                    replacement = result.value;
                    return { state: result.state, value: undefined };
                },
            }),
    });
    state = placedUnit.state;
    const denied = deployment.deploy(state, {
        ...request,
        quote: { ...request.quote, slots: 0 },
    });
    assert.equal(denied.value, null);
    state = deployment.retreat(state, placedUnit.value);
    const pair = placedSupport.value.get(state).occupancy.pair;
    assert.notEqual(replacement, placedUnit.value);
    assert.equal(units.ref(pair.occupant), replacement);
    state = update(state, replacement, setDirection("UP"));
    const occupancy = replacement.get(state).occupancy;
    assert.equal(occupancy.direction, "UP");
    assert.equal(occupancy.pair, pair);
    assert.deepEqual(occupancy.tile, [1, 2]);
    assert.deepEqual(notifications, [
        ["occupantAdded", placedUnit.value],
        ["occupantRemoved", placedUnit.value],
        ["occupantAdded", replacement],
    ]);

    state = deployment.retreat(state, placedSupport.value);
    assert.equal(replacement.get(state).occupancy.pair, null);
    const returned = deployment.deploy(state, deployment.createRequest(state, supportCard, [1, 2], null));
    assert.notEqual(returned.value, null);
    assert.notEqual(returned.value, replacement);
    state = returned.state;
    assert.equal(units.ref(replacement.get(state).occupancy.pair.support), returned.value);
    assert.deepEqual(notifications.slice(-2), [
        ["occupantRemoved", replacement], ["occupantAdded", replacement],
    ]);
});
