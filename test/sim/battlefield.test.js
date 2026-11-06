import { Hooks } from "../../dist/core/hook.js";
import * as unitLifecycle from "../../dist/core/unit/hook.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, get } from "../helpers/battle.js";
import { ref } from "../../dist/core/unit/query.js";
import { update as updateUnits } from "../../dist/core/battlefield/unit.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { get as getTile } from "../../dist/core/battlefield/map/map.js";
import { update as updateTile } from "../../dist/core/battlefield/tile.js";
import {
    nextPoint,
    setOverlay,
    removeOverlay,
} from "../../dist/core/battlefield/navigation/state.js";
import { effectiveMap, field } from "../../dist/core/battlefield/navigation/cache.js";
import { within, overlap, sweep } from "../../dist/core/battlefield/spatial/query.js";
import { disappear } from "../../dist/core/unit/capability/presence/operations.js";
import { remove, update } from "../../dist/core/battle/unit.js";

test("a field batch publishes final occupancy without moving bodies or executing lifecycle programs", () => {
    const notices = [];
    const definition = (id) => ({
        id,
        occupancy: { slot: "OCCUPANT" },
        hooks: Hooks.empty().set(unitLifecycle.enter, {
                id: "entry",

                invoke: (state) => {
                    notices.push(id);
                    return { state, value: undefined };
                },
            }),
    });
    const state = battle([
        {
            definition: definition("first"),
            position: [0, 0],
            initial: { occupancy: { tile: [0, 0] } },
        },
        {
            definition: definition("second"),
            position: [1, 0],
            initial: { occupancy: { tile: [0, 1] } },
        },
    ]);
    const first = get(state, 0),
        second = get(state, 1);
    const next = updateUnits(state.battlefield, [
        { ...first, occupancy: { ...first.occupancy, tile: [0, 1] } },
        { ...second, occupancy: { ...second.occupancy, tile: [0, 0] } },
    ]);

    assert.equal(at(next, [0, 0]).occupant.id, 1);
    assert.equal(at(next, [0, 1]).occupant.id, 0);
    assert.deepEqual(next.units.get(0).position, [0, 0]);
    assert.equal(at(state.battlefield, [0, 0]).occupant.id, 0);
    assert.equal(at(state.battlefield, [0, 1]).occupant.id, 1);
    assert.deepEqual(notices, ["first", "second"]);
});

test("navigation follows current tile costs, directional restrictions and independent overlays", () => {
    const original = battle([], { rows: 1, columns: 3 }).battlefield;
    const cost = (navigation) => field(effectiveMap(navigation, "WALK"), [0, 2]).nodes[0].distance;
    assert.equal(cost(original.navigation), 2);

    const tile = getTile(original.map, [0, 1]);
    const changed = updateTile(original, [0, 1], { ...tile.state, walkCost: 5 });
    assert.equal(cost(changed.navigation), 6);
    assert.equal(cost(original.navigation), 2);

    const first = { id: 0, cells: [[0, 1]], denyPassage: true, denyDepartures: [] };
    const second = { ...first, id: 1 };
    let navigation = setOverlay(setOverlay(changed.navigation, "WALK", first), "WALK", second);
    navigation = removeOverlay(navigation, "WALK", first);
    assert.equal(nextPoint(navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(navigation, "FLY", [0, 0], [2, 0]), [2, 0]);
    navigation = removeOverlay(navigation, "WALK", second);
    assert.equal(cost(navigation), 6);

    navigation = setOverlay(navigation, "WALK", {
        id: 2,
        cells: [[0, 0]],
        denyPassage: false,
        denyDepartures: ["RIGHT"],
    });
    assert.equal(nextPoint(navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(navigation, "WALK", [2, 0], [0, 0]), [0, 0]);
    const closed = updateTile(changed, [0, 1], { ...tile.state, passability: "FLY_ONLY" });
    assert.equal(nextPoint(closed.navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(closed.navigation, "FLY", [0, 0], [2, 0]), [2, 0]);

    let fork = battle([], { rows: 3, columns: 3 }).battlefield;
    fork = updateTile(fork, [1, 1], {
        ...getTile(fork.map, [1, 1]).state,
        passability: "FLY_ONLY",
    });
    for (const position of [
        [0, 0],
        [0, 1],
        [0, 2],
    ]) {
        fork = updateTile(fork, position, { ...getTile(fork.map, position).state, walkCost: 5 });
    }
    assert.equal(field(effectiveMap(fork.navigation, "WALK"), [1, 2]).nodes[3].distance, 4);
    assert.ok(nextPoint(fork.navigation, "WALK", [0, 1], [2, 1])[1] > 1);
    assert.deepEqual(nextPoint(fork.navigation, "FLY", [0, 1], [2, 1]), [2, 1]);
});

test("spatial queries distinguish body position from hitboxes and return current geometric contacts", () => {
    const circle = (radius) => ({ type: "CIRCLE", offset: [0, 0], radius });
    const state = battle([
        {
            definition: {
                id: "offset",
                hooks: Hooks.empty(),
                hitbox: { shape: { ...circle(0.5), offset: [2, 0] } },
            },
            position: [0, 0],
        },
        { definition: { id: "body", hooks: Hooks.empty() }, position: [2, 0] },
        {
            definition: {
                id: "near",
                hooks: Hooks.empty(),
                spatialPresence: {},
                hitbox: { shape: circle(0.25) },
            },
            position: [0, 0],
        },
    ]);
    const ids = (references) => references.map((reference) => reference.id);
    assert.deepEqual(ids(within(state.battlefield, [circle(0.25)], [2, 0])), [1]);
    assert.deepEqual(ids(overlap(state.battlefield, [circle(0.25)], [2, 0])), [0]);
    const contacts = sweep(state.battlefield, circle(0.25), [-1, 0], [3, 0]);
    assert.deepEqual(
        contacts.map(({ target }) => target.id),
        [2, 0],
    );

    const hidden = update(state, disappear(ref(get(state, 2))));
    const ended = remove(hidden, 0, "SCRIPT");
    assert.deepEqual(sweep(ended.battlefield, circle(0.25), [-1, 0], [3, 0]), []);
});
