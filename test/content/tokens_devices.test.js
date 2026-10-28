import * as siteConditions from "../../dist/content/terrain/condition.js";
import { parseSiteCondition, parseAllowedSiteConditions } from "../../dist/data/arknights/site-condition.js";
import { mire as mireTerrain, deepsea as deepseaTerrain } from "../../dist/content/terrain/definition.js";
import { tilesOf } from "../helpers/tiles.js";
import { predefinedIdsForAlias } from "../../dist/core/battle/steps/predefined.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initialize as initializeBattle, step as advanceBattle } from "../../dist/core/battle/index.js";
import { create as createFieldState } from "../../dist/core/battlefield/state.js";
import { remove as removeFieldUnit } from "../../dist/core/battlefield/unit.js";
import { apply as applyOverlays } from "../../dist/core/battlefield/navigation/overlay.js";
import { loadMovementScenario } from "../../dist/data/arknights/movement-scenario.js";
import { createLevelDefinition, parseLevelContent } from "../../dist/data/arknights/level.js";
import { resolvePredefinedSkillBlackboard } from "../../dist/data/arknights/skill.js";
import { parsePredefinedPrefab, parseTileDeploymentPrefab } from "../../dist/data/arknights/prefab.js";
import { evaluateDeployment } from "../../dist/core/battle/deployment/index.js";
import { parseBattlefieldMap } from "../../dist/data/arknights/map.js";
import { initialize as initializeUnit } from "../../dist/core/unit/index.js";
import { add as addBattleUnit, update as updateBattleUnit } from "../../dist/core/battle/unit.js";
import { update as updateBattleTile } from "../../dist/core/battle/tile.js";
import { get as getMapTile } from "../../dist/core/battlefield/map/map.js";

const navigationMap = (state, mode = 'WALK') => applyOverlays(state.baseline[mode], state.overlays[mode]);


function arknightsFixture(name) {
  return JSON.parse(readFileSync(new URL(`../fixtures/arknights/${name}.json`, import.meta.url), 'utf8'));
}


const movementCatalog = {
  character: (key) => arknightsFixture(`character_${key}`),
  skill: (key) => arknightsFixture(`skill_${key}`),
  prefab: (key) => arknightsFixture(`prefab_${key}`),
  enemy: (key) => arknightsFixture(key === 'enemy_1000_gopro_2' ? 'enemy_1000_gopro' : key),
};


function predefinedMovementScenario(rawLevel) {
  return loadMovementScenario(rawLevel, {
    actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }],
    branches: [],
    predefines: rawLevel.predefines.tokenInsts.flatMap((instance, index) =>
      ['trap_1105_accrate', 'trap_098_mire', 'trap_042_tidectrl'].includes(instance.inst.characterKey)
        ? [{ source: 'predefines', collection: 'tokenInsts', index }] : []),
  }, movementCatalog, 123);
}


test('core act1 m01 initializes all 12 raw crates without changing passage or FLY navigation, and keeps them after schedule completion', () => {
  const rawLevel = arknightsFixture('level_act1autochess_m01');
  const scenario = predefinedMovementScenario(rawLevel);
  let runtime = initializeBattle(scenario.spec);
  const baseline = createFieldState(scenario.spec.map).navigation;
  const initial = runtime;
  const crates = rawLevel.predefines.tokenInsts.filter(instance => instance.inst.characterKey === 'trap_1105_accrate');
  assert.equal(crates.length, 12);
  assert.equal(initial.battlefield.units.size, 12);

  assert.equal(initial.predefinedPresence.length, 12);
  assert.equal(initial.mechanisms.size, 0);
  assert.deepEqual(runtime.battlefield.navigation.baseline.FLY, baseline.baseline.FLY);
  assert.deepEqual(navigationMap(runtime.battlefield.navigation).cells.map(cell => cell.passable), navigationMap(baseline).cells.map(cell => cell.passable));
  for (const instance of crates) {
    const [definitionId] = predefinedIdsForAlias(runtime.definition.predefines, instance.alias);
    const binding = initial.predefinedPresence.find(binding => binding.definitionId === definitionId);
    const unit = initial.battlefield.units.get(binding.source.unitId);
    assert.equal(unit.definition.id, 'trap_1105_accrate');
    assert.equal(unit.vitality.hp, 100);
    assert.deepEqual(unit.position, [instance.position.col, instance.position.row]);
    const cell = navigationMap(runtime.battlefield.navigation).get([instance.position.row, instance.position.col]);
    assert.equal(cell.cost, 1000);
    assert.deepEqual(cell.departures, navigationMap(baseline).get([instance.position.row, instance.position.col]).departures);
    const tile = initial.battlefield.map.tiles.get(instance.position.row * initial.battlefield.map.columns + instance.position.col);
    assert.equal(tile.state.walkCost, 1000);
    assert.equal(tile.definition.initial.walkCost, 1);
    assert.equal(tile.state.placement, 'NONE');
    assert.equal(unit.effects.size, 0);
  }
  while (runtime.result === null) (runtime = advanceBattle(runtime, []));
  assert.equal(runtime.result.reason, 'SCHEDULE_COMPLETED');
  assert.equal(runtime.result.spawnedCount, 1);
  assert.equal(runtime.result.completedRouteCount, 1);
  assert.equal(runtime.result.unspawnedCount, 0);
  assert.deepEqual(runtime.result.remainingUnitIds, [...initial.battlefield.units.values()].map(unit => unit.id));
  assert.deepEqual(runtime.battlefield.units, initial.battlefield.units);

});


