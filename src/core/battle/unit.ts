import * as battlefield from "../battlefield/unit.js";
import type { State as BattlefieldState } from "../battlefield/state.js";
import type { Id, LeaveReason, Unit } from "../unit/unit.js";
import * as units from "../unit/query.js";
import * as skills from "../unit/capability/skill/operations.js";
import { ref as activationRef } from "../unit/capability/skill/activation.js";
import { hasSkill } from "../unit/capability/skill/capability.js";
import { cancel as cancelBurst } from "../unit/capability/elemental/operations.js";
import { ref as burstRef } from "../unit/capability/elemental/burst.js";
import { hasElemental } from "../unit/capability/elemental/capability.js";
import { cancelForUnit } from "../unit/action/operations.js";
import * as blocking from "./blocking/operations.js";
import { closeLifetime } from "./execution/lifetime.js";
import * as dependency from "../unit/effect/dependency.js";
import type { State as BattleState } from "./state.js";
import { notifyUnitLeave } from "./mechanism.js";
import { recordUnitDeployment, refundUnit, recycleUnitCard } from "./deployment/deployment.js";
import * as occupancy from "./occupancy.js";
import * as hooks from "../hook.js";

/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters -- Accept capability-bearing object literals while returning only BattleState. */
export function add<U extends Unit>(battle: BattleState, unit: U): BattleState {
    const previous = battle.battlefield;
    const next = battlefield.add(previous, unit);
    battle = publishBattlefield(battle, next, [{ previousUnit: undefined, nextUnit: unit }]);
    battle = blocking.maintain(battle);
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

export function update<U extends Unit>(battle: BattleState, updates: readonly U[]): BattleState {
    const ids = new Set<Id>();
    const changed: Unit[] = [];

    for (const unit of updates) {
        if (ids.has(unit.id)) {
            throw new RangeError(`duplicate unit update: ${unit.id}`);
        }

        ids.add(unit.id);
        const previous = battle.battlefield.units.get(unit.id);

        if (previous === undefined) {
            throw new RangeError(`unknown unit: ${unit.id}`);
        }

        if (previous.definition !== unit.definition) {
            throw new RangeError("unit definition cannot change during update");
        }

        if (previous !== unit) {
            changed.push(unit);
        }
    }

    if (changed.length === 0) {
        return battle;
    }

    const prepared = blocking.prepareUpdates(battle, changed);
    const published = publishBattlefield(
        battle,
        battlefield.update(battle.battlefield, prepared),
        prepared.map((unit) => ({
            previousUnit: battle.battlefield.units.get(unit.id),
            nextUnit: unit,
        })),
    );

    const settled = blocking.settleUpdates(
        published,
        blocking.changes(battle, published, prepared),
    );

    return occupancy.notify(
        settled,
        battle.battlefield,
        published.battlefield,
        prepared.map((unit) => unit.id),
    );
}
/* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */

export function remove(battle: BattleState, unitId: Id, reason: LeaveReason): BattleState {
    const unit = battle.battlefield.units.get(unitId);

    if (unit === undefined || unit.lifecycle === "LEAVING") {
        return battle;
    }

    const reference = units.ref(unit);
    const lifetime = { type: "UNIT" as const, ref: reference };
    battle = update(battle, [{ ...unit, lifecycle: "LEAVING" }]);
    const leaving = units.get(battle, reference);

    if (leaving !== undefined) {
        battle = refundUnit(battle, leaving, reason, battle.tick);

        if (hasSkill(leaving) && leaving.skill.active !== null) {
            battle = skills.cancel(battle, activationRef(leaving.skill.active), reason);
        }
    }

    battle = cancelForUnit(battle, reference, "SOURCE_ABSENT", reason);
    const elementalHost = units.get(battle, reference);

    if (
        elementalHost !== undefined &&
        hasElemental(elementalHost) &&
        elementalHost.elemental.burst !== null
    ) {
        battle = cancelBurst(battle, burstRef(elementalHost.elemental.burst), reason);
    }

    battle = closeLifetime(battle, lifetime, reason);

    const departing = units.get(battle, reference);

    if (departing !== undefined) {
        const previous = battle.battlefield;
        const next = battlefield.remove(previous, reference);
        battle = publishBattlefield(battle, next, [
            { previousUnit: departing, nextUnit: undefined },
        ]);
        battle = blocking.maintain({
            ...battle,
            removedUnits: [...battle.removedUnits, { unitId, reason, unit: departing }],
        });
        battle = occupancy.notify(battle, previous, next, [unitId]);
        battle = recycleUnitCard(battle, departing, reason, battle.tick);
    }

    const departure = { unit, reason };

    const entries = unit.definition.hooks.filter((entry) => entry.stage === "leave");
    battle = hooks.dispatch(battle, departure, undefined, {
        candidates: () => entries.map(({ id }) => id),
        find: (_current, id) => entries.find((entry) => entry.id === id),
    }).state;

    return notifyUnitLeave(battle, departure);
}

export function advance(battle: BattleState): BattleState {
    const candidates = units.all(battle).map(units.ref).toArray();

    for (const reference of candidates) {
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
    transitions: readonly dependency.UnitTransition[],
): BattleState {
    if (next === state.battlefield) {
        return state;
    }

    const nextDependency =
        state.battlefield.units === next.units
            ? state.effect.dependency
            : dependency.derive(state.effect.dependency, transitions);

    return {
        ...state,
        battlefield: next,
        effect:
            nextDependency === state.effect.dependency
                ? state.effect
                : { ...state.effect, dependency: nextDependency },
    };
}
