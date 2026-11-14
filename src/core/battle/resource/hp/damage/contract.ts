import * as receiving from "../../receiving.js";
import type { AttackType, ApplyWay } from "../../damage.js";
import type { DamageApplication } from "../../../../unit/capability/vitality/operations.js";
import type { Ref } from "../../../../common/ref.js";
import type { Unit, Id } from "../../../../unit/unit.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";

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
    readonly attackType: AttackType;
    readonly applyWay: ApplyWay;
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
    | {
          readonly type: "APPLIED";
          readonly received: Pending;
          readonly application: Application;
          readonly killed: boolean;
      };
