import type { EndReason, Id, Unit } from "./unit.js";

export interface Event {
    readonly type: "UNIT_REMOVED";
    readonly tick: number;
    readonly unitId: Id;
    readonly reason: EndReason;
    readonly unit: Unit;
}
