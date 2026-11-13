export type { Definition, Input, State } from "./deployment.js";

export { initialize, changeDp } from "./deployment.js";

export type { Id as CardId, Clock as CardClock, Card } from "./card/card.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./card/state.js";

export type { Quote, DeployRequest, DeployOutcome, Rejection, Rejected } from "./request.js";

export type { Rule, RuleContext } from "./rule.js";

export type { Hook, Deployed } from "./hook.js";

export { setHook, removeHook } from "./hook.js";

export {
    cardForUnit,
    activeCount,
    createRequest,
    evaluate,
    preview,
    positions,
    defaultRules,
} from "./query.js";

export { addCard, advance } from "./resources.js";

export type { DeploymentCommand } from "./operations.js";

export { deploy, resolveDeploymentCommands } from "./operations.js";

export { retreat, canRetreat } from "../../unit/capability/deployable/operations.js";

export * as dp from "./dp.js";

export type { Ordering } from "./order.js";

export { ordered, setOrdering, refreshOrder } from "./order.js";
