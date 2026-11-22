type ValidPath<T, P extends readonly PropertyKey[]> = [T] extends [object]
    ? Extract<T, readonly unknown[]> extends never
        ? P extends readonly [infer K extends keyof T, ...infer Rest extends readonly PropertyKey[]]
            ? Rest extends readonly []
                ? readonly [K]
                : readonly [K, ...ValidPath<T[K], Rest>]
            : never
        : never
    : never;

type PathValue<T, P extends readonly PropertyKey[]> = P extends readonly [
    infer K extends keyof T,
    ...infer Rest extends readonly PropertyKey[],
]
    ? Rest extends readonly []
        ? Required<T>[K]
        : PathValue<T[K], Rest>
    : never;

export function replaceIn<T extends object, const P extends readonly PropertyKey[]>(
    state: T,
    path: P & ValidPath<T, P>,
    value: NoInfer<PathValue<T, P>>,
): T;
export function replaceIn(state: object, path: readonly PropertyKey[], value: unknown): object {
    return replaceAt(state, path, value, 0);
}

function replaceAt(
    state: object,
    path: readonly PropertyKey[],
    value: unknown,
    depth: number,
): object {
    const key = path[depth]!;
    const current = (state as Readonly<Record<PropertyKey, unknown>>)[key];
    const next =
        depth === path.length - 1 ? value : replaceAt(current as object, path, value, depth + 1);

    return Object.is(current, next) ? state : { ...state, [key]: next };
}
