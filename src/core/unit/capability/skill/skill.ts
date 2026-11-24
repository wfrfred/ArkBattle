import type { State as BattleState } from "../../../battle/state.js";
import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import type { State as SpState } from "./sp.js";
import type { State } from "./activation.js";

export interface Skill<S extends object = object, A extends object = object> extends Identified<{
    readonly host: Ref<Unit & SkillCapability>;
    readonly id?: never;
}> {
    readonly definition: Definition<S, A, never>;
    readonly state: S;
    readonly sp: SpState | null;
    readonly activation: State<A> | null;
}

export function ref<S extends object = object, A extends object = object>(
    host: Ref<Unit & SkillCapability>,
): Ref<Skill<S, A>> {
    return { host, get } as Ref<Skill<S, A>>;
}

function get<S extends object, A extends object>(
    this: object,
    battle: BattleState,
): Skill<S, A> | undefined {
    const { host } = this as Identity<Skill>;

    return host.get(battle)?.skill as Skill<S, A> | undefined;
}
