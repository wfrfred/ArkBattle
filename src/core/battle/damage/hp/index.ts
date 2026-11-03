export type {
    DamageType,
    AttackParameters,
    Penetration,
    Parameters,
    Request,
    Calculated,
    Reason,
    Cancellation,
    Pending,
    Next,
    Application,
    Outcome,
} from "./contract.js";

export { cancel } from "./contract.js";

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
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";
