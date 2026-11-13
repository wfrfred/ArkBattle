import { update as updateUnit } from "../battle/unit.js";

import type { OrdinaryDefinition as Definition } from "../unit/effect/definition.js";
import * as action from "../unit/capability/action/capability.js";
import { hasBlocker } from "../unit/capability/blocking/blocker.js";
import {
    setRule as setBlockerRule,
    removeRule as removeBlockerRule,
} from "../unit/capability/blocking/blocker-operations.js";
import * as locomotion from "../unit/capability/locomotion/capability.js";
import * as facing from "../unit/capability/facing/capability.js";

import * as skill from "../unit/capability/skill/capability.js";
import { cancelForUnit } from "../unit/action/operations.js";
import { compose, optional, type Change } from "../unit/change.js";
import type { Unit } from "../unit/unit.js";
import * as units from "../unit/query.js";

export const stun: Definition<object> = {
    id: "control/stun",
    initialize: () => ({}),
    onEnable(state, self) {
        const id = `@effect/${self.id}/stun`;
        state = updateUnit(state, self.host, restrictions(id, true));

        const unit = units.get(state, self.host);

        return unit !== undefined && action.hasAction(unit)
            ? cancelForUnit(state, units.ref(unit), "INTERRUPTED")
            : state;
    },
    onDisable(state, self) {
        const id = `@effect/${self.id}/stun`;

        return updateUnit(state, self.host, restrictions(id, false));
    },
};

export const silence: Definition<object> = {
    id: "control/silence",
    initialize: () => ({}),
    onEnable(state, self) {
        return updateUnit(
            state,
            self.host,
            optional(
                skill.hasSkill,
                skill.setRule("activationRules", {
                    id: `@effect/${self.id}/silence`,
                    allows: () => false,
                }),
            ),
        );
    },
    onDisable(state, self) {
        return updateUnit(
            state,
            self.host,
            optional(
                skill.hasSkill,
                skill.removeRule("activationRules", `@effect/${self.id}/silence`),
            ),
        );
    },
};

export const blockSpRecovery: Definition<object> = {
    id: "control/block-sp-recovery",
    initialize: () => ({}),
    onEnable(state, self) {
        return updateUnit(
            state,
            self.host,
            optional(
                skill.hasSkill,
                skill.setRule("recoveryRules", {
                    id: `@effect/${self.id}/sp-recovery`,
                    allows: () => false,
                }),
            ),
        );
    },
    onDisable(state, self) {
        return updateUnit(
            state,
            self.host,
            optional(
                skill.hasSkill,
                skill.removeRule("recoveryRules", `@effect/${self.id}/sp-recovery`),
            ),
        );
    },
};

function restrictions(id: string, enabled: boolean): Change<Unit> {
    const rule = { id, allows: () => false };

    return [
        optional(action.hasAction, enabled ? action.setRule(rule) : action.removeRule(id)),
        optional(facing.hasFacing, enabled ? facing.setRule(rule) : facing.removeRule(id)),
        optional(
            locomotion.hasLocomotion,
            enabled ? locomotion.setRule(rule) : locomotion.removeRule(id),
        ),
        optional(
            skill.hasSkill,
            enabled
                ? skill.setRule("activationRules", rule)
                : skill.removeRule("activationRules", id),
        ),
        optional(hasBlocker, enabled ? setBlockerRule(rule) : removeBlockerRule(id)),
    ].reduce(compose);
}
