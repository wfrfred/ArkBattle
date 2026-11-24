export type { Definition, EndReason } from "./definition.js";

export type { Projectile, Id, Lifecycle, Eliminatable } from "./projectile.js";

export { ref, all, hasEliminatable } from "./query.js";

export type { Input } from "./initialize.js";

export { initialize } from "./initialize.js";

export { add, update, remove, lifetime } from "./operations.js";

export {
    hasSlowable,
    setContribution as setMoveContribution,
    removeContribution as removeMoveContribution,
    resolve as resolveMoveScale,
} from "./slowable.js";

export type { Slowable } from "./slowable.js";
