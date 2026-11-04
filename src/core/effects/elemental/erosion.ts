import { update } from "../../battle/unit.js";
import * as units from "../../unit/query.js";
import * as effects from "../../unit/effect/operations.js";
import { ref } from "../../unit/effect/effect.js";
import type { Definition as EffectDefinition } from "../../unit/effect/definition.js";
import * as attribute from "../../unit/contribution/attribute.js";
import {
    hasVitality,
    setContribution,
    removeContribution,
    type Vitality,
} from "../../unit/capability/vitality/capability.js";
import { Type } from "../../unit/capability/elemental/capability.js";
import {
    activeHost,
    advance,
    finishStart,
    hurt,
    onInstall,
    onEnd,
    type Definition,
} from "../../unit/capability/elemental/burst.js";

export interface Parameters {
    readonly durationTicks: number;
    readonly damage: number;
    readonly defReduction: number;
}

function reduction(amount: number): EffectDefinition<object, Vitality> {
    return {
        id: "elemental/erosion/reduction",
        initialize: () => ({}),
        onEnable: (battle, self) =>
            update(battle, [
                setContribution(self.host, "defense", {
                    id: `@effect/${self.id}/defense`,
                    value: [attribute.create({ addition: -amount })],
                }),
            ]),
        onDisable: (battle, self) =>
            update(battle, [
                removeContribution(self.host, "defense", `@effect/${self.id}/defense`),
            ]),
    };
}

export function createPhysical(parameters: Parameters): Definition {
    const defense = reduction(parameters.defReduction);

    return {
        id: "elemental/erosion-physical/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.EROSION, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let host = activeHost(battle, reference);
            if (host === undefined) {
                return battle;
            }
            if (hasVitality(host)) {
                battle = effects.install(battle, units.ref(host), defense).state;
            }

            host = activeHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "PHYSICAL", parameters.damage);
            }

            return finishStart(battle, self);
        },
        onTick: advance,
        onEnd,
    };
}

export function createElemental(parameters: Parameters): Definition {
    const defense = reduction(parameters.defReduction);

    return {
        id: "elemental/erosion-elemental/burst",
        durationTicks: parameters.durationTicks,
        initialize: () => ({ type: Type.EROSION, elapsedTicks: 0 }),
        onInstall,
        onEnable(battle, self) {
            const reference = ref(self);
            let host = activeHost(battle, reference);
            if (host === undefined) {
                return battle;
            }
            if (hasVitality(host)) {
                battle = effects.install(battle, units.ref(host), defense).state;
            }

            host = activeHost(battle, reference);

            if (host !== undefined) {
                battle = hurt(battle, host, "ELEMENTAL", parameters.damage);
            }

            return finishStart(battle, self);
        },
        onTick: advance,
        onEnd,
    };
}
