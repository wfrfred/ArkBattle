import type { State as BattleState } from "../../../battle/state.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { createChange, type Applied, type Change, type Settlement } from "../../change.js";
import { executionRefs } from "../../action/query.js";
import { cancel } from "../../action/operations.js";
import * as action from "../action/capability.js";
import * as skill from "../skill/capability.js";
import * as locomotion from "../locomotion/capability.js";
import * as vitality from "../vitality/capability.js";
import * as elemental from "../elemental/capability.js";
import { hasBlocker } from "../blocking/blocker.js";
import { hasBlockable } from "../blocking/blockable.js";
import * as blocker from "../blocking/blocker-operations.js";
import * as blockable from "../blocking/blockable-operations.js";
import type { SpatialPresence } from "./capability.js";

const restriction = { id: "@presence/absent", allows: () => false };

export function disappear(): Change<Unit & SpatialPresence> {
    const spatial = createChange<Unit & SpatialPresence>(
        (self) => {
            const next = { ...self, spatialPresence: { present: false } };

            return hasBlockable(next)
                ? { ...next, blockable: { ...next.blockable, adjustment: null } }
                : next;
        },
        (battle, previous) => {
            const executions = action.hasAction(previous) ? executionRefs(previous) : [];
            battle = releaseOldBlocking(battle, previous);

            for (const execution of executions) {
                battle = cancel(battle, execution, "SOURCE_ABSENT");
            }

            return battle;
        },
    );

    return (self) => {
        if (self.lifecycle !== "PRESENT") {
            return { next: self, settlements: [] };
        }

        const applied = spatial(self);
        const restricted = restrictions(applied.next, false);

        return {
            next: restricted.next,
            settlements: [...applied.settlements, ...restricted.settlements],
        };
    };
}

export function appear(position: WorldPosition): Change<Unit & SpatialPresence> {
    const spatial = createChange<Unit & SpatialPresence>((self) => {
        const next = { ...self, position, spatialPresence: { present: true } };

        return hasBlockable(next)
            ? { ...next, blockable: { ...next.blockable, adjustment: null } }
            : next;
    }, releaseOldBlocking);

    return (self) => {
        if (self.lifecycle !== "PRESENT") {
            return { next: self, settlements: [] };
        }

        const applied = spatial(self);
        const restricted = restrictions(applied.next, true);

        return {
            next: restricted.next,
            settlements: [...applied.settlements, ...restricted.settlements],
        };
    };
}

function restrictions<U extends Unit>(self: U, present: boolean): Applied<U> {
    let next = self;
    const settlements: Settlement[] = [];

    if (action.hasAction(next)) {
        const applied = (present ? action.removeRule(restriction.id) : action.setRule(restriction))(
            next,
        );
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (skill.hasSkill(next)) {
        const applied = (
            present
                ? skill.removeRule("activationRules", restriction.id)
                : skill.setRule("activationRules", restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (locomotion.hasLocomotion(next)) {
        const applied = (
            present ? locomotion.removeRule(restriction.id) : locomotion.setRule(restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (hasBlocker(next)) {
        const applied = (
            present ? blocker.removeRule(restriction.id) : blocker.setRule(restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    } else if (hasBlockable(next)) {
        const applied = (
            present ? blockable.removeRule(restriction.id) : blockable.setRule(restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (vitality.hasVitality(next)) {
        const applied = (
            present ? vitality.removeRule(restriction.id) : vitality.setRule(restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (elemental.hasElemental(next)) {
        const applied = (
            present
                ? elemental.removeRule("damageRules", restriction.id)
                : elemental.setRule("damageRules", restriction)
        )(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }

    return { next, settlements };
}

function releaseOldBlocking(battle: BattleState, previous: Unit): BattleState {
    if (hasBlocker(previous)) {
        return blocker.releaseCaptured(battle, previous);
    }
    if (hasBlockable(previous)) {
        const owner = previous.blockable.blocker;
        const current = units.get(battle, units.ref(previous));

        return owner !== null && current?.blockable.blocker === owner
            ? blockable.release(battle, units.ref(previous))
            : battle;
    }

    return battle;
}
