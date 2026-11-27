export {
    hasVitality,
    initialize,
    setRestriction,
    removeRestriction,
    setContribution,
    removeContribution,
    setRange,
    clearRange,
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

export { lossCommitting, lossCommitted } from "./hook.js";

export type {
    LossCommittingContext,
    LossCommittingHook,
    LossCommittedContext,
    LossCommittedHook,
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
    canReceiveHp,
    receiveDecrease,
    receiveIncrease,
    commitDecrease,
    commitIncrease,
    increaseHp,
    advance,
} from "./operations.js";

export type { DecreaseApplication, IncreaseApplication } from "./operations.js";
