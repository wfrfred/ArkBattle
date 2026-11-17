// Contract: [Data](../../../docs/architecture/data.md).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseAttackTiming } from "../../../dist/data/action/timing.js";

const timing = JSON.parse(readFileSync(
    new URL("../../fixtures/arknights/action_timing.json", import.meta.url),
    "utf8",
));

test("authored attack timing preserves the beginning segment, unlimited scaling and fractional ticks", () => {
    assert.deepEqual(parseAttackTiming(timing.melantha), {
        type: "ATTACK_SPEED",
        beginTicks: 15,
        durationTicks: 30,
        releaseTicks: 14,
        minScale: 0,
        maxScale: null,
    });
    assert.deepEqual(parseAttackTiming({ ...timing.melantha, authoredSpeed: 2 }), {
        type: "ATTACK_SPEED",
        beginTicks: 7.5,
        durationTicks: 15,
        releaseTicks: 7,
        minScale: 0,
        maxScale: null,
    });
});
