import * as modifier from "../../../core/common/modifier.js";
import {
    removeAttackContribution,
    setAttackContribution,
    type Offense,
} from "../../../core/unit/capability/offense/index.js";
import type { OrdinaryDefinition } from "../../../core/unit/effect/index.js";
import { ref, update } from "../../../core/unit/index.js";

export function createAttackBonus(id: string, amount: number): OrdinaryDefinition<object, Offense> {
    return {
        id,
        initialize: () => ({}),
        onEnable: (state, self) => {
            const unit = self.host.get(state);

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
            const unit = self.host.get(state);

            return unit === undefined
                ? state
                : update(state, ref(unit), removeAttackContribution(`effect/${self.id}/attack`));
        },
    };
}
