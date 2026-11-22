import {
    assertFiniteNumber,
    assertNonnegativeNumber,
    assertNonnegativeSafeInteger,
    assertPositiveSafeInteger,
} from "../../common/assert.js";
import { Store } from "../../common/collection/store.js";
import type * as card from "./deck/card/card.js";
import type { Input as CardInput } from "./deck/card/initialize.js";
import type { Ref } from "../../common/ref.js";
import type { Unit } from "../../unit/unit.js";
import type { Deployable } from "../../unit/capability/deployable/capability.js";
import type { Ordering } from "./deck/order.js";
import { Hooks } from "../../hook.js";

export interface Definition {
    readonly initialDp: number;
    readonly minDp?: number;
    readonly maxDp: number;
    readonly costCeiling?: number;
    readonly dpRecoveryTicks: number | null;
    readonly slotLimit: number | null;
}

export interface Input<States extends readonly object[] = readonly object[]> {
    readonly definition: Definition;
    readonly cards: { readonly [K in keyof States]: CardInput<States[K]> };
}

export interface DeploymentRecord {
    readonly card: Ref<card.Card>;
    readonly unit: Ref<Unit & Deployable>;
}

export interface PendingSlotRelease {
    readonly readyAtTick: number;
    readonly slots: number;
}

export interface State {
    readonly definition: Definition;
    readonly cards: Store<card.Id, card.Card<any>>;
    readonly history: readonly DeploymentRecord[];
    readonly order: readonly Ref<card.Card>[];
    readonly ordering: Ordering | null;
    readonly hooks: Hooks;
    readonly usedSlots: number;
    readonly pendingSlotReleases: readonly PendingSlotRelease[];
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
        cards: Store.empty(),
        history: [],
        order: [],
        ordering: null,
        hooks: Hooks.empty(),
        usedSlots: 0,
        pendingSlotReleases: [],
        dp: definition.initialDp,
        minDp,
        dpRecoveryProgress: 0,
        lastDpRecoveryTick: tick,
    };
}

export { changeDp } from "./dp/operations.js";
