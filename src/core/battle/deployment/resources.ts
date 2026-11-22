import type { State as BattleState } from "../state.js";
import type { EndReason } from "../../unit/unit.js";
import type { State as DeployableState } from "../../unit/capability/deployable/capability.js";
import { TICKS_PER_SECOND } from "../../tick.js";
import type { PendingSlotRelease } from "./deployment.js";
import { ref, type Card } from "./card/card.js";
import { get, all } from "./card/query.js";
import * as card from "./card/state.js";
import * as dp from "./dp.js";
import { recycle, replace } from "./card/operations.js";

export function settleDeparture(
    battle: BattleState,
    reason: EndReason,
    { card, slots }: Pick<DeployableState, "card" | "slots">,
): BattleState {
    if (slots !== 0) {
        const current = battle.deployment;
        const deployment =
            reason === "DEATH"
                ? {
                      ...current,
                      pendingSlotReleases: [
                          ...current.pendingSlotReleases,
                          { readyAtTick: battle.tick + TICKS_PER_SECOND, slots },
                      ],
                  }
                : { ...current, usedSlots: current.usedSlots - slots };
        battle = { ...battle, deployment };
    }

    return card !== null &&
        (reason === "RETREAT" || reason === "DEATH" || reason === "REDEPLOY_EXTERNAL")
        ? recycle(battle, card)
        : battle;
}

function advanceSlotReleases(battle: BattleState): BattleState {
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

export function advanceResources(battle: BattleState, self: Card<any>): BattleState {
    battle = advanceSlotReleases(battle);
    battle = replace(battle, card.advance(self, battle.tick));
    const deployment = dp.advance(battle.deployment, battle.tick);

    return deployment === battle.deployment ? battle : { ...battle, deployment };
}

export function advance(state: BattleState): BattleState {
    state = advanceSlotReleases(state);
    const tick = state.tick;
    const candidates = all(state);

    for (const candidate of candidates) {
        const reference = ref(candidate);
        const self = card.advance(get(state, reference)!, tick);
        state = replace(state, self);
        state = self.definition.onTick?.(state, self) ?? state;
    }

    const deployment = dp.advance(state.deployment, tick);

    return deployment === state.deployment ? state : { ...state, deployment };
}
