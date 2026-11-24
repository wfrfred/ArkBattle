import {
    clearCooldown,
    cancel as cancelAction,
    forUnit,
    ref as actionRef,
    type ActionCapability,
} from "../../../core/unit/capability/action/index.js";
import type { TilePosition } from "../../../core/geometry/coordinate.js";
import type {
    Definition as SkillDefinition,
    SpDefinition,
    Trigger,
} from "../../../core/unit/capability/skill/index.js";
import {
    skillTargets,
    type AttackHost,
    type createNormal,
    type createSkill as createSkillAction,
} from "./action.js";

export interface SkillParameters {
    readonly id: string;
    readonly range: readonly TilePosition[];
    readonly sp: SpDefinition;
    readonly trigger: Trigger;
    readonly cost: number;
}

export function create(
    { id, range, sp, trigger, cost }: SkillParameters,
    normalAttack: ReturnType<typeof createNormal>,
    action: ReturnType<typeof createSkillAction>,
) {
    return {
        id,
        sp,
        initialize: (battle) => ({ state: battle, value: {} }),
        activation: {
            trigger,
            ignoreRestrictions: [],
            requirement: cost,
            cost,
            initialize: () => ({ state: {}, duration: { type: "INFINITE" } }),
            accepts(battle, sourceRef) {
                const source = sourceRef.get(battle);

                return source !== undefined && skillTargets(battle, source, range).some(() => true);
            },
            onStart(state, host) {
                if (host.get(state) === undefined) {
                    return state;
                }

                const normal = forUnit(state, host).find(
                    (reference) => reference.get(state)?.definition === normalAttack,
                );
                if (normal !== undefined) {
                    state = cancelAction(state, normal, "INTERRUPTED");
                }

                if (host.get(state)?.lifecycle !== "ACTIVE") {
                    return state;
                }

                state = clearCooldown(state, actionRef(host, normalAttack));
                state = clearCooldown(state, actionRef(host, action));

                return state;
            },
        },
    } satisfies SkillDefinition<object, object, ActionCapability & AttackHost>;
}
