export { createDefinition } from "./definition.js";

export type { Definition } from "./definition.js";

export { ref } from "./skill.js";

export type { Skill } from "./skill.js";

export { ref as activationRef } from "./activation.js";

export type {
    Operation,
    Trigger,
    End,
    Definition as ActivationDefinition,
    Activation,
} from "./activation.js";

export { getSkill, getActivation } from "./query.js";

export { create } from "./initialize.js";

export {
    lifetime,
    setData,
    setActivationData,
    activate,
    finish,
    cancel,
    operate,
    advance,
    enter,
    extendTime,
} from "./operations.js";

export type { Outcome, Signal } from "./operations.js";

export {
    setContribution as setSpContribution,
    removeContribution as removeSpContribution,
    resolveCapacity as resolveSpCapacity,
    resolveRequirement,
    resolveCost,
    resolveRecoverySpeed,
    resolveRecoveryMultiplier,
    recover,
    pay,
    modify,
} from "./sp.js";

export type {
    Source as SpSource,
    Input as SpInput,
    Inputs as SpInputs,
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

export type { Modifier } from "./modifier.js";

export type { Definition as SustainDefinition, Ammo, State as SustainState } from "./sustain.js";
