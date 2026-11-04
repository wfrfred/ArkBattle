export { hasRoute, initialize, isCompleted, pathMotionMode } from "./capability.js";

export type {
    Definition,
    Checkpoint,
    CheckpointState,
    Phase,
    Progress,
    State,
    Route,
    Event,
} from "./capability.js";

export { setPathMotionMode, setAlternative, clearAlternative, advance } from "./operations.js";

export { movementTarget } from "./query.js";
