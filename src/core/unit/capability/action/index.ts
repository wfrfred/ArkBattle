export { hasAction, initialize, setRestriction, removeRestriction } from "./capability.js";

export type {
    Definition,
    RestrictionContext,
    Restriction,
    Input,
    State,
    Action,
} from "./capability.js";

export { beforeRelease, released, dispatchBeforeRelease, dispatchReleased } from "./release.js";

export type { Directive, Context, BeforeReleaseHook, ReleasedHook } from "./release.js";

export { resolveSpeed, resolveBaseInterval, resolvePeriod, period } from "./timing.js";

export {
    setIntervalContribution,
    removeIntervalContribution,
    setSpeedContribution,
    removeSpeedContribution,
} from "./operations.js";
