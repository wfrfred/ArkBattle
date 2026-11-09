import type { Id as UnitId } from "../../unit/unit.js";
import type { BranchPhase, Definition, Spawn } from "./definition.js";

export interface State {
    readonly definition: Definition;
    readonly waveIndex: number;
    readonly waveStartTick: number;
    readonly fragmentStartTick: number;
    readonly main: MainProgress;
    readonly nextPhaseIndices: Readonly<Record<string, number>>;
    readonly activePhases: readonly ActivePhase[];
    readonly waiting: {
        readonly wave: readonly UnitId[];
        readonly final: readonly UnitId[];
    };
}

export type MainProgress =
    | { readonly type: "PRE_DELAY" }
    | { readonly type: "FRAGMENT"; readonly fragmentIndex: number }
    | { readonly type: "WAITING"; readonly startTick: number }
    | { readonly type: "POST_DELAY"; readonly startTick: number }
    | { readonly type: "COMPLETED" };

export interface ActivePhase {
    readonly phase: BranchPhase;
    readonly startTick: number;
    readonly spawns: readonly Spawn[];
}

export function initialize(definition: Definition): State {
    return {
        definition,
        waveIndex: 0,
        waveStartTick: 0,
        fragmentStartTick: 0,
        main: { type: definition.waves.length === 0 ? "COMPLETED" : "PRE_DELAY" },
        nextPhaseIndices: Object.fromEntries(Object.keys(definition.branches).map((id) => [id, 0])),
        activePhases: [],
        waiting: { wave: [], final: [] },
    };
}
