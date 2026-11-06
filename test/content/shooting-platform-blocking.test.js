import { Hooks } from "../../dist/core/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { create as createPlatform } from "../../dist/content/devices/shooting-platform.js";
import { add, remove, update } from "../../dist/core/battle/unit.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { Tile } from "../../dist/core/geometry/coordinate.js";
import { createDefinition as createDeployable, createCardDefinition } from "../helpers/deployable.js";
import { sides, setLayer } from "../../dist/core/unit/capability/blocking/index.js";
import { fixture as blockingFixture, holder, target, acquire, ownerId } from "../helpers/blocking.js";
import { getUnit, initialize } from "../helpers/unit.js";

const first = [1, 2];
const second = [1, 5];
const deployable = createDeployable();
const card = createCardDefinition({ cost: 0, redeployTicks: 0, slots: 0, placement: "ALL" });
function passenger(id = 10, tile = first, layer = "GROUND") {
    return initialize({
        id, position: Tile.center(tile), initial: { occupancy: { tile } }, definition: {
            id: "passenger", hooks: Hooks.empty(), occupancy: { slot: "OCCUPANT" }, spatialPresence: {},
            allegiance: { side: "ALLY" }, vitality: { maxHp: 100, defense: 0, resistance: 0 },
            blocker: { layer, capacity: 1, rules: [sides("ENEMY")] },
        },
    });
}
function platform() {
    return initialize({
        id: 30, position: Tile.center(first), initial: { occupancy: { tile: first } },
        definition: createPlatform({
            id: "platform", vitality: { maxHp: 100, defense: 0, resistance: 0 },
            deployable, card, tileChanges: { elevation: "HIGHLAND" },
        }),
    });
}
function fixture(units) {
    let battle = blockingFixture();
    for (const unit of units) battle = add(battle, unit);
    return battle;
}

test("a platform suppresses its ground passenger without disabling other blockers on the tile", () => {
    let battle = acquire(fixture([passenger(), target(), holder(11)]));
    assert.equal(ownerId(battle), 10);
    battle = add(battle, platform());
    assert.equal(ownerId(battle), undefined);
    assert.equal(getTile(battle.battlefield.map, first).state.allowsBlocking, true);
    battle = acquire(battle, 11);
    assert.equal(ownerId(battle), 11);
});

test("an airborne passenger can block from a platform, and landing restores its restriction", () => {
    let battle = acquire(fixture([platform(), passenger(10, first, "AIR"),
        target(20, { layer: "AIR" }), target(21)]));
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 21), undefined);
    battle = update(battle, setLayer({ id: 10 }, "GROUND"));
    assert.equal(ownerId(battle, 20), undefined);
    battle = acquire(battle);
    assert.equal(ownerId(battle, 21), undefined);
});

test("removing a platform kills its own passenger and restores the tile", () => {
    let battle = fixture([platform(), passenger(), passenger(11, second)]);
    battle = remove(battle, 30, "SCRIPT");
    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(battle.removedUnits.find(entry => entry.unitId === 10).reason, "DEATH");
    assert.ok(getUnit(battle, 11));
    assert.equal(occupancyAt(battle.battlefield, first)?.occupant ?? null, null);
    assert.equal(getTile(battle.battlefield.map, first).state.elevation, "LOWLAND");
});
