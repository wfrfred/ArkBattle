export type { Definition, Input, State } from "./deployment.js";

export { initialize, changeDp } from "./deployment.js";

export type {
    Id as CardId,
    Supply,
    Input as CardInput,
    Definition as CardDefinition,
    Cooldown as CardCooldown,
    Card,
} from "./card.js";

export { operatorSupply, resolveBaseCost, resolveCost, resolveRedeployTicks } from "./card.js";

export type { DeploymentRequest, DeploymentDecision } from "./query.js";

export { getCard, usedSlots, evaluateDeployment } from "./query.js";

export { addCard, advance } from "./resources.js";

export { recordUnitDeployment, refundUnit, recycleUnitCard, notifyDeployed } from "./lifecycle.js";

export type { DeployRequest, DeploymentCommand, Rejection, DeployOutcome } from "./operations.js";

export { deploy, retreat, resolveDeploymentCommands } from "./operations.js";
