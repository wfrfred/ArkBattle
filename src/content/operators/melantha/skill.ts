import { scope } from "../../../core/lifetime/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import {
    activationRef,
    lifetime,
    type Definition,
} from "../../../core/unit/capability/skill/index.js";
import { install } from "../../../core/unit/effect/index.js";
import { get, ref } from "../../../core/unit/index.js";
import type { SkillLevel } from "../parameters.js";
import { createAttackBonus } from "./effect.js";

export function create(id: string, { blackboard, cost, durationTicks, sp, trigger }: SkillLevel) {
    const bonus = blackboard.find((entry) => entry.key === "atk")?.value;
    if (bonus === undefined || durationTicks === null) {
        throw new TypeError("Melantha's first skill requires an attack bonus and a duration");
    }

    const effect = createAttackBonus("melantha/attack-up", bonus);

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
                const unit = get(state, source);
                if (unit === undefined) {
                    return state;
                }

                return install(state, ref(unit), effect, {
                    source: ref(unit),
                    scopes: [scope(lifetime, activationRef(source, self))],
                }).state;
            },
        },
    } satisfies Definition<object, object, Offense>;
}
