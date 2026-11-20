import * as hooks from "../hook.js";
import type { Entry } from "../common/collection/entries.js";
import type { Departure } from "../unit/unit.js";
import type { State as BattleState } from "./state.js";

export type Hook = hooks.Hook<Departure, void>;

export const removed = hooks.key<Hook, BattleState>("battle.unit.removed");

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

export function dispatch(
    battle: BattleState,
    key: hooks.Key<Hook, BattleState>,
    event: Departure,
): BattleState {
    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => current.unitHooks.get(key),
        find: (current, id) => current.unitHooks.find(key, id),
    }).state;
}
