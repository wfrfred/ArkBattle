export type { Options, Exclusion } from "../../../../hook.js";

export type {
    Event,
    DamageType,
    Nature,
    AttackParameters,
    Penetration,
    Parameters,
    Request,
    Calculated,
    Reason,
    Pending,
    Next,
    Application,
    Outcome,
} from "./contract.js";

export { fix, cancel } from "./contract.js";

export type {
    Context,
    OutputContext,
    ReceivingContext,
    CommitContext,
    AppliedContext,
    CompletedContext,
    SourceFormulaHook,
    TargetFormulaHook,
    OutputHook,
    BeforeReceiveHook,
    BeforeCommitHook,
    ReceivingHook,
    AppliedHook,
    CompletedHook,
    ReceivingStartedHook,
} from "./hook.js";

export {
    sourceFormula,
    targetFormula,
    output,
    beforeReceive,
    receivingStarted,
    receiving,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";

export type { ApplyOptions } from "./apply.js";
