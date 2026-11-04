import { update } from "../../battle/unit.js";
import { scope } from "../../lifetime/operations.js";
import * as attribute from "../../unit/contribution/attribute.js";
import * as effects from "../../unit/effect/operations.js";
import * as units from "../../unit/query.js";
import type { Definition as EffectDefinition } from "../../unit/effect/definition.js";
import {
    hasVitality,
    setContribution,
    removeContribution,
    type Vitality,
} from "../../unit/capability/vitality/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import {
    onInstall as registerBurst,
    advance,
    onEnd,
    availableHost,
    hurt,
    ref,
    type Definition,
} from "../../unit/capability/elemental/burst.js";

export interface Parameters {
    readonly durationTicks: number;
    readonly damage: number;
    readonly resReduction: number;
}

function resistanceReduction(amount: number): EffectDefinition<object, Vitality> {
    return {
        id: "elemental/burn/resistance-reduction",
        initialize: () => ({}),
        onEnable: (battle, self) =>
            update(battle, [
                setContribution(self.host, "resistance", {
                    id: `@effect/${self.id}/resistance`,
                    value: [attribute.create({ addition: -amount })],
                }),
            ]),
        onDisable: (battle, self) =>
            update(battle, [
                removeContribution(self.host, "resistance", `@effect/${self.id}/resistance`),
            ]),
    };
}

export function createArts(parameters: Parameters): Definition {
    const reduction = resistanceReduction(parameters.resReduction);

    return {
        id: "elemental/burn/arts",
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
                    scopes: [scope(effects.lifetime, reference)],
                }).state;
            }

            unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            return hurt(battle, unit, "ARTS", parameters.damage);
        },
        onTick: advance,
        onEnd,
    };
}

export function createElemental(parameters: Parameters): Definition {
    const reduction = resistanceReduction(parameters.resReduction);

    return {
        id: "elemental/burn/elemental",
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
                    scopes: [scope(effects.lifetime, reference)],
                }).state;
            }

            unit = availableHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            return hurt(battle, unit, "ELEMENTAL", parameters.damage);
        },
        onTick: advance,
        onEnd,
    };
}
