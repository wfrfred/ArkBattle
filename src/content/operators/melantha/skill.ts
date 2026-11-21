import { scope } from "../../../core/lifetime/index.js";
import type { Offense } from "../../../core/unit/capability/offense/index.js";
import {
    activationRef,
    lifetime,
    type Definition,
} from "../../../core/unit/capability/skill/index.js";
import { install } from "../../../core/unit/effect/index.js";
import { get, ref } from "../../../core/unit/index.js";
import type { Profile } from "../../../data/unit/operator.js";
import { createAttackBonus } from "./effect.js";

export function create(skill: Profile["skill"]) {
    const bonus = skill.blackboard.find((entry) => entry.key === "atk")!.value;
    const effect = createAttackBonus("melantha/attack-up", bonus);

    return {
        ...skill.definition,
        activation: {
            ...skill.definition.activation!,
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
