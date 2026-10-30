import { set as setFixtureEntry } from "../../dist/core/hook.js";
import { update as applyUnitChanges } from "../../dist/core/battle/unit.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit, actionDefinition, geometry } from "../helpers/action-fixture.js";
import { damage } from "../helpers/targeting.js";
import * as units from "../../dist/core/unit/query.js";
import * as actions from "../../dist/core/unit/action/index.js";
import { advance } from "../../dist/core/unit/action/index.js";


import { setAttackContribution } from "../../dist/core/unit/capability/offense/capability.js";
import { create as modifier } from "../../dist/core/unit/contribution/attribute.js";

test("source attack samples current Offense separately for each target after nested reactions", () => {
    const definition = actionDefinition(1, {
        targetGroups: [{
            id: "primary",
            targeting: damage({ geometry, canTargetAir: true, maxTargets: 2 }),
            operations: [{ type: "DAMAGE", powerSource: "SOURCE_ATTACK", power: 1, damageType: "TRUE" }],
        }],
    });
    const source = unit(0, { action: definition });
    const sourceRef = units.ref(source);
    const first = unit(1);
    const second = unit(2);
    const initial = battle(source, {
        ...first,
        vitality: { ...first.vitality, damageHooks: setFixtureEntry(first.vitality.damageHooks, {
            id: "boost-next-target", stage: "hpApplied", priority: 0,
            invoke(state) {
                const current = units.get(state, sourceRef);
                return {
                    state: applyUnitChanges(state, [setAttackContribution({ id: current.id }, {
                            id: "reaction", value: [modifier({ addition: 15 })],
                        })]),
                    value: undefined,
                };
            },
        }) },
    }, second);
    const result = actions.start(initial, actions.ref(sourceRef, definition));
    const advanced = advance(result.state, result.value.ref);
    assert.equal(result.value.type, "STARTED");
    assert.equal(units.get(advanced, units.ref(first)).vitality.hp, 90);
    assert.equal(units.get(advanced, units.ref(second)).vitality.hp, 75);
    assert.equal(units.get(initial, sourceRef).offense.attack.length, 0);
});

test("fixed damage and healing do not require an Offense capability", () => {
    const definition = actionDefinition(5, {
        followUps: [{ receiver: { type: "SOURCE" }, operation: { type: "HEAL", power: 5 } }],
    });
    const source = unit(0, { action: definition, offense: undefined });
    const target = unit(1);
    const sourceRef = units.ref(source);
    const initial = battle({ ...source, vitality: { ...source.vitality, hp: 50 } }, target);
    const result = actions.start(initial, actions.ref(sourceRef, definition));
    const advanced = advance(result.state, result.value.ref);
    assert.equal(result.value.type, "STARTED");
    assert.equal(units.get(advanced, sourceRef).vitality.hp, 55);
    assert.equal(units.get(advanced, units.ref(target)).vitality.hp, 95);
});
