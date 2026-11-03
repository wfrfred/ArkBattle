export {
    ELEMENT_TYPES,
    hasElemental,
    hasElementalDefinition,
    elementValues,
    initialize,
    setContribution,
    removeContribution,
    setDamageReceivingHook,
    removeDamageReceivingHook,
    setRule,
    removeRule,
    setHook,
    removeHook,
} from "./capability.js";

export type { Type, Values, Input, Definition, Parameter, State, Elemental } from "./capability.js";

export { ref } from "./burst.js";

export type {
    Id as BurstId,
    Status as BurstStatus,
    End,
    Definition as BurstDefinition,
    Burst,
} from "./burst.js";

export {
    lifetime,
    receiveDamage,
    commitDamage,
    commitHealing,
    finish,
    cancel,
    advance,
} from "./operations.js";

export type { DamageApplication, HealingApplication, Signal } from "./operations.js";

export {
    get,
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

export type { DamageReceivingHook, Damaged, Healed, Events, Key, Context, Hook } from "./hook.js";

export type { Rule, Key as RuleKey, Contexts as RuleContexts, Rules } from "./rule.js";
