import { initialize } from "../../dist/core/battle/index.js";
import { createLegacyCombatSpec } from "../../dist/legacy/combat.js";

export function createLegacyCombatBattle(options) {
    return initialize(createLegacyCombatSpec(options));
}
