export type { Definition, DeploymentRecord, State } from "./deployment.js";

export { initialize } from "./deployment.js";

export type { Quote, DeployRequest } from "./request.js";

export type { Restriction, RestrictionContext } from "./restriction.js";

export {
    cardForUnit,
    sourceIdentity,
    deployedCount,
    createRequest,
    evaluate,
    canRetreat,
    positions,
    defaultRestrictions,
} from "./query.js";

export type { DeploymentCommand } from "./operations.js";

export { deploy, retreat } from "./operations.js";

export * as dp from "./dp/index.js";

export * as slot from "./slot/index.js";
