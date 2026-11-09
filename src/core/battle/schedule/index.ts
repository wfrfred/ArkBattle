export type {
    UnitDefinition,
    Spawn,
    Wait,
    Definition,
    Wave,
    Fragment,
    Branch,
    BranchPhase,
    Entry,
    WeightedSpawns,
} from "./definition.js";

export type { State, MainProgress, ActivePhase } from "./state.js";

export { initialize } from "./state.js";

export { advance, triggerBranch, resolveUnits, leaveHook } from "./runtime.js";

export { isCompleted, timing } from "./query.js";
