import type { State as BattleState } from "../state.js";
import { ref, type Card } from "./card/card.js";
import { get, all } from "./card/query.js";
import * as card from "./card/state.js";
import * as dp from "./dp.js";
import { replace } from "./card/operations.js";

export function releaseSlots(battle: BattleState, amount: number): BattleState {
    return amount === 0
        ? battle
        : {
              ...battle,
              deployment: {
                  ...battle.deployment,
                  usedSlots: battle.deployment.usedSlots - amount,
              },
          };
}

export function advanceResources(battle: BattleState, self: Card<any>): BattleState {
    battle = replace(battle, card.advance(self, battle.tick));
    const deployment = dp.advance(battle.deployment, battle.tick);

    return deployment === battle.deployment ? battle : { ...battle, deployment };
}

export function advance(state: BattleState): BattleState {
    const tick = state.tick;
    const candidates = all(state);

    for (const candidate of candidates) {
        const reference = ref(candidate);
        const self = card.advance(get(state, reference)!, tick);
        state = replace(state, self);
        state = self.definition.card.onTick?.(state, self) ?? state;
    }

    const deployment = dp.advance(state.deployment, tick);

    return deployment === state.deployment ? state : { ...state, deployment };
}
