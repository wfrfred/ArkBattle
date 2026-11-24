import type { Ref } from "../../../common/ref.js";
import type { State as BattleState, Result } from "../../../battle/state.js";
import type { ExecutionRef } from "./execution.js";
import type { Unit } from "../../unit.js";
import * as hook from "../../../hook.js";
import type { Action } from "./capability.js";

export type Directive =
    { readonly type: "CONTINUE" } | { readonly type: "INTERRUPT"; readonly recoveryTicks: number };

export interface Context {
    readonly source: Ref<Unit & Action>;
    readonly execution: ExecutionRef;
}

export type BeforeReleaseHook = hook.Hook<Context, Directive>;

export type ReleasedHook = hook.Hook<Context, void>;

export const beforeRelease = hook.key<BeforeReleaseHook, Unit & Action>("action.beforeRelease");

export const released = hook.key<ReleasedHook, Unit & Action>("action.released");

export function dispatchBeforeRelease(battle: BattleState, ref: ExecutionRef): Result<Directive> {
    const context: Context = { execution: ref, source: ref.host };

    return hook.dispatch<Context, Directive>(
        battle,
        context,
        { type: "CONTINUE" },
        {
            candidates: (current) => context.source.get(current)?.hooks.get(beforeRelease) ?? [],
            find: (current, id) => context.source.get(current)?.hooks.find(beforeRelease, id),
            stop: (current, directive) =>
                directive.type === "INTERRUPT" || !running(current, context),
        },
    );
}

export function dispatchReleased(battle: BattleState, ref: ExecutionRef): BattleState {
    const context: Context = { execution: ref, source: ref.host };

    return hook.dispatch(battle, context, undefined, {
        candidates: (current) => context.source.get(current)?.hooks.get(released) ?? [],
        find: (current, id) => context.source.get(current)?.hooks.find(released, id),
        stop: (current) => !running(current, context),
    }).state;
}

function running(battle: BattleState, context: Context): boolean {
    const source = context.source.get(battle);

    return (
        source?.lifecycle === "ACTIVE" &&
        context.execution.get(battle)?.execution.lifecycle === "ACTIVE"
    );
}
