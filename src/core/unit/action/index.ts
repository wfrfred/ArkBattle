export { ref } from "./action.js";

export type { Action } from "./action.js";

export { ref as executionRef } from "./execution.js";

export type { Execution, View as ExecutionView } from "./execution.js";

export type { Definition } from "./definition.js";

export type { Signal } from "./event.js";

export { create, createActions } from "./initialize.js";

export { all, forUnit, getAction, getExecution, isCasting } from "./query.js";

export {
    start,
    updateExecution,
    updateState,
    updateCooldown,
    cancel,
    cancelForUnit,
    refreshCooldowns,
    resetCooldown,
    clearCooldown,
} from "./operations.js";

export type { StartOutcome } from "./operations.js";

export { advance } from "./advance.js";
