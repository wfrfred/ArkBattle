import type { State as BattleState } from "../../state.js";
import type { PendingSlotRelease } from "../deployment.js";

export function advanceSlotReleases(battle: BattleState): BattleState {
    let releasedSlots = 0;
    const pendingSlotReleases: PendingSlotRelease[] = [];

    for (const release of battle.deployment.pendingSlotReleases) {
        if (release.readyAtTick <= battle.tick) {
            releasedSlots += release.slots;
        } else {
            pendingSlotReleases.push(release);
        }
    }

    return releasedSlots === 0
        ? battle
        : {
              ...battle,
              deployment: {
                  ...battle.deployment,
                  usedSlots: battle.deployment.usedSlots - releasedSlots,
                  pendingSlotReleases,
              },
          };
}
