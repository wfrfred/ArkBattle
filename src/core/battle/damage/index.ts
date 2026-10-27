export type {
    DamageType,
    AttackParameters,
    Penetration,
    DamageParameters,
    DamageRequest,
    CalculatedDamage,
    DamageCancellation,
    PendingDamage,
    ApplicationResult,
    DamageOutcome,
} from "./contract.js";

export type {
    CalculationContext,
    ReceivingContext,
    AppliedContext,
    CompletedContext,
    ParametersHook,
    OutputHook,
    ReceivingStartedHook,
    ReceivingHook,
    HpAppliedHook,
    CompletedHook,
    Hook,
    ReceptionRule,
} from "./hook.js";

export { setHook, removeHook } from "./hook.js";

export { calculateDamage } from "./calculate.js";

export { applyDamage } from "./apply.js";
