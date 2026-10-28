import { assertNonnegativeSafeInteger } from "../../common/assert.js";
import type { Result, State as BattleState } from "../../battle/state.js";
import type { Definition as ActivationDefinition } from "./activation.js";
import type { Skill } from "./skill.js";
import type { Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Skill as SkillCapability } from "../capability/skill/capability.js";
import * as sp from "./sp.js";

export interface Definition<S extends object = object, A extends object = object> {
    readonly id: string;
    readonly sp: sp.Definition | null;
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly activation: ActivationDefinition<S, A> | null;
    readonly onEnter?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => BattleState;
    readonly onTick?: (
        battle: BattleState,
        source: Ref<Unit & SkillCapability>,
        self: Skill<S, A>,
    ) => BattleState;
}

export function createDefinition<S extends object, A extends object>(
    definition: Definition<S, A>,
): Definition<S, A> {
    if (definition.id.length === 0) {
        throw new TypeError("skill identity must be nonempty");
    }
    if (definition.sp !== null) {
        sp.validateDefinition(definition.sp);
    }

    const policy = definition.activation?.sustain;
    if (policy?.type === "TIME") {
        assertNonnegativeSafeInteger(policy.durationTicks, "skill duration ticks");
    } else if (policy?.type === "AMMO") {
        assertNonnegativeSafeInteger(policy.amount, "skill ammunition");
    }

    return Object.freeze({ ...definition });
}
