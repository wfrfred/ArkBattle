import { replaceIn } from "../../../common/object.js";
import type { State as BattleState } from "../../state.js";
import type { Pending } from "./slot.js";

export function occupy(battle: BattleState, amount: number): BattleState {
    const { slot } = battle.deployment;

    return replaceIn(battle, ["deployment", "slot", "used"], slot.used + amount);
}

export function release(battle: BattleState, amount: number, delayTicks = 0): BattleState {
    if (amount === 0) {
        return battle;
    }

    const { slot } = battle.deployment;

    return delayTicks === 0
        ? replaceIn(battle, ["deployment", "slot", "used"], slot.used - amount)
        : replaceIn(
              battle,
              ["deployment", "slot", "pending"],
              [...slot.pending, { amount, atTick: battle.tick + delayTicks }],
          );
}

export function advance(battle: BattleState): BattleState {
    const { slot } = battle.deployment;
    let released = 0;
    const pending: Pending[] = [];

    for (const release of slot.pending) {
        if (release.atTick <= battle.tick) {
            released += release.amount;
        } else {
            pending.push(release);
        }
    }

    return released === 0
        ? battle
        : replaceIn(battle, ["deployment", "slot"], {
              ...slot,
              used: slot.used - released,
              pending,
          });
}
