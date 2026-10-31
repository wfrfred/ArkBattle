import {
    hasDeployable,
    resolveRefund,
    type Deployable,
} from "../../unit/capability/deployable/capability.js";
import type { Deployed } from "../../unit/capability/deployable/hook.js";
import type { Unit } from "../../unit/unit.js";
import type { PrepareHook, LeaveHook } from "../../unit/hook.js";
import type { State as BattleState } from "../state.js";
import * as units from "../../unit/query.js";
import * as hook from "../../hook.js";
import * as card from "./card/state.js";
import { changeDp } from "./deployment.js";
import { get as getCard } from "./card/query.js";
import { replaceCard } from "./resources.js";

export const prepare: PrepareHook = {
    id: "@deployable/prepare",
    stage: "prepare",
    invoke: (battle, { unit: initial, reason }) => {
        if (reason !== "RETREAT") {
            return { state: battle, value: undefined };
        }

        const unit = units.get(battle, units.ref(initial as Unit & Deployable))!;
        const deployment = changeDp(
            battle.deployment,
            resolveRefund(unit.definition.deployable, unit.deployable),
            battle.tick,
        );

        return {
            state: deployment === battle.deployment ? battle : { ...battle, deployment },
            value: undefined,
        };
    },
};

export const leave: LeaveHook = {
    id: "@deployable/leave",
    stage: "leave",
    invoke: (battle, { unit: previous, reason }) => {
        const unit = previous as Unit & Deployable;
        if (unit.deployable.card === null) {
            return { state: battle, value: undefined };
        }

        const value = getCard(battle, unit.deployable.card)!;

        return {
            state: replaceCard(
                battle,
                card.advance(card.recycle(value, battle.tick, reason), battle.tick),
            ),
            value: undefined,
        };
    },
};

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
