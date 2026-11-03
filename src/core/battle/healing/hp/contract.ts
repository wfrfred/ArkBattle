import type { HealingApplication } from "../../../unit/capability/vitality/operations.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";

export interface Parameters {
    readonly power: number;
    readonly multiplier: number;
}

export interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: Parameters;
}

export interface Calculated {
    readonly amount: number;
}

export type Reason = string;

export interface Cancellation<R extends Reason = Reason> {
    readonly reason: R;
}

export interface Pending<C extends Cancellation | null = Cancellation | null> {
    readonly amount: number;
    readonly cancellation: C;
}

export type Next<C extends Cancellation | null> = C | (null extends C ? Cancellation : never);

export function cancel<C extends Cancellation | null>(
    current: Pending<C>,
    reason: Reason,
): Pending<Next<C>> {
    return { ...current, cancellation: (current.cancellation ?? { reason }) as Next<C> };
}

export type Application = HealingApplication;

export type Outcome =
    | { readonly kind: "REJECTED" }
    | { readonly kind: "CANCELLED"; readonly received: Pending }
    | { readonly kind: "UNAVAILABLE"; readonly received: Pending }
    | {
          readonly kind: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
      };
