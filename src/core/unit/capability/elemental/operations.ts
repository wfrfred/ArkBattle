import { lifetime as unitLifetime, replace as replaceUnits } from "../../../battle/unit.js";
import type { Ref } from "../../../common/ref.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import * as lifetimes from "../../../lifetime/index.js";
import { register, unregister } from "../../../lifetime/operations.js";
import * as hooks from "../../../hook.js";
import * as units from "../../query.js";
import type { Unit } from "../../unit.js";
import {
    ELEMENT_TYPES,
    elementValues,
    type Elemental,
    type Type,
    type Values,
} from "./capability.js";
import { ref as burstRef, type Burst, type End } from "./burst.js";
import { dispatch } from "./hook.js";
import * as query from "./query.js";
import type * as damage from "../../../battle/damage/ep/contract.js";
import type {
    ReceivingContext,
    CommitContext as DamageCommitContext,
} from "../../../battle/damage/ep/hook.js";
import type { Request as HealingRequest } from "../../../battle/healing/ep/contract.js";
import type { CommitContext as HealingCommitContext } from "../../../battle/healing/ep/hook.js";

export interface DamageApplication {
    readonly type: Type;
    readonly epBefore: number;
    readonly epAfter: number;
    readonly epLoss: number;
    readonly burst: Ref<Burst> | null;
}

export interface HealingApplication {
    readonly epBefore: Values;
    readonly epAfter: Values;
    readonly epGain: Values;
}

export function receiveDamage(
    battle: BattleState,
    context: ReceivingContext,
    pending: damage.Pending,
): Result<damage.Pending> {
    return hooks.dispatch(battle, context, pending, {
        candidates: (current) =>
            [...(units.get(current, context.target)?.elemental.receiving ?? [])]
                .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                .map(({ id }) => id),
        find(current, id) {
            const host = units.get(current, context.target);

            return host !== undefined && query.available(host)
                ? host.elemental.receiving.find((entry) => entry.id === id)
                : undefined;
        },
    });
}

export function commitDamage(
    battle: BattleState,
    context: DamageCommitContext,
): Result<DamageApplication> {
    const { target, request, calculated, received } = context;
    const type = calculated.type;
    const self = units.get(battle, target)!;
    const maximum = query.resolveMaxEp(battle, target)!;
    const epBefore = Math.min(maximum, Math.max(0, self.elemental.ep[type]));
    const epLoss = Math.min(epBefore, received.amount);
    if (epLoss === 0) {
        return {
            state: battle,
            value: { type, epBefore, epAfter: epBefore, epLoss, burst: null },
        };
    }

    const epAfter = epBefore - epLoss;
    const definition = self.definition.elemental.bursts[type];
    const burst: Burst | null =
        epAfter > 0
            ? null
            : {
                  host: target,
                  id: self.elemental.nextBurstId,
                  type,
                  source: request.source,
                  startedAtTick: battle.tick,
                  status: "ACTIVE",
                  remainingTicks: definition.durationTicks,
              };
    const reference = burst === null ? null : burstRef(burst);
    const application: DamageApplication = { type, epBefore, epAfter, epLoss, burst: reference };
    const ep =
        burst === null ? { ...normalizedEp(self, maximum), [type]: epAfter } : elementValues(0);
    battle = replaceUnits(battle, [
        {
            ...self,
            elemental: {
                ...self.elemental,
                ep,
                burst,
                nextBurstId: self.elemental.nextBurstId + (burst === null ? 0 : 1),
            },
        },
    ]);

    if (reference !== null) {
        battle = register(
            battle,
            lifetimes.scope(lifetime, reference),
            lifetimes.scope(unitLifetime, target),
        );
    }

    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_INJURY",
            targetUnitId: target.id,
            elementType: type,
            amount: epLoss,
            tick: battle.tick,
        },
    ]);

    if (burst !== null) {
        battle = appendEvents(battle, [
            {
                type: "ELEMENTAL_BURST",
                unitId: target.id,
                elementType: type,
                position: self.position,
                tick: battle.tick,
            },
        ]);
        battle = dispatch(battle, target, "burstStarted", burst);
    }

    battle = dispatch(battle, target, "damaged", { request, ...application });

    if (reference !== null) {
        const host = units.get(battle, target);
        const active = query.get(battle, reference);
        if (host !== undefined && query.available(host) && active?.status === "ACTIVE") {
            battle = definition.onStart(battle, active);
        }

        const after = query.get(battle, reference);
        if (after?.status === "ACTIVE" && after.remainingTicks <= 0) {
            battle = finish(battle, reference);
        }
    }

    return { state: battle, value: application };
}

