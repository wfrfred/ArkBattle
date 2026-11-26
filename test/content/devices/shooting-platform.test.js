import { vitality } from "../../helpers/attribute.js";
// Contract: [occupancy](../../../docs/architecture/occupancy.md).
import { Hooks } from "../../../dist/core/hook.js";
import { ref } from "../../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { create as createPlatform } from "../../../dist/content/devices/shooting-platform.js";
import { add, remove, update } from "../../../dist/core/unit/operations.js";
import { get as getTile } from "../../../dist/core/battlefield/map/map.js";
import { Tile } from "../../../dist/core/geometry/coordinate.js";
import { createDefinition as createDeployable } from "../../helpers/deployable.js";
import { sides, ground, air, setRule } from "../../../dist/core/unit/capability/blocking/index.js";
import { fixture as blockingFixture, holder, target, acquire, ownerId } from "../../helpers/blocking.js";
import { getUnit, initialize } from "../../helpers/unit.js";

const first = [1, 2];
const second = [1, 5];
const deployable = createDeployable();
function passenger(id = 10, tile = first, rule = ground) {
    return initialize({
        id, position: Tile.center(tile), initial: { occupancy: { tile, direction: null } }, definition: {
            id: "passenger", hooks: Hooks.empty(), occupancy: { slot: "OCCUPANT" }, presence: {},
            classification: { type: "OPERATOR", side: "ALLY", profession: "WARRIOR", subProfession: "FEARLESS", extraProfessions: [], groupTags: [] }, vitality: vitality(100),
            blocker: { rule, capacity: 1, restrictions: [{ id: "opposing-side", group: null, value: sides("ENEMY") }] },
        },
    });
}
function platform() {
    return initialize({
        id: 30, position: Tile.center(first), initial: { occupancy: { tile: first, direction: null } },
        definition: createPlatform({
            id: "platform", vitality: vitality(100),
            classification: { type: "DEVICE", side: "ALLY", filterTags: [], groupTags: [] },
            taunt: -1,
            deployable, tileChanges: { elevation: "HIGHLAND" },
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

test("a platform permits air blocking but forbids ground blocking independently of terrain exemption", () => {
    let battle = acquire(fixture([platform(), passenger(10, first, { ...air, layers: ["GROUND", "AIR"] }),
        target(20, { layer: "AIR" }), target(21, { position: [2.1, 1] })]));
    assert.equal(ownerId(battle, 20), 10);
    assert.equal(ownerId(battle, 21), undefined);
    battle = update(battle, ref(getUnit(battle, 10)), setRule({ ...ground, ignoreTerrain: true }));
    assert.equal(ownerId(battle, 20), undefined);
    battle = acquire(battle);
    assert.equal(ownerId(battle, 21), undefined);
});

test("removing a platform kills its own passenger and restores the tile", () => {
    let battle = fixture([platform(), passenger(), passenger(11, second)]);
    battle = remove(battle, ref(getUnit(battle, 30)), { reason: "SCRIPT" });
    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(battle.events.find(entry => entry.type === "UNIT_REMOVED" && entry.unitId === 10).reason, "DEATH");
    assert.ok(getUnit(battle, 11));
    assert.equal(getTile(battle.battlefield.map, first).state.elevation, "LOWLAND");
});
