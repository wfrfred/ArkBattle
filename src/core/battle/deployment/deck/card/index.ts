export type { Id, UnitDefinition, Card } from "./card.js";

export type { Definition } from "./definition.js";

export type { Refund } from "./dp.js";

export type { Policy } from "./supply/supply.js";

export type { RestrictionContext, Purpose, Restriction } from "./restriction.js";

export { ref } from "./card.js";

export { initialize, type Input } from "./initialize.js";

export { all, get } from "../deck.js";

export { add } from "../operations.js";

export { allows } from "./query.js";

export { resolveBaseCost, resolveCost } from "./dp.js";

export { isReady, resolveStockLimit, resolveActiveLimit, resolveCooldown } from "./supply/query.js";

export {
    setState,
    incrementCostStage,
    setUnitHook,
    removeUnitHook,
    setRestriction,
    removeRestriction,
    setCostContribution,
    removeCostContribution,
} from "./operations.js";

export {
    recharge,
    consume,
    setCooldown,
    enqueueRecovery,
    reduceCooldown,
    setPaused,
    setStockLimitContribution,
    removeStockLimitContribution,
    setActiveLimitContribution,
    removeActiveLimitContribution,
    setRedeployTimeContribution,
    removeRedeployTimeContribution,
} from "./supply/operations.js";