export function commitHealing(
    battle: BattleState,
    context: HealingCommitContext,
): Result<HealingApplication> {
    const { target, request, received } = context;
    const self = units.get(battle, target)!;
    const maximum = query.resolveMaxEp(battle, target)!;
    const epBefore = normalizedEp(self, maximum);
    const epGain = { ...elementValues(0) };
    const epAfter = { ...epBefore };

    for (const type of ELEMENT_TYPES) {
        epGain[type] = Math.min(received.amount, Math.max(0, maximum - epBefore[type]));
        epAfter[type] += epGain[type];
    }

    const application: HealingApplication = { epBefore, epAfter, epGain };
    if (!ELEMENT_TYPES.some((type) => epGain[type] > 0)) {
        return { state: battle, value: application };
    }

    battle = replaceUnits(battle, [{ ...self, elemental: { ...self.elemental, ep: epAfter } }]);
    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_INJURY_HEALED",
            targetUnitId: target.id,
            amount: Object.values(epGain).reduce((total, amount) => total + amount, 0),
            tick: battle.tick,
        },
    ]);
    battle = dispatch(battle, target, "healed", { request, ...application });

    return { state: battle, value: application };
}

export const lifetime = lifetimes.create<Burst, Burst, End>({
    kind: "ELEMENTAL_BURST",
    address: (reference) => [reference.host.id, reference.id],
    get: query.get,
    isEnding: (self) => self.status === "ENDING",
    begin: (self) => ({ ...self, status: "ENDING" }),
    replace(battle, reference, next) {
        const host = units.get(battle, reference.host)!;

        return replaceUnits(battle, [{ ...host, elemental: { ...host.elemental, burst: next } }]);
    },
    finalize(battle, reference, ending) {
        const self = units.get(battle, reference.host)!;
        const active = self.elemental.burst!;
        const definition = self.definition.elemental.bursts[active.type];

        if (definition.onEnd !== undefined) {
            battle = definition.onEnd(battle, active, ending);
        }

        const host = units.get(battle, reference.host)!;
        const maximum = query.resolveMaxEp(battle, reference.host)!;
        battle = replaceUnits(battle, [
            {
                ...host,
                elemental: {
                    ...host.elemental,
                    ep: elementValues(maximum),
                    burst: null,
                },
            },
        ]);
        battle = unregister(battle, lifetimes.scope(lifetime, reference));

        return dispatch(battle, reference.host, "burstEnded", { burst: active, end: ending });
    },
    reason: (ending) => (ending.type === "FINISHED" ? "ELEMENTAL_BURST_FINISHED" : ending.reason),
    fromDependency: (reason) => ({ type: "CANCELLED", reason }),
});

export function finish(battle: BattleState, reference: Ref<Burst>): BattleState {
    return lifetime.end(battle, reference, { type: "FINISHED" });
}

export function cancel(
    battle: BattleState,
    reference: Ref<Burst>,
    reason = "CANCELLED",
): BattleState {
    return lifetime.end(battle, reference, { type: "CANCELLED", reason });
}

export function advance(battle: BattleState, host: Ref<Unit & Elemental>): BattleState {
    const self = units.get(battle, host);
    if (self === undefined || !query.available(self)) {
        return battle;
    }

    const state = self.elemental;
    const next = { ...state };

    if (state.burst?.status === "ACTIVE") {
        const rate = query.resolveBurstRecoverySpeed(battle, host)!;
        next.burst = {
            ...state.burst,
            remainingTicks: Math.max(0, state.burst.remainingTicks - rate),
        };
    } else if (state.burst === null) {
        const power = query.resolveRecoverySpeed(battle, host)! / TICKS_PER_SECOND;
        const maximum = query.resolveMaxEp(battle, host)!;
        const ep = { ...normalizedEp(self, maximum) };
        const request: HealingRequest = { target: host, source: null, power };
        if (query.canReceiveHealing(battle, request)) {
            for (const type of ELEMENT_TYPES) {
                ep[type] = Math.min(maximum, ep[type] + power);
            }
        }

        next.ep = ep;
    } else {
        return battle;
    }

    battle = replaceUnits(battle, [{ ...self, elemental: next }]);

    return next.burst?.status === "ACTIVE" && next.burst.remainingTicks <= 0
        ? finish(battle, burstRef(next.burst))
        : battle;
}

function normalizedEp(self: Unit & Elemental, maximum: number): Values {
    return {
        NEURAL: Math.min(maximum, Math.max(0, self.elemental.ep.NEURAL)),
        EROSION: Math.min(maximum, Math.max(0, self.elemental.ep.EROSION)),
        BURN: Math.min(maximum, Math.max(0, self.elemental.ep.BURN)),
        NECROSIS: Math.min(maximum, Math.max(0, self.elemental.ep.NECROSIS)),
    };
}
