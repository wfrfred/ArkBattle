import type { Ref } from "../../../common/ref.js";
import type { State as BattleState } from "../../../battle/state.js";
import * as units from "../../query.js";
import * as hooks from "../../../hook.js";
import type { Unit } from "../../unit.js";
import type { Elemental } from "./capability.js";
import type { Burst, End } from "./burst.js";
import type { DamageApplication, HealingApplication } from "./operations.js";
import type { Request as DamageRequest } from "../../../battle/damage/ep/contract.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";
import type { ReceivingHook } from "../../../battle/damage/ep/hook.js";

export type DamageReceivingHook = ReceivingHook;

export interface Damaged extends DamageApplication {
    readonly request: DamageRequest;
}

export interface Healed extends HealingApplication {
    readonly request: HealingRequest;
}

export interface Events {
    readonly damaged: Damaged;
    readonly healed: Healed;
    readonly burstStarted: Burst;
    readonly burstEnded: { readonly burst: Burst; readonly end: End };
}

export type Key = keyof Events;

export interface Context<E> {
    readonly host: Ref<Unit & Elemental>;
    readonly event: E;
}

export type Hook<E> = hooks.Hook<Context<E>, void>;

export function dispatch<K extends Key>(
    battle: BattleState,
    host: Ref<Unit & Elemental>,
    key: K,
    event: Events[K],
): BattleState {
    return hooks.dispatch(battle, { host, event }, undefined, {
        candidates: (current) => units.get(current, host)?.elemental[key].map(({ id }) => id) ?? [],
        find: (current, id) => {
            const entries = units.get(current, host)?.elemental[key] as
                readonly Hook<Events[K]>[] | undefined;

            return entries?.find((entry) => entry.id === id);
        },
    }).state;
}
