// Contract: [battlefield](../../docs/architecture/battlefield.md).
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
import { update as updateBattleTile } from "../../dist/core/battle/tile.js";
import * as overlays from "../../dist/core/battle/overlay.js";
import { nextPoint } from "../../dist/core/battlefield/navigation/state.js";
import { within, overlap, sweep } from "../../dist/core/battlefield/spatial/query.js";
import { disappear } from "../../dist/core/unit/capability/presence/operations.js";
import { remove, update } from "../../dist/core/unit/operations.js";

test("a field batch publishes final occupancy without moving bodies or executing lifecycle programs", () => {
    const notices = [];
    const definition = (id) => ({
        id,
        occupancy: { slot: "OCCUPANT" },
        hooks: Hooks.empty().set(unitLifecycle.entered, {
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

test("fractional tile addresses cannot alias an integer tile", () => {
    const dimensions = { rows: 2, columns: 2 };
    const tile = [0.5, 0];
    const state = battle([], dimensions);
    assert.equal(getTile(state.battlefield.map, tile), undefined);

    assert.throws(() => battle([{
        definition: { id: "occupant", hooks: Hooks.empty(), occupancy: { slot: "OCCUPANT" } },
        position: [0, 0],
        initial: { occupancy: { tile } },
    }], dimensions), RangeError);

    const covered = overlays.create(state, "WALK", {
        cells: [tile],
        denyPassage: true,
        denyDepartures: [],
    });
    assert.deepEqual(nextPoint(covered.state.battlefield.navigation, "WALK", [0, 0], [1, 0]), [1, 0]);
});

test("navigation follows current tile costs, directional restrictions and independent overlays", () => {
    const original = battle([], { rows: 1, columns: 3 });

    const blocked = { cells: [[0, 1]], denyPassage: true, denyDepartures: [] };
    const first = overlays.create(original, "WALK", blocked);
    const second = overlays.create(first.state, "WALK", { ...blocked, cost: 7 });
    assert.deepEqual(nextPoint(second.state.battlefield.navigation, "FLY", [0, 0], [2, 0]), [2, 0]);
    const flight = overlays.create(second.state, "FLY", blocked);

    const covered = overlays.remove(flight.state, first.value);
    assert.equal(nextPoint(covered.battlefield.navigation, "WALK", [0, 0], [2, 0]), null);
    const direction = overlays.update(covered, second.value, {
        cells: [[0, 0]],
        denyPassage: false,
        denyDepartures: ["RIGHT"],
    });
    const tile = getTile(direction.battlefield.map, [0, 1]);
    const changed = updateBattleTile(direction, [0, 1], { ...tile.state, walkCost: 5 });
    const navigation = changed.battlefield.navigation;
    assert.equal(nextPoint(navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(navigation, "WALK", [2, 0], [0, 0]), [0, 0]);
    assert.equal(nextPoint(navigation, "FLY", [0, 0], [2, 0]), null);

    const walkOpened = overlays.remove(changed, second.value);
    assert.deepEqual(nextPoint(walkOpened.battlefield.navigation, "WALK", [0, 0], [2, 0]), [2, 0]);
    assert.equal(nextPoint(walkOpened.battlefield.navigation, "FLY", [0, 0], [2, 0]), null);
    const open = overlays.remove(walkOpened, flight.value);
    const replacement = overlays.create(open, "WALK", blocked);
    const staleRemoval = overlays.remove(replacement.state, first.value);
    assert.equal(nextPoint(staleRemoval.battlefield.navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(original.battlefield.navigation, "WALK", [0, 0], [2, 0]), [2, 0]);

    const closed = updateTile(open.battlefield, [0, 1], { ...tile.state, passability: "FLY_ONLY" });
    assert.equal(nextPoint(closed.navigation, "WALK", [0, 0], [2, 0]), null);
    assert.deepEqual(nextPoint(closed.navigation, "FLY", [0, 0], [2, 0]), [2, 0]);

    let fork = battle([], { rows: 3, columns: 3 }).battlefield;
    fork = updateTile(fork, [1, 1], {
        ...getTile(fork.map, [1, 1]).state,
        passability: "FLY_ONLY",
    });
    fork = updateTile(fork, [2, 1], { ...getTile(fork.map, [2, 1]).state, walkCost: 5 });
    assert.ok(nextPoint(fork.navigation, "WALK", [0, 1], [2, 1])[1] < 1);
    for (const position of [
        [0, 0],
        [0, 1],
        [0, 2],
    ]) {
        fork = updateTile(fork, position, { ...getTile(fork.map, position).state, walkCost: 5 });
    }
    assert.ok(nextPoint(fork.navigation, "WALK", [0, 1], [2, 1])[1] > 1);
    assert.deepEqual(nextPoint(fork.navigation, "FLY", [0, 1], [2, 1]), [2, 1]);
});

test("spatial queries distinguish body position from hitboxes and return current geometric contacts", () => {
    const circle = (radius) => ({ type: "CIRCLE", offset: [0, 0], radius });
    const duringRemoval = [];
    const state = battle([
        {
            definition: {
                id: "offset",
                hooks: Hooks.empty().set(unitLifecycle.removing, {
                    id: "check-contact",
                    invoke(current, { unit }) {
                        duringRemoval.push({
                            lifecycle: get(current, unit.id).lifecycle,
                            contacts: sweep(current.battlefield, circle(0.25), [-1, 0], [3, 0]),
                        });
                        return { state: current, value: undefined };
                    },
                }),
                hitbox: { shape: { ...circle(0.5), offset: [2, 0] } },
            },
            position: [0, 0],
        },
        { definition: { id: "body", hooks: Hooks.empty() }, position: [2, 0] },
        {
            definition: {
                id: "near",
                hooks: Hooks.empty(),
                presence: {},
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
        contacts.map(({ target, fraction }) => [target.id, fraction]),
        [[2, 0.125], [0, 0.5625]],
    );

    const hidden = update(state, ref(get(state, 2)), disappear());
    remove(hidden, ref(get(hidden, 0)), { reason: "SCRIPT" });
    assert.deepEqual(duringRemoval, [{ lifecycle: "ENDING", contacts: [] }]);
});
