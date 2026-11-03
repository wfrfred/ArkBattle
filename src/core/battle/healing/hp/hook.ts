import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../state.js";
import type { Unit } from "../../../unit/unit.js";
import type { Vitality } from "../../../unit/capability/vitality/capability.js";
import * as units from "../../../unit/query.js";
import * as hooks from "../../../hook.js";
import type {
    Application,
    Calculated,
    Cancellation,
    Next,
    Outcome,
    Parameters,
    Pending,
    Request,
} from "./contract.js";

export interface Context {
    readonly target: Ref<Unit & Vitality>;
    readonly request: Request;
}

export interface ReceivingContext extends Context {
    readonly calculated: Calculated;
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

interface Entry<C, T> extends hooks.Hook<C, T> {
    readonly priority?: number;
}

export type SourceFormulaHook = Entry<Context, Parameters>;

export type TargetFormulaHook = Entry<Context, Parameters>;

export type OutputHook = Entry<Context, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export type CompletedHook = Entry<CompletedContext, void>;

export interface ReceivingHook extends Entry<ReceivingContext, Pending> {
    readonly invoke: <C extends Cancellation | null>(
        battle: BattleState,
        context: ReceivingContext,
        current: Pending<C>,
    ) => Result<Pending<Next<C>>>;
}

export const sourceFormula = hooks.key<SourceFormulaHook>("healing.hp.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook>("healing.hp.targetFormula");

export const output = hooks.key<OutputHook>("healing.hp.output");

export const beforeReceive = hooks.key<BeforeReceiveHook>("healing.hp.beforeReceive");

export const beforeCommit = hooks.key<BeforeCommitHook>("healing.hp.beforeCommit");

export const targetApplied = hooks.key<AppliedHook>("healing.hp.targetApplied");

export const sourceApplied = hooks.key<AppliedHook>("healing.hp.sourceApplied");

export const completed = hooks.key<CompletedHook>("healing.hp.completed");

export function dispatch<C, T>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<Entry<C, T>>,
    context: C,
    initial: T,
    stop?: (battle: BattleState) => boolean,
): Result<T> {
    if (owner === null) {
        return { state: battle, value: initial };
    }

    return hooks.dispatch(battle, context, initial, {
        candidates(current) {
            const unit = units.get(current, owner);

            return unit?.lifecycle === "PRESENT"
                ? [...unit.hooks.get(key)]
                      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                      .map(({ id }) => id)
                : [];
        },
        find(current, id) {
            const unit = units.get(current, owner);

            return unit?.lifecycle === "PRESENT" ? unit.hooks.find(key, id) : undefined;
        },
        ...(stop === undefined ? {} : { stop: (current: BattleState) => stop(current) }),
    });
}
