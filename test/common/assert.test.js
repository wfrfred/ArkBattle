import { test } from "node:test";
import nodeAssert from "node:assert/strict";
import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertPositiveSafeInteger,
} from "../../dist/core/common/assert.js";

test("numeric input boundaries reject coercion and preserve the caller's error label", () => {
    nodeAssert.doesNotThrow(() => assertFiniteNumber(-0.5, "value"));
    nodeAssert.doesNotThrow(() => assertNonnegativeNumber(0, "value"));
    nodeAssert.doesNotThrow(() => assertPositiveSafeInteger(2, "count"));
    nodeAssert.throws(() => assertFiniteNumber("1", "value"), RangeError);
    nodeAssert.throws(() => assertFiniteNumber(NaN, "value"), RangeError);
    nodeAssert.throws(() => assertNonnegativeNumber(-1, "value"), RangeError);
    nodeAssert.throws(() => assertPositiveSafeInteger(0.5, "count"), RangeError);
    nodeAssert.throws(() => assertPositiveSafeInteger(0, "count", TypeError), {
        name: "TypeError", message: /^count must be /,
    });
});
