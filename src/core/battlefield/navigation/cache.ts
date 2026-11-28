import type { TilePosition } from "../../geometry/coordinate.js";
import { build, type Field } from "./field.js";
import type { Map as NavigationMap } from "./map.js";
import { apply } from "./overlay.js";
import type { ModeState, MotionMode, State } from "./state.js";

const maps = new WeakMap<ModeState, NavigationMap>();
const fields = new WeakMap<NavigationMap, Map<string, Field>>();

export function effectiveMap(state: State, mode: MotionMode): NavigationMap {
    const modeState = state[mode];
    const cached = maps.get(modeState);
    if (cached !== undefined) {
        return cached;
    }

    const map = apply(modeState.baseline, modeState.overlays);
    maps.set(modeState, map);

    return map;
}

export function field(map: NavigationMap, target: TilePosition): Field {
    let targets = fields.get(map);
    const key = `${target[0]}:${target[1]}`;
    const cached = targets?.get(key);
    if (cached !== undefined) {
        return cached;
    }

    const result = build(map, target);

    if (targets === undefined) {
        targets = new Map();
        fields.set(map, targets);
    }

    targets.set(key, result);

    return result;
}
