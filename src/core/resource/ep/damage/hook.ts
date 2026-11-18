import type { Unit } from "../../../unit/unit.js";
import type { Elemental, Type } from "../../../unit/capability/elemental/capability.js";
import type * as receivingProtocol from "../../receiving.js";
import * as hooks from "../../../hook.js";
import type { Application, Calculated, Parameters, Pending, Reason, Request } from "./contract.js";

export interface Context {
    readonly request: Request;
}

export interface OutputContext extends Context {
    readonly type: Type;
}

export interface ReceivingContext extends Context {
    readonly calculated: Calculated;
    readonly forbidden: ReadonlySet<Reason>;
}

export interface CommitContext extends ReceivingContext {
    readonly received: Pending;
}

export interface AppliedContext extends CommitContext {
    readonly application: Application;
}

export type SourceFormulaHook = hooks.Hook<Context, Parameters>;

export type TargetFormulaHook = hooks.Hook<Context, Parameters>;

export type OutputHook = hooks.Hook<OutputContext, number>;

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export type BeforeCommitHook = hooks.Hook<CommitContext, void>;

export type AppliedHook = hooks.Hook<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>("resource.ep.damage.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Elemental>(
    "resource.ep.damage.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.ep.damage.output");

export const beforeReceive = hooks.key<ReceivingHook, Unit & Elemental>(
    "resource.ep.damage.beforeReceive",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.ep.damage.beforeCommit");

export const targetApplied = hooks.key<AppliedHook, Unit & Elemental>(
    "resource.ep.damage.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.ep.damage.sourceApplied");

export const receiving = hooks.key<ReceivingHook, Unit & Elemental>("resource.ep.damage.receiving");

export { dispatch } from "../../hook.js";
