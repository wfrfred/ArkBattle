// Contract: [data](../../../docs/architecture/data.md#静态配置与数值).
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTags } from "../../../dist/data/unit/tags.js";

test("tag conversion preserves identities, removes duplicates and requires actual source data", () => {
    assert.deepEqual(
        parseTags(["storm", "SANDBOX_FACTORY", "storm"]),
        ["storm", "SANDBOX_FACTORY"],
    );
    assert.deepEqual(parseTags([]), []);
    assert.throws(() => parseTags(undefined), /array/);
    assert.throws(() => parseTags(["storm", null]), /nonempty strings/);
});
