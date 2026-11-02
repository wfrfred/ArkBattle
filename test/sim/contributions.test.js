import assert from "node:assert/strict";
import { test } from "node:test";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";
import * as contribution from "../../dist/core/unit/contribution/contribution.js";


const value = (amount) => modifier.create({ finalAddition: amount });
test("contributions: set and remove preserve immutable arrays and shared values", () => {
    const group = { id: "attack", priority: 3 };
    const values = [value(10)];
    const input = { id: "sample", value: values, group };
    const baseline = [];
    const entries = contribution.set(baseline, input);
    assert.deepEqual(baseline, []);
    assert.equal(entries[0], input);
    assert.equal(entries[0].group, group);
    assert.equal(entries[0].value, values);
    assert.equal(contribution.set(entries, input), entries);
    assert.equal(contribution.remove(entries, "missing"), entries);
    assert.deepEqual(contribution.remove(entries, "sample"), []);
    assert.equal(entries[0], input);
});

test("contributions: set replaces a matching identity and shares unrelated entries", () => {
    const first = { id: "first", value: [value(10)] };
    const second = { id: "second", value: [value(20)] };
    const baseline = contribution.set(contribution.set([], first), second);
    const replacement = { id: "first", value: [value(30)] };
    const updated = contribution.set(baseline, replacement);
    assert.equal(updated.length, 2);
    assert.equal(updated[0], replacement);
    assert.equal(updated[1], second);
    assert.equal(baseline[0], first);
    assert.equal(contribution.remove(updated, "first")[0], second);
});

test("contributions: group priority and ID ties are independent of insertion order", () => {
    const entries = [
        { id: "effect/2", group: { id: "shared", priority: 2 }, value: [value(20)] },
        { id: "effect/10", group: { id: "shared", priority: 2 }, value: [value(10)] },
        { id: "strong", group: { id: "shared", priority: 3 }, value: [value(30)] },
        { id: "independent", value: [value(5)] },
    ];
    assert.deepEqual(contribution.resolve(entries), [[value(5)], [value(30)]]);
    const fallback = contribution.remove(entries, "strong");
    assert.deepEqual(contribution.resolve(fallback), [[value(10)], [value(5)]]);
    assert.deepEqual(contribution.resolve([...fallback].reverse()), contribution.resolve(fallback));
    assert.equal(fallback.length, 3);
});

test("contributions: selection preserves domain payloads without interpreting or flattening them", () => {
    const budget = { fixed: 2, ratio: 0.5 };
    const entries = contribution.set(
        contribution.set([], { id: "budget", value: budget }),
        { id: "pending", value: ["first", "second"] },
    );
    const resolved = contribution.resolve(entries);
    assert.equal(resolved[0], budget);
    assert.equal(resolved[1], entries[1].value);
    assert.deepEqual(resolved, [budget, ["first", "second"]]);

    const volumes = [
        { id: "weak", value: 1, group: { id: "volume", priority: 1 } },
        { id: "strong", value: 3, group: { id: "volume", priority: 2 } },
        { id: "independent", value: -1 },
    ];
    assert.deepEqual(contribution.resolve(volumes), [-1, 3]);
    assert.equal(contribution.resolve(volumes).reduce((sum, value) => sum + value, 0), 2);
});
