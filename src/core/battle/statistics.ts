import { assertNonnegativeSafeInteger } from "../common/assert.js";
import { replaceIn } from "../common/object.js";
import { ref, type Ref } from "../common/ref.js";
import type { RemovedHook } from "../unit/hook.js";
import type { Unit } from "../unit/unit.js";
import type { State as BattleState } from "./state.js";

export type Policy = "NORMAL" | "ALWAYS_KILLED";

export interface State {
    readonly total: number;
    readonly finished: number;
    readonly killed: number;
    readonly pending: ReadonlyMap<Ref<Unit>, Policy>;
}

export function initialize(total: number): State {
    assertNonnegativeSafeInteger(total, "statistics total");

    return { total, finished: 0, killed: 0, pending: new Map() };
}

export function register(battle: BattleState, reference: Ref<Unit>, policy: Policy): BattleState {
    const { pending } = battle.statistics;
    if (pending.get(reference) === policy) {
        return battle;
    }

    const next = new Map(pending);
    next.set(reference, policy);

    return replaceIn(battle, ["statistics", "pending"], next);
}

function settle(battle: BattleState, reference: Ref<Unit>, killed: boolean): BattleState {
    const { statistics } = battle;
    const policy = statistics.pending.get(reference);
    if (policy === undefined) {
        return battle;
    }

    const pending = new Map(statistics.pending);
    pending.delete(reference);

    return replaceIn(battle, ["statistics"], {
        ...statistics,
        finished: statistics.finished + 1,
        killed: statistics.killed + (killed || policy === "ALWAYS_KILLED" ? 1 : 0),
        pending,
    });
}

export function markKilled(battle: BattleState, reference: Ref<Unit>): BattleState {
    return settle(battle, reference, true);
}

export const removedHook: RemovedHook = {
    id: "@statistics/resolve-unit",
    priority: 0,
    invoke: (battle, { unit, reason }) => ({
        state: settle(battle, ref(unit), reason === "DEATH"),
        value: undefined,
    }),
};
