import { replace as replaceUnits } from "../../operations.js";
import { assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { Ref } from "../../../common/ref.js";
import { TICKS_PER_SECOND } from "../../../tick.js";
import { appendEvents, type State as BattleState, type Result } from "../../../battle/state.js";
import * as effects from "../../effect/operations.js";
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
import type { Burst } from "./burst.js";
import { dispatch, damaged, healed } from "./hook.js";
import * as query from "./query.js";
import type * as damage from "../../../battle/resource/ep/damage/contract.js";
import {
    receiving,
    type ReceivingContext,
    type CommitContext as DamageCommitContext,
} from "../../../battle/resource/ep/damage/hook.js";
import type { Request as HealingRequest } from "../../../battle/resource/ep/healing/contract.js";
import type { CommitContext as HealingCommitContext } from "../../../battle/resource/ep/healing/hook.js";
import { allows } from "../../../restriction.js";
import { replaceIn } from "../../../common/object.js";

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
    options?: hooks.Options,
): Result<damage.Pending> {
    const result = hooks.dispatch<ReceivingContext, damage.Pending>(battle, context, pending, {
        candidates: (current) =>
            (units.get(current, context.request.target)?.hooks.get(receiving) ?? []).filter(
                ({ id }) => !hooks.excluded(options, receiving, id),
            ),
        find(current, id) {
            const host = units.get(current, context.request.target);

            return host !== undefined && query.available(host)
                ? host.hooks.find(receiving, id)
                : undefined;
        },
    });

    return {
        state: result.state,
        value:
            result.value.type === "CANCELLED"
                ? result.value
                : { ...result.value, amount: Math.max(0, result.value.amount) },
    };
}

export function commitDamage(
    battle: BattleState,
    context: DamageCommitContext,
): Result<DamageApplication> {
    const { request, calculated, received } = context;
    const target = request.target;
    const type = calculated.type;
    const self = units.get(battle, target)!;
    const maximum = query.resolveMaxEp(battle, self);
    const epBefore = Math.min(maximum, self.elemental.ep[type]);
    const epLoss = Math.min(epBefore, received.amount);
    const epAfter = epBefore - epLoss;
    const depleted = epAfter === 0;
    const ep =
        epLoss > 0 && depleted
            ? elementValues(0)
            : { ...normalizedEp(self, maximum), [type]: epAfter };
    if (ELEMENT_TYPES.some((type) => ep[type] !== self.elemental.ep[type])) {
        battle = replaceUnits(battle, [replaceIn(self, ["elemental", "ep"], ep)]);
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

    if (epLoss === 0) {
        return {
            state: battle,
            value: { type, epBefore, epAfter, epLoss, burst: null },
        };
    }

    let reference: Ref<Burst> | null = null;
    if (depleted) {
        const installed = effects.install(battle, target, self.definition.elemental.bursts[type], {
            source: request.source,
        });
        battle = installed.state;
        reference = installed.value! as Ref<Burst>;
    }

    const application: DamageApplication = { type, epBefore, epAfter, epLoss, burst: reference };
    battle = dispatch(battle, target, damaged, { request, ...application });

    return { state: battle, value: application };
}

export function commitHealing(
    battle: BattleState,
    context: HealingCommitContext,
): Result<HealingApplication> {
    const { request, received } = context;
    const target = request.target;
    const self = units.get(battle, target)!;
    const maximum = query.resolveMaxEp(battle, self);
    const epBefore = normalizedEp(self, maximum);
    const epGain = { ...elementValues(0) };
    const epAfter = { ...epBefore };

    for (const type of ELEMENT_TYPES) {
        epGain[type] = Math.min(received.amount, Math.max(0, maximum - epBefore[type]));
        epAfter[type] += epGain[type];
    }

    const application: HealingApplication = { epBefore, epAfter, epGain };
    const amount = Object.values(epGain).reduce((total, gain) => total + gain, 0);
    if (ELEMENT_TYPES.some((type) => epAfter[type] !== self.elemental.ep[type])) {
        battle = replaceUnits(battle, [replaceIn(self, ["elemental", "ep"], epAfter)]);
    }

    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_INJURY_HEALED",
            targetUnitId: target.id,
            amount,
            tick: battle.tick,
        },
    ]);

    if (amount > 0) {
        battle = dispatch(battle, target, healed, { request, ...application });
    }

    return { state: battle, value: application };
}

export function reduceDuration(
    battle: BattleState,
    reference: Ref<Burst>,
    ticks: number,
): BattleState {
    assertNonnegativeSafeInteger(ticks, "elemental recovery duration reduction");

    if (ticks === 0) {
        return battle;
    }

    const host = units.get(battle, reference.host);
    const self = query.get(battle, reference);
    if (
        host === undefined ||
        !query.available(host) ||
        self === undefined ||
        self.lifecycle === "ENDING"
    ) {
        return battle;
    }

    const expiration = self.expiration;
    const elapsed = expiration.duration - expiration.remaining;
    const duration = Math.max(0, expiration.duration - ticks);
    const remaining = Math.max(0, duration - elapsed);
    battle = effects.setExpiration(battle, reference, { ...expiration, duration, remaining });

    const current = units.get(battle, reference.host)!;
    const maximum = query.resolveMaxEp(battle, current);
    const ep = elementValues(remaining === 0 ? maximum : (maximum * elapsed) / duration);
    battle = replaceUnits(battle, [replaceIn(current, ["elemental", "ep"], ep)]);

    return remaining === 0 ? finish(battle, reference) : battle;
}

export function finish(battle: BattleState, reference: Ref<Burst>): BattleState {
    return effects.remove(battle, reference, "ELEMENTAL_BURST_FINISHED");
}

export function cancel(
    battle: BattleState,
    reference: Ref<Burst>,
    reason = "CANCELLED",
): BattleState {
    return effects.remove(battle, reference, reason);
}

export function advance(battle: BattleState, host: Ref<Unit & Elemental>): BattleState {
    const self = units.get(battle, host);
    if (self === undefined || !query.available(self)) {
        return battle;
    }

    if (self.elemental.burst !== null) {
        return battle;
    }

    const power = query.resolveRecoverySpeed(battle, self) / TICKS_PER_SECOND;
    const request: HealingRequest = { target: host, source: null, parameters: { power } };
    if (!allows(battle, { self, request }, self.elemental.healingRestrictions)) {
        return battle;
    }

    const maximum = query.resolveMaxEp(battle, self);
    const ep = { ...normalizedEp(self, maximum) };

    for (const type of ELEMENT_TYPES) {
        ep[type] = Math.min(maximum, ep[type] + power);
    }

    if (ELEMENT_TYPES.every((type) => ep[type] === self.elemental.ep[type])) {
        return battle;
    }

    return replaceUnits(battle, [replaceIn(self, ["elemental", "ep"], ep)]);
}

function normalizedEp(self: Unit & Elemental, maximum: number): Values {
    const ep = { ...self.elemental.ep };

    for (const type of ELEMENT_TYPES) {
        ep[type] = Math.min(ep[type], maximum);
    }

    return ep;
}
