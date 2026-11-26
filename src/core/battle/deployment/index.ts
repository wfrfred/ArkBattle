export type { Definition, Input, DeploymentRecord, State } from "./deployment.js";

export { initialize } from "./deployment.js";

export type { Card } from "./deck/card/card.js";

export { resolveCooldown } from "./deck/card/supply/query.js";

export type { Quote, DeployRequest, DeployOutcome, Rejection, Rejected } from "./request.js";

export type { Restriction, RestrictionContext } from "./restriction.js";

export {
    cardForUnit,
    sourceIdentity,
    deployedCount,
    createRequest,
    evaluate,
    preview,
    positions,
    defaultRestrictions,
} from "./query.js";

export type { DeploymentCommand } from "./operations.js";

export { advance, deploy, resolveDeploymentCommands } from "./operations.js";

export { retreat, canRetreat } from "../../unit/capability/deployable/operations.js";

export * as dp from "./dp/index.js";

export * as slot from "./slot/index.js";
