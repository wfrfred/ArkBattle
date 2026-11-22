import type * as card from "./deck/card/card.js";
import type { Input as CardInput } from "./deck/card/initialize.js";
import * as deck from "./deck/deck.js";
import * as dp from "./dp/dp.js";
import * as slot from "./slot/slot.js";
import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import { Hooks } from "../../hook.js";

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
    readonly hooks: Hooks;
}

export function initialize(definition?: Definition): State {
    return {
        deck: deck.initialize(definition),
        dp: dp.initialize(definition?.dp),
        slot: slot.initialize(definition?.slot),
        history: [],
        hooks: Hooks.empty(),
    };
}