test('core act1 m02 keeps hidden crate recipes out of the battlefield and applies appearance/removal with fresh identities', () => {
  const scenario = predefinedMovementScenario(arknightsFixture('level_act1autochess_m02'));
  let runtime = initializeBattle(scenario.spec);
  assert.equal(scenario.spec.predefines.length, 16);
  assert.ok(scenario.spec.predefines.every(definition => !definition.initiallyPresent));
  assert.equal(runtime.battlefield.units.size, 0);

  assert.deepEqual(runtime.predefinedPresence, []);
  const [definitionId] = predefinedIdsForAlias(runtime.definition.predefines, 'trap_1105_accrate#001');
  const originalMaps = runtime.battlefield.navigation;
  const originalCell = navigationMap(originalMaps).get([12, 4]);
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]));
  const appeared = runtime;
  const [unit] = appeared.battlefield.units.values();
  assert.deepEqual(unit.position, [4, 12]);
  assert.equal(unit.id, 0);
  assert.deepEqual(appeared.predefinedPresence, [{ definitionId, source: { type: 'UNIT', unitId: unit.id } }]);
  assert.equal(appeared.battlefield.map.tiles.get(12 * appeared.battlefield.map.columns + 4).state.walkCost, 1000);
  assert.deepEqual(appeared.battlefield.navigation.overlays.WALK, []);
  assert.equal(navigationMap(runtime.battlefield.navigation).get([12, 4]).cost, 1000);
  assert.equal(navigationMap(runtime.battlefield.navigation).get([12, 4]).passable, originalCell.passable);
  assert.deepEqual(runtime.battlefield.navigation.baseline.FLY, originalMaps.baseline.FLY);
  const appearedMaps = runtime.battlefield.navigation;
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]));
  assert.deepEqual(runtime.battlefield.units, appeared.battlefield.units);
  assert.deepEqual(runtime.execution, appeared.execution);
  assert.strictEqual(runtime.battlefield.navigation, appearedMaps);
  const external = runtime;
  assert.equal(external.battlefield.units.get(0).vitality, unit.vitality);

  assert.equal(external.predefinedPresence, appeared.predefinedPresence);
  const removed = (runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId, reason: 'SCRIPT' }]));
  const [departed] = removed.events;
  assert.deepEqual(removed.events.map(({ unit, ...event }) => event), [{ type: 'UNIT_REMOVED', unitId: unit.id, reason: 'SCRIPT', tick: 2 }]);
  assert.deepEqual(departed.unit.effects.values().toArray(), []);
  assert.deepEqual({ ...departed.unit, effects: unit.effects }, { ...unit, lifecycle: 'LEAVING' });
  assert.equal(runtime.battlefield.units.size, 0);

  assert.deepEqual(runtime.predefinedPresence, []);
  assert.equal(appeared.battlefield.units.get(0).vitality.hp, unit.definition.vitality.maxHp);

  assert.deepEqual(appeared.predefinedPresence, [{ definitionId, source: { type: 'UNIT', unitId: unit.id } }]);
  assert.deepEqual(navigationMap(runtime.battlefield.navigation).get([12, 4]), originalCell);
  assert.deepEqual(runtime.battlefield.navigation.baseline.FLY, originalMaps.baseline.FLY);
  const removedMaps = runtime.battlefield.navigation;
  assert.deepEqual((runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId, reason: 'SCRIPT' }])).events, []);
  assert.strictEqual(runtime.battlefield.navigation, removedMaps);
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]));
  assert.equal(runtime.battlefield.units.values().next().value.id, unit.id + 1);

  assert.deepEqual(runtime.predefinedPresence[0].source, { type: 'UNIT', unitId: unit.id + 1 });
});


