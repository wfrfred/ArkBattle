import assert from "node:assert/strict";
import { test } from "node:test";
import { add, remove, update } from "../../dist/core/battle/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { fixtureBattle, getUnit, initialize } from "../helpers/unit.js";

const tile = [0, 2];

function occupant(id = 20) {
    return initialize({
        id, position: [2, 0],
        definition: {
            id: `occupant-${id}`, occupancy: { slot: "OCCUPANT" }, spatialPresence: {},
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
        },
        states: { occupancy: { tile } },
    });
}

function support(id = 10, hooks = [], position = tile) {
    return initialize({
        id, position: [2, 0],
        definition: { id: `support-${id}`, occupancy: { slot: "SUPPORT", hooks } },
        states: { occupancy: { tile: position } },
    });
}

function hook(id, stage, invoke, accepts) {
    return {
        id, stage,
        ...(accepts === undefined ? {} : { accepts }),
        invoke(battle, context) {
            return { state: invoke(battle, context), value: undefined };
        },
    };
}

test("support hooks follow occupant membership after occupancy is committed", () => {
    const calls = [];
    const provider = support(10, [
        hook("added", "occupantAdded", (battle, context) => {
            assert.equal(at(battle.battlefield, tile).support.id, context.support.id);
            assert.equal(at(battle.battlefield, tile).occupant.id, context.occupant.id);
            calls.push(["added", context.support.id, context.occupant.id]);
            return battle;
        }),
        hook("removed", "occupantRemoved", (battle, context) => {
            assert.equal(at(battle.battlefield, tile).support.id, context.support.id);
            assert.equal(at(battle.battlefield, tile).occupant, null);
            assert.equal(getUnit(battle, context.occupant.id), undefined);
            assert.deepEqual(context.tile, tile);
            calls.push(["removed", context.support.id, context.occupant.id]);
            return battle;
        }),
    ]);
    let battle = add(fixtureBattle(), provider);
    assert.deepEqual(calls, []);
    battle = add(battle, occupant());
    const current = getUnit(battle, 20);
    battle = update(battle, [{
        ...current, position: [4, 0], spatialPresence: { present: false },
        vitality: { ...current.vitality, hp: 75 },
    }]);
    assert.deepEqual(calls, [["added", 10, 20]]);
    battle = remove(battle, 20, "SCRIPT");
    assert.deepEqual(calls, [["added", 10, 20], ["removed", 10, 20]]);
    assert.equal(getUnit(battle, 10).definition.occupancy, provider.definition.occupancy);
});

test("support entry and withdrawal notify an occupant that remains in place", () => {
    const calls = [];
    let originalSupport;
    const provider = support(10, [
        hook("added", "occupantAdded", (battle, context) => {
            calls.push(["added", context.support.id, context.occupant.id]);
            return battle;
        }),
        hook("removed", "occupantRemoved", (battle, context) => {
            assert.equal(context.support, originalSupport);
            assert.deepEqual(context.support.occupancy.tile, tile);
            assert.equal(getUnit(battle, context.support.id).occupancy.tile, null);
            assert.equal(getUnit(battle, context.occupant.id).lifecycle, "PRESENT");
            assert.equal(at(battle.battlefield, tile).support, null);
            calls.push(["removed", context.support.id, context.occupant.id]);
            return battle;
        }),
    ]);
    let battle = add(fixtureBattle(), occupant());
    battle = add(battle, provider);
    originalSupport = getUnit(battle, 10);
    battle = update(battle, [{ ...originalSupport, occupancy: { tile: null } }]);
    assert.deepEqual(calls, [["added", 10, 20], ["removed", 10, 20]]);
    assert.equal(at(battle.battlefield, tile).occupant.id, 20);
});

test("replacing a support dispatches the old removal before the new addition", () => {
    const calls = [];
    const provider = support(10, [hook("removed", "occupantRemoved", (battle, context) => {
        assert.equal(at(battle.battlefield, tile).support.id, 11);
        assert.equal(at(battle.battlefield, tile).occupant.id, 20);
        assert.deepEqual(context.support.occupancy.tile, tile);
        calls.push(["removed", context.support.id, context.occupant.id]);
        return battle;
    })]);
    const replacement = support(11, [hook("added", "occupantAdded", (battle, context) => {
        assert.equal(at(battle.battlefield, tile).support.id, 11);
        calls.push(["added", context.support.id, context.occupant.id]);
        return battle;
    })], null);
    let battle = add(fixtureBattle(), occupant());
    battle = add(battle, provider);
    battle = add(battle, replacement);
    battle = update(battle, [
        { ...getUnit(battle, 10), occupancy: { tile: null } },
        { ...getUnit(battle, 11), occupancy: { tile } },
    ]);
    assert.deepEqual(calls, [["removed", 10, 20], ["added", 11, 20]]);
    assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
});

test("support hooks keep their event context while reading the latest returned state", () => {
    let event;
    const calls = [];
    const provider = support(10, [
        hook("change-hp", "occupantAdded", (battle, context) => {
            event = context;
            const current = getUnit(battle, context.occupant.id);
            calls.push("changed");
            return update(battle, [{ ...current, vitality: { ...current.vitality, hp: 75 } }]);
        }),
        hook("observe", "occupantAdded", (battle, context) => {
            assert.equal(context, event);
            assert.equal(context.occupant.vitality.hp, 100);
            assert.equal(getUnit(battle, context.occupant.id).vitality.hp, 75);
            calls.push("observed");
            return battle;
        }, (battle, context) => getUnit(battle, context.occupant.id).vitality.hp === 75),
    ]);
    let battle = add(fixtureBattle(), provider);
    battle = add(battle, occupant());
    assert.deepEqual(calls, ["changed", "observed"]);
    assert.equal(getUnit(battle, 20).vitality.hp, 75);
});

test("nested removal prevents later added hooks for the removed relationship", () => {
    const calls = [];
    const provider = support(10, [
        hook("remove-occupant", "occupantAdded", (battle, context) => {
            calls.push("first added");
            return remove(battle, context.occupant.id, "SCRIPT");
        }),
        hook("later-added", "occupantAdded", battle => {
            calls.push("later added");
            return battle;
        }),
        hook("removed", "occupantRemoved", (battle, context) => {
            assert.equal(getUnit(battle, context.occupant.id), undefined);
            calls.push("removed");
            return battle;
        }),
    ]);
    let battle = add(fixtureBattle(), provider);
    battle = add(battle, occupant());
    assert.deepEqual(calls, ["first added", "removed"]);
    assert.equal(getUnit(battle, 20), undefined);
    assert.equal(at(battle.battlefield, tile).occupant, null);
});
