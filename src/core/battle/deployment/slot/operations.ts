import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import type { PendingSlotRelease, State } from "./slot.js";

export function allows(slot: State, slots: number): boolean {
    return slot.limit === null || slot.used + slots <= slot.limit;
}

export function occupy(battle: BattleState, slots: number): BattleState {
    const { slot } = battle.deployment;

    return replaceIn(battle, ["deployment", "slot", "used"], slot.used + slots);
}

export function release(battle: BattleState, slots: number, readyAtTick: number): BattleState {
    if (slots === 0) {
        return battle;
    }

    const { slot } = battle.deployment;

    return readyAtTick <= battle.tick
        ? replaceIn(battle, ["deployment", "slot", "used"], slot.used - slots)
        : replaceIn(
              battle,
              ["deployment", "slot", "pending"],
              [...slot.pending, { readyAtTick, slots }],
          );
}

export function advance(battle: BattleState): BattleState {
    const { slot } = battle.deployment;
    let releasedSlots = 0;
    const pending: PendingSlotRelease[] = [];

    for (const release of slot.pending) {
        if (release.readyAtTick <= battle.tick) {
            releasedSlots += release.slots;
        } else {
            pending.push(release);
        }
    }

    return releasedSlots === 0
        ? battle
        : replaceIn(battle, ["deployment", "slot"], {
              ...slot,
              used: slot.used - releasedSlots,
              pending,
          });
}
