import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import { replace } from "../../../battle/unit.js";
import type { DamageType, Request as DamageRequest } from "../../../battle/damage/hp/contract.js";
import { calculateDamage } from "../../../battle/damage/hp/calculate.js";
import { applyDamage } from "../../../battle/damage/hp/apply.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import * as effects from "../../effect/operations.js";
import { get as getEffect } from "../../effect/query.js";
import { ref, type Effect } from "../../effect/effect.js";
import type { Definition as EffectDefinition } from "../../effect/definition.js";
import { hasVitality } from "../vitality/capability.js";
import { elementValues, type Elemental, type Type } from "./capability.js";
import { available, resolveMaxEp, resolveBurstRecoverySpeed } from "./query.js";
import { dispatch } from "./hook.js";

export interface State {
    readonly type: Type;
    readonly elapsedTicks: number;
}

export interface Definition extends EffectDefinition<State, Elemental> {
    readonly durationTicks: number;
}

export type Burst = Effect<State, Elemental>;

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export { ref };

export function onInstall(battle: BattleState, self: Burst): BattleState {
    const host = units.get(battle, self.host)!;
    battle = replace(battle, [{ ...host, elemental: { ...host.elemental, burst: ref(self) } }]);
    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_BURST",
            unitId: host.id,
            elementType: self.data.type,
            position: host.position,
            tick: battle.tick,
        },
    ]);

    return dispatch(battle, self.host, "burstStarted", self);
}

export function advance(
    battle: BattleState,
    self: Burst,
    onSecond?: (
        battle: BattleState,
        host: Unit & Elemental,
        reference: Ref<Burst>,
        second: number,
    ) => BattleState,
): BattleState {
    const reference = ref(self);
    const host = activeHost(battle, reference);
    if (host === undefined) {
        return battle;
    }

    const { durationTicks } = host.definition.elemental.bursts[self.data.type];
    const elapsedTicks = Math.min(
        durationTicks,
        self.data.elapsedTicks + resolveBurstRecoverySpeed(battle, host),
    );
    const maximum = resolveMaxEp(battle, host);
    const current = { ...self, data: { ...self.data, elapsedTicks } };
    const ep = elementValues(
        durationTicks === 0 ? maximum : (maximum * elapsedTicks) / durationTicks,
    );
    battle = replace(battle, [
        {
            ...host,
            effects: host.effects.replace(reference, current),
            elemental: { ...host.elemental, ep },
        },
    ]);

    if (onSecond !== undefined) {
        const previousSecond = Math.floor((self.data.elapsedTicks + 1e-8) / TICKS_PER_SECOND);
        const currentSecond = Math.floor((elapsedTicks + 1e-8) / TICKS_PER_SECOND);

        for (let second = previousSecond + 1; second <= currentSecond; second++) {
            const currentHost = activeHost(battle, reference);
            if (currentHost === undefined) {
                return battle;
            }

            battle = onSecond(battle, currentHost, reference, second);
        }
    }

    return elapsedTicks >= durationTicks
        ? effects.end(battle, reference, "ELEMENTAL_BURST_FINISHED")
        : battle;
}

export function onEnd(battle: BattleState, self: Burst, reason: string): BattleState {
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
        reason === "ELEMENTAL_BURST_FINISHED"
            ? { type: "FINISHED" }
            : { type: "CANCELLED", reason };

    return dispatch(battle, self.host, "burstEnded", { burst: self, end });
}

export function finishStart(battle: BattleState, self: Burst): BattleState {
    return (self.definition as Definition).durationTicks === 0
        ? effects.end(battle, ref(self), "ELEMENTAL_BURST_FINISHED")
        : battle;
}

export function activeHost(
    battle: BattleState,
    reference: Ref<Burst>,
): (Unit & Elemental) | undefined {
    const host = units.get(battle, reference.host);

    return host !== undefined &&
        available(host) &&
        getEffect(battle, reference)?.status === "ACTIVE"
        ? host
        : undefined;
}

export function hurt(
    battle: BattleState,
    host: Unit & Elemental,
    type: DamageType,
    power: number,
): BattleState {
    if (!hasVitality(host)) {
        return battle;
    }

    const attack = { power, multiplier: 1, addition: 0 };
    const request: DamageRequest = {
        source: null,
        target: units.ref(host),
        parameters:
            type === "PHYSICAL" || type === "ARTS"
                ? { type, attack, penetration: { fixed: 0, proportional: 0 } }
                : { type, attack },
    };

    return applyDamage(request, calculateDamage(battle, request)).state;
}
