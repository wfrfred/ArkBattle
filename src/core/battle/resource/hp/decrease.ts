import * as receivingProtocol from "../receiving.js";
import * as hooks from "../../../hook.js";
import type { Departure, Unit } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";
import type { ReceivingContext as DamageReceivingContext } from "./damage/hook.js";
import type { Request as AdjustmentRequest } from "./adjustment/contract.js";

export type Reason = "UNSPECIFIED" | "UNHURTABLE" | "MISS" | "BLOCKED" | "HIT_FAILED" | "INTERRUPT";

export type Pending<
    R extends Reason = Reason,
    T extends receivingProtocol.State = receivingProtocol.State,
> = receivingProtocol.Pending<R, T>;

export type Next<T extends receivingProtocol.State, R extends Reason> = receivingProtocol.Next<
    T,
    R,
    Reason
>;

export const fix: receivingProtocol.Fix<Reason> = receivingProtocol.fix;

export const cancel: receivingProtocol.Cancel<Reason> = receivingProtocol.cancel;

export type ReceivingContext =
    | ({ readonly type: "DAMAGE" } & DamageReceivingContext)
    | {
          readonly type: "ADJUSTMENT";
          readonly request: AdjustmentRequest;
          readonly forbidden: ReadonlySet<Reason>;
      };

export type CommitContext = ReceivingContext & { readonly received: Pending };

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export type BeforeCommitHook = hooks.Hook<CommitContext, void>;

export const receiving = hooks.key<ReceivingHook, Unit & Vitality>(
    "resource.hp.decrease.receiving",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.hp.decrease.beforeCommit");

export type TargetKilledContext = Extract<Departure, { readonly reason: "DEATH" }>;

export type TargetKilledHook = hooks.Hook<TargetKilledContext, void>;

export const targetKilled = hooks.key<TargetKilledHook, Unit>("resource.hp.decrease.targetKilled");
