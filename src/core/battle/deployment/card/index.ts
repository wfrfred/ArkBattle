export type {
    Id,
    UnitDefinition,
    Supply,
    Initial,
    Input,
    Clock,
    Recovery,
    TimerTarget,
    Card,
} from "./card.js";

export type { Definition } from "./definition.js";

export type { Purpose, Rule } from "./rule.js";

export { ref, operatorSupply } from "./card.js";

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
    setHook,
    removeHook,
    setRule,
    removeRule,
    setCostContribution,
    removeCostContribution,
    setRedeployTimeContribution,
    removeRedeployTimeContribution,
} from "./operations.js";
