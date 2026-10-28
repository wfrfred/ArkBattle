import type { Identified, Ref } from "../../common/ref.js";
import type { Unit } from "../unit.js";
import type { Skill as SkillCapability } from "../capability/skill/capability.js";
import type { Definition, View as DefinitionView } from "./definition.js";
import type { State as SpState } from "./sp.js";
import type { State, StateView } from "./activation.js";

export interface View {
    readonly definition: DefinitionView;
    readonly sp: SpState | null;
    readonly activation: StateView | null;
}

export interface Skill<S extends object = object, A extends object = object>
    extends
        View,
        Identified<{
            readonly host: Ref<Unit & SkillCapability>;
            readonly definition: Definition<S, A>;
        }> {
    readonly definition: Definition<S, A>;
    readonly data: S;
    readonly activation: State<A> | null;
}

export function ref<S extends object, A extends object>(
    host: Ref<Unit & SkillCapability>,
    definition: Definition<S, A>,
): Ref<Skill<S, A>> {
    return { host, definition } as Ref<Skill<S, A>>;
}
