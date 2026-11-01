import type { Ref } from "../../../common/ref.js";
import type { Direction } from "../../../geometry/direction.js";
import { createChange, type Change } from "../../change.js";
import type { Unit } from "../../unit.js";
import type { Occupancy } from "./capability.js";

export function setDirection(reference: Ref<Unit & Occupancy>, direction: Direction): Change {
    return createChange(reference, (unit) =>
        unit.occupancy.direction === direction
            ? unit
            : { ...unit, occupancy: { ...unit.occupancy, direction } },
    );
}
