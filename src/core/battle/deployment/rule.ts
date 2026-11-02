import type { Rule as BaseRule } from "../../rule.js";
import type { DeployRequest } from "./request.js";

export interface RuleContext {
    readonly request: DeployRequest;
}

export type Rule = BaseRule<RuleContext>;
