import type { Id as UnitId } from "../unit.js";

export interface Event {
    readonly type: "SKILL_ACTIVATED" | "SKILL_FINISHED";
    readonly unitId: UnitId;
    readonly tick: number;
}
