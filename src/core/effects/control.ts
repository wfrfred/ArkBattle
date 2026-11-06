import { update as updateUnit } from "../battle/unit.js";

import type { Definition } from "../unit/effect/definition.js";
import * as action from "../unit/capability/action/capability.js";
import { hasBlocker } from "../unit/capability/blocking/blocker.js";
import {
    setRule as setBlockerRule,
    removeRule as removeBlockerRule,
} from "../unit/capability/blocking/blocker-operations.js";
import * as locomotion from "../unit/capability/locomotion/capability.js";

import * as skill from "../unit/capability/skill/capability.js";
import { cancelForUnit } from "../unit/action/operations.js";
import * as units from "../unit/query.js";
import { combine, type Change } from "../unit/change.js";

export const stun: Definition<object> = {
    id: "control/stun",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host)!;
        const id = `@effect/${self.id}/stun`;
        const rule = { id, allows: () => false };

        const changes: Change[] = [];
        if (action.hasAction(unit)) {
            changes.push(action.setRule(units.ref(unit), rule));
        }
        if (locomotion.hasLocomotion(unit)) {
            changes.push(locomotion.setRule(units.ref(unit), rule));
        }
        if (skill.hasSkill(unit)) {
            changes.push(skill.setRule(units.ref(unit), "activationRules", rule));
        }
        if (hasBlocker(unit)) {
            changes.push(setBlockerRule(units.ref(unit), rule));
        }

        state = updateUnit(state, combine(changes));

        return cancelForUnit(state, self.host, "INTERRUPTED");
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host)!;
        const id = `@effect/${self.id}/stun`;

        const changes: Change[] = [];
        if (action.hasAction(unit)) {
            changes.push(action.removeRule(units.ref(unit), id));
        }
        if (locomotion.hasLocomotion(unit)) {
            changes.push(locomotion.removeRule(units.ref(unit), id));
        }
        if (skill.hasSkill(unit)) {
            changes.push(skill.removeRule(units.ref(unit), "activationRules", id));
        }
        if (hasBlocker(unit)) {
            changes.push(removeBlockerRule(units.ref(unit), id));
        }

        return updateUnit(state, combine(changes));
    },
};

export const silence: Definition<object> = {
    id: "control/silence",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host)!;

        return skill.hasSkill(unit)
            ? updateUnit(
                  state,
                  skill.setRule(units.ref(unit), "activationRules", {
                      id: `@effect/${self.id}/silence`,
                      allows: () => false,
                  }),
              )
            : state;
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host)!;

        return skill.hasSkill(unit)
            ? updateUnit(
                  state,
                  skill.removeRule(
                      units.ref(unit),
                      "activationRules",
                      `@effect/${self.id}/silence`,
                  ),
              )
            : state;
    },
};

export const blockSpRecovery: Definition<object> = {
    id: "control/block-sp-recovery",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host)!;

        return skill.hasSkill(unit)
            ? updateUnit(
                  state,
                  skill.setRule(units.ref(unit), "recoveryRules", {
                      id: `@effect/${self.id}/sp-recovery`,
                      allows: () => false,
                  }),
              )
            : state;
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host)!;

        return skill.hasSkill(unit)
            ? updateUnit(
                  state,
                  skill.removeRule(
                      units.ref(unit),
                      "recoveryRules",
                      `@effect/${self.id}/sp-recovery`,
                  ),
              )
            : state;
    },
};
