import { update } from "../../unit/operations.js";
import * as units from "../../unit/query.js";
import type { Unit } from "../../unit/unit.js";
import * as effects from "../../effect/operations.js";
import { ref } from "../../effect/effect.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import * as modifier from "../../common/modifier.js";
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
    readonly durationTicks: number;
    readonly damage: number;
    readonly defReduction: number;
}

function reduction(amount: number): EffectDefinition<object, Unit & Vitality> {
    return {
        id: "elemental/erosion/reduction",
        group: null,
        initialize: () => ({}),
        onEnable: (battle, self) =>
            update(
                battle,
                self.ref.host,
                setContribution("defense", {
                    id: `@effect/${self.id}/defense`,
                    group: null,
                    value: [modifier.create({ addition: -amount })],
                }),
            ),
        onDisable: (battle, self) =>
            update(
                battle,
                self.ref.host,
                removeContribution("defense", `@effect/${self.id}/defense`),
            ),
    };
}

export function createPhysical(parameters: Parameters): burst.Definition {
    const defense = reduction(parameters.defReduction);

    return burst.create<burst.State>({
        id: "elemental/erosion-physical/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.EROSION }),
        onInstall(battle, self) {
            const reference = ref(self);
            const host = self.ref.host.get(battle)!;
            if (hasVitality(host)) {
                battle = effects.install(battle, units.ref(host), defense, {
                    source: null,
                    scopes: [],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            const current = burst.availableHost(battle, reference);

            if (current !== undefined) {
                battle = hurt(battle, current, "PHYSICAL", parameters.damage, "NORMAL", false);
            }

            return battle;
        },
    });
}

export function createElemental(parameters: Parameters): burst.Definition {
    const defense = reduction(parameters.defReduction);

    return burst.create<burst.State>({
        id: "elemental/erosion-elemental/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.EROSION }),
        onInstall(battle, self) {
            const reference = ref(self);
            const host = self.ref.host.get(battle)!;
            if (hasVitality(host)) {
                battle = effects.install(battle, units.ref(host), defense, {
                    source: null,
                    scopes: [],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            const current = burst.availableHost(battle, reference);

            if (current !== undefined) {
                battle = hurt(battle, current, "ELEMENTAL", parameters.damage, "NORMAL", false);
            }

            return battle;
        },
    });
}
