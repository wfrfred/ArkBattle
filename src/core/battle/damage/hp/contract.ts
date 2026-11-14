import type { DamageApplication } from "../../../unit/capability/vitality/operations.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit, Id } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";

export type DamageType = "PHYSICAL" | "ARTS" | "TRUE" | "ELEMENTAL";

export type Nature = "DAMAGE" | "LOSS";

export interface Event {
    readonly type: "DAMAGE";
    readonly targetUnitId: Id;
    readonly damageType: DamageType;
    readonly amount: number;
    readonly tick: number;
}

export interface AttackParameters {
    readonly power: number;
    readonly multiplier: number;
    readonly addition: number;
}

export interface Penetration {
    readonly fixed: number;
    readonly proportional: number;
}

export type Parameters =
    | {
          readonly type: "PHYSICAL" | "ARTS";
          readonly attack: AttackParameters;
          readonly penetration: Penetration;
      }
    | {
          readonly type: "TRUE" | "ELEMENTAL";
          readonly attack: AttackParameters;
      };

export interface Request {
    readonly nature: Nature;
    readonly hitRecovery: boolean;
    readonly source: Ref<Unit> | null;
    readonly target: Ref<Unit & Vitality>;
    readonly parameters: Parameters;
}

export interface Calculated {
    readonly type: DamageType;
    readonly amount: number;
}

export type Reason = string;

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

export type Application = DamageApplication;

export type Outcome =
    | { readonly type: "REJECTED" }
    | { readonly type: "CANCELLED"; readonly received: Pending }
    | { readonly type: "UNAVAILABLE"; readonly received: Pending }
    | {
          readonly type: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
          readonly killed: boolean;
      };
