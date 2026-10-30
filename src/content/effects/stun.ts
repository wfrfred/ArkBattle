import { update as updateUnit } from "../../core/battle/unit.js";

import type { Definition } from "../../core/unit/effect/index.js";
import * as action from "../../core/unit/capability/action/index.js";
import * as blocking from "../../core/unit/capability/blocking/index.js";
import * as locomotion from "../../core/unit/capability/locomotion/index.js";

import * as skill from "../../core/unit/capability/skill/index.js";
import { cancelForUnit } from "../../core/unit/action/index.js";
import * as units from "../../core/unit/index.js";

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

        const changes: units.Change[] = [];
        if (action.hasAction(unit)) {
            changes.push(action.setRule(units.ref(unit), rule));
        }
        if (locomotion.hasLocomotion(unit)) {
            changes.push(locomotion.setRule(units.ref(unit), rule));
        }
        if (skill.hasSkill(unit)) {
            changes.push(skill.setRule(units.ref(unit), { id, allowsActivation: () => false }));
        }
        if (blocking.hasBlocker(unit)) {
            changes.push(blocking.setBlockerRule(units.ref(unit), rule));
        }

        state = updateUnit(state, changes);

        return cancelForUnit(state, self.host, "INTERRUPTED");
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/stun`;

        const changes: units.Change[] = [];
        if (action.hasAction(unit)) {
            changes.push(action.removeRule(units.ref(unit), id));
        }
        if (locomotion.hasLocomotion(unit)) {
            changes.push(locomotion.removeRule(units.ref(unit), id));
        }
        if (skill.hasSkill(unit)) {
            changes.push(skill.removeRule(units.ref(unit), id));
        }
        if (blocking.hasBlocker(unit)) {
            changes.push(blocking.removeBlockerRule(units.ref(unit), id));
        }

        return updateUnit(state, changes);
    },
};
