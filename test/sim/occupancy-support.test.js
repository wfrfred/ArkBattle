import { tiles as tileEntries } from '../helpers/tiles.js';
import { normal } from '../../dist/content/terrain/definition.js';
import { unitsAt } from "../helpers/battlefield.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import * as field from "../../dist/core/battlefield/state.js";
import * as fieldUnits from "../../dist/core/battlefield/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { createTile } from "../helpers/tiles.js";
import { createBattleState } from "../../dist/core/battle/state.js";
import { add, replace as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { remove } from "../../dist/core/battle/unit.js";
import * as effects from "../../dist/core/unit/effect/index.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { actionCapability } from "../helpers/actions.js";
import { initialize } from "../helpers/unit.js";

const map = createMap(2, 3, tileEntries(Array.from({ length: 6 }, () => createTile({
    heightType: "LOWLAND", meleeBlockable: true, buildableType: "ALL", passableMask: "ALL",
    terrain: normal.create({}), walkCost: 1, advancedBuildableMask: 1,
}))));

function unit(id, tile = [0, 0], slot = "OCCUPANT", definition = {}, states = {}) {
    return initialize({
        id, position: [tile[1], tile[0]],
        definition: { hooks: [],
            id: `occupancy-${id}`, occupancy: slot === "SUPPORT" ? { slot, hooks: [] } : { slot }, spatialPresence: {},
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
            ...definition,
        },
        states: { occupancy: { ...(states).occupancy, tile }, ...states },
    });
}

function platform(id = 10, leaveHook, tile = [0, 0], definition = {}) {
    return unit(id, tile, "SUPPORT", {

        hooks: leaveHook === undefined ? [] : [leaveHook],
        ...definition,
    });
}

function fixture(instances = [platform(), unit(20)]) {
    let current = field.create(map);
    for (const instance of instances) current = fieldUnits.add(current, instance);
    return createBattleState(current);
}

const withoutTile = current => ({ ...current, occupancy: { ...(current).occupancy, tile: null } });

test("a null occupancy tile and empty tiles have no occupancy entry", () => {
    const initialized = initialize({ id: 1, definition: { hooks: [], id: "empty", occupancy: { slot: "OCCUPANT" } }, position: [0, 0] });
    assert.deepEqual(initialized.occupancy, { tile: null });
    const current = fieldUnits.add(field.create(map), initialized);
    assert.equal(current.occupancy.size, 0);
    assert.equal(at(current, [0, 0]), undefined);
    assert.equal(at(current, [2, 0]), undefined);
});

test("one tile independently registers an occupant and a support with typed identities", () => {
    const battle = fixture();
    const entry = at(battle.battlefield, [0, 0]);
    assert.equal(entry.occupant.id, 20);
    assert.equal(entry.support.id, 10);
    assert.equal(battle.battlefield.occupancy.size, 1);
    assert.equal("supportRelations" in battle.battlefield, false);
    assert.deepEqual(unitsAt(battle.battlefield, [0, 0]).map(unit => unit.id), [10, 20]);
    assert.equal(battle.battlefield.units.get(entry.occupant.id), getUnit(battle, 20));
    assert.equal(battle.battlefield.units.get(entry.support.id), getUnit(battle, 10));
});

test("out-of-bounds queries cannot alias a valid flattened tile key", () => {
    const battle = fixture([unit(20, [1, 0])]);
    assert.equal(at(battle.battlefield, [0, 3]), undefined);
    assert.equal(at(battle.battlefield, [1, -3]), undefined);
    assert.equal(at(battle.battlefield, [1, 0]).occupant.id, 20);
});

test("out-of-bounds tiles and conflicting slots reject without mutating the input", () => {
    const battle = fixture();
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21)), RangeError);
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21, [0, 0], "SUPPORT")), RangeError);
    assert.throws(() => fieldUnits.add(battle.battlefield, unit(21, [0, 3])), RangeError);
    assert.throws(() => fieldUnits.update(battle.battlefield, [{
        ...getUnit(battle, 20), occupancy: { ...(getUnit(battle, 20)).occupancy, tile: [0, 3] },
    }]), RangeError);
    assert.equal(battle.battlefield.units.size, 2);
    assert.equal(at(battle.battlefield, [0, 0]).occupant.id, 20);
    assert.equal(at(battle.battlefield, [0, 0]).support.id, 10);
});

