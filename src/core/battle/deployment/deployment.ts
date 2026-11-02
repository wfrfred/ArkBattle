import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../common/assert.js";
import type * as card from "./card/card.js";
import type { Ref } from "../../common/ref.js";
import type { Ordering } from "./order.js";
import type { Hook } from "./hook.js";

export interface Definition {
    readonly initialDp: number;
    readonly minDp?: number;
    readonly maxDp: number;
    readonly costCeiling?: number;
    readonly dpRecoveryTicks: number | null;
    readonly slotLimit: number | null;
}

export interface Input {
    readonly definition: Definition;
    readonly cards: readonly card.UnitDefinition<any>[];
}

export interface State {
    readonly definition: Definition;
    readonly cards: readonly card.Card[];
    readonly order: readonly Ref<card.Card>[];
    readonly ordering: Ordering | null;
    readonly hooks: readonly Hook[];
    readonly usedSlots: number;
    readonly dp: number;
    readonly minDp: number;
    readonly dpRecoveryProgress: number;
    readonly lastDpRecoveryTick: number;
}

const emptyDefinition: Definition = {
    initialDp: 0,
    maxDp: 99,
    dpRecoveryTicks: null,
    slotLimit: null,
};

export function initialize(definition: Definition = emptyDefinition, tick = 0): State {
    assertFiniteNumber(definition.initialDp, "initial deployment points");
    const minDp = definition.minDp ?? 0;
    assertFiniteNumber(minDp, "deployment point minimum");
    assertNonnegativeNumber(definition.maxDp, "deployment point limit");
    assertNonnegativeNumber(definition.costCeiling ?? 99, "deployment cost ceiling");

    if (minDp > definition.maxDp) {
        throw new RangeError("deployment point minimum exceeds the limit");
    }
    if (definition.initialDp < minDp || definition.initialDp > definition.maxDp) {
        throw new RangeError("initial deployment points are outside the account limits");
    }
    if (definition.dpRecoveryTicks !== null) {
        assertPositiveSafeInteger(definition.dpRecoveryTicks, "deployment point recovery interval");
    }
    if (definition.slotLimit !== null) {
        assertNonnegativeSafeInteger(definition.slotLimit, "deployment slot limit");
    }

    return {
        definition,
        cards: [],
        order: [],
        ordering: null,
        hooks: [],
        usedSlots: 0,
        dp: definition.initialDp,
        minDp,
        dpRecoveryProgress: 0,
        lastDpRecoveryTick: tick,
    };
}

export { changeDp } from "./dp.js";
