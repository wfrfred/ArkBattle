import { assertNonnegativeSafeInteger, assertSafeInteger } from "../common/assert.js";
import type { Entry } from "../common/collection/entries.js";
import { roundToEven } from "../common/math.js";
import { replaceIn } from "../common/object.js";
import { ref, type Ref } from "../common/ref.js";
import * as hooks from "../hook.js";
import type { RemovedHook } from "../unit/hook.js";
import type { Unit } from "../unit/unit.js";
import type { State as BattleState } from "./state.js";

export interface State {
    readonly balance: number;
    readonly temporary: number;
    readonly pending: ReadonlyMap<Ref<Unit>, number>;
    readonly hooks: hooks.Hooks;
}

export const beforeModify = hooks.key<hooks.Hook<"BALANCE" | "TEMPORARY", number>, State>(
    "battle.lifePoints.beforeModify",
);

export const modified = hooks.key<
    hooks.Hook<{ readonly balanceDelta: number; readonly temporaryDelta: number }, void>,
    State
>("battle.lifePoints.modified");

export function initialize(balance: number, temporary: number): State {
    assertNonnegativeSafeInteger(balance, "life point balance");
    assertNonnegativeSafeInteger(temporary, "temporary life points");

    return { balance, temporary, pending: new Map(), hooks: hooks.Hooks.empty() };
}

export function register(battle: BattleState, reference: Ref<Unit>, amount: number): BattleState {
    assertNonnegativeSafeInteger(amount, "pending life point loss");

    const { pending } = battle.lifePoints;
    if ((pending.get(reference) ?? 0) === amount) {
        return battle;
    }

    const next = new Map(pending);
    if (amount === 0) {
        next.delete(reference);
    } else {
        next.set(reference, amount);
    }

    return replaceIn(battle, ["lifePoints", "pending"], next);
}

export function setHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, State>,
    entry: NoInfer<H>,
): BattleState {
    const next = battle.lifePoints.hooks.set(key, entry);

    return replaceIn(battle, ["lifePoints", "hooks"], next);
}

export function removeHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, State>,
    id: string,
): BattleState {
    const next = battle.lifePoints.hooks.remove(key, id);

    return replaceIn(battle, ["lifePoints", "hooks"], next);
}

function apply(battle: BattleState, target: "BALANCE" | "TEMPORARY", delta: number): BattleState {
    const result = hooks.dispatch(battle, target, delta, {
        candidates: (current) => current.lifePoints.hooks.get(beforeModify),
        find: (current, id) => current.lifePoints.hooks.find(beforeModify, id),
    });
    battle = result.state;

    const amount = roundToEven(result.value);
    const { lifePoints } = battle;
    let { balance, temporary } = lifePoints;
    if (amount < 0) {
        const loss = -amount;
        const consumed = Math.min(temporary, loss);
        temporary -= consumed;
        balance = Math.max(0, balance - (loss - consumed));
    } else if (target === "BALANCE") {
        balance += amount;
    } else {
        temporary += amount;
    }

    const balanceDelta = balance - lifePoints.balance;
    const temporaryDelta = temporary - lifePoints.temporary;
    if (balanceDelta === 0 && temporaryDelta === 0) {
        return battle;
    }

    battle = replaceIn(battle, ["lifePoints"], { ...lifePoints, balance, temporary });

    return hooks.dispatch(battle, { balanceDelta, temporaryDelta }, undefined, {
        candidates: (current) => current.lifePoints.hooks.get(modified),
        find: (current, id) => current.lifePoints.hooks.find(modified, id),
    }).state;
}

export function modify(battle: BattleState, delta: number): BattleState {
    assertSafeInteger(delta, "life point modification");

    return apply(battle, "BALANCE", delta);
}

export function addTemporary(battle: BattleState, amount: number): BattleState {
    assertNonnegativeSafeInteger(amount, "temporary life point addition");

    return apply(battle, "TEMPORARY", amount);
}

export const removedHook: RemovedHook = {
    id: "@lifePoints/resolve-unit",
    priority: 0,
    invoke: (battle, { unit, reason }) => {
        const reference = ref(unit);
        const amount = battle.lifePoints.pending.get(reference);
        if (amount === undefined) {
            return { state: battle, value: undefined };
        }

        battle = register(battle, reference, 0);

        return {
            state: reason === "EXIT" ? modify(battle, -amount) : battle,
            value: undefined,
        };
    },
};
