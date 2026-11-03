import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { areHostile } from "../../dist/core/unit/capability/allegiance/capability.js";

test("neutral, allied and enemy sides do not imply the same combat relationship", () => {
    const state = battle(
        ["ALLY", "ENEMY", "NEUTRAL"].map((side) => ({
            definition: { id: side, hooks: Hooks.empty(), allegiance: { side } },
            position: [0, 0],
        })),
    );
    const ally = get(state, 0),
        enemy = get(state, 1),
        neutral = get(state, 2);
    assert.equal(areHostile(ally, enemy), true);
    assert.equal(areHostile(enemy, neutral), true);
    assert.equal(areHostile(ally, neutral), false);
    assert.equal(areHostile(enemy, enemy), false);
});
