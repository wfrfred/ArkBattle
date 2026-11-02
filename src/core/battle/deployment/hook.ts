import * as hooks from "../../hook.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import type { DeployRequest } from "./request.js";

export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly request: DeployRequest;
}

export type Hook = hooks.Hook<Deployed, void>;

export function setHook(battle: BattleState, entry: Hook): BattleState {
    const next = hooks.set(battle.deployment.hooks, entry);

    return next === battle.deployment.hooks
        ? battle
        : {
              ...battle,
              deployment: { ...battle.deployment, hooks: next },
          };
}

export function removeHook(battle: BattleState, id: string): BattleState {
    const next = hooks.remove(battle.deployment.hooks, id);

    return next === battle.deployment.hooks
        ? battle
        : {
              ...battle,
              deployment: { ...battle.deployment, hooks: next },
          };
}

export function dispatch(battle: BattleState, event: Deployed): BattleState {
    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => current.deployment.hooks.map(({ id }) => id),
        find: (current, id) => current.deployment.hooks.find((entry) => entry.id === id),
    }).state;
}
