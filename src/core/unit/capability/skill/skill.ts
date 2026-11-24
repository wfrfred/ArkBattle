import type { State as BattleState } from "../../../battle/state.js";
import { createRef, type Identified, type Identity, type Ref } from "../../../common/ref.js";
import type { Unit } from "../../unit.js";
import type { Skill as SkillCapability } from "./capability.js";
import type { Definition } from "./definition.js";
import type { State as SpState } from "./sp.js";
import type { Activation } from "./activation.js";

export interface Skill<S extends object = object, A extends object = object> extends Identified<{
    readonly host: Ref<Unit & SkillCapability>;
    readonly id?: never;
}> {
    readonly definition: Definition<S, A, never>;
    readonly state: S;
    readonly sp: SpState | null;
    readonly activation: Activation<A> | null;
}

export function createSkillRef(host: Ref<Unit & SkillCapability>): Ref<Skill> {
    return createRef<Skill>({ host }, get);
}

function get(this: object, battle: BattleState): Skill | undefined {
    const { host } = this as Identity<Skill>;
    const current = host.get(battle)?.skill;

    return current?.ref === this ? current : undefined;
}
