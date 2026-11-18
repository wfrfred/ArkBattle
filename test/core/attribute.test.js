// Contract: [attribute](../../docs/architecture/attribute.md).
import assert from "node:assert/strict";
import test from "node:test";
import * as attribute from "../../dist/core/unit/attribute.js";
import * as modifier from "../../dist/core/common/modifier.js";

test("attributes clamp the base and modified result against their respective ranges", () => {
    const definition = { default: 10, min: 0, max: 100 };
    let state = attribute.initialize(definition);
    state = attribute.setContribution(state, {
        id: "bonus", value: [modifier.create({ addition: 2, finalScaler: 0.25 })],
    });
    assert.equal(attribute.resolve(definition, state), 3);
    state = attribute.setRange(definition, state, { min: 6, max: 8 });
    assert.equal(attribute.resolve(definition, state), 6);
    state = attribute.setContribution(state, { id: "bonus", value: [modifier.create({ addition: 100 })] });
    assert.equal(attribute.resolve(definition, state), 8);

    const clampedBase = { default: 0, min: 1, max: null };
    let incremented = attribute.setContribution(attribute.initialize(clampedBase), {
        id: "addition", value: [modifier.create({ addition: 1 })],
    });
    incremented = attribute.setRange(clampedBase, incremented, { min: 0, max: 100 });
    assert.equal(attribute.resolve(clampedBase, incremented), 2);
});

test("range writes replace a single whole slot and clearing restores both definition bounds", () => {
    const definition = { default: 50, min: 20, max: 100 };
    const initial = attribute.initialize(definition);
    const contributed = attribute.setContribution(initial, { id: "bonus", value: [modifier.create({ addition: 10 })] });
    let state = attribute.setRange(definition, contributed, { min: 70, max: 80 });
    state = attribute.setRange(definition, state, { min: null, max: 90 });
    assert.deepEqual([state.min, state.max], [20, 90]);
    state = attribute.setRange(definition, state, { min: 85, max: null });
    assert.deepEqual([state.min, state.max], [85, 100]);
    assert.equal(attribute.setRange(definition, state, { min: null, max: null }), state);
    const cleared = attribute.clearRange(definition, state);
    assert.deepEqual([cleared.min, cleared.max], [20, 100]);
    assert.equal(cleared.contributions, contributed.contributions);
    assert.equal(attribute.resolve(definition, cleared), 60);
    assert.equal(attribute.clearRange(definition, cleared), cleared);
    const removed = attribute.removeContribution(state, "bonus");
    assert.deepEqual([removed.min, removed.max], [85, 100]);
});

test("attribute queries evaluate only effective contributions against the current caller facts", () => {
    const definition = { default: 10, min: 0, max: null };
    let state = attribute.initialize(definition);
    state = attribute.setContribution(state, {
        id: "suppressed", group: { id: "bonus", priority: 1 },
        value: () => assert.fail("suppressed input must not execute"),
    });
    state = attribute.setContribution(state, {
        id: "effective", group: { id: "bonus", priority: 2 },
        value: (battle, self) => [modifier.create({ addition: battle.tick + self.bonus })],
    });
    assert.equal(attribute.resolve(definition, state, { tick: 2 }, { bonus: 3 }), 15);
    assert.equal(attribute.resolve(definition, state, { tick: 5 }, { bonus: 3 }), 18);
});
