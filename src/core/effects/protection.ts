import { compose, optional, type Change } from "../unit/change.js";
import { update as updateUnit } from "../unit/operations.js";

import type { OrdinaryDefinition as Definition } from "../unit/effect/index.js";
import * as vitality from "../unit/capability/vitality/index.js";
import * as elemental from "../unit/capability/elemental/index.js";
import * as shiftable from "../unit/capability/shifting/shiftable.js";
import * as targetable from "../unit/capability/targetable/capability.js";
import * as units from "../unit/index.js";
import { untargetableRestriction } from "./visibility.js";

export const invincibleRestriction: targetable.Restriction = {
    allows: untargetableRestriction.allows,
};

export const invincibleHpDamageRestriction: vitality.Restriction = {
    allows: (_battle, { request }) => request.nature === "LOSS",
};

export const invincibleEpDamageRestriction: elemental.DamageRestriction = {
    allows: () => false,
};

const forceImmunity: shiftable.Restriction = { allows: () => false };

export const unbalanceImmunity: Definition<object, shiftable.Shiftable> = {
    id: "protection/unbalance-immunity",
    initialize: () => ({}),
    onEnable(state, self) {
        return updateUnit(
            state,
            self.host,
            shiftable.setRestriction({
                id: `@effect/${self.id}/unbalance-immunity`,
                value: forceImmunity,
            }),
        );
    },
    onDisable(state, self) {
        return updateUnit(
            state,
            self.host,
            shiftable.removeRestriction(`@effect/${self.id}/unbalance-immunity`),
        );
    },
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
                receptionRestrictions(id, true),
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
            compose(targetable.removeRestriction(id), receptionRestrictions(id, false)),
        );
    },
};

export const healFree: Definition<object> = {
    id: "protection/heal-free",
    initialize: () => ({}),
};

function receptionRestrictions(id: string, enabled: boolean): Change<units.Unit> {
    return compose(
        optional(
            elemental.hasElemental,
            enabled
                ? elemental.setRestriction("damageRestrictions", {
                      id,
                      value: invincibleEpDamageRestriction,
                  })
                : elemental.removeRestriction("damageRestrictions", id),
        ),
        optional(
            vitality.hasVitality,
            enabled
                ? vitality.setRestriction({ id, value: invincibleHpDamageRestriction })
                : vitality.removeRestriction(id),
        ),
    );
}
