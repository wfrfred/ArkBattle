declare const identity: unique symbol;
declare const referent: unique symbol;

export type Identified<I extends object, T extends object = object> = Omit<T, typeof identity> &
    object & { readonly [identity]?: I };

export type Identity<T> = typeof identity extends keyof T
    ? T extends { readonly [identity]?: infer I extends object }
        ? I
        : never
    : never;

export interface Phantom<out T> {
    readonly [referent]: T;
}

export type Ref<T> = Identity<T> & Phantom<T>;
