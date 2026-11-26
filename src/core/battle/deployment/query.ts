import type { Ref } from "../../common/ref.js";
import type { State as BattleState } from "../state.js";
import type { Unit } from "../../unit/unit.js";
import type { Card } from "./deck/card/card.js";

export function cardForUnit(battle: BattleState, reference: Ref<Unit>): Ref<Card> | null {
    return battle.deployment.history.find(({ unit }) => unit === reference)?.card ?? null;
}
