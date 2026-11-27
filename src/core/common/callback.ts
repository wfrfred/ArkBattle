type EraseArgs<F> = F extends (battle: infer B, ...args: infer A) => infer R
    ? (battle: B, ...args: { [I in keyof A]: never }) => R
    : F;

export type EraseCallbacks<D, Nested = object> = {
    [K in keyof D]: K extends keyof Nested ? EraseCallbacks<D[K], Nested[K]> : EraseArgs<D[K]>;
};
