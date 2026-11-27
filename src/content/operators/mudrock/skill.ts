import {
    clearCooldown,
    cancel as cancelAction,
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
            accepts(battle, host) {
                const unit = host.get(battle);

                return unit !== undefined && skillTargets(battle, unit, range).some(() => true);
            },
            onStart(state, host) {
                const unit = host.get(state);
                if (unit === undefined) {
                    return state;
                }

                const normal = unit.action.actions.get(normalAttack);
                if (normal?.execution != null) {
                    state = cancelAction(state, actionRef(normal.execution), "INTERRUPTED");
                }

                const current = host.get(state);
                if (current?.lifecycle !== "ACTIVE") {
                    return state;
                }

                state = clearCooldown(state, actionRef(current.action.actions.get(normalAttack)!));
                state = clearCooldown(state, actionRef(current.action.actions.get(action)!));

                return state;
            },
        },
    } satisfies SkillDefinition<object, object, ActionCapability & AttackHost>;
}
