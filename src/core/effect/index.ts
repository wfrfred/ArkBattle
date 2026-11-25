export type { Definition, Group, OrdinaryGroup, StackGroup } from "./definition.js";

export type { Effect, Id, Lifecycle } from "./effect.js";

export type {
    Expiration,
    ExpirationPolicy,
    Policy,
    Duration,
    Deadline,
    Infinite,
} from "./expiration.js";

export { ref } from "./effect.js";

export { all, forHost, hasStack, effectiveStackCount } from "./query.js";

export type { Initial } from "./operations.js";

export {
    install,
    setState,
    setExpiration,
    decreaseStack,
    setEnabled,
    remove,
    advance,
} from "./operations.js";
