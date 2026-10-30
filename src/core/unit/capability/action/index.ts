export {
    hasAction,
    hasActionDefinition,
    initialize,
    setRule,
    removeRule,
    setBeforeReleaseHook,
    removeBeforeReleaseHook,
    setReleasedHook,
    removeReleasedHook,
} from "./capability.js";

export type { Definition, Rule, Input, State, Action } from "./capability.js";

export { beforeRelease, released } from "./release.js";

export type { Directive, Context, BeforeReleaseHook, ReleasedHook } from "./release.js";

export { resolveSpeed, resolveBaseInterval, resolveInterval, period } from "./timing.js";

export {
    setIntervalContribution,
    removeIntervalContribution,
    setSpeedContribution,
    removeSpeedContribution,
} from "./operations.js";
