export { ref } from "./action.js";

export type { Action, Executing, ExecutingView } from "./action.js";

export type { Definition } from "./definition.js";

export type { Signal } from "./event.js";

export { create, createActions } from "./initialize.js";

export { all, forUnit, get, getAction, isCasting } from "./query.js";

export {
    start,
    update,
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
