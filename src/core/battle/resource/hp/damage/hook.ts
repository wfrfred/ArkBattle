import type * as receivingProtocol from "../../receiving.js";
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
    DamageType,
} from "./contract.js";

export interface Context {
    readonly target: Ref<Unit & Vitality>;
    readonly request: Request;
}

export interface OutputContext extends Context {
    readonly type: DamageType;
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

export type SourceFormulaHook = Entry<Context, Parameters>;

export type TargetFormulaHook = Entry<Context, Parameters>;

export type OutputHook = Entry<OutputContext, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export type ReceivingStartedHook = Entry<ReceivingContext, void>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export type CompletedHook = Entry<CompletedContext, void>;

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>("resource.hp.damage.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Vitality>(
    "resource.hp.damage.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.hp.damage.output");

export const beforeReceive = hooks.key<BeforeReceiveHook, Unit & Vitality>(
    "resource.hp.damage.beforeReceive",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.hp.damage.beforeCommit");

export const targetApplied = hooks.key<AppliedHook, Unit & Vitality>(
    "resource.hp.damage.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.hp.damage.sourceApplied");

export const completed = hooks.key<CompletedHook, Unit>("resource.hp.damage.completed");

export const receivingStarted = hooks.key<ReceivingStartedHook, Unit & Vitality>(
    "resource.hp.damage.receivingStarted",
);

export const receiving = hooks.key<ReceivingHook, Unit & Vitality>("resource.hp.damage.receiving");

export { dispatch } from "../../hook.js";
