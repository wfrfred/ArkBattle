export type { Id, UnitDefinition, Card } from "./card.js";

export type { Definition } from "./definition.js";

export type { Refund } from "./dp.js";

export type { Clock, Recovery, TimerTarget } from "./supply.js";

export type { RestrictionContext, Purpose, Restriction } from "./restriction.js";

export { ref } from "./card.js";

export { initialize, type Input } from "./initialize.js";

export { all, get } from "../deck.js";

export { add } from "../operations.js";

export { allows } from "./query.js";

export { resolveBaseCost, resolveCost } from "./dp.js";

export { resolveRedeployTicks } from "./supply.js";

export {
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
