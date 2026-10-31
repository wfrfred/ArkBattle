import * as hooks from "../hook.js";
import type { State as BattlefieldState } from "../battlefield/state.js";
import type { Departure, Id } from "../unit/unit.js";
import type { State as BattleState } from "./state.js";

export interface RegistrationChange {
    readonly previous: BattlefieldState;
    readonly next: BattlefieldState;
    readonly changed: readonly Id[];
}

export interface Events {
    readonly registrationChanged: RegistrationChange;
    readonly leave: Departure;
}

export type Key = keyof Events;

export type Hook<E> = hooks.Hook<E, void>;

export type State = { readonly [K in Key]: readonly Hook<Events[K]>[] };

export function setHook<K extends Key>(
    battle: BattleState,
    key: K,
    entry: Hook<Events[K]>,
): BattleState {
    const entries = hooks.set(battle.unitHooks[key], entry);

    return entries === battle.unitHooks[key]
        ? battle
        : { ...battle, unitHooks: { ...battle.unitHooks, [key]: entries } };
}

export function removeHook(battle: BattleState, key: Key, id: string): BattleState {
    const entries = hooks.remove<State[Key][number]>(battle.unitHooks[key], id);

    return entries === battle.unitHooks[key]
        ? battle
        : { ...battle, unitHooks: { ...battle.unitHooks, [key]: entries } };
}

export function dispatch<K extends Key>(
    battle: BattleState,
    key: K,
    event: Events[K],
): BattleState {
    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => current.unitHooks[key].map(({ id }) => id),
        find: (current, id) => {
            const entries = current.unitHooks[key] as readonly Hook<Events[K]>[];

            return entries.find((entry) => entry.id === id);
        },
    }).state;
}
