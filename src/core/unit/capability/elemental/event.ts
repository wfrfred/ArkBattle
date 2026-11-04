import type { WorldPosition } from "../../../geometry/coordinate.js";
import type { Id } from "../../unit.js";
import type { Type } from "./capability.js";

export interface Event {
    readonly type: "ELEMENTAL_BURST";
    readonly unitId: Id;
    readonly elementType: Type;
    readonly position: WorldPosition;
    readonly tick: number;
}
