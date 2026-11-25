import * as modifier from "../../../core/common/modifier.js";
import {
    removeAttackContribution,
    setAttackContribution,
    type Offense,
} from "../../../core/unit/capability/offense/index.js";
import type { Definition } from "../../../core/effect/index.js";
import { update, type Unit } from "../../../core/unit/index.js";

export function createAttackBonus(id: string, amount: number): Definition<object, Unit & Offense> {
    return {
        id,
        group: null,
        initialize: () => ({}),
        onEnable: (state, self) =>
            update(
                state,
                self.ref.host,
                setAttackContribution({
                    id: `effect/${self.id}/attack`,
                    group: null,
                    value: [modifier.create({ multiplier: amount })],
                }),
            ),
        onDisable: (state, self) =>
            update(state, self.ref.host, removeAttackContribution(`effect/${self.id}/attack`)),
    };
}
