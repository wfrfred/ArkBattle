import { update } from "../../dist/core/battle/unit.js";
import * as unitQueries from "../../dist/core/unit/query.js";

import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";
import { getUnit } from "../helpers/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import {
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
} from "../../dist/core/unit/capability/vitality/capability.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";
import { effectFixtureWork, install, maxHpBuff } from "../helpers/effects.js";
const bonus = (amount) => create({ finalAddition: amount });
const receiver = (hp = 50) => {
    const unit = initialize({
        id: 1,
        position: [0, 0],
        definition: { hooks: [], id: "host", vitality: { maxHp: 100, defense: 0, resistance: 0 } },
    });
    return { ...unit, vitality: { ...unit.vitality, hp } };
};
const pair = (battle) => {
    const unit = getUnit(battle, 1);
    return [unit.vitality.hp, resolveMaxHp(unit.vitality, unit.definition.vitality)];
};
test("MaxHP: direct capability changes coordinate HP independently of Effects", () => {
    const initial = effectFixtureWork(receiver());
    const installed = update(initial, [setMaxHpContribution({id:1}, { id: "equipment", value: [bonus(100)] })]);
    assert.deepEqual(pair(installed), [100, 200]);
    const replaced = update(installed, [setMaxHpContribution({id:1}, { id: "equipment", value: [bonus(200)] })]);
    assert.deepEqual(pair(replaced), [150, 300]);
    assert.equal(getUnit(replaced,1).vitality.maxHp.length, 1);
    const removed = update(replaced, [removeMaxHpContribution({id:1}, "equipment")]);
    assert.deepEqual(pair(removed), [50, 100]);
    assert.equal(update(removed, [removeMaxHpContribution({id:1}, "missing")]), removed);
    assert.deepEqual(pair(initial), [50, 100]);
    const originalDead = effectFixtureWork(receiver(0));
    const dead = update(originalDead, [setMaxHpContribution({id:1}, { id: "equipment", value: [bonus(100)] })]);
    assert.deepEqual(pair(dead), [0, 200]);
});

test("MaxHP outputs coordinate each setter before its lifecycle callback", () => {
    const observed = [];
    let battle = effectFixtureWork(receiver());
    const content = maxHpBuff("hp", 100, {
        onEnable: (state, self) => { observed.push(["enabled", getUnit(state, self.host.id).vitality.hp]); return state; },
        onDisable: (state, self) => { observed.push(["disabled", getUnit(state, self.host.id).vitality.hp]); return state; },
        onEnd: (state, self) => { observed.push(["ended", getUnit(state, self.host.id).vitality.hp]); return state; },
    });
    const before = battle;
    const installed = install(battle, content);
    battle = installed.state;
    const ref = installed.value;
    assert.deepEqual(pair(battle), [100, 200]);
    battle = effects.setEnabled(battle, ref, false);
    assert.deepEqual(pair(battle), [50, 100]);
    battle = effects.setData(battle, ref, { amount: 200 });
    battle = effects.setEnabled(battle, ref, true);
    assert.deepEqual(pair(battle), [150, 300]);
    battle = effects.end(battle, ref);
    assert.deepEqual(pair(battle), [50, 100]);
    assert.deepEqual(observed, [
        ["enabled", 100],
        ["disabled", 50],
        ["enabled", 150],
        ["disabled", 50],
        ["ended", 50],
    ]);
    assert.equal(unitQueries.get(before, { id: 1 }).vitality.hp, 50);
});
