import * as battlefield from "../battlefield/unit.js";
import type { State as BattlefieldState } from "../battlefield/state.js";
import type { Id, LeaveReason, Unit, Departure } from "../unit/unit.js";
import * as units from "../unit/query.js";
import * as skills from "../unit/skill/operations.js";
import { hasSkill } from "../unit/capability/skill/capability.js";
import { hasBlockable } from "../unit/capability/blocking/blockable.js";
import * as blocking from "./blocking/operations.js";
import type { State as BattleState } from "./state.js";
import { notifyUnitLeave } from "./mechanism.js";
import { recordUnitDeployment, refundUnit, recycleUnitCard } from "./deployment/lifecycle.js";
import * as occupancy from "./occupancy.js";
import * as hooks from "../hook.js";
import { create as createLifetime } from "../lifetime/operations.js";
import type { Ref } from "../common/ref.js";
import * as dependency from "../lifetime/dependency.js";
import { projectUnit, type UnitTransition } from "./lifetime.js";
import type { Change, Transformation, Settlement } from "../unit/change.js";

/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- Accept capability-bearing object literals while returning only BattleState. */
export function add<U extends Unit>(battle: BattleState, unit: U): BattleState {
    const previous = battle.battlefield;
    const next = battlefield.add(previous, unit);
    battle = publishBattlefield(battle, next, [{ previousUnit: undefined, nextUnit: unit }]);
    battle = recordUnitDeployment(battle, unit);
    const reference = units.ref(unit);
    let current = units.get(battle, reference);
    if (current?.lifecycle === "PRESENT" && hasSkill(current)) {
        battle = skills.enter(battle, units.ref(current));
        current = units.get(battle, reference);
    }

    if (current?.lifecycle === "PRESENT") {
        const entries = current.definition.hooks.filter((entry) => entry.stage === "enter");

        battle = hooks.dispatch(battle, current, undefined, {
            candidates: () => entries.map(({ id }) => id),
            find: (_current, id) => entries.find((entry) => entry.id === id),
            stop: (state) => units.get(state, reference)?.lifecycle !== "PRESENT",
        }).state;
    }

    return occupancy.notify(battle, previous, next, [unit.id]);
}

export function update(battle: BattleState, changes: readonly Change[]): BattleState {
    const prepared = new Map<Id, Unit>();
    const settlements: ((state: BattleState) => BattleState)[] = [];

    for (const change of changes) {
        // Construction pairs the reference and its programs before their types are erased.
        const { ref, transform, settle } = change as Change & {
            readonly ref: Ref<Unit>;
            readonly transform: Transformation<Unit>;
            readonly settle: Settlement<Unit> | undefined;
        };
        const previous = prepared.get(ref.id) ?? units.get(battle, ref);
        if (previous === undefined) {
            throw new RangeError(`unknown unit: ${ref.id}`);
        }

        const next = transform(previous);
        if (next === previous) {
            continue;
        }

        prepared.set(ref.id, next);

        if (settle !== undefined) {
            settlements.push((state) => settle(state, previous));
        }
    }

    battle = replace(battle, [...prepared.values()]);

    for (const settle of settlements) {
        battle = settle(battle);
    }

    return battle;
}

export function replace<U extends Unit>(battle: BattleState, updates: readonly U[]): BattleState {
    return publishBattlefield(
        battle,
        battlefield.update(battle.battlefield, updates),
        updates.map((unit) => ({
            previousUnit: battle.battlefield.units.get(unit.id),
            nextUnit: unit,
        })),
    );
}
/* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */

export const lifetime = createLifetime<Unit, Unit, Departure>({
    kind: "UNIT",
    address: (ref) => [ref.id],
    get: units.get,
    isEnding: (self) => self.lifecycle === "LEAVING",
    begin: (self) => ({ ...self, lifecycle: "LEAVING" }),
    replace: (battle, reference, next) => {
        const leaving =
            hasBlockable(next) && next.blockable.adjustment !== null
                ? { ...next, blockable: { ...next.blockable, adjustment: null } }
                : next;

        return blocking.release(replace(battle, [leaving]), reference);
    },
    prepare: (battle, reference, _initial, departure) =>
        refundUnit(battle, units.get(battle, reference)!, departure.reason, battle.tick),
    finalize: (battle, reference, departure) => {
        const departing = units.get(battle, reference)!;
        const { reason } = departure;
        const previous = battle.battlefield;
        const next = battlefield.remove(previous, reference);
        battle = publishBattlefield(battle, next, [
            { previousUnit: departing, nextUnit: undefined },
        ]);
        battle = {
            ...battle,
            removedUnits: [
                ...battle.removedUnits,
                { unitId: reference.id, reason, unit: departing },
            ],
        };
        battle = occupancy.notify(battle, previous, next, [reference.id]);
        battle = recycleUnitCard(battle, departing, reason, battle.tick);

        const entries = departure.unit.definition.hooks.filter((entry) => entry.stage === "leave");
        battle = hooks.dispatch(battle, departure, undefined, {
            candidates: () => entries.map(({ id }) => id),
            find: (_current, id) => entries.find((entry) => entry.id === id),
        }).state;

        return notifyUnitLeave(battle, departure);
    },
    reason: (departure) => departure.reason,
});

export function remove(battle: BattleState, unitId: Id, reason: LeaveReason): BattleState {
    const reference = { id: unitId } as Ref<Unit>;
    const unit = units.get(battle, reference);
    if (unit === undefined) {
        return battle;
    }

    return lifetime.end(battle, reference, { unit, reason });
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle);

    for (const candidate of candidates) {
        const reference = units.ref(candidate);
        const self = units.get(battle, reference);
        if (self?.lifecycle === "PRESENT") {
            const entries = self.definition.hooks.filter((entry) => entry.stage === "tick");

            battle = hooks.dispatch(battle, self, undefined, {
                candidates: () => entries.map(({ id }) => id),
                find: (_current, id) => entries.find((entry) => entry.id === id),
                stop: (state) => units.get(state, reference)?.lifecycle !== "PRESENT",
            }).state;
        }
    }

    return battle;
}

function publishBattlefield(
    state: BattleState,
    next: BattlefieldState,
    transitions: readonly UnitTransition[],
): BattleState {
    if (next === state.battlefield) {
        return state;
    }

    const dependencies = dependency.derive(
        state.lifetime.dependencies,
        transitions.flatMap(({ previousUnit, nextUnit }) => {
            const previous = new Map(
                projectUnit(previousUnit).map((entry) => [dependency.key(entry.target), entry]),
            );
            const changes: dependency.Transition[] = [];

            for (const entry of projectUnit(nextUnit)) {
                const identity = dependency.key(entry.target);
                changes.push({ previous: previous.get(identity), next: entry });
                previous.delete(identity);
            }
            for (const entry of previous.values()) {
                changes.push({ previous: entry, next: undefined });
            }

            return changes;
        }),
    );

    return {
        ...state,
        battlefield: next,
        lifetime:
            dependencies === state.lifetime.dependencies
                ? state.lifetime
                : { ...state.lifetime, dependencies },
    };
}
