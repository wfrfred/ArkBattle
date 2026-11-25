import { compose, optional, type Change } from "../unit/change.js";
import { update as updateUnit } from "../unit/operations.js";

import type { Definition } from "../effect/index.js";
import * as vitality from "../unit/capability/vitality/index.js";
import * as elemental from "../unit/capability/elemental/index.js";
import * as shiftable from "../unit/capability/shifting/shiftable.js";
import * as targetable from "../unit/capability/targetable/capability.js";
import type { Unit } from "../unit/index.js";
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

export const unbalanceImmunity: Definition<object, Unit & shiftable.Shiftable> = {
    id: "protection/unbalance-immunity",
    group: null,
    initialize: () => ({}),
    onEnable(state, self) {
        return updateUnit(
            state,
            self.ref.host,
            shiftable.setRestriction({
                id: `@effect/${self.id}/unbalance-immunity`,
                group: null,
                value: forceImmunity,
            }),
        );
    },
    onDisable(state, self) {
        return updateUnit(
            state,
            self.ref.host,
            shiftable.removeRestriction(`@effect/${self.id}/unbalance-immunity`),
        );
    },
};

export const invincible: Definition<object, Unit & targetable.Targetable> = {
    id: "protection/invincible",
    group: null,
    initialize: () => ({}),
    onEnable(state, self) {
        const id = `@effect/${self.id}/invincible`;

        return updateUnit(
            state,
            self.ref.host,
            compose(
                targetable.setRestriction({ id, value: invincibleRestriction, group: null }),
                receptionRestrictions(id, true),
            ),
        );
    },
    onDisable(state, self) {
        const id = `@effect/${self.id}/invincible`;

        return updateUnit(
            state,
            self.ref.host,
            compose(targetable.removeRestriction(id), receptionRestrictions(id, false)),
        );
    },
};

export const healFree: Definition<object, Unit> = {
    id: "protection/heal-free",
    group: null,
    initialize: () => ({}),
};

function receptionRestrictions(id: string, enabled: boolean): Change<Unit> {
    return compose(
        optional(
            elemental.hasElemental,
            enabled
                ? elemental.setRestriction("damageRestrictions", {
                      id,
                      value: invincibleEpDamageRestriction,
                      group: null,
                  })
                : elemental.removeRestriction("damageRestrictions", id),
        ),
        optional(
            vitality.hasVitality,
            enabled
                ? vitality.setRestriction({ id, value: invincibleHpDamageRestriction, group: null })
                : vitality.removeRestriction(id),
        ),
    );
}
