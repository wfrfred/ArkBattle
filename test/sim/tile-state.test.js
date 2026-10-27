import assert from "node:assert/strict";
import { test } from "node:test";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createField } from "../../dist/core/battlefield/state.js";
import { update as updateTile } from "../../dist/core/battlefield/tile.js";
import { update as updateBattleTile } from "../../dist/core/battle/tile.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { effectiveMap, field as navigationField } from "../../dist/core/battlefield/navigation/cache.js";
import { nextPoint, setOverlay } from "../../dist/core/battlefield/navigation/state.js";
import { evaluateDeployment } from "../../dist/core/battle/deployment/query.js";
import { normal as normalTerrain } from "../../dist/content/terrain/definition.js";
import { normal, deepsea, tide } from "../../dist/content/terrain/condition.js";
import { fixture, holder, target, acquire, ownerId, change } from "../helpers/blocking.js";

const initial = {
    elevation: "LOWLAND", placement: "ALL", passability: "ALL",
    walkCost: 1, allowsBlocking: true, siteCondition: normal,
};
const definition = { terrain: normalTerrain.create({}), initial };
const tile = createTile(definition);
const map = createMap(1, 3, Tiles.empty().add(tile).add(tile).add(tile));
const profile = { placement: "ALL", allowedSiteConditions: [normal, tide] };

test("Tile state updates preserve the definition and earlier map versions", () => {
    const original = createField(map);
    const before = original.map.tiles.values();
    const changed = updateTile(original, [0, 1], { ...initial, placement: "RANGED" });
    const current = changed.map.tiles.get(1, normalTerrain);
    assert.equal(tile.state, definition.initial);
    assert.equal(current.definition, definition);
    assert.equal(current.state.placement, "RANGED");
    assert.equal(original.map.tiles.get(1).state.placement, "ALL");
    assert.equal(before.toArray()[1], tile);
    assert.equal(changed.navigation, original.navigation);
    assert.equal(updateTile(changed, [0, 1], current.state), changed);
    const restored = updateTile(changed, [0, 1], current.definition.initial);
    assert.equal(restored.map.tiles.get(1).state, initial);
});

test("deployment distinguishes NORMAL, no extra requirement, and multiple accepted conditions", () => {
    let field = createField(map);
    const decision = () => evaluateDeployment(field, { tile: [0, 1], profile });
    assert.equal(decision().type, "ALLOWED");
    field = updateTile(field, [0, 1], { ...initial, siteCondition: tide });
    assert.equal(decision().type, "ALLOWED");
    field = updateTile(field, [0, 1], { ...initial, siteCondition: deepsea });
    assert.deepEqual(decision(), { type: "DENIED", reason: "TERRAIN" });
    const acceptsNothing = { ...profile, allowedSiteConditions: [] };
    field = updateTile(field, [0, 1], initial);
    assert.equal(evaluateDeployment(field, { tile: [0, 1], profile: acceptsNothing }).type, "DENIED");
    field = updateTile(field, [0, 1], { ...initial, siteCondition: null });
    assert.equal(evaluateDeployment(field, { tile: [0, 1], profile: acceptsNothing }).type, "ALLOWED");
});

test("navigation observes current tile rules and retains independent overlays", () => {
    const original = createField(map);
    const navigation = setOverlay(original.navigation, "WALK", {
        id: 1, cells: [[0, 2]], denyPassage: false, denyDepartures: [], cost: 7,
    });
    const field = { ...original, navigation };
    const before = effectiveMap(navigation, "WALK");
    const changed = updateTile(field, [0, 1], { ...initial, walkCost: 1000 });
    const after = effectiveMap(changed.navigation, "WALK");
    assert.equal(before.get([0, 1]).cost, 1);
    assert.equal(after.get([0, 1]).cost, 1000);
    assert.equal(after.get([0, 2]).cost, 7);
    assert.equal(changed.navigation.overlays, navigation.overlays);
    assert.equal(navigationField(before, [0, 2]).nodes[0].distance, 2);
    assert.equal(navigationField(after, [0, 2]).nodes[0].distance, 1001);
    const closed = updateTile(changed, [0, 1], { ...initial, passability: "FLY_ONLY" });
    assert.equal(nextPoint(closed.navigation, "WALK", [0, 0], [2, 0]), null);
    assert.notEqual(nextPoint(closed.navigation, "FLY", [0, 0], [2, 0]), null);
    assert.notEqual(nextPoint(field.navigation, "WALK", [0, 0], [2, 0]), null);
});

test("complete tile updates release invalid blocking and retain nested tile changes", () => {
    let battle = fixture([holder(), target()]);
    battle = change(battle, 10, source => ({ ...source, blocker: {
        ...source.blocker,
        released: [{ id: "change-tile-on-release", invoke(state) {
            const tile = state.battlefield.map.tiles.get(14);
            return { state: updateBattleTile(state, [1, 2], { ...tile.state, siteCondition: tide }), value: undefined };
        } }],
    } }));
    battle = acquire(battle);
    assert.equal(ownerId(battle), 10);
    const previous = battle;
    const at = battle.battlefield.map.tiles.get(14);
    battle = updateBattleTile(battle, [1, 2], { ...at.state, allowsBlocking: false });
    assert.equal(ownerId(battle), undefined);
    assert.equal(ownerId(previous), 10);
    assert.equal(battle.battlefield.map.tiles.get(14).state.siteCondition, tide);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_RELEASED").length, 1);
});
