import * as blocking from "../../../battle/blocking/operations.js";
import { relations, usedCapacity } from "../../../battle/blocking/query.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as entries from "../../../common/collection/entries.js";
import type * as contribution from "../../../common/contribution.js";
import { createChange, type Change } from "../../change.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { RemovingHook } from "../../hook.js";
import * as units from "../../query.js";
import type { Restriction } from "./restriction.js";
import {
    DEFAULT_RADIUS,
    resolveCapacity,
    type Blocker,
    type Layer,
    type Modifier,
} from "./blocker.js";

export const removing: RemovingHook = {
    id: "@blocker/prepare",
    priority: 0,
    invoke: (battle, { unit }) => ({
        state: releaseAll(battle, units.ref(unit as Unit & Blocker)),
        value: undefined,
    }),
};

export function releaseAll(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    const self = reference.get(battle);

    if (self === undefined) {
        return battle;
    }

    return blocking.release(battle, self.blocker.relations);
}

function settleRestrictions(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    for (const relation of relations(battle, reference)) {
        battle = blocking.maintain(battle, relation);
    }

    return battle;
}

export function settleCapacity(battle: BattleState, reference: Ref<Unit & Blocker>): BattleState {
    let current = reference.get(battle);

    while (current !== undefined) {
        if (
            usedCapacity(battle, reference) <=
            resolveCapacity(current.definition.blocker, current.blocker)
        ) {
            return battle;
        }

        const relation = current.blocker.relations.at(-1)!;
        battle = blocking.release(battle, [relation]);
        current = reference.get(battle);
    }

    return battle;
}

export function setRestriction(
    entry: contribution.Contribution<Restriction>,
): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const restrictions = entries.set(self.blocker.restrictions, entry);

            return restrictions === self.blocker.restrictions
                ? self
                : { ...self, blocker: { ...self.blocker, restrictions } };
        },
        (battle, previous) => settleRestrictions(battle, units.ref(previous)),
    );
}

export function removeRestriction(id: string): Change<Unit & Blocker> {
    return createChange<Unit & Blocker>(
        (self) => {
            const restrictions = entries.remove(self.blocker.restrictions, id);

            return restrictions === self.blocker.restrictions
                ? self
                : { ...self, blocker: { ...self.blocker, restrictions } };
        },
        (battle, previous) => settleRestrictions(battle, units.ref(previous)),
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
