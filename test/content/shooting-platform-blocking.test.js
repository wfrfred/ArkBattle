import assert from "node:assert/strict";
import { test } from "node:test";
import { create as createPlatform } from "../../dist/content/devices/shooting-platform.js";
import * as conditions from "../../dist/content/terrain/condition.js";
import { add, remove, update } from "../../dist/core/battle/unit.js";
import { addCard } from "../../dist/core/battle/deployment/index.js";
import { deploy } from "../../dist/core/battle/deployment/index.js";
import { initialize as initializeBattle } from "../../dist/core/battle/index.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { at as occupancyAt } from "../../dist/core/battlefield/occupancy.js";
import { Tile } from "../../dist/core/geometry/coordinate.js";
import { createDefinition as createDeployable } from "../../dist/core/unit/capability/deployable/index.js";
import { setHook } from "../../dist/core/unit/capability/blocking/blocker.js";
import { fixture, holder, target, acquire, ownerId, hook } from "../helpers/blocking.js";
import { getUnit, initialize } from "../helpers/unit.js";

const first = [1, 2];
const second = [1, 5];
const profile = createDeployable({
    cost: 0, redeployTicks: 0, slots: 0, placement: "ALL",
    allowedSiteConditions: [conditions.normal],
});

function passengerDefinition(extra = {}) {
    return { hooks: [],
        id: "platform-passenger", occupancy: { slot: "OCCUPANT" }, spatialPresence: {},
        allegiance: { side: "ALLY" }, vitality: { maxHp: 100, defense: 0, resistance: 0 },
        blocker: { capacity: 1, geometry: { radius: 1 } }, deployable: profile,
        ...extra,
    };
}

function passenger(id = 10, tile = first, extra = {}) {
    return initialize({ id, position: Tile.center(tile), definition: passengerDefinition(extra), states: { occupancy: { tile } } });
}

function platformDefinition(id = "shooting-platform") {
    return createPlatform({ hooks: [],
        id, vitality: { maxHp: 100, defense: 0, resistance: 0 }, deployable: profile,
        tileChanges: { elevation: "HIGHLAND" },
    });
}

function platform(id = 30, tile = first) {
    return initialize({
        id, position: Tile.center(tile), definition: platformDefinition(`platform-${id}`),
        states: { occupancy: { tile } },
    });
}

function assertSuppressed(battle, id) {
    const unit = getUnit(battle, id);
    assert.equal(unit.blocker.rules.length, 1);
    assert.deepEqual(unit.blocker.blocked, []);
}

function assertEligible(battle, id) {
    const unit = getUnit(battle, id);
    assert.deepEqual(unit.blocker.rules, []);
}

function move(unit, tile) {
    return { ...unit, position: Tile.center(tile), occupancy: { ...(unit).occupancy, tile } };
}

test("platform entry suppresses its existing passenger synchronously without changing tile permission or other blockers", () => {
    let battle = fixture([
        passenger(), target(), holder(11), passenger(12, second),
    ]);
    battle = acquire(battle);
    const before = battle;
    const originalTile = getTile(battle.battlefield.map, first);
    assert.equal(ownerId(before), 10);

    battle = add(battle, platform());

    assertSuppressed(battle, 10);
    assertEligible(battle, 11); // Same world tile, without OCCUPANT registration.
    assertEligible(battle, 12);
    assert.equal(ownerId(battle), undefined);
    assert.equal(battle.events.filter(event => event.type === "BLOCKING_RELEASED").length, 1);
    assert.equal(getTile(battle.battlefield.map, first).state.allowsBlocking, originalTile.state.allowsBlocking);
    assert.equal(getTile(battle.battlefield.map, second).state.allowsBlocking, true);
    assert.equal(ownerId(before), 10);
    assert.deepEqual(getUnit(before, 10).blocker.rules, []);

    battle = acquire(battle, 11);
    assert.equal(ownerId(battle), 11, "the platform must not disable the tile for an unrelated blocker");
});

for (const entry of ["initial", "script", "manual"]) {
    test(`a passenger entering an existing platform through ${entry} entry is already suppressed when the operation returns`, () => {
        let battle;
        let id;
        if (entry === "initial") {
            battle = initializeBattle({
                map: fixture().battlefield.map,
                schedule: { type: "TIMELINE", spawns: [] }, predefines: [], initialMechanisms: [],
                maxTicks: 10, routeMoveMultiplier: 1, rngState: 1,
                initialUnits: [
                    { definition: platformDefinition(), position: Tile.center(first), tile: first },
                    { definition: passengerDefinition(), position: Tile.center(first), tile: first },
                ],
            });
            id = 1;
        } else {
            battle = add(fixture(), platform());
            if (entry === "script") {
                battle = add(battle, passenger());
                id = 10;
            } else {
                const card = addCard(battle, { unit: passengerDefinition() });
                const result = deploy(card.state, { cardId: card.value, tilePosition: first });
                assert.equal(result.value.type, "DEPLOYED");
                battle = result.state;
                id = result.value.unitId;
            }
        }
        assertSuppressed(battle, id);
        assert.equal(getTile(battle.battlefield.map, first).state.allowsBlocking, true);
    });
}

