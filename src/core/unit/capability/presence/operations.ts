import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { combine, createChange, type Change } from "../../change.js";
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

export function disappear(reference: Ref<Unit & SpatialPresence>): Change {
    return combine(reference, (self) => {
        if (self.lifecycle !== "PRESENT") {
            return [];
        }

        return [
            createChange(
                reference,
                (current) => {
                    const next = { ...current, spatialPresence: { present: false } };

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
            ),
            ...restrictions(self, false),
        ];
    });
}

export function appear(reference: Ref<Unit & SpatialPresence>, position: WorldPosition): Change {
    return combine(reference, (self) => {
        if (self.lifecycle !== "PRESENT") {
            return [];
        }

        return [
            createChange(
                reference,
                (current) => {
                    const next = { ...current, position, spatialPresence: { present: true } };

                    return hasBlockable(next)
                        ? { ...next, blockable: { ...next.blockable, adjustment: null } }
                        : next;
                },
                releaseOldBlocking,
            ),
            ...restrictions(self, true),
        ];
    });
}

function restrictions(self: Unit, present: boolean): readonly Change[] {
    const changes: Change[] = [];

    if (action.hasAction(self)) {
        changes.push(
            present
                ? action.removeRule(units.ref(self), restriction.id)
                : action.setRule(units.ref(self), restriction),
        );
    }
    if (skill.hasSkill(self)) {
        changes.push(
            present
                ? skill.removeRule(units.ref(self), "activationRules", restriction.id)
                : skill.setRule(units.ref(self), "activationRules", restriction),
        );
    }
    if (locomotion.hasLocomotion(self)) {
        changes.push(
            present
                ? locomotion.removeRule(units.ref(self), restriction.id)
                : locomotion.setRule(units.ref(self), restriction),
        );
    }
    if (hasBlocker(self)) {
        changes.push(
            present
                ? blocker.removeRule(units.ref(self), restriction.id)
                : blocker.setRule(units.ref(self), restriction),
        );
    } else if (hasBlockable(self)) {
        changes.push(
            present
                ? blockable.removeRule(units.ref(self), restriction.id)
                : blockable.setRule(units.ref(self), restriction),
        );
    }
    if (vitality.hasVitality(self)) {
        changes.push(
            present
                ? vitality.removeRule(units.ref(self), restriction.id)
                : vitality.setRule(units.ref(self), restriction),
        );
    }
    if (elemental.hasElemental(self)) {
        changes.push(
            present
                ? elemental.removeRule(units.ref(self), "damageRules", restriction.id)
                : elemental.setRule(units.ref(self), "damageRules", restriction),
        );
    }

    return changes;
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
