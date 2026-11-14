import * as receiving from "../../receiving.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit, Id } from "../../../../unit/unit.js";
import type { Elemental, Type } from "../../../../unit/capability/elemental/capability.js";
import type { DamageApplication } from "../../../../unit/capability/elemental/operations.js";

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

export type Pending<
    R extends Reason = Reason,
    T extends receiving.State = receiving.State,
> = receiving.Pending<R, T>;

export type Next<T extends receiving.State, R extends Reason> = receiving.Next<T, R, Reason>;

export const fix: receiving.Fix<Reason> = receiving.fix;

export const cancel: receiving.Cancel<Reason> = receiving.cancel;

export type Application = DamageApplication;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | { readonly type: "APPLIED"; readonly received: Pending; readonly application: Application };
