import assert from "node:assert/strict";
import { test } from "node:test";
import { unit as createUnit, workFor, request, parameters } from "../helpers/vitality.js";
import { getUnit } from "../helpers/unit.js";
import { calculateDamage } from "../../dist/core/battle/damage/calculate.js";
import { applyDamage } from "../../dist/core/battle/damage/apply.js";
import { calculateHealing } from "../../dist/core/battle/healing/calculate.js";
import { applyHealing } from "../../dist/core/battle/healing/apply.js";

const unit = (id) => createUnit(id, { hp: 200, maxHp: 1000 });
const damageRequest = (power = 40) => request(power, { parameters: parameters(power, "TRUE") });
const settle = (battle, input) => applyDamage(input, calculateDamage(battle, input));
const healingRequest = (power = 40) => ({ source: { id: 1 }, target: { id: 2 }, parameters: { power, multiplier: 1 } });
const heal = (battle, input) => applyHealing(input, calculateHealing(battle, input));

test("settlement invariants: initial zero damage is rejected while zero and negative source healing remain normalized", () => {
    let battle = workFor(unit(1), unit(2));
    const damaged = settle(battle, damageRequest(0));
    battle = damaged.state;
    const healed = heal(battle, healingRequest(0));
    battle = healed.state;
    const normalized = heal(battle, healingRequest(-10));
    battle = normalized.state;
    assert.deepEqual(damaged.value, { kind: "REJECTED" });
    assert.equal(healed.value.application.hpGain, 0);
    assert.equal(normalized.value.application.hpGain, 0);
    assert.equal(getUnit(battle, 2).vitality.hp, 200);
});
