import { initialize } from "../../dist/core/battle/runtime.js";
import { create as createMap } from "../../dist/core/battlefield/map/map.js";
import { create as createTile } from "../../dist/core/battlefield/map/tile.js";
import { Tiles } from "../../dist/core/battlefield/map/tiles.js";
import { all } from "../../dist/core/unit/query.js";
import { normal } from "../../dist/content/terrain/definition.js";

export function battle(creations = [], { rows = 3, columns = 8, ...options } = {}) {
    const definition = {
        terrain: normal.create({}),
        initial: {
            elevation: "LOWLAND",
            placement: "ALL",
            passability: "ALL",
            walkCost: 1,
            allowsBlocking: true,
            siteCondition: null,
        },
    };
    const tiles = Array.from({ length: rows * columns }, () => createTile(definition)).reduce(
        (entries, tile) => entries.add(tile),
        Tiles.empty(),
    );
    return initialize({
        map: createMap(rows, columns, tiles),
        initialMechanisms: [],
        predefines: creations.map((creation, id) => ({
            id,
            alias: null,
            initiallyPresent: true,
            creation: { type: "UNIT", ...creation },
        })),
        schedule: { type: "TIMELINE", spawns: [] },
        maxTicks: 1000,
        routeMoveMultiplier: 1,
        rngState: 7,
        ...options,
    });
}

export function get(state, id) {
    return all(state).find((unit) => unit.id === id);
}
