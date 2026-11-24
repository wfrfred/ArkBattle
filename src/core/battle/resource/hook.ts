import type { Ref } from "../../common/ref.js";
import * as hooks from "../../hook.js";
import type { Unit } from "../../unit/unit.js";
import type { Result, State as BattleState } from "../state.js";

export function dispatch<C, T>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<hooks.Hook<C, T>, any>,
    context: C,
    initial: T,
    options?: hooks.Options,
    stop?: (battle: BattleState) => boolean,
): Result<T>;
export function dispatch<C, T, H extends hooks.Hook<C, T>>(
    battle: BattleState,
    owner: Ref<Unit> | null,
    key: hooks.Key<H, any>,
    context: C,
    initial: T,
    options?: hooks.Options,
    stop?: (battle: BattleState) => boolean,
): Result<T>;
export function dispatch<C, T, H extends hooks.Hook<C, T>>(
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
            const unit = owner.get(current);

            return unit?.lifecycle === "ACTIVE"
                ? unit.hooks.get(key).filter(({ id }) => !hooks.excluded(options, key, id))
                : [];
        },
        find(current, id) {
            const unit = owner.get(current);

            return unit?.lifecycle === "ACTIVE" ? unit.hooks.find(key, id) : undefined;
        },
        ...(stop === undefined ? {} : { stop: (current: BattleState) => stop(current) }),
    });
}
