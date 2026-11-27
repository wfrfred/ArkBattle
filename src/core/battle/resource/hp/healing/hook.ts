import type { Pending, Reason } from "../increase.js";
import type * as receivingProtocol from "../../receiving.js";
import type { Unit } from "../../../../unit/unit.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";
import * as hooks from "../../../../hook.js";
import type { Application, Calculated, Outcome, Parameters, Request } from "./contract.js";

export interface Context {
    readonly request: Request;
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

export interface CompletedContext extends Context {
    readonly calculated: Calculated | undefined;
    readonly outcome: Outcome;
}

export type SourceFormulaHook = hooks.Hook<Context, Parameters>;

export type TargetFormulaHook = hooks.Hook<Context, Parameters>;

export type OutputHook = hooks.Hook<Context, number>;

export type AppliedHook = hooks.Hook<AppliedContext, void>;

export type CompletedHook = hooks.Hook<CompletedContext, void>;

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>(
    "resource.hp.healing.sourceFormula",
);

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Vitality>(
    "resource.hp.healing.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.hp.healing.output");

export const beforeReceive = hooks.key<ReceivingHook, Unit & Vitality>(
    "resource.hp.healing.beforeReceive",
);

export const targetApplied = hooks.key<AppliedHook, Unit & Vitality>(
    "resource.hp.healing.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.hp.healing.sourceApplied");

export const completed = hooks.key<CompletedHook, Unit>("resource.hp.healing.completed");

export { dispatch } from "../../hook.js";
