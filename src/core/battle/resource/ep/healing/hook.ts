import type { Entry } from "../../hook.js";
import * as hooks from "../../../../hook.js";
import type { Application, Calculated, Parameters, Pending, Request } from "./contract.js";

export interface Context {
    readonly target: Request["target"];
    readonly request: Request;
}

export interface ReceivingContext extends Context {
    readonly calculated: Calculated;
}

export interface CommitContext extends ReceivingContext {
    readonly received: Pending;
}

export interface AppliedContext extends CommitContext {
    readonly application: Application;
}

export type SourceFormulaHook = Entry<Context, Parameters>;

export type TargetFormulaHook = Entry<Context, Parameters>;

export type OutputHook = Entry<Context, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook>("resource.ep.healing.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook>("resource.ep.healing.targetFormula");

export const output = hooks.key<OutputHook>("resource.ep.healing.output");

export const beforeReceive = hooks.key<BeforeReceiveHook>("resource.ep.healing.beforeReceive");

export const beforeCommit = hooks.key<BeforeCommitHook>("resource.ep.healing.beforeCommit");

export const targetApplied = hooks.key<AppliedHook>("resource.ep.healing.targetApplied");

export const sourceApplied = hooks.key<AppliedHook>("resource.ep.healing.sourceApplied");

export { dispatch } from "../../hook.js";
