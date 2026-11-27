import type { Result, State as BattleState } from "../../../battle/state.js";
import type { Definition as ActivationDefinition } from "./activation.js";
import type { Skill } from "./skill.js";
import type { Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type * as sp from "./sp.js";

export type SkillCallback<S extends object, A extends object, H extends object, R> = (
    battle: BattleState,
    host: Ref<Unit & SkillCapability & H>,
    self: Skill<S, A>,
) => R;

export interface Definition<
    S extends object = object,
    A extends object = object,
    H extends object = object,
> {
    readonly id: string;
    readonly sp: sp.Definition | null;
    readonly initialize: (battle: BattleState) => Result<S>;
    readonly activation: ActivationDefinition<S, A, H> | null;
    readonly onEnter?: SkillCallback<S, A, H, BattleState>;
    readonly onTick?: SkillCallback<S, A, H, BattleState>;
}
