import { Hooks } from "../../dist/core/hook.js";
import { deepsea as deepseaTerrain, mire as mireTerrain } from "../../dist/content/terrain/definition.js";
import { tilesOf } from "../helpers/tiles.js";
import { predefinedIdsForAlias, appear, remove } from "../../dist/core/battle/steps/predefined.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialize } from "../../dist/core/battle/index.js";
import { apply as applyOverlays } from "../../dist/core/battlefield/navigation/overlay.js";
import { loadMovementScenario } from "../../dist/data/arknights/movement-scenario.js";
import { addCard, createRequest, preview } from "../../dist/core/battle/deployment/index.js";
import { createCardDefinition } from "../helpers/deployable.js";

const navigationMap = (state) => applyOverlays(state.baseline.WALK, state.overlays.WALK);
const fixture = (name) => JSON.parse(readFileSync(
    new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8",
));
const catalog = {
    character: (key) => fixture(`character_${key}`),
    skill: (key) => fixture(`skill_${key}`),
    prefab: (key) => fixture(`prefab_${key}`),
    enemy: (key) => fixture(key === "enemy_1000_gopro_2" ? "enemy_1000_gopro" : key),
};
const selection = (index) => ({ source: "predefines", collection: "tokenInsts", index });
function scenario(rawLevel) {
    return loadMovementScenario(rawLevel, {
        actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }],
        branches: [],
        predefines: rawLevel.predefines.tokenInsts.flatMap((instance, index) =>
            ["trap_1105_accrate", "trap_098_mire", "trap_042_tidectrl"].includes(instance.inst.characterKey)
                ? [selection(index)] : []),
    }, catalog, 123);
}

test("a real hidden crate changes its tile while present and restores it on removal", () => {
    const loaded = scenario(fixture("level_act1autochess_m02"));
    let battle = initialize(loaded.spec);
    const [id] = predefinedIdsForAlias(battle.definition.predefines, "trap_1105_accrate#001");
    const tile = [12, 4];
    const original = navigationMap(battle.battlefield.navigation).get(tile);
    assert.equal(battle.battlefield.units.size, 0);
    battle = appear(battle, id);
    const crate = [...battle.battlefield.units.values()][0];
    assert.deepEqual(crate.position, [4, 12]);
    assert.equal(navigationMap(battle.battlefield.navigation).get(tile).cost, 1000);
    assert.equal(navigationMap(battle.battlefield.navigation).get(tile).passable, original.passable);
    battle = remove(battle, id, "SCRIPT");
    assert.equal(battle.battlefield.units.has(crate.id), false);
    assert.deepEqual(navigationMap(battle.battlefield.navigation).get(tile), original);
});

test("real mire and tide controllers provide shared terrain parameters without becoming spatial units", () => {
    for (const [name, key, terrain, parameters] of [
        ["level_act2autochess_m02", "trap_098_mire", mireTerrain, {
            stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05,
            moveSpeedRatioPerStack: -0.05, maxStacks: 10,
        }],
        ["level_act2autochess_m04", "trap_042_tidectrl", deepseaTerrain, {
            damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6,
        }],
    ]) {
        const loaded = scenario(fixture(name));
        const battle = initialize(loaded.spec);
        const [controller] = battle.mechanisms.values();
        assert.equal(battle.mechanisms.size, 1);
        assert.equal(controller.definition.id, key);
        assert.equal([...battle.battlefield.units.values()].some((unit) => unit.definition.id === key), false);
        const [tile] = tilesOf(loaded.spec.map, terrain);
        assert.deepEqual(tile.definition.terrain.params, parameters);
    }
});

test("predefined skill blackboard overrides supply the effective terrain parameters", () => {
    const raw = fixture("level_act2autochess_m04");
    const controller = raw.predefines.tokenInsts.find((instance) => instance.inst.characterKey === "trap_042_tidectrl");
    controller.mainSkillLvl = 2;
    controller.overrideSkillBlackboard = [
        { key: "SEA_DROWN[ENEMY].DAMAGE", value: 90, valueStr: null },
        { key: "Sea_Drown[Enemy].Attack_Speed", value: -0.25, valueStr: null },
        { key: "sea_drown[enemy].move_speed", value: 0.75, valueStr: null },
    ];
    const loaded = scenario(raw);
    const [tile] = tilesOf(loaded.spec.map, deepseaTerrain);
    assert.deepEqual(tile.definition.terrain.params, {
        damage: 90, attackSpeedModifier: -0.25, moveSpeedMultiplier: 0.75,
    });
});

test("omitted content is reported while unsupported selected customization is rejected", () => {
    const raw = fixture("level_act1autochess_m01");
    const index = raw.predefines.tokenInsts.findIndex((instance) => instance.inst.characterKey === "trap_1105_accrate");
    raw.predefines.tokenInsts[index].uniEquipIds = ["unsupported_equipment"];
    const omitted = loadMovementScenario(raw, {
        actions: [], branches: [], predefines: [],
    }, catalog, 123);
    assert.ok(omitted.omittedPredefines.includes(`predefines.tokenInsts[${index}]`));
    assert.throws(() => loadMovementScenario(raw, {
        actions: [], branches: [], predefines: [selection(index)],
    }, catalog, 123), /unsupported predefined character customization/);
});

test("a real hidden platform supports ranged deployment and restores its tile on removal", () => {
    const raw = fixture("level_act1autochess_m02");
    const index = raw.predefines.tokenInsts.findIndex((instance) => instance.inst.characterKey === "trap_1106_achplat");
    const instance = raw.predefines.tokenInsts[index];
    const loaded = loadMovementScenario(raw, {
        actions: [], branches: [], predefines: [selection(index)],
    }, catalog, 123);
    let battle = initialize(loaded.spec);
    const [id] = predefinedIdsForAlias(battle.definition.predefines, instance.alias);
    const tile = [instance.position.row, instance.position.col];
    const original = navigationMap(battle.battlefield.navigation).get(tile);
    battle = appear(battle, id);
    const platform = [...battle.battlefield.units.values()][0];
    const current = battle.battlefield.map.tiles.get(tile[0] * battle.battlefield.map.columns + tile[1]);
    assert.equal(current.state.elevation, "HIGHLAND");
    assert.equal(current.state.placement, "RANGED");
    assert.equal(current.state.walkCost, 1000);
    assert.equal(occupancyAt(battle.battlefield, tile).support.id, platform.id);
    for (const [placement, expected] of [["RANGED", "ALLOWED"], ["MELEE", "REJECTED"]]) {
        const added = addCard(battle, {
            id: `platform-preview-${placement}`, hooks: Hooks.empty(),
            occupancy: { slot: "OCCUPANT" }, deployable: { retreatRules: [] },
            card: createCardDefinition({ placement }),
        });
        assert.equal(preview(added.state, createRequest(added.state, added.value, tile)).type, expected);
    }
    battle = remove(battle, id, "SCRIPT");
    assert.deepEqual(navigationMap(battle.battlefield.navigation).get(tile), original);
});
