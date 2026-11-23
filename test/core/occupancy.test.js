// Contract: [occupancy](../../docs/architecture/occupancy.md).
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
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
    deployable: { retreatRestrictions: [] },
};
const operatorCard = createCardDefinition({ policy: { type: "DEFAULT" }, slots: 1 });
const account = {
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
                notifications.push(["occupantAdded", pair.occupant.id]);
                assert.equal(units.get(state, units.ref(pair.occupant)).occupancy.pair, pair);
                assert.equal(units.get(state, units.ref(pair.support)).occupancy.pair, pair);
                return state;
            },
            onOccupantRemoved: (state, pair) => {
                notifications.push(["occupantRemoved", pair.occupant.id]);
                assert.notEqual(units.get(state, units.ref(pair.occupant))?.occupancy.pair, pair);
                assert.notEqual(units.get(state, units.ref(pair.support))?.occupancy.pair, pair);
                return state;
            },
        },
    };
    const supportDefinition = {
        ...operatorCard,
        dp: { ...operatorCard.dp, cost: 0, increaseCostOnRetreatOrDeath: false },
        slot: 0,
        supply: { ...operatorCard.supply, stock: 2, stockLimit: 2 },
    };
    const summonDefinition = {
        ...operatorCard,
        dp: { ...operatorCard.dp, cost: 0, increaseCostOnRetreatOrDeath: false },
        supply: {
            ...operatorCard.supply,
            stock: 2,
            stockLimit: 2,
            activeLimit: null,
        },
    };
    let state = battle([], {
        deployment: {
            definition: { ...account, slot: { limit: 1 } },
            cards: [
                { definition: supportDefinition, unitDefinition: support },
                { definition: summonDefinition, unitDefinition: operator },
            ],
        },
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
        hooks: Hooks.empty().set(unitLifecycle.removed, {
                id: "replace-on-leave",

                invoke: (current) => {
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
    const pair = get(state, placedSupport.value.unitId).occupancy.pair;
    assert.notEqual(replacement, placedUnit.value.unitId);
    assert.equal(pair.occupant.id, replacement);
    state = update(state, units.ref(get(state, replacement)), setDirection("UP"));
    const occupancy = get(state, replacement).occupancy;
    assert.equal(occupancy.direction, "UP");
    assert.equal(occupancy.pair, pair);
    assert.deepEqual(occupancy.tile, [1, 2]);
    assert.deepEqual(notifications, [
        ["occupantAdded", placedUnit.value.unitId],
        ["occupantRemoved", placedUnit.value.unitId],
        ["occupantAdded", replacement],
    ]);

    state = deployment.retreat(state, units.ref(get(state, placedSupport.value.unitId)));
    assert.equal(get(state, replacement).occupancy.pair, null);
    const returned = deployment.deploy(state, deployment.createRequest(state, supportCard, [1, 2]));
    assert.equal(returned.value.type, "DEPLOYED");
    assert.notEqual(returned.value.unitId, replacement);
    state = returned.state;
    assert.equal(get(state, replacement).occupancy.pair.support.id, returned.value.unitId);
    assert.deepEqual(notifications.slice(-2), [
        ["occupantRemoved", replacement], ["occupantAdded", replacement],
    ]);
});
