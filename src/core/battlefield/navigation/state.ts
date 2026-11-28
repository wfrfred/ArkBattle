import type { Ref } from "../../common/ref.js";
import { assertPositiveSafeInteger } from "../../common/assert.js";
import type { Map } from "./map.js";
import type { Overlay } from "./overlay.js";

export type MotionMode = "WALK" | "FLY";

export interface ModeState {
    readonly baseline: Map;
    readonly overlays: readonly Overlay[];
}

export type State = Readonly<Record<MotionMode, ModeState>>;

export function create(baseline: Readonly<Record<MotionMode, Map>>): State {
    return {
        WALK: { baseline: baseline.WALK, overlays: [] },
        FLY: { baseline: baseline.FLY, overlays: [] },
    };
}

export function setOverlay(state: State, overlay: Overlay): State {
    const { mode } = overlay.ref;
    assertPositiveSafeInteger(overlay.cost, "navigation overlay cost");

    if (mode === "FLY" && overlay.cost !== 1) {
        throw new RangeError("FLY navigation overlay cost must be 1");
    }

    const current = state[mode].overlays;
    const index = current.findIndex((entry) => entry.ref === overlay.ref);
    const entries = [...current];
    if (index === -1) {
        entries.push(overlay);
    } else {
        entries[index] = overlay;
    }

    return {
        ...state,
        [mode]: { ...state[mode], overlays: entries },
    };
}

export function removeOverlay(state: State, ref: Ref<Overlay>): State {
    const { mode } = ref;
    const entries = state[mode].overlays;
    const remaining = entries.filter((entry) => entry.ref !== ref);

    if (remaining.length === entries.length) {
        return state;
    }

    return {
        ...state,
        [mode]: { ...state[mode], overlays: remaining },
    };
}
