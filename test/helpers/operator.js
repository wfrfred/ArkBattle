import { fromTables } from "../../dist/data/unit/operator.js";
import fixture from "../fixtures/arknights/main-mode-units.json" with { type: "json" };

export const rawTables = {
    characters: fixture.characters,
    skills: fixture.skills,
    ranges: fixture.ranges,
    equipment: { equipDict: fixture.equipment },
    battleEquipment: fixture.battleEquipment,
    favor: fixture.favor,
};

export const tables = fromTables(rawTables);
