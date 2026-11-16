// Contract: [data](../../docs/architecture/data.md).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseBuffStacking } from "../../dist/data/effect/stacking.js";
import { parseAttributeModifiers } from "../../dist/data/effect/modifier.js";
import {
    parseElementType,
    createArknightsElementalDefinition,
} from "../../dist/data/effect/elemental.js";

const fixture = (name) =>
    JSON.parse(
        readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8"),
    );

test("effect data: native mania maps to the standard burst for either receiver", () => {
    assert.equal(parseElementType("ANGER"), "MANIA");
    assert.equal(parseElementType(5), "MANIA");

    for (const receiver of ["CHARACTER", "ENEMY"]) {
        const definition = createArknightsElementalDefinition({ receiver });
        const burst = definition.bursts.MANIA;
        assert.equal(burst.durationTicks, 450);
        assert.equal(burst.initialize().type, "MANIA");
    }
});

test("effect data: native stacking limits and refresh options remain independent", () => {
    const { fixtures } = fixture("buff_stacking");
    const native = (key) => fixtures.find(({ buff }) => buff.buffKey === key).buff;

    assert.deepEqual(parseBuffStacking(native("sbell2_e_002_trait[interval]")), {
        overrideType: "STACK",
        maxStackCnt: -1,
        maxValidStackCnt: 5,
        refreshRemainingTimeWhenStackMax: false,
        clearAllStackCntWhenTimeUp: false,
        takeSnapshotWhenExtend: false,
    });
    assert.deepEqual(parseBuffStacking(native("ascln_t_1[debuff]")), {
        overrideType: "STACK",
        maxStackCnt: 1,
        maxValidStackCnt: -1,
        refreshRemainingTimeWhenStackMax: true,
        clearAllStackCntWhenTimeUp: true,
        takeSnapshotWhenExtend: false,
    });
});

test("effect data: native modifier enums normalize while retaining deferred operands", () => {
    const raw = fixture("modifiers_bldsk_s_2");

    assert.deepEqual(parseAttributeModifiers(raw.attributeModifiers), [
        {
            attributeType: "ATK",
            formulaItem: "MULTIPLIER",
            value: 0,
            loadFromBlackboard: true,
            fetchBaseValueFromSourceEntity: false,
        },
    ]);
});
