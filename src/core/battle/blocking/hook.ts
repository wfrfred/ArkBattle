import type { State as BattleState } from "../state.js";
import * as units from "../../unit/query.js";
import * as hooks from "../../hook.js";
import type { Relation, Key } from "../../unit/capability/blocking/contract.js";
import { hasRelation } from "./query.js";

export function dispatch(battle: BattleState, key: Key, relation: Relation): BattleState {
    const blocker = units.get(battle, relation.blocker);
    const blocked = units.get(battle, relation.blocked);
    const blockerIds = blocker?.blocker[key].map(({ id }) => id) ?? [];
    const blockedIds = blocked?.blockable[key].map(({ id }) => id) ?? [];
    const stop = (current: BattleState) => key === "acquired" && !hasRelation(current, relation);

    battle = hooks.dispatch(battle, { host: relation.blocker, relation }, undefined, {
        candidates: () => blockerIds,
        find: (current, id) => {
            const host = units.get(current, relation.blocker);

            return host?.blocker[key].find((entry) => entry.id === id);
        },
        stop,
    }).state;

    return hooks.dispatch(battle, { host: relation.blocked, relation }, undefined, {
        candidates: () => blockedIds,
        find: (current, id) => {
            const host = units.get(current, relation.blocked);

            return host?.blockable[key].find((entry) => entry.id === id);
        },
        stop,
    }).state;
}
