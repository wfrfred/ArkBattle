export { ref } from "./action.js";

export type { Action } from "./action.js";

export { ref as executionRef } from "./execution.js";

export type { Execution } from "./execution.js";

export type { Definition, Period } from "./definition.js";

export type { Event } from "./event.js";

export { create, createActions } from "./initialize.js";

export { forUnit, getAction, getExecution, getApplyWay, isCasting } from "./query.js";

export {
    lifetime,
    start,
    setExecutionState,
    setState,
    setCooldown,
    cancel,
    cancelForUnit,
    resetCooldown,
    clearCooldown,
    advance,
} from "./operations.js";

export { hasAction, initialize, setRestriction, removeRestriction } from "./capability.js";

export type {
    Definition as CapabilityDefinition,
    RestrictionContext,
    Restriction,
    Input,
    State as CapabilityState,
    Action as ActionCapability,
} from "./capability.js";

export { beforeRelease, released, dispatchBeforeRelease, dispatchReleased } from "./release.js";

export type { Directive, Context, BeforeReleaseHook, ReleasedHook } from "./release.js";

export {
    resolveSpeed,
    resolveBaseInterval,
    resolveAttackPeriod,
    resolvePeriod,
    period,
} from "./timing.js";

export {
    setIntervalContribution,
    removeIntervalContribution,
    setSpeedContribution,
    removeSpeedContribution,
    setIntervalRange,
    clearIntervalRange,
    setSpeedRange,
    clearSpeedRange,
} from "./attributes.js";
