import { attribute, vitality as vitalityDefinition } from "../helpers/attribute.js";
// Contract: [terrain](../../docs/architecture/terrain.md).
import assert from "node:assert/strict";
import { test } from "node:test";
import { Hooks } from "../../dist/core/hook.js";
import * as terrain from "../../dist/content/terrain/definition.js";
import { createTerrainMechanism } from "../../dist/content/terrain/mechanism.js";
import * as mechanisms from "../../dist/core/mechanism/index.js";
import * as units from "../../dist/core/unit/index.js";
import * as vitality from "../../dist/core/unit/capability/vitality/index.js";
import * as hpDamage from "../../dist/core/battle/resource/hp/damage/index.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { update } from "../../dist/core/unit/operations.js";
import { initialize, step } from "../../dist/core/battle/index.js";
import { update as updateTile } from "../../dist/core/battle/tile.js";
import { actionCapability } from "../helpers/actions.js";
import { executionRef, finish } from "../../dist/core/unit/capability/action/index.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/index.js";
import { resolveSpeed } from "../../dist/core/unit/capability/action/timing.js";
import { damage } from "../../dist/core/battle/targeting/index.js";
import * as presence from "../../dist/core/unit/capability/presence/index.js";
import { setType } from "../../dist/core/unit/capability/layer/index.js";
import { shiftable, unbalance } from "../../dist/core/unit/capability/shifting/index.js";
import { create as createModifier } from "../../dist/core/common/modifier.js";

const infectionParams = (damage = 80) => ({
    damage, attackBonusRatio: 0.2, attackSpeedBonus: 20, durationTicks: 65,
});
const mireParams = {
    stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05,
    moveSpeedRatioPerStack: -0.05, maxStacks: 10,
};
const deepseaParams = { damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6 };
const combat = {
    vitality: vitalityDefinition(1000),
    offense: { attack: attribute(100) },
    action: { ...actionCapability({
        id: "primary", applyWay: "NONE", period: { type: "ATTACK_SPEED" },
        initialize: state => ({ state, value: {} }),
        prepare: state => ({ state, value: null }),
        onTick: (state, source, self) => finish(state, executionRef(source, self)),
    }), interval: attribute(30) },
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
    return resolveSpeed(source);
};
const move = (battle, id, column) =>
    update(battle, units.ref(current(battle, id)), presence.appear([column, 0]));
function until(battle, tick) {
    while (battle.tick < tick) battle = step(battle, []);
    return battle;
}

test("HP-06: infection keeps its entry clocks and ordinary reception while excluding HIT SP recovery", () => {
    const resource = {
        id: "terrain-hit-recovery", initialize: state => ({ state, value: {} }), activation: null,
        sp: { initial: 0, capacity: 5, recovery: { type: "HIT", amount: 1 }, recoverySpeed: attribute(0), recoveryMultiplier: attribute(1) },
    };
    const receptions = [];
    const applications = [];
    const first = terrain.infection.create({ ...infectionParams(80), durationTicks: 120 });
    const configured = setup([
        first, first,
        terrain.infection.create({
            damage: 75, attackBonusRatio: 0.3, attackSpeedBonus: 30, durationTicks: 50,
        }),
        terrain.normal.create({}),
    ], [unit(0, {
        ...combat,
        skill: { definition: resource },
        hooks: Hooks.empty().set(hpDamage.targetApplied, {
            id: "observe-environment-application",
            invoke(state, { request, application }) {
                assert.equal(request.nature, "ENVIRONMENT");
                applications.push(application.hpLoss);
                return { state, value: undefined };
            },
        }),
    })], [terrain.infection]);
    let battle = update(configured.battle, units.ref(current(configured.battle)),
        units.setHook(hpDamage.receiving, {
            id: "observe-environment-reception",
            invoke(state, { request }, pending) {
                assert.equal(request.nature, "ENVIRONMENT");
                assert.equal(request.hitRecovery, false);
                receptions.push(pending.amount);
                return { state, value: pending };
            },
        }));
    battle = step(battle, []);
    assert.equal(resolveAttack(battle, current(battle)), 120);
    assert.equal(attackSpeed(battle), 120);
    battle = step(move(until(battle, 11), 0, 1), []);
    battle = step(move(battle, 0, 3), []);
    battle = until(battle, 30);
    assert.equal(current(battle).vitality.health.hp, 1000);
    battle = step(battle, []);
    assert.equal(current(battle).vitality.health.hp, 920);
    battle = step(move(until(battle, 35), 0, 2), []);
    assert.equal(resolveAttack(battle, current(battle)), 130);
    assert.equal(attackSpeed(battle), 130);
    battle = until(battle, 66);
    assert.equal(current(battle).vitality.health.hp, 845);
    battle = until(battle, 100);
    assert.equal(resolveAttack(battle, current(battle)), 120);
    assert.equal(current(battle).vitality.health.hp, 845);
    battle = mechanisms.remove(battle, configured.mechanism);
    battle = until(battle, 112);
    assert.equal(current(battle).vitality.health.hp, 765);
    battle = until(battle, 122);
    assert.equal(resolveAttack(battle, current(battle)), 120);
    battle = until(battle, 132);
    assert.equal(current(battle).vitality.health.hp, 765);
    assert.equal(resolveAttack(battle, current(battle)), 100);
    assert.equal(attackSpeed(battle), 100);
    assert.deepEqual(receptions, [80, 75, 80]);
    assert.deepEqual(applications, [80, 75, 80]);
    assert.equal(current(battle).skill.sp.value, 0);
});

