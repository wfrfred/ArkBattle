export { initialize, hasDeployable, setRestriction, removeRestriction } from "./capability.js";

export type {
    Definition,
    State,
    Deployable,
    RestrictionContext,
    Restriction,
} from "./capability.js";

export { setDeployment, canRetreat, retreat } from "./operations.js";