test('core predefined aliases can name two real crate recipes at different positions without merging their instances', () => {
  const rawLevel = arknightsFixture('level_act1autochess_m02');
  const crates = rawLevel.predefines.tokenInsts.filter(instance => instance.inst.characterKey === 'trap_1105_accrate');
  const duplicate = structuredClone(crates[0]);
  duplicate.position = structuredClone(crates[1].position);
  rawLevel.predefines.tokenInsts.push(duplicate);
  let runtime = initializeBattle(predefinedMovementScenario(rawLevel).spec);
  const definitionIds = predefinedIdsForAlias(runtime.definition.predefines, crates[0].alias);
  assert.equal(definitionIds.length, 2);
  assert.notEqual(definitionIds[0], definitionIds[1]);
  (runtime = advanceBattle(runtime, definitionIds.map(definitionId => ({ type: 'APPEAR_PREDEFINED', definitionId }))));
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.id), [0, 1]);
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.position), [[4, 12], [5, 12]]);
  assert.deepEqual(runtime.predefinedPresence.map(binding => binding.definitionId), definitionIds);
  (runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId: definitionIds[0], reason: 'SCRIPT' }]));
  assert.deepEqual([...runtime.battlefield.units.values()].map(unit => unit.id), [1]);

  assert.equal(navigationMap(runtime.battlefield.navigation).get([12, 4]).cost, 1);
  assert.equal(navigationMap(runtime.battlefield.navigation).get([12, 5]).cost, 1000);
});


test('core act2 mire and tide controller prefabs initialize nonspatial mechanisms and supply the raw terrain parameters', () => {
  const cases = [
    ['level_act2autochess_m02', 'trap_098_mire', mireTerrain, {
      stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05, moveSpeedRatioPerStack: -0.05, maxStacks: 10,
    }],
    ['level_act2autochess_m04', 'trap_042_tidectrl', deepseaTerrain, {
      damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6,
    }],
  ];
  for (const [fixture, controllerKey, terrainType, params] of cases) {
    const scenario = predefinedMovementScenario(arknightsFixture(fixture));
    let runtime = initializeBattle(scenario.spec);
    const snapshot = runtime;
    assert.equal(snapshot.mechanisms.size, 1);
    const [mechanism] = snapshot.mechanisms.values();
    assert.equal(mechanism.definition.id, controllerKey);
    assert.equal(mechanism.status, 'ACTIVE');
    assert.ok(!('position' in mechanism));
    assert.ok(!('hp' in mechanism));
    assert.ok(!('vitality' in mechanism));
    assert.equal(snapshot.battlefield.units.size, 4);
    assert.ok([...snapshot.battlefield.units.values()].every(unit => unit.definition.id === 'trap_1105_accrate'));

    const controller = scenario.spec.predefines.find(definition => definition.creation.definition.id === controllerKey);
    assert.equal(controller.creation.type, 'MECHANISM');
    assert.ok(!('position' in controller.creation));
    assert.deepEqual(snapshot.predefinedPresence.find(binding => binding.definitionId === controller.id).source,
      { type: 'MECHANISM', ref: { id: mechanism.id } });
    const affected = tilesOf(scenario.spec.map, terrainType);
    assert.equal(affected.length, 12);
    for (const tile of affected) assert.deepEqual(tile.definition.terrain.params, params);
    if (terrainType === deepseaTerrain) assert.ok(affected.every(tile => tile.state.siteCondition === siteConditions.deepsea));
    const controllerRules = scenario.unsupportedRules.filter(rule => rule.path.includes('.skill.blackboard.'));
    assert.deepEqual(controllerRules.map(rule => rule.path.split('.skill.blackboard.')[1]),
      terrainType === deepseaTerrain ? ['skill_max_trigger_time'] : []);
    while (runtime.result === null) (runtime = advanceBattle(runtime, []));
    assert.equal(runtime.result.reason, 'SCHEDULE_COMPLETED');
    assert.equal(runtime.result.remainingUnitIds.length, 4);
    assert.deepEqual(runtime.mechanisms, snapshot.mechanisms);
  }
});


