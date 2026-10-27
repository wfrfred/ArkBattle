import assert from "node:assert/strict";
import { test } from "node:test";
import { get } from "../../dist/core/battlefield/map/map.js";
import { at } from "../../dist/core/battlefield/occupancy.js";
import { build } from "../../dist/core/battlefield/navigation/field.js";
import { apply } from "../../dist/core/battlefield/navigation/overlay.js";
import { fixtureBattle } from "../helpers/unit.js";

test("out-of-bounds tiles retain empty-query and unreachable-field behavior", () => {
    const field = fixtureBattle().battlefield;
    const navigationMap = field.navigation.baseline.WALK;
    for (const tile of [[-1, 0], [0, field.map.columns], [Number.MAX_SAFE_INTEGER, 0]]) {
        assert.equal(at(field, tile), undefined);
        assert.equal(get(field.map, tile), undefined);
        assert.equal(navigationMap.get(tile), undefined);
        assert.ok(build(navigationMap, tile).nodes.every(node => node === null));
        const overlay = { id: 0, cells: [tile], denyPassage: true, denyDepartures: [] };
        assert.equal(apply(navigationMap, [overlay]), navigationMap);
    }
});
