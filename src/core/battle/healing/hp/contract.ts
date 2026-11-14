import type { HealingApplication } from "../../../unit/capability/vitality/operations.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit, Id } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";

export interface Event {
    readonly type: "HEAL";
    readonly targetUnitId: Id;
    readonly amount: number;
    readonly tick: number;
}

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

export type Reason = "UNSPECIFIED";

export type Pending<R extends Reason = Reason, T extends keyof Transitions = keyof Transitions> =
    | { readonly type: T & "NORMAL"; readonly amount: number }
    | { readonly type: T & "FIXED"; readonly amount: number }
    | { readonly type: T & "CANCELLED"; readonly amount: number; readonly reason: R };

interface Transitions {
    readonly NORMAL: "FIXED" | "CANCELLED";
    readonly FIXED: "CANCELLED";
    readonly CANCELLED: never;
}

export type Next<T extends Pending["type"], R extends Reason = Reason> =
    Pending<R, T> | Pending<Reason, Transitions[T]>;

export function fix<T extends Pending["type"], R extends Reason>(
    current: Pending<R, T>,
): Exclude<Next<T, R>, { readonly type: "NORMAL" }> {
    return (
        current.type === "NORMAL" ? { type: "FIXED", amount: current.amount } : current
    ) as Exclude<Next<T, R>, { readonly type: "NORMAL" }>;
}

export function cancel<T extends Pending["type"], R extends Reason>(
    current: Pending<R, T>,
    reason: Reason,
): Extract<Next<T, R>, { readonly type: "CANCELLED" }> {
    return (
        current.type === "CANCELLED"
            ? current
            : { type: "CANCELLED", amount: current.amount, reason }
    ) as Extract<Next<T, R>, { readonly type: "CANCELLED" }>;
}

export type Application = HealingApplication;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | {
          readonly type: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
      };
