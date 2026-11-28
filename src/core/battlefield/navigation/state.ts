import type { Ref } from "../../common/ref.js";
import { assertPositiveSafeInteger } from "../../common/assert.js";
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

export function setOverlay(state: State, overlay: Overlay): State {
    const { mode } = overlay.ref;
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

export function removeOverlay(state: State, ref: Ref<Overlay>): State {
    const { mode } = ref;
    const entries = state.overlays[mode];

    return {
        baseline: state.baseline,
        overlays: {
            ...state.overlays,
            [mode]: entries.filter((entry) => entry.ref !== ref),
        },
    };
}
