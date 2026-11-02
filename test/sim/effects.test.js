import { ref as effectRef } from "../../dist/core/unit/effect/effect.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { initialize } from "../helpers/unit.js";
import { getUnit } from "../helpers/unit.js";
import * as effect from "../../dist/core/unit/effect/index.js";
import { get } from "../../dist/core/unit/effect/index.js";
import { definition, effectFixtureWork, install, attackBuff, refreshAttack } from "../helpers/effects.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";

const unit = (id = 0) =>
    initialize({
        id,
        position: [0, 0],
        definition: { hooks: [],
            id: `effect-unit-${id}`,
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            offense: { attack: 100 },
        },
    });

test("effects: a direct static definition initializes private state and runs install before enable", () => {
    const seen = [];
    const value = definition(
        "direct",
        { count: 0 },
        {
            onInstall(state, self) {
                assert.equal(get(state, effectRef(self)).definition, value);
                const currentData = effect.get(state, effectRef(self)).data;
                state = effect.setData(state, effectRef(self), {
                    count: currentData.count + 1,
                });
                seen.push(["install", get(state, effectRef(self)).data.count]);
                return state;
            },
            onEnable(state, self) {
                seen.push(["enable", self.data.count]);
                return state;
            },
        },
    );
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    assert.equal(get(battle, ref).definition, value);
    assert.deepEqual(get(battle, ref).data, { count: 1 });
    assert.equal(get(battle, ref).status, "ACTIVE");
    assert.deepEqual(seen, [
        ["install", 1],
        ["enable", 1],
    ]);
});

test("effects: disabling withdraws output while preserving private state and identity", () => {
    const seen = [];
    const value = attackBuff("attack", 20, {
        onInstall: (state) => {
            seen.push("install");
            return state;
        },
        onEnable: (state) => {
            seen.push("enable");
            return state;
        },
        onDisable: (state) => {
            seen.push("disable");
            return state;
        },
    });
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    const attack = () => resolveAttack(battle, unitRef(getUnit(battle, 0)));
    assert.equal(attack(), 120);
    battle = effect.setEnabled(battle, ref, false);
    assert.equal(attack(), 100);
    battle = effect.setData(battle, ref, { amount: 30 });
    assert.equal(attack(), 100);
    battle = effect.setEnabled(battle, ref, true);
    assert.equal(attack(), 130);
    assert.deepEqual(seen, ["install", "enable", "disable", "enable"]);
    assert.equal(get(battle, ref).id, ref.id);
});

test("effects: content explicitly refreshes a static contribution after changing private state", () => {
    const value = attackBuff();
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    const previous = battle;
    battle = effect.setData(battle, ref, { amount: 50 });
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 0))), 120);
    battle = refreshAttack(battle, ref);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 0))), 150);
    assert.equal(resolveAttack(previous, unitRef(getUnit(previous, 0))), 120);
});

test("effects: ending withdraws outputs before terminal business and repeated ending does nothing", () => {
    const seen = [];
    const value = attackBuff("ending", 20, {
        onDisable(state, self) {
            seen.push(["disable", self.status]);
            return state;
        },
        onEnd(state, self, reason) {
            seen.push(["end", reason, resolveAttack(state, unitRef(getUnit(state, 0)))]);
            return effect.end(state, effectRef(self), "REENTRANT");
        },
    });
    let battle = effectFixtureWork(unit());
    let ref;
    ({ state: battle, value: ref } = install(battle, value));
    battle = effect.end(battle, ref, "DISPELLED");
    battle = effect.end(battle, ref, "OTHER");
    assert.deepEqual(
        seen.map((entry) => entry[0]),
        ["disable", "end"],
    );
    assert.deepEqual(seen[1], ["end", "DISPELLED", 100]);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 0))), 100);
});
