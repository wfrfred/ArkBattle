import * as battlefield from "../battlefield/unit.js";
import type { State as BattlefieldState } from "../battlefield/state.js";
import type { End, Unit, Departure } from "./unit.js";
import * as units from "./query.js";
import { appendEvents, type State as BattleState } from "../battle/state.js";
import { create as createLifetime } from "../lifetime/operations.js";
import type { Ref } from "../common/ref.js";
import { dispatch as dispatchObservers, leave as unitLeave } from "../battle/unit-hook.js";
import type { Change } from "./change.js";
import * as lifecycle from "./hook.js";
import { dispatch } from "../hook.js";

/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- Accept capability-bearing object literals while returning only BattleState. */
export function add<U extends Unit>(battle: BattleState, unit: U): BattleState {
    const next = battlefield.add(battle.battlefield, unit);
    battle = publishBattlefield(battle, next);
    const reference = units.ref(unit);

    return dispatch(battle, unit, undefined, {
        candidates: () => unit.hooks.get(lifecycle.enter),
        find: (current, id) => {
            const self = units.get(current, reference);

            return self?.lifecycle === "ACTIVE" ? self.hooks.find(lifecycle.enter, id) : undefined;
        },
    }).state;
}

export function update<U extends Unit>(
    battle: BattleState,
    reference: Ref<U>,
    change: Change<NoInfer<U>>,
): BattleState {
    const self = units.get(battle, reference);
    if (self === undefined) {
        throw new RangeError(`unknown unit: ${reference.id}`);
    }

    const { next, settlements } = change(self);
    battle = replace(battle, [next]);

    for (const settle of settlements) {
        battle = settle(battle);
    }

    return battle;
}

export function replace<U extends Unit>(battle: BattleState, updates: readonly U[]): BattleState {
    return publishBattlefield(battle, battlefield.update(battle.battlefield, updates));
}
/* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */

export const lifetime = createLifetime<Unit, Unit, Departure>({
    kind: "UNIT",
    address: (ref) => [ref.id],
    get: units.get,
    isEnding: (self) => self.lifecycle === "ENDING",
    begin: (self) => ({ ...self, lifecycle: "ENDING" }),
    replace: (battle, _reference, next) => replace(battle, [next]),
    prepare: (battle, reference, _initial, departure) =>
        dispatch(battle, departure, undefined, {
            candidates: (current) => units.get(current, reference)!.hooks.get(lifecycle.prepare),
            find: (current, id) => units.get(current, reference)!.hooks.find(lifecycle.prepare, id),
        }).state,
    finalize: (battle, reference, departure) => {
        const departing = units.get(battle, reference)!;
        const entries = departing.hooks.get(lifecycle.leave);
        const { reason } = departure;
        const next = battlefield.remove(battle.battlefield, reference);
        battle = publishBattlefield(battle, next);
        battle = appendEvents(battle, [
            {
                type: "UNIT_REMOVED",
                tick: battle.tick,
                unitId: reference.id,
                reason,
                unit: departing,
            },
        ]);

        battle = dispatch(battle, departure, undefined, {
            candidates: () => entries,
            find: (_current, id) => entries.find((entry) => entry.id === id),
        }).state;

        return dispatchObservers(battle, unitLeave, departure);
    },
    reason: (departure) => departure.reason,
});

export function remove(battle: BattleState, reference: Ref<Unit>, end: End): BattleState {
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        return battle;
    }

    return lifetime.end(battle, reference, { ...end, unit });
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle);

    for (const candidate of candidates) {
        const reference = units.ref(candidate);
        const self = units.get(battle, reference);
        if (self?.lifecycle !== "ACTIVE") {
            continue;
        }

        battle = dispatch(battle, self, undefined, {
            candidates: () => self.hooks.get(lifecycle.tick),
            find: (current, id) => {
                const unit = units.get(current, reference);

                return unit?.lifecycle === "ACTIVE"
                    ? unit.hooks.find(lifecycle.tick, id)
                    : undefined;
            },
        }).state;
    }

    return battle;
}

function publishBattlefield(state: BattleState, next: BattlefieldState): BattleState {
    if (next === state.battlefield) {
        return state;
    }

    return { ...state, battlefield: next };
}
