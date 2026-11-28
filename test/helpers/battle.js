import { initialize } from "../../dist/core/battle/runtime.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { all } from "../../dist/core/unit/query.js";
import { normal } from "../../dist/content/terrain/definition.js";

export function battle(initialUnits = [], { rows = 3, columns = 8, ...options } = {}) {
    const definition = {
        terrain: normal.create({}),
        initial: {
            elevation: "LOWLAND",
            placement: "ALL",
            passability: "ALL",
            walkCost: 1,
            allowsBlocking: true,
            siteCondition: null,
            collision: null,
        },
    };
    const tiles = Array.from({ length: rows * columns }, () => createTile(definition)).reduce(
        (entries, tile) => entries.add(tile),
        Tiles.empty(),
    );
    return initialize({
        map: createMap(rows, columns, tiles, [], []),
        initialEffects: [],
        initialUnits: initialUnits.map(unit => ({ statistics: null, ...unit })),
        schedule: { waves: [], branches: {} },
        moveMultiplier: 1,
        pushMultiplier: 0.5,
        deployment: null,
        initialCards: [],
        rngState: 7,
        ...options,
    });
}

export function get(state, id) {
    return all(state).find((unit) => unit.ref.id === id);
}
