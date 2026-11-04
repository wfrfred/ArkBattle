import type { Ref } from "../common/ref.js";
import { type Entry, set, remove } from "../hook.js";
import { createChange, type Change } from "./change.js";
import type { Unit } from "./unit.js";

type RegistrationKey<S> = {
    [K in keyof S]-?: S[K] extends readonly Entry[] ? K : never;
}[keyof S];

type RegistrationEntry<T> = T extends readonly (infer E)[] ? E : never;

type SetArguments<S, K extends RegistrationKey<S>> = {
    [P in K]: [key: P, entry: RegistrationEntry<S[P]>];
}[K];

export function createRegistrationOperations<
    U extends Unit,
    P extends keyof U,
    K extends RegistrationKey<U[P]>,
>(
    property: P,
): {
    readonly set: <Q extends K>(
        reference: Ref<U>,
        ...args: [key: Q, entry: RegistrationEntry<U[P][NoInfer<Q>]>] & SetArguments<U[P], K>
    ) => Change;
    readonly remove: (reference: Ref<U>, key: K, id: string) => Change;
} {
    return {
        set(reference, ...args) {
            const [key, entry] = args as [K, Entry];

            return createChange(reference, (self) => {
                const state = self[property] as U[P] & Record<K, readonly Entry[]>;
                const entries = set(state[key], entry);

                return entries === state[key]
                    ? self
                    : { ...self, [property]: { ...state, [key]: entries } };
            });
        },
        remove(reference, key, id) {
            return createChange(reference, (self) => {
                const state = self[property] as U[P] & Record<K, readonly Entry[]>;
                const entries = remove(state[key], id);

                return entries === state[key]
                    ? self
                    : { ...self, [property]: { ...state, [key]: entries } };
            });
        },
    };
}
