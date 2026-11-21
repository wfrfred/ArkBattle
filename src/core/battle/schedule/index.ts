export type {
    UnitDefinition,
    Spawn,
    Wait,
    Operation,
    Definition,
    Wave,
    Fragment,
    Branch,
    BranchPhase,
    Entry,
    WeightedEntries,
} from "./definition.js";

export type { State, MainProgress, ActivePhase } from "./state.js";

export { initialize } from "./state.js";

export { advance, triggerBranch, releaseFromWave, resolveUnits, removedHook } from "./runtime.js";

export { isCompleted, timing } from "./query.js";
