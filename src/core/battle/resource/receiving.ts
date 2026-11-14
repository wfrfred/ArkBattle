import type { Result, State as BattleState } from "../state.js";
import type { Entry } from "./hook.js";

export type State = "NORMAL" | "FIXED" | "CANCELLED";

export type Pending<R extends string = string, T extends State = State> = (
    | { readonly type: "NORMAL"; readonly amount: number }
    | { readonly type: "FIXED"; readonly amount: number }
    | { readonly type: "CANCELLED"; readonly amount: number; readonly reason: R }
) & { readonly type: T };

type FixResult<T extends State, R extends string> = Extract<
    Pending<R>,
    { readonly type: T extends "CANCELLED" ? "CANCELLED" : "FIXED" }
>;

type CancelResult<T extends State, R extends string, N extends string> = Extract<
    Pending<T extends "CANCELLED" ? R : N>,
    { readonly type: "CANCELLED" }
>;

export type Next<T extends State, R extends string, A extends string> =
    Pending<R, T> | FixResult<T, R> | CancelResult<T, R, A>;

export type Fix<A extends string> = <T extends State, R extends A>(
    current: Pending<R, T>,
) => FixResult<T, R>;

export type Cancel<A extends string> = <T extends State, R extends A, N extends A>(
    current: Pending<R, T>,
    reason: N,
) => CancelResult<T, R, N>;

export interface ReceivingHook<C, A extends string> extends Entry<C, Pending<A>> {
    readonly invoke: <T extends State, R extends A>(
        battle: BattleState,
        context: C,
        current: Pending<R, T>,
    ) => Result<Next<T, R, A>>;
}

export function fix<T extends State, R extends string>(current: Pending<R, T>): FixResult<T, R> {
    return (
        current.type === "NORMAL" ? { type: "FIXED", amount: current.amount } : current
    ) as FixResult<T, R>;
}

export function cancel<T extends State, R extends string, N extends string>(
    current: Pending<R, T>,
    reason: N,
): CancelResult<T, R, N> {
    return (
        current.type === "CANCELLED"
            ? current
            : { type: "CANCELLED", amount: current.amount, reason }
    ) as CancelResult<T, R, N>;
}
