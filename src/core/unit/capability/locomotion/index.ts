export {
    hasLocomotion,
    initialize,
    setRestriction,
    removeRestriction,
    setMode,
    setTarget,
    setSpeedContribution,
    removeSpeedContribution,
    setSpeedRange,
    clearSpeedRange,
} from "./capability.js";

export type {
    Definition,
    RestrictionContext,
    Restriction,
    Input,
    Initial,
    State,
    Locomotion,
    MovementTarget,
} from "./capability.js";

export { advance } from "./operations.js";

export { isMoving } from "./query.js";

export type { SteeringParameters } from "./steering.js";
