import type { State as BattleState } from "../state.js";
import * as units from "../../unit/query.js";
import * as hooks from "../../hook.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";
import { hasRelation } from "./query.js";
import * as blockerHooks from "../../unit/capability/blocking/blocker.js";
import * as blockableHooks from "../../unit/capability/blocking/blockable.js";

type Notification = "acquired" | "released";

export function dispatch(battle: BattleState, key: Notification, relation: Relation): BattleState {
    const blocker = units.get(battle, relation.blocker);
    const blocked = units.get(battle, relation.blocked);
    const blockerKey = blockerHooks[key];
    const blockableKey = blockableHooks[key];
    const blockerIds = blocker?.hooks.get(blockerKey).map(({ id }) => id) ?? [];
    const blockedIds = blocked?.hooks.get(blockableKey).map(({ id }) => id) ?? [];
    const stop = (current: BattleState) => key === "acquired" && !hasRelation(current, relation);

    battle = hooks.dispatch(battle, { host: relation.blocker, relation }, undefined, {
        candidates: () => blockerIds,
        find: (current, id) => {
            const host = units.get(current, relation.blocker);

            return host?.hooks.find(blockerKey, id);
        },
        stop,
    }).state;

    return hooks.dispatch(battle, { host: relation.blocked, relation }, undefined, {
        candidates: () => blockedIds,
        find: (current, id) => {
            const host = units.get(current, relation.blocked);

            return host?.hooks.find(blockableKey, id);
        },
        stop,
    }).state;
}
