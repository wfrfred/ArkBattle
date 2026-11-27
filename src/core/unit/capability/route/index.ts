export { hasRoute, initialize } from "./capability.js";

export type {
    Definition,
    Plan,
    Destination,
    Initial,
    Checkpoint,
    Context,
    ContextInput,
    State,
    Route,
} from "./capability.js";

export {
    createContext,
    removeContext,
    selectContext,
    setTicking,
    reassign,
    skipWait,
    setTraceTarget,
    advance,
} from "./operations.js";

export { ref, activeContext, movementTarget, remainingDistance } from "./query.js";
