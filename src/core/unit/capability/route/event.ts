import type { Id as UnitId } from "../../unit.js";

export interface Event {
    readonly type: "ROUTE_COMPLETED";
    readonly unitId: UnitId;
    readonly tick: number;
}
