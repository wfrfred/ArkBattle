import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Activation, End } from "./activation.js";
import type { Consumed, Replenished } from "./ammo.js";
import type { Skill } from "./capability.js";
import type { Recovered, Paid, Modified } from "./sp.js";

export interface ActivationStarted {
    readonly ref: Ref<Activation>;
}

export interface ActivationEnded {
    readonly ref: Ref<Activation>;
    readonly end: End;
}

export interface Context<E> {
    readonly host: Ref<Unit & Skill>;
    readonly event: E;
}

export type Hook<E> = hooks.Hook<Context<E>, void>;

export const spRecovered = hooks.key<Hook<Recovered>, Unit & Skill>("skill.spRecovered");

export const spPaid = hooks.key<Hook<Paid>, Unit & Skill>("skill.spPaid");

export const spModified = hooks.key<Hook<Modified>, Unit & Skill>("skill.spModified");

export const ammoConsumed = hooks.key<Hook<Consumed>, Unit & Skill>("skill.ammoConsumed");

export const ammoReplenished = hooks.key<Hook<Replenished>, Unit & Skill>("skill.ammoReplenished");

export const activationStarted = hooks.key<Hook<ActivationStarted>, Unit & Skill>(
    "skill.activationStarted",
);

export const activationEnded = hooks.key<Hook<ActivationEnded>, Unit & Skill>(
    "skill.activationEnded",
);

export function dispatch<E>(
    battle: BattleState,
    host: Ref<Unit & Skill>,
    key: hooks.Key<Hook<E>, Unit & Skill>,
    event: NoInfer<E>,
): BattleState {
    return hooks.dispatch(battle, { host, event }, undefined, {
        candidates: (current) => units.get(current, host)?.hooks.get(key) ?? [],
        find: (current, id) => units.get(current, host)?.hooks.find(key, id),
    }).state;
}
