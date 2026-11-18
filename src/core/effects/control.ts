import { update as updateUnit } from "../unit/operations.js";
import type { Restriction } from "../restriction.js";

import type { OrdinaryDefinition as Definition } from "../unit/effect/definition.js";
import * as action from "../unit/capability/action/capability.js";
import { hasBlocker } from "../unit/capability/blocking/blocker.js";
import {
    setRestriction as setBlockerRestriction,
    removeRestriction as removeBlockerRestriction,
} from "../unit/capability/blocking/blocker-operations.js";
import * as locomotion from "../unit/capability/locomotion/capability.js";
import * as facing from "../unit/capability/facing/capability.js";

import * as skill from "../unit/capability/skill/capability.js";
import type {
    ActivationRestriction,
    RecoveryRestriction,
} from "../unit/capability/skill/restriction.js";
import { cancelForUnit } from "../unit/capability/action/operations.js";
import { compose, optional, type Change } from "../unit/change.js";
import type { Unit } from "../unit/unit.js";
import * as units from "../unit/query.js";

export const stunRestriction: Restriction<unknown> = { allows: () => false };

export const silenceRestriction: ActivationRestriction = { allows: () => false };

export const spRecoveryRestriction: RecoveryRestriction = { allows: () => false };

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
                skill.setRestriction("activationRestrictions", {
                    id: `@effect/${self.id}/silence`,
                    value: silenceRestriction,
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
                skill.removeRestriction("activationRestrictions", `@effect/${self.id}/silence`),
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
                skill.setRestriction("recoveryRestrictions", {
                    id: `@effect/${self.id}/sp-recovery`,
                    value: spRecoveryRestriction,
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
                skill.removeRestriction("recoveryRestrictions", `@effect/${self.id}/sp-recovery`),
            ),
        );
    },
};

function restrictions(id: string, enabled: boolean): Change<Unit> {
    const entry = { id, value: stunRestriction };

    return [
        optional(
            action.hasAction,
            enabled ? action.setRestriction(entry) : action.removeRestriction(id),
        ),
        optional(
            facing.hasFacing,
            enabled ? facing.setRestriction(entry) : facing.removeRestriction(id),
        ),
        optional(
            locomotion.hasLocomotion,
            enabled ? locomotion.setRestriction(entry) : locomotion.removeRestriction(id),
        ),
        optional(
            skill.hasSkill,
            enabled
                ? skill.setRestriction("activationRestrictions", entry)
                : skill.removeRestriction("activationRestrictions", id),
        ),
        optional(hasBlocker, enabled ? setBlockerRestriction(entry) : removeBlockerRestriction(id)),
    ].reduce(compose);
}
