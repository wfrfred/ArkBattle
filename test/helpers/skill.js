import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "./unit.js";
import { ref as skillRef } from "../../dist/core/unit/skill/index.js";
import { ref as activationRef } from "../../dist/core/unit/skill/activation.js";
import { initialize } from "./unit.js";
import { ref as unitRef } from "../../dist/core/unit/index.js";
import { effectFixtureWork } from "./effects.js";

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

export function fixture(input = {}, ...others) {
    const skill = definition(input);
    const unit = initialize({ id: 1, position: [0, 0], definition: { hooks: [], id: "skilled-unit", skill } });
    return { definition: skill, unit, ref: unitRef(unit), skillRef: ref(unit), state: effectFixtureWork(unit, ...others) };
}

export function at(battle, tick) { return { ...battle, tick }; }

export function setSkill(battle, skill, id = 1) {
    const unit = getUnit(battle, id);
    return updateUnit(battle, [{ ...unit, skill }]);
}

export function currentRef(battle, id = 1) {
    const unit = getUnit(battle, id);
    return activationRef(unitRef(unit), unit.skill);
}

export function ref(unit) {
    return skillRef(unitRef(unit), unit.skill.definition);
}
