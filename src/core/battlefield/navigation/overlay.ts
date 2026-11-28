import type { Identified } from "../../common/ref.js";
import type { TilePosition } from "../../geometry/coordinate.js";
import type { Direction } from "../../geometry/direction.js";
import { Map } from "./map.js";
import type { MotionMode } from "./state.js";

export interface Input {
    readonly cells: readonly TilePosition[];
    readonly denyPassage: boolean;
    readonly denyDepartures: readonly Direction[];
    readonly cost: number;
}

export interface Overlay extends Identified<{ readonly mode: MotionMode }>, Input {}

export function apply(base: Map, overlays: readonly Overlay[]): Map {
    const cells = base.cells.slice();
    let changed = false;

    for (const overlay of overlays) {
        for (const position of overlay.cells) {
            if (!base.contains(position)) {
                continue;
            }

            const index = position[1] * base.columns + position[0];
            const cell = cells[index]!;
            let departures = cell.departures;

            for (const direction of overlay.denyDepartures) {
                if (departures[direction]) {
                    departures = { ...departures, [direction]: false };
                }
            }

            const passable = cell.passable && !overlay.denyPassage;
            const cost = Math.max(cell.cost, overlay.cost);
            if (
                passable !== cell.passable ||
                cost !== cell.cost ||
                departures !== cell.departures
            ) {
                cells[index] = { passable, cost, departures };
                changed = true;
            }
        }
    }

    return changed ? new Map(base.rows, base.columns, cells) : base;
}
