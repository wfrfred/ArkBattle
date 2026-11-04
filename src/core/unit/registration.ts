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

interface KeyedOperations<U extends Unit, P extends keyof U, K extends RegistrationKey<U[P]>> {
    readonly set: <Q extends K>(
        reference: Ref<U>,
        ...args: [key: Q, entry: RegistrationEntry<U[P][NoInfer<Q>]>] & SetArguments<U[P], K>
    ) => Change;
    readonly remove: (reference: Ref<U>, key: K, id: string) => Change;
}

type FieldOperations<U extends Unit, P extends keyof U, K extends RegistrationKey<U[P]>> = {
    [F in K]: {
        readonly set: (reference: Ref<U>, entry: RegistrationEntry<U[P][F]>) => Change;
        readonly remove: (reference: Ref<U>, id: string) => Change;
    };
}[K];

export function createRegistrationOperations<
    U extends Unit,
    P extends keyof U,
    K extends RegistrationKey<U[P]>,
>(property: P, field: K): FieldOperations<U, P, K>;
export function createRegistrationOperations<
    U extends Unit,
    P extends keyof U,
    K extends RegistrationKey<U[P]>,
>(property: P): KeyedOperations<U, P, K>;
export function createRegistrationOperations<
    U extends Unit,
    P extends keyof U,
    K extends RegistrationKey<U[P]>,
>(property: P, field?: K): KeyedOperations<U, P, K> | FieldOperations<U, P, K> {
    return {
        set(reference: Ref<U>, ...args: [K, Entry] | [Entry]) {
            const key = (field ?? args[0]) as K;
            const entry = (field === undefined ? args[1] : args[0]) as Entry;

            return createChange(reference, (self) => {
                const state = self[property] as U[P] & Record<K, readonly Entry[]>;
                const entries = set(state[key], entry);

                return entries === state[key]
                    ? self
                    : { ...self, [property]: { ...state, [key]: entries } };
            });
        },
        remove(reference: Ref<U>, ...args: [K, string] | [string]) {
            const key = (field ?? args[0]) as K;
            const id = (field === undefined ? args[1] : args[0]) as string;

            return createChange(reference, (self) => {
                const state = self[property] as U[P] & Record<K, readonly Entry[]>;
                const entries = remove(state[key], id);

                return entries === state[key]
                    ? self
                    : { ...self, [property]: { ...state, [key]: entries } };
            });
        },
    } as KeyedOperations<U, P, K> | FieldOperations<U, P, K>;
}
