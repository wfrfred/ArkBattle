import assert from "node:assert/strict";
import { test } from "node:test";
import * as terrain from "../../dist/content/terrain/definition.js";
import { createTerrainMechanism } from "../../dist/content/terrain/mechanism.js";
import * as mechanisms from "../../dist/core/battle/mechanism.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as units from "../../dist/core/unit/query.js";
import { createTile } from "../helpers/tiles.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createField } from "../../dist/core/battlefield/state.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { initialize as initializeUnit } from "../../dist/core/unit/initialize.js";
import { add, update } from "../../dist/core/battle/unit.js";
import { step } from "../../dist/core/battle/runtime.js";
import { actionCapability } from "../helpers/actions.js";
import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { resolveSpeed } from "../../dist/core/unit/capability/action/timing.js";
import { invisibilityKind } from "../../dist/content/effects/visibility.js";
import * as blocking from "../../dist/core/battle/blocking/operations.js";

const infectionParams = (damage = 80) => ({
    damage, attackBonusRatio: 0.2, attackSpeedBonus: 20, durationTicks: 65,
});
const mireParams = {
    stackIntervalTicks: 30, massThreshold: 3, attackSpeedPerStack: -0.05,
    moveSpeedRatioPerStack: -0.05, maxStacks: 10,
};
const deepseaParams = { damage: 40, attackSpeedModifier: -0.6, moveSpeedMultiplier: 0.6 };
const unit = (id, column, fields = {}) => ({
    id, column,
    definition: { hooks: [],
        id: `terrain-unit/${id}`,
        vitality: { maxHp: 1000, defense: 0, resistance: 0 },
        offense: { attack: 100 }, action: actionCapability(),
        layer: { type: "GROUND" }, allegiance: { side: "ALLY" },
        targetable: { restrictions: [] }, spatialPresence: {},
        ...fields,
    },
});

function setup(terrains, placements, definition) {
    let tiles = Tiles.empty();
    for (const entry of terrains) {
        tiles = tiles.add(createTile({
            heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL",
            passableMask: "ALL", terrain: entry,
        }));
    }
    let battle = createBattleState(createField(createMap(1, terrains.length, tiles)));
    for (const placement of placements) {
        const initialized = initializeUnit(battle, {             id: placement.id, definition: placement.definition, position: [placement.column, 0],
        });
        battle = add(initialized.state, initialized.value);
    }
    const created = mechanisms.create(battle, createTerrainMechanism(definition));
    return { battle: created.state, mechanism: created.value };
}

const current = (battle, id = 0) => battle.battlefield.units.get(id);
const effect = (battle, id = 0) => current(battle, id).effects.values().toArray()[0];
const attackSpeed = (battle, id = 0) => resolveSpeed(battle, units.ref(current(battle, id)), {
    intervalTicks: 30, speed: 100,
});
const at = (battle, tick) => mechanisms.advance(effects.advance({ ...battle, tick }));
function through(battle, start, end) {
    for (let tick = start; tick <= end; tick++) battle = at(battle, tick);
    return battle;
}

test("one infection mechanism preserves distinct tile damage and buffs after leaving", () => {
    const configured = setup([
        terrain.infection.create(infectionParams(80)),
        terrain.infection.create(infectionParams(75)),
        terrain.infection.create(infectionParams(75)),
        terrain.normal.create({}),
    ], [unit(0, 0), unit(1, 1), unit(2, 2)], terrain.infection);
    const original = configured.battle;
    let battle = at(original, 0);
    const installed = effect(battle);
    assert.equal(resolveAttack(battle, units.ref(current(battle))), 120);
    assert.equal(attackSpeed(battle), 120);
    assert.equal(current(original).effects.size, 0);
    battle = update(battle, [{ ...current(battle), position: [3, 0] }]);
    battle = through(battle, 1, 29);
    assert.equal(current(battle).vitality.hp, 1000);
    assert.equal(effect(battle).id, installed.id);
    battle = at(battle, 30);
    assert.deepEqual([0, 1, 2].map(id => current(battle, id).vitality.hp), [920, 925, 925]);
    battle = mechanisms.remove(battle, configured.mechanism);
    assert.equal(current(battle).effects.size, 1, "controller removal retains infection");
    battle = through(battle, 31, 65);
    assert.equal(current(battle).vitality.hp, 840);
    assert.equal(current(battle).effects.size, 0);
    assert.equal(resolveAttack(battle, units.ref(current(battle))), 100);
    assert.equal(attackSpeed(battle), 100);
});

test("infection re-entry and crossing differently configured tiles keep the active timer", () => {
    const configured = setup([
        terrain.infection.create(infectionParams(80)),
        terrain.infection.create(infectionParams(75)),
        terrain.normal.create({}),
    ], [unit(0, 0)], terrain.infection);
    let battle = at(configured.battle, 0);
    const installed = effect(battle);
    battle = update(battle, [{ ...current(battle), position: [2, 0] }]);
    battle = at(battle, 1);
    battle = update(battle, [{ ...current(battle), position: [1, 0] }]);
    battle = at(battle, 2);
    assert.equal(effect(battle).id, installed.id);
    assert.equal(effect(battle).data.nextTick, 30);
    assert.deepEqual(effect(battle).scopes, [{ type: "TICK", tick: 65 }]);
    battle = through(battle, 3, 30);
    assert.equal(current(battle).vitality.hp, 920, "existing infection retains its sampled damage");
});

