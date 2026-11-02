export type { Id, UnitDefinition, Clock, Recovery, TimerTarget, Card } from "./card.js";

export type { Definition, Refund } from "./definition.js";

export type { RuleContext, Purpose, Rule } from "./rule.js";

export { ref } from "./card.js";

export { get, all, allows } from "./query.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./state.js";

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
    setRule,
    removeRule,
    setCostContribution,
    removeCostContribution,
    setRedeployTimeContribution,
    removeRedeployTimeContribution,
} from "./operations.js";
