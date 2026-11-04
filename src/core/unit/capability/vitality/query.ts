import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import * as contribution from "../../contribution/contribution.js";
import * as attribute from "../../contribution/attribute.js";
import type { Vitality } from "./capability.js";

export function resolveDefense(
    battle: BattleState,
    reference: Ref<Unit & Vitality>,
): number | undefined {
    const self = units.get(battle, reference);
    if (self === undefined) {
        return undefined;
    }

    return Math.max(
        0,
        attribute.apply(
            self.definition.vitality.defense,
            contribution
                .resolve(self.vitality.defense)
                .flatMap((input) => (typeof input === "function" ? input(battle, self) : input)),
        ),
    );
}

export function resolveResistance(
    battle: BattleState,
    reference: Ref<Unit & Vitality>,
): number | undefined {
    const self = units.get(battle, reference);
    if (self === undefined) {
        return undefined;
    }

    return Math.min(
        100,
        Math.max(
            0,
            attribute.apply(
                self.definition.vitality.resistance,
                contribution
                    .resolve(self.vitality.resistance)
                    .flatMap((input) =>
                        typeof input === "function" ? input(battle, self) : input,
                    ),
            ),
        ),
    );
}
