import { compose, type Change, type Settlement } from "../unit/change.js";
import { update as updateUnit } from "../battle/unit.js";

import type { Definition } from "../unit/effect/index.js";
import * as vitality from "../unit/capability/vitality/index.js";
import * as elemental from "../unit/capability/elemental/index.js";
import * as targetable from "../unit/capability/targetable/capability.js";
import * as units from "../unit/index.js";
import { untargetableRestriction } from "./visibility.js";

export const invincibilityKind = Symbol("invincibility");

export const healFreeKind = Symbol("heal-free");

export const invincibleRestriction: targetable.Restriction = {
    kind: invincibilityKind,
    allows: untargetableRestriction.allows,
};

export const healFreeRestriction: targetable.Restriction = {
    kind: healFreeKind,
    allows: (_battle, { request }) => !request.purposes.includes("HEAL"),
};

export const invincible: Definition<object, targetable.Targetable> = {
    id: "protection/invincible",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/invincible`;

        return updateUnit(
            state,
            units.ref(unit),
            compose(
                targetable.setRestriction({ id, value: invincibleRestriction }),
                receptionRules(id, true),
            ),
        );
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/invincible`;

        return updateUnit(
            state,
            units.ref(unit),
            compose(targetable.removeRestriction(id), receptionRules(id, false)),
        );
    },
};

export const healFree: Definition<object, targetable.Targetable> = {
    id: "protection/heal-free",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        return updateUnit(
            state,
            units.ref(unit),
            targetable.setRestriction({
                id: `@effect/${self.id}/heal-free`,
                value: healFreeRestriction,
            }),
        );
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        return updateUnit(
            state,
            units.ref(unit),
            targetable.removeRestriction(`@effect/${self.id}/heal-free`),
        );
    },
};

function receptionRules(id: string, enabled: boolean): Change<units.Unit> {
    const rule = { id, allows: () => false };

    return (self) => {
        let next = self;
        const settlements: Settlement[] = [];

        if (elemental.hasElemental(next)) {
            const applied = (
                enabled
                    ? elemental.setRule("damageRules", rule)
                    : elemental.removeRule("damageRules", id)
            )(next);
            next = applied.next;
            settlements.push(...applied.settlements);
        }
        if (vitality.hasVitality(next)) {
            const applied = (enabled ? vitality.setRule(rule) : vitality.removeRule(id))(next);
            next = applied.next;
            settlements.push(...applied.settlements);
        }

        return { next, settlements };
    };
}
