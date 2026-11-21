export type { Definition, Input, State } from "./deployment.js";

export { initialize, changeDp } from "./deployment.js";

export type { Id as CardId, Clock as CardClock, Card } from "./card/card.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./card/state.js";

export type { Quote, DeployRequest, DeployOutcome, Rejection, Rejected } from "./request.js";

export type { Restriction, RestrictionContext } from "./restriction.js";

export type { Hook, Deployed } from "./hook.js";

export { deployed, setHook, removeHook } from "./hook.js";

export {
    cardForUnit,
    deployedCount,
    createRequest,
    evaluate,
    preview,
    positions,
    defaultRestrictions,
} from "./query.js";

export { advance } from "./resources.js";

export type { DeploymentCommand } from "./operations.js";

export { deploy, resolveDeploymentCommands } from "./operations.js";

export { retreat, canRetreat } from "../../unit/capability/deployable/operations.js";

export * as dp from "./dp.js";

export type { Ordering } from "./order.js";

export { ordered, setOrdering, refreshOrder } from "./order.js";
