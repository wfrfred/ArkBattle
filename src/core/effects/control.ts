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
import type { Applied, Settlement } from "../unit/change.js";
import type { Unit } from "../unit/unit.js";

export const stun: Definition<object> = {
    id: "control/stun",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host)!;
        const id = `@effect/${self.id}/stun`;
        state = updateUnit(state, units.ref(unit), {
            apply: (self) => restrictions(self, id, true),
        });

        return cancelForUnit(state, self.host, "INTERRUPTED");
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host)!;
        const id = `@effect/${self.id}/stun`;

        return updateUnit(state, units.ref(unit), {
            apply: (self) => restrictions(self, id, false),
        });
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
                  units.ref(unit),
                  skill.setRule("activationRules", {
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
                  units.ref(unit),
                  skill.removeRule("activationRules", `@effect/${self.id}/silence`),
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
                  units.ref(unit),
                  skill.setRule("recoveryRules", {
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
                  units.ref(unit),
                  skill.removeRule("recoveryRules", `@effect/${self.id}/sp-recovery`),
              )
            : state;
    },
};

function restrictions<U extends Unit>(self: U, id: string, enabled: boolean): Applied<U> {
    const rule = { id, allows: () => false };
    let next = self;
    const settlements: Settlement[] = [];

    if (action.hasAction(next)) {
        const applied = (enabled ? action.setRule(rule) : action.removeRule(id)).apply(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (locomotion.hasLocomotion(next)) {
        const applied = (enabled ? locomotion.setRule(rule) : locomotion.removeRule(id)).apply(
            next,
        );
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (skill.hasSkill(next)) {
        const applied = (
            enabled
                ? skill.setRule("activationRules", rule)
                : skill.removeRule("activationRules", id)
        ).apply(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }
    if (hasBlocker(next)) {
        const applied = (enabled ? setBlockerRule(rule) : removeBlockerRule(id)).apply(next);
        next = applied.next;
        settlements.push(...applied.settlements);
    }

    return { next, settlements };
}