test('core raw level parsing owns map data before explicit controller parameters create the battlefield', () => {
  const raw = arknightsFixture('level_act2autochess_m04');
  const content = parseLevelContent(raw);
  assert.equal('map' in content, false);
  assert.deepEqual(content.mapData, raw.mapData);
  const consumeTileBlackboard = (_, entry) => ['isValidHand', 'previewNotAlloed'].includes(entry.key);
  assert.throws(() => createLevelDefinition(content, { consumeTileBlackboard }),
    /deepsea controller parameters must be supplied explicitly/);
  const deepsea = { damage: 60, attackSpeedModifier: -0.2, moveSpeedMultiplier: 0.8 };
  const level = createLevelDefinition(content, {
    deepsea,
    consumeTileBlackboard,
  });
  raw.mapData.tiles.find(tile => tile.tileKey === 'tile_deepsea').tileKey = 'future_terrain';
  const affected = tilesOf(level.map, deepseaTerrain);
  assert.ok(affected.length > 0);
  for (const tile of affected) assert.deepEqual(tile.definition.terrain.params, deepsea);
  assert.ok(content.mapData.tiles.some(tile => tile.tileKey === 'tile_deepsea'));
});


test('core controller skill selection clamps the raw level and replaces blackboard keys regardless of case', () => {
  const rawLevel = arknightsFixture('level_act2autochess_m04');
  const controller = rawLevel.predefines.tokenInsts.find(instance => instance.inst.characterKey === 'trap_042_tidectrl');
  controller.mainSkillLvl = 99;
  controller.overrideSkillBlackboard = [
    { key: 'SEA_DROWN[ENEMY].DAMAGE', value: 90, valueStr: null },
    { key: 'Sea_Drown[Enemy].Attack_Speed', value: -0.25, valueStr: null },
    { key: 'sea_drown[enemy].move_speed', value: 0.75, valueStr: null },
  ];
  const scenario = predefinedMovementScenario(rawLevel);
  const parsed = scenario.level.predefines.tokenInsts.find(instance => instance.inst.characterKey === 'trap_042_tidectrl');
  const character = arknightsFixture('character_trap_042_tidectrl');
  const skill = arknightsFixture('skill_sktok_tidectrl_3');
  const resolved = resolvePredefinedSkillBlackboard(parsed, character, skill);
  assert.equal(resolved.skillId, 'sktok_tidectrl_3');
  assert.equal(resolved.prefabKey, 'sktok_tidectrl_3');
  assert.equal(resolved.level, 2);
  assert.equal(resolved.blackboard.length, 4);
  assert.deepEqual(scenario.unsupportedRules.filter(rule => rule.path.includes('.skill.blackboard.'))
    .map(rule => rule.path.split('.skill.blackboard.')[1]), ['skill_max_trigger_time']);
  assert.equal(new Set(resolved.blackboard.map(entry => entry.key.toLowerCase())).size, 4);
  assert.deepEqual(resolved.blackboard.find(entry => entry.key.toLowerCase() === 'sea_drown[enemy].damage'),
    { key: 'SEA_DROWN[ENEMY].DAMAGE', value: 90, valueStr: null });
  assert.equal(resolvePredefinedSkillBlackboard({ ...parsed, mainSkillLvl: 0 }, character, skill).level, 1);
  for (const tile of tilesOf(scenario.spec.map, deepseaTerrain)) {
    assert.deepEqual(tile.definition.terrain.params, { damage: 90, attackSpeedModifier: -0.25, moveSpeedMultiplier: 0.75 });
  }
  const mireLevel = arknightsFixture('level_act2autochess_m02');
  const mire = mireLevel.predefines.tokenInsts.find(instance => instance.inst.characterKey === 'trap_098_mire');
  mire.overrideSkillBlackboard = [
    { key: 'VALUE', value: 1.5, valueStr: null },
    { key: 'MAX_STACK_CNT', value: 3, valueStr: null },
  ];
  const mireScenario = predefinedMovementScenario(mireLevel);
  for (const tile of tilesOf(mireScenario.spec.map, mireTerrain)) {
    assert.deepEqual(tile.definition.terrain.params, {
      stackIntervalTicks: 30, massThreshold: 1.5, maxStacks: 3, attackSpeedPerStack: -0.05, moveSpeedRatioPerStack: -0.05,
    });
  }
});


