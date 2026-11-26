import type { State as BattleState } from "../state.js";
import * as hooks from "../../hook.js";
import type { Relation } from "../../unit/capability/blocking/contract.js";
import { hasRelation } from "./query.js";
import * as blockerHooks from "../../unit/capability/blocking/blocker/blocker.js";
import * as blockableHooks from "../../unit/capability/blocking/blockable/blockable.js";

type Notification = "acquired" | "released";

export function dispatch(battle: BattleState, key: Notification, relation: Relation): BattleState {
    const blocker = relation.blocker.get(battle);
    const blocked = relation.blocked.get(battle);
    const blockerKey = blockerHooks[key];
    const blockableKey = blockableHooks[key];
    const blockerCandidates = blocker?.hooks.get(blockerKey) ?? [];
    const blockedCandidates = blocked?.hooks.get(blockableKey) ?? [];
    const stop = (current: BattleState) => key === "acquired" && !hasRelation(current, relation);

    battle = hooks.dispatch(battle, { host: relation.blocker, relation }, undefined, {
        candidates: () => blockerCandidates,
        find: (current, id) => {
            const host = relation.blocker.get(current);

            return host?.hooks.find(blockerKey, id);
        },
        stop,
    }).state;

    return hooks.dispatch(battle, { host: relation.blocked, relation }, undefined, {
        candidates: () => blockedCandidates,
        find: (current, id) => {
            const host = relation.blocked.get(current);

            return host?.hooks.find(blockableKey, id);
        },
        stop,
    }).state;
}