test("value-equal occupancy tiles preserve the reverse index while updating the Unit", () => {
    const battle = fixture();
    const previous = battle.battlefield;
    const occupant = getUnit(battle, 20);
    const updated = {
        ...occupant, vitality: { ...occupant.vitality, hp: 75 },
        occupancy: { ...(occupant).occupancy, tile: [0, 0] },
    };
    const next = fieldUnits.update(previous, [updated]);
    assert.equal(next.units.get(20).vitality.hp, 75);
    assert.equal(next.occupancy, previous.occupancy);
    assert.equal(at(next, [0, 0]), at(previous, [0, 0]));
    assert.equal(next.units.get(at(next, [0, 0]).occupant.id), updated);
    assert.equal(previous.units.get(at(previous, [0, 0]).occupant.id), occupant);
    assert.equal(previous.units.get(20).vitality.hp, 100);
});

test("ordinary Unit updates preserve occupancy without enumerating it", () => {
    let enumerations = 0;
    class MeasuredOccupancy extends Map {
        values() {
            enumerations++;
            return super.values();
        }
    }
    const initial = fixture();
    const occupancy = new MeasuredOccupancy(initial.battlefield.occupancy);
    const battle = { ...initial, battlefield: { ...initial.battlefield, occupancy } };
    const occupant = getUnit(battle, 20);
    const next = updateUnit(battle, [{
        ...occupant, vitality: { ...occupant.vitality, hp: 75 },
    }]);
    assert.equal(enumerations, 0);
    assert.equal(next.battlefield.occupancy, occupancy);
    assert.equal(getUnit(next, 20).vitality.hp, 75);
    assert.equal(getUnit(battle, 20).vitality.hp, 100);
    assert.deepEqual(next.events, []);
});

test("moving and clearing occupancy tiles preserve the other slot and delete empty entries", () => {
    let current = fixture().battlefield;
    const previous = current;
    current = fieldUnits.update(current, [{
        ...current.units.get(20), occupancy: { ...(current.units.get(20)).occupancy, tile: [0, 1] },
    }]);
    assert.equal(at(current, [0, 0]).occupant, null);
    assert.equal(at(current, [0, 0]).support.id, 10);
    assert.equal(at(current, [0, 1]).occupant.id, 20);
    current = fieldUnits.remove(current, { id: 10 });
    assert.equal(at(current, [0, 0]), undefined);
    current = fieldUnits.update(current, [withoutTile(current.units.get(20))]);
    assert.equal(current.occupancy.size, 0);
    assert.equal(current.units.has(20), true);
    assert.equal(at(previous, [0, 0]).occupant.id, 20);
});

test("occupancy and support are independent of body position and spatial disappearance", () => {
    let battle = fixture();
    const occupancy = battle.battlefield.occupancy;
    for (const id of [10, 20]) {
        const current = getUnit(battle, id);
        battle = updateUnit(battle, [{
            ...current, position: [100, 100], spatialPresence: { present: false },
        }]);
    }
    assert.equal(battle.battlefield.occupancy, occupancy);
    const entry = at(battle.battlefield, [0, 0]);
    assert.equal(entry.occupant.id, 20);
    assert.equal(entry.support.id, 10);
    assert.equal(battle.battlefield.units.get(entry.occupant.id), getUnit(battle, 20));
    assert.equal(battle.battlefield.units.get(entry.support.id), getUnit(battle, 10));
    assert.deepEqual(battle.events, []);
});

test("registering a SUPPORT slot is independent of tile properties", () => {
    const provider = unit(10, [0, 0], "SUPPORT");
    const occupant = unit(20);
    const battle = fixture([provider, occupant]);
    const entry = at(battle.battlefield, [0, 0]);


    assert.equal(battle.battlefield.units.get(entry.support.id), provider);
    assert.equal(battle.battlefield.units.get(entry.occupant.id), occupant);
});

