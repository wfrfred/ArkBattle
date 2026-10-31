export type { Id, Program, Definition, Supply, Initial, Input, Cooldown, Card } from "./card.js";

export { ref, operatorSupply } from "./card.js";

export { get, all } from "./query.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./state.js";

export {
    setState,
    recharge,
    reduceCooldown,
    clearCooldown,
    setCostContribution,
    removeCostContribution,
    setRedeployTimeContribution,
    removeRedeployTimeContribution,
} from "./operations.js";
