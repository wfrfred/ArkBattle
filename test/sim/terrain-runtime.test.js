import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as terrain from "../../dist/content/terrain/definition.js";
import { createTerrainMechanism } from "../../dist/content/terrain/mechanism.js";
import * as mechanisms from "../../dist/core/battle/mechanism.js";
import * as units from "../../dist/core/unit/index.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { update } from "../../dist/core/battle/unit.js";
import { initialize, step } from "../../dist/core/battle/index.js";
import { actionCapability } from "../helpers/actions.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { resolveSpeed } from "../../dist/core/unit/capability/action/timing.js";
import { damage } from "../../dist/core/battle/targeting/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { setType } from "../../dist/core/unit/capability/layer/index.js";

const infectionParams = (damage = 80) => ({
    damage, attackBonusRatio: 0.2, attackSpeedBonus: 20, durationTicks: 65,
});
const mireParams = {
    stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05,
    moveSpeedRatioPerStack: -0.05, maxStacks: 10,
};
const deepseaParams = { damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6 };
const combat = {
    vitality: { maxHp: 1000, defense: 0, resistance: 0 },
    offense: { attack: 100 },
    action: actionCapability({
        id: "primary", intervalTicks: 30, speed: 100,
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: null }),
        onTick: state => ({ state, value: true }),
    }),
};
const unit = (column, fields = {}) => ({
    definition: { id: "terrain-unit", hooks: Hooks.empty(), presence: {}, ...fields },
    position: [column, 0],
});

function setup(terrains, placements, definitions) {
    const initial = {
        elevation: "LOWLAND", placement: "ALL", passability: "ALL",
        walkCost: 1, allowsBlocking: true, siteCondition: null,
    };
    const tiles = terrains.reduce(
        (tiles, terrain) => tiles.add(createTile({ terrain, initial })), Tiles.empty(),
    );
    const controllers = definitions.map(definition => createTerrainMechanism(definition));
    const battle = initialize({
        map: createMap(1, terrains.length, tiles),
        initialMechanisms: controllers.map(definition => ({ definition })),
        predefines: placements.map((creation, id) => ({
            id, alias: null, initiallyPresent: true, creation: { type: "UNIT", ...creation },
        })),
        schedule: { waves: [], branches: {} }, routeMoveMultiplier: 1, rngState: 7,
    });
    return {
        battle,
        mechanism: mechanisms.ref(mechanisms.all(battle).find(self => self.definition === controllers[0])),
    };
}

const current = (battle, id = 0) => units.all(battle).find(self => self.id === id);
const attackSpeed = (battle, id = 0) => {
    const source = current(battle, id);
    return resolveSpeed(source, source.action.actions.get("primary"));
};
const move = (battle, id, column) =>
    update(battle, units.ref(current(battle, id)), presence.appear([column, 0]));
function until(battle, tick) {
    while (battle.tick < tick) battle = step(battle, []);
    return battle;
}

test("infection keeps the entered tile's damage and original duration through leaving and re-entry", () => {
    const configured = setup([
        terrain.infection.create(infectionParams(80)),
        terrain.infection.create(infectionParams(75)),
        terrain.normal.create({}),
    ], [unit(0, combat), unit(1, combat)], [terrain.infection]);
    let battle = step(configured.battle, []);
    assert.equal(resolveAttack(battle, current(battle)), 120);
    assert.equal(attackSpeed(battle), 120);
    battle = step(move(battle, 0, 2), []);
    battle = step(move(battle, 0, 1), []);
    battle = until(battle, 30);
    assert.equal(current(battle).vitality.hp, 1000);
    battle = step(battle, []);
    assert.deepEqual([0, 1].map(id => current(battle, id).vitality.hp), [920, 925]);
    battle = move(battle, 0, 2);
    battle = mechanisms.remove(battle, configured.mechanism);
    battle = until(battle, 66);
    assert.deepEqual([0, 1].map(id => current(battle, id).vitality.hp), [840, 850]);
    assert.equal(resolveAttack(battle, current(battle)), 100);
    assert.equal(attackSpeed(battle), 100);
});

