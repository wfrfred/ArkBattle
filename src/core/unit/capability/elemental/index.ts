export {
    Type,
    ELEMENT_TYPES,
    hasElemental,
    elementValues,
    initialize,
    setContribution,
    removeContribution,
    setRange,
    clearRange,
    setRestriction,
    removeRestriction,
} from "./capability.js";

export type { Values, Input, Definition, Parameter, State, Elemental } from "./capability.js";

export { ref } from "./burst.js";

export type { End, Definition as BurstDefinition, State as BurstState, Burst } from "./burst.js";

export {
    receiveDamage,
    commitDamage,
    commitHealing,
    reduceDuration,
    finish,
    cancel,
    advance,
} from "./operations.js";

export type { DamageApplication, HealingApplication } from "./operations.js";

export type { Event } from "./event.js";

export {
    getCurrentBurst,
    available,
    resolveMaxEp,
    resolveRecoverySpeed,
    resolveElementResistance,
    resolveDamageResistance,
    resolveBurstRecoverySpeed,
    canReceiveDamage,
    canReceiveHealing,
    currentType,
    damageRatio,
    resolveDamageRatio,
} from "./query.js";

export { damaged, healed, burstStarted, burstEnded } from "./hook.js";

export type { DamageReceivingHook, Damaged, Healed, Context, Hook } from "./hook.js";

export type {
    DamageRestriction,
    HealingRestriction,
    DamageContext as DamageRestrictionContext,
    HealingContext as HealingRestrictionContext,
    Restrictions,
} from "./restriction.js";
