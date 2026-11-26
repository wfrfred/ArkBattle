import type { Entry } from "../../../../common/collection/entries.js";
import type { Ref } from "../../../../common/ref.js";
import * as hooks from "../../../../hook.js";
import type { Input as UnitInput } from "../../../../unit/initialize.js";
import type { Result, State as BattleState } from "../../../state.js";
import type { DeployRequest } from "./request.js";
import { replace } from "../operations.js";
import type { Card, UnitDefinition } from "./card.js";

export type BeforeDeployHook = hooks.Hook<DeployRequest, UnitInput<UnitDefinition>>;

export const beforeDeploy = hooks.key<BeforeDeployHook, Card>("card.beforeDeploy");

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

export function dispatch(
    battle: BattleState,
    request: DeployRequest,
    input: UnitInput<UnitDefinition>,
): Result<UnitInput<UnitDefinition>> {
    const reference = request.card;

    return hooks.dispatch(battle, request, input, {
        candidates: (current) => reference.get(current)!.hooks.get(beforeDeploy),
        find: (current, id) => reference.get(current)!.hooks.find(beforeDeploy, id),
    });
}
