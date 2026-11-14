export { hasAction, initialize, setRule, removeRule } from "./capability.js";

export type { Definition, RuleContext, Rule, Input, State, Action } from "./capability.js";

export { beforeRelease, released, dispatchBeforeRelease, dispatchReleased } from "./release.js";

export type { Directive, Context, BeforeReleaseHook, ReleasedHook } from "./release.js";

export { resolveSpeed, resolveBaseInterval, resolvePeriod, period } from "./timing.js";

export {
    setIntervalContribution,
    removeIntervalContribution,
    setSpeedContribution,
    removeSpeedContribution,
} from "./operations.js";
