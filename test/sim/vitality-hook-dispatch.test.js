import assert from "node:assert/strict";
import { test } from "node:test";


import { calculateDamage } from "../../dist/core/battle/damage/calculate.js";

import { replace as updateUnit } from "../../dist/core/battle/unit.js";
import { getUnit } from "../helpers/unit.js";
import { initialize } from "../helpers/unit.js";
import { effectFixtureWork } from "../helpers/effects.js";

const hook = (id, invoke, priority = 0, accepts = () => true, stage = "receiving") => ({ id, stage, priority, accepts, invoke });
const setVitality = (battle, vitality) => {
    const unit = getUnit(battle, 0);
    return updateUnit(battle, [{ ...unit, vitality }]);
};
function fixture(domain, hooks) {
    const unit = initialize({ id: 0, position: [0, 0], definition: { hooks: [], id: "receiver", vitality: { maxHp: 100, defense: 0, resistance: 0 } } });
    return setVitality(effectFixtureWork(unit), { ...unit.vitality, hp: 50, [`${domain}Hooks`]: hooks });
}
const input = source => ({
    source, target: { id: 0 }, parameters: { type: "TRUE", attack: { power: 1, multiplier: 1, addition: 0 } },
});

test("source and target Formula Hooks thread Parameters while the original Request remains fixed", () => {
    const seen = [];
    const request = input({ id: 0 });
    const initial = fixture("damage", [
        hook("source", (battle, context, current) => {
            seen.push(["source", context === request]);
            return { state: battle, value: { ...current, attack: { ...current.attack, power: 7 } } };
        }, 10, () => true, "sourceFormula"),
        hook("source-next", (battle, context, current) => {
            seen.push(["source-next", context === request, current.attack.power]);
            return { state: battle, value: { ...current, attack: { ...current.attack, power: current.attack.power + 1 } } };
        }, 0, () => true, "sourceFormula"),
        hook("target", (battle, context, current) => {
            seen.push(["target", context === request, current.attack.power]);
            return { state: battle, value: { ...current, attack: { ...current.attack, power: current.attack.power + 2 } } };
        }, 0, () => true, "targetFormula"),
    ]);
    const result = calculateDamage(initial, request);
    assert.deepEqual(seen, [["source", true], ["source-next", true, 7], ["target", true, 8]]);
    assert.deepEqual(result.value, { type: "TRUE", amount: 10 });
    assert.equal(request.parameters.attack.power, 1);
    assert.equal(getUnit(result.state, 0).vitality.hp, 50);
});
