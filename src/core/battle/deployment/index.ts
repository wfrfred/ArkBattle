export type { Definition, Input, State } from "./deployment.js";

export { initialize, changeDp } from "./deployment.js";

export type {
    Id as CardId,
    Supply,
    Input as CardInput,
    Cooldown as CardCooldown,
    Card,
} from "./card/card.js";

export { operatorSupply } from "./card/card.js";

export { resolveBaseCost, resolveCost, resolveRedeployTicks } from "./card/state.js";

export type { DeploymentRequest, DeploymentDecision } from "./query.js";

export { usedSlots, evaluateDeployment } from "./query.js";

export { addCard, advance } from "./resources.js";

export { notifyDeployed } from "./lifecycle.js";

export type { DeployRequest, DeploymentCommand, Rejection, DeployOutcome } from "./operations.js";

export { deploy, retreat, resolveDeploymentCommands } from "./operations.js";
