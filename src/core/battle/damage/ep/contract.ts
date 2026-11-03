import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import type { Elemental, Type } from "../../../unit/capability/elemental/capability.js";
import type { DamageApplication } from "../../../unit/capability/elemental/operations.js";

export interface Parameters {
    readonly type: Type;
    readonly power: number;
}

export interface Request extends Parameters {
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Elemental>;
}

export interface Calculated {
    readonly type: Type;
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

export type Application = DamageApplication;

export type Outcome =
    | { readonly kind: "REJECTED" }
    | { readonly kind: "CANCELLED"; readonly received: Pending }
    | { readonly kind: "UNAVAILABLE"; readonly received: Pending }
    | { readonly kind: "APPLIED"; readonly received: Pending; readonly application: Application };

export function cancel<C extends Cancellation | null>(
    current: Pending<C>,
    reason: Reason,
): Pending<Next<C>> {
    return {
        ...current,
        cancellation: (current.cancellation ?? { reason }) as Next<C>,
    };
}
