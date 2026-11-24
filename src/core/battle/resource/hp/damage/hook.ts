import type * as receivingProtocol from "../../receiving.js";
import type { Departure, Unit } from "../../../../unit/unit.js";
import type { Vitality } from "../../../../unit/capability/vitality/capability.js";
import * as hooks from "../../../../hook.js";
import type { Result, State as BattleState } from "../../../state.js";
import type {
    Application,
    Calculated,
    Outcome,
    Parameters,
    Pending,
    Reason,
    Request,
    DamageType,
} from "./contract.js";

export interface Context {
    readonly request: Request;
}

export interface OutputContext extends Context {
    readonly type: DamageType;
}

export interface ReceivingContext extends Context {
    readonly calculated: Calculated;
    readonly forbidden: ReadonlySet<Reason>;
}

export interface CommitContext extends ReceivingContext {
    readonly received: Pending;
}

export interface AppliedContext extends CommitContext {
    readonly application: Application;
}

export interface CompletedContext extends Context {
    readonly calculated: Calculated | undefined;
    readonly outcome: Outcome;
}

export type TargetKilledContext = Extract<Departure, { readonly reason: "DEATH" }>;

export type SourceFormulaHook = hooks.Hook<Context, Parameters>;

export type TargetFormulaHook = hooks.Hook<Context, Parameters>;

export type OutputHook = hooks.Hook<OutputContext, number>;

export type BeforeCommitHook = hooks.Hook<CommitContext, void>;

export type AppliedHook = hooks.Hook<AppliedContext, void>;

export type CompletedHook = hooks.Hook<CompletedContext, void>;

export type TargetKilledHook = hooks.Hook<TargetKilledContext, void>;

export type ReceivingHook = receivingProtocol.ReceivingHook<ReceivingContext, Reason>;

export const sourceFormula = hooks.key<SourceFormulaHook, Unit>("resource.hp.damage.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook, Unit & Vitality>(
    "resource.hp.damage.targetFormula",
);

export const output = hooks.key<OutputHook, Unit>("resource.hp.damage.output");

export const beforeReceive = hooks.key<ReceivingHook, Unit & Vitality>(
    "resource.hp.damage.beforeReceive",
);

export const beforeCommit = hooks.key<BeforeCommitHook, Unit>("resource.hp.damage.beforeCommit");

export const targetApplied = hooks.key<AppliedHook, Unit & Vitality>(
    "resource.hp.damage.targetApplied",
);

export const sourceApplied = hooks.key<AppliedHook, Unit>("resource.hp.damage.sourceApplied");

export const completed = hooks.key<CompletedHook, Unit>("resource.hp.damage.completed");

export const targetKilled = hooks.key<TargetKilledHook, Unit>("resource.hp.damage.targetKilled");

export const receiving = hooks.key<ReceivingHook, Unit & Vitality>("resource.hp.damage.receiving");

export function dispatchTargetKilled(
    battle: BattleState,
    context: TargetKilledContext,
    options?: hooks.Options,
): Result<void> {
    const killer = context.killer;
    if (killer === null) {
        return { state: battle, value: undefined };
    }

    return hooks.dispatch(battle, context, undefined, {
        candidates: (current) =>
            (killer.get(current)?.hooks.get(targetKilled) ?? []).filter(
                ({ id }) => !hooks.excluded(options, targetKilled, id),
            ),
        find: (current, id) => killer.get(current)?.hooks.find(targetKilled, id),
    });
}

export { dispatch } from "../../hook.js";
