import type * as card from "./deck/card/card.js";
import type { Input as CardInput } from "./deck/card/initialize.js";
import * as deck from "./deck/deck.js";
import * as dp from "./dp/dp.js";
import * as slot from "./slot/slot.js";
import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { Hooks } from "../../hook.js";

export interface Definition extends deck.Definition, dp.Definition, slot.Definition {}

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
    readonly hooks: Hooks;
}

export function initialize(definition?: Definition, tick = 0): State {
    return {
        deck: deck.initialize(definition),
        dp: dp.initialize(definition, tick),
        slot: slot.initialize(definition),
        history: [],
        hooks: Hooks.empty(),
    };
}

export function changeDp(state: State, amount: number, tick: number): State {
    const next = dp.changeDp(state.dp, amount, tick);

    return next === state.dp ? state : { ...state, dp: next };
}
