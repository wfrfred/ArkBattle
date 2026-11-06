import type { Direction } from "../../../geometry/direction.js";
import { createChange, type Change } from "../../change.js";
import type { Unit } from "../../unit.js";
import type { Occupancy } from "./capability.js";

export function setDirection(direction: Direction): Change<Unit & Occupancy> {
    return createChange<Unit & Occupancy>((unit) =>
        unit.occupancy.direction === direction
            ? unit
            : { ...unit, occupancy: { ...unit.occupancy, direction } },
    );
}
