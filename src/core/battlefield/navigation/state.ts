import type { Ref } from "../../common/ref.js";
import { assertNonnegativeSafeInteger, assertPositiveSafeInteger } from "../../common/assert.js";
import { Tile, World, type WorldPosition } from "../../geometry/coordinate.js";
import { effectiveMap, field } from "./cache.js";
import type { Map } from "./map.js";
import type { Overlay } from "./overlay.js";

export type MotionMode = "WALK" | "FLY";

export interface State {
    readonly baseline: Readonly<Record<MotionMode, Map>>;
    readonly overlays: Readonly<Record<MotionMode, readonly Overlay[]>>;
}

export function create(baseline: Readonly<Record<MotionMode, Map>>): State {
    return { baseline, overlays: { WALK: [], FLY: [] } };
}

export function setOverlay(state: State, mode: MotionMode, overlay: Overlay): State {
    assertNonnegativeSafeInteger(overlay.id, "navigation overlay id");

    if (overlay.cost !== undefined) {
        assertPositiveSafeInteger(overlay.cost, "navigation overlay cost");
    }
    if (mode === "FLY" && overlay.cost !== undefined && overlay.cost !== 1) {
        throw new RangeError("FLY navigation overlay cost must be 1");
    }

    const entries = [...state.overlays[mode]];
    const index = entries.findIndex((entry) => entry.id === overlay.id);
    if (index === -1) {
        entries.push(overlay);
    } else {
        entries[index] = overlay;
    }

    return {
        baseline: state.baseline,
        overlays: { ...state.overlays, [mode]: entries },
    };
}

export function removeOverlay(state: State, mode: MotionMode, ref: Ref<Overlay>): State {
    const entries = state.overlays[mode];
    const index = entries.findIndex((entry) => entry.id === ref.id);
    if (index === -1) {
        return state;
    }

    return {
        baseline: state.baseline,
        overlays: {
            ...state.overlays,
            [mode]: entries.filter((_, entryIndex) => entryIndex !== index),
        },
    };
}

export function nextPoint(
    state: State,
    mode: MotionMode,
    current: WorldPosition,
    target: WorldPosition,
): WorldPosition | null {
    const map = effectiveMap(state, mode);
    const currentTile = World.toTile(current);
    const targetTile = World.toTile(target);
    if (!map.contains(currentTile) || map.get(targetTile)?.passable !== true) {
        return null;
    }

    const node = field(map, targetTile).nodes[currentTile[0] * map.columns + currentTile[1]];
    if (node === null) {
        return null;
    }

    const next = node!.next;

    return next === null || (next[0] === targetTile[0] && next[1] === targetTile[1])
        ? target
        : Tile.center(next);
}
