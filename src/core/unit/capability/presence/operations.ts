import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { compose, createChange, optional, type Change } from "../../change.js";
import { cancelForUnit } from "../../action/operations.js";
import * as action from "../action/capability.js";
import * as skill from "../skill/capability.js";
import * as locomotion from "../locomotion/capability.js";
import * as vitality from "../vitality/capability.js";
import type { DamageReceptionRule } from "../vitality/rule.js";
import * as elemental from "../elemental/capability.js";
import { hasBlocker } from "../blocking/blocker.js";
import { hasBlockable } from "../blocking/blockable.js";
import * as blocker from "../blocking/blocker-operations.js";
import * as blockable from "../blocking/blockable-operations.js";
import type { Presence } from "./capability.js";

const restriction = { id: "@presence/absent", allows: () => false };

const hpRestriction: DamageReceptionRule = {
    id: restriction.id,
    allows: (_battle, { request }) => request.nature === "LOSS",
};

export function disappear(): Change<Unit & Presence> {
    const presence = createChange<Unit & Presence>(
        (self) => ({ ...self, presence: { present: false } }),
        (battle, previous) => {
            if (hasBlocker(previous)) {
                battle = blocker.releaseAll(battle, units.ref(previous));
            } else if (hasBlockable(previous)) {
                battle = blockable.release(battle, units.ref(previous));
            }

            return action.hasAction(previous)
                ? cancelForUnit(battle, units.ref(previous), "SOURCE_ABSENT")
                : battle;
        },
    );

    const change = compose(presence, restrictions(false));

    return (self) =>
        self.lifecycle === "PRESENT" ? change(self) : { next: self, settlements: [] };
}

export function appear(position: WorldPosition): Change<Unit & Presence> {
    const presence = createChange<Unit & Presence>(
        (self) => ({ ...self, position, presence: { present: true } }),
        (battle, previous) => {
            if (hasBlocker(previous)) {
                return blocker.releaseAll(battle, units.ref(previous));
            }
            if (hasBlockable(previous)) {
                return blockable.release(battle, units.ref(previous));
            }

            return battle;
        },
    );

    const change = compose(presence, restrictions(true));

    return (self) =>
        self.lifecycle === "PRESENT" ? change(self) : { next: self, settlements: [] };
}

function restrictions(present: boolean): Change<Unit> {
    return [
        optional(
            action.hasAction,
            present ? action.removeRule(restriction.id) : action.setRule(restriction),
        ),
        optional(
            skill.hasSkill,
            present
                ? skill.removeRule("activationRules", restriction.id)
                : skill.setRule("activationRules", restriction),
        ),
        optional(
            locomotion.hasLocomotion,
            present ? locomotion.removeRule(restriction.id) : locomotion.setRule(restriction),
        ),
        optional(
            hasBlocker,
            present ? blocker.removeRule(restriction.id) : blocker.setRule(restriction),
        ),
        optional(
            hasBlockable,
            present ? blockable.removeRule(restriction.id) : blockable.setRule(restriction),
        ),
        optional(
            vitality.hasVitality,
            present ? vitality.removeRule(restriction.id) : vitality.setRule(hpRestriction),
        ),
        optional(
            elemental.hasElemental,
            present
                ? elemental.removeRule("damageRules", restriction.id)
                : elemental.setRule("damageRules", restriction),
        ),
    ].reduce(compose);
}
