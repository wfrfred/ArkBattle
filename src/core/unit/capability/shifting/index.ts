import { forcedMoved } from "./hook.js";
import * as pulls from "./pull.js";
import * as unbalances from "./unbalance.js";

export * as shifter from "./shifter.js";

export * as shiftable from "./shiftable.js";

export { push, type PushInput } from "./force.js";

export type { ForcedMovement } from "./hook.js";

export type { Brake, Input as PullInput, NearStop, Point, Pull } from "./pull.js";

export type { BodyDefinition, Shiftable } from "./shiftable.js";

export type { Shifter } from "./shifter.js";

export type { Unbalance } from "./unbalance.js";

export const pull = {
    create: pulls.create,
    ref: pulls.ref,
    get: pulls.get,
    lifetime: pulls.lifetime,
    withinRadius: pulls.withinRadius,
    brake: pulls.brake,
    end: pulls.end,
} as const;

export const unbalance = {
    ref: unbalances.ref,
    get: unbalances.get,
    lifetime: unbalances.lifetime,
    applyImpulse: unbalances.applyImpulse,
    addForce: unbalances.addForce,
    setVelocity: unbalances.setVelocity,
    forcedMoved,
} as const;
