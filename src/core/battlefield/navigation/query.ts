import type { TilePosition } from "../../geometry/coordinate.js";
import { effectiveMap, field } from "./cache.js";
import type { Field } from "./field.js";
import type { MotionMode, State } from "./state.js";

export { effectiveMap } from "./cache.js";

function reachableField(
    state: State,
    mode: MotionMode,
    from: TilePosition,
    to: TilePosition,
): Field | null {
    const map = effectiveMap(state, mode);
    if (!map.contains(from) || map.get(to)?.passable !== true) {
        return null;
    }

    const result = field(map, to);

    return result.nodes[from[1] * result.columns + from[0]] === null ? null : result;
}

export function nextTile(
    state: State,
    mode: MotionMode,
    from: TilePosition,
    to: TilePosition,
): TilePosition | null {
    const result = reachableField(state, mode, from, to);

    return result === null ? null : (result.nodes[from[1] * result.columns + from[0]]!.next ?? to);
}

export function path(
    state: State,
    mode: MotionMode,
    from: TilePosition,
    to: TilePosition,
): Iterable<TilePosition> | null {
    const result = reachableField(state, mode, from, to);
    if (result === null) {
        return null;
    }

    return {
        *[Symbol.iterator]() {
            let tile: TilePosition | null = from;

            while (tile !== null) {
                yield tile;
                tile = result.nodes[tile[1] * result.columns + tile[0]]!.next;
            }
        },
    };
}
