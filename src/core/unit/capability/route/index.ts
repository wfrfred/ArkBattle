export { hasRoute, initialize, isCompleted, motionMode } from "./capability.js";

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

export { setMotionMode, setAlternative, clearAlternative, advance } from "./operations.js";

export { movementTarget } from "./query.js";
