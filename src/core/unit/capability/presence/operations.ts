import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { compose, createChange, optional, type Change } from "../../change.js";
import { cancelForUnit } from "../action/operations.js";
import * as action from "../action/capability.js";
import * as skill from "../skill/capability.js";
import * as locomotion from "../locomotion/capability.js";
import * as vitality from "../vitality/capability.js";
import type { Restriction } from "../vitality/restriction.js";
import * as elemental from "../elemental/capability.js";
import * as blocker from "../blocking/blocker/index.js";
import * as blockable from "../blocking/blockable/index.js";
import type { Presence } from "./capability.js";

const restrictionId = "@presence/absent";

const restriction = { allows: () => false };

const hpRestriction: Restriction = {
    allows: (_battle, { request }) => request.nature === "LOSS",
};

export function disappear(): Change<Unit & Presence> {
    const presence = createChange<Unit & Presence>(
        (self) => ({ ...self, presence: { present: false } }),
        (battle, previous) => {
            if (blocker.hasBlocker(previous)) {
                battle = blocker.releaseAll(battle, units.ref(previous));
            } else if (blockable.hasBlockable(previous)) {
                battle = blockable.release(battle, units.ref(previous));
            }

            return action.hasAction(previous)
                ? cancelForUnit(battle, units.ref(previous), "SOURCE_ABSENT")
                : battle;
        },
    );

    const change = compose(presence, restrictions(false));

    return (self) => (self.lifecycle === "ACTIVE" ? change(self) : { next: self, settlements: [] });
}

export function appear(position: WorldPosition): Change<Unit & Presence> {
    const presence = createChange<Unit & Presence>(
        (self) => ({ ...self, position, presence: { present: true } }),
        (battle, previous) => {
            if (blocker.hasBlocker(previous)) {
                return blocker.releaseAll(battle, units.ref(previous));
            }
            if (blockable.hasBlockable(previous)) {
                return blockable.release(battle, units.ref(previous));
            }

            return battle;
        },
    );

    const change = compose(presence, restrictions(true));

    return (self) => (self.lifecycle === "ACTIVE" ? change(self) : { next: self, settlements: [] });
}

function restrictions(present: boolean): Change<Unit> {
    const entry = { id: restrictionId, group: null, value: restriction };

    return [
        optional(
            action.hasAction,
            present ? action.removeRestriction(restrictionId) : action.setRestriction(entry),
        ),
        optional(
            skill.hasSkill,
            present
                ? skill.removeRestriction("activationRestrictions", restrictionId)
                : skill.setRestriction("activationRestrictions", entry),
        ),
        optional(
            locomotion.hasLocomotion,
            present
                ? locomotion.removeRestriction(restrictionId)
                : locomotion.setRestriction(entry),
        ),
        optional(
            blocker.hasBlocker,
            present ? blocker.removeRestriction(restrictionId) : blocker.setRestriction(entry),
        ),
        optional(
            blockable.hasBlockable,
            present ? blockable.removeRestriction(restrictionId) : blockable.setRestriction(entry),
        ),
        optional(
            vitality.hasVitality,
            present
                ? vitality.removeRestriction(restrictionId)
                : vitality.setRestriction({ id: restrictionId, group: null, value: hpRestriction }),
        ),
        optional(
            elemental.hasElemental,
            present
                ? elemental.removeRestriction("damageRestrictions", restrictionId)
                : elemental.setRestriction("damageRestrictions", entry),
        ),
    ].reduce(compose);
}
