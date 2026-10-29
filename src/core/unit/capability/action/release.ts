import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { Execution } from "../../action/execution.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as hook from "../../../hook.js";
import type { Action } from "./capability.js";

export type Directive =
    { readonly type: "CONTINUE" } | { readonly type: "INTERRUPT"; readonly recoveryTicks: number };

export interface Context {
    readonly source: Ref<Unit & Action>;
    readonly execution: Ref<Execution>;
}

export type BeforeReleaseHook = hook.Hook<Context, Directive>;

export type ReleasedHook = hook.Hook<Context, void>;

export function beforeRelease<X extends Execution<any, any>>(
    battle: BattleState,
    ref: Ref<X>,
): Result<Directive> {
    const context: Context = { execution: ref, source: ref.host };
    const result = hook.dispatch<Context, Directive>(
        battle,
        context,
        { type: "CONTINUE" },
        {
            candidates: (current) =>
                units.get(current, context.source)?.action.beforeRelease.map(({ id }) => id) ?? [],
            find: (current, id) =>
                units
                    .get(current, context.source)
                    ?.action.beforeRelease.find((entry) => entry.id === id),
            stop: (current, directive) =>
                directive.type === "INTERRUPT" || !running(current, context),
        },
    );
    if (result.value.type === "INTERRUPT") {
        assertNonnegativeSafeInteger(result.value.recoveryTicks, "action release recovery");
    }

    return result;
}

export function released<X extends Execution<any, any>>(
    battle: BattleState,
    ref: Ref<X>,
): BattleState {
    const context: Context = { execution: ref, source: ref.host };

    return hook.dispatch(battle, context, undefined, {
        candidates: (current) =>
            units.get(current, context.source)?.action.released.map(({ id }) => id) ?? [],
        find: (current, id) =>
            units.get(current, context.source)?.action.released.find((entry) => entry.id === id),
        stop: (current) => !running(current, context),
    }).state;
}

function running(battle: BattleState, context: Context): boolean {
    const source = units.get(battle, context.source);

    return (
        source?.lifecycle === "PRESENT" &&
        source.action.actions.getExecution(context.execution.id)?.execution.status === "RUNNING"
    );
}
