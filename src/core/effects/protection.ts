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

        return updateUnit(state, [
            targetable.setRestriction(units.ref(unit), {
                id,
                value: invincibleRestriction,
            }),
            ...(elemental.hasElemental(unit)
                ? [
                      elemental.setRule(units.ref(unit), "damageRules", {
                          id,
                          allows: () => false,
                      }),
                  ]
                : []),
            ...(vitality.hasVitality(unit)
                ? [
                      vitality.setRule(units.ref(unit), {
                          id,
                          allows: () => false,
                      }),
                  ]
                : []),
        ]);
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        const id = `@effect/${self.id}/invincible`;

        return updateUnit(state, [
            targetable.removeRestriction(units.ref(unit), id),
            ...(elemental.hasElemental(unit)
                ? [elemental.removeRule(units.ref(unit), "damageRules", id)]
                : []),
            ...(vitality.hasVitality(unit) ? [vitality.removeRule(units.ref(unit), id)] : []),
        ]);
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

        return updateUnit(state, [
            targetable.setRestriction(units.ref(unit), {
                id: `@effect/${self.id}/heal-free`,
                value: healFreeRestriction,
            }),
        ]);
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);
        if (unit === undefined) {
            return state;
        }

        return updateUnit(state, [
            targetable.removeRestriction(units.ref(unit), `@effect/${self.id}/heal-free`),
        ]);
    },
};
