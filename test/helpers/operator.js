import { fromTables } from "../../dist/data/unit/operator.js";
import fixture from "../fixtures/arknights/main-mode-units.json" with { type: "json" };

export const tables = fromTables(fixture);
