import { Vec2 } from "../../common/vector.js";

import { Direction } from "../../geometry/direction.js";
import { Map, type Cell } from "../navigation/map.js";
import type { MotionMode } from "../navigation/state.js";
import { contains, type Map as TileMap } from "./map.js";
import type { Passability } from "./tile.js";

function includesMode(mask: Passability, mode: MotionMode): boolean {
    return mask === "ALL" || mask === (mode === "WALK" ? "WALK_ONLY" : "FLY_ONLY");
}

export function create(map: TileMap, mode: MotionMode): Map {
    const cells: Cell[] = [
        ...map.tiles.values().map((tile): Cell => ({
            passable: includesMode(tile.state.passability, mode),
            cost: mode === "WALK" ? tile.state.walkCost : 1,
            departures: { UP: true, RIGHT: true, DOWN: true, LEFT: true },
        })),
    ];

    for (const edge of map.blockEdges) {
        if (!includesMode(edge.blockMask, mode)) {
            continue;
        }

        const adjacent = Vec2.add(edge.position, Direction.vector(edge.direction));

        for (const [position, direction] of [
            [edge.position, edge.direction],
            [adjacent, Direction.opposite(edge.direction)],
        ] as const) {
            if (!contains(map, position)) {
                continue;
            }

            const index = position[0] * map.columns + position[1];
            const cell = cells[index]!;

            cells[index] = {
                ...cell,
                departures: { ...cell.departures, [direction]: false },
            };
        }
    }

    return new Map(map.rows, map.columns, cells);
}
