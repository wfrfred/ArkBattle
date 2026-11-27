export { ref } from "../../../common/ref.js";

export type { Action } from "./action.js";

export type { Execution, ExecutionRef } from "./execution.js";

export type { Definition, Period } from "./definition.js";

export type { Event } from "./event.js";

export { forUnit, resolveApplyWay, hasExecution } from "./query.js";

export {
    start,
    setExecutionState,
    setState,
    setCooldown,
    finish,
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
