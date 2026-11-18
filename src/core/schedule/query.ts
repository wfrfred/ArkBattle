import type { State } from "./state.js";

export function isCompleted(state: State): boolean {
    return (
        state.main.type === "COMPLETED" &&
        state.activePhases.length === 0 &&
        state.waiting.final.length === 0
    );
}

export function timing(state: State): {
    readonly waveStartTick: number;
    readonly fragmentReadyTick: number;
} {
    let waveIndex = state.waveIndex;
    let fragmentIndex = (state.definition.waves[waveIndex]?.fragments.length ?? 0) - 1;

    if (state.main.type === "FRAGMENT") {
        fragmentIndex = state.main.fragmentIndex;
    } else if (state.main.type === "PRE_DELAY") {
        fragmentIndex = -1;
    }

    while (waveIndex >= 0) {
        const fragment = state.definition.waves[waveIndex]?.fragments[fragmentIndex];

        if (fragment !== undefined) {
            return {
                waveStartTick: state.waveStartTick,
                fragmentReadyTick: state.fragmentStartTick + fragment.preDelayTicks,
            };
        }

        waveIndex--;
        fragmentIndex = (state.definition.waves[waveIndex]?.fragments.length ?? 0) - 1;
    }

    return { waveStartTick: state.waveStartTick, fragmentReadyTick: 0 };
}