test("one update exchanges passengers and synchronizes rules against the final occupancy", () => {
    let battle = fixture([platform(), passenger(), passenger(11, second)]);
    const before = battle;
    battle = update(battle, [move(getUnit(battle, 10), second), move(getUnit(battle, 11), first)]);

    assertEligible(battle, 10);
    assertSuppressed(battle, 11);
    assert.equal(occupancyAt(battle.battlefield, first).occupant.id, 11);
    assertSuppressed(before, 10);
    assertEligible(before, 11);
});

test("one update exchanges supports beneath stationary passengers and releases the newly suppressed blocker", () => {
    const support = initialize({
        id: 31, position: Tile.center(second),
        definition: { id: "ordinary-support", occupancy: { slot: "SUPPORT", hooks: [] } },
        states: { occupancy: { tile: second } },
    });
    let battle = fixture([platform(), support, passenger(), passenger(11, second), target(21, { position: [5.25, 1] })]);
    battle = acquire(battle, 11);
    assert.equal(ownerId(battle, 21), 11);

    battle = update(battle, [move(getUnit(battle, 30), second), move(getUnit(battle, 31), first)]);

    assertEligible(battle, 10);
    assertSuppressed(battle, 11);
    assert.equal(ownerId(battle, 21), undefined);
    assert.equal(getUnit(battle, 10).lifecycle, "PRESENT");
    assert.equal(getUnit(battle, 11).lifecycle, "PRESENT");
});

test("platform removal removes only its old passenger and keeps tile permission", () => {
    let battle = fixture([platform(), passenger(), passenger(11, second)]);
    battle = remove(battle, 30, "SCRIPT");

    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(battle.removedUnits.find(entry => entry.unitId === 10).reason, "DEATH");
    assertEligible(battle, 11);
    assert.equal(getTile(battle.battlefield.map, first).state.allowsBlocking, true);
    assert.equal(getTile(battle.battlefield.map, second).state.allowsBlocking, true);
});

test("a passenger without Blocker receives no synthetic blocking capability", () => {
    const unit = initialize({
        id: 10, position: Tile.center(first), definition: { hooks: [], id: "nonblocking-passenger", occupancy: { slot: "OCCUPANT" } },
        states: { occupancy: { tile: first } },
    });
    const battle = fixture([platform(), unit]);
    assert.equal("blocker" in getUnit(battle, 10), false);
    assert.equal("blocker" in getUnit(battle, 30), false);
});

for (const nested of ["remove passenger", "remove platform"]) {
    test(`a released Hook can ${nested} while platform entry installs its rule without leaving stale state`, () => {
        let battle = fixture([passenger(), target()]);
        battle = acquire(battle);
        const unit = getUnit(battle, 10);
        let calls = 0;
        battle = update(battle, [{
            ...unit,
            blocker: setHook(unit.blocker, "released", hook("nested-platform-change", state => {
                calls++;
                return remove(state, nested === "remove passenger" ? 10 : 30, "SCRIPT");
            })),
        }]);

        battle = add(battle, platform());

        assert.equal(calls, 1);
        assert.equal(ownerId(battle), undefined);
        assert.equal(getUnit(battle, 10), undefined);
        assert.equal(occupancyAt(battle.battlefield, first)?.occupant ?? null, null);
        if (nested === "remove platform") assert.equal(getUnit(battle, 30), undefined);
        assert.equal(getTile(battle.battlefield.map, first).state.allowsBlocking, true);
    });
}

test("a departing passenger can install its successor on the platform without outer cleanup removing the successor rule", () => {
    let battle = fixture([platform(), target()]);
    const successor = passenger(11, first, {
        hooks: [{ id: "test/enter", stage: "enter", invoke(state) { return { state: acquire(state, 11), value: undefined }; } }],
    });
    battle = add(battle, passenger(10, first, {
        hooks: [{ id: "test/leave", stage: "leave", invoke(state) { return { state: add(state, successor), value: undefined }; } }],
    }));

    battle = remove(battle, 10, "SCRIPT");

    assertSuppressed(battle, 11);
    assert.equal(ownerId(battle), undefined);
    assert.equal(occupancyAt(battle.battlefield, first).occupant.id, 11);
});

test("a passenger killed by platform removal can install an eligible successor after the platform is gone", () => {
    let battle = fixture([platform(), target()]);
    const successor = passenger(11, first, {
        hooks: [{ id: "test/enter", stage: "enter", invoke(state) { return { state: acquire(state, 11), value: undefined }; } }],
    });
    battle = add(battle, passenger(10, first, {
        hooks: [{ id: "test/leave", stage: "leave", invoke(state) { return { state: add(state, successor), value: undefined }; } }],
    }));

    battle = remove(battle, 30, "SCRIPT");

    assert.equal(getUnit(battle, 30), undefined);
    assert.equal(getUnit(battle, 10), undefined);
    assertEligible(battle, 11);
    assert.equal(ownerId(battle), 11);
    assert.equal(occupancyAt(battle.battlefield, first).occupant.id, 11);
});
