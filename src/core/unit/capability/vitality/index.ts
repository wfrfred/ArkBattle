export {
    hasVitality,
    initialize,
    setRestriction,
    removeRestriction,
    setContribution,
    removeContribution,
    setMaxHpContribution,
    removeMaxHpContribution,
    resolveMaxHp,
    resolveMaxMinusHp,
    setMaxMinusHpRatio,
} from "./capability.js";

export type { Definition, Input, Parameter, State, Vitality } from "./capability.js";

export type { Health } from "./health.js";

export type { Restriction } from "./restriction.js";

export type { ReceivingContext as RestrictionContext } from "../../../battle/resource/hp/damage/hook.js";

export { damageCommitting, damageCommitted } from "./hook.js";

export type {
    DamageCommittingContext,
    DamageCommittingHook,
    DamageCommittedContext,
    DamageCommittedHook,
} from "./hook.js";

export {
    isAlive,
    hpRatio,
    resolveDefense,
    resolveResistance,
    resolveRecoverySpeed,
} from "./query.js";

export {
    canReceiveDamage,
    canReceiveHealing,
    receiveDamage,
    receiveHealing,
    commitDamage,
    commitHealing,
    increaseHp,
    advance,
} from "./operations.js";

export type { DamageApplication, HealingApplication } from "./operations.js";
