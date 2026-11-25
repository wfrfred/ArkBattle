import type { Ref } from "../../../common/ref.js";
import { appendEvents, type State as BattleState } from "../../../battle/state.js";
import { replace } from "../../operations.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import type { Unit } from "../../unit.js";
import { setExpiration } from "../../effect/operations.js";
import { ref, type OrdinaryEffect } from "../../effect/effect.js";
import type { OrdinaryDefinition as EffectDefinition } from "../../effect/definition.js";
import type { Expiration } from "../../effect/expiration.js";
import { elementValues, type Elemental, type Type } from "./capability.js";
import { available, resolveMaxEp, resolveBurstRecoverySpeed } from "./query.js";
import { dispatch, burstStarted, burstEnded } from "./hook.js";
import { replaceIn } from "../../../common/object.js";

export interface State {
    readonly type: Type;
}

export interface Definition<S extends State = State> extends EffectDefinition<S, Elemental> {
    readonly durationTicks: number;
}

type Duration = Extract<Expiration, { type: "DURATION" }>;

export interface Burst<S extends State = State> extends OrdinaryEffect<S, Elemental> {
    readonly expiration: Duration;
}

export type End =
    { readonly type: "FINISHED" } | { readonly type: "CANCELLED"; readonly reason: string };

export { ref };

export function onInstall<S extends State>(
    battle: BattleState,
    self: OrdinaryEffect<S, Elemental>,
): BattleState {
    const host = self.host.get(battle)!;
    const duration = (self.definition as Definition<S>).durationTicks;
    const current: Burst<S> = {
        ...self,
        expiration: {
            type: "DURATION",
            duration,
            remaining: duration,
            rate: 0,
        },
    };
    battle = replace(battle, [replaceIn(host, ["elemental", "burst"], ref(current))]);
    battle = setExpiration(battle, ref(current), current.expiration);
    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_BURST",
            unitId: host.ref.id,
            elementType: self.state.type,
            position: host.position,
            tick: battle.tick,
        },
    ]);

    return dispatch(battle, current.host, burstStarted, current);
}

export function advance<S extends State>(
    battle: BattleState,
    instance: OrdinaryEffect<S, Elemental>,
    onSecond?: (
        battle: BattleState,
        host: Unit & Elemental,
        reference: Ref<Burst<S>>,
        second: number,
    ) => BattleState,
): BattleState {
    const self = instance as Burst<S>;
    const reference = ref(self);
    const host = availableHost(battle, reference);
    if (host === undefined) {
        return battle;
    }

    const expiration = self.expiration;
    const remaining = Math.max(0, expiration.remaining - resolveBurstRecoverySpeed(battle, host));
    const elapsed = expiration.duration - remaining;
    const maximum = resolveMaxEp(battle, host);
    const ep = elementValues((maximum * elapsed) / expiration.duration);
    battle = replace(battle, [replaceIn(host, ["elemental", "ep"], ep)]);
    battle = setExpiration(battle, reference, { ...expiration, remaining });

    if (onSecond !== undefined) {
        const previousSecond = Math.floor(
            (expiration.duration - expiration.remaining + 1e-8) / TICKS_PER_SECOND,
        );
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

export function onEnd<S extends State>(
    battle: BattleState,
    instance: OrdinaryEffect<S, Elemental>,
    reason: string,
): BattleState {
    const self = instance as Burst<S>;
    const host = self.host.get(battle)!;
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

    return dispatch(battle, self.host, burstEnded, { burst: self, end });
}

export function availableHost<S extends State>(
    battle: BattleState,
    reference: Ref<OrdinaryEffect<S, Elemental>>,
): (Unit & Elemental) | undefined {
    const host = reference.host.get(battle);
    const lifecycle = reference.get(battle)?.lifecycle;

    return host !== undefined &&
        available(host) &&
        (lifecycle === "ACTIVE" || lifecycle === "INSTALLING")
        ? host
        : undefined;
}
