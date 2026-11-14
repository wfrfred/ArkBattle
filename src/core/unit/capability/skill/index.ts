export {
    hasSkill,
    initialize,
    setRestriction,
    removeRestriction,
    setAmmoContribution,
    removeAmmoContribution,
} from "./capability.js";

export type { Definition, State, Skill } from "./capability.js";

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
