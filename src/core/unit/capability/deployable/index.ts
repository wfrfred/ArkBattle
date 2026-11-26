export { initialize, hasDeployable, setRestriction, removeRestriction } from "./capability.js";

export type {
    Definition,
    State,
    Deployable,
    RestrictionContext,
    Restriction,
} from "./capability.js";

export { canRetreat } from "./query.js";

export { setDeployment, retreat } from "./operations.js";
