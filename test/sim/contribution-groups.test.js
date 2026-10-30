import { set as setFixtureEntry } from "../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import { resolveDefense } from "../../dist/core/unit/capability/vitality/query.js";
import { getUnit, initialize } from "../helpers/unit.js";
import { ref as unitRef } from "../../dist/core/unit/query.js";
import assert from "node:assert/strict";
import { test } from "node:test";


import {
    setAttackContribution,
    removeAttackContribution,
} from "../../dist/core/unit/capability/offense/capability.js";

import { resolveAttack } from "../../dist/core/unit/capability/offense/query.js";
import { create } from "../../dist/core/unit/contribution/attribute.js";
import { effectFixtureWork } from "../helpers/effects.js";
const base = (id) =>
    initialize({
        id,
        position: [0, 0],
        definition: { hooks: [],
            id: `unit-${id}`,
            offense: { attack: 100 },
            vitality: { maxHp: 100, defense: 0, resistance: 0 },
        },
    });
const entry = (id, amount, priority) => ({
    id,
    value: [create({ finalAddition: amount })],
    group: { id: "inspiration", priority },
});
test("attribute selection keeps weaker candidates while independent attributes stack", () => {
    let unit = ({ ...base(1), offense: { ...base(1).offense, attack: setFixtureEntry((base(1).offense)["attack"], entry("a", 300, 0.3)) } });
    unit = ({ ...unit, offense: { ...unit.offense, attack: setFixtureEntry(unit.offense.attack, entry("b", 60, 0.6)) } });
    unit = ({ ...unit, vitality: { ...unit.vitality, defense: setFixtureEntry(unit.vitality.defense, { id: "a", value: [create({ finalAddition: 10 })] }) } });
    unit = ({ ...unit, vitality: { ...unit.vitality, defense: setFixtureEntry(unit.vitality.defense, { id: "b", value: [create({ finalAddition: 20 })] }) } });
    let battle = effectFixtureWork(unit);
    const before = battle;
    assert.equal(resolveAttack(before, unitRef(getUnit(before, 1))), 160);
    const current = getUnit(before, 1);
    assert.equal(resolveDefense(before, unitRef(current)).defense, 30);
    const currentUnit = getUnit(battle, 1);
    battle = applyUnitChanges(battle, [removeAttackContribution({ id: currentUnit.id }, "b")]);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 400);
    assert.equal(resolveAttack(before, unitRef(getUnit(before, 1))), 160);
});
test("dynamic values read current sources while selection changes explicitly", () => {
    const sourceA = base(2);
    const sourceB = base(3);
    const dynamic = (id, source, coefficient) => ({
        id,
        group: { id: "inspiration", priority: coefficient },
        value: (battle) => [
            create({ finalAddition: resolveAttack(battle, source) * coefficient }),
        ],
    });
    let unit = ({ ...base(1), offense: { ...base(1).offense, attack: setFixtureEntry((base(1).offense)["attack"], dynamic("a", unitRef(sourceA), 0.3)) } });
    unit = ({ ...unit, offense: { ...unit.offense, attack: setFixtureEntry(unit.offense.attack, dynamic("b", unitRef(sourceB), 0.6)) } });
    let battle = effectFixtureWork(unit, sourceA, sourceB);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 160);
    const currentUnit2 = getUnit(battle, 3);
    battle = applyUnitChanges(battle, [setAttackContribution({ id: currentUnit2.id }, { id: "source", value: [create({ finalAddition: 100 })] })]);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 220);
    const before = battle;
    const currentUnit3 = getUnit(battle, 1);
    battle = applyUnitChanges(battle, [setAttackContribution({ id: currentUnit3.id }, dynamic("a", unitRef(sourceA), 0.7))]);
    assert.equal(resolveAttack(battle, unitRef(getUnit(battle, 1))), 170);
    assert.equal(resolveAttack(before, unitRef(getUnit(before, 1))), 220);
});
