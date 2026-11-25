export type { Definition } from "./definition.js";

export { ref, ref as activationRef } from "../../../common/ref.js";

export type { Skill } from "./skill.js";

export type {
    Operation,
    Trigger,
    End,
    Initial as ActivationInitial,
    Parameters as ActivationParameters,
    Definition as ActivationDefinition,
    Activation,
    ActivationRef,
} from "./activation.js";

export {
    setState,
    setActivationState,
    activate,
    finish,
    cancel,
    operate,
    advance,
    extendTime,
} from "./operations.js";

export type { Event } from "./event.js";

export {
    setContribution as setSpContribution,
    removeContribution as removeSpContribution,
    setRange as setSpRange,
    clearRange as clearSpRange,
    hasSp,
    resolveRecoverySpeed,
    resolveRecoveryMultiplier,
    recover,
    pay,
    modify,
} from "./sp.js";

export type {
    Source as SpSource,
    Input as SpInput,
    Recovery,
    Definition as SpDefinition,
    Timer as SpTimer,
    State as SpState,
    Recovered,
    Paid,
    Modified,
    Outcome as SpOutcome,
    Parameter as SpParameter,
} from "./sp.js";

export {
    resolveCapacity as resolveAmmoCapacity,
    consume,
    replenish,
    grant,
    check,
} from "./ammo.js";

export type {
    Modifier as AmmoModifier,
    Input as AmmoInput,
    Consumed,
    Replenished,
    Outcome as AmmoOutcome,
} from "./ammo.js";

export type { Definition as DurationDefinition, Ammo, State as DurationState } from "./duration.js";

export {
    hasSkill,
    initialize,
    setRestriction,
    removeRestriction,
    setAmmoContribution,
    removeAmmoContribution,
} from "./capability.js";

export type {
    Definition as CapabilityDefinition,
    State as CapabilityState,
    Skill as SkillCapability,
} from "./capability.js";

export {
    spRecovered,
    spPaid,
    spModified,
    ammoConsumed,
    ammoReplenished,
    activationStarted,
    activationEnded,
} from "./hook.js";

export type { ActivationStarted, ActivationEnded, Context, Hook } from "./hook.js";

export type {
    ActivationRestriction,
    OperationRestriction,
    RecoveryRestriction,
    ActivationContext as ActivationRestrictionContext,
    OperationContext as OperationRestrictionContext,
    RecoveryContext as RecoveryRestrictionContext,
    Restrictions,
} from "./restriction.js";
