import { update } from "../../unit/operations.js";
import * as modifier from "../../common/modifier.js";
import * as effects from "../../effect/operations.js";
import { ref } from "../../effect/effect.js";
import * as units from "../../unit/query.js";
import type { Unit } from "../../unit/unit.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import {
    hasVitality,
    setContribution,
    removeContribution,
    type Vitality,
} from "../../unit/capability/vitality/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import { hurt } from "./damage.js";
import * as burst from "../../unit/capability/elemental/burst.js";

export interface Parameters {
    readonly damageType: "ARTS" | "ELEMENTAL";
    readonly durationTicks: number;
    readonly damage: number;
    readonly resReduction: number;
}

function resistanceReduction(amount: number): EffectDefinition<object, Unit & Vitality> {
    return {
        id: "elemental/burn/resistance-reduction",
        group: null,
        initialize: () => ({}),
        onEnable: (battle, self) =>
            update(
                battle,
                self.ref.host,
                setContribution("resistance", {
                    id: `@effect/${self.id}/resistance`,
                    group: null,
                    value: [modifier.create({ addition: -amount })],
                }),
            ),
        onDisable: (battle, self) =>
            update(
                battle,
                self.ref.host,
                removeContribution("resistance", `@effect/${self.id}/resistance`),
            ),
    };
}

export function create(parameters: Parameters): burst.Definition {
    const reduction = resistanceReduction(parameters.resReduction);

    return burst.create<burst.State>({
        id: parameters.damageType === "ARTS" ? "elemental/burn/arts" : "elemental/burn/elemental",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.BURN }),
        onInstall(battle, self) {
            const reference = ref(self);
            const unit = self.ref.host.get(battle)!;
            if (hasVitality(unit)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    source: null,
                    scopes: [reference],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            const current = burst.availableHost(battle, reference);

            if (current === undefined) {
                return battle;
            }

            return hurt(battle, current, parameters.damageType, parameters.damage, "NORMAL", false);
        },
    });
}
