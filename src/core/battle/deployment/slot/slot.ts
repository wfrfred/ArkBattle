import { assertNonnegativeSafeInteger } from "../../../common/assert.js";

export interface Definition {
    readonly slotLimit: number | null;
}

export interface PendingSlotRelease {
    readonly readyAtTick: number;
    readonly slots: number;
}

export interface State {
    readonly limit: number | null;
    readonly used: number;
    readonly pending: readonly PendingSlotRelease[];
}

export function initialize({ slotLimit }: Definition = { slotLimit: null }): State {
    if (slotLimit !== null) {
        assertNonnegativeSafeInteger(slotLimit, "deployment slot limit");
    }

    return { limit: slotLimit, used: 0, pending: [] };
}
