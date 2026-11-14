import type * as receiving from "../../receiving.js";
import type { Entry } from "../../hook.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit } from "../../../../unit/unit.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";
import * as hooks from "../../../../hook.js";
import type {
    Application,
    Calculated,
    Outcome,
    Parameters,
    Pending,
    Reason,
    Request,
} from "./contract.js";

export interface Context {
    readonly target: Ref<Unit & Vitality>;
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

export interface CompletedContext extends Context {
    readonly calculated: Calculated | undefined;
    readonly outcome: Outcome;
}

export type SourceFormulaHook = Entry<Context, Parameters>;

export type TargetFormulaHook = Entry<Context, Parameters>;

export type OutputHook = Entry<Context, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export type CompletedHook = Entry<CompletedContext, void>;

export type ReceivingHook = receiving.ReceivingHook<ReceivingContext, Reason>;

export const sourceFormula = hooks.key<SourceFormulaHook>("resource.hp.healing.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook>("resource.hp.healing.targetFormula");

export const output = hooks.key<OutputHook>("resource.hp.healing.output");

export const beforeReceive = hooks.key<BeforeReceiveHook>("resource.hp.healing.beforeReceive");

export const beforeCommit = hooks.key<BeforeCommitHook>("resource.hp.healing.beforeCommit");

export const targetApplied = hooks.key<AppliedHook>("resource.hp.healing.targetApplied");

export const sourceApplied = hooks.key<AppliedHook>("resource.hp.healing.sourceApplied");

export const completed = hooks.key<CompletedHook>("resource.hp.healing.completed");

export { dispatch } from "../../hook.js";
