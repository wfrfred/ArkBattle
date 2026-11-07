import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { prepare } from "../../dist/data/arknights/operator.js";
import { create } from "../../dist/content/operators/melantha/unit.js";
import { initialize, getUnit } from "../helpers/unit.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add } from "../../dist/core/battle/unit.js";
import { activate, advance, modify } from "../../dist/core/unit/skill/index.js";
import { ref as skillRef } from "../helpers/skill.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { ref } from "../../dist/core/unit/index.js";
import { start, advance as advanceAction, ref as actionRef } from "../../dist/core/unit/action/index.js";
import { advance as advanceBlocking, relations } from "../../dist/core/battle/blocking/index.js";
import { invisibleRestriction } from "../../dist/core/effects/visibility.js";

const data = JSON.parse(readFileSync(new URL("../fixtures/arknights/main-mode-units.json", import.meta.url)));
const profile = () => prepare(
    { id: "char_208_melan", record: data.characters.char_208_melan },
    data.skills["skcom_atk_up[1]"],
    { elite: 1, level: 55, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 },
    { ranges: data.ranges, favor: data.favor },
);
const receiver = (restrictions = []) => initialize({
    id: 1, position: [0.6, 0], definition: {
        id: "enemy", hooks: Hooks.empty(), targetable: { restrictions },
        vitality: { maxHp: 10000, defense: 0, resistance: 0 },
        blockable: { volume: 1, rules: [] }, allegiance: { side: "ENEMY" }, layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 } },
    },
});
const source = () => initialize({
    id: 0, position: [0, 0], definition: create(profile()),
    initial: { occupancy: { tile: [0, 0], direction: "RIGHT" } },
});

test("Melantha's talent and S1 affect real attacks, and the talent remains after S1 ends", () => {
    const actor = source();
    let battle = add(add(createBattleState(fixtureBattlefieldState([])), actor), receiver());
    const base = (738 + 25 + 65) * 1.08;
    assert.equal(resolveAttack(battle, getUnit(battle, actor.id)), base);

    battle = modify(battle, ref(actor), 40).state;
    battle = activate(battle, skillRef(getUnit(battle, 0))).state;
    const attack = actor.action.actions.get("normal-attack").definition;
    const started = start(battle, actionRef(ref(actor), attack));
    battle = advanceAction(started.state, started.value.ref);
    assert.ok(Math.abs(getUnit(battle, 1).vitality.hp - (10000 - (738 + 25 + 65) * 1.58)) < 1e-6);

    battle = advance({ ...battle, tick: 600 }, ref(actor));
    assert.equal(resolveAttack(battle, getUnit(battle, actor.id)), base);
    assert.equal(getUnit(battle, 0).skill.activation, null);
});

test("Melantha's ordinary attack still requires a visible target while blocking it", () => {
    const actor = source();
    const enemy = receiver([{ id: "hidden", value: invisibleRestriction }]);
    const battle = advanceBlocking(add(add(createBattleState(fixtureBattlefieldState([])), actor), enemy));
    assert.equal(relations(battle)[0].blocked.id, enemy.id);
    const attack = actor.action.actions.get("normal-attack").definition;
    assert.deepEqual(start(battle, actionRef(ref(actor), attack)).value, {
        type: "REJECTED", reason: "CONDITION",
    });
});
