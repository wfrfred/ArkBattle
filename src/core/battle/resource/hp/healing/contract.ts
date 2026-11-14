import * as receiving from "../../receiving.js";
import type { HealingApplication } from "../../../../unit/capability/vitality/operations.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit, Id } from "../../../../unit/unit.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";

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

export type Pending<
    R extends Reason = Reason,
    T extends receiving.State = receiving.State,
> = receiving.Pending<R, T>;

export type Next<T extends receiving.State, R extends Reason> = receiving.Next<T, R, Reason>;

export const fix: receiving.Fix<Reason> = receiving.fix;

export const cancel: receiving.Cancel<Reason> = receiving.cancel;

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
