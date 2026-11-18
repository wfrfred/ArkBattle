// Contract: [action](../../../docs/architecture/action.md#8-普通攻击释放-hook-与移动).
import * as hpDamage from "../../../dist/core/battle/resource/hp/damage/index.js";
import { targetApplied } from "../../../dist/core/battle/resource/hp/damage/index.js";
import { update as applyUnitChanges } from "../../../dist/core/unit/operations.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import { battle, unit, actionDefinition, geometry } from "../../helpers/action-fixture.js";
import { selectDamage } from "../../helpers/targeting.js";
import * as units from "../../../dist/core/unit/query.js";
import * as actions from "../../../dist/core/unit/action/index.js";
import { advance } from "../../../dist/core/unit/action/index.js";


import { setAttackContribution } from "../../../dist/core/unit/capability/offense/capability.js";
import { create as modifier } from "../../../dist/core/common/modifier.js";

test("source attack samples current Offense separately for each target after nested reactions", () => {
    const definition = actionDefinition(1, {
        targetGroups: [{
            id: "primary",
            select: selectDamage({ geometry, canTargetAir: true, maxTargets: 2 }),
            operations: [{ type: "DAMAGE", attackType: "NORMAL", applyWay: "MELEE", powerSource: "SOURCE_ATTACK", power: 1, damageType: "TRUE" }],
        }],
    });
    const source = unit(0, { action: definition });
    const sourceRef = units.ref(source);
    const first = unit(1);
    const second = unit(2);
    const initial = battle(source, {
        ...first,
        hooks: first.hooks.set(targetApplied, {
            id: "boost-next-target", priority: 0,
            invoke(state, { request }) {
                assert.equal(request.attackType, "NORMAL");
                assert.equal(request.applyWay, "MELEE");
                return {
                    state: applyUnitChanges(state, sourceRef, setAttackContribution({
                            id: "reaction", value: [modifier({ addition: 15 })],
                        })),
                    value: undefined,
                };
            },
        }),
    }, second);
    const result = actions.start(initial, actions.ref(sourceRef, definition));
    const advanced = advance(result.state, result.value);
    assert.equal(units.get(advanced, units.ref(first)).vitality.health.hp, 90);
    assert.equal(units.get(advanced, units.ref(second)).vitality.health.hp, 75);
});

test("fixed damage and healing do not require an Offense capability", () => {
    const definition = actionDefinition(5, {
        followUps: [{ receiver: { type: "SOURCE" }, operation: { type: "HEAL", power: 5 } }],
    });
    const source = unit(0, { action: definition, offense: undefined });
    const target = unit(1);
    const sourceRef = units.ref(source);
    const wound = {
        source: null, target: sourceRef,
        attackType: "NORMAL", applyWay: "NONE", nature: "DAMAGE", hitRecovery: true, killer: null, parameters: { type: "TRUE", attack: { power: 50, multiplier: 1, addition: 0 } },
    };
    const initial = hpDamage.applyDamage(wound,
        hpDamage.calculateDamage(battle(source, target), wound)).state;
    const result = actions.start(initial, actions.ref(sourceRef, definition));
    const advanced = advance(result.state, result.value);
    assert.equal(units.get(advanced, sourceRef).vitality.health.hp, 55);
    assert.equal(units.get(advanced, units.ref(target)).vitality.health.hp, 95);
});
