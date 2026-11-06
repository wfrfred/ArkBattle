import { combine } from "../../dist/core/unit/index.js";
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
    state = update(state, combine([
        setAttackContribution(host, { id: "flat", value: [create({ addition: 20 })] }),
        setAttackContribution(host, {
            id: "ratio",
            value: [create({ multiplier: 0.5, finalScaler: 2 })],
        }),
        setAttackContribution(host, {
            id: "inspiration/z",
            group,
            value: () => {
                calls.push("z");
                return [create({ finalAddition: 10 })];
            },
        }),
        setAttackContribution(host, {
            id: "inspiration/a",
            group,
            value: (current, self) => {
                calls.push("a");
                assert.equal(get(current, self.id), self);
                return [create({ finalAddition: self.definition.offense.attack / 2 })];
            },
        }),
    ]));
    assert.equal(resolveAttack(state, get(state, host.id)), 460);
    assert.deepEqual(calls, ["a"]);

    state = update(state, removeAttackContribution(host, "inspiration/a"));
    assert.equal(resolveAttack(state, get(state, host.id)), 380);
    assert.deepEqual(calls, ["a", "z"]);
    state = update(state,
        setAttackContribution(host, {
            id: "stronger",
            group: { ...group, priority: 3 },
            value: [create({ finalAddition: 100 })],
        })
    );
    assert.equal(resolveAttack(state, get(state, host.id)), 560);
    assert.deepEqual(calls, ["a", "z"]);
});
