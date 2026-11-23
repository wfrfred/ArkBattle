// Contract: [api-conventions](../../../docs/architecture/api-conventions.md#5-数值输入查询与字段写回).
import assert from "node:assert/strict";
import { test } from "node:test";
import { replaceIn } from "../../../dist/core/common/object.js";

test("field replacement copies only the changed path and preserves identical state", () => {
    const entries = [];
    const slot = { used: 0 };
    const dp = { balance: 10, min: entries };
    const state = { deployment: { dp, slot } };

    assert.equal(replaceIn(state, ["deployment", "dp"], dp), state);

    const next = replaceIn(state, ["deployment", "dp", "balance"], 8);
    assert.equal(next.deployment.dp.balance, 8);
    assert.equal(state.deployment.dp.balance, 10);
    assert.notEqual(next.deployment, state.deployment);
    assert.notEqual(next.deployment.dp, dp);
    assert.equal(next.deployment.slot, slot);
    assert.equal(next.deployment.dp.min, entries);
});
