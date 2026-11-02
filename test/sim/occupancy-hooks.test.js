import assert from "node:assert/strict";
import { test } from "node:test";
import { add, remove, replace } from "../../dist/core/battle/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { fixtureBattle, getUnit, initialize } from "../helpers/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as mechanisms from "../../dist/core/battle/mechanism.js";

const tile = [0, 2];

function occupant(id = 20, hooks = []) {
    return initialize({
        id, position: [2, 0], hooks,
        definition: {
            id: `occupant-${id}`, occupancy: { slot: "OCCUPANT" }, spatialPresence: {},
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
        },
        initial: { occupancy: { tile } },
    });
}

function support(id = 10, hooks = [], programs = []) {
    return initialize({
        id, position: [2, 0], hooks: programs,
        definition: { id: `support-${id}`, occupancy: { slot: "SUPPORT", hooks } },
        initial: { occupancy: { tile } },
    });
}

function hook(id, stage, invoke, accepts) {
    return {
        id, stage,
        ...(accepts === undefined ? {} : { accepts }),
        invoke(battle, context) { return { state: invoke(battle, context), value: undefined }; },
    };
}

for (const supportFirst of [true, false]) {
    test(`Occupancy pairs either arrival order, support first: ${supportFirst}`, () => {
        const calls = [];
        const provider = support(10, [
            hook("added", "occupantAdded", (battle, context) => {
                assert.equal(at(battle.battlefield, tile).support.id, 10);
                assert.equal(at(battle.battlefield, tile).occupant.id, 20);
                assert.equal(getUnit(battle, 10).occupancy.pair, context);
                assert.equal(getUnit(battle, 20).occupancy.pair, context);
                assert.equal(context.support.occupancy.pair, null);
                assert.equal(context.occupant.occupancy.pair, null);
                calls.push(["added", context.support.id, context.occupant.id]);
                return battle;
            }),
            hook("removed", "occupantRemoved", (battle, context) => {
                assert.equal(at(battle.battlefield, tile).occupant, null);
                assert.equal(getUnit(battle, 20), undefined);
                assert.equal(getUnit(battle, 10).occupancy.pair, null);
                calls.push(["removed", context.support.id, context.occupant.id]);
                return battle;
            }),
        ]);
        let battle = fixtureBattle();
        for (const unit of supportFirst ? [provider, occupant()] : [occupant(), provider]) {
            battle = add(battle, unit);
        }
        const paired = battle;
        battle = remove(battle, 20, "SCRIPT");
        assert.deepEqual(calls, [["added", 10, 20], ["removed", 10, 20]]);
        assert.notEqual(getUnit(paired, 10).occupancy.pair, null);
        assert.equal(getUnit(battle, 10).definition.occupancy, provider.definition.occupancy);
    });
}

test("an earlier deployment enter creates the counterpart without duplicate Added", () => {
    const calls = [];
    const provider = support(10, [hook("added", "occupantAdded", (battle, context) => {
        calls.push([context.support.id, context.occupant.id]);
        return battle;
    })]);
    const unit = occupant(20, [{
        id: "deployment/enter", stage: "enter",
        invoke(battle) { return { state: add(battle, provider), value: undefined }; },
    }]);
    const battle = add(fixtureBattle(), unit);
    assert.deepEqual(calls, [[10, 20]]);
    assert.equal(getUnit(battle, 10).occupancy.pair, getUnit(battle, 20).occupancy.pair);
});

test("an earlier leave can replace an occupant without rewriting or repeating the old removal", () => {
    const calls = [];
    let oldPair;
    const provider = support(10, [
        hook("added", "occupantAdded", (battle, context) => {
            calls.push(["added", context.occupant.id]);
            return battle;
        }),
        hook("removed", "occupantRemoved", (battle, context) => {
            assert.equal(context, oldPair);
            assert.equal(context.occupant.id, 20);
            assert.equal(getUnit(battle, 20), undefined);
            calls.push(["removed", context.occupant.id]);
            return battle;
        }),
    ]);
    const first = occupant(20, [{
        id: "source/replace", stage: "leave",
        invoke(battle) { return { state: add(battle, occupant(21)), value: undefined }; },
    }]);
    let battle = add(add(fixtureBattle(), provider), first);
    oldPair = getUnit(battle, 20).occupancy.pair;
    battle = remove(battle, 20, "SCRIPT");
    assert.deepEqual(calls, [["added", 20], ["removed", 20], ["added", 21]]);
    assert.equal(getUnit(battle, 10).occupancy.pair.occupant.id, 21);
    assert.equal(getUnit(battle, 21).occupancy.pair.support.id, 10);
});

test("support callbacks retain event facts and read the latest returned state", () => {
    let event;
    const calls = [];
    const provider = support(10, [
        hook("change-hp", "occupantAdded", (battle, context) => {
            event = context;
            const current = getUnit(battle, context.occupant.id);
            calls.push("changed");
            return replace(battle, [{ ...current, vitality: { ...current.vitality, hp: 75 } }]);
        }),
        hook("observe", "occupantAdded", (battle, context) => {
            assert.equal(context, event);
            assert.equal(context.occupant.vitality.hp, 100);
            assert.equal(getUnit(battle, context.occupant.id).vitality.hp, 75);
            calls.push("observed");
            return battle;
        }, (battle, context) => getUnit(battle, context.occupant.id).vitality.hp === 75),
    ]);
    const battle = add(add(fixtureBattle(), provider), occupant());
    assert.deepEqual(calls, ["changed", "observed"]);
    assert.equal(getUnit(battle, 20).vitality.hp, 75);
});

test("nested removal stops later Added callbacks and emits one Removed", () => {
    const calls = [];
    const provider = support(10, [
        hook("remove", "occupantAdded", (battle, context) => {
            calls.push("first added");
            return remove(battle, context.occupant.id, "SCRIPT");
        }),
        hook("later", "occupantAdded", battle => { calls.push("later added"); return battle; }),
        hook("removed", "occupantRemoved", battle => { calls.push("removed"); return battle; }),
    ]);
    const battle = add(add(fixtureBattle(), provider), occupant());
    assert.deepEqual(calls, ["first added", "removed"]);
    assert.equal(getUnit(battle, 20), undefined);
});

test("departure closes dependencies before Occupancy, content and external observers", () => {
    const trace = [];
    const provider = support(10, [hook("removed", "occupantRemoved", (battle, context) => {
        assert.equal(getUnit(battle, context.occupant.id), undefined);
        trace.push("occupancy");
        return battle;
    })]);
    const prepared = occupant();
    const host = { ...prepared, hooks: [...prepared.hooks, {
        id: "test/prepare", stage: "prepare", invoke(battle) {
            assert.equal(getUnit(battle, 20).lifecycle, "LEAVING");
            trace.push("prepare");
            return { state: battle, value: undefined };
        },
    }, {
        id: "test/leave", stage: "leave", invoke(battle) {
            trace.push("leave");
            return { state: battle, value: undefined };
        },
    }] };
    let battle = add(add(fixtureBattle(), provider), host);
    battle = effects.install(battle, { id: 20 }, {
        id: "owned-child", initialize: () => ({}), onEnd(state) {
            trace.push("child");
            return state;
        },
    }).state;
    battle = mechanisms.create(battle, {
        id: "observer", initialize: () => ({}), onUnitLeave(state) {
            trace.push("mechanism");
            return state;
        },
    }).state;
    battle = remove(battle, 20, "SCRIPT");
    assert.deepEqual(trace, ["prepare", "child", "occupancy", "leave", "mechanism"]);
    assert.equal(battle.lifetime.endings.size, 0);
});
