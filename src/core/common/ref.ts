import type { State as BattleState } from "../battle/state.js";

declare const identity: unique symbol;
declare const referent: unique symbol;

export interface Identified<I extends object> {
    readonly [identity]?: I;
    readonly ref: Ref<Identified<I>>;
}

export type Identity<T> = typeof identity extends keyof T
    ? T extends { readonly [identity]?: infer I extends object }
        ? I
        : never
    : never;

export interface Phantom<out T> {
    readonly [referent]: T;
}

export type Ref<T> = Identity<T> &
    Phantom<T> & {
        readonly get: (this: object, battle: BattleState) => T | undefined;
    };

export function createRef<T extends Identified<object>>(
    identity: Identity<T>,
    get: Ref<T>["get"],
): Ref<T> {
    return { ...identity, get } as Ref<T>;
}

export function ref<T extends Identified<object>>(self: T): Ref<T> {
    return self.ref as Ref<T>;
}
