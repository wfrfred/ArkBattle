import { add } from "../../dist/core/battle/unit.js";
import { fixtureBattlefieldState } from "./battlefield.js";
import { createBattleState } from "../../dist/core/battle/state.js";

export function effectFixtureWork(...units) {
    let state = createBattleState(fixtureBattlefieldState([]));
    for (const unit of units) {
        state = add(state, unit);
    }
    return state;
}
