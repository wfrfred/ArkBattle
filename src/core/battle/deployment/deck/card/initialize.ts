import {
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
} from "../../../../common/assert.js";
import { createRef, type Ref } from "../../../../common/ref.js";
import { validateRestrictions } from "../../../../restriction.js";
import type { State as BattleState, Result } from "../../../state.js";
import type { Card, Policy, UnitDefinition } from "./card.js";
import type { Definition } from "./definition.js";

const config: Card["config"] = {
    end: {
        prepare: (battle) => battle,
        finalize: (battle) => battle,
    },
};

export interface Input<S extends object = object, P extends Policy = Policy> {
    readonly definition: Definition<S, P>;
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
): Result<Card<S, D["policy"]> & { readonly definition: D; readonly unitDefinition: U }> {
    const { dp, slot, policy, supply } = definition;
    const { stock, stockLimit, activeLimit, cooldown } = supply;

    assertNonnegativeNumber(dp.parameters.cost, "card cost");
    assertNonnegativeSafeInteger(cooldown, "card redeployment ticks");
    assertNonnegativeSafeInteger(slot, "card deployment slots");
    assertNonnegativeSafeInteger(stock, "card stock");

    if (stockLimit !== null) {
        assertNonnegativeSafeInteger(stockLimit, "card stock limit");
    }
    if (activeLimit !== null) {
        assertNonnegativeSafeInteger(activeLimit, "card active limit");
    }

    const pending = definition.policy === "QUEUED" ? definition.supply.pending : 0;
    assertNonnegativeSafeInteger(pending, "card pending recovery count");

    if (stockLimit !== null && stock + pending > stockLimit) {
        throw new RangeError("card stock exceeds the limit");
    }

    validateRestrictions(definition.deploymentRestrictions);

    const initialized = definition.initialize(battle);

    const value = {
        ref: createRef<Card>({}, getCard),
        config,
        policy,
        definition,
        dp: {
            stage: 0,
            contributions: [],
            ...(policy === "UNIQUE" ? { increase: [] } : {}),
        },
        supply: {
            stock,
            cooldown: pending > 0 ? cooldown : 0,
            paused: false,
            stockLimit: [],
            activeLimit: [],
            redeployTime: [],
            ...(policy === "QUEUED" ? { pending } : {}),
        },
        unitDefinition,
        unitHooks: definition.unitHooks,
        restrictions: [],
        state: initialized.value,
    };

    return {
        state: initialized.state,
        value: value as object as Card<S, D["policy"]> & {
            readonly definition: D;
            readonly unitDefinition: U;
        },
    };
}

function getCard(this: object, battle: BattleState): Card | undefined {
    return battle.deployment.deck.cards.get(this as Ref<Card>);
}
