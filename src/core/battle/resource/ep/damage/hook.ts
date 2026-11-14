import type { Unit } from "../../../../unit/unit.js";
import type { Elemental, Type } from "../../../../unit/capability/elemental/capability.js";
import type * as receivingProtocol from "../../receiving.js";
import type { Entry } from "../../hook.js";
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

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>("resource.ep.damage.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Elemental>(
    "resource.ep.damage.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.ep.damage.output");

export const beforeReceive = hooks.key<BeforeReceiveHook, Unit & Elemental>(
    "resource.ep.damage.beforeReceive",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.ep.damage.beforeCommit");

export const targetApplied = hooks.key<AppliedHook, Unit & Elemental>(
    "resource.ep.damage.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.ep.damage.sourceApplied");

export const receiving = hooks.key<ReceivingHook, Unit & Elemental>("resource.ep.damage.receiving");

export { dispatch } from "../../hook.js";