test("mire preserves its stacking clock across adjacent tiles and gives heavy enemies double stacks", () => {
    const patch = terrain.mire.create(mireParams);
    const configured = setup([patch, patch, terrain.normal.create({})], [
        unit(0, { ...combat, allegiance: { side: "ENEMY" }, massLevel: 3 }),
        unit(0, { ...combat, allegiance: { side: "ENEMY" }, massLevel: 2 }),
    ], [terrain.mire]);
    let battle = until(configured.battle, 2);
    assert.deepEqual([0, 1].map(id => attackSpeed(battle, id)), [90, 95]);
    battle = until(move(battle, 0, 1), 31);
    assert.equal(attackSpeed(battle), 90);
    battle = step(battle, []);
    assert.deepEqual([0, 1].map(id => attackSpeed(battle, id)), [80, 90]);
    battle = until(move(battle, 0, 2), 34);
    assert.equal(attackSpeed(battle), 100);
});

test("deepsea and holes affect ground enemies while leaving allies and airborne enemies untouched", () => {
    const configured = setup([terrain.deepsea.create(deepseaParams), terrain.hole.create({})], [
        unit(0, { ...combat, allegiance: { side: "ENEMY" }, layer: { type: "GROUND" } }),
        unit(0, { ...combat, allegiance: { side: "ALLY" }, layer: { type: "GROUND" } }),
        unit(0, { ...combat, allegiance: { side: "ENEMY" }, layer: { type: "AIR" } }),
    ], [terrain.deepsea, terrain.hole]);
    let battle = until(configured.battle, 2);
    assert.deepEqual([0, 1, 2].map(id => current(battle, id).vitality.hp), [960, 1000, 1000]);
    assert.deepEqual([0, 1, 2].map(id => attackSpeed(battle, id)), [40, 100, 100]);
    for (const id of [0, 1, 2]) battle = move(battle, id, 1);
    battle = step(battle, []);
    assert.equal(current(battle, 0), undefined);
    assert.ok(current(battle, 1));
    assert.ok(current(battle, 2));
    battle = update(battle, units.ref(current(battle, 2)), setType("GROUND"));
    battle = step(battle, []);
    assert.equal(current(battle, 2), undefined);
});

test("smog keeps allied ground and airborne units invisible through blocking until they leave", () => {
    const configured = setup([terrain.smog.create({}), terrain.normal.create({})], [
        unit(0, { vitality: combat.vitality, allegiance: { side: "ALLY" }, targetable: { taunt: 0, restrictions: [] },
            blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 0.7 } }),
        unit(0, { allegiance: { side: "ENEMY" }, layer: { type: "GROUND" }, blockable: { volume: 1, rules: [] } }),
        unit(0, { vitality: combat.vitality, allegiance: { side: "ALLY" },
            layer: { type: "AIR" }, targetable: { taunt: 0, restrictions: [] } }),
    ], [terrain.smog]);
    let battle = step(configured.battle, []);
    const visible = (state, id = 0) => damage(state, current(state, 1))(current(state, id));
    assert.equal(current(battle, 1).blockable.relation.blocker.id, 0);
    assert.equal(visible(battle), false);
    assert.equal(visible(battle, 2), false);
    battle = step(battle, []);
    assert.equal(visible(battle), false);
    battle = step(move(battle, 1, 1), []);
    assert.equal(current(battle, 1).blockable.relation, null);
    assert.equal(visible(battle), false);
    battle = step(move(battle, 0, 1), []);
    assert.equal(visible(battle), true);
    assert.equal(visible(battle, 2), false);
});

test("runtime checks terrain contact after actual route movement", () => {
    const traveller = unit(0, {
        offense: combat.offense,
        route: { alwaysCheckCurrentPoint: true },
        locomotion: { speed: 1, minSpeed: 0, halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 100 } },
    });
    traveller.initial = { route: {
        plan: { motionMode: "WALK", startPosition: [0, 0], endPosition: null,
            checkpoints: [{ type: "MOVE", position: [0, 1], offset: [0, 0], randomizeOffset: false }],
            requireAllCheckpoints: true }, offset: [0, 0],
    } };
    const configured = setup([
        terrain.normal.create({}), terrain.infection.create(infectionParams()),
    ], [traveller], [terrain.infection]);
    const battle = step(configured.battle, []);
    assert.deepEqual(current(battle).position, [1, 0]);
    assert.equal(resolveAttack(battle, current(battle)), 120);
});
