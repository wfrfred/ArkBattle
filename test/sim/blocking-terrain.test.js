import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBattlefieldMap } from "../../dist/data/arknights/map.js";
import { createTile, changeTile } from "../helpers/tiles.js";
import { create } from "../../dist/core/battlefield/state.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add as addUnit } from "../../dist/core/battle/unit.js";
import { search } from "../../dist/core/battle/blocking/operations.js";
import { blockerOf } from "../../dist/core/battle/blocking/query.js";
import { fixture, holder, target } from "../helpers/blocking.js";
import { initialize } from "../helpers/unit.js";

function map(options = {}) {
    const tile = {
        tileKey: "tile_road",
        heightType: "LOWLAND",
        buildableType: "ALL",
        passableMask: "ALL",
        blackboard: [],
        effects: [],
        ...options,
    };
    return parseBattlefieldMap({ map: [[0, 0, 0]], tiles: [tile], blockEdges: [] });
}

const flag = value => [{ key: "tile_blockable", value, valueStr: null }];

test("tile blocking defaults follow height independently of navigation and deployment", () => {
    const lowland = map({ passableMask: "NONE", buildableType: "NONE" }).tiles.get(0);
    const highland = map({ heightType: "HIGHLAND" }).tiles.get(0);
    assert.equal(lowland.state.allowsBlocking, true);
    assert.equal(highland.state.allowsBlocking, false);
    assert.equal(createTile(lowland).state.allowsBlocking, true);
    assert.equal(createTile(highland).state.allowsBlocking, false);
});

test("tile_blockable overrides the height default in both directions", () => {
    assert.equal(map({ blackboard: flag(0) }).tiles.get(0).state.allowsBlocking, false);
    assert.equal(map({ heightType: "HIGHLAND", blackboard: flag(1) }).tiles.get(0).state.allowsBlocking, true);
    assert.equal(map({ heightType: "HIGHLAND", blackboard: flag(2) }).tiles.get(0).state.allowsBlocking, true);
});

for (const [name, options, expected] of [
    ["nonpassable lowland", { passableMask: "NONE", buildableType: "NONE" }, 10],
    ["passable highland", { heightType: "HIGHLAND" }, undefined],
    ["explicitly disabled lowland", { blackboard: flag(0) }, undefined],
    ["explicitly enabled highland", { heightType: "HIGHLAND", blackboard: flag(1) }, 10],
]) {
    test(`blocking search uses the tile blocking fact for ${name}`, () => {
        let battle = createBattleState(create(map(options)));
        battle = addUnit(battle, holder(10, { position: [1, 0] }));
        battle = addUnit(battle, target(20, { position: [1.25, 0] }));
        battle = search(battle, { id: 10 });
        assert.equal(blockerOf(battle, { id: 20 })?.id, expected);
        assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED"), expected !== undefined);
    });
}

test("highland support prevents its occupant from blocking even when its buildable type is NONE", () => {
    const support = initialize({
        id: 30,
        position: [2, 1],
        definition: {
            id: "unbuildable-highland-support",
            occupancy: { slot: "SUPPORT", hooks: [] },
        },
        states: { occupancy: { tile: [1, 2] } },
    });
    let battle = fixture([
        support,
        holder(10, { states: { occupancy: { tile: [1, 2] } } }),
        target(),
    ]);

    battle = changeTile(battle, [1, 2], { elevation: "HIGHLAND", placement: "NONE", allowsBlocking: false });
    battle = search(battle, { id: 10 });

    assert.equal(blockerOf(battle, { id: 20 }), undefined);
    assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED"), false);
});

for (const [name, options, expected] of [
    ["blockable", {}, 10],
    ["unblockable", { blackboard: flag(0) }, undefined],
]) {
    test(`support registration preserves the ${name} map tile`, () => {
        const support = initialize({
            id: 30,
            position: [1, 0],
            definition: { id: "support-without-tile-change", occupancy: { slot: "SUPPORT", hooks: [] } },
            states: { occupancy: { tile: [0, 1] } },
        });
        let battle = createBattleState(create(map(options)));
        battle = addUnit(battle, support);
        battle = addUnit(battle, holder(10, {
            position: [1, 0], states: { occupancy: { tile: [0, 1] } },
        }));
        battle = addUnit(battle, target(20, { position: [1.25, 0] }));

        battle = search(battle, { id: 10 });

        assert.equal(blockerOf(battle, { id: 20 })?.id, expected);
        assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED"), expected !== undefined);
    });
}

for (const [registeredHeight, bodyHeight, expected] of [
    ["HIGHLAND", "LOWLAND", undefined],
    ["LOWLAND", "HIGHLAND", 10],
    ["LOWLAND", "LOWLAND", 10],
]) {
    test(`blocking uses registered ${registeredHeight} permission when the body is on ${bodyHeight}`, () => {
        const registeredSupport = initialize({
            id: 30,
            position: [3, 1],
            definition: {
                id: "registered-tile-support",
                occupancy: { slot: "SUPPORT", hooks: [] },
            },
            states: { occupancy: { tile: [1, 3] } },
        });
        const bodySupport = initialize({
            id: 31,
            position: [2, 1],
            definition: {
                id: "body-tile-support",
                occupancy: { slot: "SUPPORT", hooks: [] },
            },
            states: { occupancy: { tile: [1, 2] } },
        });
        let battle = fixture([
            registeredSupport,
            bodySupport,
            holder(10, { position: [2, 1], states: { occupancy: { tile: [1, 3] } } }),
            target(),
        ]);

        battle = changeTile(battle, [1, 3], { elevation: registeredHeight, allowsBlocking: registeredHeight === "LOWLAND" });
        battle = changeTile(battle, [1, 2], { elevation: bodyHeight, allowsBlocking: bodyHeight === "LOWLAND" });
        battle = search(battle, { id: 10 });

        assert.equal(blockerOf(battle, { id: 20 })?.id, expected);
        assert.equal(battle.events.some(event => event.type === "BLOCKING_ACQUIRED"), expected !== undefined);
    });
}

test("a registered highland with explicit blocking permission can block without a support", () => {
    let battle = fixture([
        holder(10, { position: [2, 1], states: { occupancy: { tile: [1, 3] } } }),
        target(),
    ]);
    battle = changeTile(battle, [1, 3], { elevation: "HIGHLAND", allowsBlocking: true });
    battle = changeTile(battle, [1, 2], { allowsBlocking: false });
    battle = search(battle, { id: 10 });
    assert.equal(blockerOf(battle, { id: 20 })?.id, 10);
});
