// Contract: [attribute](../../docs/architecture/attribute.md).
import assert from "node:assert/strict";
import test from "node:test";
import { apply, create } from "../../dist/core/common/modifier.js";

test("modifiers combine the four terms without rounding and floor the multiplier at zero", () => {
    assert.equal(apply(10, [
        create({ addition: 2, multiplier: 0.2, finalAddition: 1, finalScaler: 0.5 }),
        create({ addition: 3, multiplier: 0.3, finalAddition: 2, finalScaler: 0.25 }),
    ]), 3.1875);
    assert.equal(apply(10, [create({ multiplier: -2, finalAddition: 3 })]), 3);
});
