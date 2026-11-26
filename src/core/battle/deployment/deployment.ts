import type * as card from "./deck/card/card.js";
import { initialize as initializeCard, type Input as CardInput } from "./deck/card/initialize.js";
import * as deck from "./deck/deck.js";
import * as dp from "./dp/dp.js";
import * as slot from "./slot/slot.js";
import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { State as BattleState } from "../state.js";
import { replaceIn } from "../../common/object.js";
import { add as addCard } from "./deck/operations.js";

export interface Definition extends deck.Definition {
    readonly dp: dp.Definition;
    readonly slot: slot.Definition;
}

export interface Input<States extends readonly object[] = readonly object[]> {
    readonly definition: Definition;
    readonly cards: { readonly [K in keyof States]: CardInput<States[K]> };
}

export interface DeploymentRecord {
    readonly card: Ref<card.Card>;
    readonly unit: Ref<Unit & Deployable>;
}

export interface State {
    readonly deck: deck.State;
    readonly dp: dp.State;
    readonly slot: slot.State;
    readonly history: readonly DeploymentRecord[];
}

const emptyDefinition: Definition = {
    costCeiling: 99,
    dp: { initial: 0, min: 0, max: 99, recoveryInterval: null },
    slot: { limit: null },
};

export function create(definition: Definition | null): State {
    const config = definition ?? emptyDefinition;

    return {
        deck: deck.initialize(config),
        dp: dp.initialize(config.dp),
        slot: slot.initialize(config.slot),
        history: [],
    };
}

export function initialize<States extends readonly object[]>(
    battle: BattleState,
    input: Input<States> | null,
): BattleState {
    if (input === null) {
        return battle;
    }

    battle = replaceIn(battle, ["deployment"], create(input.definition));

    for (const card of input.cards) {
        const initialized = initializeCard(battle, card);
        battle = addCard(initialized.state, initialized.value);
    }

    return battle;
}
