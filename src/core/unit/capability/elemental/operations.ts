import { replace as replaceUnits } from "../../../battle/unit.js";
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
import { definitions, type Burst } from "./burst.js";
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
            [...(units.get(current, context.target)?.elemental.damageReceiving ?? [])]
                .sort((left, right) => (right.priority ?? 0) - (left.priority ?? 0))
                .map(({ id }) => id),
        find(current, id) {
            const host = units.get(current, context.target);

            return host !== undefined && query.available(host)
                ? host.elemental.damageReceiving.find((entry) => entry.id === id)
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
    const maximum = query.resolveMaxEp(battle, self);
    const epBefore = Math.min(maximum, Math.max(0, self.elemental.ep[type]));
    const epLoss = Math.min(epBefore, received.amount);
    if (epLoss === 0) {
        return {
            state: battle,
            value: { type, epBefore, epAfter: epBefore, epLoss, burst: null },
        };
    }

    const epAfter = epBefore - epLoss;
    const depleted = epAfter === 0;
    const ep = depleted ? elementValues(0) : { ...normalizedEp(self, maximum), [type]: epAfter };
    battle = replaceUnits(battle, [{ ...self, elemental: { ...self.elemental, ep } }]);

    battle = appendEvents(battle, [
        {
            type: "ELEMENTAL_INJURY",
            targetUnitId: target.id,
            elementType: type,
            amount: epLoss,
            tick: battle.tick,
        },
    ]);

    let reference: Ref<Burst> | null = null;
    if (depleted) {
        const installed = effects.install(battle, target, definitions[type], {
            source: request.source,
            enabled: false,
        });
        battle = installed.state;
        reference = installed.value!;
    }

    const application: DamageApplication = { type, epBefore, epAfter, epLoss, burst: reference };
    battle = dispatch(battle, target, "damaged", { request, ...application });

    if (reference !== null) {
        battle = effects.setEnabled(battle, reference, true);
    }

    return { state: battle, value: application };
}

export function commitHealing(
    battle: BattleState,
    context: HealingCommitContext,
): Result<HealingApplication> {
    const { target, request, received } = context;
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

export function finish(battle: BattleState, reference: Ref<Burst>): BattleState {
    return effects.end(battle, reference, "ELEMENTAL_BURST_FINISHED");
}

export function cancel(
    battle: BattleState,
    reference: Ref<Burst>,
    reason = "CANCELLED",
): BattleState {
    return effects.end(battle, reference, reason);
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
    const request: HealingRequest = { target: host, source: null, power };
    if (!self.elemental.healingRules.every((rule) => rule.allows(battle, { self, request }))) {
        return battle;
    }

    const maximum = query.resolveMaxEp(battle, self);
    const ep = { ...normalizedEp(self, maximum) };

    for (const type of ELEMENT_TYPES) {
        ep[type] = Math.min(maximum, ep[type] + power);
    }

    return replaceUnits(battle, [{ ...self, elemental: { ...self.elemental, ep } }]);
}

function normalizedEp(self: Unit & Elemental, maximum: number): Values {
    return {
        NEURAL: Math.min(maximum, Math.max(0, self.elemental.ep.NEURAL)),
        EROSION: Math.min(maximum, Math.max(0, self.elemental.ep.EROSION)),
        BURN: Math.min(maximum, Math.max(0, self.elemental.ep.BURN)),
        NECROSIS: Math.min(maximum, Math.max(0, self.elemental.ep.NECROSIS)),
    };
}
