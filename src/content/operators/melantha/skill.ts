import type { Offense } from "../../../core/unit/capability/offense/index.js";
import {
    ref as activationRef,
    type Definition,
    type SpDefinition,
    type Trigger,
} from "../../../core/unit/capability/skill/index.js";
import { install } from "../../../core/effect/index.js";
import { ref } from "../../../core/unit/index.js";
import { createAttackBonus } from "./effect.js";

export interface SkillParameters {
    readonly id: string;
    readonly cost: number;
    readonly durationTicks: number;
    readonly sp: SpDefinition;
    readonly trigger: Trigger;
    readonly attackBonus: number;
}

export function create({ id, cost, durationTicks, sp, trigger, attackBonus }: SkillParameters) {
    const effect = createAttackBonus("melantha/attack-up", attackBonus);

    return {
        id,
        sp,
        initialize: (battle) => ({ state: battle, value: {} }),
        activation: {
            trigger,
            ignoreRestrictions: [],
            requirement: cost,
            cost,
            initialize: () => ({ state: {}, duration: { type: "TIME", durationTicks } }),
            onStart(state, source, self) {
                const unit = source.get(state);
                if (unit === undefined) {
                    return state;
                }

                return install(state, ref(unit), effect, {
                    source: ref(unit),
                    scopes: [activationRef(self)],
                    expiration: { type: "INFINITE" },
                    enabled: true,
                }).state;
            },
        },
    } satisfies Definition<object, object, Offense>;
}
