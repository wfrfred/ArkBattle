import { update as updateUnit } from "../../battle/unit.js";
import type { Ref } from "../../common/ref.js";
import { type State as BattleState } from "../../battle/state.js";
import type { Unit } from "../unit.js";
import * as units from "../query.js";
import type { Activation } from "./activation.js";
import type { State, Skill } from "../capability/skill/capability.js";
import type { Definition } from "./definition.js";

export interface Instance<S extends object = object, A extends object = object> {
    readonly host: Ref<Unit & Skill>;
    readonly definition: Definition<S, A>;
    readonly state: Omit<State, "data" | "active"> & {
        readonly data: S;
        readonly active: Activation<A> | null;
    };
}

export function get(battle: BattleState, reference: Ref<Unit & Skill>): Instance | undefined;
export function get<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Unit & Skill>,
    definition: Definition<S, A>,
): Instance<S, A> | undefined;
export function get<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Unit & Skill>,
    definition?: Definition<S, A>,
): Instance<S, A> | undefined {
    const host = units.get(battle, reference);
    if (host === undefined || (definition !== undefined && host.definition.skill !== definition)) {
        return undefined;
    }

    return { host: reference, definition: host.definition.skill, state: host.skill } as Instance<
        S,
        A
    >;
}

export function replaceHost(battle: BattleState, self: Unit & Skill): BattleState {
    return updateUnit(battle, [self]);
}