test("mire preserves its stacking clock across adjacent tiles and uses effective mass for double stacks", () => {
    const patch = terrain.mire.create(mireParams);
    const enemy = {
        ...combat,
        classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" },
        locomotion: {
            speed: attribute(1), halfBodyWidth: 0,
            steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 },
        },
        shiftable: {
            massLevel: attribute(2),
            restrictions: [],
            body: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0 }, mass: 1, frictionFactor: 1 },
        },
    };
    const configured = setup([patch, patch, terrain.normal.create({})], [
        unit(0, enemy),
        unit(0, enemy),
    ], [terrain.mire]);
    let battle = update(configured.battle, units.ref(current(configured.battle)), shiftable.setMassLevelContribution({
        id: "extra-weight", value: [createModifier({ addition: 1 })],
    }));
    battle = until(battle, 2);
    assert.deepEqual([0, 1].map(id => attackSpeed(battle, id)), [90, 95]);
    battle = until(move(battle, 0, 1), 31);
    assert.equal(attackSpeed(battle), 90);
    battle = step(battle, []);
    assert.deepEqual([0, 1].map(id => attackSpeed(battle, id)), [80, 90]);
    battle = until(move(battle, 0, 2), 34);
    assert.equal(attackSpeed(battle), 100);
});

test("deepsea and holes affect ground enemies, including a unit pushed into a hole", () => {
    const natures = [];
    const configured = setup([terrain.deepsea.create(deepseaParams), terrain.hole.create({})], [
        unit(0, { ...combat, classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" }, layer: { type: "GROUND" },
            locomotion: { speed: attribute(1), halfBodyWidth: 0.1,
                steeringParameters: { steeringFactor: 1, maxSteeringForce: 1 } },
            shiftable: {
                massLevel: attribute(0),
                restrictions: [],
                body: { shape: { type: "CIRCLE", offset: [0, 0], radius: 0.1 }, mass: 1, frictionFactor: 1 },
            },
            hooks: Hooks.empty().set(hpDamage.receiving, {
                id: "observe-deepsea-nature",
                invoke(state, { request }, pending) {
                    natures.push(request.nature);
                    return { state, value: pending };
                },
            }),
        }),
        unit(0, { ...combat, classification: { type: "OPERATOR", side: "ALLY", profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] }, layer: { type: "GROUND" } }),
        unit(0, { ...combat, classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" }, layer: { type: "AIR" } }),
    ], [terrain.deepsea, terrain.hole]);
    let battle = until(configured.battle, 2);
    assert.deepEqual(natures, ["DAMAGE"]);
    assert.deepEqual([0, 1, 2].map(id => current(battle, id).vitality.health.hp), [960, 1000, 1000]);
    assert.deepEqual([0, 1, 2].map(id => attackSpeed(battle, id)), [40, 100, 100]);
    const hole = getTile(battle.battlefield.map, [0, 1]);
    battle = updateTile(battle, [0, 1], { ...hole.state, passability: "FLY_ONLY" });
    battle = unbalance.applyImpulse(battle, units.ref(current(battle, 0)), [30, 0]).state;
    for (const id of [1, 2]) battle = move(battle, id, 1);
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
        unit(0, { vitality: combat.vitality, classification: { type: "OPERATOR", side: "ALLY", profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] }, targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions: [] },
            blocker: { layer: "GROUND", restrictions: [], capacity: 1, radius: 0.7 } }),
        unit(0, { classification: { type: "ENEMY", side: "ENEMY", filterTags: [], rank: "NORMAL" }, layer: { type: "GROUND" }, blockable: { volume: 1, restrictions: [] } }),
        unit(0, { vitality: combat.vitality, classification: { type: "OPERATOR", side: "ALLY", profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] },
            layer: { type: "AIR" }, targetable: { category: "DEFAULT", taunt: attribute(0, -2, 2), restrictions: [] } }),
        unit(0, { vitality: combat.vitality, classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
            targetable: { category: "DEVICE", taunt: attribute(0, -2, 2), restrictions: [] } }),
    ], [terrain.smog]);
    let battle = step(configured.battle, []);
    const visible = (state, id = 0) => damage(current(state, 1))(state)(current(state, id));
    assert.equal(current(battle, 1).blockable.relation.blocker.id, 0);
    assert.equal(visible(battle), false);
    assert.equal(visible(battle, 2), false);
    assert.equal(visible(battle, 3), true);
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
        locomotion: { speed: attribute(1, 0), halfBodyWidth: 0,
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
