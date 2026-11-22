export type { Id, UnitDefinition, Clock, Recovery, TimerTarget, Card } from "./card.js";

export type { Definition, Refund } from "./definition.js";

export type { RestrictionContext, Purpose, Restriction } from "./restriction.js";

export { ref } from "./card.js";

export { initialize, type Input } from "./initialize.js";

export { get, all, allows } from "./query.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./state.js";

export {
    add,
    setState,
    recharge,
    consume,
    incrementCostStage,
    startCooldown,
    enqueueRecovery,
    reduceCooldown,
    clearCooldown,
    pauseCooldown,
    resumeCooldown,
    setUnitHook,
    removeUnitHook,
    setRestriction,
    removeRestriction,
    setCostContribution,
    removeCostContribution,
    setRedeployTimeContribution,
    removeRedeployTimeContribution,
} from "./operations.js";
