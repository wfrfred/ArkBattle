import { attribute, vitality } from "../../helpers/attribute.js";
// Contract: [content](../../../docs/architecture/content.md).
import { Hooks } from "../../../dist/core/hook.js";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseAttackTiming } from "../../../dist/data/action/timing.js";
import { prepare } from "../../../dist/data/unit/operator.js";
import { create, readShield } from "../../../dist/content/operators/mudrock/unit.js";
import { initialize, getUnit } from "../../helpers/unit.js";
import { fixtureBattlefieldState } from "../../helpers/battlefield.js";
import { damage, parameters } from "../../helpers/vitality.js";
import { createBattleState } from "../../../dist/core/battle/state.js";
import { add, update } from "../../../dist/core/unit/operations.js";
import { ref, compose, setHook, removeHook } from "../../../dist/core/unit/index.js";
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import { advance as advanceBlocking } from "../../../dist/core/battle/blocking/index.js";
import { advance as advanceEffects } from "../../../dist/core/unit/effect/index.js";
import { advance as advanceSkill, activate, modify } from "../../../dist/core/unit/capability/skill/index.js";
import { ref as skillRef } from "../../helpers/skill.js";
import { start, advance as advanceAction, ref as actionRef, getExecution } from "../../../dist/core/unit/capability/action/index.js";
import { advance as advanceLocomotion } from "../../../dist/core/unit/capability/locomotion/index.js";
import { setAttackContribution } from "../../../dist/core/unit/capability/offense/index.js";
import { setMaxHpContribution } from "../../../dist/core/unit/capability/vitality/index.js";
import { setType } from "../../../dist/core/unit/capability/layer/index.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";
import { Vec2 } from "../../../dist/core/common/vector.js";
import { turn } from "../../../dist/core/unit/capability/facing/index.js";

const data = JSON.parse(readFileSync(new URL("../../fixtures/arknights/main-mode-units.json", import.meta.url), "utf8"));
const normalTiming = parseAttackTiming(JSON.parse(readFileSync(new URL("../../fixtures/arknights/action_timing.json", import.meta.url), "utf8")).mudrockNormal);
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
    id: "enemy", hooks: Hooks.empty(), targetable: { taunt: attribute(0, -2, 2), restrictions: [] },
    vitality: vitality(10000),
    classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" }, layer: { type: "GROUND" },
    hitbox: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 } },
    locomotion: { halfBodyWidth: 0, speed: attribute(0.1, 0), steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    ...fields,
} });
function setup(configuration = {}, targets = [], options = {}) {
    const prepared = profile(configuration);
    const content = create(prepared, normalTiming, options);
    const unit = initialize({ id: 0, position: [0, 0], definition: content.definition,
        initial: { occupancy: { tile: [0, 0], direction: "RIGHT" }, facing: { direction: "RIGHT" } } });
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
    battle = hit(battle, null, getUnit(battle, 0).vitality.health.hp - 1000).state;
    return modify(battle, ref(getUnit(battle, 0)), -getUnit(battle, 0).skill.sp.value).state;
}
const approximate = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, String(actual) + " != " + expected);
function canMove(battle, unit) {
    const goal = [unit.position[0] + 0.05, unit.position[1]];
    const moved = advanceLocomotion(battle, ref(unit), { nextPoint: goal, goal }, { mode: "WALK", speedMultiplier: 1 });
    return !Vec2.equal(getUnit(moved, unit.id).position, unit.position);
}

test("Mudrock's shield cancels environmental damage, self-heals and retains eligible HIT recovery", () => {
    const fixture = setup();
    const wounded = wound(fixture.battle);
    const restored = advanceEffectsUntil(wounded, 270);
    const result = damage(restored, {
        source: null, target: ref(getUnit(restored, 0)),
        nature: "ENVIRONMENT", hitRecovery: true,
        parameters: parameters(5000, "TRUE"),
    });
    assert.equal(result.value.received.reason, "BLOCKED");
    approximate(getUnit(result.state, 0).vitality.health.hp, 1000 + fixture.prepared.attributes.maxHp * 0.2);
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
    assert.equal(recovered.value.received.reason, "BLOCKED");
});

test("module X uses current max HP for shield healing and distinguishes blocked Sarkaz sources", () => {
    const fixture = setup({ module: { id: moduleX, level: 3 } }, [
        enemy(1, [0.6, 0], { blockable: { volume: 1, restrictions: [] }, classification: { type: "ENEMY", side: "ENEMY", filterTags: ["sarkaz"], rank: "NORMAL" } }),
        enemy(2, [5, 0], { classification: { type: "ENEMY", side: "ENEMY", filterTags: ["sarkaz"], rank: "NORMAL" } }),
        enemy(3, [6, 0]),
    ]);
    let battle = update(fixture.battle, ref(fixture.unit), setMaxHpContribution({
        id: "max-hp", value: [modifier({ addition: 1000 })],
    }));
    battle = advanceEffectsUntil(wound(battle), 270);
    const shielded = hit(battle);
    approximate(getUnit(shielded.state, 0).vitality.health.hp, 1000 + (fixture.prepared.attributes.maxHp + 1000) * 0.23);
    assert.equal(getUnit(shielded.state, 0).skill.sp.value, 3);
    approximate(hit(shielded.state, 1).value.application.hpLoss, 59.5);
    approximate(hit(shielded.state, 2).value.application.hpLoss, 70);
    assert.equal(hit(shielded.state, 3).value.application.hpLoss, 100);
});