test('core movement scenario reports omitted definitions and movement-external blackboards, while rejecting unknown tile rules', () => {
  const rawLevel = arknightsFixture('level_act1autochess_m01');
  const scenario = predefinedMovementScenario(rawLevel);
  assert.equal(scenario.unappliedLevelBlackboard.length, 32);
  assert.deepEqual(scenario.unappliedLevelBlackboard, rawLevel.options.configBlackBoard);
  assert.equal(scenario.unappliedTileBlackboard.length, 37);
  assert.ok(scenario.unappliedTileBlackboard.every(({ context, entry }) =>
    context.position.length === 2 && ['isValidHand', 'previewNotAlloed'].includes(entry.key)));
  assert.equal(scenario.omittedPredefines.length, 13);
  assert.ok(scenario.omittedPredefines.includes('predefines.tokenInsts[0]'));
  assert.deepEqual(scenario.omittedActions, []);
  const omitted = loadMovementScenario(rawLevel, { actions: [], branches: [], predefines: [] }, movementCatalog, 123);
  assert.deepEqual(omitted.omittedActions, ['waves[0].fragments[0].actions[0]']);
  assert.deepEqual(scenario.inactiveBranches, Object.keys(rawLevel.branches ?? {}));
  assert.equal(scenario.unsupportedRules.filter(rule => rule.path.startsWith('level.options.configBlackBoard[')).length, 32);
  assert.equal(scenario.unsupportedRules.filter(rule => rule.reason === 'tile blackboard flag is not applied by movement scenarios').length, 37);
  const invalid = structuredClone(rawLevel);
  const tile = invalid.mapData.tiles.find(tile => tile.blackboard?.some(entry => entry.key === 'isValidHand'));
  const entry = tile.blackboard.find(entry => entry.key === 'isValidHand');
  entry.key = 'future_tile_rule';
  assert.throws(() => predefinedMovementScenario(invalid), /unconsumed blackboard future_tile_rule/);
  entry.key = 'isValidHand';
  entry.value = 2;
  assert.throws(() => predefinedMovementScenario(invalid), /invalid movement-external tile flag isValidHand/);
});


test('core omitted predefined customization stays unresolved in raw data while selected customization is rejected', () => {
  const raw = arknightsFixture('level_act1autochess_m01');
  const index = raw.predefines.tokenInsts.findIndex(instance => instance.inst.characterKey === 'trap_1105_accrate');
  assert.ok(index >= 0);
  raw.predefines.tokenInsts[index].uniEquipIds = ['future_equipment'];
  const path = `level.predefines.tokenInsts[${index}].uniEquipIds`;
  assert.ok(parseLevelContent(raw).unresolvedRules.some(rule => rule.path === path));
  const omitted = loadMovementScenario(raw, { actions: [], branches: [], predefines: [] }, movementCatalog, 123);

  assert.ok(omitted.omittedPredefines.includes(`predefines.tokenInsts[${index}]`));
  assert.equal(omitted.unsupportedRules.some(rule => rule.path === path), false);
  assert.throws(() => loadMovementScenario(raw, {
    actions: [], branches: [], predefines: [{ source: 'predefines', collection: 'tokenInsts', index }],
  }, movementCatalog, 123), /unsupported predefined character customization/);
  raw.predefines.tokenInsts[index].uniEquipIds = null;
  raw.predefines.tokenInsts[index].overrideSkillBlackboard = [{ key: 'unused_rule', value: 2, valueStr: null }];
  const selected = loadMovementScenario(raw, {
    actions: [], branches: [], predefines: [{ source: 'predefines', collection: 'tokenInsts', index }],
  }, movementCatalog, 123);
  assert.deepEqual(selected.unsupportedRules.filter(rule => rule.path.includes('.skill.blackboard.')),
    [{ path: `level.predefines.tokenInsts[${index}].skill.blackboard.unused_rule`,
      reason: 'predefined unit skill blackboard is not applied by movement scenarios' }]);
});


