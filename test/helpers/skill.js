import { ref as skillRef } from "../../dist/core/unit/capability/skill/index.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { attribute } from "./attribute.js";

export function definition(input = {}) {
    return ({
        id: "skill-fixture",
        initialize: battle => ({ state: battle, value: {} }),
        sp: {
            initial: 2, capacity: 2,
            recovery: { type: "TIME" },
            recoverySpeed: attribute(1),
            recoveryMultiplier: attribute(1),
        },
        activation: {
            trigger: "MANUAL", ignoreRestrictions: [], requirement: 2, cost: 2, initialize: () => ({ state: {}, duration: { type: "TIME", durationTicks: 30 } }),
        },
        ...input,
    });
}

export function ref(unit) {
    return skillRef(unitRef(unit));
}
