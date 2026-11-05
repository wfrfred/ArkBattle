import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import { replace } from "../../../battle/unit.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import { get as getEffect } from "../../effect/query.js";
import { ref, type Effect } from "../../effect/effect.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import type { Expiration } from "../../effect/expiration.js";
import { elementValues, type Elemental, type Type } from "./capability.js";
import { available, resolveMaxEp, resolveBurstRecoverySpeed } from "./query.js";
import { dispatch } from "./hook.js";

export interface State {
    readonly type: Type;
}

export interface Definition extends EffectDefinition<State, Elemental> {
    readonly durationTicks: number;
}

type Duration = Extract<Expiration, { type: "DURATION" }>;

export interface Burst extends Effect<State, Elemental> {
    readonly expiration: Duration;
}

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export { ref };

export function onInstall(battle: BattleState, self: Effect<State, Elemental>): BattleState {
    const host = units.get(battle, self.host)!;
    const current: Burst = {
        ...self,
        expiration: {
            type: "DURATION",
            elapsed: 0,
            total: (self.definition as Definition).durationTicks,
            rate: 0,
        },
    };
    battle = replace(battle, [
        {
            ...host,
            effects: host.effects.replace(ref(current), current),
            elemental: { ...host.elemental, burst: ref(current) },
        },
    ]);
    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_BURST",
            unitId: host.id,
            elementType: self.data.type,
            position: host.position,
            tick: battle.tick,
        },
    ]);

    return dispatch(battle, current.host, "burstStarted", current);
}

export function advance(
    battle: BattleState,
    instance: Effect<State, Elemental>,
    onSecond?: (
        battle: BattleState,
        host: Unit & Elemental,
        reference: Ref<Burst>,
        second: number,
    ) => BattleState,
): BattleState {
    const self = instance as Burst;
    const reference = ref(self);
    const host = availableHost(battle, reference);
    if (host === undefined) {
        return battle;
    }

    const expiration = self.expiration;
    const elapsed = Math.min(
        expiration.total,
        expiration.elapsed + resolveBurstRecoverySpeed(battle, host),
    );
    const maximum = resolveMaxEp(battle, host);
    const current = { ...self, expiration: { ...expiration, elapsed } };
    const ep = elementValues((maximum * elapsed) / expiration.total);
    battle = replace(battle, [
        {
            ...host,
            effects: host.effects.replace(reference, current),
            elemental: { ...host.elemental, ep },
        },
    ]);

    if (onSecond !== undefined) {
        const previousSecond = Math.floor((expiration.elapsed + 1e-8) / TICKS_PER_SECOND);
        const currentSecond = Math.floor((elapsed + 1e-8) / TICKS_PER_SECOND);

        for (let second = previousSecond + 1; second <= currentSecond; second++) {
            const currentHost = availableHost(battle, reference);
            if (currentHost === undefined) {
                return battle;
            }

            battle = onSecond(battle, currentHost, reference, second);
        }
    }

    return battle;
}

export function onEnd(
    battle: BattleState,
    instance: Effect<State, Elemental>,
    reason: string,
): BattleState {
    const self = instance as Burst;
    const host = units.get(battle, self.host)!;
    battle = replace(battle, [
        {
            ...host,
            elemental: {
                ...host.elemental,
                ep: elementValues(resolveMaxEp(battle, host)),
                burst: null,
            },
        },
    ]);
    const end: End =
        reason === "EXPIRED" || reason === "ELEMENTAL_BURST_FINISHED"
            ? { type: "FINISHED" }
            : { type: "CANCELLED", reason };

    return dispatch(battle, self.host, "burstEnded", { burst: self, end });
}

export function availableHost(
    battle: BattleState,
    reference: Ref<Effect<State, Elemental>>,
): (Unit & Elemental) | undefined {
    const host = units.get(battle, reference.host);
    const status = getEffect(battle, reference)?.status;

    return host !== undefined && available(host) && (status === "ACTIVE" || status === "INSTALLING")
        ? host
        : undefined;
}
