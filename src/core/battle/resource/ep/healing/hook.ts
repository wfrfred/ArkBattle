import type { Unit } from "../../../../unit/unit.js";
import type { Elemental } from "../../../../unit/capability/elemental/capability.js";
import * as hooks from "../../../../hook.js";
import type { Application, Calculated, Parameters, Pending, Request } from "./contract.js";

export interface Context {
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

export type SourceFormulaHook = hooks.Hook<Context, Parameters>;

export type TargetFormulaHook = hooks.Hook<Context, Parameters>;

export type OutputHook = hooks.Hook<Context, number>;

export type ReceivingHook = hooks.Hook<ReceivingContext, Pending>;

export type BeforeCommitHook = hooks.Hook<CommitContext, void>;

export type AppliedHook = hooks.Hook<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>(
    "resource.ep.healing.sourceFormula",
);

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Elemental>(
    "resource.ep.healing.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.ep.healing.output");

export const beforeReceive = hooks.key<ReceivingHook, Unit & Elemental>(
    "resource.ep.healing.beforeReceive",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.ep.healing.beforeCommit");

export const targetApplied = hooks.key<AppliedHook, Unit & Elemental>(
    "resource.ep.healing.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.ep.healing.sourceApplied");

export { dispatch } from "../../hook.js";
