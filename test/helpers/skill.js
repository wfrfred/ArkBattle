import { ref as skillRef } from "../../dist/core/unit/skill/index.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";

export function definition(input = {}) {
    return ({
        id: "skill-fixture",
        initialize: battle => ({ state: battle, value: {} }),
        sp: {
            initial: 2, capacity: 2, requirement: 2, cost: 2,
            recovery: { type: "TIME", intervalTicks: 30 },
        },
        activation: {
            trigger: "MANUAL", sustain: { type: "TIME", durationTicks: 30 },
            initialize: () => ({}),
        },
        ...input,
    });
}

export function ref(unit) {
    return skillRef(unitRef(unit), unit.skill.definition);
}
