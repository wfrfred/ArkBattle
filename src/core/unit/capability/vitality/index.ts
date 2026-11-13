export {
    hasVitality,
    initialize,
    setRule,
    removeRule,
    setContribution,
    removeContribution,
    setHook,
    removeHook,
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
} from "./capability.js";

export type { Definition, Input, Parameter, State, Vitality } from "./capability.js";

export type { DamageReceptionRule as Rule } from "./rule.js";

export type { ReceivingContext as RuleContext } from "../../../battle/damage/hp/hook.js";

export { resolveDefense, resolveResistance, resolveRecoverySpeed } from "./query.js";

export {
    canReceiveDamage,
    canReceiveHealing,
    receiveDamage,
    receiveHealing,
    commitDamage,
    commitHealing,
    advance,
} from "./operations.js";

export type { DamageApplication, HealingApplication } from "./operations.js";
