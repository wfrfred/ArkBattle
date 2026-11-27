import type { Ref } from "../../common/ref.js";
import { assertPositiveSafeInteger } from "../../common/assert.js";
import { Vec2 } from "../../common/vector.js";
import { Tile, World, type TilePosition, type WorldPosition } from "../../geometry/coordinate.js";
import { effectiveMap, field } from "./cache.js";
import type { Map } from "./map.js";
import type { Overlay } from "./overlay.js";

export type MotionMode = "WALK" | "FLY";

export interface State {
    readonly baseline: Readonly<Record<MotionMode, Map>>;
    readonly overlays: Readonly<Record<MotionMode, readonly Overlay[]>>;
}

export interface Target {
    readonly tile: TilePosition;
    readonly position: WorldPosition;
}

export function create(baseline: Readonly<Record<MotionMode, Map>>): State {
    return { baseline, overlays: { WALK: [], FLY: [] } };
}

export function setOverlay(state: State, mode: MotionMode, overlay: Overlay): State {
    assertPositiveSafeInteger(overlay.cost, "navigation overlay cost");

    if (mode === "FLY" && overlay.cost !== 1) {
        throw new RangeError("FLY navigation overlay cost must be 1");
    }

    const current = state.overlays[mode];
    const index = current.findIndex((entry) => entry.ref === overlay.ref);
    const entries = [...current];
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

    return {
        baseline: state.baseline,
        overlays: {
            ...state.overlays,
            [mode]: entries.filter((entry) => entry.ref !== ref),
        },
    };
}

export function nextPoint(
    state: State,
    mode: MotionMode,
    current: WorldPosition,
    target: Target,
): WorldPosition | null {
    const map = effectiveMap(state, mode);
    const currentTile = World.toTile(current);
    const targetTile = target.tile;
    if (!map.contains(currentTile) || map.get(targetTile)?.passable !== true) {
        return null;
    }

    const node = field(map, targetTile).nodes[currentTile[0] * map.columns + currentTile[1]];
    if (node === null) {
        return null;
    }

    const next = node!.next;

    return next === null || Vec2.equal(next, targetTile) ? target.position : Tile.center(next);
}

export function distance(
    state: State,
    mode: MotionMode,
    current: WorldPosition,
    target: Target,
): number | null {
    const map = effectiveMap(state, mode);
    const currentTile = World.toTile(current);
    const targetTile = target.tile;
    if (!map.contains(currentTile) || map.get(targetTile)?.passable !== true) {
        return null;
    }

    const nodes = field(map, targetTile).nodes;
    const node = nodes[currentTile[0] * map.columns + currentTile[1]];
    if (node === null) {
        return null;
    }
    if (node!.next === null || Vec2.equal(node!.next, targetTile)) {
        return Vec2.length(Vec2.sub(target.position, current));
    }

    let next = node!.next;
    let position = Tile.center(next);
    const center = Tile.center(currentTile);
    const direction = Vec2.sub(position, center);
    const directionLength = Vec2.length(direction);
    const displacement = Vec2.sub(current, center);
    let remaining =
        directionLength -
        (displacement[0] * direction[0] + displacement[1] * direction[1]) / directionLength;

    while (!Vec2.equal(next, targetTile)) {
        next = nodes[next[0] * map.columns + next[1]]!.next!;
        const following = Vec2.equal(next, targetTile) ? target.position : Tile.center(next);
        remaining += Vec2.length(Vec2.sub(following, position));
        position = following;
    }

    return remaining;
}
