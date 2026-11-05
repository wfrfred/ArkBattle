export {
    hasLocomotion,
    initialize,
    setRule,
    removeRule,
    setSpeedContribution,
    removeSpeedContribution,
} from "./capability.js";

export type {
    Definition,
    RuleContext,
    Rule,
    Input,
    State,
    Locomotion,
    MovementTarget,
    MovementContext,
} from "./capability.js";

export { advance } from "./operations.js";

export type { SteeringParameters } from "./steering.js";
