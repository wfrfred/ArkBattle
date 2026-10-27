import { update as updateUnit } from "../../core/battle/unit.js";

import type { Definition } from "../../core/unit/effect/definition.js";
import * as action from "../../core/unit/capability/action/capability.js";
import * as blocker from "../../core/unit/capability/blocking/blocker.js";
import * as locomotion from "../../core/unit/capability/locomotion/capability.js";
import * as movement from "../../core/unit/capability/locomotion/operations.js";
import * as skill from "../../core/unit/capability/skill/capability.js";
import { cancelForUnit } from "../../core/unit/action/index.js";
import * as units from "../../core/unit/query.js";

export const stun: Definition<object> = {
    id: "control/stun",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host);

        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/stun`;
        const rule = { id, allows: () => false };

        state = updateUnit(state, [
            {
                ...unit,
                ...(action.hasAction(unit) ? { action: action.setRule(unit.action, rule) } : {}),
                ...(blocker.hasBlocker(unit)
                    ? { blocker: blocker.setRule(unit.blocker, rule) }
                    : {}),
                ...(locomotion.hasLocomotion(unit)
                    ? { locomotion: movement.setRule(unit.locomotion, rule) }
                    : {}),
                ...(skill.hasSkill(unit)
                    ? { skill: skill.setRule(unit.skill, { id, allowsActivation: () => false }) }
                    : {}),
            },
        ]);

        return cancelForUnit(state, self.host, "INTERRUPTED");
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);

        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/stun`;

        state = updateUnit(state, [
            {
                ...unit,
                ...(action.hasAction(unit) ? { action: action.removeRule(unit.action, id) } : {}),
                ...(blocker.hasBlocker(unit)
                    ? { blocker: blocker.removeRule(unit.blocker, id) }
                    : {}),
                ...(locomotion.hasLocomotion(unit)
                    ? { locomotion: movement.removeRule(unit.locomotion, id) }
                    : {}),
                ...(skill.hasSkill(unit) ? { skill: skill.removeRule(unit.skill, id) } : {}),
            },
        ]);

        return state;
    },
};
