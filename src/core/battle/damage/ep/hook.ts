import type { State as BattleState, Result } from "../../state.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../../unit/unit.js";
import type { Type } from "../../../unit/capability/elemental/capability.js";
import * as units from "../../../unit/query.js";
import * as hooks from "../../../hook.js";
import type {
    Application,
    Calculated,
    Cancellation,
    Next,
    Parameters,
    Pending,
    Request,
} from "./contract.js";

export interface Context {
    readonly target: Request["target"];
    readonly request: Request;
}

export interface OutputContext extends Context {
    readonly type: Type;
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

interface Entry<C, T> extends hooks.Hook<C, T> {
    readonly priority?: number;
}

export type SourceFormulaHook = Entry<Context, Parameters>;

export type TargetFormulaHook = Entry<Context, Parameters>;

export type OutputHook = Entry<OutputContext, number>;

export type BeforeReceiveHook = Entry<ReceivingContext, void>;

export interface ReceivingHook extends Entry<ReceivingContext, Pending> {
    readonly invoke: <C extends Cancellation | null>(
        battle: BattleState,
        context: ReceivingContext,
        current: Pending<C>,
    ) => Result<Pending<Next<C>>>;
}

export type BeforeCommitHook = Entry<CommitContext, void>;

export type AppliedHook = Entry<AppliedContext, void>;

export const sourceFormula = hooks.key<SourceFormulaHook>("damage.ep.sourceFormula");

export const targetFormula = hooks.key<TargetFormulaHook>("damage.ep.targetFormula");

export const output = hooks.key<OutputHook>("damage.ep.output");

export const beforeReceive = hooks.key<BeforeReceiveHook>("damage.ep.beforeReceive");

export const beforeCommit = hooks.key<BeforeCommitHook>("damage.ep.beforeCommit");

export const targetApplied = hooks.key<AppliedHook>("damage.ep.targetApplied");

export const sourceApplied = hooks.key<AppliedHook>("damage.ep.sourceApplied");

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
