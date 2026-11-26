import * as entries from "../common/collection/entries.js";
import { replaceIn } from "../common/object.js";
import type { State as BattleState } from "../battle/state.js";
import { createChange, type Change } from "./change.js";
import type { Unit } from "./unit.js";

type RegistrationKey<S> = {
    [K in keyof S]-?: S[K] extends readonly entries.Entry[] ? K : never;
}[keyof S];

type RegistrationEntry<T> = T extends readonly (infer E extends entries.Entry)[] ? E : never;

type SetArguments<S, K extends RegistrationKey<S>> = {
    [P in K]: [key: P, entry: RegistrationEntry<S[P]>];
}[K];

interface KeyedOperations<U extends Unit, P extends keyof U, K extends RegistrationKey<U[P]>> {
    readonly set: <Q extends K>(
        ...args: [key: Q, entry: RegistrationEntry<U[P][NoInfer<Q>]>] & SetArguments<U[P], K>
    ) => Change<U>;
    readonly remove: (key: K, id: string) => Change<U>;
}

type FieldOperations<U extends Unit, P extends keyof U, K extends RegistrationKey<U[P]>> = {
    [F in K]: {
        readonly set: (entry: RegistrationEntry<U[P][F]>) => Change<U>;
        readonly remove: (id: string) => Change<U>;
    };
}[K];

export function createRegistrationOperations<U extends Unit>() {
    function registration<P extends keyof U, K extends RegistrationKey<U[P]>>(
        property: P,
        field: K,
        settle?: (battle: BattleState, previous: U) => BattleState,
    ): FieldOperations<U, P, K>;
    function registration<P extends keyof U, K extends RegistrationKey<U[P]>>(
        property: P,
    ): KeyedOperations<U, P, K>;
    function registration<P extends keyof U, K extends RegistrationKey<U[P]>>(
        property: P,
        field?: K,
        settle?: (battle: BattleState, previous: U) => BattleState,
    ) {
        const replaceRegistration = replaceIn as <T extends U, Q extends K>(
            self: T,
            path: readonly [P, Q],
            value: readonly RegistrationEntry<U[P][Q]>[],
        ) => T;

        function change<Q extends K>(
            key: Q,
            update: (
                current: readonly RegistrationEntry<U[P][Q]>[],
            ) => readonly RegistrationEntry<U[P][Q]>[],
        ): Change<U> {
            return createChange<U>((self) => {
                const current = self[property][key] as readonly RegistrationEntry<U[P][Q]>[];

                return replaceRegistration(self, [property, key], update(current));
            }, settle);
        }

        const set = <Q extends K>(key: Q, entry: RegistrationEntry<U[P][Q]>) =>
            change(key, (current) => entries.set(current, entry));
        const remove = (key: K, id: string) =>
            change(key, (current) => entries.remove(current, id));

        if (field === undefined) {
            return { set, remove };
        }

        return {
            set: (entry: RegistrationEntry<U[P][K]>) => set(field, entry),
            remove: (id: string) => remove(field, id),
        };
    }

    return registration;
}