test("APPLY-03: Mudrock requires a successful block for shield costs and benefits", () => {
    const fixture = setup({ module: { id: moduleX, level: 3 } }, [
        enemy(1, [0.6, 0], { blockable: { volume: 1, restrictions: [] }, classification: { type: "ENEMY", side: "ENEMY", filterTags: ["sarkaz"], rank: "NORMAL" } }),
    ]);
    const ready = advanceEffectsUntil(wound(fixture.battle), 270);
    const observed = [];
    const observe = stage => ({
        id: stage,
        invoke(state, { received }) {
            observed.push([stage, received.type, received.amount]);
            return { state, value: undefined };
        },
    });
    let battle = update(ready, ref(fixture.unit), compose(
        setHook(hpDamage.beforeReceive, {
            id: "fix-amount", priority: 200,
            invoke(state, _context, pending) {
                assert.equal(pending.type, "NORMAL");
                return { state, value: hpDamage.fix(pending) };
            },
        }),
        setHook(hpDamage.targetApplied, observe("applied")),
    ));
    battle = update(battle, ref(getUnit(battle, 1)), setHook(hpDamage.beforeCommit, observe("commit")));

    const shielded = hit(battle, 1);
    assert.equal(shielded.value.type, "CANCELLED");
    assert.deepEqual(shielded.value.received, {
        type: "CANCELLED", amount: 100, reason: "BLOCKED",
    });
    approximate(getUnit(shielded.state, 0).vitality.health.hp, 1000 + fixture.prepared.attributes.maxHp * 0.23);
    assert.equal(getUnit(shielded.state, 0).skill.sp.value, 3);
    assert.equal(readShield(getUnit(shielded.state, 0)).layers, 0);
    assert.deepEqual(observed, []);

    const unshielded = hit(shielded.state, 1);
    assert.equal(unshielded.value.type, "APPLIED");
    assert.deepEqual(unshielded.value.received, { type: "FIXED", amount: 100 });
    assert.equal(unshielded.value.application.hpLoss, 100);
    assert.deepEqual(observed, [["commit", "FIXED", 100], ["applied", "FIXED", 100]]);

    observed.length = 0;
    const request = {
        source: ref(getUnit(battle, 1)), target: ref(getUnit(battle, 0)),
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: ref(getUnit(battle, 1)), parameters: parameters(100, "TRUE"),
    };
    const accepted = hpDamage.applyDamage(request, hpDamage.calculateDamage(battle, request), {
        forbidden: new Set(["BLOCKED"]),
    });
    assert.equal(accepted.value.type, "APPLIED");
    assert.deepEqual(accepted.value.received, { type: "FIXED", amount: 100 });
    assert.equal(accepted.value.application.hpLoss, 100);
    assert.equal(getUnit(accepted.state, 0).vitality.health.hp, 900);
    assert.equal(getUnit(accepted.state, 0).skill.sp.value, 1);
    assert.equal(readShield(getUnit(accepted.state, 0)).layers, 1);
    assert.deepEqual(observed, [["commit", "FIXED", 100], ["applied", "FIXED", 100]]);

    const ordinary = update(battle, ref(fixture.unit), removeHook(hpDamage.beforeReceive, "fix-amount"));
    const reduced = hpDamage.applyDamage(request, hpDamage.calculateDamage(ordinary, request), {
        forbidden: new Set(["BLOCKED"]),
    });
    assert.equal(reduced.value.type, "APPLIED");
    assert.equal(reduced.value.received.type, "NORMAL");
    approximate(reduced.value.application.hpLoss, 59.5);
    approximate(getUnit(reduced.state, 0).vitality.health.hp, 940.5);
    assert.equal(getUnit(reduced.state, 0).skill.sp.value, 1);
    assert.equal(readShield(getUnit(reduced.state, 0)).layers, 1);

    observed.length = 0;
    const missed = update(ordinary, ref(fixture.unit), setHook(hpDamage.beforeReceive, {
        id: "evade", priority: 200,
        invoke(state, context, pending) {
            return { state, value: hpDamage.cancel(pending, "MISS", context.forbidden) };
        },
    }));
    const cancelled = hpDamage.applyDamage(request, hpDamage.calculateDamage(missed, request));
    assert.equal(cancelled.value.type, "CANCELLED");
    assert.equal(cancelled.value.received.reason, "MISS");
    assert.equal(getUnit(cancelled.state, 0).vitality.health.hp, 1000);
    assert.equal(getUnit(cancelled.state, 0).skill.sp.value, 0);
    assert.equal(readShield(getUnit(cancelled.state, 0)).layers, 1);
    assert.deepEqual(observed, []);
});

