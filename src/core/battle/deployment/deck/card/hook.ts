import type { Entry } from "../../../../common/collection/entries.js";
import type { Ref } from "../../../../common/ref.js";
import * as hooks from "../../../../hook.js";
import type { Unit } from "../../../../unit/unit.js";
import type { Deployable } from "../../../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../../../state.js";
import type { DeployRequest } from "../../request.js";
import { replace } from "../operations.js";
import type { Card } from "./card.js";

export interface Deployed {
    readonly unit: Unit & Deployable;
    readonly request: DeployRequest;
}

export type Hook = hooks.Hook<Deployed, void>;

export const deployed = hooks.key<Hook, Card>("card.deployed");

export function setHook<H extends Entry>(
    battle: BattleState,
    reference: Ref<Card>,
    key: hooks.Key<H, Card>,
    entry: NoInfer<H>,
): BattleState {
    const self = reference.get(battle)!;
    const next = self.hooks.set(key, entry);

    return next === self.hooks ? battle : replace(battle, { ...self, hooks: next });
}

export function removeHook<H extends Entry>(
    battle: BattleState,
    reference: Ref<Card>,
    key: hooks.Key<H, Card>,
    id: string,
): BattleState {
    const self = reference.get(battle)!;
    const next = self.hooks.remove(key, id);

    return next === self.hooks ? battle : replace(battle, { ...self, hooks: next });
}

export function dispatch(battle: BattleState, event: Deployed): BattleState {
    const reference = event.request.card;

    return hooks.dispatch(battle, event, undefined, {
        candidates: (current) => reference.get(current)!.hooks.get(deployed),
        find: (current, id) => reference.get(current)!.hooks.find(deployed, id),
    }).state;
}
