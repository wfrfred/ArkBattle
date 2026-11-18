import type { Restriction as BaseRestriction } from "../../restriction.js";
import type { DeployRequest } from "./request.js";

export interface RestrictionContext {
    readonly request: DeployRequest;
}

export type Restriction = BaseRestriction<RestrictionContext>;
