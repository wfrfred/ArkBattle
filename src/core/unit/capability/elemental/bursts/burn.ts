import { update } from "../../../../battle/unit.js";
import { scope } from "../../../../lifetime/operations.js";
import * as attribute from "../../../contribution/attribute.js";
import * as effects from "../../../effect/operations.js";
import * as units from "../../../query.js";
import type { Definition as EffectDefinition } from "../../../effect/definition.js";
import {
    hasVitality,
    setContribution,
    removeContribution,
    type Vitality,
} from "../../vitality/capability.js";
import { Type } from "../capability.js";
import {
    onInstall,
    advance,
    onEnd,
    activeHost,
    hurt,
    finishStart,
    ref,
    type Definition,
} from "../burst.js";

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
        initialize: () => ({ type: Type.BURN, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (hasVitality(unit)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    scopes: [scope(effects.lifetime, reference)],
                }).state;
            }

            unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            battle = hurt(battle, unit, "ARTS", parameters.damage);

            return finishStart(battle, self);
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
        initialize: () => ({ type: Type.BURN, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }
            if (hasVitality(unit)) {
                battle = effects.install(battle, units.ref(unit), reduction, {
                    scopes: [scope(effects.lifetime, reference)],
                }).state;
            }

            unit = activeHost(battle, reference);

            if (unit === undefined) {
                return battle;
            }

            battle = hurt(battle, unit, "ELEMENTAL", parameters.damage);

            return finishStart(battle, self);
        },
        onTick: advance,
        onEnd,
    };
}
