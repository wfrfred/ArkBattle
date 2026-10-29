import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Skill as SkillCapability } from "../capability/skill/capability.js";
import type { Definition } from "./definition.js";
import type { State as SpState } from "./sp.js";
import type { State } from "./activation.js";

export interface Skill<S extends object = object, A extends object = object> extends Identified<{
    readonly host: Ref<Unit & SkillCapability>;
    readonly definition: Definition<S, A>;
}> {
    readonly definition: Definition<S, A>;
    readonly state: S;
    readonly sp: SpState | null;
    readonly activation: State<A> | null;
}

export function ref<S extends object, A extends object>(
    host: Ref<Unit & SkillCapability>,
    definition: Definition<S, A>,
): Ref<Skill<S, A>> {
    return { host, definition } as Ref<Skill<S, A>>;
}
