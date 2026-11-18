// Contract: [occupancy](../../docs/architecture/occupancy.md).
import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import test from "node:test";
import assert from "node:assert/strict";
import { battle, get } from "../helpers/battle.js";
import { createCardDefinition } from "../helpers/deployable.js";
import * as deployment from "../../dist/core/deployment/index.js";
import * as cards from "../../dist/core/deployment/card/index.js";
import * as units from "../../dist/core/unit/query.js";

const operator = {
    id: "occupant",
    hooks: Hooks.empty(),
    occupancy: { slot: "OCCUPANT" },
    deployable: { retreatRestrictions: [] },
    card: createCardDefinition({ redeployTicks: 10, slots: 1 }),
};
const account = {
    initialDp: 50,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: 3,
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
                return state;
            },
        },
        card: {
            ...operator.card,
            cost: 0,
            slots: 0,
            stock: 2,
            stockLimit: 2,
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

    state = deployment.retreat(state, units.ref(get(state, placedSupport.value.unitId)));
    assert.equal(get(state, replacement).occupancy.pair, null);
    const returned = deployment.deploy(state, deployment.createRequest(state, supportCard, [1, 2]));
    assert.equal(returned.value.type, "DEPLOYED");
    state = returned.state;
    assert.equal(get(state, replacement).occupancy.pair.support.id, returned.value.unitId);
    assert.deepEqual(notifications.slice(-2), [
        ["occupantRemoved", replacement], ["occupantAdded", replacement],
    ]);
});
