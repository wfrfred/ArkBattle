import type { Id as UnitId } from "../unit.js";

export type Event = {
    readonly sourceUnitId: UnitId;
    readonly tick: number;
} & (
    | { readonly type: "ATTACK_STARTED"; readonly targetUnitId: UnitId }
    | { readonly type: "ACTION_RELEASED" | "ACTION_FINISHED" | "ACTION_CANCELLED" }
);