test("mire preserves its clock across adjacent tiles and weights heavy enemies", () => {
    const patch = terrain.mire.create(mireParams);
    const configured = setup([patch, patch, terrain.normal.create({})], [
        unit(0, 0, { allegiance: { side: "ENEMY" }, massLevel: 3 }),
        unit(1, 0, { allegiance: { side: "ENEMY" }, massLevel: 2 }),
    ], terrain.mire);
    let battle = through(configured.battle, 0, 1);
    const installed = effect(battle);
    assert.equal(effect(battle).data.stacks, 2);
    assert.equal(effect(battle, 1).data.stacks, 1);
    assert.equal(attackSpeed(battle), 90);
    battle = update(battle, [{ ...current(battle), position: [1, 0] }]);
    battle = through(battle, 2, 30);
    assert.equal(effect(battle).id, installed.id);
    assert.equal(effect(battle).data.stacks, 2);
    battle = at(battle, 31);
    assert.equal(effect(battle).data.stacks, 4);
    battle = update(battle, [{ ...current(battle), position: [2, 0] }]);
    battle = through(battle, 32, 33);
    assert.equal(current(battle).effects.size, 0);
    assert.equal(attackSpeed(battle), 100);
});

test("deepsea applies only to enemy ground contacts and controller removal clears it", () => {
    const configured = setup([terrain.deepsea.create(deepseaParams)], [
        unit(0, 0, { allegiance: { side: "ENEMY" } }), unit(1, 0),
        unit(2, 0, { allegiance: { side: "ENEMY" }, layer: { type: "AIR" } }),
    ], terrain.deepsea);
    let battle = at(configured.battle, 0);
    assert.equal(current(battle, 1).effects.size, 0);
    assert.equal(current(battle, 2).effects.size, 0);
    assert.equal(attackSpeed(battle), 40);
    battle = at(battle, 1);
    assert.equal(current(battle).vitality.hp, 960);
    const installed = effect(battle);
    battle = through(battle, 2, 12);
    assert.equal(effect(battle).id, installed.id);
    assert.equal(effect(battle).data.nextTick, 31);
    battle = mechanisms.remove(battle, configured.mechanism);
    assert.equal(current(battle).effects.size, 0);
    assert.equal(attackSpeed(battle), 100);
});

test("smog uses invisibility, cleans disappearing contacts and reinstalls dispelled effects", () => {
    const noLayer = unit(0, 0);
    delete noLayer.definition.layer;
    const configured = setup([terrain.smog.create({})], [noLayer], terrain.smog);
    let battle = at(configured.battle, 0);
    assert.equal(current(battle).targetable.restrictions[0].value.kind, invisibilityKind);
    const installed = effect(battle);
    battle = effects.end(battle, { host: installed.host, id: installed.id });
    battle = at(battle, 1);
    assert.notEqual(effect(battle).id, installed.id);
    battle = update(battle, [{ ...current(battle), spatialPresence: { present: false } }]);
    battle = at(battle, 2);
    assert.equal(current(battle).effects.size, 0);
    assert.equal(current(battle).targetable.restrictions.length, 0);
    battle = update(battle, [{ ...current(battle), spatialPresence: { present: true } }]);
    battle = at(battle, 3);
    battle = mechanisms.setActive(battle, configured.mechanism, false);
    assert.equal(current(battle).effects.size, 0);
});

test("hole removes eligible enemies while preserving allies and airborne units", () => {
    const configured = setup([terrain.hole.create({})], [
        unit(0, 0, { allegiance: { side: "ENEMY" } }), unit(1, 0),
        unit(2, 0, { allegiance: { side: "ENEMY" }, layer: { type: "AIR" } }),
    ], terrain.hole);
    const battle = at(configured.battle, 0);
    assert.equal(current(battle, 0), undefined);
    assert.ok(current(battle, 1));
    assert.ok(current(battle, 2));
    assert.equal(mechanisms.get(battle, configured.mechanism).state.contacts.has(0), false);
    assert.ok(current(configured.battle, 0), "old battle snapshot retains the enemy");
});

test("smog loses invisibility while blocking and restores it three seconds after release", () => {
    const configured = setup([terrain.smog.create({}), terrain.normal.create({})], [
        unit(0, 0, { blocker: { layer: "GROUND", rules: [], capacity: 1, radius: 0.7 } }),
        unit(1, 0, { allegiance: { side: "ENEMY" }, blockable: { volume: 1 } }),
    ], terrain.smog);
    let battle = at(configured.battle, 0);
    assert.equal(current(battle).targetable.restrictions.length, 1);
    battle = blocking.advance(battle);
    assert.equal(current(battle).blocker.blocked.length, 1);
    battle = at(battle, 1);
    assert.equal(current(battle).targetable.restrictions.length, 0);
    battle = blocking.release(battle, units.ref(current(battle, 1)));
    battle = update(battle, [{ ...current(battle, 1), position: [1, 0] }]);
    battle = through(battle, 2, 91);
    assert.equal(current(battle).targetable.restrictions.length, 0);
    battle = at(battle, 92);
    assert.equal(current(battle).targetable.restrictions[0].value.kind, invisibilityKind);
});

test("runtime detects terrain after the unit's current position changes", () => {
    const configured = setup([
        terrain.normal.create({}), terrain.infection.create(infectionParams()),
    ], [unit(0, 0, {
        hooks: [{ id: "test/tick", stage: "tick", invoke(battle, self) { return { state: update(battle, [{ ...self, position: [1, 0] }]), value: undefined }; } }],
    })], terrain.infection);
    const battle = step(configured.battle, []);
    assert.equal(current(battle).effects.size, 1);
    assert.equal(mechanisms.get(battle, configured.mechanism).state.contacts.get(0).index, 1);
});
