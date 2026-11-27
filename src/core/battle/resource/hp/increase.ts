import * as receivingProtocol from "../receiving.js";
import * as hooks from "../../../hook.js";
import type { Unit } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";
import type { ReceivingContext as HealingReceivingContext } from "./healing/hook.js";
import type { Request as AdjustmentRequest } from "./adjustment/contract.js";

export type Reason = "UNSPECIFIED";

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
    | ({ readonly type: "HEALING" } & HealingReceivingContext)
    | {
          readonly type: "ADJUSTMENT";
          readonly request: AdjustmentRequest;
          readonly forbidden: ReadonlySet<Reason>;
      };

export type CommitContext = ReceivingContext & { readonly received: Pending };

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export type BeforeCommitHook = hooks.Hook<CommitContext, void>;

export const receiving = hooks.key<ReceivingHook, Unit & Vitality>(
    "resource.hp.increase.receiving",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.hp.increase.beforeCommit");