function leaveOccupant(battle, { unit }) {
    const tile = unit.occupancy.tile;
    if (unit.definition.occupancy.slot !== "SUPPORT" || tile === null) return battle;
    const occupant = at(battle.battlefield, tile)?.occupant;
    return occupant === undefined || occupant === null ? battle : remove(battle, occupant.id, "SCRIPT");
}

test("occupancy tile changes update support facts without executing Unit leave content", () => {
    const calls = [];
    const provider = platform(10, { id: "test/platform-leave", stage: "leave", invoke(battle) { calls.push("platform"); return { state: battle, value: undefined }; } });
    const occupant = unit(20, [0, 0], "OCCUPANT", {
        hooks: [{ id: "test/leave", stage: "leave", invoke(battle) { calls.push("occupant"); return { state: battle, value: undefined }; } }],
    });
    let battle = fixture([provider, occupant]);
    battle = updateUnit(battle, [{
        ...getUnit(battle, 20), occupancy: { ...(getUnit(battle, 20)).occupancy, tile: [0, 1] },
    }]);
    assert.equal(at(battle.battlefield, [0, 0]).occupant, null);
    assert.equal(at(battle.battlefield, [0, 0]).support.id, 10);
    assert.equal(at(battle.battlefield, [0, 1]).occupant.id, 20);
    assert.equal(at(battle.battlefield, [0, 1]).support, null);
    battle = updateUnit(battle, [withoutTile(getUnit(battle, 10))]);
    assert.equal(at(battle.battlefield, [0, 0]), undefined);
    assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
    assert.equal(getUnit(battle, 10).lifecycle, "PRESENT");
    assert.deepEqual(calls, []);
    assert.deepEqual(battle.events, []);
});

test("replacing a platform occupancy tile updates the current pair without lifecycle callbacks", () => {
    let calls = 0;
    const first = platform(10, { id: "test/platform-leave", stage: "leave", invoke(battle) { calls++; return { state: battle, value: undefined }; } });
    let battle = fixture([first, unit(20), withoutTile(platform(11))]);
    const previous = battle;
    battle = updateUnit(battle, [
        withoutTile(getUnit(battle, 10)),
        { ...getUnit(battle, 11), occupancy: { ...(getUnit(battle, 11)).occupancy, tile: [0, 0] } },
    ]);
    assert.equal(calls, 0);
    const entry = at(battle.battlefield, [0, 0]);
    const previousEntry = at(previous.battlefield, [0, 0]);
    assert.equal(entry.occupant.id, 20);
    assert.equal(entry.support.id, 11);
    assert.equal(battle.battlefield.units.get(entry.support.id), getUnit(battle, 11));
    assert.equal(previousEntry.occupant.id, 20);
    assert.equal(previous.battlefield.units.get(previousEntry.support.id), first);
    assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
    assert.deepEqual(battle.events, []);
});

