import { assertNonnegativeNumber, assertNonnegativeSafeInteger } from "../../../common/assert.js";
import type { State as BattleState, Result } from "../../state.js";
import type { Card, UnitDefinition } from "./card.js";
import type { Definition } from "./definition.js";

export interface Input<S extends object = object> {
    readonly definition: Definition<S>;
    readonly unitDefinition: UnitDefinition;
}

export function initialize<
    S extends object,
    const D extends Definition<S>,
    const U extends UnitDefinition,
>(
    battle: BattleState,
    {
        definition,
        unitDefinition,
    }: Input<S> & { readonly definition: D; readonly unitDefinition: U },
): Result<Card<S> & { readonly definition: D; readonly unitDefinition: U }> {
    const { stock, stockLimit, activeLimit, cost, redeployTicks, slots, refund } = definition;

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
    const initialized = definition.initialize(battle);

    return {
        state: initialized.state,
        value: {
            id,
            definition,
            unitDefinition,
            deployedUnits: [],
            unitHooks: definition.unitHooks,
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