test("S2 waits for an eligible target without spending its SP", () => {
    const fixture = setup({}, [enemy(1, [5, 0])]);
    const ready = modify(fixture.battle, ref(fixture.unit), 5).state;
    const result = activate(ready, skillRef(getUnit(ready, 0)));
    assert.equal(result.value, null);
    assert.equal(getUnit(result.state, 0).skill.sp.value, 5);
});

test("S2 replaces normal recovery, heals once and revalidates its bound targets without selecting replacements", () => {
    const fixture = setup({}, [enemy(1, [1, 0]), enemy(2, [0.8, 0]),
        enemy(3, [1, 0], { layer: { type: "AIR" } })], { recoveryTicks: 2 });
    let battle = wound(fixture.battle);
    battle = turn(battle, ref(fixture.unit), "LEFT");
    const normal = fixture.unit.action.actions.get("normal-attack").definition;
    const ordinary = start(battle, actionRef(ref(fixture.unit), normal));
    battle = advanceAction(ordinary.state, ordinary.value);
    assert.equal(getUnit(battle, 0).facing.direction, "RIGHT");
    battle = modify(battle, ref(fixture.unit), 5).state;
    battle = update(battle, ref(fixture.unit), setAttackContribution({
        id: "attack", value: [modifier({ addition: 100 })],
    }));
    const beforeFirst = getUnit(battle, 1).vitality.health.hp;
    const beforeSecond = getUnit(battle, 2).vitality.health.hp;
    battle = advanceSkill(battle, ref(fixture.unit));
    assert.equal(getUnit(battle, 0).action.actions.get(normal.id).cooldown.readyAtTick, 0);
    battle = turn(battle, ref(fixture.unit), "LEFT");
    const started = start(battle, actionRef(ref(fixture.unit), fixture.action));
    battle = update(started.state, ref(getUnit(started.state, 2)), setType("AIR"));
    battle = update(battle, ref(getUnit(battle, 3)), setType("GROUND"));
    battle = advanceAction(battle, started.value);
    assert.equal(getUnit(battle, 0).facing.direction, "LEFT");
    const amount = (fixture.prepared.attributes.attack + 100) * 2.1;
    approximate(getUnit(battle, 1).vitality.health.hp, beforeFirst - amount);
    assert.equal(getUnit(battle, 2).vitality.health.hp, beforeSecond);
    assert.equal(getUnit(battle, 3).vitality.health.hp, 10000);
    approximate(getUnit(battle, 0).vitality.health.hp, 1000 + fixture.prepared.attributes.maxHp * 0.05);
    assert.equal(getUnit(battle, 0).skill.sp.value, 0);
    assert.notEqual(getUnit(battle, 0).skill.activation, null);
    battle = advanceAction({ ...battle, tick: 2 }, started.value);
    assert.equal(getUnit(battle, 0).skill.activation, null);

    assert.equal(canMove(battle, getUnit(battle, 1)), false);
    const recovered = advanceEffectsUntil(battle, 18);
    assert.equal(canMove(recovered, getUnit(recovered, 1)), true);
});

test("S2 interrupts an ordinary attack before its authored release and prevents a late normal hit", () => {
    const fixture = setup({}, [enemy(1, [1, 0])]);
    const host = ref(fixture.unit);
    const normal = fixture.unit.action.actions.get("normal-attack").definition;
    const pending = start(fixture.battle, actionRef(host, normal));
    let battle = pending.state;
    for (let tick = 0; tick <= 5; tick++) battle = advanceAction({ ...battle, tick }, pending.value);
    assert.equal(getUnit(battle, 1).vitality.health.hp, 10000);
    battle = modify(battle, host, 5 - getUnit(battle, 0).skill.sp.value).state;
    const activated = activate(battle, skillRef(getUnit(battle, 0)));
    assert.notEqual(activated.value, null);
    battle = activated.state;
    assert.equal(getExecution(battle, pending.value), undefined);
    const special = start(battle, actionRef(host, fixture.action));
    assert.notEqual(special.value, null);
    battle = advanceAction(special.state, special.value);
    const afterSkill = 10000 - fixture.prepared.attributes.attack * 2.1;
    approximate(getUnit(battle, 1).vitality.health.hp, afterSkill);
    for (let tick = 6; tick <= 48; tick++) battle = advanceAction({ ...battle, tick }, pending.value);
    approximate(getUnit(battle, 1).vitality.health.hp, afterSkill);
});

test("Mudrock rejects the unimplemented module Y instead of applying module X behavior", () => {
    assert.throws(() => create(profile({ module: { id: "uniequip_003_mudrok", level: 3 } }), normalTiming), /only module X/);
});
