// Contract: [capability](../../docs/architecture/capability.md#属性与贡献).
import assert from "node:assert/strict";
import test from "node:test";
import { resolve, resolveEntries } from "../../dist/core/common/contribution.js";

test("contributions keep independent sources and select a group's highest priority with a stable tie", () => {
    const independent = { id: "base", value: "independent" };
    const first = { id: "a", value: "first", group: { id: "bonus", priority: 2 } };
    const tied = { id: "z", value: "tied", group: { id: "bonus", priority: 2 } };
    const winner = { id: "winner", value: "highest", group: { id: "bonus", priority: 3 } };
    assert.deepEqual(resolveEntries([tied, independent, first, winner]), [independent, winner]);
    assert.deepEqual(resolve([tied, independent, first]), ["first", "independent"]);
});
