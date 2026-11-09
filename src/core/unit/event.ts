import type { Id, LeaveReason, Unit } from "./unit.js";

export interface Event {
    readonly type: "UNIT_REMOVED";
    readonly tick: number;
    readonly unitId: Id;
    readonly reason: LeaveReason;
    readonly unit: Unit;
}