test('core failed command batches do not publish hidden recipes, battlefield projections or execution counters', () => {
  const scenario = predefinedMovementScenario(arknightsFixture('level_act1autochess_m02'));
  for (const [command, error] of [
    [{ type: 'APPEAR_PREDEFINED', definitionId: 9999 }, /unknown predefined definition/],
    [{ type: 'TRIGGER_BRANCH', branchId: 'missing', isLoop: false }, /unknown scheduler branch/],
  ]) {
    let failed = initializeBattle(scenario.spec);
    const [definitionId] = predefinedIdsForAlias(failed.definition.predefines, 'trap_1105_accrate#001');
    const before = failed;
    const maps = failed.battlefield.navigation;
    assert.throws(() => (failed = advanceBattle(failed, [
      { type: 'APPEAR_PREDEFINED', definitionId }, command,
    ])), error);
    assert.equal(failed, before);
    assert.strictEqual(failed.battlefield.navigation, maps);
  }
  let runtime = initializeBattle(scenario.spec);
  const [definitionId] = predefinedIdsForAlias(runtime.definition.predefines, 'trap_1105_accrate#001');
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]));
  assert.equal(runtime.tick, 1);
  assert.equal(runtime.battlefield.units.get(0).id, 0);

});


test('core raw tile modes distinguish crates from platforms and require the referenced prefab mode', () => {
  assert.deepEqual(parsePredefinedPrefab(arknightsFixture('prefab_trap_1105_accrate')), {
    type: 'UNIT', prefabKey: 'trap_1105_accrate',
    tileChanges: { placement: 'NONE' },
    deployable: { placement: 'MELEE', allowedSiteConditions: [siteConditions.normal] },
  });
  const raw = arknightsFixture('prefab_trap_1106_achplat');
  assert.deepEqual(parsePredefinedPrefab(raw), {
    type: 'UNIT', prefabKey: 'trap_1106_achplat',
    tileChanges: { elevation: 'HIGHLAND', placement: 'RANGED' },
    deployable: { placement: 'MELEE', allowedSiteConditions: [siteConditions.normal] },
  });
  for (const reference of [
    { m_FileID: 0, m_PathID: '999999999999999999' },
    { m_FileID: 1, m_PathID: raw.components[0].fields._modes[0].m_PathID },
  ]) {
    const invalid = structuredClone(raw);
    invalid.components[0].fields._modes[0] = reference;
    assert.throws(() => parsePredefinedPrefab(invalid));
  }
  const rewritten = structuredClone(raw);
  rewritten.components[1].fields._rewriteTileAdvancedBuildMask = true;
  assert.equal(parsePredefinedPrefab(rewritten).tileChanges.siteCondition, siteConditions.normal);
  const deepsea = arknightsFixture('prefab_tile_deepsea');
  assert.deepEqual(parseTileDeploymentPrefab(deepsea), { prefabKey: 'tile_deepsea', siteCondition: siteConditions.deepsea });
  const wrongKey = structuredClone(deepsea);
  wrongKey.components[0].fields._tileKey = 'tile_road';
  assert.throws(() => parseTileDeploymentPrefab(wrongKey));
  const duplicate = structuredClone(deepsea);
  duplicate.components.push(structuredClone(duplicate.components[0]));
  assert.throws(() => parseTileDeploymentPrefab(duplicate));
});


