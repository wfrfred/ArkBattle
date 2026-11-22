import * as hooks from "../../hook.js";
import type { Entry } from "../../common/collection/entries.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import type { DeployRequest, RedeployRequest } from "./request.js";

export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly request: DeployRequest;
    readonly redeploy: RedeployRequest | null;
}

export type Hook = hooks.Hook<Deployed, void>;

export const deployed = hooks.key<Hook, BattleState>("deployment.deployed");

export function setHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, BattleState>,
    entry: NoInfer<H>,
): BattleState {
    const next = battle.deployment.hooks.set(key, entry);

    return next === battle.deployment.hooks
        ? battle
        : {
              ...battle,
              deployment: { ...battle.deployment, hooks: next },
          };
}

export function removeHook<H extends Entry>(
    battle: BattleState,
    key: hooks.Key<H, BattleState>,
    id: string,
): BattleState {
    const next = battle.deployment.hooks.remove(key, id);

    return next === battle.deployment.hooks
        ? battle
        : {
              ...battle,
              deployment: { ...battle.deployment, hooks: next },
          };
}

export function dispatch(battle: BattleState, event: Deployed): BattleState {
    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => current.deployment.hooks.get(deployed),
        find: (current, id) => current.deployment.hooks.find(deployed, id),
    }).state;
}
