import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { prepare } from "../../dist/data/arknights/operator.js";
import { create, readShield } from "../../dist/content/operators/mudrock/unit.js";
import { initialize, getUnit } from "../helpers/unit.js";
import { fixtureBattlefieldState } from "../helpers/battlefield.js";
import { damage, parameters } from "../helpers/vitality.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add, update } from "../../dist/core/battle/unit.js";
import { ref } from "../../dist/core/unit/index.js";
import { advance as advanceBlocking } from "../../dist/core/battle/blocking/index.js";
import { advance as advanceEffects } from "../../dist/core/unit/effect/index.js";
import { advance as advanceSkill, activate, modify } from "../../dist/core/unit/skill/index.js";
import { ref as skillRef } from "../helpers/skill.js";
import { start, advance as advanceAction, ref as actionRef } from "../../dist/core/unit/action/index.js";
import { advance as advanceLocomotion } from "../../dist/core/unit/capability/locomotion/index.js";
import { setAttackContribution } from "../../dist/core/unit/capability/offense/index.js";
import { setMaxHpContribution } from "../../dist/core/unit/capability/vitality/index.js";
import { setType } from "../../dist/core/unit/capability/layer/index.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";
import { Vec2 } from "../../dist/core/common/vector.js";

const data = JSON.parse(readFileSync(new URL("../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8"));
const moduleX = "uniequip_002_mudrok";
const profile = (fields = {}) => {
    const configuration = { elite: 2, level: 90, potential: 1, skillIndex: 1, skillLevel: 7, trust: 100, ...fields };
    return prepare({ id: "char_311_mudrok", record: data.characters.char_311_mudrok },
        data.skills.skchr_mudrok_2, configuration, {
            ranges: data.ranges, favor: data.favor,
            ...(configuration.module === undefined ? {} : {
                equipment: data.equipment[configuration.module.id],
                battleEquipment: data.battleEquipment[configuration.module.id],
            }),
        });
};
const enemy = (id, position, fields = {}) => initialize({ id, position, definition: {
    id: "enemy", hooks: Hooks.empty(), targetable: { taunt: 0, restrictions: [] },
    vitality: { maxHp: 10000, defense: 0, resistance: 0 },
    allegiance: { side: "ENEMY" }, layer: { type: "GROUND" },
    hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 } },
    locomotion: { halfBodyWidth: 0, minSpeed: 0, speed: 0.1, steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    ...fields,
} });
function setup(configuration = {}, targets = [], options = {}) {
    const prepared = profile(configuration);
    const content = create(prepared, options);
    const unit = initialize({ id: 0, position: [0, 0], definition: content.definition,
        initial: { occupancy: { tile: [0, 0], direction: "RIGHT" } } });
    let battle = add(createBattleState(fixtureBattlefieldState([])), unit);
    for (const target of targets) battle = add(battle, target);
    return { prepared, ...content, unit, battle: advanceBlocking(battle) };
}
const hit = (battle, source = null, power = 100) => damage(battle, {
    source: source === null ? null : { id: source }, target: { id: 0 },
    parameters: parameters(power, "TRUE"),
});
function advanceEffectsUntil(battle, tick) {
    for (let currentTick = battle.tick + 1; currentTick <= tick; currentTick++) {
        battle = advanceEffects({ ...battle, tick: currentTick });
    }
    return battle;
}
function wound(battle) {
    battle = hit(battle, null, 1).state;
    battle = hit(battle, null, getUnit(battle, 0).vitality.hp - 1000).state;
    return modify(battle, ref(getUnit(battle, 0)), -getUnit(battle, 0).skill.sp.value).state;
}
const approximate = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, String(actual) + " != " + expected);
function canMove(battle, unit) {
    const goal = [unit.position[0] + 0.05, unit.position[1]];
    const moved = advanceLocomotion(battle, ref(unit), { nextPoint: goal, goal }, { mode: "WALK", speedMultiplier: 1 });
    return !Vec2.equal(getUnit(moved, unit.id).position, unit.position);
}

test("Mudrock's shield cancels a hit, consumes one layer, self-heals and retains HIT recovery", () => {
    const fixture = setup();
    const wounded = wound(fixture.battle);
    const restored = advanceEffectsUntil(wounded, 270);
    const result = hit(restored, null, 5000);
    assert.deepEqual(result.value.received.cancellation, { reason: "MUDROCK_SHIELD" });
    approximate(getUnit(result.state, 0).vitality.hp, 1000 + fixture.prepared.attributes.maxHp * 0.2);
    assert.equal(getUnit(result.state, 0).skill.sp.value, 1);
    assert.equal(hit(result.state).value.application.hpLoss, 100);
});

