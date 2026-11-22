import * as hooks from "../hook.js";
import type { Entry } from "../common/collection/entries.js";
import type { EnteredHook, RemovedHook } from "../unit/hook.js";
import type { State as BattleState } from "./state.js";

export const entered = hooks.key<EnteredHook, BattleState>("battle.unit.entered");

export const removed = hooks.key<RemovedHook, BattleState>("battle.unit.removed");

export function setHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, BattleState>,
    entry: NoInfer<H>,
): BattleState {
    const next = battle.unitHooks.set(key, entry);

    return next === battle.unitHooks ? battle : { ...battle, unitHooks: next };
}

export function removeHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, BattleState>,
    id: string,
): BattleState {
    const next = battle.unitHooks.remove(key, id);

    return next === battle.unitHooks ? battle : { ...battle, unitHooks: next };
}

export function dispatch<C>(
    battle: BattleState,
    key: hooks.Key<hooks.Hook<C, void>, BattleState>,
    event: NoInfer<C>,
    stop?: (battle: BattleState) => boolean,
): BattleState {
    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => current.unitHooks.get(key),
        find: (current, id) => current.unitHooks.find(key, id),
        ...(stop === undefined ? {} : { stop }),
    }).state;
}
