import { hasDeployable, resolveRefund } from "../../unit/capability/deployable/capability.js";
import type { Deployed } from "../../unit/capability/deployable/hook.js";
import type { Unit, LeaveReason } from "../../unit/unit.js";
import { appendEvents, type State as BattleState } from "../state.js";
import * as units from "../../unit/query.js";
import * as hook from "../../hook.js";
import * as card from "./card.js";
import { changeDp } from "./deployment.js";
import { getCard } from "./query.js";
import { updateCard } from "./resources.js";

export function recordUnitDeployment(battle: BattleState, unit: Unit): BattleState {
    if (!hasDeployable(unit) || unit.deployable.cardId === null) {
        return battle;
    }

    return appendEvents(battle, [
        {
            type: "UNIT_DEPLOYED",
            unitId: unit.id,
            position: unit.position,
            tick: battle.tick,
        },
    ]);
}

export function refundUnit(
    state: BattleState,
    unit: Unit,
    reason: LeaveReason,
    tick: number,
): BattleState {
    if (reason !== "RETREAT" || !hasDeployable(unit)) {
        return state;
    }

    const deployment = changeDp(
        state.deployment,
        resolveRefund(unit.definition.deployable, unit.deployable),
        tick,
    );

    return deployment === state.deployment ? state : { ...state, deployment };
}

export function recycleUnitCard(
    state: BattleState,
    unit: Unit,
    reason: LeaveReason,
    tick: number,
): BattleState {
    if (!hasDeployable(unit) || unit.deployable.cardId === null) {
        return state;
    }

    const value = getCard(state, unit.deployable.cardId);
    if (value === undefined) {
        throw new RangeError(`unknown deployment card ${unit.deployable.cardId}`);
    }

    return updateCard(state, card.advance(card.recycle(value, tick, reason), tick));
}

export function notifyDeployed(state: BattleState, deployed: Deployed): BattleState {
    const candidates = new Map(
        units
            .all(state)
            .filter(hasDeployable)
            .flatMap((unit) => {
                const ref = units.ref(unit);

                return unit.deployable.deployedHooks.map(
                    ({ id }) => [JSON.stringify([ref.id, id]), { ref, id }] as const,
                );
            }),
    );

    return hook.dispatch(state, deployed, undefined, {
        candidates: () => [...candidates.keys()],
        find: (current, key) => {
            const candidate = candidates.get(key)!;
            const unit = units.get(current, candidate.ref);

            return unit?.lifecycle === "PRESENT"
                ? unit.deployable.deployedHooks.find((entry) => entry.id === candidate.id)
                : undefined;
        },
    }).state;
}