test('core data decodes deployable condition alternatives while rejecting composite or unknown tile conditions', () => {
  assert.equal(parseSiteCondition(0, 'tile'), null);
  assert.equal(parseSiteCondition(1, 'tile'), siteConditions.normal);
  assert.equal(parseSiteCondition(32, 'tile'), siteConditions.brokenWalkway);
  assert.deepEqual(parseAllowedSiteConditions(32, 'spare timber'), [siteConditions.brokenWalkway]);
  assert.deepEqual(parseAllowedSiteConditions(33, 'device'), [siteConditions.normal, siteConditions.brokenWalkway]);
  assert.deepEqual(parseAllowedSiteConditions(5, 'device'), [siteConditions.normal, siteConditions.tide]);
  assert.deepEqual(parseAllowedSiteConditions(9, 'device'), [siteConditions.normal, siteConditions.night]);
  assert.throws(() => parseSiteCondition(3, 'tile'), /multiple site conditions/);
  assert.throws(() => parseSiteCondition(16, 'tile'), /unsupported/);
  assert.throws(() => parseAllowedSiteConditions(17, 'device'), /unsupported/);
  const raw = arknightsFixture('prefab_trap_1105_accrate');
  raw.components[0].fields._buildCondition.advancedBuildableMask = 5;
  assert.deepEqual(parsePredefinedPrefab(raw).deployable.allowedSiteConditions,
    [siteConditions.normal, siteConditions.tide]);
  const mapData = {
    map: [[0]], tiles: [{ tileKey: 'tile_road', heightType: 'LOWLAND', buildableType: 'ALL',
      passableMask: 'ALL', advancedBuildableMask: 3, blackboard: [], effects: [] }],
  };
  assert.throws(() => parseBattlefieldMap(mapData), /multiple site conditions/);
  mapData.tiles[0].advancedBuildableMask = 0;
  assert.equal(parseBattlefieldMap(mapData).tiles.get(0).state.siteCondition, null);
});


test('core raw mode keep switches retain tile fields instead of activating unused numeric defaults', () => {
  const raw = arknightsFixture('prefab_trap_1106_achplat');
  const mode = raw.components[1].fields;
  mode._keepCurrentBuildableType = true;
  mode._keepCurrentPassableMask = false;
  assert.deepEqual(parsePredefinedPrefab(raw).tileChanges,
    { passability: 'FLY_ONLY', elevation: 'HIGHLAND' });
  mode._rewriteTileAdvancedBuildMask = true;
  mode._tileOptions.advancedBuildMask = 0;
  assert.equal(parsePredefinedPrefab(raw).tileChanges.siteCondition, null);
  mode._tileOptions.advancedBuildMask = 3;
  assert.throws(() => parsePredefinedPrefab(raw), /multiple site conditions/);
});


test('core real hidden platforms grant ranged deployment support while retaining passage and a WALK cost of 1000', () => {
  const raw = arknightsFixture('level_act1autochess_m02');
  const index = raw.predefines.tokenInsts.findIndex(instance => instance.inst.characterKey === 'trap_1106_achplat');
  assert.ok(index >= 0);
  const instance = raw.predefines.tokenInsts[index];
  assert.equal(instance.hidden, true);
  const scenario = loadMovementScenario(raw, {
    actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }], branches: [],
    predefines: [{ source: 'predefines', collection: 'tokenInsts', index }],
  }, movementCatalog, 123);
  let runtime = initializeBattle(scenario.spec);
  const [definitionId] = predefinedIdsForAlias(runtime.definition.predefines, instance.alias);
  const originalMaps = runtime.battlefield.navigation;
  const tile = [instance.position.row, instance.position.col];
  const originalCell = navigationMap(originalMaps).get(tile);
  (runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]));
  const appeared = runtime;
  const platform = [...appeared.battlefield.units.values()].find(unit => unit.definition.id === 'trap_1106_achplat');
  assert.ok(!('tileBinding' in platform.definition));
  const currentTile = runtime.battlefield.map.tiles.get(tile[0] * runtime.battlefield.map.columns + tile[1]);
  assert.equal(currentTile.state.elevation, 'HIGHLAND');
  assert.equal(currentTile.state.placement, 'RANGED');
  assert.equal(currentTile.state.walkCost, 1000);
  assert.equal(currentTile.state.siteCondition, currentTile.definition.initial.siteCondition);
  assert.deepEqual(platform.definition.deployable, {
    cost: 5, redeployTicks: 30, slots: 0, placement: 'MELEE', allowedSiteConditions: [siteConditions.normal],
    refund: { rate: 0.5, limit: 'BASE_COST' },
  });
  assert.equal(platform.deployable.refundAllowed, false);
  assert.deepEqual(platform.occupancy.tile, tile);
  assert.equal(platform.definition.occupancy.slot, 'SUPPORT');
  assert.equal(navigationMap(runtime.battlefield.navigation).get(tile).passable, originalCell.passable);
  assert.equal(navigationMap(runtime.battlefield.navigation).get(tile).cost, 1000);
  assert.deepEqual(navigationMap(runtime.battlefield.navigation, 'FLY').get(tile), navigationMap(originalMaps, 'FLY').get(tile));

  let field = appeared.battlefield;
  assert.equal(occupancyAt(field, tile)?.support?.id, platform.id);
  assert.deepEqual(evaluateDeployment(field, { profile: { placement: 'RANGED', allowedSiteConditions: [siteConditions.normal] },
    tile }), { type: 'ALLOWED' });
  assert.deepEqual(evaluateDeployment(field, { profile: { placement: 'MELEE', allowedSiteConditions: [siteConditions.normal] },
    tile }), { type: 'DENIED', reason: 'BUILDABLE_TYPE' });

  (runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId, reason: 'SCRIPT' }]));
  assert.equal(runtime.battlefield.units.has(platform.id), false);
  assert.deepEqual(navigationMap(runtime.battlefield.navigation).get(tile), originalCell);
  assert.deepEqual(navigationMap(runtime.battlefield.navigation, 'FLY').get(tile), navigationMap(originalMaps, 'FLY').get(tile));
  field = removeFieldUnit(field, { id: platform.id });
  assert.equal(occupancyAt(field, tile)?.support ?? null, null);
});


