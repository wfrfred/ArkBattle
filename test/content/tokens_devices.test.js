import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseLevelContent, parseLevelDefinition } from "../../dist/data/level/definition.js";
import { parsePredefinedDefinition, resolvePredefinedPrefabKey } from "../../dist/data/level/predefined.js";
import { parsePredefinedPrefab } from "../../dist/data/level/prefab.js";
import { resolvePredefinedSkillId, resolvePredefinedSkillBlackboard } from "../../dist/data/skill/predefined.js";
import { resolveTerrainControllers } from "../../dist/data/level/terrain.js";
import { predefinedIdsForAlias, appear } from "../../dist/core/battle/steps/predefined.js";
import { initialize } from "../../dist/core/battle/index.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";

const fixture = (name) => JSON.parse(readFileSync(
    new URL(`../fixtures/arknights/${name}.json`, import.meta.url), "utf8",
));

function predefined(raw, key) {
    const content = parseLevelContent(raw);
    const instance = content.predefines.tokenInsts.find(({ inst }) => inst.characterKey === key);
    const character = fixture(`character_${key}`);
    const skillId = resolvePredefinedSkillId(instance, character);
    const skill = resolvePredefinedSkillBlackboard(instance, character, fixture(`skill_${skillId}`));
    const profile = parsePredefinedPrefab(
        fixture(`prefab_${resolvePredefinedPrefabKey(instance, character)}`),
        skill.prefabKey === null ? undefined : fixture(`prefab_${skill.prefabKey}`),
    );

    return { instance, character, skill, profile };
}

test("a real hidden predefine converts its alias, world position and occupancy tile", () => {
    const raw = fixture("level_act1autochess_m02");
    const { instance, character, profile } = predefined(raw, "trap_1105_accrate");
    const definition = parsePredefinedDefinition(0, instance, profile, character);
    const level = parseLevelDefinition(raw, {
        consumeTileBlackboard: (_context, entry) => ["isValidHand", "previewNotAlloed"].includes(entry.key),
    });
    let battle = initialize({
        map: level.map, predefines: [definition], initialMechanisms: [],
        schedule: { waves: [], branches: {} }, routeMoveMultiplier: 1, rngState: 123,
    });
    assert.equal(battle.battlefield.units.size, 0);
    const [id] = predefinedIdsForAlias(battle.definition.predefines, "trap_1105_accrate#001");
    battle = appear(battle, id);
    const [crate] = battle.battlefield.units.values();
    assert.deepEqual(crate.position, [4, 12]);
    assert.deepEqual(crate.occupancy.tile, [12, 4]);
    assert.equal(occupancyAt(battle.battlefield, [12, 4]).occupant.id, crate.id);
});

test("real controller and skill data supply shared terrain parameters", () => {
    for (const [name, key, terrain, parameters] of [
        ["level_act2autochess_m02", "trap_098_mire", "mire", {
            stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05,
            moveSpeedRatioPerStack: -0.05, maxStacks: 10,
        }],
        ["level_act2autochess_m04", "trap_042_tidectrl", "deepsea", {
            damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6,
        }],
    ]) {
        const { profile, skill } = predefined(fixture(name), key);
        const resolved = resolveTerrainControllers([{ profile, skill }]);
        assert.deepEqual(resolved.mapOptions[terrain], parameters);
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
    const { profile, skill } = predefined(raw, "trap_042_tidectrl");
    const resolved = resolveTerrainControllers([{ profile, skill }]);
    assert.deepEqual(resolved.mapOptions.deepsea, {
        damage: 90, attackSpeedModifier: -0.25, moveSpeedMultiplier: 0.75,
    });
});
