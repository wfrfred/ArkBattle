import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { Hooks } from "../../dist/core/hook.js";
import { ref } from "../../dist/core/unit/query.js";
import { update } from "../../dist/core/battle/unit.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";
import { setAttackContribution, resolveAttack } from "../../dist/core/unit/capability/offense/index.js";

test("effective attack keeps fractional values and applies its nonnegative bound after modifiers", () => {
    let state = battle([{ definition: {
        id: "attacker", hooks: Hooks.empty(), offense: { attack: 100.25 },
    }, position: [0, 0] }]);
    const host = ref(get(state, 0));
    state = update(state, [setAttackContribution(host, { id: "power", value: [
        create({ addition: 0.25, multiplier: 0.5, finalAddition: 0.75, finalScaler: 1.2 }),
    ] })]);
    assert.ok(Math.abs(resolveAttack(state, get(state, host.id)) - 181.8) < 1e-9);
    state = update(state, [setAttackContribution(host, {
        id: "power", value: [create({ finalAddition: -101 })],
    })]);
    assert.equal(resolveAttack(state, get(state, host.id)), 0);
});
