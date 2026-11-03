export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";

export { cancel } from "./contract.js";

export type {
    Request,
    Parameters,
    Calculated,
    Reason,
    Cancellation,
    Pending,
    Next,
    Application,
    Outcome,
} from "./contract.js";

export {
    sourceFormula,
    targetFormula,
    output,
    beforeReceive,
    beforeCommit,
    targetApplied,
    sourceApplied,
} from "./hook.js";

export type {
    Context,
    OutputContext,
    ReceivingContext,
    CommitContext,
    AppliedContext,
    SourceFormulaHook,
    TargetFormulaHook,
    OutputHook,
    BeforeReceiveHook,
    ReceivingHook,
    BeforeCommitHook,
    AppliedHook,
} from "./hook.js";
