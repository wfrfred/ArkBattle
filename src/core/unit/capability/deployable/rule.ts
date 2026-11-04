import type { Unit } from "../../unit.js";
import { createRegistrationOperations } from "../../registration.js";
import type { Deployable, Rules } from "./capability.js";

export const { set: setRule, remove: removeRule } = createRegistrationOperations<
    Unit & Deployable,
    "deployable",
    keyof Rules
>("deployable", "retreatRules");
