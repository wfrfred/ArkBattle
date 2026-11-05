import * as blocking from "../../../battle/blocking/operations.js";
import { relations, usedCapacity } from "../../../battle/blocking/query.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as registry from "../../../hook.js";
import * as contribution from "../../contribution/contribution.js";
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

    return self === undefined ? battle : releaseCaptured(battle, self);
}

export function releaseCaptured(battle: BattleState, self: Unit & Blocker): BattleState {
    const blocker = units.ref(self);

    return blocking.release(
        battle,
        self.blocker.blocked.map((blocked) => ({ blocker, blocked })),
    );
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

        const blocked = current.blocker.blocked.at(-1)!;
        battle = blocking.release(battle, [{ blocker: reference, blocked }]);
        current = units.get(battle, reference);
    }

    return battle;
}

export function setRule(reference: Ref<Unit & Blocker>, rule: Rule): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.set(self.blocker.rules, rule);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle) => settleRules(battle, reference),
    );
}

export function removeRule(reference: Ref<Unit & Blocker>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const rules = registry.remove(self.blocker.rules, id);

            return rules === self.blocker.rules
                ? self
                : { ...self, blocker: { ...self.blocker, rules } };
        },
        (battle) => settleRules(battle, reference),
    );
}

export function setCapacityContribution(
    reference: Ref<Unit & Blocker>,
    entry: contribution.Contribution<readonly Modifier[]>,
): Change {
    return createChange(
        reference,
        (self) => {
            const capacity = contribution.set(self.blocker.capacity, entry);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle) => settleCapacity(battle, reference),
    );
}

export function removeCapacityContribution(reference: Ref<Unit & Blocker>, id: string): Change {
    return createChange(
        reference,
        (self) => {
            const capacity = contribution.remove(self.blocker.capacity, id);

            return capacity === self.blocker.capacity
                ? self
                : { ...self, blocker: { ...self.blocker, capacity } };
        },
        (battle) => settleCapacity(battle, reference),
    );
}

export function setLayer(reference: Ref<Unit & Blocker>, layer: Layer): Change {
    return createChange(
        reference,
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
        releaseCaptured,
    );
}

export const { set: setHook, remove: removeHook } = createRegistrationOperations<
    Unit & Blocker,
    "blocker",
    keyof Hooks
>("blocker");
