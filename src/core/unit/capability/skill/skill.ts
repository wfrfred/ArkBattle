import type { Identified, Identity, Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import type { State as SpState } from "./sp.js";
import type { State } from "./activation.js";

export interface Skill<S extends object = object, A extends object = object> extends Identified<{
    readonly host: Ref<Unit & SkillCapability>;
    readonly definition: Definition<S, A, never>;
}> {
    readonly definition: Definition<S, A, never>;
    readonly state: S;
    readonly sp: SpState | null;
    readonly activation: State<A> | null;
}

export function ref<S extends object, A extends object, H extends object>(
    host: Ref<Unit & SkillCapability & NoInfer<H>>,
    definition: Definition<S, A, H>,
): Ref<Skill<S, A>> {
    const identity: Identity<Skill<S, A>> = { host, definition };

    return identity as Ref<Skill<S, A>>;
}
