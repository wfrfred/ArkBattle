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
    Application,
    Outcome,
} from "./contract.js";

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
    ReceivingHook,
    AppliedHook,
    CompletedHook,
} from "./hook.js";

export {
    sourceFormula,
    targetFormula,
    output,
    beforeReceive,
    targetApplied,
    sourceApplied,
    completed,
} from "./hook.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";

export type { ApplyOptions } from "./apply.js";
