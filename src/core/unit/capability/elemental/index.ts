export {
    Type,
    ELEMENT_TYPES,
    hasElemental,
    elementValues,
    initialize,
    setContribution,
    removeContribution,
    setRule,
    removeRule,
    setHook,
    removeHook,
} from "./capability.js";

export type { Values, Input, Definition, Parameter, State, Elemental } from "./capability.js";

export { ref } from "./burst.js";

export type { End, Definition as BurstDefinition, State as BurstState, Burst } from "./burst.js";

export {
    receiveDamage,
    commitDamage,
    commitHealing,
    finish,
    cancel,
    advance,
} from "./operations.js";

export type { DamageApplication, HealingApplication } from "./operations.js";

export type { Event } from "./event.js";

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

export type {
    DamageRule,
    HealingRule,
    DamageContext as DamageRuleContext,
    HealingContext as HealingRuleContext,
    Rule,
    Key as RuleKey,
    Rules,
} from "./rule.js";