test("Mudrock's shield keeps recharging while capped", () => {
    const fixture = setup();
    let battle = hit(fixture.battle).state;
    battle = advanceEffectsUntil(battle, 1000);
    assert.equal(readShield(getUnit(battle, 0)).layers, 3);
    for (let layer = 0; layer < 3; layer++) battle = hit(battle).state;
    const beforeRecovery = hit(advanceEffectsUntil(battle, 1079));
    assert.equal(beforeRecovery.value.application.hpLoss, 100);
    const recovered = hit(advanceEffectsUntil(beforeRecovery.state, 1080));
    assert.deepEqual(recovered.value.received.cancellation, { reason: "MUDROCK_SHIELD" });
});

test("module X uses current max HP for shield healing and distinguishes blocked Sarkaz sources", () => {
    const fixture = setup({ module: { id: moduleX, level: 3 } }, [
        enemy(1, [0.6, 0], { blockable: { volume: 1, rules: [] }, profile: { tags: ["sarkaz"] } }),
        enemy(2, [5, 0], { profile: { tags: ["sarkaz"] } }),
        enemy(3, [6, 0]),
    ]);
    let battle = update(fixture.battle, ref(fixture.unit), setMaxHpContribution({
        id: "max-hp", value: [modifier({ addition: 1000 })],
    }));
    battle = advanceEffectsUntil(wound(battle), 270);
    const shielded = hit(battle);
    approximate(getUnit(shielded.state, 0).vitality.hp, 1000 + (fixture.prepared.attributes.maxHp + 1000) * 0.23);
    assert.equal(getUnit(shielded.state, 0).skill.sp.value, 3);
    approximate(hit(shielded.state, 1).value.application.hpLoss, 59.5);
    approximate(hit(shielded.state, 2).value.application.hpLoss, 70);
    assert.equal(hit(shielded.state, 3).value.application.hpLoss, 100);
});

test("S2 waits for an eligible target without spending its SP", () => {
    const fixture = setup({}, [enemy(1, [5, 0])]);
    const ready = modify(fixture.battle, ref(fixture.unit), 5).state;
    const result = activate(ready, skillRef(getUnit(ready, 0)), "AUTO");
    assert.equal(result.value, null);
    assert.equal(getUnit(result.state, 0).skill.sp.value, 5);
});

test("S2 replaces normal recovery, heals once and revalidates its bound targets without selecting replacements", () => {
    const fixture = setup({}, [enemy(1, [1, 0]), enemy(2, [0.8, 0]),
        enemy(3, [1, 0], { layer: { type: "AIR" } })], { recoveryTicks: 2 });
    let battle = wound(fixture.battle);
    const normal = fixture.unit.action.actions.get("normal-attack").definition;
    const ordinary = start(battle, actionRef(ref(fixture.unit), normal));
    battle = advanceAction(ordinary.state, ordinary.value);
    battle = modify(battle, ref(fixture.unit), 5).state;
    battle = update(battle, ref(fixture.unit), setAttackContribution({
        id: "attack", value: [modifier({ addition: 100 })],
    }));
    const beforeFirst = getUnit(battle, 1).vitality.hp;
    const beforeSecond = getUnit(battle, 2).vitality.hp;
    battle = advanceSkill(battle, ref(fixture.unit));
    assert.equal(getUnit(battle, 0).action.actions.get(normal.id).cooldown.readyAtTick, 0);
    const started = start(battle, actionRef(ref(fixture.unit), fixture.action));
    battle = update(started.state, ref(getUnit(started.state, 2)), setType("AIR"));
    battle = update(battle, ref(getUnit(battle, 3)), setType("GROUND"));
    battle = advanceAction(battle, started.value);
    const amount = (fixture.prepared.attributes.attack + 100) * 2.1;
    approximate(getUnit(battle, 1).vitality.hp, beforeFirst - amount);
    assert.equal(getUnit(battle, 2).vitality.hp, beforeSecond);
    assert.equal(getUnit(battle, 3).vitality.hp, 10000);
    approximate(getUnit(battle, 0).vitality.hp, 1000 + fixture.prepared.attributes.maxHp * 0.05);
    assert.equal(getUnit(battle, 0).skill.sp.value, 0);
    assert.notEqual(getUnit(battle, 0).skill.activation, null);
    battle = advanceAction({ ...battle, tick: 2 }, started.value);
    assert.equal(getUnit(battle, 0).skill.activation, null);

    assert.equal(canMove(battle, getUnit(battle, 1)), false);
    const recovered = advanceEffectsUntil(battle, 18);
    assert.equal(canMove(recovered, getUnit(recovered, 1)), true);
});

test("Mudrock rejects the unimplemented module Y instead of applying module X behavior", () => {
    assert.throws(() => create(profile({ module: { id: "uniequip_003_mudrok", level: 3 } })), /only module X/);
});
