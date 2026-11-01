export type { Definition, Input, State } from "./deployment.js";

export { initialize, changeDp } from "./deployment.js";

export type {
    Id as CardId,
    Supply,
    Input as CardInput,
    Clock as CardClock,
    Card,
} from "./card/card.js";

export { operatorSupply } from "./card/card.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./card/state.js";

export type { DeploymentRequest, DeploymentDecision } from "./query.js";

export { usedSlots, activeCount, evaluateDeployment, preview } from "./query.js";

export { addCard, advance } from "./resources.js";

export { notifyDeployed } from "./lifecycle.js";

export type { DeployRequest, DeploymentCommand, Rejection, DeployOutcome } from "./operations.js";

export { deploy, retreat, canRetreat, resolveDeploymentCommands } from "./operations.js";

export type { Program, Preparation, Payment, Refund, Rejected } from "./program.js";

export { operator, consumable, queued, create as createProgram } from "./normal.js";

export * as dp from "./dp.js";

export type { Ordering } from "./order.js";

export { ordered, setOrdering, refreshOrder } from "./order.js";
