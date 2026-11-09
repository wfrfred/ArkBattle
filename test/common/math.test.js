import assert from "node:assert/strict";
import { test } from "node:test";
import { roundToEven } from "../../dist/core/common/math.js";

test("integer attribute rounding uses the nearest even result for signed half values", () => {
    assert.deepEqual([1.5, 2.5, -1.5, -2.5, 1.4, -1.4].map(roundToEven), [2, 2, -2, -2, 1, -1]);
});
