import { update as updateUnit } from "../../core/battle/unit.js";
import type { Definition } from "../../core/unit/effect/index.js";

import * as skill from "../../core/unit/capability/skill/index.js";
import * as units from "../../core/unit/index.js";

export const silence: Definition<object> = {
    id: "control/silence",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host);

        return unit !== undefined && skill.hasSkill(unit)
            ? updateUnit(state, [
                  skill.setRule(units.ref(unit), "activation", {
                      id: `@effect/${self.id}/silence`,
                      allows: () => false,
                  }),
              ])
            : state;
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);

        return unit !== undefined && skill.hasSkill(unit)
            ? updateUnit(state, [
                  skill.removeRule(units.ref(unit), "activation", `@effect/${self.id}/silence`),
              ])
            : state;
    },
};

export const blockSpRecovery: Definition<object> = {
    id: "control/block-sp-recovery",
    initialize: () => ({}),
    onEnable(state, self) {
        const unit = units.get(state, self.host);

        return unit !== undefined && skill.hasSkill(unit)
            ? updateUnit(state, [
                  skill.setRule(units.ref(unit), "recovery", {
                      id: `@effect/${self.id}/sp-recovery`,
                      allows: () => false,
                  }),
              ])
            : state;
    },
    onDisable(state, self) {
        const unit = units.get(state, self.host);

        return unit !== undefined && skill.hasSkill(unit)
            ? updateUnit(state, [
                  skill.removeRule(units.ref(unit), "recovery", `@effect/${self.id}/sp-recovery`),
              ])
            : state;
    },
};
