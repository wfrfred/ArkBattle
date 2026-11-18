export type { Options, Exclusion } from "../../../../hook.js";

export type { AttackType, ApplyWay } from "../../damage.js";

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
    TargetKilledContext,
    SourceFormulaHook,
    TargetFormulaHook,
    OutputHook,
    BeforeCommitHook,
    ReceivingHook,
    AppliedHook,
    CompletedHook,
    TargetKilledHook,
} from "./hook.js";

export {
    sourceFormula,
    targetFormula,
    output,
    beforeReceive,
    receiving,
    beforeCommit,
    targetApplied,
    sourceApplied,
    completed,
    targetKilled,
} from "./hook.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";

export type { ApplyOptions } from "./apply.js";
