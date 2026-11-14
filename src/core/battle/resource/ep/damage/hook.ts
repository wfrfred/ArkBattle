import type * as receiving from "../../receiving.js";
import type { Entry } from "../../hook.js";
import type { Type } from "../../../../unit/capability/elemental/capability.js";
import * as hooks from "../../../../hook.js";
import type { Application, Calculated, Parameters, Pending, Reason, Request } from "./contract.js";

export interface Context {
    readonly target: Request["target"];
    readonly request: Request;
}

export interface OutputContext extends Context {
    readonly type: Type;
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

export type OutputHook = Entry<OutputContext, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export type ReceivingHook = receiving.ReceivingHook<ReceivingContext, Reason>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook>("resource.ep.damage.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook>("resource.ep.damage.targetFormula");

export const output = hooks.key<OutputHook>("resource.ep.damage.output");

export const beforeReceive = hooks.key<BeforeReceiveHook>("resource.ep.damage.beforeReceive");

export const beforeCommit = hooks.key<BeforeCommitHook>("resource.ep.damage.beforeCommit");

export const targetApplied = hooks.key<AppliedHook>("resource.ep.damage.targetApplied");

export const sourceApplied = hooks.key<AppliedHook>("resource.ep.damage.sourceApplied");

export { dispatch } from "../../hook.js";
