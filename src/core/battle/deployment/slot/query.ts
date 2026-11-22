import { resolve } from "../../../common/contribution.js";
import { apply } from "../../../common/modifier.js";
import type { State as BattleState } from "../../state.js";

export function resolveLimit(battle: BattleState): number | null {
    const { definition, limit } = battle.deployment.slot;

    return definition.limit === null ? null : apply(definition.limit, resolve(limit));
}

export function remaining(battle: BattleState): number | null {
    const limit = resolveLimit(battle);

    return limit === null ? null : Math.max(0, limit - battle.deployment.slot.used);
}
