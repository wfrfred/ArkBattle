export {
    ELEMENT_TYPES,
    hasElemental,
    hasElementalDefinition,
    elementValues,
    createDefinition,
    initialize,
    setContribution,
    removeContribution,
    setDamageHook,
    removeDamageHook,
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

export { damage, heal, finish, cancel, advance } from "./operations.js";

export type {
    DamageRequest,
    HealRequest,
    DamageOutcome,
    HealOutcome,
    Signal,
} from "./operations.js";

export {
    get,
    available,
    resolveMaxEp,
    resolveRecoverySpeed,
    resolveElementResistance,
    resolveDamageResistance,
    resolveBurstRecoverySpeed,
    canReceiveDamage,
    canReceiveHeal,
    currentType,
    damageRatio,
    resolveDamageRatio,
} from "./query.js";

export type { Receiving, DamageHook, Damaged, Healed, Events, Key, Context, Hook } from "./hook.js";

export type { Rule } from "./rule.js";
