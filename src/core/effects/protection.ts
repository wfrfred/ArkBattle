import { compose, optional, type Change } from "../unit/change.js";
import { update as updateUnit } from "../battle/unit.js";

import type { OrdinaryDefinition as Definition } from "../unit/effect/index.js";
import * as vitality from "../unit/capability/vitality/index.js";
import * as elemental from "../unit/capability/elemental/index.js";
import * as targetable from "../unit/capability/targetable/capability.js";
import * as units from "../unit/index.js";
import { untargetableRestriction } from "./visibility.js";

export const invincibleRestriction: targetable.Restriction = {
    allows: untargetableRestriction.allows,
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

export const healFree: Definition<object> = {
    id: "protection/heal-free",
    initialize: () => ({}),
};

function receptionRules(id: string, enabled: boolean): Change<units.Unit> {
    const rule = { id, allows: () => false };
    const hpRule: vitality.Rule = {
        id,
        allows: (_battle, { request }) => request.nature === "LOSS",
    };

    return compose(
        optional(
            elemental.hasElemental,
            enabled
                ? elemental.setRule("damageRules", rule)
                : elemental.removeRule("damageRules", id),
        ),
        optional(
            vitality.hasVitality,
            enabled ? vitality.setRule(hpRule) : vitality.removeRule(id),
        ),
    );
}
