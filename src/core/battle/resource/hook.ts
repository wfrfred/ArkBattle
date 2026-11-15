import type { Ref } from "../../common/ref.js";
import * as hooks from "../../hook.js";
import type { Unit } from "../../unit/unit.js";
import * as units from "../../unit/query.js";
import type { Result, State as BattleState } from "../state.js";

export interface Entry<C, T> extends hooks.Hook<C, T> {
    readonly priority?: number;
}

export function dispatch<C, T>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<Entry<C, T>, any>,
    context: C,
    initial: T,
    options?: hooks.Options,
    stop?: (battle: BattleState) => boolean,
): Result<T>;
export function dispatch<C, T, H extends Entry<C, T>>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<H, any>,
    context: C,
    initial: T,
    options?: hooks.Options,
    stop?: (battle: BattleState) => boolean,
): Result<T>;
export function dispatch<C, T, H extends Entry<C, T>>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<H, any>,
    context: C,
    initial: T,
    options?: hooks.Options,
    stop?: (battle: BattleState) => boolean,
): Result<T> {
    if (owner === null) {
        return { state: battle, value: initial };
    }

    return hooks.dispatch(battle, context, initial, {
        candidates(current) {
            const unit = units.get(current, owner);

            return unit?.lifecycle === "PRESENT"
                ? [...unit.hooks.get(key)]
                      .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                      .map(({ id }) => id)
                      .filter((id) => !hooks.excluded(options, key, id))
                : [];
        },
        find(current, id) {
            const unit = units.get(current, owner);

            return unit?.lifecycle === "PRESENT" ? unit.hooks.find(key, id) : undefined;
        },
        ...(stop === undefined ? {} : { stop: (current: BattleState) => stop(current) }),
    });
}
