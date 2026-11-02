import { set as setFixtureEntry } from "../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";

import assert from "node:assert/strict";
import { test } from "node:test";
import { unit, workFor, attach, request, damageEffect } from "../helpers/vitality.js";
import { getUnit } from "../helpers/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as damage from "../../dist/core/battle/damage/hook.js";

import { calculateDamage } from "../../dist/core/battle/damage/calculate.js";
import { applyDamage } from "../../dist/core/battle/damage/apply.js";

const settle = (battle, input) => applyDamage(input, calculateDamage(battle, input));
const damageHook = (id, stage, invoke, priority = 0, accepts = () => true) => ({ id, stage, priority, accepts, invoke });

const withDamage = (unit, ...entries) => ({ ...unit, vitality: {...unit.vitality, damageHooks:entries.reduce((entries, entry) => setFixtureEntry(entries, entry), unit.vitality.damageHooks)} });

test("hook dispatch checks each Effect against its current status immediately before invocation", () => {
    const calls = [];
    let enableSecond = false;
    const first = damageEffect("first", {}, [{
        stage: "receiving", priority: 10,
        invoke(state, _context, _self, pending) {
            calls.push("first");
            return { state: effects.setEnabled(state, { host: { id: 2 }, id: 1 }, enableSecond), value: pending };
        },
    }]);
    const second = damageEffect("second", {}, [{ stage: "receiving", invoke(state, _context, _self, pending) {
        calls.push("second"); return { state, value: pending };
    } }]);
    const target = attach(attach(unit(2), first), second);
    let battle = workFor(unit(1), target);
    const initial = battle;
    battle = settle(battle, request()).state;
    assert.deepEqual(calls, ["first"]);
    enableSecond = true;
    battle = settle(battle, request()).state;
    assert.deepEqual(calls, ["first", "first", "second"]);
    assert.equal(getUnit(initial, 2).effects.values().toArray()[1].status, "ACTIVE");
});

test("selected Hook IDs use current replacements while nested damage selects its own latest candidates", () => {
    const calls = [];
    let nested = false;
    let changed = false;
    const multiply = factor => (state, _context, input) => ({ state, value: { ...input, attack: { ...input.attack, power: input.attack.power * factor } } });
    const replacement = damageHook("second", "sourceFormula", (state, context, input) => {
        calls.push("replacement"); return multiply(2)(state, context, input);
    });
    const added = damageHook("third", "sourceFormula", (state, context, input) => {
        calls.push("added"); return multiply(3)(state, context, input);
    });
    const first = damageHook("first", "sourceFormula", (state, _context, input) => {
        calls.push(nested ? "nested-first" : "first");
        if (!changed) {
            changed = true;
            state = applyUnitChanges(state, [damage.removeHook({id:1}, "second"), damage.setHook({id:1}, replacement), damage.setHook({id:1}, added)]);
            nested = true;
            state = settle(state, request(10)).state;
            nested = false;
        }
        return { state, value: input };
    }, 10);
    const old = damageHook("second", "sourceFormula", (state, _context, input) => { calls.push("removed"); return { state, value: input }; });
    const source = withDamage(unit(1, { hp: 1000 }), first, old);
    const initial = settle(workFor(source, unit(2, { hp: 1000 })), request(100));
    assert.deepEqual(calls, ["first", "nested-first", "replacement", "added", "replacement"]);
    assert.equal(initial.value.application.hpLoss, 200);
    assert.equal(getUnit(initial.state, 2).vitality.hp, 740);
    assert.deepEqual(source.vitality.damageHooks, [first, old]);
    calls.length = 0;
    const later = settle(initial.state, request(100));
    assert.equal(later.value.application.hpLoss, 600);
    assert.deepEqual(calls, ["first", "replacement", "added"]);
});

test("Completed enumerates each participant once when source and target are the same Unit", () => {
    const calls = [];
    const first = damageHook("first", "completed", state => { calls.push("first"); return { state, value: undefined }; }, 10);
    const second = damageHook("second", "completed", state => { calls.push("second"); return { state, value: undefined }; });
    settle(workFor(withDamage(unit(1), first, second)), request(10, { target: { id: 1 } }));
    assert.deepEqual(calls, ["first", "second"]);
});
