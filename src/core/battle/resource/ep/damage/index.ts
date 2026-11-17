export type { Options, Exclusion } from "../../../../hook.js";

export type { AttackType, ApplyWay } from "../../damage.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";

export type { ApplyOptions } from "./apply.js";

export { fix, cancel } from "./contract.js";

export type {
    Event,
    Nature,
    Request,
    Parameters,
    Calculated,
    Reason,
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
    receiving,
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
    ReceivingHook,
    BeforeCommitHook,
    AppliedHook,
} from "./hook.js";
