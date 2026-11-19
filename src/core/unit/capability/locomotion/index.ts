export {
    hasLocomotion,
    initialize,
    setRestriction,
    removeRestriction,
    setSpeedContribution,
    removeSpeedContribution,
    setSpeedRange,
    clearSpeedRange,
    isUnbalanced,
    resolveMassLevel,
    setMassLevelContribution,
    removeMassLevelContribution,
    setMassLevelRange,
    clearMassLevelRange,
    setForceRestriction,
    removeForceRestriction,
} from "./capability.js";

export type {
    Definition,
    BodyDefinition,
    RestrictionContext,
    Restriction,
    Input,
    State,
    Locomotion,
    MovementTarget,
    MovementContext,
} from "./capability.js";

export { advance } from "./operations.js";

export {
    applyImpulse,
    beginPull,
    continuePull,
    endPull,
    addForce,
    setUnbalanceVelocity,
    pullLifetime,
    unbalanceLifetime,
} from "./unbalance.js";

export type { Pull, Unbalance } from "./unbalance.js";

export { forcedMoved } from "./hook.js";

export type { ForcedMovement } from "./hook.js";

export type { SteeringParameters } from "./steering.js";
