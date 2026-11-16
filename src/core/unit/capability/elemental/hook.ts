import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Elemental } from "./capability.js";
import type { Burst, End } from "./burst.js";
import type { DamageApplication, HealingApplication } from "./operations.js";
import type { Request as DamageRequest } from "../../../battle/resource/ep/damage/contract.js";
import type { Request as HealingRequest } from "../../../battle/resource/ep/healing/contract.js";
import type { ReceivingHook } from "../../../battle/resource/ep/damage/hook.js";

export type DamageReceivingHook = ReceivingHook;

export interface Damaged extends DamageApplication {
    readonly request: DamageRequest;
}

export interface Healed extends HealingApplication {
    readonly request: HealingRequest;
}

export interface Context<E> {
    readonly host: Ref<Unit & Elemental>;
    readonly event: E;
}

export type Hook<E> = hooks.Hook<Context<E>, void>;

export const damaged = hooks.key<Hook<Damaged>, Unit & Elemental>("elemental.damaged");

export const healed = hooks.key<Hook<Healed>, Unit & Elemental>("elemental.healed");

export const burstStarted = hooks.key<Hook<Burst>, Unit & Elemental>("elemental.burstStarted");

export const burstEnded = hooks.key<
    Hook<{ readonly burst: Burst; readonly end: End }>,
    Unit & Elemental
>("elemental.burstEnded");

export function dispatch<E>(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
    key: hooks.Key<Hook<E>, Unit & Elemental>,
    event: NoInfer<E>,
): BattleState {
    return hooks.dispatch(battle, { host, event }, undefined, {
        candidates: (current) => units.get(current, host)?.hooks.get(key) ?? [],
        find: (current, id) => units.get(current, host)?.hooks.find(key, id),
    }).state;
}
