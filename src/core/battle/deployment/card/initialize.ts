import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../state.js";
import type { Card, UnitDefinition } from "./card.js";

export function initialize<S extends object, const D extends UnitDefinition<S>>(
    battle: BattleState,
    definition: UnitDefinition<S> & D,
): Result<Card<S> & { readonly definition: D }> {
    const { stock, stockLimit, activeLimit, cost, redeployTicks, slots, refund } = definition.card;

    assertNonnegativeNumber(cost, "card cost");
    assertNonnegativeSafeInteger(redeployTicks, "card redeployment ticks");
    assertNonnegativeSafeInteger(slots, "card deployment slots");
    assertNonnegativeSafeInteger(stock, "card stock");

    if (refund !== null) {
        assertNonnegativeNumber(refund.rate, "card refund rate");
    }

    if (stockLimit !== null) {
        assertNonnegativeSafeInteger(stockLimit, "card stock limit");
    }
    if (activeLimit !== null) {
        assertNonnegativeSafeInteger(activeLimit, "card active limit");
    }
    if (stockLimit !== null && stock > stockLimit) {
        throw new RangeError("card stock exceeds the limit");
    }

    const id = battle.execution.nextCardId;
    battle = { ...battle, execution: { ...battle.execution, nextCardId: id + 1 } };
    const initialized = definition.card.initialize(battle);

    return {
        state: initialized.state,
        value: {
            id,
            definition,
            deployedUnits: [],
            unitHooks: definition.card.unitHooks,
            restrictions: [],
            state: initialized.value,
            stock,
            cooldown: null,
            recovery: null,
            costStage: 0,
            costContributions: [],
            redeployTimeContributions: [],
        },
    };
}
