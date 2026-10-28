import type { Ref } from "../../common/ref.js";
import { advance, stop } from "../projectile.js";
import { ref } from "../../projectile/query.js";
import type { Projectile } from "../../projectile/projectile.js";
import type { State as BattleState } from "../state.js";
import type { Command } from "../contract.js";

export function advanceProjectiles<P extends Projectile<any>>(
    battle: BattleState,
    candidates: readonly Ref<P>[],
    commands: readonly Command[] = [],
): BattleState {
    for (const command of commands) {
        if (command.type !== "STOP_PROJECTILE") {
            continue;
        }

        const current = battle.battlefield.projectiles.get(command.projectileId);
        if (current !== undefined) {
            battle = stop(battle, ref(current));
        }
    }

    return advance(battle, candidates);
}
