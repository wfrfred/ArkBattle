export { hasRoute, initialize } from "./capability.js";

export type {
    Definition,
    Plan,
    Destination,
    Initial,
    Checkpoint,
    ActiveCheckpoint,
    Context,
    ContextInput,
    Override,
    State,
    Route,
} from "./capability.js";

export {
    setAlternative,
    addOverride,
    removeContext,
    reassign,
    skipWait,
    setTraceTarget,
    advance,
} from "./operations.js";

export { ref, ordinaryContext, activeContext, movementTarget, remainingDistance } from "./query.js";
