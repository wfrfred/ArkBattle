// Contract: [data](../../../docs/architecture/data.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseLevelContent, parseLevelDefinition } from "../../../dist/data/level/definition.js";
import { parsePredefinedCreation, resolvePredefinedPrefabKey } from "../../../dist/data/level/predefined.js";
import { parsePredefinedPrefab } from "../../../dist/data/level/prefab.js";
import { resolvePredefinedSkillId, resolvePredefinedSkillBlackboard } from "../../../dist/data/skill/predefined.js";
import { resolveTerrainControllers } from "../../../dist/data/level/terrain.js";
import { initialize } from "../../../dist/core/battle/index.js";
import { at as occupancyAt } from "../../../dist/core/battlefield/occupancy.js";
import { add, all, initialize as initializeUnit } from "../../../dist/core/unit/index.js";
import { hasTargetable } from "../../../dist/core/unit/capability/targetable/capability.js";
import { inCategories } from "../../../dist/core/battle/targeting/index.js";

const fixture = (name) => JSON.parse(readFileSync(
    new URL(`../../fixtures/arknights/${name}.json`, import.meta.url), "utf8",
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

test("real hidden devices preserve placement, static classification and target category", () => {
    const raw = fixture("level_act1autochess_m02");
    const { instance, character, profile } = predefined(raw, "trap_1105_accrate");
    const crateCreation = parsePredefinedCreation(instance, profile, character);
    const platformData = predefined(raw, "trap_1106_achplat");
    const platformCreation = parsePredefinedCreation(
        platformData.instance, platformData.profile, platformData.character,
    );
    assert.equal(instance.hidden, true);
    assert.equal(instance.alias, "trap_1105_accrate#001");
    assert.equal(platformData.instance.hidden, true);
    assert.equal(platformData.instance.alias, "trap_1106_achplat#001");
    assert.equal(crateCreation.type, "UNIT");
    assert.equal(platformCreation.type, "UNIT");
    const level = parseLevelDefinition(raw, { mire: null, deepsea: null, tileDeploymentPrefabs: [],
        consumeTileBlackboard: (_context, entry) => ["isValidHand", "previewNotAlloed"].includes(entry.key),
    });
    let battle = initialize({
        map: level.map, initialUnits: [], initialEffects: [],
        schedule: { waves: [], branches: {} }, moveMultiplier: 1, pushMultiplier: 0.5, deployment: null, initialCards: [], rngState: 123,
    });
    const initializedCrate = initializeUnit(battle, crateCreation);
    battle = add(initializedCrate.state, initializedCrate.value);
    const [crate] = battle.battlefield.units.values();
    assert.deepEqual(crate.position, [4, 12]);
    assert.deepEqual(crate.occupancy.tile, [12, 4]);
    assert.equal(occupancyAt(battle.battlefield, [12, 4]).occupant, crate.ref);
    assert.deepEqual(crate.definition.classification, {
        type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [],
    });
    assert.equal(crate.targetable.category, "OBSTACLE");
    const initializedPlatform = initializeUnit(battle, platformCreation);
    battle = add(initializedPlatform.state, initializedPlatform.value);
    const platform = [...battle.battlefield.units.values()]
        .find(unit => unit.definition.id === "trap_1106_achplat");
    assert.deepEqual(platform.definition.classification, {
        type: "DEVICE", side: "ALLY", filterTags: ["SANDBOX_FACTORY"], groupTags: [],
    });
    assert.equal(platform.targetable.category, "DEVICE");
    const candidates = all(battle).filter(hasTargetable);
    assert.deepEqual(Array.from(candidates.filter(inCategories(["DEFAULT"]))), []);
    assert.deepEqual(Array.from(candidates.filter(inCategories(["DEFAULT", "DEVICE"])), unit => unit.ref.id), [platform.ref.id]);

    const modifiedPrefab = fixture("prefab_trap_1106_achplat");
    const token = modifiedPrefab.components.find(component => "_rewriteTileOptions" in component.fields).fields;
    token._sideType = 2;
    token._filterTag = ["changed-filter"];
    token._category = 1;
    const modifiedCharacter = {
        ...platformData.character,
        mainPower: { nationId: "laterano", groupId: null, teamId: null },
        subPower: [{ nationId: "kazimierz", groupId: null, teamId: null }],
    };
    const modifiedPlatform = parsePredefinedCreation(
        platformData.instance, parsePredefinedPrefab(modifiedPrefab), modifiedCharacter,
    );
    assert.deepEqual(modifiedPlatform.definition.classification, {
        type: "DEVICE", side: "ENEMY", filterTags: ["changed-filter"], groupTags: ["laterano", "kazimierz"],
    });
    assert.equal(modifiedPlatform.definition.targetable.category, "DEVICE");
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
        const { instance, character, profile, skill } = predefined(fixture(name), key);
        const creation = parsePredefinedCreation(instance, profile, character);
        assert.equal(creation.type, "EFFECT");
        assert.equal(creation.definition.id, key);
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
