import { compose } from "../../dist/core/unit/index.js";
import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { ref } from "../../dist/core/unit/query.js";
import { update } from "../../dist/core/battle/unit.js";
import {
    setAttackContribution,
    removeAttackContribution,
    resolveAttack,
} from "../../dist/core/unit/capability/offense/index.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";

test("exclusive selection precedes dynamic input evaluation and the attribute formula combines surviving sources", () => {
    const calls = [];
    let state = battle([
        { definition: { id: "source", hooks: Hooks.empty(), offense: { attack: 100 } }, position: [0, 0] },
    ]);
    const host = ref(get(state, 0));
    const group = { id: "inspiration", priority: 2 };
    state = update(state, host, compose(compose(compose(setAttackContribution({ id: "flat", value: [create({ addition: 20 })] }), setAttackContribution({
            id: "ratio",
            value: [create({ multiplier: 0.5, finalScaler: 2 })],
        })), setAttackContribution({
            id: "inspiration/weak",
            group,
            value: () => {
                calls.push("weak");
                return [create({ finalAddition: 10 })];
            },
        })), setAttackContribution({
            id: "inspiration/strong",
            group: { ...group, priority: 3 },
            value: (current, self) => {
                calls.push("strong");
                return [create({ finalAddition: get(current, self.id).definition.offense.attack / 2 })];
            },
        })));
    assert.equal(resolveAttack(state, get(state, host.id)), 460);
    assert.deepEqual(calls, ["strong"]);

    state = update(state, host, removeAttackContribution("inspiration/strong"));
    assert.equal(resolveAttack(state, get(state, host.id)), 380);
    assert.deepEqual(calls, ["strong", "weak"]);
    state = update(state, host, setAttackContribution({
            id: "stronger",
            group: { ...group, priority: 4 },
            value: [create({ finalAddition: 100.25 })],
        }));
    assert.equal(resolveAttack(state, get(state, host.id)), 560.5);
    assert.deepEqual(calls, ["strong", "weak"]);
    state = update(state, host, setAttackContribution({
        id: "attack-penalty", value: [create({ finalAddition: -1000 })],
    }));
    assert.equal(resolveAttack(state, get(state, host.id)), 0);
});
