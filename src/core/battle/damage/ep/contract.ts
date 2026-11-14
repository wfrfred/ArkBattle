import type { Ref } from "../../../common/ref.js";
import type { Unit, Id } from "../../../unit/unit.js";
import type { Elemental, Type } from "../../../unit/capability/elemental/capability.js";
import type { DamageApplication } from "../../../unit/capability/elemental/operations.js";

export interface Event {
    readonly type: "ELEMENTAL_INJURY";
    readonly targetUnitId: Id;
    readonly elementType: Type;
    readonly amount: number;
    readonly tick: number;
}

export interface Parameters {
    readonly type: Type;
    readonly power: number;
}

export interface Request {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Elemental>;
    readonly parameters: Parameters;
}

export interface Calculated {
    readonly type: Type;
    readonly amount: number;
}

export type Reason = "UNSPECIFIED" | "UNHURTABLE" | "INTERRUPT";

interface PendingFields<R extends Reason> {
    readonly NORMAL: { readonly amount: number };
    readonly FIXED: { readonly amount: number };
    readonly CANCELLED: { readonly amount: number; readonly reason: R };
}

export type Pending<
    R extends Reason = Reason,
    T extends keyof PendingFields<R> = keyof PendingFields<R>,
> = {
    [K in keyof PendingFields<R>]: { readonly type: T & K } & PendingFields<R>[K];
}[keyof PendingFields<R>];

interface Transitions {
    readonly NORMAL: "FIXED" | "CANCELLED";
    readonly FIXED: "CANCELLED";
    readonly CANCELLED: never;
}

export type Next<T extends Pending["type"], R extends Reason = Reason> =
    Pending<R, T> | Pending<Reason, Transitions[T]>;

type FixResult<T extends Pending["type"], R extends Reason> = Extract<
    Pending<R>,
    { readonly type: T extends "CANCELLED" ? "CANCELLED" : "FIXED" }
>;

type CancelResult<T extends Pending["type"], R extends Reason, N extends Reason> = Extract<
    Pending<T extends "CANCELLED" ? R : N>,
    { readonly type: "CANCELLED" }
>;

export function fix<T extends Pending["type"], R extends Reason>(
    current: Pending<R, T>,
): FixResult<T, R> & Next<T, R> {
    return (
        current.type === "NORMAL" ? { type: "FIXED", amount: current.amount } : current
    ) as FixResult<T, R> & Next<T, R>;
}

export function cancel<T extends Pending["type"], R extends Reason, N extends Reason>(
    current: Pending<R, T>,
    reason: N,
): CancelResult<T, R, N> & Next<T, R> {
    return (
        current.type === "CANCELLED"
            ? current
            : { type: "CANCELLED", amount: current.amount, reason }
    ) as CancelResult<T, R, N> & Next<T, R>;
}

export type Application = DamageApplication;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | { readonly type: "APPLIED"; readonly received: Pending; readonly application: Application };
