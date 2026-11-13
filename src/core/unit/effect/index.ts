export type {
    Definition,
    OrdinaryDefinition,
    StackDefinition,
    Group,
    OrdinaryGroup,
    StackGroup,
} from "./definition.js";

export type { Effect, OrdinaryEffect, StackEffect, Id, Lifecycle } from "./effect.js";

export type {
    Expiration,
    ExpirationPolicy,
    DecayExpiration,
    StackExpiration,
} from "./expiration.js";

export { ref } from "./effect.js";

export { get, hasStack, effectiveStackCount } from "./query.js";

export type { Initial } from "./operations.js";

export {
    install,
    setState,
    setExpiration,
    decreaseStack,
    setEnabled,
    lifetime,
    end,
    advance,
} from "./operations.js";
