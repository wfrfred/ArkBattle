export {
    hasVitality,
    hasVitalityDefinition,
    initialize,
    setRule,
    removeRule,
    setDamageReceivingStartedHook,
    removeDamageReceivingStartedHook,
    setDamageReceivingHook,
    removeDamageReceivingHook,
    setHealingReceivingHook,
    removeHealingReceivingHook,
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
    setDefenseContribution,
    removeDefenseContribution,
    setResistanceContribution,
    removeResistanceContribution,
} from "./capability.js";

export type { Definition, DefenseValues, Input, State, Vitality } from "./capability.js";

export type { DamageReceptionRule as Rule } from "./rule.js";

export type { ReceivingContext as RuleContext } from "../../../battle/damage/hp/hook.js";

export { resolveDefense } from "./query.js";

export {
    canReceiveDamage,
    canReceiveHealing,
    receiveDamage,
    receiveHealing,
    commitDamage,
    commitHealing,
} from "./operations.js";

export type { DamageApplication, HealingApplication } from "./operations.js";
