import { attribute, vitality } from "../../helpers/attribute.js";
// Contract: [content](../../../docs/architecture/content.md).
import { Hooks } from "../../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { create } from "../../../dist/content/operators/melantha/unit.js";
import { tables } from "../../helpers/operator.js";
import { initialize, getUnit } from "../../helpers/unit.js";
import { createBattleState } from "../../../dist/core/battle/state.js";
import { add } from "../../../dist/core/unit/operations.js";
import { activate, advance, modify } from "../../../dist/core/unit/capability/skill/index.js";
import { ref as skillRef } from "../../helpers/skill.js";
import { resolveAttack } from "../../../dist/core/unit/capability/offense/index.js";
import { fixtureBattlefieldState } from "../../helpers/battlefield.js";
import { ref } from "../../../dist/core/unit/index.js";
import { start, advance as advanceAction, ref as actionRef, cancel, forUnit } from "../../../dist/core/unit/capability/action/index.js";
import { advance as advanceBlocking, relations } from "../../../dist/core/battle/blocking/index.js";
import { invisible, invisibleRestriction } from "../../../dist/core/effects/visibility.js";

import { install, remove as removeEffect } from "../../../dist/core/effect/index.js";
import { advance as advanceCombat } from "../../../dist/core/battle/steps/combat.js";

const configuration = { elite: 1, level: 55, potential: 6, skillIndex: 0, skillLevel: 7, trust: 100 };
const receiver = (restrictions = []) => initialize({
    id: 1, position: [0.6, 0], definition: {
        id: "enemy", hooks: Hooks.empty(), targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions },
        vitality: vitality(10000),
        blockable: { volume: 1, restrictions: [] }, classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" }, layer: { type: "GROUND" },
        hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 } },
    },
});
const source = () => initialize({
    id: 0, position: [0, 0], definition: create(configuration, tables),
    initial: { occupancy: { tile: [0, 0], direction: "RIGHT" }, facing: { direction: "RIGHT" } },
});

test("Melantha's talent and S1 affect real attacks, and the talent remains after S1 ends", () => {
    const actor = source();
    let battle = add(add(createBattleState(fixtureBattlefieldState([])), actor), receiver());
    const base = (738 + 25 + 65) * 1.08;
    assert.equal(resolveAttack(battle, actor.ref.get(battle)), base);

    battle = modify(battle, ref(actor), 40).state;
    battle = activate(battle, skillRef(getUnit(battle, 0))).state;
    const attack = actor.action.actions.get("normal-attack").definition;
    const started = start(battle, actionRef(actor.action.actions.get(attack)));
    battle = started.state;
    for (let tick = 0; tick <= 29; tick++) battle = advanceAction({ ...battle, tick }, started.value);
    assert.ok(Math.abs(getUnit(battle, 1).vitality.health.hp - (10000 - (738 + 25 + 65) * 1.58)) < 1e-6);

    battle = advance({ ...battle, tick: 600 }, ref(actor));
    assert.equal(resolveAttack(battle, actor.ref.get(battle)), base);
});

test("Melantha's ordinary attack still requires a visible target while blocking it", () => {
    const actor = source();
    const enemy = receiver([{ id: "hidden", value: invisibleRestriction }]);
    const battle = advanceBlocking(add(add(createBattleState(fixtureBattlefieldState([])), actor), enemy));
    assert.equal(relations(battle)[0].blocked, enemy.ref);
    const attack = actor.action.actions.get("normal-attack").definition;
    assert.equal(start(battle, actionRef(actor.action.actions.get(attack))).value, null);
});

test("Melantha pays Begin on first entry, skips it for consecutive attacks, and restores it after a target gap or interruption", () => {
    const actor = source();
    let battle = advanceCombat(add(add(createBattleState(fixtureBattlefieldState([])), actor), receiver()));
    const through = untilTick => {
        for (let tick = battle.tick + 1; tick <= untilTick; tick++) {
            battle = advanceCombat({ ...battle, tick });
        }
    };
    const releases = () => battle.events
        .filter(event => event.type === "DAMAGE" && event.targetUnitId === 1)
        .map(event => event.tick);
    through(28);
    assert.deepEqual(releases(), []);
    through(29);
    assert.deepEqual(releases(), [29]);
    through(65);
    assert.deepEqual(releases(), [29]);
    through(66);
    assert.deepEqual(releases(), [29, 66]);

    const hidden = install(battle, ref(getUnit(battle, 1)), invisible);
    battle = hidden.state;
    through(90);
    assert.deepEqual(battle.events.filter(event => event.type === "ATTACK_STARTED").map(event => event.tick), [0, 45]);
    battle = removeEffect(battle, hidden.value);
    through(119);
    assert.deepEqual(releases(), [29, 66]);
    through(120);
    assert.deepEqual(releases(), [29, 66, 120]);

    battle = cancel({ ...battle, tick: 121 }, forUnit(battle, ref(actor))[0], "INTERRUPTED");
    through(164);
    assert.deepEqual(releases(), [29, 66, 120]);
    through(165);
    assert.deepEqual(releases(), [29, 66, 120, 165]);
});
