export { hasRoute, initialize, isCompleted, pathMotionMode } from "./capability.js";

export type {
    Definition,
    Checkpoint,
    CheckpointState,
    Phase,
    Progress,
    State,
    Route,
} from "./capability.js";

export { setPathMotionMode, setAlternative, clearAlternative, advance } from "./operations.js";

export type { Signal } from "./operations.js";

export { movementTarget } from "./query.js";
