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

export {
    advance,
    triggerBranch,
    registerWait,
    releaseFromWave,
    resolveUnits,
    removedHook,
} from "./operations.js";

export { isCompleted, timing } from "./query.js";
