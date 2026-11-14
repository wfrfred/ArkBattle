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

export type Reason = "UNSPECIFIED" | "UNHURTABLE" | "MISS" | "BLOCKED" | "HIT_FAILED" | "INTERRUPT";

type State = "NORMAL" | "FIXED" | "CANCELLED";

export type Pending<R extends Reason = Reason, T extends State = State> = (
    | { readonly type: "NORMAL"; readonly amount: number }
    | { readonly type: "FIXED"; readonly amount: number }
    | { readonly type: "CANCELLED"; readonly amount: number; readonly reason: R }
) & { readonly type: T };

type FixResult<T extends State, R extends Reason> = Extract<
    Pending<R>,
    { readonly type: T extends "CANCELLED" ? "CANCELLED" : "FIXED" }
>;

type CancelResult<T extends State, R extends Reason, N extends Reason> = Extract<
    Pending<T extends "CANCELLED" ? R : N>,
    { readonly type: "CANCELLED" }
>;

export type Next<T extends State, R extends Reason> =
    Pending<R, T> | FixResult<T, R> | CancelResult<T, R, Reason>;

export function fix<T extends State, R extends Reason>(current: Pending<R, T>): FixResult<T, R> {
    return (
        current.type === "NORMAL" ? { type: "FIXED", amount: current.amount } : current
    ) as FixResult<T, R>;
}

export function cancel<T extends State, R extends Reason, N extends Reason>(
    current: Pending<R, T>,
    reason: N,
): CancelResult<T, R, N> {
    return (
        current.type === "CANCELLED"
            ? current
            : { type: "CANCELLED", amount: current.amount, reason }
    ) as CancelResult<T, R, N>;
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
