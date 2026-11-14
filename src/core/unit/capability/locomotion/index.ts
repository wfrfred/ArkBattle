export {
    hasLocomotion,
    initialize,
    setRestriction,
    removeRestriction,
    setSpeedContribution,
    removeSpeedContribution,
} from "./capability.js";

export type {
    Definition,
    RestrictionContext,
    Restriction,
    Input,
    State,
    Locomotion,
    MovementTarget,
    MovementContext,
} from "./capability.js";

export { advance } from "./operations.js";

export type { SteeringParameters } from "./steering.js";
