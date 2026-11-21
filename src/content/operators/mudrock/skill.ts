import {
    clearCooldown,
    cancel as cancelAction,
    forUnit,
    getExecution,
    ref as actionRef,
    type ActionCapability,
} from "../../../core/unit/capability/action/index.js";
import { get as getCurrentUnit } from "../../../core/unit/index.js";
import type { Definition as SkillDefinition } from "../../../core/unit/capability/skill/index.js";
import type { Profile } from "../../../data/unit/operator.js";
import {
    skillTargets,
    type AttackHost,
    type createNormal,
    type createSkill as createSkillAction,
} from "./action.js";

export function create(
    profile: Profile,
    normalAttack: ReturnType<typeof createNormal>,
    action: ReturnType<typeof createSkillAction>,
) {
    const activation = profile.skill.definition.activation!;

    return {
        ...profile.skill.definition,
        activation: {
            ...activation,
            initialize(battle, source, self) {
                return {
                    ...activation.initialize(battle, source, self),
                    duration: { type: "INFINITE" },
                };
            },
            accepts(battle, sourceRef) {
                const source = getCurrentUnit(battle, sourceRef);

                return (
                    source !== undefined && skillTargets(battle, source, profile).some(() => true)
                );
            },
            onStart(state, host) {
                if (getCurrentUnit(state, host) === undefined) {
                    return state;
                }

                const normal = forUnit(state, host).find(
                    (reference) => getExecution(state, reference)?.definition === normalAttack,
                );
                if (normal !== undefined) {
                    state = cancelAction(state, normal, "INTERRUPTED");
                }

                if (getCurrentUnit(state, host)?.lifecycle !== "ACTIVE") {
                    return state;
                }

                state = clearCooldown(state, actionRef(host, normalAttack));
                state = clearCooldown(state, actionRef(host, action));

                return state;
            },
        },
    } satisfies SkillDefinition<object, object, ActionCapability & AttackHost>;
}
