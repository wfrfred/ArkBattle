import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import { compose, createChange, optional, type Change } from "../../change.js";
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
        (self) => ({ ...self, spatialPresence: { present: false } }),
        (battle, previous) => {
            const executions = action.hasAction(previous) ? executionRefs(previous) : [];
            if (hasBlocker(previous)) {
                battle = blocker.releaseAll(battle, units.ref(previous));
            } else if (hasBlockable(previous)) {
                battle = blockable.release(battle, units.ref(previous));
            }

            for (const execution of executions) {
                battle = cancel(battle, execution, "SOURCE_ABSENT");
            }

            return battle;
        },
    );

    const change = compose(spatial, restrictions(false));

    return (self) =>
        self.lifecycle === "PRESENT" ? change(self) : { next: self, settlements: [] };
}

export function appear(position: WorldPosition): Change<Unit & SpatialPresence> {
    const spatial = createChange<Unit & SpatialPresence>(
        (self) => ({ ...self, position, spatialPresence: { present: true } }),
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

    const change = compose(spatial, restrictions(true));

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
            present ? vitality.removeRule(restriction.id) : vitality.setRule(restriction),
        ),
        optional(
            elemental.hasElemental,
            present
                ? elemental.removeRule("damageRules", restriction.id)
                : elemental.setRule("damageRules", restriction),
        ),
    ].reduce(compose);
}
