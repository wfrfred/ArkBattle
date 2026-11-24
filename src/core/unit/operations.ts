import * as battlefield from "../battlefield/unit.js";
import { replaceIn } from "../common/object.js";
import type { End, Unit } from "./unit.js";
import * as units from "./query.js";
import { appendEvents, type State as BattleState } from "../battle/state.js";
import { create as createLifetime } from "../lifetime/index.js";
import { register } from "../lifetime/operations.js";
import type { Ref } from "../common/ref.js";
import * as observers from "../battle/unit-hook.js";
import type { Change } from "./change.js";
import * as lifecycle from "./hook.js";
import { dispatch } from "../hook.js";

/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- Accept capability-bearing object literals while returning only BattleState. */
export function add<U extends Unit>(battle: BattleState, unit: U): BattleState {
    const next = battlefield.add(battle.battlefield, unit);
    battle = replaceIn(battle, ["battlefield"], next);
    const reference = units.ref(unit);
    battle = register(battle, lifetime, reference);

    battle = observers.dispatch(
        battle,
        observers.entered,
        unit,
        (current) => units.get(current, reference)?.lifecycle !== "ACTIVE",
    );

    const entered = units.get(battle, reference);
    if (entered?.lifecycle !== "ACTIVE") {
        return battle;
    }

    return dispatch(battle, entered, undefined, {
        candidates: () => entered.hooks.get(lifecycle.entered),
        find: (current, id) => {
            const self = units.get(current, reference);

            return self?.lifecycle === "ACTIVE"
                ? self.hooks.find(lifecycle.entered, id)
                : undefined;
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
    return replaceIn(battle, ["battlefield"], battlefield.update(battle.battlefield, updates));
}
/* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */

export const lifetime = createLifetime<Unit, End>({
    kind: "UNIT",
    address: (reference) => String(reference.id),
    get: units.get,
    end: {
        prepare: (battle, reference, initial, end) => {
            battle = replace(battle, [{ ...initial, lifecycle: "ENDING" }]);

            return dispatch(battle, { ...end, unit: initial }, undefined, {
                candidates: (current) =>
                    units.get(current, reference)!.hooks.get(lifecycle.removing),
                find: (current, id) =>
                    units.get(current, reference)!.hooks.find(lifecycle.removing, id),
            }).state;
        },
        finalize: (battle, reference, initial, end) => {
            const departing = units.get(battle, reference)!;
            const entries = departing.hooks.get(lifecycle.removed);
            const departure = { ...end, unit: initial };
            const next = battlefield.remove(battle.battlefield, reference);
            battle = replaceIn(battle, ["battlefield"], next);
            battle = appendEvents(battle, [
                {
                    type: "UNIT_REMOVED",
                    tick: battle.tick,
                    unitId: reference.id,
                    reason: end.reason,
                    unit: departing,
                },
            ]);

            battle = dispatch(battle, departure, undefined, {
                candidates: () => entries,
                find: (_current, id) => entries.find((entry) => entry.id === id),
            }).state;

            return observers.dispatch(battle, observers.removed, departure);
        },
    },
});

export function remove(battle: BattleState, reference: Ref<Unit>, end: End): BattleState {
    return lifetime.end(battle, reference, end);
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