test('core platform removal restores only its registered tile fields after nested occupant departure', () => {
  const raw = arknightsFixture('level_act1autochess_m02');
  const index = raw.predefines.tokenInsts.findIndex(instance => instance.inst.characterKey === 'trap_1106_achplat');
  const instance = raw.predefines.tokenInsts[index];
  const scenario = loadMovementScenario(raw, {
    actions: [{ waveIndex: 0, fragmentIndex: 0, actionIndex: 0 }], branches: [], predefines: [{ source: 'predefines', collection: 'tokenInsts', index }],
  }, movementCatalog, 123);
  let runtime = initializeBattle(scenario.spec);
  const [definitionId] = predefinedIdsForAlias(runtime.definition.predefines, instance.alias);
  runtime = advanceBattle(runtime, [{ type: 'APPEAR_PREDEFINED', definitionId }]);
  const tile = [instance.position.row, instance.position.col];
  const platform = [...runtime.battlefield.units.values()][0];
  const neighbour = [tile[0], tile[1] + 1];
  const neighbourBefore = getMapTile(runtime.battlefield.map, neighbour);
  runtime = updateBattleUnit(runtime, [{ ...platform, position: [neighbour[1], neighbour[0]] }]);
  assert.strictEqual(getMapTile(runtime.battlefield.map, neighbour), neighbourBefore);
  assert.equal(getMapTile(runtime.battlefield.map, tile).state.walkCost, 1000);

  const initialized = initializeUnit(runtime, {     id: 500, position: [tile[1], tile[0]],
    definition: {
      id: 'platform-occupant', occupancy: { slot: 'OCCUPANT' },
      hooks: [{ id: "test/leave", stage: "leave", invoke(battle) {
        const current = getMapTile(battle.battlefield.map, tile);
        return { state: updateBattleTile(battle, tile, {
          ...current.state, siteCondition: siteConditions.night, passability: 'FLY_ONLY', allowsBlocking: false,
        }), value: undefined };
      } }],
    },
  });
  runtime = addBattleUnit(initialized.state, { ...initialized.value, occupancy: { ...(initialized.value).occupancy, tile } });
  const before = runtime;
  runtime = advanceBattle(runtime, [{ type: 'REMOVE_PREDEFINED', definitionId, reason: 'SCRIPT' }]);
  assert.equal(runtime.battlefield.units.has(500), false);
  assert.ok(runtime.removedUnits.some(entry => entry.unitId === 500 && entry.reason === 'DEATH'));
  const restored = getMapTile(runtime.battlefield.map, tile);
  assert.equal(restored.state.elevation, restored.definition.initial.elevation);
  assert.equal(restored.state.placement, restored.definition.initial.placement);
  assert.equal(restored.state.walkCost, restored.definition.initial.walkCost);
  assert.equal(restored.state.siteCondition, siteConditions.night);
  assert.equal(restored.state.passability, 'FLY_ONLY');
  assert.equal(restored.state.allowsBlocking, false);
  assert.equal(getMapTile(before.battlefield.map, tile).state.walkCost, 1000);
  assert.equal(getMapTile(before.battlefield.map, tile).state.siteCondition, siteConditions.normal);
  assert.strictEqual(getMapTile(runtime.battlefield.map, neighbour), neighbourBefore);
});
