import { update as updateUnit } from "../../../battle/unit.js";
import type { Ref } from "../../../common/ref.js";
import { type State as BattleState } from "../../../battle/state.js";
import type { Unit } from "../../unit.js";
import * as units from "../../query.js";
import type { Activation } from "./activation.js";
import type { Definition, State, Skill } from "./capability.js";

export interface Instance<S extends object, A extends object> {
    readonly host: Ref<Unit & Skill>;
    readonly definition: Definition<S, A>;
    readonly state: Omit<State, "data" | "active"> & {
        readonly data: S;
        readonly active: Activation<A> | null;
    };
}

export function get<S extends object, A extends object>(
    battle: BattleState,
    reference: Ref<Unit & Skill>,
    definition: Definition<S, A>,
): Instance<S, A> | undefined {
    const host = units.get(battle, reference);

    return host?.definition.skill === definition
        ? { host: reference, definition, state: host.skill as Instance<S, A>["state"] }
        : undefined;
}

export function replace<S extends object, A extends object>(
    battle: BattleState,
    self: Instance<S, A>,
): BattleState {
    const host = units.get(battle, self.host);

    return host === undefined ? battle : updateUnit(battle, [{ ...host, skill: self.state }]);
}

export function setData<S extends object, A extends object>(
    self: Instance<S, A>,
    next: NoInfer<S> | ((current: NoInfer<S>) => NoInfer<S>),
): Instance<S, A> {
    const data = typeof next === "function" ? next(self.state.data) : next;

    return data === self.state.data ? self : { ...self, state: { ...self.state, data } };
}

export function replaceHost(battle: BattleState, self: Unit & Skill): BattleState {
    return updateUnit(battle, [self]);
}

export function replaceActivation<A extends object>(
    battle: BattleState,
    reference: Ref<Activation<A>>,
    self: NoInfer<Activation<A>>,
): BattleState {
    const host = units.get(battle, reference.host);

    if (host?.skill.active?.id !== reference.id || host.skill.active.status === "ENDING") {
        return battle;
    }
    if (self.status !== host.skill.active.status) {
        throw new TypeError("skill activation status requires a lifecycle operation");
    }
    if (host.skill.active.startedAtTick !== self.startedAtTick) {
        throw new TypeError("skill activation start tick cannot change");
    }

    return replaceHost(battle, { ...host, skill: { ...host.skill, active: self } });
}
