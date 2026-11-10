import * as blocking from "../../../battle/blocking/operations.js";
import { relations, usedCapacity } from "../../../battle/blocking/query.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as entries from "../../../common/collection/entries.js";
import type * as contribution from "../../contribution/contribution.js";
import { createChange, type Change } from "../../change.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { PrepareHook } from "../../hook.js";
import * as units from "../../query.js";
import type { Rule } from "./rule.js";
import {
    DEFAULT_RADIUS,
    resolveCapacity,
    type Blocker,
    type Hooks,
    type Layer,
    type Modifier,
} from "./blocker.js";

export const prepare: PrepareHook = {
    id: "@blocker/prepare",
    invoke: (battle, { unit }) => ({
        state: releaseAll(battle, units.ref(unit as Unit & Blocker)),
        value: undefined,
    }),
};

export function releaseAll(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const self = units.get(battle, reference);

    if (self === undefined) {
        return battle;
    }

    return blocking.release(battle, self.blocker.relations);
}

function settleRules(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    for (const relation of relations(battle, reference)) {
        battle = blocking.maintain(battle, relation);
    }

    return battle;
}

export function settleCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    let current = units.get(battle, reference);

    while (current !== undefined) {
        if (
            usedCapacity(battle, reference) <=
            resolveCapacity(current.definition.blocker, current.blocker)
        ) {
            return battle;
        }

        const relation = current.blocker.relations.at(-1)!;
        battle = blocking.release(battle, [relation]);
        current = units.get(battle, reference);
    }

    return battle;
}

export function setRule(rule: Rule): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const rules = entries.set(self.blocker.rules, rule);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle, previous) => settleRules(battle, units.ref(previous)),
    );
}

export function removeRule(id: string): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const rules = entries.remove(self.blocker.rules, id);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle, previous) => settleRules(battle, units.ref(previous)),
    );
}

export function setCapacityContribution(
    entry: contribution.Contribution<readonly Modifier[]>,
): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const capacity = entries.set(self.blocker.capacity, entry);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle, previous) => settleCapacity(battle, units.ref(previous)),
    );
}

export function removeCapacityContribution(id: string): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const capacity = entries.remove(self.blocker.capacity, id);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle, previous) => settleCapacity(battle, units.ref(previous)),
    );
}

export function setLayer(layer: Layer): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) =>
            self.blocker.layer === layer
                ? self
                : {
                      ...self,
                      blocker: {
                          ...self.blocker,
                          layer,
                          radius: self.definition.blocker.radius ?? DEFAULT_RADIUS[layer],
                      },
                  },
        (battle, previous) => releaseAll(battle, units.ref(previous)),
    );
}

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Blocker,
    "blocker",
    keyof Hooks
>("blocker");