test("platform onLeave uses its historical occupancy tile after removal and completes both Units' cleanup", () => {
    const trace = [];
    const action = name => ({
        id: name, intervalTicks: 30, speed: 100,
        initialize: battle => ({ state: battle, value: {} }),
        prepare: battle => ({ state: battle, value: {} }),
        onTick: battle => ({ state: battle, value: false }),
        onEnd: battle => { trace.push(`${name} ended`); return battle; },
    });
    const providerAction = action("platform action");
    const occupantAction = action("occupant action");
    let historicalProvider;
    const provider = platform(10, { id: "test/platform-leave", stage: "leave", invoke(battle, departure) {
        assert.equal(departure.unit, historicalProvider);
        assert.equal(departure.unit.lifecycle, "PRESENT");
        assert.equal(getUnit(battle, provider.id), undefined);
        assert.deepEqual(departure.unit.occupancy.tile, [0, 0]);
        assert.equal(at(battle.battlefield, [0, 0]).support, null);
        assert.equal(at(battle.battlefield, [0, 0]).occupant.id, 20);
        assert.deepEqual(battle.removedUnits.map(entry => entry.unitId), [10]);
        trace.push("platform left");
        return { state: leaveOccupant(battle, departure), value: undefined };
    } }, [0, 0], {
        action: actionCapability(providerAction),
    });
    const occupant = unit(20, [0, 0], "OCCUPANT", {
        action: actionCapability(occupantAction),
        hooks: [{ id: "test/leave", stage: "leave", invoke(battle) { trace.push("occupant left"); return { state: battle, value: undefined }; } }],
    });
    let battle = fixture([provider, occupant]);
    for (const [id, definition] of [[10, providerAction], [20, occupantAction]]) {
        battle = actions.start(battle, actions.ref({ id }, definition)).state;
        battle = effects.install(battle, { id }, {
            id: `effect-${id}`, initialize: () => ({}),
            onEnd: current => { trace.push(`${id} effect ended`); return current; },
        }).state;
    }
    const previous = battle;
    historicalProvider = getUnit(battle, 10);
    battle = remove(battle, 10, "SCRIPT");
    assert.equal(getUnit(battle, 10), undefined);
    assert.equal(getUnit(battle, 20), undefined);
    assert.equal(battle.battlefield.occupancy.size, 0);
    assert.deepEqual(trace, [
        "platform action ended", "10 effect ended", "platform left",
        "occupant action ended", "20 effect ended", "occupant left",
    ]);
    assert.deepEqual(battle.removedUnits.map(entry => entry.unitId), [10, 20]);
    assert.equal(previous.battlefield.units.size, 2);
    assert.equal(historicalProvider.definition.occupancy.slot, "SUPPORT");
});

test("platform onLeave reads the current occupant and does not remove one already moved away", () => {
    const seen = [];
    const provider = platform(10, { id: "test/platform-leave", stage: "leave", invoke(battle, departure) {
        const occupant = at(battle.battlefield, departure.unit.occupancy.tile)?.occupant;
        seen.push(occupant?.id);
        return { state: leaveOccupant(battle, departure), value: undefined };
    } });
    let battle = fixture([provider, unit(20)]);
    battle = effects.install(battle, { id: 10 }, {
        id: "replace occupant", initialize: () => ({}),
        onEnd(current) {
            current = updateUnit(current, [{
                ...getUnit(current, 20), occupancy: { ...(getUnit(current, 20)).occupancy, tile: [0, 1] },
            }]);
            return add(current, unit(21));
        },
    }).state;
    const previous = battle;
    battle = remove(battle, 10, "SCRIPT");
    assert.deepEqual(seen, [21]);
    assert.equal(getUnit(battle, 21), undefined);
    assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
    assert.deepEqual(getUnit(battle, 20).occupancy.tile, [0, 1]);
    assert.deepEqual(battle.removedUnits.map(entry => entry.unitId), [10, 21]);
    const previousEntry = at(previous.battlefield, [0, 0]);
    assert.equal(previousEntry.occupant.id, 20);
    assert.equal(previous.battlefield.units.get(previousEntry.support.id), getUnit(previous, 10));
});

for (const scenario of ["empty", "occupant departed", "occupant moved"]) {
    test(`platform onLeave has no cascading departure when ${scenario}`, () => {
        const provider = platform(10, { id: "test/platform-leave", stage: "leave", invoke(battle, departure) { return { state: leaveOccupant(battle, departure), value: undefined }; } });
        let battle = fixture(scenario === "empty" ? [provider] : [provider, unit(20)]);
        if (scenario === "occupant departed") battle = remove(battle, 20, "SCRIPT");
        if (scenario === "occupant moved") battle = updateUnit(battle, [{
            ...getUnit(battle, 20), occupancy: { ...(getUnit(battle, 20)).occupancy, tile: [0, 1] },
        }]);
        const removedBefore = battle.removedUnits.length;
        battle = remove(battle, 10, "SCRIPT");
        assert.equal(battle.removedUnits.length, removedBefore + 1);
        assert.equal(getUnit(battle, 10), undefined);
        assert.equal(at(battle.battlefield, [0, 0]), undefined);
        if (scenario === "occupant moved") assert.equal(getUnit(battle, 20).lifecycle, "PRESENT");
    });
}
