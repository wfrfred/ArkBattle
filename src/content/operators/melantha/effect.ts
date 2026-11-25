import * as modifier from "../../../core/common/modifier.js";
import {
    removeAttackContribution,
    setAttackContribution,
    type Offense,
} from "../../../core/unit/capability/offense/index.js";
import type { Definition } from "../../../core/effect/index.js";
import { ref, update, type Unit } from "../../../core/unit/index.js";

export function createAttackBonus(id: string, amount: number): Definition<object, Unit & Offense> {
    return {
        id,
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = self.ref.host.get(state);

            return unit === undefined
                ? state
                : update(
                      state,
                      ref(unit),
                      setAttackContribution({
                          id: `effect/${self.id}/attack`,
                          value: [modifier.create({ multiplier: amount })],
                      }),
                  );
        },
        onDisable: (state, self) => {
            const unit = self.ref.host.get(state);

            return unit === undefined
                ? state
                : update(state, ref(unit), removeAttackContribution(`effect/${self.id}/attack`));
        },
    };
}
