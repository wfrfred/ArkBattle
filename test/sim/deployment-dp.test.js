import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../../dist/core/battle/deployment/deployment.js";
import * as dp from "../../dist/core/battle/deployment/dp.js";
import { fixtureBattle } from "../helpers/unit.js";
import { createCardDefinition } from "../helpers/deployable.js";
import { addCard, createRequest, deploy } from "../../dist/core/battle/deployment/index.js";

const definition = (fields = {}) => ({
    initialDp: 0,
    maxDp: 100,
    dpRecoveryTicks: 4,
    slotLimit: null,
    ...fields,
});
const battle = (fields = {}) => ({
    ...fixtureBattle(),
    deployment: initialize(definition(fields)),
});

test("negative DP advances natural recovery at half speed and keeps progress across zero", () => {
    let state = initialize(definition({ initialDp: -1, minDp: -10 }));
    state = dp.advance(state, 6);
    assert.equal(state.dp, -1);
    assert.equal(state.dpRecoveryProgress, 3);

    state = dp.changeDp(state, 1, 6);
    assert.equal(state.dp, 0);
    assert.equal(state.dpRecoveryProgress, 3);
    state = dp.advance(state, 7);
    assert.equal(state.dp, 1);
    assert.equal(state.dpRecoveryProgress, 0);
});

test("one natural recovery advance samples the entry sign without splitting at zero", () => {
    const initial = initialize(definition({ initialDp: -1, minDp: -10 }));
    const state = dp.advance(initial, 16);
    assert.equal(state.dp, 1);
    assert.equal(state.dpRecoveryProgress, 0);
    assert.equal(initial.dp, -1);
});

test("active DP recovery is not halved while the account is negative", () => {
    const initial = battle({ initialDp: -8, minDp: -10 });
    const recovered = dp.recover(initial, 6);
    assert.equal(recovered.deployment.dp, -2);
    assert.equal(initial.deployment.dp, -8);
    const modified = dp.modify(recovered, 5);
    assert.equal(modified.deployment.dp, 3);
});

test("payments may reach the minimum but an insufficient payment changes nothing", () => {
    const initial = battle({ initialDp: 2, minDp: -10 });
    const paid = dp.pay(initial, 12);
    assert.equal(paid.value, true);
    assert.equal(paid.state.deployment.dp, -10);
    const rejected = dp.pay(paid.state, 1);
    assert.equal(rejected.value, false);
    assert.equal(rejected.state, paid.state);
    const zero = dp.pay(paid.state, 0);
    assert.equal(zero.value, true);
    assert.equal(zero.state, paid.state);
});

test("reaching the maximum clears progress and spending starts a fresh recovery period", () => {
    let state = initialize(definition({ initialDp: 9, maxDp: 10 }));
    state = dp.advance(state, 3);
    assert.equal(state.dpRecoveryProgress, 3);
    state = dp.changeDp(state, 1, 3);
    assert.equal(state.dp, 10);
    assert.equal(state.dpRecoveryProgress, 0);
    state = dp.advance(state, 100);
    state = dp.changeDp(state, -1, 100);
    assert.equal(dp.advance(state, 103).dp, 9);
    assert.equal(dp.advance(state, 104).dp, 10);
});

test("changing the account minimum clamps the balance without resetting recovery progress", () => {
    let current = battle({ initialDp: -8, minDp: -10 });
    current = { ...current, tick: 2 };
    current = dp.setMinimum(current, -5);
    assert.equal(current.deployment.minDp, -5);
    assert.equal(current.deployment.dp, -5);
    assert.equal(current.deployment.dpRecoveryProgress, 1);
    current = dp.setMinimum(current, 0);
    assert.equal(current.deployment.dp, 0);
    assert.equal(current.deployment.dpRecoveryProgress, 1);
});

test("the deployment cost ceiling is independent of the DP account limit", () => {
    const state = initialize(definition({ maxDp: 200, costCeiling: 40 }));
    assert.equal(state.definition.maxDp, 200);
    assert.equal(state.definition.costCeiling, 40);
    assert.equal(state.minDp, 0);
    assert.throws(() => initialize(definition({ initialDp: -1 })), RangeError);
    assert.throws(() => initialize(definition({ minDp: 101 })), RangeError);
});

test("deployment starts DP recovery from payment rather than time spent at the cap", () => {
    const added = addCard({ ...battle({ initialDp: 20, maxDp: 20, dpRecoveryTicks: 30 }), tick: 300 }, {
        id: "payment-clock",
        hooks: [],
        occupancy: { slot: "OCCUPANT" },
        deployable: { retreatRules: [] },
        card: createCardDefinition({ cost: 10 }),
    });
    const result = deploy(added.state, createRequest(added.state, added.value, [0, 1]));
    assert.equal(result.value.type, "DEPLOYED");
    assert.equal(result.state.deployment.dp, 10);
    assert.equal(result.state.deployment.lastDpRecoveryTick, 300);
    assert.equal(dp.advance(result.state.deployment, 301).dp, 10);
    assert.equal(dp.advance(result.state.deployment, 330).dp, 11);
    assert.equal(added.state.deployment.dp, 20);
});
