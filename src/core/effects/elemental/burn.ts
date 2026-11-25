import { update } from "../../unit/operations.js";
import * as modifier from "../../common/modifier.js";
import * as effects from "../../effect/operations.js";
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
import {
    onInstall as registerBurst,
    advance,
    onEnd,
    availableHost,
    ref,
    type Definition,
} from "../../unit/capability/elemental/burst.js";

export interface Parameters {
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

export function createArts(parameters: Parameters): Definition {
    const reduction = resistanceReduction(parameters.resReduction);

    return {
        id: "elemental/burn/arts",
        group: null,
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.BURN }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            let unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (hasVitality(unit)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    source: null,
                    scopes: [reference],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            return hurt(battle, unit, "ARTS", parameters.damage, "NORMAL", false);
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}

export function createElemental(parameters: Parameters): Definition {
    const reduction = resistanceReduction(parameters.resReduction);

    return {
        id: "elemental/burn/elemental",
        group: null,
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.BURN }),
        onInstall(battle, self) {
            battle = registerBurst(battle, self);
            const reference = ref(self);
            let unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (hasVitality(unit)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    source: null,
                    scopes: [reference],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            }

            unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            return hurt(battle, unit, "ELEMENTAL", parameters.damage, "NORMAL", false);
        },
        onTick: (battle, self) => advance(battle, self),
        onEnd,
    };
}
