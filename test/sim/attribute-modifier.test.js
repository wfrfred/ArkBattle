import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
    parseAttributeModifiers,
    compileAttributeModifiers,
} from "../../dist/data/arknights/modifier.js";
import * as modifier from "../../dist/core/unit/contribution/attribute.js";

const fixture = (name) =>
    JSON.parse(
        readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8"),
    );
const description = (formulaItem, value, patch = {}) => ({
    attributeType: "ATK",
    formulaItem,
    value,
    loadFromBlackboard: false,
    fetchBaseValueFromSourceEntity: false,
    ...patch,
});
const context = (patch = {}) => ({
    blackboard: new Map(),
    stackCount: 1,
    readSourceAttribute: () => undefined,
    ...patch,
});
const sample = (raw, input = context()) =>
    compileAttributeModifiers(parseAttributeModifiers([raw]))[0].sample(input);
const close = (actual, expected) =>
    assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} ≈ ${expected}`);

test("attribute modifiers: serialized enum names and numbers normalize only supported consumers", () => {
    const raw = [description("MULTIPLIER", 0.5), description(1, 0.5, { attributeType: 1 })];
    const parsed = parseAttributeModifiers(raw);
    assert.deepEqual(parsed[0], parsed[1]);
    const compiled = compileAttributeModifiers(parsed);
    assert.equal(compiled[0].sample(context()).multiplier, 0.5);
    assert.throws(
        () => parseAttributeModifiers([description("MULTIPLIER", 1, { attributeType: "COST" })]),
        /unsupported modifier/,
    );

});

test("attribute modifiers: four native operands compose before the domain range", () => {
    const entries = [
        description("ADDITION", 10),
        description("MULTIPLIER", 0.5),
        description("FINAL_ADDITION", 7),
        description("FINAL_SCALER", 1.2),
    ];
    const values = compileAttributeModifiers(parseAttributeModifiers(entries)).map((entry) =>
        entry.sample(context({ stackCount: 3 })),
    );
    close(modifier.apply(100, values), ((100 + 30) * 2.5 + 21) * 3.6);
    assert.equal(values[0].addition, 30);
    assert.equal(values[1].multiplier, 1.5);
    assert.equal(values[2].finalAddition, 21);
    close(values[3].finalScaler, 3.6);
});

test("attribute modifiers: a stacked raw final scaler is corrected once, never exponentiated", () => {
    const result = sample(description("FINAL_SCALER", -0.2), context({ stackCount: 3 }));
    close(result.finalScaler, 0.4);
    close(modifier.apply(100, [result]), 40);
    assert.equal(sample(description("FINAL_SCALER", -0.2), context({ stackCount: 0 })), undefined);
    const independent = [
        sample(description("FINAL_SCALER", -0.2)),
        sample(description("FINAL_SCALER", -0.2)),
    ];
    close(modifier.apply(100, independent), 64);
});

test("attribute modifiers: missing blackboard keys use the declared operand without changing its formula", () => {
    const raw = description("FINAL_ADDITION", 7, { loadFromBlackboard: true });
    assert.equal(sample(raw).finalAddition, 7);
    assert.equal(
        sample(raw, context({ blackboard: new Map([["atk", 11]]), stackCount: 2 })).finalAddition,
        22,
    );
    assert.equal(sample(raw, context({ blackboard: new Map([["atk", 0]]) })).finalAddition, 0);
});

test("attribute modifiers: source sampling selects native addition slots and normally omits an absent source", () => {
    const input = context({
        stackCount: 2,
        readSourceAttribute: (attribute) => {
            assert.equal(attribute, "ATK");
            return 100;
        },
    });
    for (const [formula, value, key, expected] of [
        ["ADDITION", 2.5, "addition", 105],
        ["MULTIPLIER", 0.25, "addition", 50],
        ["FINAL_ADDITION", 2.5, "finalAddition", 105],
        ["FINAL_SCALER", 0.25, "finalAddition", 50],
    ]) {
        const raw = description(formula, value, { fetchBaseValueFromSourceEntity: true });
        assert.equal(sample(raw, input)[key], expected);
        assert.equal(sample(raw), undefined);
    }
    const negative = sample(
        description("FINAL_SCALER", -0.2, { fetchBaseValueFromSourceEntity: true }),
        context({ stackCount: 3, readSourceAttribute: () => 100 }),
    );
    close(negative.finalAddition, 40);
    assert.equal(negative.finalScaler, 1);
});

test("attribute modifiers: BAT and MOVE_SPEED normalize only additive operands to core units", () => {
    const bat = sample(
        description("ADDITION", 0.5, { attributeType: "BASE_ATTACK_TIME" }),
        context({ stackCount: 2 }),
    );
    assert.equal(bat.addition, 30);
    const speed = sample(description("FINAL_ADDITION", 3, { attributeType: "MOVE_SPEED" }));
    assert.equal(speed.finalAddition, 0.1);
    const ratio = sample(description("MULTIPLIER", -0.5, { attributeType: "MOVE_SPEED" }));
    assert.equal(ratio.multiplier, -0.5);
    const sourced = sample(
        description("FINAL_SCALER", 0.5, {
            attributeType: "MOVE_SPEED",
            fetchBaseValueFromSourceEntity: true,
        }),
        context({ readSourceAttribute: () => 2 }),
    );
    assert.equal(sourced.finalAddition, 1 / 30);
});

test("attribute modifiers: BLOCK_CNT uses native number 5 and leaves quantization to Blocking", () => {
    const named = description("ADDITION", 0, {
        attributeType: "BLOCK_CNT",
        loadFromBlackboard: true,
    });
    const numeric = { ...named, attributeType: 5 };
    assert.deepEqual(parseAttributeModifiers([named]), parseAttributeModifiers([numeric]));
    const value = sample(
        numeric,
        context({ blackboard: new Map([["block_cnt", -0.25]]), stackCount: 2 }),
    );
    assert.equal(value.addition, -0.5);
    assert.equal(modifier.apply(3, [value]), 2.5);
});

test("attribute modifiers: Warfarin's actual ATK descriptor is a percentage contribution", () => {
    const raw = fixture("modifiers_bldsk_s_2");
    const [compiled] = compileAttributeModifiers(parseAttributeModifiers(raw.attributeModifiers));
    assert.equal(compiled.attributeType, "ATK");
    const value = compiled.sample(context({ blackboard: new Map([["atk", 0.9]]) }));
    assert.equal(value.multiplier, 0.9);
    close(modifier.apply(100, [value]), 190);
});

test("attribute modifiers: native Mire data preserves ASPD and normalized movement operands", () => {
    const raw = fixture("buff_mire_attr");
    const blackboard = new Map(
        fixture("skill_sktok_mire").levels[0].blackboard.map(({ key, value }) => [key, value]),
    );
    const compiled = compileAttributeModifiers(
        parseAttributeModifiers(raw.node._buff.attributes.attributeModifiers),
    );
    const sampled = new Map(
        compiled.map(entry => [entry.attributeType, entry.sample(context({ blackboard }))]),
    );
    assert.equal(modifier.apply(200, [sampled.get("ATTACK_SPEED")]), 190);
    close(modifier.apply(1 / 30, [sampled.get("MOVE_SPEED")]), 0.95 / 30);
});
