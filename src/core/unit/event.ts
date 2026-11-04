import type { UnitRemoval } from "./unit.js";

export type Event = {
    readonly type: "UNIT_REMOVED";
    readonly tick: number;
} & UnitRemoval;
